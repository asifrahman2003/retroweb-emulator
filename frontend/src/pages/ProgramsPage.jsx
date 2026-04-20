function formatSavedAt(savedAt) {
  if (!savedAt) {
    return 'Unsaved';
  }

  const date = new Date(savedAt);
  return Number.isNaN(date.getTime()) ? 'Saved' : date.toLocaleString();
}

function countLines(source = '') {
  return source.trim() ? source.trim().split(/\n/).length : 0;
}

export default function ProgramsPage({ savedPrograms, examples, onOpenProgram, onLoadExample }) {
  const latestProgram = [...savedPrograms].sort((left, right) =>
    (right.savedAt ?? '').localeCompare(left.savedAt ?? ''),
  )[0];

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <div className="rw-eyebrow">Program library</div>
          <h1 className="mt-1 text-3xl font-semibold text-[var(--heading-color)]">
            Saved workspaces
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-[var(--text-muted)]">
            A project shelf for local drafts, starter templates, and reusable assembly snippets.
          </p>
        </div>
        <span className="rw-chip rw-chip-accent">{savedPrograms.length} saved</span>
      </header>

      <section className="grid gap-4 md:grid-cols-3">
        <article className="rw-card p-5">
          <div className="rw-eyebrow" style={{ color: 'var(--ink-3)' }}>
            Saved programs
          </div>
          <div className="mt-2 text-4xl font-semibold text-[var(--ink)]">{savedPrograms.length}</div>
          <p className="mt-1 text-xs text-[var(--text-muted)]">stored in browser localStorage</p>
        </article>
        <article className="rw-card p-5">
          <div className="rw-eyebrow" style={{ color: 'var(--ink-3)' }}>
            Starter templates
          </div>
          <div className="mt-2 text-4xl font-semibold text-[var(--ink)]">{examples.length}</div>
          <p className="mt-1 text-xs text-[var(--text-muted)]">ready to load into workspace</p>
        </article>
        <article className="rw-card p-5">
          <div className="rw-eyebrow" style={{ color: 'var(--ink-3)' }}>
            Last edited
          </div>
          <div className="mt-2 truncate text-2xl font-semibold text-[var(--ink)]">
            {latestProgram?.name ?? 'No drafts yet'}
          </div>
          <p className="mt-1 text-xs text-[var(--text-muted)]">
            {latestProgram ? formatSavedAt(latestProgram.savedAt) : 'save from workspace'}
          </p>
        </article>
      </section>

      <section className="rw-card overflow-hidden">
        <div className="flex flex-col gap-3 border-b border-[var(--line-2)] p-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="font-semibold text-[var(--ink)]">Saved workspaces</h2>
            <p className="text-sm text-[var(--text-muted)]">Open, audit, or use as a base for a lab attempt.</p>
          </div>
          <div className="rw-search max-w-none md:max-w-[280px]">
            <span>Cmd+K</span>
            <span>search programs...</span>
          </div>
        </div>

        <div className="hidden grid-cols-[1.6fr_110px_130px_130px_92px] gap-4 border-b border-[var(--line-2)] bg-[var(--panel-soft)] px-4 py-3 font-mono text-[10px] uppercase tracking-[0.1em] text-[var(--ink-3)] md:grid">
          <span>Name</span>
          <span>Mode</span>
          <span>Size</span>
          <span>Saved</span>
          <span />
        </div>

        <div className="divide-y divide-[var(--line-2)]">
          {savedPrograms.length ? (
            savedPrograms.map((program) => (
              <div
                key={program.id}
                className="grid gap-3 px-4 py-4 md:grid-cols-[1.6fr_110px_130px_130px_92px] md:items-center"
              >
                <div className="min-w-0">
                  <h3 className="truncate font-semibold text-[var(--ink)]">{program.name}</h3>
                  <pre className="mt-2 max-h-14 overflow-hidden whitespace-pre-wrap font-mono text-[11px] leading-5 text-[var(--accent)]">
                    {program.code}
                  </pre>
                </div>
                <span className="rw-chip">{program.isAssembly ? 'Assembly' : 'Raw bytes'}</span>
                <span className="font-mono text-[12px] text-[var(--ink-3)]">
                  {countLines(program.code)} lines
                </span>
                <span className="text-sm text-[var(--text-muted)]">{formatSavedAt(program.savedAt)}</span>
                <button type="button" onClick={() => onOpenProgram(program.id)}>
                  Open
                </button>
              </div>
            ))
          ) : (
            <div className="p-5 text-sm text-[var(--text-muted)]">
              No saved programs yet. Save from the workspace and this shelf becomes active.
            </div>
          )}
        </div>
      </section>

      <section className="grid gap-5 xl:grid-cols-[1.35fr_0.65fr]">
        <article className="rw-card overflow-hidden">
          <div className="flex items-center justify-between border-b border-[var(--line-2)] p-4">
            <h2 className="font-semibold text-[var(--ink)]">Starter templates</h2>
            <span className="font-mono text-[11px] text-[var(--ink-3)]">load into editor</span>
          </div>
          <div className="grid gap-4 p-4 md:grid-cols-2">
            {examples.map((example) => (
              <article key={example.id} className="rw-card-soft p-4">
                <div className="flex items-center justify-between gap-3">
                  <span className="rw-chip">{example.difficulty}</span>
                  <span className="font-mono text-[11px] text-[var(--ink-3)]">
                    {example.assemblyMode === false ? 'raw' : 'asm'}
                  </span>
                </div>
                <h3 className="mt-3 font-semibold text-[var(--ink)]">{example.title}</h3>
                <p className="mt-2 text-sm leading-6 text-[var(--text-muted)]">{example.description}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {example.concepts.slice(0, 3).map((concept) => (
                    <span key={concept} className="rw-chip">
                      {concept}
                    </span>
                  ))}
                </div>
                <button type="button" onClick={() => onLoadExample(example)} className="mt-4 w-full">
                  Load template
                </button>
              </article>
            ))}
          </div>
        </article>

        <aside className="grid gap-5">
          <article className="rw-card p-5">
            <div className="rw-eyebrow" style={{ color: 'var(--ink-3)' }}>
              Versioning plan
            </div>
            <div className="mt-4 grid gap-3 text-sm text-[var(--text-muted)]">
              <p>Autosave snapshots every run or step.</p>
              <p>Compare drafts against starter templates.</p>
              <p>Export .retro files once the format stabilizes.</p>
            </div>
          </article>
          <article className="rw-card p-5">
            <div className="rw-eyebrow" style={{ color: 'var(--ink-3)' }}>
              Storage
            </div>
            <div className="mt-4 grid gap-3">
              {[
                ['Local drafts', savedPrograms.length ? 'active' : 'empty'],
                ['Cloud sync', 'planned'],
                ['GitHub gists', 'planned'],
              ].map(([label, status]) => (
                <div key={label} className="flex items-center justify-between gap-3 text-sm">
                  <span className="text-[var(--ink)]">{label}</span>
                  <span className={status === 'active' ? 'rw-chip rw-chip-ok' : 'rw-chip'}>{status}</span>
                </div>
              ))}
            </div>
          </article>
        </aside>
      </section>
    </div>
  );
}
