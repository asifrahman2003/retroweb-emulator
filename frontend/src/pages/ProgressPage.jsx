import MacWindow from '../components/MacWindow';

export default function ProgressPage({ challenges, challengeProgress, completedChallengesCount }) {
  const completionRatio = challenges.length ? Math.round((completedChallengesCount / challenges.length) * 100) : 0;

  return (
    <div className="space-y-8">
      <section className="rounded-[18px] border border-[var(--panel-border)] bg-[var(--panel-soft)] p-6 md:p-8">
        <p className="text-xs uppercase tracking-[0.24em] text-[var(--text-muted)]">
          Progress & Mastery
        </p>
        <h1 className="mt-3 text-3xl font-bold text-[var(--heading-color)] md:text-5xl">
          Progress should map to concepts, not just green checkmarks.
        </h1>
        <p className="mt-4 max-w-3xl text-sm leading-7 text-[var(--text-muted)] md:text-base">
          This page is the starting point for mastery graphs, learning streaks, certificates, and architecture readiness signals. The current local challenge completions already give it real data to render.
        </p>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <div className="rounded-[14px] border border-[var(--panel-border)] bg-[var(--panel)] p-5">
          <p className="text-xs uppercase tracking-[0.22em] text-[var(--text-muted)]">Completion</p>
          <h2 className="mt-3 text-3xl font-semibold text-[var(--text-main)]">{completionRatio}%</h2>
          <div className="mt-4 h-3 rounded-full bg-black/30">
            <div className="h-3 rounded-full bg-[var(--accent)]" style={{ width: `${completionRatio}%` }} />
          </div>
        </div>
        <div className="rounded-[14px] border border-[var(--panel-border)] bg-[var(--panel)] p-5">
          <p className="text-xs uppercase tracking-[0.22em] text-[var(--text-muted)]">Challenges Passed</p>
          <h2 className="mt-3 text-3xl font-semibold text-[var(--text-main)]">{completedChallengesCount}</h2>
        </div>
        <div className="rounded-[14px] border border-[var(--panel-border)] bg-[var(--panel)] p-5">
          <p className="text-xs uppercase tracking-[0.22em] text-[var(--text-muted)]">Challenges Remaining</p>
          <h2 className="mt-3 text-3xl font-semibold text-[var(--text-main)]">
            {Math.max(challenges.length - completedChallengesCount, 0)}
          </h2>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <MacWindow title="Mastery Checklist">
          <div className="space-y-4">
            {challenges.map((challenge) => {
              const complete = Boolean(challengeProgress[challenge.id]?.passed);
              return (
                <div key={challenge.id} className="rounded-xl border border-[var(--panel-border)] bg-[var(--panel-soft)] p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h2 className="text-lg font-semibold text-[var(--text-main)]">{challenge.title}</h2>
                      <p className="mt-2 text-sm text-[var(--text-muted)]">{challenge.prompt}</p>
                    </div>
                    <span className={`rounded-full px-3 py-1 text-xs ${complete ? 'bg-emerald-900 text-emerald-100' : 'bg-zinc-800 text-zinc-200'}`}>
                      {complete ? 'Passed' : 'Pending'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </MacWindow>

        <MacWindow title="Future Progress Features">
          <div className="space-y-4">
            {[
              'Topic-level mastery graph for registers, memory, jumps, graphics, and debugging.',
              'Placement diagnostics to recommend the right starting architecture.',
              'Assignment streaks, certificates, and cohort benchmarks for instructors.',
              'Cross-architecture readiness when MIPS and later tracks arrive.',
            ].map((item) => (
              <div key={item} className="rounded-xl border border-[var(--panel-border)] bg-[var(--panel-soft)] p-4 text-sm leading-7 text-[var(--text-muted)]">
                {item}
              </div>
            ))}
          </div>
        </MacWindow>
      </section>
    </div>
  );
}
