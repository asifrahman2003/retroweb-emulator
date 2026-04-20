import test from 'node:test';
import assert from 'node:assert/strict';

import { retroChallenges } from '../src/educationContent.js';
import { evaluateChallenge } from '../src/challengeValidator.js';
import {
  VM_ERROR_BAD_OPCODE,
  VM_ERROR_BAD_REGISTER,
  VM_ERROR_PC_OUT_OF_BOUNDS,
} from '../src/vmLayout.js';

test('evaluateChallenge passes when register and memory checks match', () => {
  const challenge = retroChallenges.find((entry) => entry.id === 'challenge-store');
  const memorySnapshot = new Uint8Array(2048);
  memorySnapshot[32] = 42;

  const result = evaluateChallenge(challenge, {
    registerValues: [42, 0, 0, 0, 0, 0, 0, 0],
    memorySnapshot,
  });

  assert.equal(result.passed, true);
  assert.equal(result.checks.every((check) => check.passed), true);
});

test('evaluateChallenge reports failed checks when values do not match', () => {
  const challenge = retroChallenges.find((entry) => entry.id === 'challenge-pixel');
  const memorySnapshot = new Uint8Array(2048);

  const result = evaluateChallenge(challenge, {
    registerValues: Array(8).fill(0),
    memorySnapshot,
  });

  assert.equal(result.passed, false);
  assert.equal(result.checks.length, 1);
  assert.match(result.summary, /not complete/i);
});

test('evaluateChallenge can validate runtime error state', () => {
  const challenge = retroChallenges.find((entry) => entry.id === 'challenge-bad-opcode');

  const result = evaluateChallenge(challenge, {
    registerValues: Array(8).fill(0),
    memorySnapshot: new Uint8Array(2048),
    vmRuntimeState: {
      halted: true,
      lastError: VM_ERROR_BAD_OPCODE,
    },
  });

  assert.equal(result.passed, true);
  assert.equal(result.checks.length, 2);
  assert.equal(result.checks.every((check) => check.passed), true);
});

test('evaluateChallenge distinguishes register safety failures from opcode failures', () => {
  const challenge = retroChallenges.find((entry) => entry.id === 'challenge-bad-register');

  const result = evaluateChallenge(challenge, {
    registerValues: Array(8).fill(0),
    memorySnapshot: new Uint8Array(2048),
    vmRuntimeState: {
      halted: true,
      lastError: VM_ERROR_BAD_REGISTER,
    },
  });

  assert.equal(result.passed, true);
  assert.equal(result.checks.length, 2);
  assert.equal(result.checks.every((check) => check.passed), true);
});

test('evaluateChallenge can validate program bounds failures', () => {
  const challenge = retroChallenges.find((entry) => entry.id === 'challenge-program-bounds');

  const result = evaluateChallenge(challenge, {
    registerValues: Array(8).fill(0),
    memorySnapshot: new Uint8Array(2048),
    vmRuntimeState: {
      halted: true,
      lastError: VM_ERROR_PC_OUT_OF_BOUNDS,
    },
  });

  assert.equal(result.passed, true);
  assert.equal(result.checks.length, 2);
  assert.equal(result.checks.every((check) => check.passed), true);
});
