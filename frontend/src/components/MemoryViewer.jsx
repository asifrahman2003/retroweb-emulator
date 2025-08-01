// src/components/MemoryViewer.jsx
import { useState, useEffect } from 'react';
import MacWindow from './MacWindow';

export default function MemoryViewer({ vmInstance, version, highlightAddr = null }) {
  const [showFull, setShowFull] = useState(false);
  const [memorySlice, setMemorySlice] = useState([]);
  const [prevMemory, setPrevMemory] = useState([]);

  const memoryStart = vmInstance._get_memory();
  const heap = new Uint8Array(vmInstance.HEAPU8.buffer);
  const bytesToShow = showFull ? 512 : 128;
  const bytesPerRow = 8;

  useEffect(() => {
    const slice = heap.slice(memoryStart, memoryStart + bytesToShow);
    setPrevMemory(memorySlice);
    setMemorySlice(slice);
  }, [vmInstance, showFull, version]);

  const getByteClass = (byte, addr, i) => {
    const changed = prevMemory[i] !== undefined && prevMemory[i] !== byte;
    const isPC = addr === vmInstance._get_register(15);
    if (isPC)    return 'bg-yellow-500 text-black font-bold';
    if (changed) return 'bg-blue-800 text-blue-100 font-semibold';
    if (byte !== 0) return 'bg-green-900 text-green-100';
    return 'bg-gray-700 text-gray-400';
  };

  return (
    <MacWindow title="Memory">
      {/* “Show More” toggle */}
      <div className="flex justify-end mb-2">
        <button
          className="text-xs text-[var(--accent)] hover:text-[var(--accent-hover)] transition"
          onClick={() => setShowFull(f => !f)}
        >
          {showFull ? 'Show Less' : 'Show More'}
        </button>
      </div>

      {/* inner accent‐border “window” */}
      <div className="rounded-xl border border-[var(--accent)] overflow-hidden">
        {/* inner title bar */}
        <div
          className="px-3 py-1 text-xs font-mono"
          style={{
            backgroundColor: 'var(--window-header-bg)',
            color: 'var(--window-title-text)',
          }}
        >
          Memory Dump
        </div>

        {/* inner content area matching “Output” panel */}
        <div className="bg-[var(--output-bg)] p-4 text-sm font-mono max-h-64 overflow-y-auto space-y-1">
          {Array.from(
            { length: Math.ceil(memorySlice.length / bytesPerRow) },
            (_, rowIndex) => {
              const startAddr = rowIndex * bytesPerRow;
              const rowBytes = memorySlice.slice(startAddr, startAddr + bytesPerRow);
              return (
                <div key={rowIndex} className="flex items-center gap-4">
                  <div className="w-16 text-[var(--text-muted)]">
                    {`0x${(memoryStart + startAddr)
                      .toString(16)
                      .padStart(4, '0')}:`}
                  </div>
                  <div className="grid grid-cols-8 gap-1">
                    {rowBytes.map((b, i) => {
                      const addr = memoryStart + startAddr + i;
                      return (
                        <div
                          key={i}
                          className={`px-2 py-1 rounded text-center text-xs ${getByteClass(
                            b,
                            addr,
                            startAddr + i
                          )}`}
                          title={`Addr: 0x${addr.toString(16).padStart(4, '0')} • Val: ${b}`}
                        >
                          {b.toString(16).padStart(2, '0').toUpperCase()}
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            }
          )}
        </div>
      </div>
    </MacWindow>
  );
}
