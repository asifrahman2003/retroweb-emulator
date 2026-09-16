export const lessonSources = {
  'retro-core-vm': {
    title: 'retroWeb Academy Retro Core VM',
    kind: 'Internal reference',
    url: '#/docs',
    note: 'Current app behavior for LOAD, ADD, SUB, STORE, PRINT, JZ, JMP, PIX, PIXR, and HALT.',
  },
  'cs61c-riscv-notes': {
    title: 'CS61C RISC-V Course Notes',
    kind: 'Course notes',
    url: 'https://notes.cs61c.org/content/rv-intro/',
    note: 'Useful learning sequence for ISA ideas, registers, memory, control flow, procedures, datapath, and pipelining.',
  },
  'riscv-asm-manual': {
    title: 'RISC-V Assembly Programmer Manual',
    kind: 'Reference',
    url: 'https://github.com/riscv-non-isa/riscv-asm-manual',
    note: 'Practical RISC-V assembly conventions, syntax, directives, and programmer-facing details.',
  },
  'riscv-isa-manual': {
    title: 'RISC-V Instruction Set Manual',
    kind: 'Specification',
    url: 'https://github.com/riscv/riscv-isa-manual',
    note: 'Source of truth for RISC-V instruction behavior and architecture definitions.',
  },
  rars: {
    title: 'RARS RISC-V Simulator',
    kind: 'Simulator',
    url: 'https://github.com/TheThirdOne/rars',
    note: 'Educational RISC-V assembler and runtime simulator with debugging support.',
  },
  venus: {
    title: 'Venus RISC-V Reference',
    kind: 'Simulator guide',
    url: 'https://cs61c.org/fa26/resources/venus-reference/',
    note: 'Browser-oriented RISC-V workflow for editing, stepping, registers, memory, traces, and simulator settings.',
  },
  mars: {
    title: 'MARS MIPS Simulator',
    kind: 'Simulator',
    url: 'https://github.com/dpetersanderson/MARS',
    note: 'Educational MIPS assembler and runtime simulator used in computer organization courses.',
  },
  spim: {
    title: 'SPIM MIPS Simulator',
    kind: 'Simulator',
    url: 'https://spimsimulator.sourceforge.net/',
    note: 'Classic MIPS32 simulator reference with source code and documentation.',
  },
  'ost2-arch1001': {
    title: 'OpenSecurityTraining2 Architecture 1001',
    kind: 'Course',
    url: 'https://p.ost2.fyi/courses/course-v1:OpenSecurityTraining2%2BArch1001_x86-64_Asm%2B2021_v1/',
    note: 'Free x86-64 assembly course covering registers, stack, calls, branches, and real program reading.',
  },
  'intel-sdm': {
    title: 'Intel 64 and IA-32 Software Developer Manuals',
    kind: 'Specification',
    url: 'https://www.intel.com/content/www/us/en/developer/articles/technical/intel-sdm.html',
    note: 'Official Intel architecture and instruction-set manuals for advanced x86-64 reference work.',
  },
  'arm-learn': {
    title: 'Arm Learn the Architecture',
    kind: 'Guide',
    url: 'https://www.arm.com/architecture/learn-the-architecture',
    note: 'Official Arm learning guides with tutorials, examples, and knowledge checks.',
  },
  nasm: {
    title: 'NASM Documentation',
    kind: 'Assembler docs',
    url: 'https://www.nasm.us/docs.html',
    note: 'Reference for NASM syntax and x86/x86-64 assembly tooling.',
  },
};

function getSourceTitle(sourceIds) {
  return sourceIds
    .map((sourceId) => lessonSources[sourceId]?.title)
    .filter(Boolean)
    .slice(0, 2)
    .join(' + ');
}

function createLesson({
  id,
  title,
  sourceIds,
  summary,
  goals,
  sections,
  practice,
  checks,
  vocabulary,
  exampleId,
  conceptExample,
  implementationPlan,
  format = 'Lesson',
  status = 'Ready',
  time = '15 min',
  level = 'Intro',
}) {
  return {
    id,
    title,
    format,
    status,
    time,
    level,
    sourceIds,
    sourceTitle: getSourceTitle(sourceIds),
    summary,
    goals,
    exampleId,
    lesson: {
      sections,
      practice,
      checks,
      vocabulary,
      conceptExample,
      implementationPlan,
    },
  };
}

