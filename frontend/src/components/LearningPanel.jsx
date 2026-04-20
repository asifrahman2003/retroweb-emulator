import MacWindow from './MacWindow';

function formatSavedAt(savedAt) {
  if (!savedAt) {
    return 'Not saved yet';
  }

  const savedDate = new Date(savedAt);
  if (Number.isNaN(savedDate.getTime())) {
    return 'Saved';
  }

  return savedDate.toLocaleString();
}

function formatProgramMode(entry) {
  return entry?.assemblyMode === false ? 'Raw Bytes' : 'Assembly';
}

export default function LearningPanel({
  profile,
  examples,
  challenges,
  selectedExampleId,
  selectedChallengeId,
  selectedSavedProgramId,
  savedProgramName,
  savedPrograms,
  challengeProgress,
  completedChallengesCount,
  onSelectExample,
  onLoadExample,
  onSelectChallenge,
  onLoadChallenge,
  onSelectSavedProgram,
  onSavedProgramNameChange,
  onSaveProgram,
  onLoadSavedProgram,
  onDeleteSavedProgram,
  challengeResult,
}) {
  const activeExample = examples.find((example) => example.id === selectedExampleId) ?? examples[0];
  const activeChallenge =
    challenges.find((challenge) => challenge.id === selectedChallengeId) ?? challenges[0];
  const activeSavedProgram =
    savedPrograms.find((program) => program.id === selectedSavedProgramId) ?? null;
  const activeChallengeProgress = challengeProgress[activeChallenge.id];
  const statusLabel = challengeResult
    ? challengeResult.passed
      ? 'Passed'
      : 'Pending'
    : activeChallengeProgress?.passed
      ? 'Completed'
      : 'Not Checked';

  return (
    <MacWindow title="Learning Track" contentClassName="max-h-[calc(100vh-240px)] overflow-y-auto p-3">
      <div className="space-y-3 text-sm">
        <section className="rounded-lg border border-[var(--panel-border)] bg-[var(--panel)] p-3">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-[var(--text-muted)]">
                Architecture
              </p>
              <h3 className="text-lg font-semibold text-[var(--heading-color)]">
                {profile.name}
              </h3>
            </div>
            <span className="rounded-full border border-[var(--accent)] px-3 py-1 text-xs text-[var(--accent)]">
              {profile.level}
            </span>
          </div>
          <p className="mt-2 text-[var(--text-main)]">{profile.summary}</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {profile.learningGoals.slice(0, 3).map((goal) => (
              <span
                key={goal}
                className="rounded-full bg-[var(--output-bg)] px-3 py-1 text-xs text-[var(--text-muted)]"
              >
                {goal}
              </span>
            ))}
          </div>
          <p className="mt-4 text-xs text-[var(--accent)]">
            Completed challenges: {completedChallengesCount}/{challenges.length}
          </p>
        </section>

        <section className="rounded-lg border border-[var(--panel-border)] bg-[var(--panel)] p-3">
          <div className="flex items-center justify-between gap-3">
            <h3 className="text-base font-semibold text-[var(--heading-color)]">
              Guided Example
            </h3>
            <button
              onClick={() => onLoadExample(activeExample)}
              className="rounded bg-[var(--accent)] px-3 py-2 text-xs text-white"
            >
              Load Example
            </button>
          </div>
          <select
            value={activeExample.id}
            onChange={(event) => onSelectExample(event.target.value)}
            className="mt-3 w-full rounded border border-[var(--panel-border)] bg-[var(--output-bg)] px-3 py-2 text-sm text-[var(--text-main)]"
          >
                {examples.map((example) => (
                  <option key={example.id} value={example.id}>
                    {example.title} · {example.difficulty} · {formatProgramMode(example)}
                  </option>
                ))}
              </select>
          <p className="mt-3 text-[var(--text-main)]">{activeExample.description}</p>
          <p className="mt-2 text-xs text-[var(--text-muted)]">
            Mode: {formatProgramMode(activeExample)}
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {activeExample.concepts.map((concept) => (
              <span
                key={concept}
                className="rounded-full bg-[var(--output-bg)] px-3 py-1 text-xs text-[var(--accent)]"
              >
                {concept}
              </span>
            ))}
          </div>
        </section>

        <section className="rounded-lg border border-[var(--panel-border)] bg-[var(--panel)] p-3">
          <div className="flex items-center justify-between gap-3">
            <h3 className="text-base font-semibold text-[var(--heading-color)]">
              Saved Programs
            </h3>
            <button
              onClick={onSaveProgram}
              className="rounded bg-[var(--accent)] px-3 py-2 text-xs text-white"
            >
              Save Current
            </button>
          </div>
          <input
            type="text"
            value={savedProgramName}
            onChange={(event) => onSavedProgramNameChange(event.target.value)}
            placeholder="Name this program"
            className="mt-3 w-full rounded border border-[var(--panel-border)] bg-[var(--output-bg)] px-3 py-2 text-sm text-[var(--text-main)]"
          />

          {savedPrograms.length ? (
            <>
              <select
                value={selectedSavedProgramId}
                onChange={(event) => onSelectSavedProgram(event.target.value)}
                className="mt-3 w-full rounded border border-[var(--panel-border)] bg-[var(--output-bg)] px-3 py-2 text-sm text-[var(--text-main)]"
              >
                <option value="">Select a saved program</option>
                {savedPrograms.map((program) => (
                  <option key={program.id} value={program.id}>
                    {program.name} · {program.isAssembly ? 'Assembly' : 'Raw'}
                  </option>
                ))}
              </select>
              <div className="mt-3 flex gap-3">
                <button
                  onClick={() => onLoadSavedProgram(selectedSavedProgramId)}
                  disabled={!activeSavedProgram}
                  className="flex-1 rounded border border-[var(--accent)] px-3 py-2 text-xs text-[var(--accent)] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Load Saved
                </button>
                <button
                  onClick={() => onDeleteSavedProgram(selectedSavedProgramId)}
                  disabled={!activeSavedProgram}
                  className="flex-1 rounded border border-rose-500 px-3 py-2 text-xs text-rose-300 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Delete
                </button>
              </div>
              <p className="mt-3 text-xs text-[var(--text-muted)]">
                {activeSavedProgram
                  ? `${activeSavedProgram.isAssembly ? 'Assembly' : 'Raw bytes'} · ${formatSavedAt(activeSavedProgram.savedAt)}`
                  : 'Choose a saved program to load or update it.'}
              </p>
            </>
          ) : (
            <p className="mt-3 text-xs text-[var(--text-muted)]">
              Save current editor contents to build a reusable lesson or challenge attempt library.
            </p>
          )}
        </section>

        <section className="rounded-lg border border-[var(--panel-border)] bg-[var(--panel)] p-3">
          <div className="flex items-center justify-between gap-3">
            <h3 className="text-base font-semibold text-[var(--heading-color)]">
              Challenge
            </h3>
            <button
              onClick={() => onLoadChallenge(activeChallenge)}
              className="rounded border border-[var(--accent)] px-3 py-2 text-xs text-[var(--accent)]"
            >
              Load Starter
            </button>
          </div>
          <select
            value={activeChallenge.id}
            onChange={(event) => onSelectChallenge(event.target.value)}
            className="mt-3 w-full rounded border border-[var(--panel-border)] bg-[var(--output-bg)] px-3 py-2 text-sm text-[var(--text-main)]"
          >
            {challenges.map((challenge) => (
              <option key={challenge.id} value={challenge.id}>
                {challenge.title} · {formatProgramMode(challenge)}
                {challengeProgress[challenge.id]?.passed ? ' [done]' : ''}
              </option>
            ))}
          </select>
          <p className="mt-3 text-[var(--text-main)]">{activeChallenge.prompt}</p>
          <p className="mt-2 text-xs text-[var(--text-muted)]">
            Mode: {formatProgramMode(activeChallenge)}
          </p>
          <div className="mt-3 space-y-2 text-xs text-[var(--text-muted)]">
            {activeChallenge.hints.map((hint) => (
              <p key={hint}>{hint}</p>
            ))}
          </div>

          <div className="mt-4 rounded-md border border-[var(--panel-border)] bg-[var(--output-bg)] p-3">
            <div className="flex items-center justify-between gap-3">
              <span className="text-xs uppercase tracking-[0.2em] text-[var(--text-muted)]">
                Result
              </span>
              <span
                className={`rounded-full px-3 py-1 text-xs ${
                  statusLabel === 'Passed' || statusLabel === 'Completed'
                    ? 'bg-emerald-900 text-emerald-100'
                    : 'bg-zinc-800 text-zinc-200'
                }`}
              >
                {statusLabel}
              </span>
            </div>
            <p className="mt-3 text-xs text-[var(--text-main)]">
              {challengeResult?.summary ??
                (activeChallengeProgress?.passed
                  ? `Completed locally on ${formatSavedAt(activeChallengeProgress.completedAt)}.`
                  : 'Run or step the program to evaluate this challenge.')}
            </p>
            {challengeResult?.checks?.length ? (
              <div className="mt-3 space-y-2">
                {challengeResult.checks.map((check) => (
                  <div
                    key={check.label}
                    className={`rounded px-3 py-2 text-xs ${
                      check.passed
                        ? 'bg-emerald-950 text-emerald-100'
                        : 'bg-rose-950 text-rose-100'
                    }`}
                  >
                    <div>{check.label}</div>
                    <div className="mt-1 opacity-80">
                      expected {check.expected}, actual {String(check.actual)}
                    </div>
                  </div>
                ))}
              </div>
            ) : null}
          </div>
        </section>
      </div>
    </MacWindow>
  );
}
