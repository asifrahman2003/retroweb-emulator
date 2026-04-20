export default function AppSidebar({ sections, activeRoute, onNavigate }) {
  return (
    <aside
      className="flex w-full flex-col gap-2 border-b p-3 lg:min-h-full lg:border-b-0 lg:border-r"
      style={{
        background: 'var(--panel-soft)',
        borderColor: 'var(--line)',
      }}
    >
      <button
        type="button"
        onClick={() => onNavigate('dashboard')}
        className="mb-2 flex items-center gap-2 border-0 bg-transparent px-2 py-2 text-left shadow-none"
      >
        <span className="brand-mark" />
        <span>
          <span className="block text-sm font-semibold text-[var(--ink)]">retroWeb</span>
          <span className="block font-mono text-[10px] uppercase tracking-[0.12em] text-[var(--ink-3)]">
            learner app
          </span>
        </span>
      </button>

      {sections.map((section) => (
        <div key={section.title} className="pt-2">
          <p className="px-2 pb-1 font-mono text-[10px] uppercase tracking-[0.12em] text-[var(--ink-3)]">
            {section.title}
          </p>
          <div className="grid gap-0.5">
            {section.items.map((item) => {
              const active = item.id === activeRoute;

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => onNavigate(item.id)}
                  className="flex w-full items-center gap-2 rounded-[4px] px-2 py-1.5 text-left text-[13px]"
                  style={{
                    background: active ? 'var(--panel)' : 'transparent',
                    borderColor: active ? 'var(--line)' : 'transparent',
                    color: active ? 'var(--ink)' : 'var(--ink-2)',
                    fontWeight: active ? 600 : 400,
                    boxShadow: active ? 'inset 0 0 0 1px var(--line)' : 'none',
                  }}
                >
                  <span
                    className="h-3.5 w-3.5 shrink-0 rounded-[3px] border"
                    style={{
                      background: active ? 'var(--accent)' : 'var(--panel)',
                      borderColor: active ? 'var(--accent)' : 'var(--ink-4)',
                    }}
                    aria-hidden="true"
                  />
                  <span className="truncate">{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      ))}

      <div className="mt-auto hidden border-t pt-3 lg:block" style={{ borderColor: 'var(--line)' }}>
        <div className="px-2 text-[11px] text-[var(--ink-3)]">signed in as</div>
        <div className="mt-2 flex items-center gap-2 px-2">
          <span className="h-6 w-6 rounded-full border bg-[var(--panel)]" style={{ borderColor: 'var(--line)' }} />
          <span className="text-[12px] text-[var(--ink-2)]">local learner</span>
        </div>
      </div>
    </aside>
  );
}
