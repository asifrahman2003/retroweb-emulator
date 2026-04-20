import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Analytics } from '@vercel/analytics/react';
import { loadVM } from './wasm/loadVM';
import { assembleProgram } from './assembler';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import AppSidebar from './components/AppSidebar';
import LandingPage from './pages/LandingPage';
import DashboardPage from './pages/DashboardPage';
import WorkspacePage from './pages/WorkspacePage';
import LessonsPage from './pages/LessonsPage';
import LabsPage from './pages/LabsPage';
import ReportsPage from './pages/ReportsPage';
import ProgramsPage from './pages/ProgramsPage';
import ProgressPage from './pages/ProgressPage';
import DocsPage from './pages/DocsPage';
import InstructorPage from './pages/InstructorPage';
import SettingsPage from './pages/SettingsPage';
import {
  retroArchitectureProfile,
  retroChallenges,
  retroExamples,
} from './educationContent';
import { evaluateChallenge } from './challengeValidator';
import {
  loadChallengeProgress,
  loadSavedPrograms,
  loadWorkspaceState,
  saveChallengeProgress,
  saveSavedPrograms,
  saveWorkspaceState,
} from './persistence';
import {
  MEM_SIZE,
  NUM_REGS,
  VM_ERROR_NONE,
  describeVmError,
  readVmRuntimeState,
} from './vmLayout';
import {
  PLATFORM_NAME,
  flattenNavigation,
  getRouteFromHash,
  platformNavigation,
} from './platformContent';

const DEMO_PROGRAM = `LOAD R1 5
ADD R2 R1 R1
PRINT R2
HALT`;

const DEFAULT_EXAMPLE_ID = retroExamples[0]?.id ?? '';
const DEFAULT_CHALLENGE_ID = retroChallenges[0]?.id ?? '';
const primaryNavigationLinks = ['landing', 'dashboard', 'workspace', 'lessons', 'labs', 'docs'];
const routeLookup = Object.fromEntries(flattenNavigation().map((route) => [route.id, route]));

function hasSelection(entries, selectionId) {
  return entries.some((entry) => entry.id === selectionId);
}

function createProgramKey(source, assemblyMode) {
  return `${assemblyMode ? 'asm' : 'raw'}:${source}`;
}

function getInitialWorkspace() {
  const storedWorkspace = loadWorkspaceState() ?? {};

  return {
    input: typeof storedWorkspace.input === 'string' ? storedWorkspace.input : DEMO_PROGRAM,
    isAssembly:
      typeof storedWorkspace.isAssembly === 'boolean' ? storedWorkspace.isAssembly : true,
    selectedExampleId: hasSelection(retroExamples, storedWorkspace.selectedExampleId)
      ? storedWorkspace.selectedExampleId
      : DEFAULT_EXAMPLE_ID,
    selectedChallengeId: hasSelection(retroChallenges, storedWorkspace.selectedChallengeId)
      ? storedWorkspace.selectedChallengeId
      : DEFAULT_CHALLENGE_ID,
  };
}

function createSavedProgramId() {
  if (typeof globalThis.crypto?.randomUUID === 'function') {
    return globalThis.crypto.randomUUID();
  }

  return `program-${Date.now()}-${Math.random().toString(16).slice(2, 8)}`;
}

function readRegisters(vmInstance) {
  return Array.from({ length: NUM_REGS }, (_, index) => vmInstance._get_register(index));
}

function readMemorySnapshot(vmInstance) {
  const ptr = vmInstance._get_memory();
  return vmInstance.HEAPU8.slice(ptr, ptr + MEM_SIZE);
}

function formatRegisterDump(registerValues) {
  return registerValues.map((value, index) => `R${index} = ${value}`).join('\n');
}

function loadBytesIntoVm(vmInstance, bytes) {
  if (bytes.length > MEM_SIZE) {
    throw new Error(`Program is too large for VM memory (${bytes.length}/${MEM_SIZE} bytes)`);
  }

  const ptr = vmInstance._get_memory();
  const heap = vmInstance.HEAPU8;

  heap.fill(0, ptr, ptr + MEM_SIZE);
  heap.set(bytes, ptr);
  vmInstance._set_program_length?.(bytes.length);
  vmInstance._reset_vm();
}

