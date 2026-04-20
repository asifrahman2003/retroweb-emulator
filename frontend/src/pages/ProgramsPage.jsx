import MacWindow from '../components/MacWindow';

function formatSavedAt(savedAt) {
  if (!savedAt) {
    return 'Unsaved';
  }

  const date = new Date(savedAt);
  return Number.isNaN(date.getTime()) ? 'Saved' : date.toLocaleString();
}

export default function ProgramsPage({ savedPrograms, examples, onOpenProgram, onLoadExample }) {
  return (
    <div className="space-y-8">
      <section className="rounded-[18px] border border-[var(--panel-border)] bg-[var(--panel-soft)] p-6 md:p-8">
        <p className="text-xs uppercase tracking-[0.24em] text-[var(--text-muted)]">
          Program Library
        </p>
        <h1 className="mt-3 text-3xl font-bold text-[var(--heading-color)] md:text-5xl">
          Saved work needs its own home if this is going to feel like a real product.
        </h1>
        <p className="mt-4 max-w-3xl text-sm leading-7 text-[var(--text-muted)] md:text-base">
          This page is the scaffold for drafts, templates, versions, and eventually cloud-backed projects. Right now it surfaces the local programs already persisted by the workspace.
        </p>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1fr_1fr]">
        <MacWindow title="Saved Programs">
          <div className="space-y-4">
            {savedPrograms.length ? (
              savedPrograms.map((program) => (
                <div key={program.id} className="rounded-xl border border-[var(--panel-border)] bg-[var(--panel-soft)] p-5">
                  <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                    <div>
                      <h2 className="text-xl font-semibold text-[var(--text-main)]">{program.name}</h2>
                      <p className="mt-2 text-sm text-[var(--text-muted)]">
                        {program.isAssembly ? 'Assembly' : 'Raw bytes'} · {formatSavedAt(program.savedAt)}
                      </p>
                      <pre className="mt-3 max-h-28 overflow-hidden whitespace-pre-wrap text-xs text-[var(--accent)]">
                        {program.code}
                      </pre>
                    </div>
                    <button
                      type="button"
                      onClick={() => onOpenProgram(program.id)}
                      className="rounded-full bg-[var(--accent)] px-4 py-3 text-sm font-semibold text-white"
                    >
                      Open in Workspace
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="rounded-xl border border-dashed border-[var(--panel-border)] bg-[var(--panel-soft)] p-5 text-sm text-[var(--text-muted)]">
                No saved programs yet. Save from the workspace and this page becomes the learner’s project shelf.
              </div>
            )}
          </div>
        </MacWindow>

        <MacWindow title="Starter Templates">
          <div className="space-y-4">
            {examples.map((example) => (
              <div key={example.id} className="rounded-xl border border-[var(--panel-border)] bg-[var(--panel-soft)] p-5">
                <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-[0.22em] text-[var(--text-muted)]">
                      {example.difficulty}
                    </p>
                    <h2 className="mt-2 text-xl font-semibold text-[var(--text-main)]">{example.title}</h2>
                    <p className="mt-3 text-sm leading-7 text-[var(--text-muted)]">{example.description}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => onLoadExample(example)}
                    className="rounded-full border border-[var(--panel-border)] px-4 py-3 text-sm font-semibold text-[var(--text-main)]"
                  >
                    Load Template
                  </button>
                </div>
              </div>
            ))}
          </div>
        </MacWindow>
      </section>
    </div>
  );
}
