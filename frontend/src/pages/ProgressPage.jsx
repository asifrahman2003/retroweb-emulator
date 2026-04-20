function Heatmap() {
  return (
    <div className="grid grid-cols-12 gap-[3px]">
      {Array.from({ length: 84 }, (_, index) => {
        const value = (index * 17 + 7) % 5;
        const colors = ['var(--line-2)', '#f5d9c4', '#ecb285', '#d96a2c', '#a44e20'];

        return (
          <span
            key={index}
            className="aspect-square rounded-[2px]"
            style={{ background: colors[value] }}
          />
        );
      })}
    </div>
  );
}

function Metric({ label, value, detail, accent = false }) {
  return (
    <article className="rw-card p-5">
      <div className="rw-eyebrow" style={{ color: accent ? 'var(--accent)' : 'var(--ink-3)' }}>
        {label}
      </div>
      <div className="mt-2 text-4xl font-semibold text-[var(--ink)]">{value}</div>
      <p className="mt-1 text-xs text-[var(--text-muted)]">{detail}</p>
    </article>
  );
}

export default function ProgressPage({ challenges, challengeProgress, completedChallengesCount }) {
  const completionRatio = challenges.length
    ? Math.round((completedChallengesCount / challenges.length) * 100)
    : 0;

  const rows = challenges.map((challenge) => ({
    id: challenge.id,
    title: challenge.title,
    complete: Boolean(challengeProgress[challenge.id]?.passed),
  }));

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <div className="rw-eyebrow">Analytics</div>
          <h1 className="mt-1 text-3xl font-semibold text-[var(--heading-color)]">Progress</h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-[var(--text-muted)]">
            Learning analytics surface for completion, streaks, activity, and concept readiness.
          </p>
        </div>
        <div className="rw-segment">
          <span className="on">30d</span>
          <span>90d</span>
          <span>All time</span>
        </div>
      </header>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Metric label="Overall" value={`${completionRatio}%`} detail="across current labs" />
        <Metric label="Streak" value="12d" detail="sample streak signal" accent />
        <Metric label="Solved" value={completedChallengesCount} detail={`${challenges.length} challenges`} />
        <Metric
          label="Remaining"
          value={Math.max(challenges.length - completedChallengesCount, 0)}
          detail="ready for practice"
        />
      </section>

      <section className="grid gap-5 xl:grid-cols-[2fr_1fr]">
        <article className="rw-card p-5">
          <div className="flex items-center justify-between gap-3">
            <h2 className="font-semibold text-[var(--ink)]">Activity · last 12 weeks</h2>
            <span className="font-mono text-[11px] text-[var(--ink-3)]">84 days</span>
          </div>
          <div className="mt-4">
            <Heatmap />
          </div>
          <div className="mt-3 flex items-center justify-between text-[11px] text-[var(--ink-3)]">
            <span>12 weeks ago</span>
            <span>today</span>
          </div>
        </article>

        <article className="rw-card p-5">
          <h2 className="font-semibold text-[var(--ink)]">Completion by track</h2>
          <div className="mt-5 grid gap-5">
            {[
              ['Retro Core', completionRatio, 'active'],
              ['MIPS Track', 0, 'locked'],
              ['Systems Lab', 0, 'planned'],
            ].map(([track, pct, status]) => (
              <div key={track} className="grid grid-cols-[64px_1fr] gap-4">
                <div
                  className="relative flex h-14 w-14 items-center justify-center rounded-full"
                  style={{ background: `conic-gradient(var(--accent) ${pct}%, var(--line) 0)` }}
                >
                  <span className="absolute h-10 w-10 rounded-full bg-[var(--panel)]" />
                  <span className="relative font-mono text-[11px]">{pct}%</span>
                </div>
                <div>
                  <h3 className="font-semibold text-[var(--ink)]">{track}</h3>
                  <p className="text-sm text-[var(--text-muted)]">{status}</p>
                </div>
              </div>
            ))}
          </div>
        </article>
      </section>

      <section className="grid gap-5 xl:grid-cols-2">
        <article className="rw-card p-5">
          <h2 className="font-semibold text-[var(--ink)]">Strengths</h2>
          <div className="mt-4 grid gap-3">
            {[
              ['Register ops', 92, 'var(--ok)'],
              ['Data movement', 84, 'var(--ok)'],
              ['Output', 76, 'var(--ok)'],
              ['Simple loops', Math.max(completionRatio, 12), 'var(--accent)'],
            ].map(([label, pct, color]) => (
              <div key={label}>
                <div className="flex justify-between text-sm">
                  <span>{label}</span>
                  <b>{pct}%</b>
                </div>
                <div className="rw-progress mt-1">
                  <span style={{ width: `${pct}%`, background: color }} />
                </div>
              </div>
            ))}
          </div>
        </article>

        <article className="rw-card p-5">
          <h2 className="font-semibold text-[var(--ink)]">Needs practice</h2>
          <div className="mt-4 grid gap-3">
            {[
              ['Conditional jumps', 42],
              ['Subroutines', 28],
              ['Stack operations', 18],
              ['Addressing modes', 35],
            ].map(([label, pct]) => (
              <div key={label}>
                <div className="flex justify-between text-sm">
                  <span>{label}</span>
                  <b className="text-[var(--warn)]">{pct}%</b>
                </div>
                <div className="rw-progress mt-1">
                  <span style={{ width: `${pct}%`, background: 'var(--warn)' }} />
                </div>
              </div>
            ))}
          </div>
        </article>
      </section>

      <section className="rw-card overflow-hidden">
        <div className="flex items-center justify-between border-b border-[var(--line-2)] p-4">
          <h2 className="font-semibold text-[var(--ink)]">History</h2>
          <span className="font-mono text-[11px] text-[var(--ink-3)]">{rows.length} labs</span>
        </div>
        <div className="divide-y divide-[var(--line-2)]">
          {rows.map((row) => (
            <div key={row.id} className="grid gap-2 px-4 py-3 text-sm md:grid-cols-[90px_1fr_90px]">
              <span className="font-mono text-[11px] text-[var(--ink-3)]">local</span>
              <span className="text-[var(--ink)]">{row.title}</span>
              <span className={row.complete ? 'rw-chip rw-chip-ok' : 'rw-chip'}>
                {row.complete ? 'passed' : 'pending'}
              </span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
