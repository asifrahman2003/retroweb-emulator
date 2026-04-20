import test from 'node:test';
import assert from 'node:assert/strict';

import {
  VM_ERROR_BAD_ADDRESS,
  VM_ERROR_BAD_OPCODE,
  VM_ERROR_BAD_REGISTER,
  VM_ERROR_NONE,
  VM_ERROR_PC_OUT_OF_BOUNDS,
  describeVmError,
  readVmRuntimeState,
} from '../src/vmLayout.js';

test('describeVmError maps known VM error codes to user-facing labels', () => {
  assert.equal(describeVmError(VM_ERROR_PC_OUT_OF_BOUNDS), 'PC out of bounds');
  assert.equal(describeVmError(VM_ERROR_BAD_REGISTER), 'Invalid register access');
  assert.equal(describeVmError(VM_ERROR_BAD_ADDRESS), 'Invalid memory address');
  assert.equal(describeVmError(VM_ERROR_BAD_OPCODE), 'Unknown opcode');
  assert.equal(describeVmError(VM_ERROR_NONE), '');
});

test('readVmRuntimeState tolerates missing exported VM status helpers', () => {
  assert.deepEqual(readVmRuntimeState(null), {
    halted: false,
    lastError: VM_ERROR_NONE,
  });

  assert.deepEqual(readVmRuntimeState({}), {
    halted: false,
    lastError: VM_ERROR_NONE,
  });
});

test('readVmRuntimeState reads halted and error state from the VM module', () => {
  const vmInstance = {
    _get_halted: () => 1,
    _get_last_error: () => VM_ERROR_BAD_OPCODE,
  };

  assert.deepEqual(readVmRuntimeState(vmInstance), {
    halted: true,
    lastError: VM_ERROR_BAD_OPCODE,
  });
});
