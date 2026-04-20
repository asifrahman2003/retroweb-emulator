import { describeVmError } from '../vmLayout';

function formatMemoryPreview(memorySnapshot) {
  const changedCells = [];

  for (let index = 0; index < memorySnapshot.length && changedCells.length < 12; index += 1) {
    if (memorySnapshot[index] !== 0) {
      changedCells.push({
        address: `0x${index.toString(16).padStart(4, '0')}`,
        value: memorySnapshot[index],
      });
    }
  }

  return changedCells;
}

function Metric({ label, value, detail, accent = false }) {
  return (
    <article className="rw-card p-4">
      <div className="rw-eyebrow" style={{ color: accent ? 'var(--accent)' : 'var(--ink-3)' }}>
        {label}
      </div>
      <div className="mt-2 text-2xl font-semibold text-[var(--ink)]">{value}</div>
      <p className="mt-1 text-xs text-[var(--text-muted)]">{detail}</p>
    </article>
  );
}

export default function ReportsPage({
  registerValues,
  memorySnapshot,
  currentPc,
  vmStatusLabel,
  vmRuntimeState,
  onNavigate,
}) {
  const memoryPreview = formatMemoryPreview(memorySnapshot);
  const nonZeroRegisters = registerValues.filter((value) => value !== 0);
  const errorLabel = describeVmError(vmRuntimeState.lastError);

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <div className="rw-eyebrow">Execution review</div>
          <h1 className="mt-1 text-3xl font-semibold text-[var(--heading-color)]">Reports</h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-[var(--text-muted)]">
            Summarize the latest VM run with timeline, register snapshot, memory highlights, and export-ready sections.
          </p>
        </div>
        <button type="button" onClick={() => onNavigate('workspace')}>
          Back to workspace
        </button>
      </header>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Metric
          label="Current PC"
          value={`0x${currentPc.toString(16).padStart(4, '0')}`}
          detail="program counter"
          accent
        />
        <Metric label="Runtime state" value={vmStatusLabel} detail={vmRuntimeState.halted ? 'halted cleanly' : 'latest state'} />
        <Metric label="Non-zero registers" value={nonZeroRegisters.length} detail={`${registerValues.length} registers tracked`} />
        <Metric label="Error" value={vmRuntimeState.lastError} detail={errorLabel} />
      </section>

      <section className="rw-card overflow-hidden">
        <div className="flex flex-col gap-3 border-b border-[var(--line-2)] p-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="font-semibold text-[var(--ink)]">Run summary</h2>
            <p className="text-sm text-[var(--text-muted)]">Current machine state captured from the workspace.</p>
          </div>
          <div className="rw-segment">
            <span className="on">Summary</span>
            <span>Trace</span>
            <span>Export</span>
          </div>
        </div>

        <div className="grid gap-5 p-4 xl:grid-cols-[1.2fr_0.8fr]">
          <article className="rw-card-soft p-4">
            <div className="rw-eyebrow" style={{ color: 'var(--ink-3)' }}>
              Timeline
            </div>
            <div className="mt-4 grid gap-3">
              {[
                ['01', 'Program loaded into VM memory.'],
                ['02', 'Program length registered and runtime reset.'],
                ['03', 'Run or step operation refreshed registers and memory.'],
                ['04', vmRuntimeState.halted ? 'HALT reached.' : 'Runtime is ready for another step.'],
              ].map(([step, label]) => (
                <div key={step} className="grid grid-cols-[42px_1fr] gap-3">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full border border-[var(--accent)] bg-[var(--accent-soft)] font-mono text-[11px] text-[var(--accent)]">
                    {step}
                  </span>
                  <p className="self-center text-sm text-[var(--text-muted)]">{label}</p>
                </div>
              ))}
            </div>
          </article>

          <article className="rw-card-soft p-4">
            <div className="rw-eyebrow" style={{ color: 'var(--ink-3)' }}>
              Findings
            </div>
            <div className="mt-4 grid gap-3 text-sm">
              <div className="flex justify-between gap-3">
                <span className="text-[var(--text-muted)]">Halted</span>
                <span className={vmRuntimeState.halted ? 'rw-chip rw-chip-ok' : 'rw-chip'}>
                  {vmRuntimeState.halted ? 'yes' : 'no'}
                </span>
              </div>
              <div className="flex justify-between gap-3">
                <span className="text-[var(--text-muted)]">Memory writes</span>
                <span className="rw-chip">{memoryPreview.length}</span>
              </div>
              <div className="flex justify-between gap-3">
                <span className="text-[var(--text-muted)]">Register activity</span>
                <span className="rw-chip">{nonZeroRegisters.length}</span>
              </div>
              <button
                type="button"
                onClick={() => onNavigate('workspace')}
                className="mt-2 bg-[var(--accent)] font-semibold text-white"
                style={{ borderColor: 'var(--accent)' }}
              >
                Re-run in workspace
              </button>
            </div>
          </article>
        </div>
      </section>

      <section className="grid gap-5 xl:grid-cols-[1fr_1fr]">
        <article className="rw-card overflow-hidden">
          <div className="border-b border-[var(--line-2)] p-4">
            <h2 className="font-semibold text-[var(--ink)]">Register snapshot</h2>
          </div>
          <div className="grid grid-cols-2 gap-px bg-[var(--line-2)] p-px md:grid-cols-4">
            {registerValues.map((value, index) => (
              <div key={index} className="bg-[var(--panel)] p-4">
                <div className="font-mono text-[11px] text-[var(--ink-3)]">R{index}</div>
                <div className={value ? 'mt-1 font-mono text-lg font-semibold text-[var(--accent)]' : 'mt-1 font-mono text-lg font-semibold text-[var(--ink)]'}>
                  {value}
                </div>
              </div>
            ))}
          </div>
        </article>

        <article className="rw-card overflow-hidden">
          <div className="border-b border-[var(--line-2)] p-4">
            <h2 className="font-semibold text-[var(--ink)]">Memory highlights</h2>
          </div>
          <div className="divide-y divide-[var(--line-2)]">
            {memoryPreview.length ? (
              memoryPreview.map((cell) => (
                <div key={cell.address} className="grid grid-cols-[120px_1fr] px-4 py-3 text-sm">
                  <span className="font-mono text-[var(--ink-3)]">{cell.address}</span>
                  <span className="font-mono text-[var(--accent)]">{cell.value}</span>
                </div>
              ))
            ) : (
              <p className="p-4 text-sm text-[var(--text-muted)]">
                No non-zero memory cells yet. Run a lesson or challenge in the workspace.
              </p>
            )}
          </div>
        </article>
      </section>

      <section className="grid gap-5 xl:grid-cols-[1.2fr_0.8fr]">
        <article className="rw-card p-5">
          <h2 className="font-semibold text-[var(--ink)]">Report sections</h2>
          <div className="mt-4 grid gap-3">
            {[
              ['Trace download', 'instruction-by-instruction timeline', 'planned'],
              ['State diff', 'before and after registers/memory', 'active'],
              ['Rubric notes', 'challenge-specific feedback', 'planned'],
              ['Export bundle', 'JSON/CSV/PDF for instructors', 'planned'],
            ].map(([title, detail, status]) => (
              <div key={title} className="flex items-center justify-between gap-3 border-b border-[var(--line-2)] pb-3 last:border-b-0 last:pb-0">
                <div>
                  <h3 className="text-sm font-semibold text-[var(--ink)]">{title}</h3>
                  <p className="text-xs text-[var(--text-muted)]">{detail}</p>
                </div>
                <span className={status === 'active' ? 'rw-chip rw-chip-ok' : 'rw-chip'}>{status}</span>
              </div>
            ))}
          </div>
        </article>

        <article className="rw-card p-5">
          <h2 className="font-semibold text-[var(--ink)]">Next action</h2>
          <p className="mt-3 text-sm leading-6 text-[var(--text-muted)]">
            The report is most useful once a program has been stepped or run. Jump back to the workspace to produce a richer trace.
          </p>
          <button
            type="button"
            onClick={() => onNavigate('workspace')}
            className="mt-5 w-full bg-[var(--ink)] font-semibold text-[var(--panel)]"
            style={{ borderColor: 'var(--ink)' }}
          >
            Open workspace
          </button>
        </article>
      </section>
    </div>
  );
}
