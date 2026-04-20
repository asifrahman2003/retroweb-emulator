import Editor from '@monaco-editor/react';
import CanvasOutput from '../components/CanvasOutput';
import DebugControls from '../components/DebugControls';
import LearningPanel from '../components/LearningPanel';
import MacWindow from '../components/MacWindow';
import MemoryViewer from '../components/MemoryViewer';

function configureRetroAssemblyLanguage(monaco) {
  if (!monaco || monaco.languages.getLanguages().some((language) => language.id === 'retroweb-assembly')) {
    return;
  }

  monaco.languages.register({ id: 'retroweb-assembly' });
  monaco.languages.setMonarchTokensProvider('retroweb-assembly', {
    tokenizer: {
      root: [
        [/\/\/.*$/, 'comment'],
        [/\b(?:LOAD|ADD|SUB|STORE|PRINT|JZ|JMP|PIX|PIXR|HALT)\b/i, 'keyword'],
        [/\bR[0-7]\b/i, 'variable.predefined'],
        [/\b0x[0-9a-f]+\b/i, 'number.hex'],
        [/\b\d+\b/, 'number'],
        [/^[ \t]*[A-Za-z_][A-Za-z0-9_]*:/, 'type.identifier'],
      ],
    },
  });
  monaco.languages.setLanguageConfiguration('retroweb-assembly', {
    comments: {
      lineComment: '//',
    },
  });
}

function RegisterPanel({ registerValues, currentPc, vmStatusLabel }) {
  return (
    <section className="border-b border-[#2a2c30] p-4">
      <div className="flex items-center justify-between gap-3">
        <span className="font-mono text-[11px] uppercase tracking-[0.12em] text-[#7a8590]">
          Registers
        </span>
        <span className="font-mono text-[11px] text-[#7a8590]">{vmStatusLabel}</span>
      </div>
      <div className="mt-3 grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 font-mono text-[12px] text-[#d8d2c8]">
        {registerValues.map((value, index) => (
          <span key={`r${index}`} className="contents">
            <span className="text-[#8a8680]">R{index}</span>
            <b className={value ? 'text-[var(--accent)]' : ''}>
              0x{Number(value).toString(16).padStart(2, '0').toUpperCase()}
            </b>
          </span>
        ))}
        <span className="text-[#8a8680]">PC</span>
        <b className="text-[var(--accent)]">
          0x{currentPc.toString(16).padStart(4, '0').toUpperCase()}
        </b>
      </div>
    </section>
  );
}

