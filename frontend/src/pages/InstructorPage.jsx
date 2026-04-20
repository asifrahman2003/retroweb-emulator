const learners = [
  ['AK', 'Alex Kowalski', 64, '8/24', '2h ago', '12d', 'ok'],
  ['MH', 'Mina Haddad', 82, '18/24', '1d ago', '22d', 'ok'],
  ['RS', 'Ravi Singh', 38, '4/24', '1d ago', '3d', 'warn'],
  ['JN', 'Jamie Nguyen', 12, '1/24', '9d ago', '0d', 'err'],
  ['TO', 'Theo Okafor', 92, '22/24', '4h ago', '28d', 'ok'],
  ['LS', 'Lin Sato', 44, '5/24', '3d ago', '1d', 'warn'],
];

const statusColor = {
  ok: 'var(--accent)',
  warn: 'var(--warn)',
  err: 'var(--err)',
};

export default function InstructorPage() {
  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <div className="rw-eyebrow">Admin</div>
          <h1 className="mt-1 text-3xl font-semibold text-[var(--heading-color)]">Instructor view</h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-[var(--text-muted)]">
            Cohort signal, learner triage, assignment review, and content operations in one teaching surface.
          </p>
        </div>
        <div className="rw-segment">
          <span className="on">Overview</span>
          <span>Learners</span>
          <span>Content</span>
          <span>Reports</span>
        </div>
      </header>

      <section className="grid gap-4 md:grid-cols-3 xl:grid-cols-6">
        {[
          ['Learners', '42', '38 active'],
          ['Median progress', '46%', 'on track'],
          ['At risk', '6', 'no activity 7d+', 'err'],
          ['Avg streak', '8d', 'cohort median'],
          ['Avg time', '6h', 'per week'],
          ['To grade', '14', 'submissions', 'accent'],
        ].map(([label, value, detail, tone]) => (
          <article key={label} className="rw-card p-4">
            <div className="rw-eyebrow" style={{ color: 'var(--ink-3)' }}>{label}</div>
            <div
              className="mt-2 text-2xl font-semibold"
              style={{ color: tone === 'err' ? 'var(--err)' : tone === 'accent' ? 'var(--accent)' : 'var(--ink)' }}
            >
              {value}
            </div>
            <p className="mt-1 text-xs text-[var(--text-muted)]">{detail}</p>
          </article>
        ))}
      </section>

      <section className="grid gap-5 xl:grid-cols-[1.2fr_1fr]">
        <article className="rw-card p-5">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-[var(--ink)]">Progress distribution</h2>
            <span className="font-mono text-[11px] text-[var(--ink-3)]">Module 2 · Control flow</span>
          </div>
          <div className="bar-chart mt-5 h-[118px]">
            {[3, 5, 7, 12, 15, 18, 14, 9, 6, 4].map((value, index) => (
              <span
                key={index}
                className={index > 3 && index < 7 ? 'a' : ''}
                style={{ height: `${value * 5}%` }}
              />
            ))}
          </div>
          <div className="mt-2 flex justify-between font-mono text-[11px] text-[var(--ink-3)]">
            <span>0%</span>
            <span>50%</span>
            <span>100%</span>
          </div>
        </article>

        <article className="rw-card p-5">
          <h2 className="font-semibold text-[var(--ink)]">Common failure points</h2>
          <div className="mt-4 grid gap-4">
            {[
              ['Lab · Jump table maze', '62% fail first try', 62],
              ['Lesson 07 · checkpoint Q3', '48% answer wrong', 48],
              ['Lab · String length', '41% exceed cycle budget', 41],
              ['Lesson 11 · stack exercise', '38% skip', 38],
            ].map(([title, detail, pct]) => (
              <div key={title}>
                <div className="flex justify-between gap-3 text-sm">
                  <span className="font-semibold text-[var(--ink)]">{title}</span>
                  <b className="text-[var(--err)]">{pct}%</b>
                </div>
                <p className="text-xs text-[var(--text-muted)]">{detail}</p>
                <div className="rw-progress mt-2">
                  <span style={{ width: `${pct}%`, background: 'var(--err)', opacity: 0.75 }} />
                </div>
              </div>
            ))}
          </div>
        </article>
      </section>

      <section className="rw-card overflow-hidden">
        <div className="flex flex-col gap-3 border-b border-[var(--line-2)] p-4 md:flex-row md:items-center md:justify-between">
          <h2 className="font-semibold text-[var(--ink)]">Learners</h2>
          <div className="flex flex-wrap gap-2">
            <div className="rw-search max-w-none md:max-w-[250px]">
              <span>Cmd+K</span>
              <span>search cohort...</span>
            </div>
            <div className="rw-segment">
              <span className="on">All</span>
              <span>At risk</span>
              <span>Top</span>
            </div>
          </div>
        </div>

        <div className="hidden grid-cols-[52px_1.4fr_1.4fr_90px_110px_80px_70px] gap-3 bg-[var(--panel-soft)] px-4 py-3 font-mono text-[10px] uppercase tracking-[0.1em] text-[var(--ink-3)] xl:grid">
          <span />
          <span>Learner</span>
          <span>Progress</span>
          <span>Labs</span>
          <span>Last active</span>
          <span>Streak</span>
          <span />
        </div>

        <div className="divide-y divide-[var(--line-2)]">
          {learners.map(([avatar, name, progress, labs, lastActive, streak, status]) => (
            <div
              key={name}
              className="grid gap-3 px-4 py-3 text-sm xl:grid-cols-[52px_1.4fr_1.4fr_90px_110px_80px_70px] xl:items-center"
            >
              <span
                className="flex h-8 w-8 items-center justify-center rounded-full border font-mono text-[11px] font-semibold"
                style={{
                  borderColor: statusColor[status],
                  background: status === 'ok' ? 'var(--panel-soft)' : status === 'warn' ? '#faf3e4' : '#fbeeea',
                  color: statusColor[status],
                }}
              >
                {avatar}
              </span>
              <span className="font-semibold text-[var(--ink)]">{name}</span>
              <span className="flex items-center gap-3">
                <span className="rw-progress w-28">
                  <span style={{ width: `${progress}%`, background: statusColor[status] }} />
                </span>
                <span className="font-mono text-[11px] text-[var(--ink-3)]">{progress}%</span>
              </span>
              <span className="font-mono text-[12px]">{labs}</span>
              <span className="text-[var(--text-muted)]">{lastActive}</span>
              <span className="font-mono text-[12px]">{streak}</span>
              <button type="button" className="px-2 py-1 text-[11px]">Open</button>
            </div>
          ))}
        </div>
      </section>

      <section className="grid gap-5 xl:grid-cols-[1.3fr_1fr]">
        <article className="rw-card overflow-hidden">
          <div className="flex items-center justify-between border-b border-[var(--line-2)] p-4">
            <h2 className="font-semibold text-[var(--ink)]">Review queue · 14</h2>
            <div className="rw-segment">
              <span className="on">Assignments</span>
              <span>Appeals</span>
              <span>Feedback</span>
            </div>
          </div>
          <div className="divide-y divide-[var(--line-2)]">
            {[
              ['AK', 'Alex Kowalski', 'Assignment 3 · Subroutines', 'submitted 2h ago', 'pending'],
              ['MH', 'Mina Haddad', 'Assignment 3 · Subroutines', 'submitted 5h ago', 'pending'],
              ['TO', 'Theo Okafor', 'Assignment 2 · revised', 'resubmitted 1d ago', 'pending'],
              ['RS', 'Ravi Singh', 'Assignment 3 · Subroutines', 'submitted 1d ago', 'auto-flagged'],
            ].map(([avatar, name, title, detail, status]) => (
              <div key={`${name}-${title}`} className="flex flex-wrap items-center gap-3 px-4 py-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-full border bg-[var(--panel-soft)] font-mono text-[10px] font-semibold">
                  {avatar}
                </span>
                <div className="min-w-[220px] flex-1">
                  <div className="text-sm font-semibold text-[var(--ink)]">{title}</div>
                  <div className="text-xs text-[var(--text-muted)]">{name} · {detail}</div>
                </div>
                <span className={status === 'auto-flagged' ? 'rw-chip rw-chip-warn' : 'rw-chip'}>
                  {status}
                </span>
                <button type="button">Review</button>
              </div>
            ))}
          </div>
        </article>

        <article className="rw-card p-5">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-[var(--ink)]">Content</h2>
            <button type="button">New draft</button>
          </div>
          <div className="mt-4 grid gap-3">
            {[
              ['Lesson · Pipelining intro', 'draft'],
              ['Lab · Custom assignment 4', 'scheduled Apr 27'],
              ['Quiz · Module 2 final', 'published'],
              ['Announcement · office hours', 'draft'],
            ].map(([title, status]) => (
              <div key={title} className="flex items-center justify-between gap-3 text-sm">
                <span className="text-[var(--ink)]">{title}</span>
                <span className={status === 'published' ? 'rw-chip rw-chip-ok' : 'rw-chip'}>{status}</span>
              </div>
            ))}
          </div>
        </article>
      </section>
    </div>
  );
}
