import React from 'react';
import MacWindow from './MacWindow';

export default function HowToUseWindow() {
  return (
    <div className="mx-auto max-w-4xl px-4 mt-6 mb-2">
      <MacWindow title="How to Use" className="w-full">
        <div className="space-y-6 text-sm leading-relaxed font-mono" style={{ color: 'var(--text-main)' }}>
          <p>
            Welcome to the <strong style={{ color: 'var(--heading-color)' }}>retroWeb Emulator instructions</strong>! This virtual machine lets you run
            simple low-level programs using a custom instruction set. Here's how to get started:
          </p>

          {/* Steps to Get Started */}
          <div>
            <h3 className="font-semibold text-base mb-2" style={{ color: 'var(--heading-color)' }}>
              Steps to Get Started
            </h3>
            <ol className="list-decimal list-outside ml-6 space-y-1">
              <li>Write your program in Assembly or Raw Byte mode.</li>
              <li>
                Use{' '}
                <code
                  className="px-1 py-0.5 rounded font-mono"
                  style={{ backgroundColor: 'var(--window-header-bg)', color: 'var(--accent)' }}
                >
                  Step
                </code>{' '}
                to execute one instruction at a time.
              </li>
              <li>Observe changes in registers, memory, and canvas output.</li>
              <li>
                Use{' '}
                <code
                  className="px-1 py-0.5 rounded font-mono"
                  style={{ backgroundColor: 'var(--window-header-bg)', color: 'var(--accent)' }}
                >
                  Reset
                </code>{' '}
                to start over.
              </li>
            </ol>
          </div>

          {/* Supported Instructions */}
          <div>
            <h3 className="font-semibold text-base mb-2 pl-1" style={{ color: 'var(--heading-color)' }}>
              Supported Instructions
            </h3>
            <div className="overflow-x-auto rounded-md" style={{ border: '1px solid var(--window-border)' }}>
              <table className="w-full text-sm table-fixed border-collapse">
                <thead style={{ backgroundColor: 'var(--window-header-bg)', color: 'var(--text-muted)' }}>
                  <tr>
                    <th
                      className="px-4 py-2 text-left font-semibold"
                      style={{ borderBottom: '1px solid var(--window-border)' }}
                    >
                      Instruction
                    </th>
                    <th
                      className="px-4 py-2 text-left font-semibold"
                      style={{ borderBottom: '1px solid var(--window-border)' }}
                    >
                      Description
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ['LOAD Rx, addr', 'Load memory at addr into Rx'],
                    ['STORE Rx, addr', 'Store Rx into memory at addr'],
                    ['ADD Rx, Ry', 'Rx = Rx + Ry'],
                    ['SUB Rx, Ry', 'Rx = Rx - Ry'],
                    ['PRINT Rx', 'Print value of Rx'],
                    ['JMP addr', 'Jump to instruction at addr'],
                    ['JZ addr', 'Jump to addr if last result was zero'],
                    ['PIX Rx, Ry', 'Draw pixel at (Rx, Ry)'],
                    ['PIXR Rx, Ry, Rcolor', 'Draw colored pixel'],
                    ['HALT', 'Stop the program'],
                  ].map(([inst, desc]) => (
                    <tr
                      key={inst}
                      className="transition"
                      style={{
                        borderTop: '1px solid var(--window-border)',
                        backgroundColor: 'transparent',
                      }}
                      onMouseEnter={e =>
                        (e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.05)')
                      }
                      onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
                    >
                      <td className="px-4 py-2 font-mono" style={{ color: 'var(--accent)' }}>
                        {inst}
                      </td>
                      <td className="px-4 py-2">{desc}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </MacWindow>
    </div>
  );
}
