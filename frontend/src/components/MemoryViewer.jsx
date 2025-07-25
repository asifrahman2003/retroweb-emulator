// src/components/MemoryViewer.jsx
import { useState, useEffect } from 'react';

export default function MemoryViewer({ vmInstance, version, highlightAddr = null }) {
  const [showFull, setShowFull] = useState(false);
  const [memorySlice, setMemorySlice] = useState([]);
  const [prevMemory, setPrevMemory] = useState([]);

  const memoryStart = vmInstance._get_memory();
  const heap       = new Uint8Array(vmInstance.HEAPU8.buffer);
  const bytesToShow = showFull ? 512 : 128;
  const bytesPerRow = 8;

  useEffect(() => {
    const slice = heap.slice(memoryStart, memoryStart + bytesToShow);
    setPrevMemory(memorySlice);       // save old
    setMemorySlice(slice);            // update to new
  }, [vmInstance, showFull, version]); // ← now depends on version too

  const getByteClass = (byte, addr, i) => {
    const changed = prevMemory[i] !== undefined && prevMemory[i] !== byte;
    const isPC    = addr === vmInstance._get_register(15); // or whatever your PC register index is
    if (isPC)    return 'bg-yellow-500 text-black font-bold';
    if (changed) return 'bg-blue-800 text-blue-100 font-semibold';
    if (byte !== 0) return 'bg-green-900 text-green-100';
    return 'bg-gray-700 text-gray-400';
  };

  return (
    <section className="bg-[var(--panel)] p-6 rounded-xl border border-white/10 shadow-lg">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-lg font-semibold text-orange-300">Memory</h2>
        <button
          className="text-xs text-blue-400 hover:text-blue-300"
          onClick={() => setShowFull(f => !f)}
        >
          {showFull ? 'Show Less' : 'Show More'}
        </button>
      </div>
      <div className="bg-gray-800 p-4 rounded text-sm max-h-64 overflow-y-auto font-mono space-y-1">
        {Array.from({ length: Math.ceil(memorySlice.length / bytesPerRow) }, (_, rowIndex) => {
          const startAddr = rowIndex * bytesPerRow;
          const rowBytes  = memorySlice.slice(startAddr, startAddr + bytesPerRow);
          return (
            <div key={rowIndex} className="flex items-center gap-4">
              <div className="text-gray-500 w-16">
                {`0x${(memoryStart + startAddr).toString(16).padStart(4, '0')}:`}
              </div>
              <div className="grid grid-cols-8 gap-1">
                {rowBytes.map((b, i) => {
                  const addr = memoryStart + startAddr + i;
                  return (
                    <div
                      key={i}
                      className={`px-2 py-1 rounded text-center text-xs ${getByteClass(b, addr, startAddr + i)}`}
                      title={`Addr: 0x${addr.toString(16)} • Val: ${b}`}
                    >
                      {b.toString(16).padStart(2, '0').toUpperCase()}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
