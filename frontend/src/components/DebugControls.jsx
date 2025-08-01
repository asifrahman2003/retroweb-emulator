import React, { useState, useEffect, useRef } from 'react';
import '../index.css';

export default function DebugControls({
  vmInstance,
  editor,
  monaco,
  sourceMap,
  programBytes
}) {
  const [pc, setPc] = useState(0);
  const [registers, setRegisters] = useState(Array(8).fill(0));
  const decorationsRef = useRef([]);

  useEffect(() => {
    if (!vmInstance) return;
    setPc(vmInstance._get_pc());
    setRegisters(Array.from({ length: 8 }, (_, i) => vmInstance._get_register(i)));
  }, [vmInstance]);

  const highlightLine = (currentPc) => {
    if (!editor || !monaco) return;
    const lineNumber = sourceMap[currentPc] || currentPc + 1;
    decorationsRef.current = editor.deltaDecorations(
      decorationsRef.current,
      [{
        range: new monaco.Range(lineNumber, 1, lineNumber, 1),
        options: { isWholeLine: true, className: 'currentLineHighlight' }
      }]
    );
    editor.revealLineInCenter(lineNumber);
  };

  const handleStep = () => {
    vmInstance._step_vm();
    const newPc = vmInstance._get_pc();
    setPc(newPc);
    setRegisters(Array.from({ length: 8 }, (_, i) => vmInstance._get_register(i)));
    highlightLine(newPc);
  };

  const handleReset = () => {
    vmInstance._reset_vm();
    const ptr = vmInstance._get_memory();
    const heap = new Uint8Array(vmInstance.HEAPU8.buffer);
    heap.fill(0, ptr, ptr + 2048);
    heap.set(programBytes, ptr);

    setPc(vmInstance._get_pc());
    setRegisters(Array(8).fill(0));
    editor.deltaDecorations(decorationsRef.current, []);
    decorationsRef.current = [];
  };

  return (
    <div className="w-full flex flex-wrap items-center gap-4 p-3 bg-[var(--panel)] border border-white/10 rounded-lg shadow-inner">
      {/* Left: Step & Reset */}
      <div className="flex gap-3 flex-wrap">
        <button
          onClick={handleStep}
          className="px-4 py-2 rounded-lg bg-orange-500 hover:bg-black text-white transition-colors duration-200 font-medium"
        >
          Step
        </button>
        <button
          onClick={handleReset}
          className="px-4 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 text-white border border-white/20 transition font-medium"
        >
          Reset VM
        </button>
      </div>

      {/* Right: PC & Registers */}
      <div className="flex gap-2 items-center overflow-x-auto mt-2 md:mt-0">
        <span className="font-mono text-sm">PC: 0x{pc.toString(16)}</span>
        {registers.map((v, i) => (
          <span
            key={i}
            className="text-xs px-2 py-1 font-mono bg-[var(--bg)] border border-white/10 rounded whitespace-nowrap"
          >
            R{i}:{v}
          </span>
        ))}
      </div>
    </div>
  );
}
