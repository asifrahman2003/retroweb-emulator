import { useMemo, useState } from 'react';
import { curriculumTracks, syllabusSequence } from '../curriculumCatalog';

function findExampleById(examples, exampleId) {
  return examples.find((example) => example.id === exampleId) ?? null;
}

function countModules(track) {
  return track.courses.reduce((total, course) => total + course.modules.length, 0);
}

function getActiveCourse(track, activeCourseId) {
  return track.courses.find((course) => course.id === activeCourseId) ?? track.courses[0];
}

export default function LessonsPage({ examples, onLoadExample }) {
  const [activeTrackId, setActiveTrackId] = useState(curriculumTracks[0]?.id ?? '');
  const [activeCourseByTrack, setActiveCourseByTrack] = useState({});

  const activeTrack = useMemo(
    () => curriculumTracks.find((track) => track.id === activeTrackId) ?? curriculumTracks[0],
    [activeTrackId],
  );
  const activeCourse = getActiveCourse(activeTrack, activeCourseByTrack[activeTrack.id]);

  const selectTrack = (track) => {
    setActiveTrackId(track.id);
    setActiveCourseByTrack((previous) => ({
      ...previous,
      [track.id]: previous[track.id] ?? track.courses[0]?.id,
    }));
  };

  const selectCourse = (courseId) => {
    setActiveCourseByTrack((previous) => ({
      ...previous,
      [activeTrack.id]: courseId,
    }));
  };

  const selectSequenceUnit = (unit) => {
    const nextTrack = curriculumTracks.find((track) => track.id === unit.trackId);
    if (!nextTrack) {
      return;
    }

    setActiveTrackId(nextTrack.id);
    setActiveCourseByTrack((previous) => ({
      ...previous,
      [nextTrack.id]: unit.courseId,
    }));
  };

  return (
    <div className="space-y-6">
      <section className="rounded-[18px] border border-[var(--panel-border)] bg-[var(--panel-soft)] p-6 md:p-8">
        <div className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-[var(--text-muted)]">
              Lessons
            </p>
            <h1 className="mt-3 max-w-4xl text-3xl font-bold text-[var(--heading-color)] md:text-5xl">
              Coursework sequence from your CSc252 syllabus and slides.
            </h1>
            <p className="mt-4 max-w-3xl text-sm leading-7 text-[var(--text-muted)] md:text-base">
              This page keeps lecture content out of the codebase, but organizes the course into syllabus-style units, tracks, courses, outcomes, and modules that can later open a real lesson viewer.
            </p>
          </div>

          <div className="grid min-w-[260px] gap-3 sm:grid-cols-3 xl:grid-cols-1">
            <div className="rounded-[14px] border border-[var(--panel-border)] bg-[var(--panel)] p-4">
              <p className="text-xs uppercase tracking-[0.22em] text-[var(--text-muted)]">
                Tracks
              </p>
              <h2 className="mt-2 text-2xl font-semibold text-[var(--text-main)]">
                {curriculumTracks.length}
              </h2>
            </div>
            <div className="rounded-[14px] border border-[var(--panel-border)] bg-[var(--panel)] p-4">
              <p className="text-xs uppercase tracking-[0.22em] text-[var(--text-muted)]">
                Courses
              </p>
              <h2 className="mt-2 text-2xl font-semibold text-[var(--text-main)]">
                {curriculumTracks.reduce((total, track) => total + track.courses.length, 0)}
              </h2>
            </div>
            <div className="rounded-[14px] border border-[var(--panel-border)] bg-[var(--panel)] p-4">
              <p className="text-xs uppercase tracking-[0.22em] text-[var(--text-muted)]">
                Modules
              </p>
              <h2 className="mt-2 text-2xl font-semibold text-[var(--text-main)]">
                {curriculumTracks.reduce((total, track) => total + countModules(track), 0)}
              </h2>
            </div>
          </div>
        </div>
      </section>

      <section className="rounded-[18px] border border-[var(--panel-border)] bg-[var(--panel-soft)] p-5">
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-[var(--text-muted)]">
              Syllabus Sequence
            </p>
            <h2 className="mt-2 text-2xl font-semibold text-[var(--text-main)]">
              Follow the course in topic order
            </h2>
          </div>
          <p className="max-w-xl text-sm leading-7 text-[var(--text-muted)]">
            These units map the syllabus-style progression into the app without copying PDF content directly.
          </p>
        </div>

        <div className="mt-5 grid gap-3 xl:grid-cols-3">
          {syllabusSequence.map((unit) => {
            const active =
              unit.trackId === activeTrack.id &&
              unit.courseId === activeCourse.id;

            return (
              <button
                key={unit.id}
                type="button"
                onClick={() => selectSequenceUnit(unit)}
                className={`rounded-xl border p-4 text-left transition ${
                  active
                    ? 'border-[var(--accent)] bg-[var(--accent-soft)]'
                    : 'border-[var(--panel-border)] bg-black hover:border-[var(--accent)]'
                }`}
                title={unit.sourcePath}
              >
                <div className="flex items-start gap-3">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-[var(--panel-border)] font-mono text-sm text-[var(--accent)]">
                    {unit.order}
                  </span>
                  <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-[var(--text-muted)]">
                      {unit.scope}
                    </p>
                    <h3 className="mt-2 text-base font-semibold text-[var(--text-main)]">
                      {unit.unit}
                    </h3>
                    <p className="mt-2 text-sm leading-6 text-[var(--text-muted)]">
                      {unit.summary}
                    </p>
                    <p className="mt-3 text-xs text-[var(--accent)]">
                      Source: {unit.source}
                    </p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      <section className="rounded-[18px] border border-[var(--panel-border)] bg-[var(--panel)] p-3">
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          {curriculumTracks.map((track) => {
            const active = track.id === activeTrack.id;
            return (
              <button
                key={track.id}
                type="button"
                onClick={() => selectTrack(track)}
                className={`rounded-xl border p-4 text-left transition ${
                  active
                    ? 'border-[var(--accent)] bg-[var(--accent-soft)]'
                    : 'border-[var(--panel-border)] bg-black hover:border-[var(--accent)]'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xs uppercase tracking-[0.22em] text-[var(--text-muted)]">
                      {track.stage}
                    </p>
                    <h2 className="mt-2 text-lg font-semibold text-[var(--text-main)]">
                      {track.label}
                    </h2>
                    <p className="mt-2 text-sm text-[var(--text-muted)]">{track.pace}</p>
                  </div>
                  <span
                    className="mt-1 h-3 w-3 rounded-full"
                    style={{ backgroundColor: track.accent }}
                  />
                </div>
              </button>
            );
          })}
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[320px_minmax(0,1fr)]">
        <aside className="space-y-4 xl:sticky xl:top-24 xl:self-start">
          <div className="rounded-[16px] border border-[var(--panel-border)] bg-[var(--panel-soft)] p-5">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-xs uppercase tracking-[0.22em] text-[var(--text-muted)]">
                  Active Track
                </p>
                <h2 className="mt-2 text-2xl font-semibold text-[var(--text-main)]">
                  {activeTrack.label}
                </h2>
              </div>
              <span
                className="h-4 w-4 rounded-full"
                style={{ backgroundColor: activeTrack.accent }}
              />
            </div>
            <p className="mt-4 text-sm leading-7 text-[var(--text-muted)]">
              {activeTrack.summary}
            </p>
            <div className="mt-5 grid gap-2">
              {activeTrack.outcomes.map((outcome) => (
                <div
                  key={outcome}
                  className="rounded-lg border border-[var(--panel-border)] bg-black px-3 py-2 text-sm text-[var(--text-muted)]"
                >
                  {outcome}
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[16px] border border-[var(--panel-border)] bg-[var(--panel-soft)] p-4">
            <p className="px-1 text-xs uppercase tracking-[0.22em] text-[var(--text-muted)]">
              Unit Checkpoints
            </p>
            <div className="mt-3 space-y-2">
              {syllabusSequence
                .filter((unit) => unit.trackId === activeTrack.id)
                .flatMap((unit) => unit.checkpoints)
                .slice(0, 5)
                .map((checkpoint) => (
                  <div
                    key={checkpoint}
                    className="rounded-lg border border-[var(--panel-border)] bg-black px-3 py-2 text-sm text-[var(--text-muted)]"
                  >
                    {checkpoint}
                  </div>
                ))}
            </div>
          </div>

          <div className="rounded-[16px] border border-[var(--panel-border)] bg-[var(--panel-soft)] p-4">
            <p className="px-1 text-xs uppercase tracking-[0.22em] text-[var(--text-muted)]">
              Courses
            </p>
            <div className="mt-3 space-y-2">
              {activeTrack.courses.map((course, index) => {
                const active = course.id === activeCourse.id;
                return (
                  <button
                    key={course.id}
                    type="button"
                    onClick={() => selectCourse(course.id)}
                    className={`w-full rounded-lg border px-4 py-3 text-left transition ${
                      active
                        ? 'border-[var(--accent)] bg-[var(--accent-soft)] text-[var(--text-main)]'
                        : 'border-[var(--panel-border)] bg-black text-[var(--text-muted)] hover:border-[var(--accent)]'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <span className="font-semibold">Course {index + 1}</span>
                      <span className="text-xs">{course.modules.length} modules</span>
                    </div>
                    <div className="mt-1 text-sm">{course.title.replace(/^Course \d+ · /, '')}</div>
                  </button>
                );
              })}
            </div>
          </div>
        </aside>

        <div className="relative overflow-hidden rounded-[18px] border border-[var(--panel-border)] bg-[var(--panel-soft)]">
          <div className="pointer-events-none absolute inset-0 opacity-40">
            <div
              className="absolute -right-12 top-8 h-36 w-36 rounded-full border border-dashed"
              style={{ borderColor: `${activeTrack.accent}66` }}
            />
            <div
              className="absolute left-10 top-44 h-16 w-16 rotate-12 rounded-lg border border-dashed"
              style={{ borderColor: `${activeTrack.accent}44` }}
            />
            <div
              className="absolute bottom-16 right-24 h-20 w-20 rounded-full bg-[radial-gradient(circle,_rgba(249,115,22,0.12)_0%,_transparent_72%)]"
            />
            <svg className="absolute bottom-8 left-6 h-24 w-48 text-[var(--panel-border)]" viewBox="0 0 180 90" fill="none">
              <path d="M4 70C28 20 50 20 70 58C88 92 118 78 136 38C148 12 164 10 176 28" stroke="currentColor" strokeWidth="2" strokeDasharray="6 8" />
            </svg>
          </div>

          <div className="relative border-b border-[var(--panel-border)] p-6">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.22em] text-[var(--text-muted)]">
                  {activeCourse.duration} · {activeCourse.level}
                </p>
                <h2 className="mt-2 text-3xl font-semibold text-[var(--text-main)]">
                  {activeCourse.title}
                </h2>
                <p className="mt-3 max-w-3xl text-sm leading-7 text-[var(--text-muted)]">
                  {activeCourse.outcome}
                </p>
              </div>
              <div className="rounded-xl border border-[var(--panel-border)] bg-black px-4 py-3 text-sm text-[var(--text-muted)]">
                {activeCourse.modules.length} modules in this course
              </div>
            </div>
          </div>

          <div className="relative p-6">
            <div className="grid gap-4">
              {activeCourse.modules.map((module, moduleIndex) => {
                const linkedExample = module.exampleId
                  ? findExampleById(examples, module.exampleId)
                  : null;

                return (
                  <article
                    key={module.id}
                    className="grid gap-4 rounded-xl border border-[var(--panel-border)] bg-black/80 p-4 lg:grid-cols-[88px_minmax(0,1fr)_auto]"
                  >
                    <div className="flex items-center gap-3 lg:block">
                      <div
                        className="flex h-12 w-12 items-center justify-center rounded-lg border font-mono text-lg font-semibold"
                        style={{
                          borderColor: `${activeTrack.accent}66`,
                          color: activeTrack.accent,
                          backgroundColor: `${activeTrack.accent}14`,
                        }}
                      >
                        {String(moduleIndex + 1).padStart(2, '0')}
                      </div>
                      <div className="lg:mt-3">
                        <p className="text-xs uppercase tracking-[0.18em] text-[var(--text-muted)]">
                          {module.format}
                        </p>
                      </div>
                    </div>

                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-xl font-semibold text-[var(--text-main)]">
                          {module.title}
                        </h3>
                        <span
                          className="rounded-full border px-3 py-1 text-xs"
                          style={{
                            borderColor: `${activeTrack.accent}44`,
                            color: activeTrack.accent,
                          }}
                          title={module.sourcePath}
                        >
                          {module.sourceTitle}
                        </span>
                      </div>
                      <p className="mt-3 text-sm leading-7 text-[var(--text-muted)]">
                        {module.summary}
                      </p>
                      <div className="mt-4 grid gap-2 md:grid-cols-2">
                        {module.goals.map((goal) => (
                          <div
                            key={goal}
                            className="rounded-lg border border-[var(--panel-border)] bg-[var(--panel)] px-3 py-2 text-sm text-[var(--text-muted)]"
                          >
                            {goal}
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-start lg:justify-end">
                      {linkedExample ? (
                        <button
                          type="button"
                          onClick={() => onLoadExample(linkedExample)}
                          className="rounded-full px-4 py-3 text-sm font-semibold text-white"
                          style={{ backgroundColor: activeTrack.accent }}
                        >
                          Open Demo
                        </button>
                      ) : (
                        <span className="rounded-full border border-[var(--panel-border)] px-4 py-3 text-xs uppercase tracking-[0.18em] text-[var(--text-muted)]">
                          Lesson Shell
                        </span>
                      )}
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
