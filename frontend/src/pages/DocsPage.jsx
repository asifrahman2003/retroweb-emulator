import MacWindow from '../components/MacWindow';
import { docsReferenceSections } from '../platformContent';

const instructionRows = [
  ['LOAD Rx, imm', 'Load an immediate byte into a register.'],
  ['STORE Rx, addr', 'Write a register value into memory.'],
  ['ADD / SUB', 'Compute with register operands and wrap to 8 bits.'],
  ['PRINT Rx', 'Append a register value to the console output.'],
  ['JMP addr', 'Move the program counter to another instruction.'],
  ['JZ Rx, addr', 'Jump when the selected register is zero.'],
  ['PIX / PIXR', 'Write pixels into the framebuffer.'],
  ['HALT', 'Stop execution cleanly.'],
];

export default function DocsPage() {
  return (
    <div className="space-y-6">
      <header>
        <div className="rw-eyebrow">Reference</div>
        <h1 className="mt-1 text-3xl font-semibold text-[var(--heading-color)]">Docs</h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-[var(--text-muted)]">
          Three-column reference layout for architecture concepts, opcodes, examples, and related lessons.
        </p>
      </header>

      <section className="rw-card grid min-h-[760px] overflow-hidden xl:grid-cols-[248px_minmax(0,1fr)_220px]">
        <aside className="border-b border-[var(--line)] bg-[var(--panel-soft)] p-4 xl:border-b-0 xl:border-r">
          <div className="rw-search mb-4 max-w-none">
            <span>Cmd+K</span>
            <span>search docs...</span>
          </div>

          {[
            ['Getting started', ['Introduction', 'Your first program', 'Run and step']],
            ['Architecture', ['Overview', 'Memory model', 'Registers', 'Framebuffer']],
            ['Instruction set', ['Data movement', 'Arithmetic', 'Control flow', 'System']],
            ['Cookbook', ['Loops', 'String copy', 'Drawing pixels']],
          ].map(([group, items]) => (
            <div key={group} className="mb-5">
              <div className="mb-2 font-mono text-[10px] uppercase tracking-[0.12em] text-[var(--ink-3)]">
                {group}
              </div>
              <div className="grid gap-1 text-sm">
                {items.map((item) => (
                  <button
                    key={item}
                    type="button"
                    className="rounded-[4px] border-0 bg-transparent px-2 py-1 text-left text-[var(--ink-2)]"
                    style={{
                      color: item === 'Control flow' ? 'var(--accent)' : undefined,
                      boxShadow: item === 'Control flow' ? 'inset 2px 0 0 var(--accent)' : 'none',
                    }}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </aside>

        <article className="min-w-0 p-5 md:p-8">
          <div className="font-mono text-[11px] text-[var(--ink-3)]">
            Docs / Instruction set / Control flow
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            <span className="rw-chip rw-chip-accent">control flow</span>
            <span className="rw-chip">beginner</span>
            <span className="rw-chip">updated locally</span>
          </div>

          <h2 className="mt-4 text-3xl font-semibold text-[var(--ink)]">JZ · jump if zero</h2>
          <p className="mt-2 max-w-3xl text-base leading-7 text-[var(--text-muted)]">
            Branch to an address when the selected register is zero. Use it to exit loops,
            gate output, and make small programs respond to state.
          </p>

          <div className="rw-card-soft mt-5 grid gap-3 p-4 font-mono text-sm md:grid-cols-4">
            <span><span className="text-[var(--ink-3)]">SYNTAX</span> JZ Rx, addr</span>
            <span><span className="text-[var(--ink-3)]">SIZE</span> 3 bytes</span>
            <span><span className="text-[var(--ink-3)]">CYCLES</span> VM-defined</span>
            <span><span className="text-[var(--ink-3)]">STATE</span> PC</span>
          </div>

          <div className="mt-5 border-l-4 border-[#3a6fb0] bg-[#eaf1fa] p-4 text-sm leading-6 text-[#1f436f]">
            JZ in the current VM checks a register value directly. Future architecture tracks can
            evolve this into a flags-based branch model.
          </div>

          <h3 className="mt-8 text-xl font-semibold text-[var(--ink)]">Instruction reference</h3>
          <div className="mt-3 overflow-hidden rounded-[6px] border border-[var(--line)]">
            <table className="w-full border-collapse text-sm">
              <thead className="bg-[var(--panel-soft)] text-left text-[var(--ink-3)]">
                <tr>
                  <th className="px-4 py-3 font-mono text-[11px] uppercase tracking-[0.08em]">Instruction</th>
                  <th className="px-4 py-3 font-mono text-[11px] uppercase tracking-[0.08em]">Explanation</th>
                </tr>
              </thead>
              <tbody>
                {instructionRows.map(([instruction, description]) => (
                  <tr key={instruction} className="border-t border-[var(--line-2)]">
                    <td className="px-4 py-3 font-mono text-[var(--accent)]">{instruction}</td>
                    <td className="px-4 py-3 text-[var(--text-muted)]">{description}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <h3 className="mt-8 text-xl font-semibold text-[var(--ink)]">Example · countdown</h3>
          <div className="mt-3">
            <MacWindow title="jz-countdown.asm">
              <pre className="whitespace-pre-wrap font-mono text-sm leading-6 text-[#d8d2c8]">{`; counts R0 down to zero
LOAD R0 5
PRINT R0
SUB R0 R0 R1
JZ R0 done
JMP loop
done:
HALT`}</pre>
            </MacWindow>
          </div>

          <h3 className="mt-8 text-xl font-semibold text-[var(--ink)]">Reference sections</h3>
          <div className="mt-3 grid gap-3 md:grid-cols-2">
            {docsReferenceSections.map((section) => (
              <article key={section.title} className="rw-card p-4">
                <h4 className="font-semibold text-[var(--ink)]">{section.title}</h4>
                <div className="mt-3 grid gap-2 text-sm leading-6 text-[var(--text-muted)]">
                  {section.items.slice(0, 3).map((item) => (
                    <p key={item}>{item}</p>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </article>

        <aside className="border-t border-[var(--line)] p-5 xl:border-l xl:border-t-0">
          <div className="rw-eyebrow" style={{ color: 'var(--ink-3)' }}>
            On this page
          </div>
          <div className="mt-3 grid gap-2 text-sm text-[var(--text-muted)]">
            {['Syntax', 'Behavior', 'Instruction reference', 'Example', 'Related lessons'].map((item, index) => (
              <span
                key={item}
                className="border-l-2 pl-3"
                style={{
                  borderColor: index === 0 ? 'var(--accent)' : 'var(--line)',
                  color: index === 0 ? 'var(--accent)' : undefined,
                }}
              >
                {item}
              </span>
            ))}
          </div>

          <div className="mt-8 border-t border-[var(--line-2)] pt-5">
            <div className="rw-eyebrow" style={{ color: 'var(--ink-3)' }}>
              Contribute
            </div>
            <div className="mt-3 grid gap-2 text-sm text-[var(--text-muted)]">
              <span>Edit this page</span>
              <span>View on GitHub</span>
              <span>Report an error</span>
            </div>
          </div>
        </aside>
      </section>
    </div>
  );
}
