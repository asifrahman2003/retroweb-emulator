// src/components/MemoryViewer.jsx
import React, { useState, useEffect, useRef } from 'react'
import MacWindow from './MacWindow'
import { FRAMEBUFFER_START, MEM_SIZE, formatVmAddress } from '../vmLayout'

export default function MemoryViewer({ memorySnapshot, pc, version }) {
  const [showFull,    setShowFull]    = useState(false)
  const [memorySlice, setMemorySlice] = useState(new Uint8Array())
  const prevMemoryRef = useRef(new Uint8Array())

  const bytesToShow = showFull ? MEM_SIZE : 128
  const bytesPerRow = 8

  useEffect(() => {
    const nextSlice = memorySnapshot.slice(0, bytesToShow)
    // copy into a new Uint8Array so React will notice the change
    setMemorySlice((previousMemory) => {
      prevMemoryRef.current = previousMemory
      return nextSlice
    })
  }, [bytesToShow, memorySnapshot, version])

  function getByteClass(byte, addr, idx) {
    const prevMemory = prevMemoryRef.current

    // highlight the PC
    if (addr === pc) {
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
    <MacWindow title="Memory" contentClassName="p-3">
      <div className="mb-2 flex items-center justify-between gap-3">
        <p className="text-xs text-[var(--text-muted)]">
          Program starts at {formatVmAddress(0)}. Framebuffer starts at {formatVmAddress(FRAMEBUFFER_START)}.
        </p>
        <button
          className="text-xs text-[var(--accent)] hover:text-[var(--accent-hover)]"
          onClick={() => setShowFull(f => !f)}
        >
          {showFull ? 'Show Less' : 'Show More'}
        </button>
      </div>

      <div className="overflow-hidden rounded-lg border border-[var(--accent)]">
        <div
          className="px-3 py-1 text-xs font-mono"
          style={{
            backgroundColor: 'var(--window-header-bg)',
            color:           'var(--window-title-text)',
          }}
        >
          Memory Dump
        </div>

        <div className="max-h-52 space-y-1 overflow-y-auto bg-[var(--output-bg)] p-3 font-mono text-sm">
          {Array.from(
            { length: Math.ceil(bytesToShow / bytesPerRow) },
            (_, rowIdx) => {
              const start = rowIdx * bytesPerRow
              const row   = memorySlice.slice(start, start + bytesPerRow)
              return (
                <div key={rowIdx} className="flex items-center gap-4">
                  <div className="w-16 text-[var(--text-muted)]">
                    {`${formatVmAddress(start)}:`}
                  </div>
                  <div className="grid grid-cols-8 gap-1">
                    {Array.from(row).map((b, i) => {
                      const addr = start + i
                      return (
                        <div
                          key={i}
                          className={`px-2 py-1 rounded text-center text-xs ${
                            getByteClass(b, addr, start + i)
                          }`}
                          title={`Addr: ${formatVmAddress(addr)} • Val: ${b}`}
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
