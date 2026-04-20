import test from 'node:test';
import assert from 'node:assert/strict';

import { assemble, assembleProgram } from '../src/assembler.js';

test('assembleProgram returns bytecode and source map for labels and commas', () => {
  const program = `
start:
  LOAD R1, 5
  JMP end
  ADD R2, R1, R1
end: PRINT R1
  HALT
`;

  const result = assembleProgram(program);

  assert.deepEqual(result.bytecode, [1, 1, 5, 7, 9, 2, 2, 1, 1, 5, 1, 255]);
  assert.deepEqual(result.sourceMap, {
    0: 3,
    3: 4,
    5: 5,
    9: 6,
    11: 7,
  });
  assert.equal(result.labels.START, 0);
  assert.equal(result.labels.END, 9);
});

test('assemble preserves the old bytecode-only API', () => {
  assert.deepEqual(assemble('LOAD R0 7\nHALT'), [1, 0, 7, 255]);
});

test('assembler rejects byte values outside the VM byte range', () => {
  assert.throws(() => assembleProgram('LOAD R0 300\nHALT'), /between 0 and 255/);
});

test('assembler rejects missing operands instead of emitting malformed bytecode', () => {
  assert.throws(() => assembleProgram('LOAD R0\nHALT'), /LOAD expects 2 operands, got 1/);
  assert.throws(() => assembleProgram('ADD R0 R1\nHALT'), /ADD expects 3 operands, got 2/);
});

test('assembler rejects extra operands instead of ignoring them', () => {
  assert.throws(() => assembleProgram('HALT R0'), /HALT expects 0 operands, got 1/);
  assert.throws(() => assembleProgram('PRINT R0 R1'), /PRINT expects 1 operand, got 2/);
});

test('assembler rejects unresolved labels', () => {
  assert.throws(() => assembleProgram('JMP missing_label\nHALT'), /Unknown label: MISSING_LABEL/);
});
