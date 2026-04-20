import MacWindow from '../components/MacWindow';

function formatSavedAt(savedAt) {
  if (!savedAt) {
    return 'Draft';
  }

  const date = new Date(savedAt);
  return Number.isNaN(date.getTime()) ? 'Saved' : date.toLocaleDateString();
}

export default function DashboardPage({
  savedPrograms,
  challengeProgress,
  completedChallengesCount,
  totalChallenges,
  totalExamples,
  vmStatusLabel,
  onNavigate,
}) {
  const recentPrograms = [...savedPrograms].sort((left, right) =>
    (right.savedAt ?? '').localeCompare(left.savedAt ?? ''),
  ).slice(0, 3);
  const completedRuns = Object.entries(challengeProgress)
    .filter(([, entry]) => entry?.passed)
    .sort((left, right) => (right[1]?.completedAt ?? '').localeCompare(left[1]?.completedAt ?? ''))
    .slice(0, 3);

  const summaryCards = [
    { label: 'Lessons Ready', value: String(totalExamples), detail: 'guided examples already scaffolded' },
    {
      label: 'Labs Completed',
      value: `${completedChallengesCount}/${totalChallenges}`,
      detail: 'challenge engine is live in the workspace',
    },
    { label: 'Saved Programs', value: String(savedPrograms.length), detail: 'locally persisted for now' },
    { label: 'VM Runtime', value: vmStatusLabel, detail: 'latest workspace runtime status' },
  ];

  return (
    <div className="space-y-8">
      <section className="rounded-[18px] border border-[var(--panel-border)] bg-[var(--panel-soft)] p-6 md:p-8">
        <div className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-[var(--text-muted)]">
              Learner Dashboard
            </p>
            <h1 className="mt-3 text-3xl font-bold text-[var(--heading-color)] md:text-5xl">
              Resume low-level practice with context, not guesswork.
            </h1>
            <p className="mt-4 max-w-3xl text-sm leading-7 text-[var(--text-muted)] md:text-base">
              This page is the learner home base: continue a program, jump into a lesson, inspect recent challenge results, and see what the platform should recommend next.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <button type="button" onClick={() => onNavigate('workspace')} className="rounded-full bg-[var(--accent)] px-5 py-3 text-sm font-semibold text-white">
              Resume Workspace
            </button>
            <button type="button" onClick={() => onNavigate('lessons')} className="rounded-full border border-[var(--panel-border)] bg-[var(--panel)] px-5 py-3 text-sm font-semibold text-[var(--text-main)]">
              Browse Lessons
            </button>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {summaryCards.map((card) => (
          <div key={card.label} className="rounded-[14px] border border-[var(--panel-border)] bg-[var(--panel)] p-5">
            <p className="text-xs uppercase tracking-[0.22em] text-[var(--text-muted)]">
              {card.label}
            </p>
            <h2 className="mt-3 text-2xl font-semibold text-[var(--text-main)]">{card.value}</h2>
            <p className="mt-2 text-sm text-[var(--text-muted)]">{card.detail}</p>
          </div>
        ))}
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <MacWindow title="Recommended Next Steps">
          <div className="grid gap-4 md:grid-cols-3">
            <button type="button" onClick={() => onNavigate('workspace')} className="rounded-xl border border-[var(--accent)] bg-[var(--accent-soft)] p-5 text-left">
              <p className="text-xs uppercase tracking-[0.22em] text-[var(--accent)]">Now</p>
              <h2 className="mt-2 text-lg font-semibold text-[var(--text-main)]">Debugger Practice</h2>
              <p className="mt-2 text-sm text-[var(--text-muted)]">
                Keep stepping through the current Retro VM and confirm memory writes by eye.
              </p>
            </button>
            <button type="button" onClick={() => onNavigate('labs')} className="rounded-xl border border-[var(--panel-border)] bg-[var(--panel-soft)] p-5 text-left">
              <p className="text-xs uppercase tracking-[0.22em] text-[var(--text-muted)]">Next</p>
              <h2 className="mt-2 text-lg font-semibold text-[var(--text-main)]">Challenge Queue</h2>
              <p className="mt-2 text-sm text-[var(--text-muted)]">
                Move from demos into checks that validate registers, memory, and runtime faults.
              </p>
            </button>
            <button type="button" onClick={() => onNavigate('reports')} className="rounded-xl border border-[var(--panel-border)] bg-[var(--panel-soft)] p-5 text-left">
              <p className="text-xs uppercase tracking-[0.22em] text-[var(--text-muted)]">Later</p>
              <h2 className="mt-2 text-lg font-semibold text-[var(--text-main)]">Execution Review</h2>
              <p className="mt-2 text-sm text-[var(--text-muted)]">
                Review trace and state diffs when the reporting layer grows beyond the live workspace.
              </p>
            </button>
          </div>
        </MacWindow>

        <MacWindow title="Recent Activity">
          <div className="space-y-4">
            {recentPrograms.length ? (
              recentPrograms.map((program) => (
                <div key={program.id} className="rounded-xl border border-[var(--panel-border)] bg-[var(--panel-soft)] p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h2 className="text-lg font-semibold text-[var(--text-main)]">{program.name}</h2>
                      <p className="mt-1 text-sm text-[var(--text-muted)]">
                        {program.isAssembly ? 'Assembly' : 'Raw bytes'} · {formatSavedAt(program.savedAt)}
                      </p>
                    </div>
                    <button type="button" onClick={() => onNavigate('programs')} className="rounded-full border border-[var(--panel-border)] px-3 py-2 text-xs text-[var(--text-main)]">
                      View
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="rounded-xl border border-dashed border-[var(--panel-border)] bg-[var(--panel-soft)] p-5 text-sm text-[var(--text-muted)]">
                Save a workspace program to make this dashboard feel like a real SaaS home screen.
              </div>
            )}

            <div className="rounded-xl border border-[var(--panel-border)] bg-[var(--panel-soft)] p-4">
              <p className="text-xs uppercase tracking-[0.22em] text-[var(--text-muted)]">Challenge Completions</p>
              <div className="mt-3 space-y-3">
                {completedRuns.length ? (
                  completedRuns.map(([challengeId, entry]) => (
                    <div key={challengeId} className="flex items-center justify-between gap-3 text-sm">
                      <span className="text-[var(--text-main)]">{challengeId}</span>
                      <span className="text-[var(--text-muted)]">{formatSavedAt(entry.completedAt)}</span>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-[var(--text-muted)]">
                    Completed challenges will surface here once learners build momentum.
                  </p>
                )}
              </div>
            </div>
          </div>
        </MacWindow>
      </section>
    </div>
  );
}
