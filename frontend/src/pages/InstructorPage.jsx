import MacWindow from '../components/MacWindow';

export default function InstructorPage() {
  const metrics = [
    { label: 'Active Cohorts', value: '03', detail: 'placeholder class sections' },
    { label: 'Assignments', value: '07', detail: 'future lab and checkpoint packs' },
    { label: 'Needs Review', value: '12', detail: 'submissions that should surface first' },
    { label: 'Completion Trend', value: '+18%', detail: 'example cohort improvement signal' },
  ];

  return (
    <div className="space-y-8">
      <section className="rounded-[18px] border border-[var(--panel-border)] bg-[var(--panel-soft)] p-6 md:p-8">
        <p className="text-xs uppercase tracking-[0.24em] text-[var(--text-muted)]">
          Instructor Surface
        </p>
        <h1 className="mt-3 text-3xl font-bold text-[var(--heading-color)] md:text-5xl">
          If this becomes a classroom product, instructors need a first-class workflow.
        </h1>
        <p className="mt-4 max-w-3xl text-sm leading-7 text-[var(--text-muted)] md:text-base">
          This page is the shell for course operations: assignment publishing, analytics, submission review, and concept-level intervention. Nothing here needs backend logic yet, but the structure should exist now.
        </p>
      </section>

      <section className="grid gap-4 md:grid-cols-4">
        {metrics.map((metric) => (
          <div key={metric.label} className="rounded-[14px] border border-[var(--panel-border)] bg-[var(--panel)] p-5">
            <p className="text-xs uppercase tracking-[0.22em] text-[var(--text-muted)]">{metric.label}</p>
            <h2 className="mt-3 text-3xl font-semibold text-[var(--text-main)]">{metric.value}</h2>
            <p className="mt-2 text-sm text-[var(--text-muted)]">{metric.detail}</p>
          </div>
        ))}
      </section>

      <section className="grid gap-6 xl:grid-cols-[1fr_1fr]">
        <MacWindow title="Assignment Pipeline">
          <div className="space-y-4">
            {[
              'Build lesson-backed assignments with starter programs and hidden validation.',
              'Assign labs by cohort, deadline, or architecture track.',
              'Inspect execution traces before grading by hand.',
              'Promote good student solutions into reusable exemplars.',
            ].map((item) => (
              <div key={item} className="rounded-xl border border-[var(--panel-border)] bg-[var(--panel-soft)] p-4 text-sm leading-7 text-[var(--text-muted)]">
                {item}
              </div>
            ))}
          </div>
        </MacWindow>

        <MacWindow title="Analytics Priorities">
          <div className="space-y-4">
            {[
              'Which concepts produce repeated failures?',
              'Where do learners leave the platform mid-module?',
              'Which cohorts need intervention before the next assessment?',
              'Which labs have the highest attempt count before success?',
            ].map((item) => (
              <div key={item} className="rounded-xl border border-[var(--panel-border)] bg-[var(--panel-soft)] p-4 text-sm leading-7 text-[var(--text-muted)]">
                {item}
              </div>
            ))}
          </div>
        </MacWindow>
      </section>
    </div>
  );
}