function parseRawBytes(input) {
  const tokens = input.trim().split(/\s+/).filter(Boolean);

  if (tokens.length === 0) {
    return [];
  }

  return tokens.map((token) => {
    const value = /^0x[0-9a-f]+$/i.test(token) ? parseInt(token, 16) : Number(token);

    if (!Number.isInteger(value) || value < 0 || value > 255) {
      throw new Error(`Invalid byte value: ${token}`);
    }

    return value;
  });
}

function buildProgram(input, isAssembly) {
  if (isAssembly) {
    const assembled = assembleProgram(input);
    return {
      bytes: Uint8Array.from(assembled.bytecode),
      sourceMap: assembled.sourceMap,
    };
  }

  return {
    bytes: Uint8Array.from(parseRawBytes(input)),
    sourceMap: {},
  };
}

function App() {
  const initialWorkspaceRef = useRef(getInitialWorkspace());
  const initialWorkspace = initialWorkspaceRef.current;
  const vmLogBufferRef = useRef([]);
  const [activeRoute, setActiveRoute] = useState(() =>
    getRouteFromHash(globalThis.location?.hash ?? ''),
  );
  const [vmInstance, setVmInstance] = useState(null);
  const [input, setInput] = useState(initialWorkspace.input);
  const [isAssembly, setIsAssembly] = useState(initialWorkspace.isAssembly);
  const [consoleOutput, setConsoleOutput] = useState('');
  const [easterEggActive, setEasterEggActive] = useState(false);
  const [executionVersion, setExecutionVersion] = useState(0);
  const [programBytes, setProgramBytes] = useState(new Uint8Array());
  const [editor, setEditor] = useState(null);
  const [monaco, setMonaco] = useState(null);
  const [sourceMap, setSourceMap] = useState({});
  const [registerValues, setRegisterValues] = useState(Array(NUM_REGS).fill(0));
  const [memorySnapshot, setMemorySnapshot] = useState(new Uint8Array(MEM_SIZE));
  const [currentPc, setCurrentPc] = useState(0);
  const [vmRuntimeState, setVmRuntimeState] = useState({
    halted: false,
    lastError: VM_ERROR_NONE,
  });
  const [loadedProgramKey, setLoadedProgramKey] = useState('');
  const [selectedExampleId, setSelectedExampleId] = useState(initialWorkspace.selectedExampleId);
  const [selectedChallengeId, setSelectedChallengeId] = useState(
    initialWorkspace.selectedChallengeId,
  );
  const [challengeBaselineVersion, setChallengeBaselineVersion] = useState(0);
  const [challengeResult, setChallengeResult] = useState(null);
  const [savedPrograms, setSavedPrograms] = useState(() => loadSavedPrograms());
  const [selectedSavedProgramId, setSelectedSavedProgramId] = useState('');
  const [savedProgramName, setSavedProgramName] = useState('');
  const [challengeProgress, setChallengeProgress] = useState(() => loadChallengeProgress());

  useEffect(() => {
    const handleHashChange = () => {
      setActiveRoute(getRouteFromHash(window.location.hash));
    };

    window.addEventListener('hashchange', handleHashChange);
    handleHashChange();

    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, []);

  useEffect(() => {
    saveWorkspaceState({
      input,
      isAssembly,
      selectedExampleId,
      selectedChallengeId,
    });
  }, [input, isAssembly, selectedExampleId, selectedChallengeId]);

  useEffect(() => {
    saveSavedPrograms(savedPrograms);
  }, [savedPrograms]);

  useEffect(() => {
    saveChallengeProgress(challengeProgress);
  }, [challengeProgress]);

  useEffect(() => {
    let cancelled = false;
    let script = null;

    const initializeVm = async () => {
      try {
        const Module = await loadVM({
          print: (line = '') => {
            vmLogBufferRef.current.push(String(line));
          },
          printErr: (line = '') => {
            vmLogBufferRef.current.push(String(line));
          },
        });

        if (cancelled) {
          return;
        }

        let initialProgram;
        let startingInput = initialWorkspace.input;
        let startingMode = initialWorkspace.isAssembly;
        let startupMessage = '';

        try {
          initialProgram = buildProgram(startingInput, startingMode);
        } catch (error) {
          startingInput = DEMO_PROGRAM;
          startingMode = true;
          initialProgram = buildProgram(startingInput, startingMode);
          startupMessage = `⚠️ Restored workspace reset to the demo program: ${error.message}`;
        }

        setVmInstance(Module);
        setInput(startingInput);
        setIsAssembly(startingMode);
        setSourceMap(initialProgram.sourceMap);
        setProgramBytes(initialProgram.bytes);
        loadBytesIntoVm(Module, initialProgram.bytes);
        setLoadedProgramKey(createProgramKey(startingInput, startingMode));
        setConsoleOutput(startupMessage);
        setRegisterValues(readRegisters(Module));
        setMemorySnapshot(readMemorySnapshot(Module));
        setCurrentPc(Module._get_pc());
        setVmRuntimeState(readVmRuntimeState(Module));
        setExecutionVersion((value) => value + 1);
      } catch (error) {
        if (!cancelled) {
          setConsoleOutput(`❌ VM failed to load: ${error.message}`);
        }
      }
    };

    if (window.createVM) {
      initializeVm();
    } else {
      script = document.createElement('script');
      script.src = '/vm.js';
      script.async = true;
      script.onload = initializeVm;
      script.onerror = () => {
        if (!cancelled) {
          setConsoleOutput('❌ Failed to load VM runtime.');
        }
      };
      document.body.appendChild(script);
    }

    return () => {
      cancelled = true;
      if (script?.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, [initialWorkspace.input, initialWorkspace.isAssembly]);

  const programKey = createProgramKey(input, isAssembly);
  const programDirty = programKey !== loadedProgramKey;
  const selectedChallenge =
    retroChallenges.find((challenge) => challenge.id === selectedChallengeId) ?? retroChallenges[0];
  const completedChallengesCount = retroChallenges.filter(
    (challenge) => challengeProgress[challenge.id]?.passed,
  ).length;

  const syncVmPanels = ({ module = vmInstance, logs = '', appendLogs = false, resetLogs = false } = {}) => {
    if (!module) {
      return;
    }

    const trimmedLogs = logs.trim();
    if (resetLogs) {
      setConsoleOutput(trimmedLogs);
    } else if (trimmedLogs) {
      setConsoleOutput((previous) => (
        appendLogs && previous ? `${previous}\n${trimmedLogs}` : trimmedLogs
      ));
    }

    setRegisterValues(readRegisters(module));
    setMemorySnapshot(readMemorySnapshot(module));
    setCurrentPc(module._get_pc());
    setVmRuntimeState(readVmRuntimeState(module));
    setExecutionVersion((value) => value + 1);
  };

  const executeVmAction = (action) => {
    vmLogBufferRef.current.length = 0;

    try {
      action();
      return {
        logs: vmLogBufferRef.current.join('\n').trim(),
        error: null,
      };
    } catch (error) {
      return {
        logs: vmLogBufferRef.current.join('\n').trim(),
        error,
      };
    }
  };

  const prepareProgram = ({ resetLogs = false, clearConsole = false } = {}) => {
    if (!vmInstance) {
      return { ok: false, reason: 'VM not ready.' };
    }

    let builtProgram;
    try {
      builtProgram = buildProgram(input, isAssembly);
    } catch (error) {
      setConsoleOutput(`❌ ${isAssembly ? 'Assembly' : 'Input'} Error: ${error.message}`);
      return { ok: false, reason: error.message };
    }

    try {
      loadBytesIntoVm(vmInstance, builtProgram.bytes);
    } catch (error) {
      setConsoleOutput(`❌ Program Load Error: ${error.message}`);
      return { ok: false, reason: error.message };
    }

    setSourceMap(builtProgram.sourceMap);
    setProgramBytes(builtProgram.bytes);
    setLoadedProgramKey(programKey);
    syncVmPanels({
      module: vmInstance,
      resetLogs: clearConsole || resetLogs,
      logs: '',
    });

    return {
      ok: true,
      bytes: builtProgram.bytes,
      sourceMap: builtProgram.sourceMap,
    };
  };

  const navigateTo = (routeId) => {
    const nextRoute = routeLookup[routeId] ? routeId : 'landing';
    const nextHash = `#/${nextRoute}`;

    if (window.location.hash === nextHash) {
      setActiveRoute(nextRoute);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    window.location.hash = nextHash;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const loadProgramIntoEditor = ({
    code,
    assemblyMode = true,
    selectedSavedId = '',
    programName = '',
  }) => {
    setInput(code);
    setIsAssembly(assemblyMode);
    setConsoleOutput('');
    setLoadedProgramKey('');
    setChallengeResult(null);
    setChallengeBaselineVersion(executionVersion);
    setSelectedSavedProgramId(selectedSavedId);
    setSavedProgramName(programName);
  };

  const openExampleInWorkspace = (example) => {
    setSelectedExampleId(example.id);
    loadProgramIntoEditor({
      code: example.code,
      assemblyMode: example.assemblyMode ?? true,
    });
    navigateTo('workspace');
  };

  const openChallengeInWorkspace = (challenge) => {
    setSelectedChallengeId(challenge.id);
    loadProgramIntoEditor({
      code: challenge.starterCode,
      assemblyMode: challenge.assemblyMode ?? true,
    });
    navigateTo('workspace');
  };

  const handleRunVM = () => {
    if (!vmInstance?._run_vm) {
      setConsoleOutput('❌ VM not ready.');
      return;
    }

    if (input.trim().toUpperCase() === 'HALT\nHALT') {
      setEasterEggActive(true);
      setTimeout(() => setEasterEggActive(false), 4000);
      return;
    }

    const prepared = prepareProgram({ resetLogs: true, clearConsole: true });
    if (!prepared.ok) {
      return;
    }

    const { logs, error } = executeVmAction(() => {
      vmInstance._run_vm();
    });

    if (error) {
      syncVmPanels({
        module: vmInstance,
        logs: [logs, `❌ Runtime Error: ${error.message}`].filter(Boolean).join('\n'),
        resetLogs: true,
      });
      return;
    }

    syncVmPanels({ module: vmInstance, logs, resetLogs: true });
  };

  const handleEditorChange = (value) => {
    setInput(value || '');
    setConsoleOutput('');
    setChallengeResult(null);
    setChallengeBaselineVersion(executionVersion);
  };

  const handleAssemblyModeChange = () => {
    setIsAssembly((currentValue) => !currentValue);
    setConsoleOutput('');
    setChallengeResult(null);
    setChallengeBaselineVersion(executionVersion);
    setLoadedProgramKey('');
  };

  const handleClearCode = () => {
    setInput('');
    setConsoleOutput('');
    setLoadedProgramKey('');
    setChallengeResult(null);
    setChallengeBaselineVersion(executionVersion);
  };

  const handleSaveProgram = () => {
    const programName = savedProgramName.trim() || `Saved Program ${savedPrograms.length + 1}`;
    const existingProgram =
      savedPrograms.find((program) => program.id === selectedSavedProgramId) ?? null;
    const programId = existingProgram?.id ?? createSavedProgramId();
    const nextProgram = {
      id: programId,
      name: programName,
      code: input,
      isAssembly,
      savedAt: new Date().toISOString(),
    };

    setSavedPrograms((previousPrograms) => {
      const existingIndex = previousPrograms.findIndex((program) => program.id === programId);
      if (existingIndex === -1) {
        return [nextProgram, ...previousPrograms];
      }

      const nextPrograms = [...previousPrograms];
      nextPrograms[existingIndex] = nextProgram;
      return nextPrograms;
    });

    setSelectedSavedProgramId(programId);
    setSavedProgramName(programName);
  };

  const handleSelectSavedProgram = (programId) => {
    setSelectedSavedProgramId(programId);
    const nextProgram = savedPrograms.find((program) => program.id === programId);
    if (nextProgram) {
      setSavedProgramName(nextProgram.name);
    } else {
      setSavedProgramName('');
    }
  };

  const handleLoadSavedProgram = (programId = selectedSavedProgramId) => {
    const nextProgram = savedPrograms.find((program) => program.id === programId);
    if (!nextProgram) {
      return;
    }

    loadProgramIntoEditor({
      code: nextProgram.code,
      assemblyMode: nextProgram.isAssembly,
      selectedSavedId: nextProgram.id,
      programName: nextProgram.name,
    });
  };

  const openSavedProgramInWorkspace = (programId) => {
    handleLoadSavedProgram(programId);
    navigateTo('workspace');
  };

  const handleDeleteSavedProgram = (programId = selectedSavedProgramId) => {
    setSavedPrograms((previousPrograms) =>
      previousPrograms.filter((program) => program.id !== programId),
    );

    if (programId === selectedSavedProgramId) {
      setSelectedSavedProgramId('');
      setSavedProgramName('');
    }
  };

  useEffect(() => {
    if (!selectedSavedProgramId) {
      return;
    }

    if (!savedPrograms.some((program) => program.id === selectedSavedProgramId)) {
      setSelectedSavedProgramId('');
      setSavedProgramName('');
    }
  }, [savedPrograms, selectedSavedProgramId]);

  useEffect(() => {
    if (!selectedChallenge || executionVersion <= challengeBaselineVersion) {
      return;
    }

    setChallengeResult(
      evaluateChallenge(selectedChallenge, {
        registerValues,
        memorySnapshot,
        vmRuntimeState,
      }),
    );
  }, [
    challengeBaselineVersion,
    executionVersion,
    memorySnapshot,
    registerValues,
    selectedChallenge,
    vmRuntimeState,
  ]);

  useEffect(() => {
    if (!selectedChallenge || !challengeResult?.passed) {
      return;
    }

    setChallengeProgress((previousProgress) => {
      const nextCompletion = {
        passed: true,
        completedAt:
          previousProgress[selectedChallenge.id]?.completedAt ?? new Date().toISOString(),
        summary: challengeResult.summary,
      };

      if (
        previousProgress[selectedChallenge.id]?.passed &&
        previousProgress[selectedChallenge.id]?.summary === nextCompletion.summary
      ) {
        return previousProgress;
      }

      return {
        ...previousProgress,
        [selectedChallenge.id]: nextCompletion,
      };
    });
  }, [challengeResult, selectedChallenge]);

  const renderedOutput = consoleOutput
    ? `${consoleOutput}\n\n${formatRegisterDump(registerValues)}`
    : formatRegisterDump(registerValues);
  const vmStatusLabel = !vmInstance
    ? 'Loading...'
    : vmRuntimeState.lastError !== VM_ERROR_NONE
      ? `Error: ${describeVmError(vmRuntimeState.lastError)}`
      : vmRuntimeState.halted
        ? 'Halted'
        : 'Ready';
  const vmStatusClassName = !vmInstance
    ? 'text-[var(--accent)]'
    : vmRuntimeState.lastError !== VM_ERROR_NONE
      ? 'text-rose-400'
      : vmRuntimeState.halted
        ? 'text-yellow-300'
        : 'text-emerald-300';
  const activeRouteMeta = routeLookup[activeRoute] ?? routeLookup.landing;
  const topNavigationLinks = primaryNavigationLinks
    .map((routeId) => routeLookup[routeId])
    .filter(Boolean);
  const learningPanelProps = {
    profile: retroArchitectureProfile,
    examples: retroExamples,
    challenges: retroChallenges,
    selectedExampleId,
    selectedChallengeId,
    selectedSavedProgramId,
    savedProgramName,
    savedPrograms,
    challengeProgress,
    completedChallengesCount,
    onSelectExample: setSelectedExampleId,
    onLoadExample: openExampleInWorkspace,
    onSelectChallenge: (challengeId) => {
      setSelectedChallengeId(challengeId);
      setChallengeResult(null);
      setChallengeBaselineVersion(executionVersion);
    },
    onLoadChallenge: openChallengeInWorkspace,
    onSelectSavedProgram: handleSelectSavedProgram,
    onSavedProgramNameChange: setSavedProgramName,
    onSaveProgram: handleSaveProgram,
    onLoadSavedProgram: handleLoadSavedProgram,
    onDeleteSavedProgram: handleDeleteSavedProgram,
    challengeResult,
  };

  let pageContent = null;

  if (activeRoute === 'landing') {
    pageContent = <LandingPage onNavigate={navigateTo} />;
  } else if (activeRoute === 'dashboard') {
    pageContent = (
      <DashboardPage
        savedPrograms={savedPrograms}
        challengeProgress={challengeProgress}
        completedChallengesCount={completedChallengesCount}
        totalChallenges={retroChallenges.length}
        totalExamples={retroExamples.length}
        vmStatusLabel={vmStatusLabel}
        onNavigate={navigateTo}
      />
    );
  } else if (activeRoute === 'workspace') {
    pageContent = (
      <WorkspacePage
        isAssembly={isAssembly}
        input={input}
        onAssemblyModeChange={handleAssemblyModeChange}
        onEditorChange={handleEditorChange}
        onEditorMount={(nextEditor, nextMonaco) => {
          setEditor(nextEditor);
          setMonaco(nextMonaco);
        }}
        vmInstance={vmInstance}
        editor={editor}
        monaco={monaco}
        sourceMap={sourceMap}
        programBytes={programBytes}
        vmRuntimeState={vmRuntimeState}
        onExecutionChange={syncVmPanels}
        onExecuteVmAction={executeVmAction}
        onPrepareProgram={prepareProgram}
        programDirty={programDirty}
        onRunVm={handleRunVM}
        onClearCode={handleClearCode}
        learningPanelProps={learningPanelProps}
        renderedOutput={renderedOutput}
        memorySnapshot={memorySnapshot}
        currentPc={currentPc}
        executionVersion={executionVersion}
        vmStatusLabel={vmStatusLabel}
        vmStatusClassName={vmStatusClassName}
      />
    );
  } else if (activeRoute === 'lessons') {
    pageContent = (
      <LessonsPage
        profile={retroArchitectureProfile}
        examples={retroExamples}
        onLoadExample={openExampleInWorkspace}
      />
    );
  } else if (activeRoute === 'labs') {
    pageContent = (
      <LabsPage
        challenges={retroChallenges}
        challengeProgress={challengeProgress}
        onLoadChallenge={openChallengeInWorkspace}
      />
    );
  } else if (activeRoute === 'reports') {
    pageContent = (
      <ReportsPage
        registerValues={registerValues}
        memorySnapshot={memorySnapshot}
        currentPc={currentPc}
        vmStatusLabel={vmStatusLabel}
        vmRuntimeState={vmRuntimeState}
        onNavigate={navigateTo}
      />
    );
  } else if (activeRoute === 'programs') {
    pageContent = (
      <ProgramsPage
        savedPrograms={savedPrograms}
        examples={retroExamples}
        onOpenProgram={openSavedProgramInWorkspace}
        onLoadExample={openExampleInWorkspace}
      />
    );
  } else if (activeRoute === 'progress') {
    pageContent = (
      <ProgressPage
        challenges={retroChallenges}
        challengeProgress={challengeProgress}
        completedChallengesCount={completedChallengesCount}
      />
    );
  } else if (activeRoute === 'docs') {
    pageContent = <DocsPage />;
  } else if (activeRoute === 'instructor') {
    pageContent = <InstructorPage />;
  } else if (activeRoute === 'settings') {
    pageContent = (
      <SettingsPage
        isAssembly={isAssembly}
        vmStatusLabel={vmStatusLabel}
        savedProgramsCount={savedPrograms.length}
      />
    );
  }

  return (
    <>
      <Navbar
        productName={PLATFORM_NAME}
        activeRoute={activeRoute}
        links={topNavigationLinks}
        onNavigate={navigateTo}
      />

      <main className="min-h-screen px-4 pb-14 pt-28 text-[var(--text-main)] md:px-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeRoute}
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.28, ease: 'easeOut' }}
          >
            {activeRoute === 'landing' ? (
              <div className="mx-auto max-w-7xl">
                {pageContent}
              </div>
            ) : (
              <div className="mx-auto max-w-7xl">
                <div className="mb-6 rounded-[28px] border border-[var(--panel-border)] bg-[var(--panel)] px-5 py-4">
                  <p className="text-xs uppercase tracking-[0.24em] text-[var(--text-muted)]">
                    Current Page
                  </p>
                  <div className="mt-2 flex flex-col gap-2 lg:flex-row lg:items-center lg:justify-between">
                    <div>
                      <h1 className="text-2xl font-semibold text-[var(--heading-color)]">
                        {activeRouteMeta.label}
                      </h1>
                      <p className="mt-1 text-sm text-[var(--text-muted)]">
                        {activeRouteMeta.blurb}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => navigateTo('workspace')}
                      className="rounded-full bg-[var(--accent)] px-4 py-3 text-sm font-semibold text-white"
                    >
                      Jump to Workspace
                    </button>
                  </div>
                </div>

                <div className="grid gap-8 lg:grid-cols-[18rem_minmax(0,1fr)]">
                  <AppSidebar
                    sections={platformNavigation}
                    activeRoute={activeRoute}
                    onNavigate={navigateTo}
                  />
                  <section className="min-w-0">{pageContent}</section>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      <AnimatePresence>
        {easterEggActive && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ type: 'spring', stiffness: 200, damping: 20 }}
          >
            <motion.div
              className="bg-gradient-to-r from-black via-zinc-900 to-black border border-[var(--accent)] text-[var(--text-main)] font-mono px-6 py-4 rounded-xl shadow-xl"
              initial={{ rotate: -2 }}
              animate={{ rotate: [2, -2, 2], repeat: Infinity, duration: 0.8 }}
            >
              Debug Mode Activated -{' '}
              <span className="font-bold text-[var(--accent)]">
                RETRO CORE UNLOCKED
              </span>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />
      <Analytics />
    </>
  );
}

export default App;
