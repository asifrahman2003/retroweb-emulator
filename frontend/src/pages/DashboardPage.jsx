function StatCard({ label, value, detail, accent = false }) {
  return (
    <article className="rw-card p-4">
      <div className="rw-eyebrow" style={{ color: accent ? 'var(--accent)' : 'var(--ink-3)' }}>
        {label}
      </div>
      <div className="mt-2 text-3xl font-semibold text-[var(--ink)]">{value}</div>
      <p className="mt-1 text-xs text-[var(--text-muted)]">{detail}</p>
    </article>
  );
}

function ProgressRing({ pct }) {
  return (
    <div
      className="relative flex h-16 w-16 shrink-0 items-center justify-center rounded-full"
      style={{
        background: `conic-gradient(var(--accent) ${pct}%, var(--line) 0)`,
      }}
    >
      <div className="absolute h-12 w-12 rounded-full bg-[var(--panel)]" />
      <span className="relative font-mono text-[12px] font-semibold text-[var(--ink)]">{pct}%</span>
    </div>
  );
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
  const recentPrograms = [...savedPrograms]
    .sort((left, right) => (right.savedAt ?? '').localeCompare(left.savedAt ?? ''))
    .slice(0, 4);

  const completedRuns = Object.entries(challengeProgress)
    .filter(([, entry]) => entry?.passed)
    .sort((left, right) => (right[1]?.completedAt ?? '').localeCompare(left[1]?.completedAt ?? ''))
    .slice(0, 4);

  const labPct = totalChallenges > 0
    ? Math.round((completedChallengesCount / totalChallenges) * 100)
    : 0;

  const stats = [
    ['Streak', '12 days', 'sample learner cadence', true],
    ['Lessons', `${totalExamples}`, 'guided examples ready', false],
    ['Labs', `${completedChallengesCount}/${totalChallenges}`, `${labPct}% complete`, false],
    ['Runtime', vmStatusLabel, 'WASM VM status', false],
  ];

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <div className="rw-eyebrow">Friday · Apr 20</div>
          <h1 className="mt-1 text-3xl font-semibold text-[var(--heading-color)]">
            Welcome back.
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-[var(--text-muted)]">
            Resume the next lesson, inspect recent work, or jump into the emulator workspace.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button type="button" onClick={() => onNavigate('lessons')}>
            Set a goal
          </button>
          <button
            type="button"
            onClick={() => onNavigate('workspace')}
            className="bg-[var(--accent)] font-semibold text-white"
            style={{ borderColor: 'var(--accent)' }}
          >
            Resume
          </button>
        </div>
      </header>

      <section className="grid grid-cols-2 gap-4 xl:grid-cols-4">
        {stats.map(([label, value, detail, accent]) => (
          <StatCard key={label} label={label} value={value} detail={detail} accent={accent} />
        ))}
      </section>

      <section className="grid gap-5 xl:grid-cols-[2fr_1fr]">
        <article className="rw-card p-5" style={{ borderTop: '3px solid var(--accent)' }}>
          <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
            <div className="min-w-0">
              <div className="rw-eyebrow">Continue learning</div>
              <h2 className="mt-2 text-xl font-semibold text-[var(--ink)]">
                Retro Architecture · Track 01
              </h2>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-[var(--text-muted)]">
                Registers, memory, the instruction cycle, and the debugging habits that make low-level systems less mysterious.
              </p>
            </div>
            <ProgressRing pct={labPct} />
          </div>

          <div className="rw-progress mt-5">
            <span style={{ width: `${Math.max(labPct, 3)}%` }} />
          </div>

          <div className="mt-5 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div className="flex flex-wrap gap-3 text-xs text-[var(--text-muted)]">
              <span>last opened locally</span>
              <span>{Math.max(totalChallenges - completedChallengesCount, 0)} labs remaining</span>
              <span>{recentPrograms.length} saved workspaces</span>
            </div>
            <div className="flex flex-wrap gap-2">
              <button type="button" onClick={() => onNavigate('lessons')}>
                Preview next
              </button>
              <button
                type="button"
                onClick={() => onNavigate('workspace')}
                className="bg-[var(--ink)] font-semibold text-[var(--panel)]"
                style={{ borderColor: 'var(--ink)' }}
              >
                Resume lesson
              </button>
            </div>
          </div>
        </article>

        <article className="rw-card p-5">
          <div className="rw-eyebrow" style={{ color: 'var(--ink-3)' }}>
            This week
          </div>
          <div className="mt-4 grid gap-3">
            {[
              ['lab', 'Complete one challenge', completedChallengesCount > 0 ? 'done' : 'next'],
              ['save', 'Save a workspace draft', savedPrograms.length > 0 ? 'done' : 'next'],
              ['docs', 'Review instruction reference', 'open'],
            ].map(([kind, title, status]) => (
              <div key={title} className="flex items-center justify-between gap-3 text-sm">
                <span className="font-mono text-[11px] text-[var(--ink-3)]">{kind}</span>
                <span className="min-w-0 flex-1 text-[var(--ink)]">{title}</span>
                <span className={status === 'done' ? 'rw-chip rw-chip-ok' : 'rw-chip'}>
                  {status}
                </span>
              </div>
            ))}
          </div>
          <div className="mt-5 border-t border-[var(--line-2)] pt-4">
            <div className="rw-eyebrow" style={{ color: 'var(--ink-3)' }}>
              Achievements
            </div>
            <div className="mt-3 flex gap-2">
              {['01', '12', 'R', '?', '?'].map((badge, index) => (
                <span
                  key={`${badge}-${index}`}
                  className="flex h-9 w-9 items-center justify-center rounded-full border font-mono text-[11px]"
                  style={{
                    borderColor: index < 3 ? 'var(--accent)' : 'var(--line)',
                    background: index < 3 ? 'var(--accent-soft)' : 'var(--panel-soft)',
                    color: index < 3 ? 'var(--accent)' : 'var(--ink-3)',
                  }}
                >
                  {badge}
                </span>
              ))}
            </div>
          </div>
        </article>
      </section>

      <section className="grid gap-5 xl:grid-cols-[1.35fr_1fr]">
        <article className="rw-card">
          <div className="flex items-center justify-between gap-3 border-b border-[var(--line-2)] p-4">
            <h2 className="font-semibold text-[var(--ink)]">Architecture tracks</h2>
            <button type="button" onClick={() => onNavigate('lessons')} className="px-2 py-1 text-[11px]">
              roadmap
            </button>
          </div>
          <div className="grid gap-4 p-4">
            {[
              ['Retro Core', labPct, 'live'],
              ['MIPS Track', 0, 'planned Q3'],
              ['Systems Lab', 0, 'planned Q4'],
            ].map(([title, pct, status]) => (
              <div key={title} className="grid gap-2 md:grid-cols-[160px_1fr_78px] md:items-center">
                <div className="flex items-center gap-2">
                  <span className={pct ? 'rw-chip rw-chip-accent' : 'rw-chip'}>{status}</span>
                  <b className="text-sm text-[var(--ink)]">{title}</b>
                </div>
                <div className="rw-progress">
                  <span style={{ width: `${Math.max(pct, 0)}%` }} />
                </div>
                <span className="font-mono text-[11px] text-[var(--ink-3)]">
                  {pct ? `${pct}%` : 'locked'}
                </span>
              </div>
            ))}
          </div>
        </article>

        <article className="rw-card">
          <div className="flex items-center justify-between border-b border-[var(--line-2)] p-4">
            <h2 className="font-semibold text-[var(--ink)]">Recent activity</h2>
            <span className="font-mono text-[11px] text-[var(--ink-3)]">local</span>
          </div>
          <div className="grid gap-0 p-2">
            {completedRuns.length ? (
              completedRuns.map(([id, entry]) => (
                <div key={id} className="flex items-center gap-3 border-b border-[var(--line-2)] px-2 py-3 text-sm last:border-b-0">
                  <span className="font-mono text-[11px] text-[var(--ink-3)]">
                    {entry.completedAt ? new Date(entry.completedAt).toLocaleDateString() : 'done'}
                  </span>
                  <span className="min-w-0 flex-1 truncate text-[var(--ink)]">{id}</span>
                  <span className="rw-chip rw-chip-ok">passed</span>
                </div>
              ))
            ) : (
              <p className="p-3 text-sm text-[var(--text-muted)]">
                Complete a lab to populate the activity feed.
              </p>
            )}
          </div>
        </article>
      </section>

      <section className="grid gap-5 xl:grid-cols-2">
        <article className="rw-card">
          <div className="flex items-center justify-between border-b border-[var(--line-2)] p-4">
            <h2 className="font-semibold text-[var(--ink)]">Saved workspaces</h2>
            <button type="button" onClick={() => onNavigate('programs')} className="px-2 py-1 text-[11px]">
              view all
            </button>
          </div>
          <div className="divide-y divide-[var(--line-2)]">
            {recentPrograms.length ? (
              recentPrograms.map((program) => (
                <button
                  key={program.id}
                  type="button"
                  onClick={() => onNavigate('programs')}
                  className="flex w-full items-center gap-3 rounded-none border-0 bg-transparent px-4 py-3 text-left"
                >
                  <span className="font-mono text-[11px] text-[var(--ink-3)]">
                    {program.isAssembly ? 'ASM' : 'RAW'}
                  </span>
                  <span className="min-w-0 flex-1 truncate text-sm text-[var(--ink)]">{program.name}</span>
                  <span className="rw-chip">open</span>
                </button>
              ))
            ) : (
              <p className="p-4 text-sm text-[var(--text-muted)]">
                Save from the workspace and drafts appear here.
              </p>
            )}
          </div>
        </article>

        <article className="rw-card">
          <div className="border-b border-[var(--line-2)] p-4">
            <h2 className="font-semibold text-[var(--ink)]">Recent docs</h2>
          </div>
          <div className="divide-y divide-[var(--line-2)]">
            {['Instruction set · LOAD / ADD', 'Control flow overview', 'Registers and memory', 'Framebuffer mapping'].map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => onNavigate('docs')}
                className="flex w-full items-center justify-between rounded-none border-0 bg-transparent px-4 py-3 text-left text-sm text-[var(--ink)]"
              >
                <span>{item}</span>
                <span className="font-mono text-[var(--ink-3)]">open</span>
              </button>
            ))}
          </div>
        </article>
      </section>
    </div>
  );
}
