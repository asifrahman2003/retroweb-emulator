import MacWindow from '../components/MacWindow';
import {
  PLATFORM_NAME,
  PLATFORM_TAGLINE,
  landingCapabilities,
  landingUseCases,
  learningPathBlueprint,
  platformNavigation,
} from '../platformContent';

export default function LandingPage({ onNavigate }) {
  const scaffoldPages = platformNavigation.flatMap((section) => section.items);

  return (
    <div className="space-y-8 md:space-y-12">
      <section className="grid gap-8 lg:grid-cols-[1.3fr_0.9fr] lg:items-center">
        <div className="space-y-6">
          <div className="inline-flex rounded-full border border-[var(--accent)] bg-[var(--accent-soft)] px-4 py-2 text-xs uppercase tracking-[0.24em] text-[var(--accent)]">
            Education SaaS Blueprint
          </div>
          <div className="space-y-4">
            <h1 className="max-w-4xl text-4xl font-bold tracking-tight text-[var(--heading-color)] md:text-6xl">
              {PLATFORM_NAME}
            </h1>
            <p className="max-w-3xl text-lg text-[var(--text-main)] md:text-xl">
              {PLATFORM_TAGLINE}
            </p>
            <p className="max-w-2xl text-sm leading-7 text-[var(--text-muted)] md:text-base">
              Turn the current emulator into a complete low-level learning platform: guided lessons, debugger-driven labs, challenge validation, saved workspaces, instructor analytics, and future real-architecture tracks.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => onNavigate('dashboard')}
              className="rounded-full bg-[var(--accent)] px-5 py-3 text-sm font-semibold text-white"
            >
              Launch Dashboard
            </button>
            <button
              type="button"
              onClick={() => onNavigate('workspace')}
              className="rounded-full border border-[var(--panel-border)] bg-[var(--panel)] px-5 py-3 text-sm font-semibold text-[var(--text-main)]"
            >
              Open Workspace
            </button>
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            {learningPathBlueprint.map((path) => (
              <div
                key={path.title}
                className="rounded-xl border border-[var(--panel-border)] bg-[var(--panel-soft)] p-4"
              >
                <p className="text-xs uppercase tracking-[0.22em] text-[var(--text-muted)]">
                  {path.stage}
                </p>
                <h2 className="mt-2 text-lg font-semibold text-[var(--text-main)]">
                  {path.title}
                </h2>
                <p className="mt-2 text-sm text-[var(--text-muted)]">{path.description}</p>
              </div>
            ))}
          </div>
        </div>

        <MacWindow title="Platform Preview" className="shadow-[0_24px_80px_rgba(0,0,0,0.28)]">
          <div className="space-y-4">
            <div className="grid gap-3 lg:grid-cols-[0.95fr_1.05fr]">
              <div className="rounded-xl border border-[var(--panel-border)] bg-[var(--output-bg)] p-4">
                <p className="text-xs uppercase tracking-[0.22em] text-[var(--text-muted)]">
                  Lesson Pane
                </p>
                <div className="mt-3 space-y-3">
                  <div className="h-3 w-24 rounded-full bg-[var(--accent)]/70" />
                  <div className="h-2 w-full rounded-full bg-white/10" />
                  <div className="h-2 w-5/6 rounded-full bg-white/10" />
                  <div className="h-2 w-4/6 rounded-full bg-white/10" />
                </div>
              </div>
              <div className="rounded-xl border border-[var(--panel-border)] bg-[var(--output-bg)] p-4">
                <p className="text-xs uppercase tracking-[0.22em] text-[var(--text-muted)]">
                  Workspace
                </p>
                <div className="mt-3 grid gap-3 sm:grid-cols-[1.2fr_0.8fr]">
                  <div className="min-h-40 rounded-lg border border-white/8 bg-black/40 p-3">
                    <div className="space-y-2 text-xs text-[var(--accent)]">
                      <div>LOAD R0 42</div>
                      <div>STORE R0 32</div>
                      <div>HALT</div>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="rounded-lg border border-white/8 bg-black/40 p-3 text-xs text-[var(--text-muted)]">
                      Registers
                    </div>
                    <div className="rounded-lg border border-white/8 bg-black/40 p-3 text-xs text-[var(--text-muted)]">
                      Memory
                    </div>
                    <div className="rounded-lg border border-white/8 bg-black/40 p-3 text-xs text-[var(--text-muted)]">
                      Trace
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              <div className="rounded-lg border border-[var(--panel-border)] bg-[var(--panel-soft)] p-4">
                <p className="text-xs uppercase tracking-[0.22em] text-[var(--text-muted)]">
                  Labs
                </p>
                <p className="mt-2 text-sm text-[var(--text-main)]">
                  Starter code, hidden checks, retry flow
                </p>
              </div>
              <div className="rounded-lg border border-[var(--panel-border)] bg-[var(--panel-soft)] p-4">
                <p className="text-xs uppercase tracking-[0.22em] text-[var(--text-muted)]">
                  Reports
                </p>
                <p className="mt-2 text-sm text-[var(--text-main)]">
                  Trace review, memory diffs, exportable summaries
                </p>
              </div>
              <div className="rounded-lg border border-[var(--panel-border)] bg-[var(--panel-soft)] p-4">
                <p className="text-xs uppercase tracking-[0.22em] text-[var(--text-muted)]">
                  Instructor
                </p>
                <p className="mt-2 text-sm text-[var(--text-main)]">
                  Cohorts, analytics, assignment workflows
                </p>
              </div>
            </div>
          </div>
        </MacWindow>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {landingCapabilities.map((feature) => (
          <div
            key={feature.title}
            className="rounded-[16px] border border-[var(--panel-border)] bg-[var(--panel-soft)] p-6"
          >
            <h2 className="text-xl font-semibold text-[var(--text-main)]">{feature.title}</h2>
            <p className="mt-3 text-sm leading-7 text-[var(--text-muted)]">
              {feature.description}
            </p>
          </div>
        ))}
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <MacWindow title="Use Cases">
          <div className="space-y-4">
            {landingUseCases.map((useCase) => (
              <div
                key={useCase.title}
                className="rounded-xl border border-[var(--panel-border)] bg-[var(--panel-soft)] p-5"
              >
                <h2 className="text-lg font-semibold text-[var(--text-main)]">{useCase.title}</h2>
                <p className="mt-2 text-sm leading-7 text-[var(--text-muted)]">
                  {useCase.description}
                </p>
              </div>
            ))}
          </div>
        </MacWindow>

        <MacWindow title="Initial Sitemap">
          <div className="grid gap-3">
            {scaffoldPages.map((page) => (
              <button
                key={page.id}
                type="button"
                onClick={() => onNavigate(page.id)}
                className="rounded-lg border border-[var(--panel-border)] bg-[var(--panel-soft)] px-4 py-4 text-left transition hover:border-[var(--accent)]"
              >
                <div className="font-semibold text-[var(--text-main)]">{page.label}</div>
                <div className="mt-1 text-sm text-[var(--text-muted)]">{page.blurb}</div>
              </button>
            ))}
          </div>
        </MacWindow>
      </section>
    </div>
  );
}
