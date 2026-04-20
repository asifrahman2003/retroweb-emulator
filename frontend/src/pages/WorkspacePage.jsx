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
  memorySnapshot,
  currentPc,
  executionVersion,
  vmStatusLabel,
  vmStatusClassName,
}) {
  return (
    <div className="space-y-8">
      <section className="rounded-[18px] border border-[var(--panel-border)] bg-[var(--panel-soft)] p-6 md:p-8">
        <div className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-[var(--text-muted)]">
              Core Workspace
            </p>
            <h1 className="mt-3 text-3xl font-bold text-[var(--heading-color)] md:text-5xl">
              The debugger-first page learners spend most of their time inside.
            </h1>
            <p className="mt-4 max-w-3xl text-sm leading-7 text-[var(--text-muted)] md:text-base">
              Keep the editor, execution controls, learning sidebar, output, memory, and canvas together so every lesson and challenge funnels into one consistent environment.
            </p>
          </div>
          <div className="rounded-lg border border-[var(--panel-border)] bg-[var(--panel)] px-4 py-3 text-sm">
            <span className="text-[var(--text-muted)]">Runtime status: </span>
            <span className={vmStatusClassName}>{vmStatusLabel}</span>
          </div>
        </div>
      </section>

      <div className="grid gap-8 xl:grid-cols-[minmax(0,1.35fr)_minmax(320px,0.85fr)]">
        <MacWindow title="Code Editor">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <label className="flex items-center gap-2 text-sm text-[var(--text-muted)]">
              <input type="checkbox" checked={isAssembly} onChange={onAssemblyModeChange} />
              Use Assembly Syntax
            </label>
            <div className="text-xs uppercase tracking-[0.2em] text-[var(--text-muted)]">
              Editor + Runtime Controls
            </div>
          </div>

          <Editor
            height="380px"
            beforeMount={configureRetroAssemblyLanguage}
            language={isAssembly ? 'retroweb-assembly' : 'plaintext'}
            value={input}
            onChange={onEditorChange}
            onMount={onEditorMount}
            theme="vs-dark"
            options={{
              fontSize: 14,
              fontFamily: 'SFMono-Regular, Menlo, Monaco, Consolas, monospace',
              minimap: { enabled: false },
              lineNumbers: 'on',
              scrollBeyondLastLine: false,
              wordWrap: 'on',
              readOnly: false,
              placeholder: isAssembly
                ? 'Enter custom assembly (e.g., LOAD R1 5)...'
                : 'Enter raw bytes (e.g., 1 17 5 2 18 17 17 3 18 7)',
            }}
          />

          {vmInstance && editor && monaco ? (
            <div className="mt-4 rounded-xl border border-[var(--accent)] bg-[var(--panel)] p-4">
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

          <div className="mt-4 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={onRunVm}
              className="flex-1 rounded-full bg-[var(--accent)] px-5 py-3 text-sm font-semibold text-white"
            >
              Run VM
            </button>
            <button
              type="button"
              onClick={onClearCode}
              className="flex-1 rounded-full border border-[var(--panel-border)] bg-[var(--panel)] px-5 py-3 text-sm font-semibold text-[var(--text-main)]"
            >
              Clear Code
            </button>
          </div>
        </MacWindow>

        <LearningPanel {...learningPanelProps} />
      </div>

      <section className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-[0.22em] text-[var(--text-muted)]">
              Runtime Panes
            </p>
            <h2 className="mt-1 text-xl font-semibold text-[var(--text-main)]">
              Output, memory, and canvas directly under the editor
            </h2>
          </div>
          <p className="text-sm text-[var(--text-muted)]">
            Reorganized for a more IDE-like scan path: code first, diagnostics second.
          </p>
        </div>

        <MacWindow title="Output">
          <div className="overflow-hidden rounded-xl border border-[var(--accent)]">
            <div
              className="px-3 py-2 text-xs font-mono"
              style={{
                backgroundColor: 'var(--window-header-bg)',
                color: 'var(--window-title-text)',
              }}
            >
              Console Dump
            </div>
            <pre className="min-h-[180px] whitespace-pre-wrap bg-[var(--output-bg)] p-4 text-sm text-[var(--accent)]">
              {renderedOutput}
            </pre>
          </div>
        </MacWindow>

        <div className="grid gap-6 xl:grid-cols-[minmax(0,1.1fr)_minmax(280px,0.9fr)]">
          {vmInstance ? (
            <MemoryViewer memorySnapshot={memorySnapshot} pc={currentPc} version={executionVersion} />
          ) : null}
          {vmInstance ? (
            <CanvasOutput memorySnapshot={memorySnapshot} drawTrigger={executionVersion} />
          ) : null}
        </div>
      </section>
    </div>
  );
}
