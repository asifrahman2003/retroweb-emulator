export const NUM_REGS = 8;
export const SCREEN_WIDTH = 32;
export const SCREEN_HEIGHT = 32;
export const FRAMEBUFFER_START = 0x400;
export const FRAMEBUFFER_SIZE = SCREEN_WIDTH * SCREEN_HEIGHT;
export const MEM_SIZE = FRAMEBUFFER_START + FRAMEBUFFER_SIZE;
export const HALT_OPCODE = 255;
export const VM_ERROR_NONE = 0;
export const VM_ERROR_PC_OUT_OF_BOUNDS = 1;
export const VM_ERROR_BAD_REGISTER = 2;
export const VM_ERROR_BAD_ADDRESS = 3;
export const VM_ERROR_BAD_OPCODE = 4;

export function formatVmAddress(address) {
  return `0x${address.toString(16).padStart(4, '0').toUpperCase()}`;
}

export function readVmRuntimeState(vmInstance) {
  if (!vmInstance) {
    return {
      halted: false,
      lastError: VM_ERROR_NONE,
    };
  }

  return {
    halted: Boolean(vmInstance._get_halted?.() ?? false),
    lastError: vmInstance._get_last_error?.() ?? VM_ERROR_NONE,
  };
}

export function describeVmError(errorCode) {
  switch (errorCode) {
    case VM_ERROR_PC_OUT_OF_BOUNDS:
      return 'PC out of bounds';
    case VM_ERROR_BAD_REGISTER:
      return 'Invalid register access';
    case VM_ERROR_BAD_ADDRESS:
      return 'Invalid memory address';
    case VM_ERROR_BAD_OPCODE:
      return 'Unknown opcode';
    default:
      return '';
  }
}
