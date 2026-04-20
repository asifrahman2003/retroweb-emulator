export default function AppSidebar({ sections, activeRoute, onNavigate }) {
  return (
    <aside className="w-full rounded-[16px] border border-[var(--panel-border)] bg-[var(--panel-soft)] p-4 lg:sticky lg:top-24 lg:w-72 lg:self-start">
      <div className="mb-5">
        <p className="text-xs uppercase tracking-[0.28em] text-[var(--text-muted)]">
          Platform Map
        </p>
        <h2 className="mt-2 text-xl font-semibold text-[var(--heading-color)]">
          Learning SaaS Shell
        </h2>
        <p className="mt-2 text-sm text-[var(--text-muted)]">
          This navigation is the scaffolding for lessons, labs, reports, instructors, and account workflows.
        </p>
      </div>

      <div className="space-y-5">
        {sections.map((section) => (
          <div key={section.title}>
            <p className="mb-2 text-xs uppercase tracking-[0.24em] text-[var(--text-muted)]">
              {section.title}
            </p>
            <div className="space-y-2">
              {section.items.map((item) => {
                const active = item.id === activeRoute;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => onNavigate(item.id)}
                    className={`w-full rounded-lg border px-4 py-3 text-left transition ${
                      active
                        ? 'border-[var(--accent)] bg-[var(--accent-soft)] text-[var(--text-main)]'
                        : 'border-[var(--panel-border)] bg-[var(--panel)] text-[var(--text-muted)] hover:border-[var(--accent)] hover:text-[var(--text-main)]'
                    }`}
                  >
                    <div className="font-semibold">{item.label}</div>
                    <div className="mt-1 text-xs opacity-80">{item.blurb}</div>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </aside>
  );
}
