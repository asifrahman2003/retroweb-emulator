const labShelves = [
  ['Registers', 'Swap values, track arithmetic, inspect register state.'],
  ['Memory', 'Move data through addresses and reason about side effects.'],
  ['Control flow', 'Loops, branches, and HALT conditions.'],
  ['Framebuffer', 'Pixel output and memory-mapped display practice.'],
];

export default function LabsPage({ challenges, challengeProgress, onLoadChallenge }) {
  const solvedCount = challenges.filter((challenge) => challengeProgress[challenge.id]?.passed).length;
  const featured = challenges.find((challenge) => !challengeProgress[challenge.id]?.passed) ?? challenges[0];

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <div className="rw-eyebrow">Practice</div>
          <h1 className="mt-1 text-3xl font-semibold text-[var(--heading-color)]">Labs</h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-[var(--text-muted)]">
            Challenge library with starter code, hints, and local validation against machine state.
          </p>
        </div>
        <span className="rw-chip rw-chip-accent">
          {solvedCount}/{challenges.length} solved
        </span>
      </header>

      {featured ? (
        <section className="rw-card-soft grid gap-6 p-5 xl:grid-cols-[1.15fr_0.85fr]" style={{ borderColor: 'var(--accent)' }}>
          <div>
            <div className="flex flex-wrap gap-2">
              <span className="rw-chip rw-chip-accent">weekly challenge</span>
              <span className="rw-chip">+100 xp</span>
              <span className="rw-chip">local validator</span>
            </div>
            <h2 className="mt-4 text-2xl font-semibold text-[var(--ink)]">{featured.title}</h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-[var(--text-muted)]">
              {featured.prompt}
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              {featured.hints.slice(0, 3).map((hint) => (
                <span key={hint} className="rw-chip">
                  {hint}
                </span>
              ))}
            </div>
            <div className="mt-5 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => onLoadChallenge(featured)}
                className="bg-[var(--accent)] font-semibold text-white"
                style={{ borderColor: 'var(--accent)' }}
              >
                Start challenge
              </button>
              <button type="button">View rubric</button>
            </div>
          </div>
          <div className="flex min-h-[190px] items-center justify-center rounded-[6px] border border-dashed border-[var(--ink-4)] bg-[var(--panel)] p-5 text-center font-mono text-[11px] uppercase tracking-[0.08em] text-[var(--ink-3)]">
            framebuffer preview · test states · hidden checks
          </div>
        </section>
      ) : null}

      <section className="rw-card sticky top-[72px] z-10 flex flex-col gap-3 p-3 md:flex-row md:items-center md:justify-between">
        <div className="rw-segment">
          <span className="on">All</span>
          <span>Beginner</span>
          <span>Intermediate</span>
          <span>Advanced</span>
        </div>
        <div className="rw-segment">
          <span className="on">Recommended</span>
          <span>Difficulty</span>
          <span>Newest</span>
        </div>
      </section>

      {labShelves.map(([shelf, description], shelfIndex) => {
        const shelfChallenges = challenges.filter((_, index) => index % labShelves.length === shelfIndex);

        return (
          <section key={shelf} className="space-y-3">
            <div className="flex items-end justify-between gap-4">
              <div>
                <div className="rw-eyebrow">{shelf}</div>
                <h2 className="mt-1 text-xl font-semibold text-[var(--ink)]">{shelf}</h2>
                <p className="text-sm text-[var(--text-muted)]">{description}</p>
              </div>
              <span className="font-mono text-[11px] text-[var(--ink-3)]">
                {shelfChallenges.length || '0'} labs
              </span>
            </div>

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              {shelfChallenges.length ? (
                shelfChallenges.map((challenge) => {
                  const complete = Boolean(challengeProgress[challenge.id]?.passed);

                  return (
                    <article
                      key={challenge.id}
                      className="rw-card p-4"
                      style={{
                        borderColor: complete ? '#b7d0bf' : 'var(--line)',
                      }}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-mono text-[11px] text-[var(--ink-3)]">LAB</span>
                        <span className={complete ? 'rw-chip rw-chip-ok' : 'rw-chip'}>
                          {complete ? 'solved' : 'ready'}
                        </span>
                      </div>
                      <h3 className="mt-3 font-semibold text-[var(--ink)]">{challenge.title}</h3>
                      <p className="mt-2 line-clamp-3 text-sm leading-6 text-[var(--text-muted)]">
                        {challenge.prompt}
                      </p>
                      <button
                        type="button"
                        onClick={() => onLoadChallenge(challenge)}
                        className="mt-4 w-full"
                      >
                        Load starter
                      </button>
                    </article>
                  );
                })
              ) : (
                <article className="rw-card p-4 text-sm text-[var(--text-muted)]">
                  More labs can be slotted into this shelf as the curriculum grows.
                </article>
              )}
            </div>
          </section>
        );
      })}
    </div>
  );
}
