import MacWindow from '../components/MacWindow';
import { settingsBlueprint } from '../platformContent';

export default function SettingsPage({ isAssembly, vmStatusLabel, savedProgramsCount }) {
  return (
    <div className="space-y-8">
      <section className="rounded-[18px] border border-[var(--panel-border)] bg-[var(--panel-soft)] p-6 md:p-8">
        <p className="text-xs uppercase tracking-[0.24em] text-[var(--text-muted)]">
          Settings & Preferences
        </p>
        <h1 className="mt-3 text-3xl font-bold text-[var(--heading-color)] md:text-5xl">
          Product settings matter once the tool becomes a daily learning environment.
        </h1>
        <p className="mt-4 max-w-3xl text-sm leading-7 text-[var(--text-muted)] md:text-base">
          This page is the future home for synced preferences, execution defaults, integrations, and accessibility. For now it acts as the information architecture for those controls.
        </p>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <div className="rounded-[14px] border border-[var(--panel-border)] bg-[var(--panel)] p-5">
          <p className="text-xs uppercase tracking-[0.22em] text-[var(--text-muted)]">Editor Mode</p>
          <h2 className="mt-3 text-2xl font-semibold text-[var(--text-main)]">
            {isAssembly ? 'Assembly' : 'Raw Bytes'}
          </h2>
        </div>
        <div className="rounded-[14px] border border-[var(--panel-border)] bg-[var(--panel)] p-5">
          <p className="text-xs uppercase tracking-[0.22em] text-[var(--text-muted)]">Runtime</p>
          <h2 className="mt-3 text-2xl font-semibold text-[var(--text-main)]">{vmStatusLabel}</h2>
        </div>
        <div className="rounded-[14px] border border-[var(--panel-border)] bg-[var(--panel)] p-5">
          <p className="text-xs uppercase tracking-[0.22em] text-[var(--text-muted)]">Saved Programs</p>
          <h2 className="mt-3 text-2xl font-semibold text-[var(--text-main)]">{savedProgramsCount}</h2>
        </div>
      </section>

      <MacWindow title="Configuration Blueprint">
        <div className="grid gap-4 md:grid-cols-2">
          {settingsBlueprint.map((group) => (
            <div key={group.title} className="rounded-xl border border-[var(--panel-border)] bg-[var(--panel-soft)] p-5">
              <h2 className="text-lg font-semibold text-[var(--text-main)]">{group.title}</h2>
              <p className="mt-3 text-sm leading-7 text-[var(--text-muted)]">{group.description}</p>
            </div>
          ))}
        </div>
      </MacWindow>
    </div>
  );
}
