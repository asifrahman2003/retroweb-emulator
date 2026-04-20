import test from 'node:test';
import assert from 'node:assert/strict';

import {
  loadChallengeProgress,
  loadSavedPrograms,
  loadWorkspaceState,
  saveChallengeProgress,
  saveSavedPrograms,
  saveWorkspaceState,
} from '../src/persistence.js';

function createStorage(initialValues = {}) {
  const values = new Map(Object.entries(initialValues));

  return {
    getItem(key) {
      return values.has(key) ? values.get(key) : null;
    },
    setItem(key, value) {
      values.set(key, value);
    },
  };
}

function withWindowStorage(storage, callback) {
  const previousWindow = globalThis.window;
  globalThis.window = { localStorage: storage };

  try {
    callback();
  } finally {
    if (previousWindow === undefined) {
      delete globalThis.window;
    } else {
      globalThis.window = previousWindow;
    }
  }
}

test('workspace state round-trips through localStorage', () => {
  withWindowStorage(createStorage(), () => {
    const workspace = {
      input: 'LOAD R0 7\nHALT',
      isAssembly: true,
      selectedExampleId: 'double-number',
      selectedChallengeId: 'challenge-store',
    };

    saveWorkspaceState(workspace);

    assert.deepEqual(loadWorkspaceState(), workspace);
  });
});

test('saved program and challenge progress persistence use safe fallbacks', () => {
  withWindowStorage(
    createStorage({
      'retroweb.savedPrograms': 'not-json',
      'retroweb.challengeProgress': '{"challenge-store":{"passed":true}}',
    }),
    () => {
      assert.deepEqual(loadSavedPrograms(), []);
      assert.deepEqual(loadChallengeProgress(), {
        'challenge-store': { passed: true },
      });

      saveSavedPrograms([{ id: 'program-1', name: 'Test', code: 'HALT', isAssembly: true }]);
      saveChallengeProgress({ 'challenge-pixel': { passed: true } });

      assert.equal(loadSavedPrograms()[0].id, 'program-1');
      assert.equal(loadChallengeProgress()['challenge-pixel'].passed, true);
    },
  );
});
