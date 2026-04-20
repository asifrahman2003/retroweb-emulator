import {
  VM_ERROR_BAD_OPCODE,
  VM_ERROR_BAD_REGISTER,
  VM_ERROR_PC_OUT_OF_BOUNDS,
} from './vmLayout.js';

export const retroArchitectureProfile = {
  id: 'retro',
  name: 'Retro Core',
  level: 'Starter VM',
  summary:
    'A compact teaching VM for learning registers, control flow, memory writes, and framebuffer output before moving to more complex architectures.',
  learningGoals: [
    'Trace instruction execution one step at a time.',
    'See how register values flow into memory and output.',
    'Understand jumps and zero checks with short programs.',
    'Draw pixels by writing into the framebuffer region.',
  ],
};

export const retroExamples = [
  {
    id: 'double-number',
    title: 'Double A Number',
    difficulty: 'Intro',
    code: `LOAD R1 5
ADD R2 R1 R1
PRINT R2
HALT`,
    description: 'Loads a value, doubles it with ADD, and prints the result.',
    concepts: ['registers', 'arithmetic', 'print'],
  },
  {
    id: 'store-memory',
    title: 'Store Into Memory',
    difficulty: 'Intro',
    code: `LOAD R0 42
STORE R0 32
PRINT R0
HALT`,
    description: 'Shows how register values become visible in the memory dump.',
    concepts: ['memory', 'store', 'registers'],
  },
  {
    id: 'jump-on-zero',
    title: 'Branch On Zero',
    difficulty: 'Core',
    code: `LOAD R0 0
JZ R0 done
LOAD R1 99
done: PRINT R0
HALT`,
    description: 'Demonstrates labels and skipping code when a register is zero.',
    concepts: ['labels', 'jumps', 'control-flow'],
  },
  {
    id: 'pixel-immediate',
    title: 'Plot A Pixel',
    difficulty: 'Core',
    code: `PIX 1 2 3
HALT`,
    description: 'Writes directly into the framebuffer using immediate x, y, and color values.',
    concepts: ['framebuffer', 'graphics', 'immediates'],
  },
  {
    id: 'bad-opcode-demo',
    title: 'Decode Error Demo',
    difficulty: 'Debug',
    assemblyMode: false,
    code: '42',
    description:
      'Runs a raw byte that is not a valid opcode so you can observe the VM halt with an explicit error state.',
    concepts: ['raw-bytes', 'errors', 'debugging'],
  },
  {
    id: 'bad-register-demo',
    title: 'Register Safety Demo',
    difficulty: 'Debug',
    assemblyMode: false,
    code: '1 8 1',
    description:
      'Uses an out-of-range register index in raw-byte mode so you can observe a runtime safety failure that is different from an unknown opcode.',
    concepts: ['raw-bytes', 'registers', 'errors'],
  },
  {
    id: 'program-bounds-demo',
    title: 'Program Bounds Demo',
    difficulty: 'Debug',
    assemblyMode: false,
    code: '7 8',
    description:
      'Jumps past the loaded program length so you can observe the VM reject instruction targets that leave the loaded program region.',
    concepts: ['raw-bytes', 'jumps', 'bounds'],
  },
];

export const retroChallenges = [
  {
    id: 'challenge-store',
    title: 'Memory Write Check',
    prompt: 'Store the value 42 into memory address 0x20 and leave R0 equal to 42.',
    starterCode: `LOAD R0 42
STORE R0 32
HALT`,
    hints: [
      'Use STORE to copy a register value into memory.',
      'Address 32 decimal is 0x20 hex in the memory viewer.',
    ],
    checks: {
      registers: { 0: 42 },
      memory: { 32: 42 },
    },
  },
  {
    id: 'challenge-branch',
    title: 'Skip The Trap',
    prompt: 'Use JZ so that R1 never becomes 99. Keep R1 at 0 after the program runs.',
    starterCode: `LOAD R0 0
JZ R0 safe
LOAD R1 99
safe: HALT`,
    hints: [
      'JZ checks whether the given register is zero.',
      'Jump to a label placed after the instruction you want to skip.',
    ],
    checks: {
      registers: { 1: 0 },
    },
  },
  {
    id: 'challenge-pixel',
    title: 'Light The Screen',
    prompt: 'Draw color 3 at coordinate (1, 2) so the framebuffer cell at 0x0441 changes.',
    starterCode: `PIX 1 2 3
HALT`,
    hints: [
      'Framebuffer starts at 0x0400.',
      'The target cell for (1,2) is 0x0400 + 2*32 + 1 = 0x0441.',
    ],
    checks: {
      memory: { 0x441: 3 },
    },
  },
  {
    id: 'challenge-bad-opcode',
    title: 'Trigger A VM Error',
    prompt: 'Load a raw byte sequence that causes an unknown opcode error and leaves the VM in an error state.',
    assemblyMode: false,
    starterCode: '42',
    hints: [
      'Turn off assembly for this challenge or use the provided raw-byte starter.',
      'The VM should stop immediately with an unknown opcode error.',
    ],
    checks: {
      runtime: {
        halted: true,
        lastError: VM_ERROR_BAD_OPCODE,
      },
    },
  },
  {
    id: 'challenge-bad-register',
    title: 'Trigger A Safety Error',
    prompt: 'Load a raw byte sequence that tries to access an invalid register so the VM reports a register safety error.',
    assemblyMode: false,
    starterCode: '1 8 1',
    hints: [
      'Opcode 1 is LOAD, followed by register index and immediate value.',
      'The VM only supports registers R0 through R7, so register index 8 should fail.',
    ],
    checks: {
      runtime: {
        halted: true,
        lastError: VM_ERROR_BAD_REGISTER,
      },
    },
  },
  {
    id: 'challenge-program-bounds',
    title: 'Jump Past The Program',
    prompt: 'Load a raw byte sequence that jumps beyond the loaded program length so the VM reports a PC out-of-bounds error.',
    assemblyMode: false,
    starterCode: '7 8',
    hints: [
      'Opcode 7 is JMP, followed by a byte-sized target address.',
      'With only two bytes loaded, jumping to address 8 should now fail under the new program-length checks.',
    ],
    checks: {
      runtime: {
        halted: true,
        lastError: VM_ERROR_PC_OUT_OF_BOUNDS,
      },
    },
  },
];
