import React from 'react';
import MacWindow from './MacWindow';

export default function HowToUseWindow() {
  return (
    <div className="mx-auto max-w-4xl px-4 mt-6 mb-2">
      <MacWindow title="How to Use" className="w-full">
        <div className="space-y-6 text-sm leading-relaxed font-mono" style={{ color: 'var(--text-main)' }}>
          <p>
            Welcome to the <strong style={{ color: 'var(--heading-color)' }}>retroWeb Emulator instructions</strong>! This virtual machine lets you run
            simple low-level programs using a custom instruction set. Programs load at address <code className="text-[var(--accent)]">0x0000</code>,
            and the pixel framebuffer begins at <code className="text-[var(--accent)]">0x0400</code>. Here's how to get started:
          </p>

          {/* Steps to Get Started */}
          <div>
            <h3 className="font-semibold text-base mb-2" style={{ color: 'var(--heading-color)' }}>
              Steps to Get Started
            </h3>
            <ol className="list-decimal list-outside ml-6 space-y-1">
              <li>Load a guided example or challenge starter, or write your own program in Assembly or Raw Byte mode.</li>
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
              <li>Observe changes in registers, memory, canvas output, and the challenge result panel.</li>
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
                    ['LOAD Rx, imm', 'Load an immediate byte value into Rx'],
                    ['STORE Rx, addr', 'Store Rx into memory at addr'],
                    ['ADD Rd, Ra, Rb', 'Rd = Ra + Rb'],
                    ['SUB Rd, Ra, Rb', 'Rd = Ra - Rb'],
                    ['PRINT Rx', 'Print value of Rx'],
                    ['JMP addr', 'Jump to instruction at addr'],
                    ['JZ Rx, addr', 'Jump to addr if Rx is zero'],
                    ['PIX x, y, color', 'Draw a pixel using immediate values'],
                    ['PIXR Rx, Ry, Rc', 'Draw a pixel using register values'],
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
