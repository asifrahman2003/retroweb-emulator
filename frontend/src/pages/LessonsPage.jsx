import { useEffect, useMemo, useState } from 'react';
import MacWindow from '../components/MacWindow';
import { curriculumTracks, lessonSources, syllabusSequence } from '../curriculumCatalog';

function findExampleById(examples, exampleId) {
  return examples.find((example) => example.id === exampleId) ?? null;
}

function countModules(track) {
  return track.courses.reduce((total, course) => total + course.modules.length, 0);
}

function getActiveCourse(track, activeCourseId) {
  return track.courses.find((course) => course.id === activeCourseId) ?? track.courses[0];
}

function getActiveModule(course, activeModuleId) {
  return course.modules.find((module) => module.id === activeModuleId) ?? course.modules[0];
}

function getSourceEntries(sourceIds = []) {
  return sourceIds
    .map((sourceId) => ({ id: sourceId, source: lessonSources[sourceId] }))
    .filter(({ source }) => Boolean(source));
}

function getAnchorProps(url) {
  if (url.startsWith('#')) {
    return { href: url };
  }

  return { href: url, target: '_blank', rel: 'noreferrer' };
}

function findModuleLocation(moduleId) {
  for (const track of curriculumTracks) {
    for (const course of track.courses) {
      const module = course.modules.find((entry) => entry.id === moduleId);
      if (module) {
        return { track, course, module };
      }
    }
  }

  return null;
}

function getLessonIdFromHash(hash = '') {
  const query = hash.split('?')[1] ?? '';
  return new URLSearchParams(query).get('lesson');
}

