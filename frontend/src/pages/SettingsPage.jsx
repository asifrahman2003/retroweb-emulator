import { settingsBlueprint } from '../platformContent';

const settingTabs = [
  'Profile',
  'Learning goals',
  'Appearance',
  'Shortcuts',
  'Notifications',
  'Workspace',
  'Connections',
  'Security',
];

export default function SettingsPage({ isAssembly, vmStatusLabel, savedProgramsCount }) {
  return (
    <div className="grid gap-6 xl:grid-cols-[220px_minmax(0,1fr)]">
      <aside className="rw-card p-3 xl:sticky xl:top-24 xl:self-start">
        <div className="rw-eyebrow px-2 py-2" style={{ color: 'var(--ink-3)' }}>
          Settings
        </div>
        <div className="grid gap-1">
          {settingTabs.map((tab, index) => (
            <button
              key={tab}
              type="button"
              className="w-full rounded-[5px] px-3 py-2 text-left text-sm"
              style={{
                background: index === 0 ? 'var(--panel-soft)' : 'transparent',
                borderColor: index === 0 ? 'var(--line)' : 'transparent',
                color: index === 0 ? 'var(--ink)' : 'var(--ink-2)',
              }}
            >
              {tab}
            </button>
          ))}
        </div>
      </aside>

      <div className="space-y-6">
        <header className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="rw-eyebrow">Account</div>
            <h1 className="mt-1 text-3xl font-semibold text-[var(--heading-color)]">
              Profile & preferences
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-[var(--text-muted)]">
              Settings grouped by what learners feel: identity, workspace behavior, appearance, shortcuts, and future sync.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button type="button">Discard</button>
            <button
              type="button"
              className="bg-[var(--accent)] font-semibold text-white"
              style={{ borderColor: 'var(--accent)' }}
            >
              Save changes
            </button>
          </div>
        </header>

        <section className="rw-card p-5">
          <div className="rw-eyebrow" style={{ color: 'var(--ink-3)' }}>
            Profile
          </div>
          <div className="mt-4 flex flex-col gap-5 md:flex-row md:items-center">
            <span className="flex h-20 w-20 items-center justify-center rounded-full border border-[var(--accent)] bg-[var(--accent-soft)] font-mono text-xl font-semibold text-[var(--accent)]">
              RW
            </span>
            <div className="min-w-0 flex-1">
              <h2 className="text-xl font-semibold text-[var(--ink)]">Local learner</h2>
              <p className="mt-1 text-sm text-[var(--text-muted)]">
                Browser profile · {savedProgramsCount} saved programs · runtime {vmStatusLabel}
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                <span className="rw-chip">learner</span>
                <span className="rw-chip rw-chip-accent">retro core</span>
                <span className="rw-chip">{isAssembly ? 'assembly default' : 'raw bytes default'}</span>
              </div>
            </div>
            <button type="button">Change avatar</button>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <label className="block">
              <span className="font-mono text-[11px] uppercase tracking-[0.1em] text-[var(--ink-3)]">
                Display name
              </span>
              <input
                className="mt-2 w-full rounded-[5px] border border-[var(--line)] bg-[var(--panel-soft)] px-3 py-2 text-sm text-[var(--ink)]"
                defaultValue="Local learner"
              />
            </label>
            <label className="block">
              <span className="font-mono text-[11px] uppercase tracking-[0.1em] text-[var(--ink-3)]">
                Handle
              </span>
              <input
                className="mt-2 w-full rounded-[5px] border border-[var(--line)] bg-[var(--panel-soft)] px-3 py-2 text-sm text-[var(--ink)]"
                defaultValue="@retroweb"
              />
            </label>
          </div>
        </section>

        <section className="grid gap-5 xl:grid-cols-[1fr_1fr]">
          <article className="rw-card p-5">
            <div className="rw-eyebrow" style={{ color: 'var(--ink-3)' }}>
              Learning goals
            </div>
            <div className="mt-4 grid gap-4">
              {[
                ['Preferred track', ['Retro Core', 'MIPS', 'Systems'], 0],
                ['Weekly target', ['3h', '5h', '8h', '12h'], 1],
                ['Pace', ['Casual', 'Steady', 'Intensive'], 1],
              ].map(([label, options, activeIndex]) => (
                <div key={label} className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                  <span className="text-sm font-semibold text-[var(--ink)]">{label}</span>
                  <div className="rw-segment">
                    {options.map((option, index) => (
                      <span key={option} className={index === activeIndex ? 'on' : ''}>
                        {option}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </article>

          <article className="rw-card p-5">
            <div className="rw-eyebrow" style={{ color: 'var(--ink-3)' }}>
              Appearance
            </div>
            <div className="mt-4 grid gap-4">
              <div>
                <div className="mb-2 text-sm font-semibold text-[var(--ink)]">Accent</div>
                <div className="flex flex-wrap gap-2">
                  {['#d96a2c', '#c94a3f', '#3a6fb0', '#3d7a52', '#7a5cb0'].map((color, index) => (
                    <span
                      key={color}
                      className="h-8 w-8 rounded-full border"
                      style={{
                        background: color,
                        borderColor: index === 0 ? 'var(--ink)' : 'var(--line)',
                        borderWidth: index === 0 ? 2 : 1,
                      }}
                    />
                  ))}
                </div>
              </div>
              <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                <span className="text-sm font-semibold text-[var(--ink)]">Density</span>
                <div className="rw-segment">
                  <span className="on">Comfortable</span>
                  <span>Compact</span>
                </div>
              </div>
              <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                <span className="text-sm font-semibold text-[var(--ink)]">Code font</span>
                <span className="rw-chip">JetBrains Mono</span>
              </div>
            </div>
          </article>
        </section>

        <section className="rw-card overflow-hidden">
          <div className="border-b border-[var(--line-2)] p-4">
            <h2 className="font-semibold text-[var(--ink)]">Keyboard shortcuts</h2>
          </div>
          <div className="divide-y divide-[var(--line-2)]">
            {[
              ['Run VM', 'Cmd R'],
              ['Step', 'Cmd Right'],
              ['Step back', 'Cmd Left'],
              ['Reset', 'Cmd Shift R'],
              ['Toggle lesson drawer', 'Cmd B'],
              ['Toggle assistant', 'Cmd /'],
              ['Jump to docs', 'Cmd K'],
            ].map(([action, shortcut]) => (
              <div key={action} className="flex items-center justify-between gap-4 px-4 py-3 text-sm">
                <span className="text-[var(--ink)]">{action}</span>
                <span className="rounded-[4px] border border-[var(--line)] bg-[var(--panel-soft)] px-2 py-1 font-mono text-[11px] text-[var(--ink-2)]">
                  {shortcut}
                </span>
              </div>
            ))}
          </div>
        </section>

        <section className="grid gap-5 xl:grid-cols-[1fr_1fr]">
          <article className="rw-card p-5">
            <div className="rw-eyebrow" style={{ color: 'var(--ink-3)' }}>
              Configuration blueprint
            </div>
            <div className="mt-4 grid gap-3">
              {settingsBlueprint.map((group) => (
                <div key={group.title} className="border-b border-[var(--line-2)] pb-3 last:border-b-0 last:pb-0">
                  <h3 className="text-sm font-semibold text-[var(--ink)]">{group.title}</h3>
                  <p className="mt-1 text-sm leading-6 text-[var(--text-muted)]">{group.description}</p>
                </div>
              ))}
            </div>
          </article>

          <article className="rw-card p-5">
            <div className="rw-eyebrow" style={{ color: 'var(--ink-3)' }}>
              Security & data
            </div>
            <div className="mt-4 grid gap-3">
              {[
                ['Local storage', 'active'],
                ['Cloud sync', 'planned'],
                ['Export data', 'planned'],
                ['Delete account', 'disabled'],
              ].map(([label, status]) => (
                <div key={label} className="flex items-center justify-between gap-3 text-sm">
                  <span className="text-[var(--ink)]">{label}</span>
                  <span className={status === 'active' ? 'rw-chip rw-chip-ok' : 'rw-chip'}>
                    {status}
                  </span>
                </div>
              ))}
            </div>
          </article>
        </section>
      </div>
    </div>
  );
}
