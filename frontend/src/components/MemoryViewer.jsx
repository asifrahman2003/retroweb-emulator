// src/components/MemoryViewer.jsx
import React, { useState, useEffect } from 'react'
import MacWindow from './MacWindow'

export default function MemoryViewer({ vmInstance, version }) {
  const [showFull,    setShowFull]    = useState(false)
  const [memorySlice, setMemorySlice] = useState(new Uint8Array())
  const [prevMemory,  setPrevMemory]  = useState(new Uint8Array())

  // 1) Pointer into WASM heap where your C `memory[0]` lives
  const memPtr = vmInstance._get_memory()
  // 2) The live HEAPU8 view
  const heap   = vmInstance.HEAPU8

  const bytesToShow = showFull ? 512 : 128
  const bytesPerRow = 8
  // PC inside your C memory[]
  const pcOffset = vmInstance._get_pc()

  useEffect(() => {
    // stash the old contents so we can highlight diffs
    setPrevMemory(memorySlice)

    // grab exactly [memPtr … memPtr+bytesToShow)
    const liveView = heap.subarray(memPtr, memPtr + bytesToShow)
    // copy into a new Uint8Array so React will notice the change
    setMemorySlice(liveView.slice())
  }, [vmInstance, showFull, version])  // re-run whenever you toggle/showFull or bump runCount

  function getByteClass(byte, addr, idx) {
    // highlight the PC
    if (addr === memPtr + pcOffset) {
      return 'bg-yellow-500 text-black font-bold'
    }
    // highlight any byte that just changed
    if (prevMemory[idx] !== undefined && prevMemory[idx] !== byte) {
      return 'bg-blue-800 text-blue-100 font-semibold'
    }
    // non-zero data
    if (byte !== 0) {
      return 'bg-green-900 text-green-100'
    }
    // plain zeros
    return 'bg-gray-700 text-gray-400'
  }

  return (
    <MacWindow title="Memory">
      <div className="flex justify-end mb-2">
        <button
          className="text-xs text-[var(--accent)] hover:text-[var(--accent-hover)]"
          onClick={() => setShowFull(f => !f)}
        >
          {showFull ? 'Show Less' : 'Show More'}
        </button>
      </div>

      <div className="rounded-xl border border-[var(--accent)] overflow-hidden">
        <div
          className="px-3 py-1 text-xs font-mono"
          style={{
            backgroundColor: 'var(--window-header-bg)',
            color:           'var(--window-title-text)',
          }}
        >
          Memory Dump
        </div>

        <div className="bg-[var(--output-bg)] p-4 text-sm font-mono max-h-64 overflow-y-auto space-y-1">
          {Array.from(
            { length: Math.ceil(bytesToShow / bytesPerRow) },
            (_, rowIdx) => {
              const start = rowIdx * bytesPerRow
              const row   = memorySlice.slice(start, start + bytesPerRow)
              return (
                <div key={rowIdx} className="flex items-center gap-4">
                  <div className="w-16 text-[var(--text-muted)]">
                    {`0x${(memPtr + start)
                      .toString(16)
                      .padStart(4, '0')}:`}
                  </div>
                  <div className="grid grid-cols-8 gap-1">
                    {row.map((b, i) => {
                      const addr = memPtr + start + i
                      return (
                        <div
                          key={i}
                          className={`px-2 py-1 rounded text-center text-xs ${
                            getByteClass(b, addr, start + i)
                          }`}
                          title={`Addr: 0x${addr
                            .toString(16)
                            .padStart(4, '0')} • Val: ${b}`}
                        >
                          {b.toString(16).padStart(2, '0').toUpperCase()}
                        </div>
                      )
                    })}
                  </div>
                </div>
              )
            }
          )}
        </div>
      </div>
    </MacWindow>
  )
}
