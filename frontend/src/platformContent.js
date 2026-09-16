export const PLATFORM_NAME = 'retroWeb Academy';
export const PLATFORM_TAGLINE = 'Learn assembly programming in the browser, one lesson at a time.';

export const platformNavigation = [
  {
    title: 'Explore',
    items: [
      {
        id: 'landing',
        label: 'Overview',
        blurb: 'What the academy is and where to start.',
      },
    ],
  },
  {
    title: 'Learn',
    items: [
      {
        id: 'dashboard',
        label: 'Dashboard',
        blurb: 'Resume work and see recent progress.',
      },
      {
        id: 'workspace',
        label: 'Workspace',
        blurb: 'Editor, debugger, memory, output, and guided challenges.',
      },
      {
        id: 'lessons',
        label: 'Lessons',
        blurb: 'Course topics and starter lessons.',
      },
      {
        id: 'labs',
        label: 'Labs',
        blurb: 'Practice problems with local checks.',
      },
      {
        id: 'reports',
        label: 'Reports',
        blurb: 'Review the latest run state.',
      },
      {
        id: 'programs',
        label: 'Programs',
        blurb: 'Saved code and starter examples.',
      },
      {
        id: 'progress',
        label: 'Progress',
        blurb: 'Lab completion and topic practice.',
      },
      {
        id: 'docs',
        label: 'Docs',
        blurb: 'Instruction reference and examples.',
      },
    ],
  },
  {
    title: 'Teach',
    items: [
      {
        id: 'instructor',
        label: 'Instructor',
        blurb: 'Classroom view and assignment drafts.',
      },
    ],
  },
  {
    title: 'Account',
    items: [
      {
        id: 'settings',
        label: 'Settings',
        blurb: 'Editor, runtime, and account options.',
      },
    ],
  },
];

export const landingCapabilities = [
  {
    title: 'Step-By-Step Runs',
    description: 'Run one instruction at a time and see registers, memory, and pixels update.',
  },
  {
    title: 'Guided Lessons',
    description: 'Start with the small Retro Core VM before moving into MIPS and CPU topics.',
  },
  {
    title: 'Practice Checks',
    description: 'Use starter programs, save your work, and check answers against VM state.',
  },
  {
    title: 'More Tracks Later',
    description: 'Retro Core is live now. MIPS, CPU internals, and pipeline lessons can build on it.',
  },
];

export const landingUseCases = [
  {
    title: 'Computer Architecture Courses',
    description: 'Use short programs and visible state to explain registers, memory, branches, and output.',
  },
  {
    title: 'Self-Guided Practice',
    description: 'Try code in the browser without setting up a local assembler or simulator.',
  },
  {
    title: 'Class Labs',
    description: 'Share starter code, check results, and review what changed during a run.',
  },
];

export const learningPathBlueprint = [
  {
    title: 'Retro Core',
    stage: 'Live',
    description: 'Practice registers, jumps, memory stores, pixel output, and debugging basics.',
  },
  {
    title: 'MIPS Track',
    stage: 'Planned',
    description: 'Connect the Retro Core ideas to a real load/store instruction set.',
  },
  {
    title: 'Systems Lab',
    stage: 'Planned',
    description: 'Add stack work, calling conventions, and lower-level debugging exercises.',
  },
];

export const docsReferenceSections = [
  {
    title: 'Instruction Set',
    items: [
      'LOAD Rx, imm: place an immediate byte into a register.',
      'STORE Rx, addr: write a register value into memory.',
      'ADD/SUB: compute with register operands and store into a destination register.',
      'PRINT, JMP, JZ, PIX, PIXR, HALT: output, control flow, graphics, and execution stop.',
    ],
  },
  {
    title: 'Debugger Concepts',
    items: [
      'Step executes a single instruction and refreshes registers, memory, and canvas.',
      'Run resets the program and executes until HALT or an error state.',
      'Memory dump addresses are logical VM addresses, not host pointers.',
      'STORE addresses are byte operands today, so assembly STORE targets must be 0-255.',
      'Arithmetic registers wrap to 8-bit values, so 255 + 1 becomes 0 and 5 - 7 becomes 254.',
      'VM errors now distinguish unknown opcodes, invalid registers, and PC bounds failures.',
    ],
  },
  {
    title: 'Assessment Model',
    items: [
      'Challenges validate register state, memory writes, framebuffer cells, and runtime error conditions.',
      'Saved programs persist locally for now and can become cloud-backed later.',
      'Reports can grow into trace logs, memory diffs, and challenge feedback.',
    ],
  },
];

export const settingsBlueprint = [
  {
    title: 'Editor Defaults',
    description: 'Theme, font size, line wrapping, default mode, and helper text.',
  },
  {
    title: 'Runtime Defaults',
    description: 'Auto-reset behavior, stepping speed, memory density, and breakpoint options.',
  },
  {
    title: 'Learning Preferences',
    description: 'Difficulty, lesson suggestions, accessibility settings, and reminders.',
  },
  {
    title: 'Integrations',
    description: 'Account login, class exports, and shared content can be added later.',
  },
];

export function flattenNavigation() {
  return platformNavigation.flatMap((section) => section.items);
}

export function isValidRoute(routeId) {
  return flattenNavigation().some((route) => route.id === routeId);
}

export function getRouteFromHash(hash = '') {
  const normalized = hash.replace(/^#\/?/, '').trim();
  const routeId = normalized.split(/[/?#]/)[0];
  return isValidRoute(routeId) ? routeId : 'landing';
}
