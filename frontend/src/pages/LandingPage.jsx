import MacWindow from '../components/MacWindow';
import {
  PLATFORM_NAME,
  PLATFORM_TAGLINE,
  landingCapabilities,
  landingUseCases,
  learningPathBlueprint,
  platformNavigation,
} from '../platformContent';

const productStats = [
  ['42', 'lessons planned'],
  ['60+', 'labs mapped'],
  ['WASM', 'runtime core'],
];

function ProductPreview() {
  const memoryCells = Array.from({ length: 32 }, (_, index) => {
    const hot = index === 5;
    const warm = index > 12 && index < 16;

    return (
      <span
        key={index}
        className="rounded-[2px] px-1 py-0.5 text-center"
        style={{
          background: hot ? 'var(--accent)' : warm ? 'rgba(217, 106, 44, 0.28)' : '#2a2c30',
          color: hot ? '#fff' : '#b8b3a9',
        }}
      >
        {index.toString(16).padStart(2, '0')}
      </span>
    );
  });

  return (
    <MacWindow title="retroWeb · workspace" className="shadow-[var(--shadow-card)]">
      <div className="grid min-h-[286px] gap-px overflow-hidden rounded-[5px] bg-[#2a2c30] md:grid-cols-[1fr_1.35fr_1fr]">
        <div className="bg-[#141518] p-3">
          <div className="font-mono text-[10px] uppercase tracking-[0.1em] text-[#7a8590]">
            Lesson
          </div>
          <div className="mt-3 space-y-1.5">
            <div className="h-2 w-2/3 rounded-[2px] bg-[#2a2c30]" />
            <div className="h-2 w-full rounded-[2px] bg-[#2a2c30]" />
            <div className="h-2 w-5/6 rounded-[2px] bg-[#2a2c30]" />
            <div className="h-2 w-1/2 rounded-[2px] bg-[#3a3c40]" />
          </div>
          <div className="mt-5 border-l-2 border-[var(--accent)] bg-[#1a1b1e] p-2 font-mono text-[10px] text-[#b8b3a9]">
            try: LOAD R1 5
          </div>
        </div>

        <div className="bg-[#0f1012] p-4 font-mono text-[11px] leading-6 text-[#d8d2c8]">
          <div className="text-[#7a8590]">; lesson 03 · registers</div>
          <div>
            <span className="text-[#d4a23a]">LOAD</span> R1{' '}
            <span className="text-[var(--accent)]">5</span>
          </div>
          <div>
            <span className="text-[#d4a23a]">ADD</span> R2 R1 R1
          </div>
          <div className="-mx-4 border-l-2 border-[var(--accent)] bg-[rgba(217,106,44,0.18)] px-4">
            <span className="text-[#d4a23a]">PRINT</span> R2
          </div>
          <div>
            <span className="text-[#d4a23a]">HALT</span>
          </div>
          <div className="mt-5 text-[#7a8590]">; output</div>
          <div className="text-[#4a9e5a]">-&gt; 10</div>
        </div>

        <div className="bg-[#141518] p-3 font-mono text-[10px] text-[#b8b3a9]">
          <div className="uppercase tracking-[0.1em] text-[#7a8590]">Regs</div>
          <div className="mt-2 grid grid-cols-[auto_1fr] gap-x-3 gap-y-1">
            <span>R0</span>
            <b>0x00</b>
            <span>R1</span>
            <b>0x05</b>
            <span>R2</span>
            <b className="text-[var(--accent)]">0x0A</b>
            <span>PC</span>
            <b>0x0006</b>
            <span>FLAGS</span>
            <b>Z=0</b>
          </div>
          <div className="mt-5 uppercase tracking-[0.1em] text-[#7a8590]">Mem · 0x0000</div>
          <div className="mt-2 grid grid-cols-8 gap-1 text-[8px]">{memoryCells}</div>
        </div>
      </div>
      <div className="mt-3 flex justify-between rounded-[5px] bg-[#1a1b1e] px-3 py-2 font-mono text-[10px] text-[#7a8590]">
        <span>running · step 4/6</span>
        <span>retro core · 42% complete</span>
      </div>
    </MacWindow>
  );
}

