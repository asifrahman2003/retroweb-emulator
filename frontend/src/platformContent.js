export const PLATFORM_NAME = 'retroWeb Academy';
export const PLATFORM_TAGLINE = 'Learn low-level systems by stepping through code until the machine makes sense.';

export const platformNavigation = [
  {
    title: 'Explore',
    items: [
      {
        id: 'landing',
        label: 'Overview',
        blurb: 'Product story, value proposition, and platform map.',
      },
    ],
  },
  {
    title: 'Learn',
    items: [
      {
        id: 'dashboard',
        label: 'Dashboard',
        blurb: 'Resume learning, recent work, and recommended next steps.',
      },
      {
        id: 'workspace',
        label: 'Workspace',
        blurb: 'Editor, debugger, memory, output, and guided challenges.',
      },
      {
        id: 'lessons',
        label: 'Lessons',
        blurb: 'Structured learning paths, architecture tracks, and modules.',
      },
      {
        id: 'labs',
        label: 'Labs',
        blurb: 'Hands-on exercises, checkpoints, and graded challenge queues.',
      },
      {
        id: 'reports',
        label: 'Reports',
        blurb: 'Execution reviews, runtime traces, and exportable summaries.',
      },
      {
        id: 'programs',
        label: 'Programs',
        blurb: 'Saved drafts, starter templates, and reusable code assets.',
      },
      {
        id: 'progress',
        label: 'Progress',
        blurb: 'Mastery map, completion stats, and milestone tracking.',
      },
      {
        id: 'docs',
        label: 'Docs',
        blurb: 'ISA references, debugger guides, and interpretation help.',
      },
    ],
  },
  {
    title: 'Teach',
    items: [
      {
        id: 'instructor',
        label: 'Instructor',
        blurb: 'Classroom analytics, assignments, and content operations.',
      },
    ],
  },
  {
    title: 'Account',
    items: [
      {
        id: 'settings',
        label: 'Settings',
        blurb: 'Editor defaults, runtime preferences, and future integrations.',
      },
    ],
  },
];

export const landingCapabilities = [
  {
    title: 'Visual Execution',
    description: 'Step through every instruction and inspect how registers, memory, and framebuffer output evolve.',
  },
  {
    title: 'Guided Curriculum',
    description: 'Blend lessons, labs, and assessments so students move from toy machines into real architectures.',
  },
  {
    title: 'Practice at Scale',
    description: 'Support saved programs, challenge validation, progress tracking, and future classroom workflows.',
  },
  {
    title: 'Architecture Tracks',
    description: 'Start with Retro Core now, then expand into MIPS, RISC-V, x86, and systems debugging later.',
  },
];

export const landingUseCases = [
  {
    title: 'Computer Architecture Courses',
    description: 'Use short programs and visible machine state to explain fetch-decode-execute, control flow, and memory writes.',
  },
  {
    title: 'Self-Guided Systems Learning',
    description: 'Give learners a browser-first sandbox where they can tinker, break things, and recover quickly.',
  },
  {
    title: 'Instructor-Led Labs',
    description: 'Assign starter code, validate results, and review execution traces without local toolchain setup.',
  },
];

export const learningPathBlueprint = [
  {
    title: 'Retro Core',
    stage: 'Live',
    description: 'Teach registers, jumps, memory stores, framebuffer writes, and debugging fundamentals.',
  },
  {
    title: 'MIPS Track',
    stage: 'Planned',
    description: 'Introduce a real ISA with structured stepping, breakpoints, and clearer architecture transfer.',
  },
  {
    title: 'Systems Lab',
    stage: 'Planned',
    description: 'Expand toward OS-oriented exercises, calling conventions, and reverse-engineering habits.',
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
      'Reports should eventually capture trace, memory diffs, and rubric-aligned feedback.',
    ],
  },
];

export const settingsBlueprint = [
  {
    title: 'Editor Defaults',
    description: 'Theme, font size, line wrapping, starter language mode, and onboarding hints.',
  },
  {
    title: 'Runtime Defaults',
    description: 'Auto-reset behavior, stepping speed, memory pane density, and future breakpoint preferences.',
  },
  {
    title: 'Learning Preferences',
    description: 'Difficulty track, lesson recommendations, accessibility settings, and notification rules.',
  },
  {
    title: 'Integrations',
    description: 'Supabase auth, LMS sync, assignment exports, and API-backed content management later.',
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
  return isValidRoute(normalized) ? normalized : 'landing';
}