export default function WorkspacePage({
  isAssembly,
  input,
  onAssemblyModeChange,
  onEditorChange,
  onEditorMount,
  vmInstance,
  editor,
  monaco,
  sourceMap,
  programBytes,
  vmRuntimeState,
  onExecutionChange,
  onExecuteVmAction,
  onPrepareProgram,
  programDirty,
  onRunVm,
  onClearCode,
  learningPanelProps,
  renderedOutput,
  registerValues,
  memorySnapshot,
  currentPc,
  executionVersion,
  vmStatusLabel,
  vmStatusClassName,
}) {
  return (
    <div className="workspace-dark rw-frame">
      <div className="rw-frame-label border-[#2a2c30] bg-[#1a1b1e] text-[#8a8680]">
        <span>DESKTOP · DARK WORKSPACE</span>
        <span>/workspace</span>
      </div>

      <div className="flex flex-wrap items-center gap-3 border-b border-[#2a2c30] bg-[#0f1012] px-4 py-3 font-mono text-[12px] text-[#d8d2c8]">
        <div className="flex items-center gap-2">
          <span className="brand-mark border-[#3a3c40] bg-[#1a1b1e]" />
          <b className="text-white">retroWeb</b>
        </div>
        <div className="flex min-w-0 flex-1 items-center gap-1 overflow-x-auto">
          <span className="rounded-[4px] border border-[#2a2c30] bg-[#1a1b1e] px-3 py-1">
            workspace.asm
          </span>
          <span className="px-3 py-1 text-[#7a8590]">saved.local</span>
        </div>
        <div className="rw-segment border-[#2a2c30] bg-[#1a1b1e]">
          <button
            type="button"
            aria-pressed={isAssembly}
            onClick={!isAssembly ? onAssemblyModeChange : undefined}
            className="text-[#7a8590]"
          >
            Assembly
          </button>
          <button
            type="button"
            aria-pressed={!isAssembly}
            onClick={isAssembly ? onAssemblyModeChange : undefined}
            className="text-[#7a8590]"
          >
            Bytes
          </button>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={onRunVm}
            className="bg-[var(--accent)] px-4 py-1.5 font-semibold text-white"
            style={{ borderColor: 'var(--accent)' }}
          >
            Run
          </button>
          <button
            type="button"
            onClick={onClearCode}
            className="border-[#2a2c30] bg-transparent px-3 py-1.5 text-[#8a8680]"
          >
            Clear
          </button>
          <span className={`font-sans text-xs ${vmStatusClassName}`}>{vmStatusLabel}</span>
        </div>
      </div>

      <div className="grid min-h-[760px] bg-[#0a0b0d] text-[#d8d2c8] xl:grid-cols-[56px_278px_minmax(0,1fr)_370px]">
        <aside className="hidden border-r border-[#2a2c30] px-2 py-4 xl:flex xl:flex-col xl:items-center xl:gap-4">
          {['W', 'L', 'D', 'T'].map((item, index) => (
            <span
              key={item}
              className="flex h-8 w-8 items-center justify-center rounded-[5px] border font-mono text-[11px]"
              style={{
                borderColor: index === 0 ? 'var(--accent)' : '#2a2c30',
                background: index === 0 ? 'rgba(217, 106, 44, 0.12)' : 'transparent',
                color: index === 0 ? 'var(--accent)' : '#7a8590',
              }}
            >
              {item}
            </span>
          ))}
          <span className="flex-1" />
          <span className="font-mono text-[#7a8590]">?</span>
        </aside>

        <aside className="border-b border-[#2a2c30] p-3 xl:border-b-0 xl:border-r">
          <LearningPanel {...learningPanelProps} />
        </aside>

        <section className="flex min-w-0 flex-col border-b border-[#2a2c30] xl:border-b-0 xl:border-r">
          <div className="relative flex-1 p-4">
            <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
              <div>
                <div className="font-mono text-[11px] uppercase tracking-[0.12em] text-[#7a8590]">
                  Editor
                </div>
                <h1 className="mt-1 text-lg font-semibold text-white">
                  Step through code and watch the machine move.
                </h1>
              </div>
              <span className="rounded-[4px] border border-[#2a2c30] bg-[#1a1b1e] px-2 py-1 font-mono text-[10px] text-[#7a8590]">
                pc · 0x{currentPc.toString(16).padStart(4, '0').toUpperCase()}
              </span>
            </div>

            <div className="overflow-hidden rounded-[6px] border border-[#2a2c30]">
              <Editor
                height="430px"
                beforeMount={configureRetroAssemblyLanguage}
                language={isAssembly ? 'retroweb-assembly' : 'plaintext'}
                value={input}
                onChange={onEditorChange}
                onMount={onEditorMount}
                theme="vs-dark"
                options={{
                  fontSize: 14,
                  fontFamily: 'JetBrains Mono, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
                  minimap: { enabled: false },
                  lineNumbers: 'on',
                  scrollBeyondLastLine: false,
                  wordWrap: 'on',
                  readOnly: false,
                }}
              />
            </div>

            {vmInstance && editor && monaco ? (
              <div className="mt-3 rounded-[6px] border border-[#2a2c30] bg-[#101113] p-3">
                <DebugControls
                  vmInstance={vmInstance}
                  editor={editor}
                  monaco={monaco}
                  sourceMap={sourceMap}
                  programBytes={programBytes}
                  vmRuntimeState={vmRuntimeState}
                  onExecutionChange={onExecutionChange}
                  onExecuteVmAction={onExecuteVmAction}
                  onPrepareProgram={onPrepareProgram}
                  programDirty={programDirty}
                />
              </div>
            ) : null}
          </div>

          <div className="border-t border-[#2a2c30] bg-[#0f1012]">
            <div className="flex items-center gap-0 border-b border-[#2a2c30] px-3 py-1 font-mono text-[11px] text-[#7a8590]">
              <span className="border-b-2 border-[var(--accent)] px-3 py-2 text-white">Console</span>
              <span className="px-3 py-2">Trace</span>
              <span className="px-3 py-2">Tests</span>
              <span className="ml-auto text-[#4a9e5a]">idle</span>
            </div>
            <pre className="max-h-[230px] min-h-[190px] overflow-auto whitespace-pre-wrap p-4 font-mono text-sm leading-6 text-[var(--accent)]">
              {renderedOutput}
            </pre>
          </div>
        </section>

        <aside className="min-w-0 bg-[#0f1012]">
          <RegisterPanel
            registerValues={registerValues}
            currentPc={currentPc}
            vmStatusLabel={vmStatusLabel}
          />
          <div className="grid gap-3 p-3">
            {vmInstance ? (
              <>
                <MemoryViewer memorySnapshot={memorySnapshot} pc={currentPc} version={executionVersion} />
                <CanvasOutput memorySnapshot={memorySnapshot} drawTrigger={executionVersion} />
              </>
            ) : (
              <div className="rounded-[6px] border border-[#2a2c30] bg-[#141518] p-4 text-sm text-[#8a8680]">
                VM runtime is loading.
              </div>
            )}
          </div>
        </aside>
      </div>

      <div className="flex flex-wrap items-center gap-3 border-t border-[#2a2c30] bg-[#0f1012] px-4 py-3 font-mono text-[12px]">
        <span className="text-[var(--accent)]">AI</span>
        <div className="min-w-[220px] flex-1 rounded-[6px] border border-[#2a2c30] bg-[#1a1b1e] px-3 py-2 text-[#7a8590]">
          Explain why the current register changed after this instruction.
        </div>
        <span className="text-[#7a8590]">Cmd+Enter</span>
      </div>
    </div>
  );
}