export default function LandingPage({ onNavigate }) {
  const scaffoldPages = platformNavigation.flatMap((section) => section.items);

  return (
    <div className="space-y-10">
      <section className="rw-frame">
        <div className="rw-frame-label">
          <span>MARKETING · DESKTOP</span>
          <span>landing</span>
        </div>

        <div className="grid gap-10 p-6 lg:grid-cols-[1.05fr_1.25fr] lg:items-center lg:p-8">
          <div className="space-y-6">
            <span className="rw-chip rw-chip-accent">live · retro core track</span>
            <div className="space-y-4">
              <h1 className="text-4xl font-semibold leading-[1.08] text-[var(--heading-color)] md:text-6xl">
                {PLATFORM_NAME}
              </h1>
              <p className="max-w-xl text-xl leading-8 text-[var(--ink)]">{PLATFORM_TAGLINE}</p>
              <p className="max-w-xl text-sm leading-7 text-[var(--text-muted)]">
                Browser-native emulator, guided curriculum, labs, saved programs, and runtime
                inspection in one workspace. No local toolchain required.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => onNavigate('workspace')}
                className="bg-[var(--accent)] px-5 py-2.5 font-semibold text-white"
                style={{ borderColor: 'var(--accent)' }}
              >
                Start learning
              </button>
              <button
                type="button"
                onClick={() => onNavigate('dashboard')}
                className="px-5 py-2.5 font-semibold"
              >
                Open dashboard
              </button>
            </div>

            <div className="grid max-w-xl grid-cols-3 gap-3">
              {productStats.map(([value, label]) => (
                <div key={label} className="rw-card-soft p-3">
                  <div className="text-2xl font-semibold text-[var(--ink)]">{value}</div>
                  <div className="mt-1 font-mono text-[10px] uppercase tracking-[0.08em] text-[var(--ink-3)]">
                    {label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <ProductPreview />
        </div>

        <div className="border-y border-[var(--line-2)] bg-[var(--paper)] px-6 py-4">
          <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-5 text-center font-mono text-[11px] uppercase tracking-[0.08em] text-[var(--ink-2)]">
            <span className="text-[var(--ink-3)]">Built for</span>
            <span>CS students</span>
            <span>systems learners</span>
            <span>architecture beginners</span>
            <span>instructors</span>
          </div>
        </div>

        <div className="p-6 lg:p-8">
          <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <div className="rw-eyebrow">Curriculum</div>
              <h2 className="mt-1 text-2xl font-semibold text-[var(--heading-color)]">
                Tracks that scale with you
              </h2>
            </div>
            <span className="font-mono text-[11px] text-[var(--ink-3)]">
              {learningPathBlueprint.length} tracks · 1 live · 2 planned
            </span>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {learningPathBlueprint.map((path, index) => (
              <article
                key={path.title}
                className="rw-card p-5"
                style={{
                  borderTop: index === 0 ? '3px solid var(--accent)' : '1px solid var(--line)',
                }}
              >
                <div className="flex items-center justify-between gap-3">
                  <span className={index === 0 ? 'rw-chip rw-chip-accent' : 'rw-chip'}>
                    {index === 0 ? 'live' : 'planned'}
                  </span>
                  <span className="font-mono text-[11px] text-[var(--ink-3)]">{path.stage}</span>
                </div>
                <h3 className="mt-4 text-lg font-semibold text-[var(--ink)]">{path.title}</h3>
                <p className="mt-2 text-sm leading-6 text-[var(--text-muted)]">{path.description}</p>
              </article>
            ))}
          </div>
        </div>

        <div className="border-y border-[var(--line-2)] bg-[var(--paper)] p-6 lg:p-8">
          <div className="mb-5 flex items-end justify-between gap-4">
            <h2 className="text-2xl font-semibold text-[var(--heading-color)]">
              What's in the box
            </h2>
            <span className="font-mono text-[11px] text-[var(--ink-3)]">
              product pillars
            </span>
          </div>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {landingCapabilities.map((feature) => (
              <article key={feature.title} className="rw-card p-5">
                <div className="mb-4 h-14 rounded-[5px] border border-dashed border-[var(--ink-4)] bg-[var(--panel-soft)]" />
                <h3 className="font-semibold text-[var(--ink)]">{feature.title}</h3>
                <p className="mt-2 text-sm leading-6 text-[var(--text-muted)]">
                  {feature.description}
                </p>
              </article>
            ))}
          </div>
        </div>

        <div className="grid gap-6 p-6 lg:grid-cols-[1.1fr_0.9fr] lg:p-8">
          <div>
            <h2 className="text-2xl font-semibold text-[var(--heading-color)]">How it works</h2>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              {[
                ['01', 'Learn the concept', 'Focused lessons connect code to machine state.'],
                ['02', 'Run the code', 'Starter programs open directly in the workspace.'],
                ['03', 'Inspect the machine', 'Registers, memory, output, and canvas update together.'],
                ['04', 'Complete a lab', 'Challenge validation turns practice into progress.'],
              ].map(([number, title, copy]) => (
                <article key={number} className="rw-card p-4">
                  <div className="font-mono text-[12px] uppercase tracking-[0.12em] text-[var(--accent)]">
                    Step {number}
                  </div>
                  <h3 className="mt-2 font-semibold text-[var(--ink)]">{title}</h3>
                  <p className="mt-2 text-sm leading-6 text-[var(--text-muted)]">{copy}</p>
                </article>
              ))}
            </div>
          </div>

          <MacWindow title="Platform pages">
            <div className="grid gap-2">
              {scaffoldPages.slice(0, 8).map((page) => (
                <button
                  key={page.id}
                  type="button"
                  onClick={() => onNavigate(page.id)}
                  className="grid grid-cols-[12px_1fr] gap-3 rounded-[5px] border border-[#2a2c30] bg-[#141518] px-3 py-2 text-left"
                >
                  <span className="mt-1 h-2 w-2 rounded-full bg-[var(--accent)]" />
                  <span>
                    <span className="block text-sm font-semibold text-[#d8d2c8]">{page.label}</span>
                    <span className="mt-0.5 block text-xs leading-5 text-[#8a8680]">{page.blurb}</span>
                  </span>
                </button>
              ))}
            </div>
          </MacWindow>
        </div>

        <div className="bg-[var(--ink)] px-6 py-12 text-center text-[var(--panel)]">
          <div className="mx-auto max-w-xl">
            <h2 className="text-3xl font-semibold">See the machine for yourself.</h2>
            <p className="mt-3 text-sm text-[#cfc8bb]">
              Free to start, open source, and ready in the browser.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <button
                type="button"
                onClick={() => onNavigate('workspace')}
                className="bg-[var(--accent)] px-5 py-2.5 font-semibold text-white"
                style={{ borderColor: 'var(--accent)' }}
              >
                Open workspace
              </button>
              <button
                type="button"
                onClick={() => onNavigate('lessons')}
                className="border-[#3a3c40] bg-transparent px-5 py-2.5 font-semibold text-[var(--panel)]"
              >
                Browse lessons
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        {landingUseCases.map((useCase) => (
          <article key={useCase.title} className="rw-card p-5">
            <div className="rw-eyebrow">Use case</div>
            <h3 className="mt-2 font-semibold text-[var(--ink)]">{useCase.title}</h3>
            <p className="mt-2 text-sm leading-6 text-[var(--text-muted)]">{useCase.description}</p>
          </article>
        ))}
      </section>
    </div>
  );
}
