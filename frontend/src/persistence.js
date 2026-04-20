const WORKSPACE_KEY = 'retroweb.workspace';
const PROGRAMS_KEY = 'retroweb.savedPrograms';
const PROGRESS_KEY = 'retroweb.challengeProgress';

function canUseStorage() {
  return typeof window !== 'undefined' && Boolean(window.localStorage);
}

function safeRead(key, fallbackValue) {
  if (!canUseStorage()) {
    return fallbackValue;
  }

  try {
    const rawValue = window.localStorage.getItem(key);
    return rawValue ? JSON.parse(rawValue) : fallbackValue;
  } catch {
    return fallbackValue;
  }
}

function safeWrite(key, value) {
  if (!canUseStorage()) {
    return;
  }

  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Ignore quota and storage availability failures in the client-only fallback.
  }
}

export function loadWorkspaceState() {
  return safeRead(WORKSPACE_KEY, null);
}

export function saveWorkspaceState(value) {
  safeWrite(WORKSPACE_KEY, value);
}

export function loadSavedPrograms() {
  return safeRead(PROGRAMS_KEY, []);
}

export function saveSavedPrograms(value) {
  safeWrite(PROGRAMS_KEY, value);
}

export function loadChallengeProgress() {
  return safeRead(PROGRESS_KEY, {});
}

export function saveChallengeProgress(value) {
  safeWrite(PROGRESS_KEY, value);
}