export default function LessonsPage({ examples, onLoadExample }) {
  const [activeTrackId, setActiveTrackId] = useState(curriculumTracks[0]?.id ?? '');
  const [activeCourseByTrack, setActiveCourseByTrack] = useState({});
  const [activeModuleByCourse, setActiveModuleByCourse] = useState({});

  const activeTrack = useMemo(
    () => curriculumTracks.find((track) => track.id === activeTrackId) ?? curriculumTracks[0],
    [activeTrackId],
  );
  const activeCourse = getActiveCourse(activeTrack, activeCourseByTrack[activeTrack.id]);
  const activeModule = getActiveModule(activeCourse, activeModuleByCourse[activeCourse.id]);
  const linkedExample = activeModule.exampleId
    ? findExampleById(examples, activeModule.exampleId)
    : null;
  const activeSources = getSourceEntries(activeModule.sourceIds);

  useEffect(() => {
    const syncLessonFromHash = () => {
      const lessonId = getLessonIdFromHash(window.location.hash);
      const location = findModuleLocation(lessonId);

      if (!location) {
        return;
      }

      setActiveTrackId(location.track.id);
      setActiveCourseByTrack((previous) => ({
        ...previous,
        [location.track.id]: location.course.id,
      }));
      setActiveModuleByCourse((previous) => ({
        ...previous,
        [location.course.id]: location.module.id,
      }));
    };

    window.addEventListener('hashchange', syncLessonFromHash);
    syncLessonFromHash();

    return () => {
      window.removeEventListener('hashchange', syncLessonFromHash);
    };
  }, []);

  const selectTrack = (track) => {
    const firstCourse = track.courses[0];
    const firstModule = firstCourse?.modules[0];

    setActiveTrackId(track.id);
    setActiveCourseByTrack((previous) => ({
      ...previous,
      [track.id]: previous[track.id] ?? firstCourse?.id,
    }));

    if (firstCourse && firstModule) {
      setActiveModuleByCourse((previous) => ({
        ...previous,
        [firstCourse.id]: previous[firstCourse.id] ?? firstModule.id,
      }));
    }
  };

  const selectCourse = (courseId) => {
    const nextCourse = activeTrack.courses.find((course) => course.id === courseId);
    setActiveCourseByTrack((previous) => ({
      ...previous,
      [activeTrack.id]: courseId,
    }));

    if (nextCourse?.modules[0]) {
      setActiveModuleByCourse((previous) => ({
        ...previous,
        [courseId]: previous[courseId] ?? nextCourse.modules[0].id,
      }));
    }
  };

  const selectModule = (moduleId) => {
    setActiveModuleByCourse((previous) => ({
      ...previous,
      [activeCourse.id]: moduleId,
    }));

    if (window.location.hash.startsWith('#/lessons')) {
      window.history.replaceState(null, '', `#/lessons?lesson=${moduleId}`);
    }
  };

  const selectSequenceUnit = (unit) => {
    const nextTrack = curriculumTracks.find((track) => track.id === unit.trackId);
    const nextCourse = nextTrack?.courses.find((course) => course.id === unit.courseId);
    const nextModule = nextCourse?.modules.find((module) => module.id === unit.lessonId);

    if (!nextTrack || !nextCourse) {
      return;
    }

    setActiveTrackId(nextTrack.id);
    setActiveCourseByTrack((previous) => ({
      ...previous,
      [nextTrack.id]: nextCourse.id,
    }));
    setActiveModuleByCourse((previous) => ({
      ...previous,
      [nextCourse.id]: nextModule?.id ?? nextCourse.modules[0]?.id,
    }));

    if (nextModule && window.location.hash.startsWith('#/lessons')) {
      window.history.replaceState(null, '', `#/lessons?lesson=${nextModule.id}`);
    }
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
              Learn assembly in retroWeb Academy.
            </h1>
            <p className="mt-4 max-w-3xl text-sm leading-7 text-[var(--text-muted)] md:text-base">
              Follow original lessons, open runnable Retro Core demos, and use source links when a topic connects to MIPS, RISC-V, x86-64, or Arm.
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
                Lessons
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
              Learning Path
            </p>
            <h2 className="mt-2 text-2xl font-semibold text-[var(--text-main)]">
              Follow the lessons in order
            </h2>
          </div>
          <p className="max-w-xl text-sm leading-7 text-[var(--text-muted)]">
            Start with Retro Core, then bridge into MIPS, RISC-V, CPU internals, and later real-world assembly references.
          </p>
        </div>

        <div className="mt-5 grid gap-3 xl:grid-cols-3">
          {syllabusSequence.map((unit) => {
            const active =
              unit.trackId === activeTrack.id &&
              unit.courseId === activeCourse.id &&
              unit.lessonId === activeModule.id;

            return (
              <button
                key={unit.id}
                type="button"
                onClick={() => selectSequenceUnit(unit)}
                className={`rounded-xl border p-4 text-left transition ${
                  active
                    ? 'border-[var(--accent)] bg-[var(--accent-soft)]'
                    : 'border-[var(--panel-border)] bg-[var(--panel)] hover:border-[var(--accent)]'
                }`}
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
                      Sources: {unit.source}
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
                    : 'border-[var(--panel-border)] bg-[var(--panel)] hover:border-[var(--accent)]'
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
                  className="rounded-lg border border-[var(--panel-border)] bg-[var(--panel)] px-3 py-2 text-sm text-[var(--text-muted)]"
                >
                  {outcome}
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
                        : 'border-[var(--panel-border)] bg-[var(--panel)] text-[var(--text-muted)] hover:border-[var(--accent)]'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <span className="font-semibold">Course {index + 1}</span>
                      <span className="text-xs">{course.modules.length} lessons</span>
                    </div>
                    <div className="mt-1 text-sm">{course.title.replace(/^Course \d+ · /, '')}</div>
                  </button>
                );
              })}
            </div>
          </div>
        </aside>

        <div className="overflow-hidden rounded-[18px] border border-[var(--panel-border)] bg-[var(--panel-soft)]">
          <div className="border-b border-[var(--panel-border)] p-6">
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
              <div className="rounded-xl border border-[var(--panel-border)] bg-[var(--panel)] px-4 py-3 text-sm text-[var(--text-muted)]">
                {activeCourse.modules.length} lessons in this course
              </div>
            </div>
          </div>

          <div className="grid xl:grid-cols-[320px_minmax(0,1fr)]">
            <aside className="border-b border-[var(--panel-border)] bg-[var(--panel)] p-4 xl:border-b-0 xl:border-r">
              <p className="px-1 text-xs uppercase tracking-[0.22em] text-[var(--text-muted)]">
                Course Lessons
              </p>
              <div className="mt-3 space-y-2">
                {activeCourse.modules.map((module, moduleIndex) => {
                  const active = module.id === activeModule.id;
                  const moduleExample = module.exampleId
                    ? findExampleById(examples, module.exampleId)
                    : null;

                  return (
                    <button
                      key={module.id}
                      type="button"
                      onClick={() => selectModule(module.id)}
                      className={`w-full rounded-lg border p-3 text-left transition ${
                        active
                          ? 'border-[var(--accent)] bg-[var(--accent-soft)]'
                          : 'border-[var(--panel-border)] bg-[var(--panel)] hover:border-[var(--accent)]'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <span
                          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md border font-mono text-sm"
                          style={{
                            borderColor: `${activeTrack.accent}66`,
                            color: activeTrack.accent,
                          }}
                        >
                          {String(moduleIndex + 1).padStart(2, '0')}
                        </span>
                        <span>
                          <span className="block text-sm font-semibold text-[var(--text-main)]">
                            {module.title}
                          </span>
                          <span className="mt-1 block text-xs leading-5 text-[var(--text-muted)]">
                            {module.summary}
                          </span>
                          <span className="mt-2 flex flex-wrap gap-2">
                            <span className="rw-chip">{module.status}</span>
                            {moduleExample ? <span className="rw-chip rw-chip-accent">demo</span> : null}
                          </span>
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </aside>

            <article className="min-w-0 p-5 md:p-7">
              <div className="flex flex-wrap gap-2">
                <span className="rw-chip rw-chip-accent">{activeModule.status}</span>
                <span className="rw-chip">{activeModule.time}</span>
                <span className="rw-chip">{activeModule.level}</span>
                <span className="rw-chip">{activeModule.format}</span>
              </div>

              <h3 className="mt-4 text-3xl font-semibold text-[var(--text-main)]">
                {activeModule.title}
              </h3>
              <p className="mt-3 max-w-3xl text-sm leading-7 text-[var(--text-muted)]">
                {activeModule.summary}
              </p>

              <div className="mt-5 grid gap-2 md:grid-cols-3">
                {activeModule.goals.map((goal) => (
                  <div
                    key={goal}
                    className="rounded-lg border border-[var(--panel-border)] bg-[var(--panel)] px-3 py-2 text-sm text-[var(--text-muted)]"
                  >
                    {goal}
                  </div>
                ))}
              </div>

              {linkedExample ? (
                <section className="mt-6 border-y border-[var(--panel-border)] py-5">
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                    <div>
                      <p className="text-xs uppercase tracking-[0.22em] text-[var(--text-muted)]">
                        Runnable Demo
                      </p>
                      <h4 className="mt-2 text-xl font-semibold text-[var(--text-main)]">
                        {linkedExample.title}
                      </h4>
                      <p className="mt-2 max-w-2xl text-sm leading-6 text-[var(--text-muted)]">
                        {linkedExample.description}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => onLoadExample(linkedExample)}
                      className="shrink-0 bg-[var(--accent)] font-semibold text-white"
                      style={{ borderColor: 'var(--accent)' }}
                    >
                      Open in Workspace
                    </button>
                  </div>
                  <pre className="mt-4 overflow-auto rounded-md border border-[var(--window-border)] bg-[var(--window-bg)] p-4 font-mono text-sm leading-6 text-[#d8d2c8]">
                    {linkedExample.code}
                  </pre>
                </section>
              ) : null}

              {activeModule.lesson.conceptExample ? (
                <section className="mt-6 border-y border-[var(--panel-border)] py-5">
                  <div>
                    <p className="text-xs uppercase tracking-[0.22em] text-[var(--text-muted)]">
                      Concept Example
                    </p>
                    <h4 className="mt-2 text-xl font-semibold text-[var(--text-main)]">
                      {activeModule.lesson.conceptExample.title}
                    </h4>
                    <p className="mt-2 max-w-2xl text-sm leading-6 text-[var(--text-muted)]">
                      {activeModule.lesson.conceptExample.caption}
                    </p>
                  </div>
                  <div className="mt-4">
                    <MacWindow title={activeModule.lesson.conceptExample.title}>
                      <pre className="whitespace-pre-wrap font-mono text-sm leading-6 text-[#d8d2c8]">
                        {activeModule.lesson.conceptExample.code}
                      </pre>
                    </MacWindow>
                  </div>
                </section>
              ) : null}

              <div className="mt-6 space-y-6">
                {activeModule.lesson.sections.map((section) => (
                  <section key={section.title}>
                    <h4 className="text-xl font-semibold text-[var(--text-main)]">
                      {section.title}
                    </h4>
                    <p className="mt-2 text-sm leading-7 text-[var(--text-muted)]">
                      {section.body}
                    </p>
                  </section>
                ))}
              </div>

              <section className="mt-7 rounded-lg border border-[var(--panel-border)] bg-[var(--panel)] p-5">
                <p className="text-xs uppercase tracking-[0.22em] text-[var(--text-muted)]">
                  Practice
                </p>
                <h4 className="mt-2 text-xl font-semibold text-[var(--text-main)]">
                  {activeModule.lesson.practice.title}
                </h4>
                <p className="mt-2 text-sm leading-7 text-[var(--text-muted)]">
                  {activeModule.lesson.practice.prompt}
                </p>
                <ol className="mt-4 grid gap-2 text-sm leading-6 text-[var(--text-muted)]">
                  {activeModule.lesson.practice.steps.map((step, index) => (
                    <li key={step} className="flex gap-3">
                      <span className="font-mono text-[var(--accent)]">
                        {String(index + 1).padStart(2, '0')}
                      </span>
                      <span>{step}</span>
                    </li>
                  ))}
                </ol>
              </section>

              {activeModule.lesson.implementationPlan?.length ? (
                <section className="mt-6 rounded-lg border border-[var(--panel-border)] bg-[var(--panel)] p-5">
                  <p className="text-xs uppercase tracking-[0.22em] text-[var(--text-muted)]">
                    Implementation Checklist
                  </p>
                  <p className="mt-2 text-sm leading-7 text-[var(--text-muted)]">
                    These are the VM and app changes needed before the concept example becomes runnable.
                  </p>
                  <div className="mt-4 grid gap-2 text-sm leading-6 text-[var(--text-muted)]">
                    {activeModule.lesson.implementationPlan.map((item) => (
                      <p key={item}>{item}</p>
                    ))}
                  </div>
                </section>
              ) : null}

              <section className="mt-6 grid gap-4 lg:grid-cols-2">
                <div className="rounded-lg border border-[var(--panel-border)] bg-[var(--panel)] p-5">
                  <p className="text-xs uppercase tracking-[0.22em] text-[var(--text-muted)]">
                    Self-Checks
                  </p>
                  <div className="mt-3 grid gap-2 text-sm leading-6 text-[var(--text-muted)]">
                    {activeModule.lesson.checks.map((check) => (
                      <p key={check}>{check}</p>
                    ))}
                  </div>
                </div>

                <div className="rounded-lg border border-[var(--panel-border)] bg-[var(--panel)] p-5">
                  <p className="text-xs uppercase tracking-[0.22em] text-[var(--text-muted)]">
                    Vocabulary
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {activeModule.lesson.vocabulary.map((term) => (
                      <span key={term} className="rw-chip">
                        {term}
                      </span>
                    ))}
                  </div>
                </div>
              </section>

              <section className="mt-7">
                <p className="text-xs uppercase tracking-[0.22em] text-[var(--text-muted)]">
                  Sources
                </p>
                <div className="mt-3 grid gap-3 md:grid-cols-2">
                  {activeSources.map(({ id, source }) => (
                    <a
                      key={id}
                      {...getAnchorProps(source.url)}
                      className="rounded-lg border border-[var(--panel-border)] bg-[var(--panel)] p-4 transition hover:border-[var(--accent)]"
                    >
                      <span className="block text-xs uppercase tracking-[0.18em] text-[var(--text-muted)]">
                        {source.kind}
                      </span>
                      <span className="mt-2 block font-semibold text-[var(--text-main)]">
                        {source.title}
                      </span>
                      <span className="mt-2 block text-sm leading-6 text-[var(--text-muted)]">
                        {source.note}
                      </span>
                    </a>
                  ))}
                </div>
              </section>
            </article>
          </div>
        </div>
      </section>

      <section className="rounded-[18px] border border-[var(--panel-border)] bg-[var(--panel-soft)] p-5">
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-[var(--text-muted)]">
              Source Library
            </p>
            <h2 className="mt-2 text-2xl font-semibold text-[var(--text-main)]">
              References behind the roadmap
            </h2>
          </div>
          <p className="max-w-xl text-sm leading-7 text-[var(--text-muted)]">
            Lessons use these sources for direction and attribution, while the on-page explanations stay original to retroWeb Academy.
          </p>
        </div>

        <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {Object.entries(lessonSources).map(([id, source]) => (
            <a
              key={id}
              {...getAnchorProps(source.url)}
              className="rounded-lg border border-[var(--panel-border)] bg-[var(--panel)] p-4 transition hover:border-[var(--accent)]"
            >
              <span className="block text-xs uppercase tracking-[0.18em] text-[var(--text-muted)]">
                {source.kind}
              </span>
              <span className="mt-2 block font-semibold text-[var(--text-main)]">
                {source.title}
              </span>
              <span className="mt-2 block text-sm leading-6 text-[var(--text-muted)]">
                {source.note}
              </span>
            </a>
          ))}
        </div>
      </section>
    </div>
  );
}
