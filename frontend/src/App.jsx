// src/App.jsx
import React, { useEffect, useState } from 'react';
import { loadVM } from './wasm/loadVM';
import { assemble } from './assembler';
import Navbar from './components/Navbar';
import MemoryViewer from './components/MemoryViewer';
import CanvasOutput from './components/CanvasOutput';
import DebugControls from './components/DebugControls';
import Footer from './components/Footer';
import { motion, AnimatePresence } from 'framer-motion';
import Editor from '@monaco-editor/react';
import { askGPT } from './askGPT';
import MacWindow from './components/MacWindow';
import About from './components/About';

function App() {
  const [vmInstance, setVmInstance] = useState(null);
  const [input, setInput] = useState('');
  const [isAssembly, setIsAssembly] = useState(true);
  const [output, setOutput] = useState('');
  const [easterEggActive, setEasterEggActive] = useState(false);
  const [runCount, setRunCount] = useState(0);
  const [programBytes, setProgramBytes] = useState(new Uint8Array());
  const [editor, setEditor] = useState(null);
  const [monaco, setMonaco] = useState(null);
  const [sourceMap, setSourceMap] = useState({});
  const [aiPrompt, setAiPrompt] = useState('');

  useEffect(() => {
    const script = document.createElement('script');
    script.src = '/vm.js';
    script.onload = async () => {
      const Module = await loadVM();
      setVmInstance(Module);

      const demo = `LOAD R1 5\nADD R2 R1 R1\nPRINT R2\nHALT`;
      setInput(demo);

      const bytes = assemble(demo);
      setSourceMap({});
      setProgramBytes(Uint8Array.from(bytes));

      const ptr = Module._get_memory();
      const heap = new Uint8Array(Module.HEAPU8.buffer);
      heap.fill(0, ptr, ptr + 2048);
      heap.set(bytes, ptr);
    };
    document.body.appendChild(script);
  }, []);

  const handleRunVM = () => {
    if (!vmInstance?._run_vm) {
      setOutput('❌ VM not ready.');
      return;
    }
    if (input.trim().toUpperCase() === 'HALT\nHALT') {
      setEasterEggActive(true);
      setTimeout(() => setEasterEggActive(false), 4000);
      return;
    }

    let bytes;
    try {
      bytes = isAssembly
        ? assemble(input)
        : input.trim().split(/\s+/).map(Number);
      setProgramBytes(Uint8Array.from(bytes));
    } catch (e) {
      setOutput('❌ Assembly Error: ' + e.message);
      return;
    }

    const ptr = vmInstance._get_memory();
    const heapU = new Uint8Array(vmInstance.HEAPU8.buffer);
    heapU.fill(0, ptr, ptr + 2048);
    heapU.set(bytes, ptr);

    let buf = '';
    const realLog = console.log;
    console.log = (...args) => {
      buf += args.join(' ') + '\n';
      realLog(...args);
    };

    try {
      vmInstance._run_vm();
    } catch (e) {
      console.log = realLog;
      setOutput('❌ Runtime Error: ' + e.message);
      return;
    }
    console.log = realLog;

    const regs = Array.from({ length: 8 }, (_, i) =>
      `R${i} = ${vmInstance._get_register(i)}`
    ).join('\n');

    const out = buf.trim();
    setOutput(out ? `${out}\n\n${regs}` : regs);
    setRunCount(c => c + 1);
  };

  return (
    <>
      <Navbar />

      <main className="pt-16 md:pt-20 min-h-screen bg-[var(--bg)] text-[var(--text-main)] px-4 md:px-8 pb-12 font-mono">
        {/* Title */}
        <div className="text-center mb-10 mt-8">
  <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[var(--heading-color)]">
    retroWeb Emulator
  </h1>
  <span className="inline-block w-25 h-1 bg-[var(--accent)] animate-pulse rounded-sm"></span>
</div>

        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-10">
          {/* Left Panel → Code Editor */}
          <MacWindow title="Code Editor">
            <label className="flex items-center text-[var(--text-muted)] gap-2 text-sm mb-2">
              <input
                type="checkbox"
                checked={isAssembly}
                onChange={() => setIsAssembly(a => !a)}
              />
              Use Assembly Syntax
            </label>

            <Editor
              height="240px"
              defaultLanguage="plaintext"
              value={input}
              onChange={v => setInput(v || '')}
              onMount={(ed, mon) => {
                setEditor(ed);
                setMonaco(mon);
              }}
              theme="vs-dark"
              options={{
                fontSize: 14,
                fontFamily: 'monospace',
                minimap: { enabled: false },
                lineNumbers: 'on',
                scrollBeyondLastLine: false,
                wordWrap: 'on',
                readOnly: !isAssembly,
                ariaLabel: 'Assembly Code Editor',
                placeholder: isAssembly
                  ? 'Enter custom Assembly (e.g., LOAD R1 5)...'
                  : 'Enter raw bytes (e.g., 1 17 5 2 18 17 17 3 18 7)',
              }}
            />

            {/* AI Assistant Input */}
            <div className="mt-4">
              <input
                type="text"
                className="w-full px-3 py-2 text-sm rounded bg-[var(--panel)] text-[var(--text-main)]"
                placeholder="Ask AI: e.g., load and print a number"
                value={aiPrompt}
                onChange={e => setAiPrompt(e.target.value)}
              />
              <button
                onClick={async () => {
                  const resp = await askGPT(
                    `Convert this idea into assembly for a custom VM:\n\n${aiPrompt}`
                  );
                  setInput(resp);
                }}
                className="mt-2 w-full py-2 rounded bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white transition"
              >
                Generate with GPT
              </button>
            </div>

            {/* Debug Controls */}
            {vmInstance && editor && monaco && (
              <div className="mt-4 rounded-xl border border-[var(--accent)] bg-[var(--panel)] p-4">
                <DebugControls
                  vmInstance={vmInstance}
                  editor={editor}
                  monaco={monaco}
                  sourceMap={sourceMap}
                  programBytes={programBytes}
                />
              </div>
            )}

            {/* Run & Clear */}
            <div className="flex gap-4 mt-4">
              <button
                onClick={handleRunVM}
                className="flex-1 py-2 rounded bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white transition"
              >
                ⏵ Run VM
              </button>
              <button
                onClick={() => {
                  setInput('');
                  setOutput('');
                }}
                className="flex-1 py-2 rounded bg-[var(--panel)] border border-[var(--panel-border)] text-[var(--text-main)] transition"
              >
                Clear Code
              </button>
            </div>
          </MacWindow>

          {/* Right Panel */}
          <div className="space-y-6">
            <MacWindow title="Output">
              <div className="rounded-xl border border-[var(--accent)] overflow-hidden">
                {/* Inner title bar */}
                <div
                  className="px-3 py-1 text-xs font-mono"
                  style={{
                    backgroundColor: 'var(--window-header-bg)',
                    color: 'var(--window-title-text)',
                  }}
                >
                  Console Dump
                </div>
                {/* Inner content */}
                <pre className="bg-[var(--output-bg)] p-4 text-[var(--accent)] text-sm whitespace-pre-wrap min-h-[120px]">
                  {output}
                </pre>
              </div>
            </MacWindow>

            {vmInstance && (
              <MemoryViewer vmInstance={vmInstance} version={runCount} />
            )}
            {vmInstance && (
              <CanvasOutput vmInstance={vmInstance} drawTrigger={runCount} />
            )}

            <p
  className="text-xs text-[var(--accent)] mt-2 
             text-center sm:text-left px-4"
>
  VM Status: {vmInstance ? 'Ready' : 'Loading...'}
</p>
          </div>
        </div>
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
              Debug Mode Activated —{' '}
              <span className="font-bold text-[var(--accent)]">
                RETRO CORE UNLOCKED
              </span>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <About />

      <Footer />
    </>
  );
}

export default App;