export const curriculumTracks = [
  {
    id: 'retro-core',
    label: 'Retro Core Foundations',
    stage: 'Live track',
    accent: '#d96a2c',
    pace: '3 courses · 8 lessons',
    summary:
      'Start with the VM that already runs in retroWeb Academy. Learners see state change before moving to larger real-world instruction sets.',
    outcomes: [
      'Read a small assembly program one instruction at a time.',
      'Trace registers, memory, program counter, console output, and framebuffer changes.',
      'Use labels, branches, and checks to explain program behavior.',
    ],
    courses: [
      {
        id: 'machine-state',
        title: 'Course 1 · Machine State',
        level: 'Intro',
        duration: 'Lessons 01-02',
        outcome: 'Build the mental model: instructions update visible machine state.',
        modules: [
          createLesson({
            id: 'state-first-program',
            title: 'Your First Machine State',
            status: 'Live in VM',
            time: '12 min',
            level: 'Intro',
            sourceIds: ['retro-core-vm', 'cs61c-riscv-notes'],
            exampleId: 'double-number',
            summary:
              'Learn what the VM is showing you: program counter, registers, memory, console output, and halted state.',
            goals: [
              'Name the visible parts of the VM.',
              'Explain why stepping makes assembly easier to learn.',
              'Predict what changes after LOAD, ADD, PRINT, and HALT.',
            ],
            sections: [
              {
                title: 'The learner view',
                body:
                  'Assembly feels difficult when the machine is invisible. retroWeb Academy starts by showing the moving parts: the current instruction, the registers, memory, console output, and whether the VM is still running.',
              },
              {
                title: 'What changes after each instruction',
                body:
                  'A program is a list of small commands. The program counter points at the next command. When an instruction runs, it may change a register, write memory, print output, draw a pixel, jump somewhere else, or stop the program.',
              },
              {
                title: 'How this connects to real assembly',
                body:
                  'Real ISAs such as RISC-V and MIPS also expose registers, memory, instructions, and a program counter. Retro Core is smaller, so the same idea is easier to see first.',
              },
            ],
            practice: {
              title: 'Trace the starter program',
              prompt:
                'Open the demo, step through it, and write down the PC and register change after each instruction.',
              steps: [
                'Load the demo into the workspace.',
                'Press Step once and inspect R1.',
                'Step through ADD, PRINT, and HALT.',
                'Explain why the console prints 10.',
              ],
            },
            checks: [
              'After LOAD R1 5, R1 should contain 5.',
              'After ADD R2 R1 R1, R2 should contain 10.',
              'HALT should stop execution without an error.',
            ],
            vocabulary: ['program counter', 'register', 'memory', 'halted state'],
          }),
          createLesson({
            id: 'register-arithmetic',
            title: 'Registers and Arithmetic',
            status: 'Live in VM',
            time: '18 min',
            level: 'Intro',
            sourceIds: ['retro-core-vm', 'riscv-asm-manual', 'cs61c-riscv-notes'],
            exampleId: 'double-number',
            summary:
              'Use LOAD, ADD, and SUB to understand register operands, destination registers, and 8-bit wrapping.',
            goals: [
              'Read destination and source register order.',
              'Explain why arithmetic writes into a register.',
              'Notice 8-bit wraparound in the current VM.',
            ],
            sections: [
              {
                title: 'Registers are named storage',
                body:
                  'A register is a small storage slot inside the machine. Retro Core has R0 through R7. Instructions name the registers they read and the register they overwrite.',
              },
              {
                title: 'Destination comes first',
                body:
                  'In Retro Core arithmetic, ADD R2 R1 R1 means R2 receives R1 plus R1. The destination is first, followed by the source registers.',
              },
              {
                title: 'Numbers are bytes today',
                body:
                  'The current VM stores arithmetic results as byte-sized values. That makes overflow visible: 255 + 1 wraps around to 0.',
              },
            ],
            practice: {
              title: 'Change the result',
              prompt:
                'Change the demo so it loads 12, subtracts 5, and prints the result.',
              steps: [
                'Load 12 into R1.',
                'Load 5 into R2.',
                'Use SUB R3 R1 R2.',
                'Print R3 and run the program.',
              ],
            },
            checks: [
              'The program should print 7.',
              'R3 should contain 7 at the end.',
              'The program should end with HALT.',
            ],
            vocabulary: ['operand', 'destination register', 'source register', 'overflow'],
          }),
        ],
      },
      {
        id: 'memory-control',
        title: 'Course 2 · Memory and Control Flow',
        level: 'Core',
        duration: 'Lessons 03-05',
        outcome: 'Move values through memory and make the program choose where to go next.',
        modules: [
          createLesson({
            id: 'memory-addresses',
            title: 'Memory Addresses',
            status: 'Live in VM',
            time: '18 min',
            level: 'Core',
            sourceIds: ['retro-core-vm', 'cs61c-riscv-notes'],
            exampleId: 'store-memory',
            summary:
              'Use STORE to connect register values to memory addresses and inspect the memory viewer.',
            goals: [
              'Describe an address as a numbered location in memory.',
              'Use STORE to write a register value into memory.',
              'Find a changed cell in the memory dump.',
            ],
            sections: [
              {
                title: 'Memory is indexed storage',
                body:
                  'Registers are fast and few. Memory has many numbered cells. STORE copies a register value into one of those numbered locations.',
              },
              {
                title: 'Address and value are different',
                body:
                  'STORE R0 32 writes the value in R0 into address 32. Address 32 is the location; the register contains the value placed there.',
              },
              {
                title: 'Why this matters later',
                body:
                  'MIPS and RISC-V are load/store architectures. Real programs constantly move values between registers and memory, especially for arrays, local variables, and saved state.',
              },
            ],
            practice: {
              title: 'Write two cells',
              prompt:
                'Store 42 at address 32 and 7 at address 33, then inspect both memory cells.',
              steps: [
                'Load 42 into R0 and store it at 32.',
                'Load 7 into R1 and store it at 33.',
                'Run the program and open the memory viewer.',
                'Confirm both cells changed.',
              ],
            },
            checks: [
              'Memory address 32 should contain 42.',
              'Memory address 33 should contain 7.',
              'R0 and R1 should keep their loaded values.',
            ],
            vocabulary: ['address', 'memory cell', 'store', 'load/store architecture'],
          }),
          createLesson({
            id: 'labels-branches',
            title: 'Labels and Branches',
            status: 'Live in VM',
            time: '20 min',
            level: 'Core',
            sourceIds: ['retro-core-vm', 'cs61c-riscv-notes', 'venus'],
            exampleId: 'jump-on-zero',
            summary:
              'Use labels, JZ, and JMP to skip instructions and redirect the program counter.',
            goals: [
              'Use labels instead of counting byte addresses by hand.',
              'Explain how JZ chooses between two paths.',
              'Explain why JMP changes the next instruction.',
            ],
            sections: [
              {
                title: 'Labels are names for positions',
                body:
                  'A label marks a place in the program. The assembler turns the label into the byte address the VM needs.',
              },
              {
                title: 'JZ reads a register',
                body:
                  'JZ R0 done means: if R0 is zero, set the program counter to the address named done. Otherwise, keep moving to the next instruction.',
              },
              {
                title: 'JMP is unconditional',
                body:
                  'JMP does not check a value. It always moves the program counter. Loops usually combine a conditional branch with an unconditional jump back.',
              },
            ],
            practice: {
              title: 'Skip the trap',
              prompt:
                'Write a program where R1 stays 0 because a JZ skips over LOAD R1 99.',
              steps: [
                'Load 0 into R0.',
                'Branch to a safe label with JZ R0 safe.',
                'Place LOAD R1 99 before the safe label.',
                'Run and confirm R1 never changes.',
              ],
            },
            checks: [
              'R1 should remain 0.',
              'The PC should jump to the label when R0 is zero.',
              'The skipped instruction should not run.',
            ],
            vocabulary: ['label', 'branch', 'program counter', 'conditional jump'],
          }),
          createLesson({
            id: 'loops-zero-checks',
            title: 'Loops with Zero Checks',
            status: 'Live in VM',
            time: '24 min',
            level: 'Core',
            sourceIds: ['retro-core-vm', 'cs61c-riscv-notes', 'venus'],
            exampleId: 'countdown-loop',
            summary:
              'Build a short countdown loop by combining SUB, JZ, JMP, and labels.',
            goals: [
              'Identify the loop body.',
              'Explain the exit condition.',
              'Trace how the PC repeats an earlier instruction.',
            ],
            sections: [
              {
                title: 'A loop is controlled repetition',
                body:
                  'The VM does not have a special loop instruction. A loop is just a label, some work, a condition, and a jump back.',
              },
              {
                title: 'Make progress each time',
                body:
                  'A loop needs a value that moves toward the exit condition. In the countdown demo, R0 decreases by 1 each trip through the loop.',
              },
              {
                title: 'Stop before the machine runs away',
                body:
                  'A missing exit branch can make a program repeat forever. The VM lets you step slowly so you can catch that before using Run.',
              },
            ],
            practice: {
              title: 'Change the countdown',
              prompt:
                'Change the demo so it starts at 4 and stops cleanly after printing 0.',
              steps: [
                'Load 4 into R0.',
                'Keep R1 as the decrement value.',
                'Step the loop until R0 reaches 0.',
                'Confirm the program reaches HALT.',
              ],
            },
            checks: [
              'The console should show a descending sequence.',
              'R0 should be 0 at the end.',
              'The VM should halt without a runtime error.',
            ],
            vocabulary: ['loop body', 'exit condition', 'decrement', 'infinite loop'],
          }),
        ],
      },
      {
        id: 'output-debugging',
        title: 'Course 3 · Output and Debugging',
        level: 'Core',
        duration: 'Lessons 06-08',
        outcome: 'Use visual output and runtime errors as learning tools.',
        modules: [
          createLesson({
            id: 'framebuffer-immediates',
            title: 'Draw with Immediate Pixels',
            status: 'Live in VM',
            time: '16 min',
            level: 'Core',
            sourceIds: ['retro-core-vm'],
            exampleId: 'pixel-immediate',
            summary:
              'Use PIX with immediate x, y, and color values to write into the framebuffer.',
            goals: [
              'Explain how a pixel write maps to framebuffer memory.',
              'Use coordinates to place output.',
              'Connect visual output to memory side effects.',
            ],
            sections: [
              {
                title: 'The screen is memory-backed',
                body:
                  'The VM draws by writing color values into a memory region reserved for pixels. That makes graphics another version of memory output.',
              },
              {
                title: 'Immediate values are written in the instruction',
                body:
                  'PIX 1 2 3 carries the x coordinate, y coordinate, and color directly in the program bytes.',
              },
              {
                title: 'Visual feedback makes state easier',
                body:
                  'A changed register can be abstract. A changed pixel gives learners another way to see that an instruction actually ran.',
              },
            ],
            practice: {
              title: 'Draw a small diagonal',
              prompt:
                'Use three PIX instructions to place color 3 at (1,1), (2,2), and (3,3).',
              steps: [
                'Add one PIX instruction for each coordinate.',
                'End with HALT.',
                'Run the program and inspect the canvas.',
              ],
            },
            checks: [
              'Three cells in the framebuffer should change.',
              'No register setup is required for PIX.',
              'The program should end with HALT.',
            ],
            vocabulary: ['framebuffer', 'coordinate', 'immediate value', 'color value'],
          }),
          createLesson({
            id: 'framebuffer-registers',
            title: 'Draw with Register Pixels',
            status: 'Live in VM',
            time: '18 min',
            level: 'Core',
            sourceIds: ['retro-core-vm'],
            exampleId: 'pixel-registers',
            summary:
              'Use PIXR to draw from register values instead of hard-coded pixel operands.',
            goals: [
              'Load x, y, and color into registers.',
              'Use PIXR to read all three values.',
              'Compare immediate operands with register operands.',
            ],
            sections: [
              {
                title: 'Registers make output flexible',
                body:
                  'PIXR reads coordinates and color from registers. That means earlier instructions can calculate or choose what gets drawn.',
              },
              {
                title: 'Same effect, different operands',
                body:
                  'PIX 2 3 4 and PIXR R0 R1 R2 can produce the same pixel if R0 is 2, R1 is 3, and R2 is 4.',
              },
              {
                title: 'Why this prepares for real graphics',
                body:
                  'Many real systems use memory-mapped output. A program writes values to a special memory region, and hardware turns those values into visible output.',
              },
            ],
            practice: {
              title: 'Move the pixel',
              prompt:
                'Change the register loads so the demo draws at a different coordinate.',
              steps: [
                'Load a new x value into R0.',
                'Load a new y value into R1.',
                'Keep R2 as the color value.',
                'Run and compare the canvas result.',
              ],
            },
            checks: [
              'Changing R0 should change the x coordinate.',
              'Changing R1 should change the y coordinate.',
              'Changing R2 should change the color value.',
            ],
            vocabulary: ['register operand', 'memory-mapped output', 'state reuse'],
          }),
          createLesson({
            id: 'debug-runtime-errors',
            title: 'Runtime Errors as Signals',
            status: 'Live in VM',
            time: '18 min',
            level: 'Debug',
            sourceIds: ['retro-core-vm', 'rars', 'venus'],
            exampleId: 'bad-opcode-demo',
            summary:
              'Study unknown opcodes, invalid registers, and bad jumps so errors become useful feedback.',
            goals: [
              'Read a VM error message as state feedback.',
              'Distinguish assembly errors from runtime errors.',
              'Use raw bytes to understand why validation matters.',
            ],
            sections: [
              {
                title: 'Errors still teach state',
                body:
                  'A runtime error means the VM reached a byte pattern or operand that it cannot execute safely. The halted state, PC, and error label tell you where execution stopped.',
              },
              {
                title: 'Assembler errors happen earlier',
                body:
                  'In assembly mode, the assembler rejects unknown instructions before the VM runs. In raw-byte mode, invalid bytes can reach the VM and become runtime errors.',
              },
              {
                title: 'Safety checks are part of the machine',
                body:
                  'The VM guards register indexes, jump targets, and instruction bounds. Those checks keep debugging predictable.',
              },
            ],
            practice: {
              title: 'Compare three failures',
              prompt:
                'Run the unknown opcode, bad register, and program bounds examples. Compare the final PC and error label.',
              steps: [
                'Open the unknown opcode demo.',
                'Run the bad register demo from the example menu.',
                'Run the bounds demo from the example menu.',
                'Write one sentence explaining each failure.',
              ],
            },
            checks: [
              'Unknown opcode should report an opcode error.',
              'Bad register should report a register error.',
              'Jumping past the program should report a PC bounds error.',
            ],
            vocabulary: ['opcode', 'runtime error', 'bounds check', 'raw bytes'],
          }),
        ],
      },
    ],
  },
  {
    id: 'mips-riscv-bridge',
    label: 'MIPS and RISC-V Bridge',
    stage: 'Reference track',
    accent: '#2563eb',
    pace: '2 courses · 7 lessons',
    summary:
      'Connect the small Retro Core VM to real educational assembly languages without pretending the current VM can execute them yet.',
    outcomes: [
      'Compare Retro Core patterns with MIPS and RISC-V syntax.',
      'Recognize registers, immediates, load/store memory, branches, and procedures.',
      'Use MARS, SPIM, RARS, and Venus as source-backed references for future features.',
    ],
    courses: [
      {
        id: 'real-isa-basics',
        title: 'Course 1 · Real ISA Basics',
        level: 'Bridge',
        duration: 'Lessons 09-10',
        outcome: 'Understand why real assembly languages add more structure around the same core ideas.',
        modules: [
          createLesson({
            id: 'mips-load-store-map',
            title: 'From Retro Core to MIPS',
            status: 'Reference lesson',
            time: '20 min',
            level: 'Bridge',
            sourceIds: ['mars', 'spim', 'cs61c-riscv-notes'],
            summary:
              'Map Retro Core ideas to MIPS: registers, load/store memory, arithmetic, jumps, and simulator workflow.',
            goals: [
              'Recognize MIPS as a register-based load/store architecture.',
              'Compare Retro Core register names with MIPS register conventions.',
              'Use MARS/SPIM as references before we add deeper MIPS support.',
            ],
            sections: [
              {
                title: 'Same idea, more conventions',
                body:
                  'Retro Core uses simple names like R0. MIPS has more registers and conventional names such as temporary, argument, return, stack, and return-address registers.',
              },
              {
                title: 'Memory uses explicit instructions',
                body:
                  'MIPS separates arithmetic from memory access. Values are usually loaded into registers, computed, then stored back to memory.',
              },
              {
                title: 'How we use this in retroWeb Academy',
                body:
                  'The MIPS track should begin as a comparison layer. We can show equivalent ideas now, then add MIPS execution or simulator integration later.',
              },
            ],
            practice: {
              title: 'Make a concept map',
              prompt:
                'Pair each Retro Core concept with the closest MIPS concept: register, memory address, arithmetic, branch, and halt/exit.',
              steps: [
                'Start with a Retro Core program you understand.',
                'Name the register, memory, and branch roles.',
                'Write the closest MIPS vocabulary next to each role.',
              ],
            },
            checks: [
              'The map should distinguish register names from register roles.',
              'Memory access should be described as explicit movement.',
              'Simulator-only services should be marked separately from core ISA ideas.',
            ],
            vocabulary: ['MIPS', 'load/store', 'register convention', 'simulator service'],
          }),
          createLesson({
            id: 'riscv-registers-immediates',
            title: 'From Retro Core to RISC-V',
            status: 'Reference lesson',
            time: '20 min',
            level: 'Bridge',
            sourceIds: ['riscv-asm-manual', 'riscv-isa-manual', 'cs61c-riscv-notes'],
            summary:
              'Introduce RISC-V as the main future real-world track for open assembly learning.',
            goals: [
              'Recognize RISC-V register naming.',
              'Understand immediate operands and register operands.',
              'Explain why RISC-V is a strong long-term target for the academy.',
            ],
            sections: [
              {
                title: 'RISC-V is open and teachable',
                body:
                  'RISC-V keeps the core ISA small enough for teaching while still being a real architecture with serious tooling and documentation.',
              },
              {
                title: 'Registers have numbers and roles',
                body:
                  'RISC-V registers can be referred to by number and by ABI role names. The zero register is a special example: it always reads as zero.',
              },
              {
                title: 'Immediate values are embedded constants',
                body:
                  'Retro Core LOAD uses an immediate byte. RISC-V has immediate forms too, but the exact encoding and size rules are more detailed.',
              },
            ],
            practice: {
              title: 'Compare operand styles',
              prompt:
                'Write down one Retro Core instruction and the RISC-V idea it resembles. Focus on operands, not exact syntax.',
              steps: [
                'Choose LOAD, ADD, SUB, STORE, JZ, or JMP.',
                'Identify destination, source, and immediate operands.',
                'Explain what becomes more detailed in RISC-V.',
              ],
            },
            checks: [
              'The explanation should not claim Retro Core is RISC-V.',
              'The comparison should focus on shared ideas.',
              'The source links should be used for exact RISC-V syntax later.',
            ],
            vocabulary: ['RISC-V', 'ABI name', 'immediate', 'zero register'],
          }),
        ],
      },
      {
        id: 'real-memory-functions',
        title: 'Course 2 · Memory, Branching, and Functions',
        level: 'Bridge',
        duration: 'Lessons 11-15',
        outcome: 'Prepare the app for real load/store patterns, simulator workflows, stack operations, and future CALL/RET work.',
        modules: [
          createLesson({
            id: 'real-memory-branches',
            title: 'Real Memory and Branch Patterns',
            status: 'Reference lesson',
            time: '24 min',
            level: 'Bridge',
            sourceIds: ['riscv-asm-manual', 'cs61c-riscv-notes', 'venus', 'rars'],
            summary:
              'Connect Retro Core STORE, JZ, and JMP to real memory addressing and branch patterns.',
            goals: [
              'Separate arithmetic from memory movement.',
              'Recognize base-plus-offset addressing as a future concept.',
              'Use stepping to debug branch behavior.',
            ],
            sections: [
              {
                title: 'Real memory has address patterns',
                body:
                  'Retro Core writes to a simple byte address. RISC-V and MIPS usually use a base register plus an offset, which supports arrays, structures, stack frames, and pointers.',
              },
              {
                title: 'Branches are PC updates',
                body:
                  'A branch changes which instruction runs next. Retro Core has JZ and JMP. Real ISAs have more branch forms, but the PC update idea is the same.',
              },
              {
                title: 'What the UI should eventually show',
                body:
                  'A strong lesson view should highlight the effective address, the branch target, and the before/after state of memory and PC.',
              },
            ],
            practice: {
              title: 'Trace a loop in plain English',
              prompt:
                'Use the Retro Core countdown demo and explain which instruction changes the counter, which checks the exit, and which jumps back.',
              steps: [
                'Open the countdown demo.',
                'Step until the PC jumps backward.',
                'Write a one-line explanation for SUB, JZ, and JMP.',
              ],
            },
            checks: [
              'The explanation should identify the loop body.',
              'The exit condition should mention zero.',
              'The backward PC movement should be described clearly.',
            ],
            vocabulary: ['base register', 'offset', 'branch target', 'fall-through'],
          }),
          createLesson({
            id: 'stack-memory-contract',
            title: 'Stack Memory Contract',
            status: 'Planned feature lesson',
            time: '24 min',
            level: 'Intermediate',
            sourceIds: ['cs61c-riscv-notes', 'riscv-asm-manual', 'mars', 'spim'],
            summary:
              'Define where the stack lives, which value tracks the top, and which runtime checks protect learners.',
            goals: [
              'Explain why stack memory needs a clear reserved region.',
              'Define stack pointer behavior before adding stack instructions.',
              'List overflow, underflow, and bounds checks the VM should enforce.',
            ],
            sections: [
              {
                title: 'A stack is a contract',
                body:
                  'A stack is not just any memory use. It is an agreement that one pointer marks the top and every push or pop updates that pointer in a predictable direction.',
              },
              {
                title: 'Pick the stack region',
                body:
                  'Before adding PUSH and POP, Retro Core needs a reserved memory region that does not collide with program bytes, beginner STORE examples, or framebuffer output.',
              },
              {
                title: 'Make errors teachable',
                body:
                  'Stack overflow and underflow should become clear VM errors. Learners should see whether the pointer moved, which address was touched, and why the operation stopped.',
              },
            ],
            conceptExample: {
              title: 'stack-contract.txt',
              caption: 'Design sketch for the VM state that stack lessons expect later.',
              code: `Proposed Retro Core stack state:
SP starts at STACK_TOP
PUSH writes first, then moves SP
POP moves SP back, then reads

Required checks:
SP must stay inside stack memory
PUSH must not overwrite protected memory
POP must not read from an empty stack`,
            },
            implementationPlan: [
              'Choose stack memory start and end addresses.',
              'Expose stack pointer state in the VM runtime panel.',
              'Add stack overflow and underflow error codes.',
              'Add tests for stack bounds before adding CALL and RET.',
            ],
            practice: {
              title: 'Design the stack region',
              prompt:
                'Write a small design note for where the stack should live and how the pointer should move.',
              steps: [
                'Pick a stack start and end address that avoids the program and framebuffer.',
                'Decide whether the pointer grows upward or downward.',
                'Define what should happen on overflow and underflow.',
                'Describe what the UI should highlight after a stack operation.',
              ],
            },
            checks: [
              'The design should include a reserved memory range.',
              'The pointer movement rule should be unambiguous.',
              'The design should include at least two stack-specific error cases.',
            ],
            vocabulary: ['stack region', 'stack pointer', 'overflow', 'underflow'],
          }),
          createLesson({
            id: 'push-pop-stack-ops',
            title: 'PUSH and POP',
            status: 'Planned feature lesson',
            time: '28 min',
            level: 'Intermediate',
            sourceIds: ['cs61c-riscv-notes', 'riscv-asm-manual', 'mars', 'spim'],
            summary:
              'Teach PUSH and POP as paired stack operations for saving and restoring register values.',
            goals: [
              'Explain last-in, first-out behavior with register values.',
              'Trace how PUSH changes memory and the stack pointer.',
              'Trace how POP restores the most recently pushed value.',
            ],
            sections: [
              {
                title: 'Last in, first out',
                body:
                  'If R1 is pushed and then R2 is pushed, the first POP should return the value from R2. This last-in, first-out behavior is why stacks are useful for nested work.',
              },
              {
                title: 'PUSH saves state',
                body:
                  'PUSH should copy a register value into stack memory and update the stack pointer. The source register should keep its value.',
              },
              {
                title: 'POP restores state',
                body:
                  'POP should read the most recent stack value into a destination register and move the stack pointer back. It should fail clearly if the stack is empty.',
              },
            ],
            conceptExample: {
              title: 'planned-push-pop.asm',
              caption: 'Concept code only. This becomes runnable after VM and assembler support are added.',
              code: `LOAD R1 42
PUSH R1
LOAD R1 7
POP R2
PRINT R2
HALT

Expected idea:
R2 receives 42 because POP restores
the last value pushed onto the stack.`,
            },
            implementationPlan: [
              'Add PUSH and POP opcodes to VM and assembler tables.',
              'Define operand count and byte layout for PUSH Rx and POP Rx.',
              'Update syntax highlighting and docs after execution support exists.',
              'Add tests for LIFO behavior, overflow, underflow, and invalid register operands.',
            ],
            practice: {
              title: 'Trace stack order',
              prompt:
                'Use the concept program and write the stack contents after every PUSH or POP.',
              steps: [
                'Record R1 after the first LOAD.',
                'Record the stack after PUSH R1.',
                'Record R1 after the second LOAD.',
                'Explain why POP R2 should restore 42, not 7.',
              ],
            },
            checks: [
              'PUSH should not erase the source register.',
              'POP should return the most recently pushed value.',
              'The empty-stack case should be described as a VM error.',
            ],
            vocabulary: ['PUSH', 'POP', 'LIFO', 'saved value'],
          }),
          createLesson({
            id: 'call-ret-control-flow',
            title: 'CALL and RET',
            status: 'Planned feature lesson',
            time: '30 min',
            level: 'Intermediate',
            sourceIds: ['cs61c-riscv-notes', 'riscv-asm-manual', 'mars', 'spim'],
            summary:
              'Teach CALL and RET as structured control flow that saves and restores a return address.',
            goals: [
              'Explain why CALL is more than an unconditional jump.',
              'Trace the return address saved by a function call.',
              'Explain how RET restores the program counter.',
            ],
            sections: [
              {
                title: 'CALL remembers the next instruction',
                body:
                  'JMP only changes the program counter. CALL should jump to a function and save the address of the instruction that should run after the function returns.',
              },
              {
                title: 'RET resumes the caller',
                body:
                  'RET should load the saved return address back into the program counter. That makes execution continue after the original CALL.',
              },
              {
                title: 'Nested calls need the stack',
                body:
                  'A single return slot works for one call, but nested calls need many saved return addresses. That is why CALL and RET should use the stack contract.',
              },
            ],
            conceptExample: {
              title: 'planned-call-ret.asm',
              caption: 'Concept code only. This becomes runnable after CALL and RET exist in the VM.',
              code: `LOAD R0 6
CALL double
PRINT R0
HALT

double:
ADD R0 R0 R0
RET

Expected idea:
CALL saves the address of PRINT R0.
RET returns there after R0 becomes 12.`,
            },
            implementationPlan: [
              'Add CALL label/address assembly support and opcode byte layout.',
              'Make CALL push the return address using the stack contract.',
              'Make RET pop a return address and update PC.',
              'Add tests for nested calls, bad return addresses, and stack underflow on RET.',
            ],
            practice: {
              title: 'Trace return flow',
              prompt:
                'Mark the return address in the concept program and explain where RET should continue.',
              steps: [
                'Find the instruction immediately after CALL double.',
                'Mark that address as the saved return address.',
                'Trace the function body until RET.',
                'Explain why PRINT R0 should run after RET.',
              ],
            },
            checks: [
              'CALL should save the address after the call site.',
              'RET should restore the PC from the saved return address.',
              'Nested calls should require stack-backed return storage.',
            ],
            vocabulary: ['CALL', 'RET', 'return address', 'nested call'],
          }),
          createLesson({
            id: 'calling-convention-stack-frames',
            title: 'Calling Convention and Stack Frames',
            status: 'Planned feature lesson',
            time: '30 min',
            level: 'Intermediate',
            sourceIds: ['cs61c-riscv-notes', 'riscv-asm-manual', 'mars', 'spim'],
            summary:
              'Prepare a small Retro Core calling convention so future function lessons have stable rules.',
            goals: [
              'Define where arguments and return values should live.',
              'Separate caller-saved and callee-saved responsibilities.',
              'Describe what a beginner stack frame should show in the UI.',
            ],
            sections: [
              {
                title: 'Functions need shared rules',
                body:
                  'A calling convention lets separate pieces of code work together. It says which registers carry inputs, where the return value goes, and who must preserve which state.',
              },
              {
                title: 'Keep Retro Core small',
                body:
                  'The first Retro Core convention should be tiny. For example, R0 and R1 can carry arguments, R0 can carry the return value, and higher registers can be reserved for saved state or stack behavior.',
              },
              {
                title: 'Stack frames make calls visible',
                body:
                  'A stack frame groups the saved return address, saved registers, and temporary values for one function call. The UI should show that frame as a readable block of memory.',
              },
            ],
            conceptExample: {
              title: 'planned-convention.txt',
              caption: 'Design sketch for the function lessons after stack and call support land.',
              code: `Small Retro Core convention:
R0 = first argument
R1 = second argument
R0 = return value
CALL saves return address on the stack
RET restores PC from the stack

Frame view should show:
return address
saved registers
local temporary slots`,
            },
            implementationPlan: [
              'Choose argument and return-value register rules.',
              'Add stack-frame visualization after CALL/RET support.',
              'Document caller-saved and callee-saved examples.',
              'Add lesson checks that validate return values and restored state.',
            ],
            practice: {
              title: 'Write the convention card',
              prompt:
                'Create the rule card learners will see before writing their first function.',
              steps: [
                'Choose the argument registers.',
                'Choose the return-value register.',
                'Name which values the caller must save.',
                'Name which values the function must restore.',
              ],
            },
            checks: [
              'The convention should fit the current R0-R7 register set.',
              'The return-value rule should be simple enough for the first function lesson.',
              'The frame visual should include return address and saved values.',
            ],
            vocabulary: ['calling convention', 'stack frame', 'caller-saved', 'callee-saved'],
          }),
        ],
      },
    ],
  },
  {
    id: 'cpu-internals',
    label: 'CPU Internals',
    stage: 'Architecture track',
    accent: '#7c3aed',
    pace: '2 courses · 3 lessons',
    summary:
      'Turn assembly execution into hardware thinking: instruction fields, decode, datapath movement, state updates, and pipelining.',
    outcomes: [
      'Explain how instruction bytes or fields describe an operation.',
      'Trace data through a simple execute path.',
      'Reason about pipeline stages and hazards at a beginner level.',
    ],
    courses: [
      {
        id: 'encoding-decode',
        title: 'Course 1 · Encoding and Decode',
        level: 'Architecture',
        duration: 'Lessons 13-14',
        outcome: 'Connect readable assembly to instruction bytes and hardware decisions.',
        modules: [
          createLesson({
            id: 'instruction-encoding-decode',
            title: 'Instruction Encoding and Decode',
            status: 'Architecture lesson',
            time: '25 min',
            level: 'Architecture',
            sourceIds: ['retro-core-vm', 'riscv-isa-manual', 'cs61c-riscv-notes'],
            summary:
              'Explain how assembly becomes bytes, then how the machine decides what those bytes mean.',
            goals: [
              'Distinguish assembly text from machine representation.',
              'Read Retro Core byte layouts for simple instructions.',
              'Describe decode as identifying what an opcode means.',
            ],
            sections: [
              {
                title: 'Assembly is not what hardware reads',
                body:
                  'The editor shows human-readable code. The VM executes numeric opcodes and operands. The assembler bridges those two forms.',
              },
              {
                title: 'Retro Core has small instruction layouts',
                body:
                  'LOAD uses an opcode, a register number, and an immediate value. ADD and SUB use an opcode plus three register numbers.',
              },
              {
                title: 'Decode chooses behavior',
                body:
                  'When the VM reads an opcode, it chooses the behavior for that instruction. Hardware decode does the same kind of selection with circuits.',
              },
            ],
            practice: {
              title: 'Annotate bytecode',
              prompt:
                'Assemble LOAD R1 5 and ADD R2 R1 R1, then label each byte as opcode or operand.',
              steps: [
                'Write the two instructions in the workspace.',
                'Run or prepare the program.',
                'Use the byte output or source map view.',
                'Label each byte in order.',
              ],
            },
            checks: [
              'Opcode bytes should be identified separately from operands.',
              'Register numbers should match R0-R7 indexes.',
              'Immediate values should be byte-sized.',
            ],
            vocabulary: ['opcode', 'operand byte', 'encoding', 'decode'],
          }),
          createLesson({
            id: 'datapath-execute-state',
            title: 'Datapath and Execute State',
            status: 'Architecture lesson',
            time: '24 min',
            level: 'Architecture',
            sourceIds: ['cs61c-riscv-notes', 'riscv-isa-manual'],
            summary:
              'Group instruction effects by the state they update: registers, memory, PC, output, and halted state.',
            goals: [
              'Explain a datapath as value movement through components.',
              'Classify instruction side effects.',
              'Prepare for pipeline-stage language.',
            ],
            sections: [
              {
                title: 'The datapath moves values',
                body:
                  'A datapath is the route values take through the processor. For arithmetic, register values flow into an operation and the result flows back into a destination register.',
              },
              {
                title: 'Execution produces side effects',
                body:
                  'The visible result of an instruction is its side effect on machine state. That is what the learner should inspect after every step.',
              },
              {
                title: 'Different instructions update different state',
                body:
                  'LOAD and arithmetic update registers. STORE and PIX update memory. PRINT updates output. JZ and JMP update the PC. HALT updates the runtime state.',
              },
            ],
            practice: {
              title: 'Sort instructions by state',
              prompt:
                'Make groups for register-writing, memory-writing, PC-changing, output, and halt instructions.',
              steps: [
                'Start with the Retro Core instruction list.',
                'Put each instruction in at least one group.',
                'Add a sentence explaining the side effect.',
              ],
            },
            checks: [
              'JZ should appear in the PC-changing group.',
              'PIX and PIXR should appear in the memory-writing group.',
              'PRINT should be described as output, not register mutation.',
            ],
            vocabulary: ['datapath', 'ALU', 'side effect', 'state update'],
          }),
        ],
      },
      {
        id: 'pipeline',
        title: 'Course 2 · Pipelining',
        level: 'Advanced intro',
        duration: 'Lesson 15',
        outcome: 'Introduce overlap, stalls, and hazards without burying the learner in detail.',
        modules: [
          createLesson({
            id: 'pipeline-stages-hazards',
            title: 'Pipeline Stages and Hazards',
            status: 'Architecture lesson',
            time: '28 min',
            level: 'Advanced intro',
            sourceIds: ['cs61c-riscv-notes', 'riscv-isa-manual'],
            summary:
              'Explain pipelining as overlapping instruction stages, then introduce why dependencies can force stalls.',
            goals: [
              'Define instruction overlap in plain language.',
              'Recognize data and control hazards at a high level.',
              'Connect pipeline visuals to earlier step-by-step execution.',
            ],
            sections: [
              {
                title: 'Pipelining overlaps work',
                body:
                  'A non-pipelined view finishes one instruction before starting the next. A pipeline lets different instructions occupy different stages at the same time.',
              },
              {
                title: 'Hazards are timing problems',
                body:
                  'A hazard happens when the next instruction needs a value or PC decision that is not ready yet. The machine must stall, forward, or choose another strategy.',
              },
              {
                title: 'How retroWeb can teach it',
                body:
                  'The current VM is sequential. A future pipeline lesson can show the same program as a timeline, with each instruction moving across stages.',
              },
            ],
            practice: {
              title: 'Spot a dependency',
              prompt:
                'Use LOAD R1 5 followed by ADD R2 R1 R1. Explain why ADD depends on the result of LOAD.',
              steps: [
                'Write both instructions.',
                'Identify which instruction creates R1.',
                'Identify which instruction reads R1.',
                'Mark the dependency in a two-row timeline.',
              ],
            },
            checks: [
              'The dependency should point from producer to consumer.',
              'A control hazard should be described separately from a data dependency.',
              'The lesson should present pipelining as a future visual model, not current VM behavior.',
            ],
            vocabulary: ['pipeline', 'stage', 'data hazard', 'control hazard', 'stall'],
          }),
        ],
      },
    ],
  },
  {
    id: 'systems-reference',
    label: 'Real-World Assembly',
    stage: 'Later track',
    accent: '#059669',
    pace: '2 courses · 3 lessons',
    summary:
      'Keep a long-term path toward x86-64, Arm, tools, and reverse-engineering habits after the beginner VM and open ISA tracks are stable.',
    outcomes: [
      'Read x86-64 and Arm material as references without overloading beginners.',
      'Understand why stack, calls, and ABI rules matter in real programs.',
      'Plan future advanced lessons around official documentation and proven courses.',
    ],
    courses: [
      {
        id: 'x86-arm-reading',
        title: 'Course 1 · x86-64 and Arm Reading',
        level: 'Advanced reference',
        duration: 'Lessons 16-17',
        outcome: 'Prepare learners to read common real-world assembly patterns after simpler ISA work.',
        modules: [
          createLesson({
            id: 'x86-common-instructions',
            title: 'Reading Common x86-64 Patterns',
            status: 'Later lesson',
            time: '30 min',
            level: 'Advanced reference',
            sourceIds: ['ost2-arch1001', 'intel-sdm', 'nasm'],
            summary:
              'Use x86-64 as an advanced reading track focused on common instructions, registers, stack, and calls.',
            goals: [
              'Recognize why x86-64 is more complex than Retro Core or RISC-V.',
              'Use official manuals for exact behavior.',
              'Use course material for beginner-friendly sequencing.',
            ],
            sections: [
              {
                title: 'x86-64 is useful but dense',
                body:
                  'x86-64 appears everywhere in desktop and server software, but it carries decades of compatibility. It is better as an advanced reading track than the first beginner ISA.',
              },
              {
                title: 'Teach common patterns first',
                body:
                  'A learner does not need every instruction. The first lessons should focus on registers, move, arithmetic, stack, calls, branches, and memory operands.',
              },
              {
                title: 'Use the manual as truth',
                body:
                  'The Intel manuals are precise. The lesson should translate a tiny part into learner language and link to the manual for exact details.',
              },
            ],
            practice: {
              title: 'Build a reading checklist',
              prompt:
                'Write a checklist for reading a short x86-64 function: registers, stack changes, calls, branches, and return value.',
              steps: [
                'List the registers that appear.',
                'Mark stack pointer changes.',
                'Find call and return instructions.',
                'Identify the return value convention.',
              ],
            },
            checks: [
              'The checklist should not require memorizing the full Intel manual.',
              'Stack changes should be separated from arithmetic.',
              'The lesson should stay marked advanced.',
            ],
            vocabulary: ['x86-64', 'ABI', 'stack pointer', 'return value'],
          }),
          createLesson({
            id: 'arm-aarch64-overview',
            title: 'Arm and AArch64 Overview',
            status: 'Later lesson',
            time: '24 min',
            level: 'Advanced reference',
            sourceIds: ['arm-learn'],
            summary:
              'Introduce Arm as a later architecture track with official learning guides and real platform relevance.',
            goals: [
              'Recognize Arm as a major modern architecture family.',
              'Use official Arm guides for source-backed lessons.',
              'Delay deep syntax until core assembly habits are stable.',
            ],
            sections: [
              {
                title: 'Arm is a strong later track',
                body:
                  'Arm matters for mobile, embedded, cloud, and Apple silicon contexts. It should come after learners understand registers, memory, branches, and calls.',
              },
              {
                title: 'AArch64 has a clean teaching path',
                body:
                  'Modern Arm material can be taught through registers, load/store memory, condition handling, function calls, and system-level concepts.',
              },
              {
                title: 'Use official guides carefully',
                body:
                  'Arm Learn the Architecture can guide lesson sequencing, while retroWeb Academy should write original explanations and activities.',
              },
            ],
            practice: {
              title: 'Plan the first Arm lesson',
              prompt:
                'Choose which Retro Core idea should be introduced first in an Arm track and explain why.',
              steps: [
                'Choose registers, memory, branches, or calls.',
                'Find the matching official guide area.',
                'Write a beginner-friendly lesson objective.',
              ],
            },
            checks: [
              'The objective should be narrower than a full architecture overview.',
              'The source link should be used for exact Arm terminology.',
              'The lesson should not require current Retro Core to run Arm code.',
            ],
            vocabulary: ['Arm', 'AArch64', 'architecture family', 'official guide'],
          }),
        ],
      },
      {
        id: 'tooling-path',
        title: 'Course 2 · Tooling Path',
        level: 'Advanced reference',
        duration: 'Lesson 18',
        outcome: 'Plan how learners move from retroWeb Academy into external tools.',
        modules: [
          createLesson({
            id: 'external-tooling-map',
            title: 'From Browser Lessons to Real Tools',
            status: 'Later lesson',
            time: '22 min',
            level: 'Advanced reference',
            sourceIds: ['rars', 'venus', 'mars', 'spim', 'nasm'],
            summary:
              'Define how the academy should link learners from Retro Core practice into real assemblers and simulators.',
            goals: [
              'Pick the right external tool for each architecture track.',
              'Explain what learners gain by leaving the browser sandbox.',
              'Keep source attribution visible in lessons.',
            ],
            sections: [
              {
                title: 'The browser sandbox lowers friction',
                body:
                  'retroWeb Academy should be where learners get comfortable. External tools become useful when they need richer ISAs, real assemblers, or platform-specific behavior.',
              },
              {
                title: 'Choose tools by track',
                body:
                  'RARS and Venus fit RISC-V. MARS and SPIM fit MIPS. NASM fits x86 assembly. Each tool should appear only where it helps the lesson.',
              },
              {
                title: 'Link out with context',
                body:
                  'A source link should tell the learner why it matters. The app should not drop them into a dense manual without a clear purpose.',
              },
            ],
            practice: {
              title: 'Create a source card',
              prompt:
                'Write a short source card for one external tool: what it is, when to use it, and what lesson it supports.',
              steps: [
                'Choose one source.',
                'Write a one-sentence purpose.',
                'Write one caution or limitation.',
                'Connect it to one retroWeb lesson.',
              ],
            },
            checks: [
              'The card should include a link.',
              'The card should explain when the source is useful.',
              'The card should avoid copying source text.',
            ],
            vocabulary: ['assembler', 'simulator', 'source card', 'tooling path'],
          }),
        ],
      },
    ],
  },
];

