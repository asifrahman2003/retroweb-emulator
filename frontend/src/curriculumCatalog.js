const slideBasePath = 'CSc252/slides';
const syllabusPath = 'CSc252/Syllabus - CSC252 - S25.pdf';

function slide(name) {
  return `${slideBasePath}/${name}`;
}

export const curriculumTracks = [
  {
    id: 'foundations',
    label: 'CSc252 Foundations',
    stage: 'Course Slides',
    accent: '#f97316',
    pace: '1 course · 3 modules',
    summary:
      'A first-pass orientation track for the course: what computer organization studies, how low-level representations work, and why the emulator starts with visible machine state.',
    outcomes: [
      'Explain the course-level mental model.',
      'Connect source programs to lower-level representations.',
      'Prepare for assembly and machine execution.',
    ],
    courses: [
      {
        id: 'foundations-orientation',
        title: 'Course 1 · Foundations and Representation',
        level: 'Intro',
        duration: 'Lectures 00-02',
        outcome: 'Build the vocabulary needed before MIPS, datapaths, and pipelining.',
        modules: [
          {
            id: 'intro-course',
            title: 'Course Introduction',
            format: 'Lecture',
            sourceTitle: '00-Introduction.pdf',
            sourcePath: slide('00-Introduction.pdf'),
            summary:
              'Use the introductory lecture as the entry point for the platform: goals, course framing, and why low-level visibility matters.',
            goals: ['Understand the course scope', 'Connect RetroWeb to computer organization topics'],
          },
          {
            id: 'notes-01',
            title: 'Representation Notes I',
            format: 'Lecture Notes',
            sourceTitle: '01-notes.pdf',
            sourcePath: slide('01-notes.pdf'),
            summary:
              'Turn the first notes packet into an interactive module about low-level representation and machine-oriented reasoning.',
            goals: ['Review foundational notation', 'Practice reading state before code'],
          },
          {
            id: 'notes-02',
            title: 'Representation Notes II',
            format: 'Lecture Notes',
            sourceTitle: '02-notes.pdf',
            sourcePath: slide('02-notes.pdf'),
            summary:
              'Continue the foundations sequence and prepare learners for assembly syntax, registers, and memory.',
            goals: ['Build vocabulary for assembly', 'Prepare for MIPS load/store programming'],
          },
        ],
      },
    ],
  },
  {
    id: 'mips-programming',
    label: 'MIPS Programming',
    stage: 'Course Slides',
    accent: '#38bdf8',
    pace: '3 courses · 5 modules',
    summary:
      'The assembly programming track derived from the provided MIPS lectures. This track should eventually connect to a real MIPS simulator, while RetroWeb can teach equivalent concepts today.',
    outcomes: [
      'Read and write basic MIPS assembly.',
      'Understand load/store architecture.',
      'Explain function calls and stack behavior.',
    ],
    courses: [
      {
        id: 'mips-intro-load-store',
        title: 'Course 1 · Intro to MIPS and Load/Store',
        level: 'Assembly',
        duration: 'Lectures 03-04',
        outcome: 'Move from the custom Retro VM into real MIPS assembly concepts.',
        modules: [
          {
            id: 'mips-intro',
            title: 'Intro to MIPS',
            format: 'Lecture',
            sourceTitle: 'Lecture 03-Intro to MIPS.pdf',
            sourcePath: slide('Lecture 03-Intro to MIPS.pdf'),
            summary:
              'Introduce MIPS as the first real architecture track: registers, instruction style, and assembly workflow.',
            goals: ['Identify MIPS register usage', 'Compare MIPS instructions to RetroWeb instructions'],
          },
          {
            id: 'mips-load-store',
            title: 'Load and Store in MIPS',
            format: 'Lecture',
            sourceTitle: 'Lecture 04-Load_Store in MIPS.pdf',
            sourcePath: slide('Lecture 04-Load_Store in MIPS.pdf'),
            summary:
              'Convert the load/store lecture into memory-focused practice with explicit address and data-flow checks.',
            goals: ['Understand load/store architecture', 'Trace data between registers and memory'],
          },
        ],
      },
      {
        id: 'mips-functions',
        title: 'Course 2 · MIPS Functions',
        level: 'Core Assembly',
        duration: 'Lectures 11-12',
        outcome: 'Teach call/return flow, stack discipline, and function structure.',
        modules: [
          {
            id: 'mips-functions-part-1',
            title: 'MIPS Functions Part 1',
            format: 'Lecture',
            sourceTitle: '11_MIPS_functions_part1.pdf',
            sourcePath: slide('11_MIPS_functions_part1.pdf'),
            summary:
              'Create a module for function entry, call flow, and register expectations.',
            goals: ['Understand function boundaries', 'Track return-flow state'],
          },
          {
            id: 'mips-functions-part-2',
            title: 'MIPS Functions Part 2',
            format: 'Lecture',
            sourceTitle: '12_MIPS_functions_part 2.pdf',
            sourcePath: slide('12_MIPS_functions_part 2.pdf'),
            summary:
              'Extend the functions sequence into stack frames, saved state, and multi-step function debugging.',
            goals: ['Explain stack behavior', 'Distinguish caller and callee responsibilities'],
          },
        ],
      },
      {
        id: 'mips-review',
        title: 'Course 3 · Assembly Review',
        level: 'Review',
        duration: 'Lecture 21',
        outcome: 'Consolidate MIPS assembly syntax and debugging habits before architecture internals.',
        modules: [
          {
            id: 'mips-review-asm',
            title: 'Review Assembly',
            format: 'Review',
            sourceTitle: '21_Review ASM.pdf',
            sourcePath: slide('21_Review ASM.pdf'),
            summary:
              'Use the review lecture as a checkpoint module for syntax, state tracing, and common assembly mistakes.',
            goals: ['Review assembly patterns', 'Prepare for CPU implementation topics'],
          },
        ],
      },
    ],
  },
  {
    id: 'cpu-implementation',
    label: 'CPU Implementation',
    stage: 'Course Slides',
    accent: '#a78bfa',
    pace: '2 courses · 4 modules',
    summary:
      'The datapath/control track derived from decoding and execute lectures. This is where learners connect assembly instructions to processor internals.',
    outcomes: [
      'Explain instruction decoding.',
      'Connect control signals to datapath behavior.',
      'Understand execute-stage responsibilities.',
    ],
    courses: [
      {
        id: 'decode-stage',
        title: 'Course 1 · Instruction Decoding',
        level: 'Architecture',
        duration: 'Lectures 13-14',
        outcome: 'Show how binary instructions are interpreted by hardware control logic.',
        modules: [
          {
            id: 'decoding-part-1',
            title: 'Decoding Part 1',
            format: 'Lecture',
            sourceTitle: '13_decoding_part1.pdf',
            sourcePath: slide('13_decoding_part1.pdf'),
            summary:
              'Introduce instruction decoding and the connection between instruction fields and control behavior.',
            goals: ['Identify instruction fields', 'Connect opcode fields to control decisions'],
          },
          {
            id: 'decoding-part-2',
            title: 'Decoding Part 2',
            format: 'Lecture',
            sourceTitle: '14_decoding_part2.pdf',
            sourcePath: slide('14_decoding_part2.pdf'),
            summary:
              'Continue decoding with deeper control cases and more detailed datapath interpretation.',
            goals: ['Trace decode outputs', 'Explain control-flow implications'],
          },
        ],
      },
      {
        id: 'execute-stage',
        title: 'Course 2 · Execute Stage',
        level: 'Architecture',
        duration: 'Lectures 15-16',
        outcome: 'Connect decoded instructions to ALU work, memory paths, and state updates.',
        modules: [
          {
            id: 'execute-part-1',
            title: 'Execute Part 1',
            format: 'Lecture',
            sourceTitle: '15_execute_part1.pdf',
            sourcePath: slide('15_execute_part1.pdf'),
            summary:
              'Introduce execute-stage behavior and the role of datapath components during instruction execution.',
            goals: ['Map operations to datapath components', 'Explain ALU responsibilities'],
          },
          {
            id: 'execute-part-2',
            title: 'Execute Part 2',
            format: 'Lecture',
            sourceTitle: '16_execute_part2.pdf',
            sourcePath: slide('16_execute_part2.pdf'),
            summary:
              'Extend execute-stage reasoning into memory interactions and state update timing.',
            goals: ['Trace execute-stage state changes', 'Prepare for pipeline timing'],
          },
        ],
      },
    ],
  },
  {
    id: 'pipelining',
    label: 'Pipelining',
    stage: 'Course Slides',
    accent: '#34d399',
    pace: '1 course · 4 modules',
    summary:
      'The performance and hazards track based on the pipelining lecture sequence. This should eventually become the most visual part of the app.',
    outcomes: [
      'Describe pipeline stages.',
      'Recognize hazards and stalls.',
      'Reason about instruction overlap over time.',
    ],
    courses: [
      {
        id: 'pipeline-sequence',
        title: 'Course 1 · Pipeline Execution',
        level: 'Advanced Architecture',
        duration: 'Lectures 17-20',
        outcome: 'Understand how processors overlap instructions and what can go wrong.',
        modules: [
          {
            id: 'pipeline-intro',
            title: 'Pipelining Introduction',
            format: 'Lecture',
            sourceTitle: '17_Pipelining_Intro.pdf',
            sourcePath: slide('17_Pipelining_Intro.pdf'),
            summary:
              'Introduce the reason for pipelining and the basic stage-by-stage mental model.',
            goals: ['Define pipeline stages', 'Explain why overlap improves throughput'],
          },
          {
            id: 'pipeline-part-1',
            title: 'Pipelining Part 1',
            format: 'Lecture',
            sourceTitle: '18_Pipelining_part1.pdf',
            sourcePath: slide('18_Pipelining_part1.pdf'),
            summary:
              'Build the first timeline-based model of overlapping instructions.',
            goals: ['Read pipeline timing diagrams', 'Track multiple instructions at once'],
          },
          {
            id: 'pipeline-part-2',
            title: 'Pipelining Part 2',
            format: 'Lecture',
            sourceTitle: '19_Pipelining_part2.pdf',
            sourcePath: slide('19_Pipelining_part2.pdf'),
            summary:
              'Introduce hazards and the reasons a perfect pipeline is difficult in real programs.',
            goals: ['Recognize common hazards', 'Explain why stalls or forwarding may be needed'],
          },
          {
            id: 'pipeline-part-3',
            title: 'Pipelining Part 3',
            format: 'Lecture',
            sourceTitle: '20_Pipelining_part3.pdf',
            sourcePath: slide('20_Pipelining_part3.pdf'),
            summary:
              'Close the sequence with deeper pipeline behavior and review-style reasoning.',
            goals: ['Analyze pipeline behavior', 'Prepare for assessment-style pipeline questions'],
          },
        ],
      },
    ],
  },
];

