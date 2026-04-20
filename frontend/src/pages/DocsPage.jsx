import MacWindow from '../components/MacWindow';
import { docsReferenceSections } from '../platformContent';

const instructionRows = [
  ['LOAD Rx, imm', 'Load an immediate byte value into Rx.'],
  ['STORE Rx, addr', 'Store Rx into memory at byte address 0-255 in the current assembler profile.'],
  ['ADD / SUB', 'Compute with register operands and wrap the result to an 8-bit value.'],
  ['PRINT Rx', 'Append the register value to runtime output.'],
  ['JMP addr', 'Jump to an instruction address within the loaded program.'],
  ['JZ Rx, addr', 'Jump only if the given register equals zero.'],
  ['PIX x, y, c', 'Plot an immediate framebuffer pixel.'],
  ['PIXR Rx, Ry, Rc', 'Plot a framebuffer pixel from registers.'],
  ['HALT', 'Stop execution cleanly.'],
];

export default function DocsPage() {
  return (
    <div className="space-y-8">
      <section className="rounded-[18px] border border-[var(--panel-border)] bg-[var(--panel-soft)] p-6 md:p-8">
        <p className="text-xs uppercase tracking-[0.24em] text-[var(--text-muted)]">
          Docs & Help
        </p>
        <h1 className="mt-3 text-3xl font-bold text-[var(--heading-color)] md:text-5xl">
          Documentation should teach the model of the machine, not just list commands.
        </h1>
        <p className="mt-4 max-w-3xl text-sm leading-7 text-[var(--text-muted)] md:text-base">
          This page is the permanent home for references, FAQs, interpretation guides, and onboarding docs. It replaces ad hoc floating help windows with a product-level documentation surface.
        </p>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1fr_1fr]">
        <MacWindow title="Instruction Reference">
          <div className="overflow-hidden rounded-xl border border-[var(--panel-border)]">
            <table className="w-full border-collapse text-sm">
              <thead className="bg-[var(--window-header-bg)] text-[var(--text-muted)]">
                <tr>
                  <th className="px-4 py-3 text-left">Instruction</th>
                  <th className="px-4 py-3 text-left">Explanation</th>
                </tr>
              </thead>
              <tbody>
                {instructionRows.map(([instruction, description]) => (
                  <tr key={instruction} className="border-t border-[var(--panel-border)] bg-[var(--panel-soft)]">
                    <td className="px-4 py-3 text-[var(--accent)]">{instruction}</td>
                    <td className="px-4 py-3 text-[var(--text-muted)]">{description}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </MacWindow>

        <MacWindow title="Reference Sections">
          <div className="space-y-4">
            {docsReferenceSections.map((section) => (
              <div key={section.title} className="rounded-xl border border-[var(--panel-border)] bg-[var(--panel-soft)] p-5">
                <h2 className="text-lg font-semibold text-[var(--text-main)]">{section.title}</h2>
                <div className="mt-3 space-y-2 text-sm text-[var(--text-muted)]">
                  {section.items.map((item) => (
                    <div key={item}>• {item}</div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </MacWindow>
      </section>

      <MacWindow title="FAQs">
        <div className="grid gap-4 md:grid-cols-2">
          {[
            ['Why start with a custom VM?', 'Because learners can see the entire machine state without fighting a production-grade toolchain on day one.'],
            ['What should come after Retro?', 'A debugger-first real ISA such as MIPS or RISC-V once the learner understands the runtime model.'],
            ['How should reports work later?', 'Capture traces, state diffs, rubric comments, and exportable artifacts for instructors and learners.'],
            ['How should cloud persistence work?', 'Move saved programs, attempts, and lesson progress into Supabase when the platform backend is introduced.'],
          ].map(([question, answer]) => (
            <div key={question} className="rounded-xl border border-[var(--panel-border)] bg-[var(--panel-soft)] p-5">
              <h2 className="text-lg font-semibold text-[var(--text-main)]">{question}</h2>
              <p className="mt-3 text-sm leading-7 text-[var(--text-muted)]">{answer}</p>
            </div>
          ))}
        </div>
      </MacWindow>
    </div>
  );
}
