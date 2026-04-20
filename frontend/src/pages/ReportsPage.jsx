import MacWindow from '../components/MacWindow';

function formatMemoryPreview(memorySnapshot) {
  const changedCells = [];

  for (let index = 0; index < memorySnapshot.length && changedCells.length < 8; index += 1) {
    if (memorySnapshot[index] !== 0) {
      changedCells.push({
        address: `0x${index.toString(16).padStart(4, '0')}`,
        value: memorySnapshot[index],
      });
    }
  }

  return changedCells;
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
  const nonZeroRegisters = registerValues.filter((value) => value !== 0).length;

  return (
    <div className="space-y-8">
      <section className="rounded-[18px] border border-[var(--panel-border)] bg-[var(--panel-soft)] p-6 md:p-8">
        <p className="text-xs uppercase tracking-[0.24em] text-[var(--text-muted)]">
          Execution Reports
        </p>
        <h1 className="mt-3 text-3xl font-bold text-[var(--heading-color)] md:text-5xl">
          Reports should explain what happened, why it happened, and how to improve the next run.
        </h1>
        <p className="mt-4 max-w-3xl text-sm leading-7 text-[var(--text-muted)] md:text-base">
          This scaffold turns the live runtime state into the starting shape for a full report surface: summary, timeline, collapsible state sections, and future export actions.
        </p>
      </section>

      <section className="grid gap-4 md:grid-cols-4">
        <div className="rounded-[14px] border border-[var(--panel-border)] bg-[var(--panel)] p-5">
          <p className="text-xs uppercase tracking-[0.22em] text-[var(--text-muted)]">Current PC</p>
          <h2 className="mt-3 text-2xl font-semibold text-[var(--text-main)]">0x{currentPc.toString(16).padStart(4, '0')}</h2>
        </div>
        <div className="rounded-[14px] border border-[var(--panel-border)] bg-[var(--panel)] p-5">
          <p className="text-xs uppercase tracking-[0.22em] text-[var(--text-muted)]">Runtime State</p>
          <h2 className="mt-3 text-2xl font-semibold text-[var(--text-main)]">{vmStatusLabel}</h2>
        </div>
        <div className="rounded-[14px] border border-[var(--panel-border)] bg-[var(--panel)] p-5">
          <p className="text-xs uppercase tracking-[0.22em] text-[var(--text-muted)]">Non-Zero Registers</p>
          <h2 className="mt-3 text-2xl font-semibold text-[var(--text-main)]">{nonZeroRegisters}</h2>
        </div>
        <div className="rounded-[14px] border border-[var(--panel-border)] bg-[var(--panel)] p-5">
          <p className="text-xs uppercase tracking-[0.22em] text-[var(--text-muted)]">Error Code</p>
          <h2 className="mt-3 text-2xl font-semibold text-[var(--text-main)]">{vmRuntimeState.lastError}</h2>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1fr_1fr]">
        <MacWindow title="Report Timeline">
          <div className="space-y-4">
            {[
              'Program loaded into VM memory and program length registered.',
              'Execution begins from PC 0x0000 after reset.',
              'Registers and memory update during run or step.',
              'HALT or runtime safety error closes the trace.',
            ].map((event, index) => (
              <div key={event} className="flex gap-4 rounded-xl border border-[var(--panel-border)] bg-[var(--panel-soft)] p-4">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--accent-soft)] text-sm font-semibold text-[var(--accent)]">
                  {index + 1}
                </div>
                <p className="text-sm leading-7 text-[var(--text-muted)]">{event}</p>
              </div>
            ))}
          </div>
        </MacWindow>

        <MacWindow title="Report Sections">
          <div className="space-y-3">
            <details open className="rounded-xl border border-[var(--panel-border)] bg-[var(--panel-soft)] p-4">
              <summary className="cursor-pointer font-semibold text-[var(--text-main)]">Register Snapshot</summary>
              <pre className="mt-3 whitespace-pre-wrap text-sm text-[var(--text-muted)]">
                {registerValues.map((value, index) => `R${index}: ${value}`).join('\n')}
              </pre>
            </details>
            <details open className="rounded-xl border border-[var(--panel-border)] bg-[var(--panel-soft)] p-4">
              <summary className="cursor-pointer font-semibold text-[var(--text-main)]">Memory Highlights</summary>
              <div className="mt-3 space-y-2 text-sm text-[var(--text-muted)]">
                {memoryPreview.length ? (
                  memoryPreview.map((cell) => (
                    <div key={cell.address}>
                      {cell.address}: {cell.value}
                    </div>
                  ))
                ) : (
                  <div>No changed memory cells yet. Run a lesson or challenge in the workspace.</div>
                )}
              </div>
            </details>
            <details className="rounded-xl border border-[var(--panel-border)] bg-[var(--panel-soft)] p-4">
              <summary className="cursor-pointer font-semibold text-[var(--text-main)]">Export & Raw Data</summary>
              <p className="mt-3 text-sm leading-7 text-[var(--text-muted)]">
                Add CSV/JSON/PDF exports, trace downloads, and rubric-linked feedback later. For now, jump back into the workspace to keep iterating.
              </p>
              <button type="button" onClick={() => onNavigate('workspace')} className="mt-4 rounded-full bg-[var(--accent)] px-4 py-3 text-sm font-semibold text-white">
                Back to Workspace
              </button>
            </details>
          </div>
        </MacWindow>
      </section>
    </div>
  );
}
