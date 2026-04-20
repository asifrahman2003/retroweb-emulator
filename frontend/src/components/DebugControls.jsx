import React, { useState, useEffect, useRef, useImperativeHandle } from 'react';
import '../index.css';
import { MEM_SIZE, NUM_REGS, VM_ERROR_NONE, describeVmError } from '../vmLayout';

function applyHighlight(editor, monaco, sourceMap, currentPc, decorationsRef) {
  if (!editor || !monaco) return;
  const lineNumber = sourceMap[currentPc] || currentPc + 1;
  decorationsRef.current = editor.deltaDecorations(
    decorationsRef.current,
    [{ range: new monaco.Range(lineNumber, 1, lineNumber, 1), options: { isWholeLine: true, className: 'currentLineHighlight' } }],
  );
  editor.revealLineInCenter(lineNumber);
}

const DebugControls = React.forwardRef(function DebugControls({
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
  headless = false,
}, ref) {
  const [pc, setPc] = useState(0);
  const [registers, setRegisters] = useState(Array(NUM_REGS).fill(0));
  const decorationsRef = useRef([]);
  const hasVmError = vmRuntimeState?.lastError && vmRuntimeState.lastError !== VM_ERROR_NONE;
  const stepDisabled = !vmInstance || (!programDirty && vmRuntimeState?.halted);

  const statusLabel = hasVmError
    ? `Error: ${describeVmError(vmRuntimeState.lastError)}`
    : vmRuntimeState?.halted ? 'Halted' : 'Ready';

  const statusClassName = hasVmError
    ? 'text-rose-300 border-rose-500/40'
    : vmRuntimeState?.halted ? 'text-yellow-200 border-yellow-500/40' : 'text-emerald-200 border-emerald-500/40';

  const executeVmAction = onExecuteVmAction ?? ((action) => {
    try { action(); return { logs: '', error: null }; }
    catch (error) { return { logs: '', error }; }
  });

  const syncLocalState = (nextPc = vmInstance._get_pc()) => {
    setPc(nextPc);
    setRegisters(Array.from({ length: NUM_REGS }, (_, i) => vmInstance._get_register(i)));
    applyHighlight(editor, monaco, sourceMap, nextPc, decorationsRef);
  };

  useEffect(() => {
    if (!vmInstance) return;
    const currentPc = vmInstance._get_pc();
    setPc(currentPc);
    setRegisters(Array.from({ length: NUM_REGS }, (_, i) => vmInstance._get_register(i)));
    applyHighlight(editor, monaco, sourceMap, currentPc, decorationsRef);
  }, [editor, monaco, programBytes, sourceMap, vmInstance]);

  const handleStep = () => {
    if (programDirty) {
      const prepared = onPrepareProgram?.({ resetLogs: true, clearConsole: true });
      if (!prepared?.ok) return;
    }
    const currentPc = vmInstance._get_pc();
    if (!programDirty && vmRuntimeState?.halted) { syncLocalState(currentPc); return; }
    const { logs, error } = executeVmAction(() => { vmInstance._step_vm(); });
    const newPc = vmInstance._get_pc();
    syncLocalState(newPc);
    if (error) {
      onExecutionChange?.({ module: vmInstance, logs: [logs, `❌ Runtime Error: ${error.message}`].filter(Boolean).join('\n'), resetLogs: true });
      return;
    }
    onExecutionChange?.({ module: vmInstance, logs, appendLogs: true });
  };

  const handleReset = () => {
    if (!vmInstance) return;
    if (programDirty) {
      const prepared = onPrepareProgram?.({ resetLogs: true, clearConsole: true });
      if (!prepared?.ok) return;
      syncLocalState(0);
      return;
    }
    const ptr = vmInstance._get_memory();
    const heap = vmInstance.HEAPU8;
    heap.fill(0, ptr, ptr + MEM_SIZE);
    heap.set(programBytes, ptr);
    vmInstance._reset_vm();
    syncLocalState(0);
    if (editor) editor.deltaDecorations(decorationsRef.current, []);
    decorationsRef.current = [];
    applyHighlight(editor, monaco, sourceMap, 0, decorationsRef);
    onExecutionChange?.({ module: vmInstance, resetLogs: true });
  };

  useImperativeHandle(ref, () => ({ step: handleStep, reset: handleReset }));

  if (headless) return null;

  return (
    <div className="w-full rounded-md border border-white/10 bg-[var(--panel)] p-3 shadow-inner">
      <div className="grid gap-3 lg:grid-cols-[auto_1fr] lg:items-center">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={handleStep}
            disabled={stepDisabled}
            className="min-w-20 rounded-md bg-orange-500 px-3 py-2 font-medium text-white transition-colors duration-200 hover:bg-black disabled:cursor-not-allowed disabled:bg-zinc-700 disabled:text-zinc-300"
          >
            Step
          </button>
          <button
            onClick={handleReset}
            className="min-w-24 rounded-md border border-white/20 bg-gray-700 px-3 py-2 font-medium text-white transition hover:bg-gray-600"
          >
            Reset VM
          </button>
        </div>

        <div className="grid gap-2 md:grid-cols-[minmax(0,150px)_minmax(0,140px)_minmax(0,1fr)]">
          <div className="rounded-md border border-white/10 bg-[var(--bg)] px-3 py-2">
            <div className="text-[10px] uppercase tracking-[0.18em] text-[var(--text-muted)]">Runtime</div>
            <span className={`mt-1 inline-flex whitespace-nowrap rounded-md border px-2 py-1 font-mono text-xs ${statusClassName}`}>
              {statusLabel}
            </span>
          </div>
          <div className="rounded-md border border-white/10 bg-[var(--bg)] px-3 py-2">
            <div className="text-[10px] uppercase tracking-[0.18em] text-[var(--text-muted)]">PC</div>
            <div className="mt-1 font-mono text-sm text-[var(--text-main)]">0x{pc.toString(16)}</div>
          </div>
          <div className="min-w-0 rounded-md border border-white/10 bg-[var(--bg)] px-3 py-2">
            <div className="mb-2 text-[10px] uppercase tracking-[0.18em] text-[var(--text-muted)]">Execution</div>
            <div className="h-2 w-full rounded-full bg-white/20">
              <div
                className="h-2 rounded-full bg-[var(--accent)]/80 transition-all"
                style={{ width: `${Math.min(100, ((pc + 1) / Math.max(programBytes.length || 1, 1)) * 100)}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

export default DebugControls;