export const syllabusSequence = [
  {
    id: 'sequence-foundations',
    order: '01',
    unit: 'Course Orientation and Representation',
    scope: 'Introductory course foundation',
    source: 'Syllabus + Lectures 00-02',
    sourcePath: syllabusPath,
    trackId: 'foundations',
    courseId: 'foundations-orientation',
    summary:
      'Start with course goals, representation, and the reason low-level state inspection matters before writing real assembly.',
    checkpoints: [
      'Explain what computer organization studies.',
      'Connect values, memory, and representation.',
      'Use the emulator as a visual model of execution state.',
    ],
  },
  {
    id: 'sequence-mips-basics',
    order: '02',
    unit: 'MIPS Assembly Fundamentals',
    scope: 'Registers, instructions, load/store',
    source: 'Lectures 03-04',
    sourcePath: slide('Lecture 03-Intro to MIPS.pdf'),
    trackId: 'mips-programming',
    courseId: 'mips-intro-load-store',
    summary:
      'Move from the teaching VM into MIPS as the first real architecture: registers, instruction patterns, and explicit memory access.',
    checkpoints: [
      'Identify register-oriented assembly structure.',
      'Explain why MIPS is load/store.',
      'Trace data movement between registers and memory.',
    ],
  },
  {
    id: 'sequence-functions',
    order: '03',
    unit: 'Functions, Stack, and Assembly Review',
    scope: 'Calling convention and review',
    source: 'Lectures 11-12 and 21',
    sourcePath: slide('11_MIPS_functions_part1.pdf'),
    trackId: 'mips-programming',
    courseId: 'mips-functions',
    summary:
      'Build the function-call model: call/return flow, saved state, stack behavior, and assembly review before CPU internals.',
    checkpoints: [
      'Describe function entry and return flow.',
      'Explain stack use at a high level.',
      'Review common assembly patterns and mistakes.',
    ],
  },
  {
    id: 'sequence-decode',
    order: '04',
    unit: 'Instruction Decoding',
    scope: 'Control and instruction fields',
    source: 'Lectures 13-14',
    sourcePath: slide('13_decoding_part1.pdf'),
    trackId: 'cpu-implementation',
    courseId: 'decode-stage',
    summary:
      'Connect assembly-level instructions to how hardware reads instruction fields and produces control behavior.',
    checkpoints: [
      'Identify instruction fields.',
      'Relate opcodes to control decisions.',
      'Explain why decode matters for datapath behavior.',
    ],
  },
  {
    id: 'sequence-execute',
    order: '05',
    unit: 'Execute Stage and Datapath Behavior',
    scope: 'ALU, memory paths, state updates',
    source: 'Lectures 15-16',
    sourcePath: slide('15_execute_part1.pdf'),
    trackId: 'cpu-implementation',
    courseId: 'execute-stage',
    summary:
      'Follow decoded instructions through execute-stage behavior, datapath movement, ALU work, and state updates.',
    checkpoints: [
      'Map operations to datapath components.',
      'Explain execute-stage state changes.',
      'Prepare for pipeline timing and hazards.',
    ],
  },
  {
    id: 'sequence-pipeline',
    order: '06',
    unit: 'Pipelining and Performance',
    scope: 'Pipeline stages, overlap, hazards',
    source: 'Lectures 17-20',
    sourcePath: slide('17_Pipelining_Intro.pdf'),
    trackId: 'pipelining',
    courseId: 'pipeline-sequence',
    summary:
      'Move from single-instruction execution to overlapped execution over time, then reason about hazards and stalls.',
    checkpoints: [
      'Describe pipeline stages.',
      'Read timing diagrams.',
      'Recognize hazards and explain mitigation ideas.',
    ],
  },
];