export const syllabusSequence = [
  {
    id: 'sequence-state',
    order: '01',
    unit: 'Machine State and First Programs',
    scope: 'Retro Core',
    source: 'retroWeb VM + CS61C concepts',
    sourceIds: ['retro-core-vm', 'cs61c-riscv-notes'],
    trackId: 'retro-core',
    courseId: 'machine-state',
    lessonId: 'state-first-program',
    summary:
      'Start by seeing the machine state that each instruction changes.',
    checkpoints: [
      'Identify PC, registers, memory, output, and halted state.',
      'Run and step a small Retro Core program.',
      'Explain the final state in plain language.',
    ],
  },
  {
    id: 'sequence-memory-control',
    order: '02',
    unit: 'Memory, Branches, and Loops',
    scope: 'Retro Core',
    source: 'retroWeb VM + Venus workflow ideas',
    sourceIds: ['retro-core-vm', 'venus'],
    trackId: 'retro-core',
    courseId: 'memory-control',
    lessonId: 'memory-addresses',
    summary:
      'Write memory, follow labels, branch on zero, and build a small loop.',
    checkpoints: [
      'Use STORE to change a memory cell.',
      'Use labels with JZ and JMP.',
      'Trace one loop until it halts.',
    ],
  },
  {
    id: 'sequence-output-debug',
    order: '03',
    unit: 'Visual Output and Debugging',
    scope: 'Retro Core',
    source: 'retroWeb VM + simulator practice',
    sourceIds: ['retro-core-vm', 'rars', 'venus'],
    trackId: 'retro-core',
    courseId: 'output-debugging',
    lessonId: 'framebuffer-immediates',
    summary:
      'Use pixels and runtime errors to make invisible machine behavior visible.',
    checkpoints: [
      'Draw a pixel with immediate operands.',
      'Draw a pixel from register operands.',
      'Read VM runtime errors as debugging feedback.',
    ],
  },
  {
    id: 'sequence-real-isa',
    order: '04',
    unit: 'MIPS and RISC-V Bridge',
    scope: 'Real ISA',
    source: 'RISC-V, MARS, SPIM, RARS, Venus',
    sourceIds: ['riscv-asm-manual', 'mars', 'spim', 'rars', 'venus'],
    trackId: 'mips-riscv-bridge',
    courseId: 'real-isa-basics',
    lessonId: 'mips-load-store-map',
    summary:
      'Connect Retro Core lessons to real assembly language references and simulator workflows.',
    checkpoints: [
      'Compare Retro Core with MIPS and RISC-V terminology.',
      'Keep conceptual lessons separate from runnable VM demos.',
      'Use source links for exact syntax and simulator behavior.',
    ],
  },
  {
    id: 'sequence-cpu-internals',
    order: '05',
    unit: 'Encoding, Decode, and Datapath',
    scope: 'CPU internals',
    source: 'RISC-V specs + CS61C notes',
    sourceIds: ['riscv-isa-manual', 'cs61c-riscv-notes'],
    trackId: 'cpu-internals',
    courseId: 'encoding-decode',
    lessonId: 'instruction-encoding-decode',
    summary:
      'Move from assembly text into instruction fields, decode choices, and state updates.',
    checkpoints: [
      'Distinguish assembly text from byte representation.',
      'Describe decode and control in plain language.',
      'Classify instruction side effects by state changed.',
    ],
  },
  {
    id: 'sequence-advanced',
    order: '06',
    unit: 'Advanced Architecture Paths',
    scope: 'Future tracks',
    source: 'x86-64, Arm, and tooling references',
    sourceIds: ['ost2-arch1001', 'intel-sdm', 'arm-learn', 'nasm'],
    trackId: 'systems-reference',
    courseId: 'x86-arm-reading',
    lessonId: 'x86-common-instructions',
    summary:
      'Plan the route from beginner assembly practice into x86-64, Arm, and external tools.',
    checkpoints: [
      'Explain why x86-64 and Arm belong later.',
      'Use official docs as references, not beginner textbooks.',
      'Map each advanced topic to a learner-ready prerequisite.',
    ],
  },
];
