import MacWindow from '../components/MacWindow';

export default function LabsPage({ challenges, challengeProgress, onLoadChallenge }) {
  return (
    <div className="space-y-8">
      <section className="rounded-[18px] border border-[var(--panel-border)] bg-[var(--panel-soft)] p-6 md:p-8">
        <p className="text-xs uppercase tracking-[0.24em] text-[var(--text-muted)]">
          Lab Queue
        </p>
        <h1 className="mt-3 text-3xl font-bold text-[var(--heading-color)] md:text-5xl">
          Challenges should feel like applied debugging, not isolated quiz prompts.
        </h1>
        <p className="mt-4 max-w-3xl text-sm leading-7 text-[var(--text-muted)] md:text-base">
          This page is the placeholder for assignments, lab packets, hidden tests, deadlines, and feedback loops. The current local validator already powers the core checking path.
        </p>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <MacWindow title="Challenge Backlog">
          <div className="space-y-4">
            {challenges.map((challenge) => {
              const complete = Boolean(challengeProgress[challenge.id]?.passed);
              return (
                <div key={challenge.id} className="rounded-xl border border-[var(--panel-border)] bg-[var(--panel-soft)] p-5">
                  <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                    <div>
                      <p className="text-xs uppercase tracking-[0.22em] text-[var(--text-muted)]">
                        {complete ? 'Completed' : 'Ready'}
                      </p>
                      <h2 className="mt-2 text-xl font-semibold text-[var(--text-main)]">{challenge.title}</h2>
                      <p className="mt-3 text-sm leading-7 text-[var(--text-muted)]">{challenge.prompt}</p>
                      <div className="mt-3 space-y-1 text-sm text-[var(--text-muted)]">
                        {challenge.hints.map((hint) => (
                          <div key={hint}>• {hint}</div>
                        ))}
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => onLoadChallenge(challenge)}
                      className="rounded-full bg-[var(--accent)] px-4 py-3 text-sm font-semibold text-white"
                    >
                      Load Starter
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </MacWindow>

        <MacWindow title="Planned Lab Features">
          <div className="space-y-4">
            {[
              'Checkpoint tests with hidden validation and public starter code.',
              'Timed lab sessions, rubric criteria, and instructor comments.',
              'Replayable execution traces so learners can explain failures after submission.',
              'Cloud-backed attempts and cohort-aware analytics once Supabase is wired in.',
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
