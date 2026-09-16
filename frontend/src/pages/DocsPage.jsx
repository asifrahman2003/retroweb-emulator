import { useEffect, useRef, useState } from 'react';
import MacWindow from '../components/MacWindow';
import { docsReferenceSections } from '../platformContent';

const githubFileUrl = 'https://github.com/asifrahman2003/retroweb-emulator/blob/main/frontend/src/pages/DocsPage.jsx';
const githubEditUrl = 'https://github.com/asifrahman2003/retroweb-emulator/edit/main/frontend/src/pages/DocsPage.jsx';
const githubIssueUrl = 'https://github.com/asifrahman2003/retroweb-emulator/issues/new';

const defaultInstructionRows = [
  ['LOAD Rx, imm', 'Load an immediate byte into a register.'],
  ['STORE Rx, addr', 'Write a register value into memory.'],
  ['ADD / SUB', 'Compute with register operands and wrap to 8 bits.'],
  ['PRINT Rx', 'Append a register value to the console output.'],
  ['JMP addr', 'Move the program counter to another instruction.'],
  ['JZ Rx, addr', 'Jump when the selected register is zero.'],
  ['PIX / PIXR', 'Write pixels into the framebuffer.'],
  ['HALT', 'Stop execution cleanly.'],
];

const docGroups = [
  {
    title: 'Getting started',
    items: [
      {
        id: 'introduction',
        title: 'Introduction',
        category: 'Getting started',
        chips: ['beginner', 'overview'],
        lead:
          'retroWeb Academy teaches assembly by keeping machine state visible while you run short programs.',
        facts: [
          ['Goal', 'Learn assembly by stepping through code'],
          ['VM', 'Retro Core'],
          ['Mode', 'Assembly or raw bytes'],
          ['State', 'Registers, memory, PC, output'],
        ],
        note:
          'The VM is intentionally small. It gives you a clean place to learn state changes before moving into MIPS, RISC-V, or other real-world architectures.',
        sections: [
          {
            title: 'What this app teaches',
            body:
              'The first goal is not memorizing instruction names. The first goal is learning to predict state: which register changes, which memory cell changes, where the program counter goes, and when execution stops.',
          },
          {
            title: 'What runs today',
            body:
              'Retro Core currently supports LOAD, ADD, SUB, STORE, PRINT, JZ, JMP, PIX, PIXR, and HALT. Planned lessons for stack and functions are marked separately until the VM supports those instructions.',
          },
          {
            title: 'How to study',
            body:
              'Start with a small program, run one step, inspect the state, and explain what changed. That habit scales from the Retro Core VM into larger instruction sets.',
          },
        ],
        exampleTitle: 'first-program.asm',
        exampleCode: `LOAD R1 5
ADD R2 R1 R1
PRINT R2
HALT`,
      },
      {
        id: 'first-program',
        title: 'Your first program',
        category: 'Getting started',
        chips: ['beginner', 'runnable'],
        lead:
          'A first Retro Core program should load a value, transform it, print the result, and stop cleanly.',
        facts: [
          ['Starts with', 'LOAD'],
          ['Computes with', 'ADD or SUB'],
          ['Shows output with', 'PRINT'],
          ['Ends with', 'HALT'],
        ],
        note:
          'Always end beginner examples with HALT. It gives the learner a clean final state to inspect.',
        sections: [
          {
            title: 'Program shape',
            body:
              'A clear first program has four phases: put a value in a register, run one operation, show the result, and stop.',
          },
          {
            title: 'Register flow',
            body:
              'In the demo below, R1 receives 5. ADD then reads R1 twice and writes the result into R2.',
          },
          {
            title: 'Final state',
            body:
              'After HALT, R1 should still be 5, R2 should be 10, and the console should include the printed value.',
          },
        ],
        exampleTitle: 'double-number.asm',
        exampleCode: `LOAD R1 5
ADD R2 R1 R1
PRINT R2
HALT`,
      },
      {
        id: 'run-step',
        title: 'Run and step',
        category: 'Getting started',
        chips: ['debugging', 'workflow'],
        lead:
          'Use Step when you are learning an instruction. Use Run when you already know what the full program should do.',
        facts: [
          ['Step', 'Executes one instruction'],
          ['Run', 'Executes until HALT or error'],
          ['Reset', 'Reloads the current program'],
          ['Inspect', 'Check state after each action'],
        ],
        note:
          'Step is the safer default for loops and branches because it lets you see the program counter move.',
        sections: [
          {
            title: 'Step first',
            body:
              'Step executes a single instruction and refreshes the register, memory, console, canvas, and runtime panels.',
          },
          {
            title: 'Run after prediction',
            body:
              'Before pressing Run, write down what you expect the final register, memory, or output state to be.',
          },
          {
            title: 'Reset when state is stale',
            body:
              'If you changed code or want to repeat the program from the beginning, reset or reload the program before comparing results.',
          },
        ],
        exampleTitle: 'step-practice.asm',
        exampleCode: `LOAD R0 7
PRINT R0
HALT`,
      },
    ],
  },
  {
    title: 'Architecture',
    items: [
      {
        id: 'overview',
        title: 'Overview',
        category: 'Architecture',
        chips: ['state', 'vm'],
        lead:
          'Retro Core is a small register machine with byte-addressed memory, a program counter, and visible output state.',
        facts: [
          ['Registers', 'R0 through R7'],
          ['Memory', 'Byte-addressed'],
          ['Program counter', 'Current instruction address'],
          ['Output', 'Console and framebuffer'],
        ],
        note:
          'The architecture is smaller than MIPS or RISC-V on purpose. Small state makes beginner debugging easier.',
        sections: [
          {
            title: 'Machine state',
            body:
              'Machine state is the collection of values the VM remembers: registers, memory, program counter, halted flag, error code, console output, and framebuffer cells.',
          },
          {
            title: 'Instruction cycle',
            body:
              'Each step reads the opcode at the program counter, checks the operands, performs the instruction, and updates the program counter or halted state.',
          },
          {
            title: 'Learning transfer',
            body:
              'Once you can explain Retro Core state changes, MIPS and RISC-V become easier because their instructions also read and write structured machine state.',
          },
        ],
        exampleTitle: 'state-change.asm',
        exampleCode: `LOAD R0 42
STORE R0 32
PRINT R0
HALT`,
      },
      {
        id: 'memory-model',
        title: 'Memory model',
        category: 'Architecture',
        chips: ['memory', 'addresses'],
        lead:
          'Memory is a numbered set of byte-sized cells. Instructions can store values into those cells and later views can inspect them.',
        facts: [
          ['Address size', 'Byte operand today'],
          ['STORE', 'Register to memory'],
          ['Framebuffer', 'Memory-backed output'],
          ['Viewer', 'Shows changed cells'],
        ],
        note:
          'STORE addresses must fit in a byte in the current assembler, so lesson examples keep addresses from 0 to 255 unless they use graphics instructions.',
        sections: [
          {
            title: 'Address vs value',
            body:
              'The address is the location. The value is what gets placed there. STORE R0 32 writes the value inside R0 into memory location 32.',
          },
          {
            title: 'Program bytes and data share memory',
            body:
              'Retro Core loads the program into memory. Beginner STORE examples use safe addresses away from the first few instruction bytes.',
          },
          {
            title: 'Why memory matters',
            body:
              'Memory is how programs represent arrays, saved values, stack frames, and output buffers in later lessons.',
          },
        ],
        exampleTitle: 'store-memory.asm',
        exampleCode: `LOAD R0 42
STORE R0 32
PRINT R0
HALT`,
      },
      {
        id: 'registers',
        title: 'Registers',
        category: 'Architecture',
        chips: ['registers', 'arithmetic'],
        lead:
          'Registers are small named storage slots. Retro Core exposes R0 through R7.',
        facts: [
          ['Available', 'R0-R7'],
          ['LOAD', 'Immediate to register'],
          ['ADD/SUB', 'Register operands'],
          ['PRINT', 'Register to console'],
        ],
        note:
          'Invalid register indexes are runtime errors in raw-byte mode and assembler errors in assembly mode.',
        sections: [
          {
            title: 'Register names',
            body:
              'Assembly mode uses names R0 through R7. Raw byte mode uses the register index number directly.',
          },
          {
            title: 'Destination and sources',
            body:
              'ADD and SUB use destination-first order. ADD R2 R0 R1 means R2 receives R0 plus R1.',
          },
          {
            title: 'Byte-sized results',
            body:
              'Arithmetic results wrap to 8 bits in the current VM. That makes overflow visible in beginner examples.',
          },
        ],
        exampleTitle: 'registers.asm',
        exampleCode: `LOAD R0 12
LOAD R1 5
SUB R2 R0 R1
PRINT R2
HALT`,
      },
      {
        id: 'framebuffer',
        title: 'Framebuffer',
        category: 'Architecture',
        chips: ['graphics', 'memory'],
        lead:
          'The framebuffer is a memory-backed output area. PIX and PIXR write color values into it.',
        facts: [
          ['PIX', 'Immediate x, y, color'],
          ['PIXR', 'Register x, y, color'],
          ['Width', '32 cells'],
          ['Output', 'Canvas view'],
        ],
        note:
          'Framebuffer examples are useful because learners can see memory side effects as pixels.',
        sections: [
          {
            title: 'Immediate drawing',
            body:
              'PIX writes the x coordinate, y coordinate, and color directly from instruction operands.',
          },
          {
            title: 'Register drawing',
            body:
              'PIXR reads x, y, and color from registers, which lets earlier instructions prepare the drawing state.',
          },
          {
            title: 'Memory-mapped idea',
            body:
              'Many real systems expose devices through memory-like regions. The framebuffer is the beginner version of that idea.',
          },
        ],
        exampleTitle: 'pixel-registers.asm',
        exampleCode: `LOAD R0 2
LOAD R1 3
LOAD R2 4
PIXR R0 R1 R2
HALT`,
      },
    ],
  },
  {
    title: 'Instruction set',
    items: [
      {
        id: 'data-movement',
        title: 'Data movement',
        category: 'Instruction set',
        chips: ['LOAD', 'STORE'],
        lead:
          'Data movement instructions place immediate values into registers or copy register values into memory.',
        facts: [
          ['LOAD Rx, imm', '3 bytes'],
          ['STORE Rx, addr', '3 bytes'],
          ['Operands', 'Register and byte value'],
          ['State changed', 'Register or memory'],
        ],
        note:
          'LOAD creates a value in a register. STORE makes that value visible in memory.',
        sections: [
          {
            title: 'LOAD',
            body:
              'LOAD Rx, imm writes a byte-sized immediate value into a register. It does not read memory.',
          },
          {
            title: 'STORE',
            body:
              'STORE Rx, addr reads a register and writes the value to a memory address.',
          },
          {
            title: 'Common mistake',
            body:
              'Do not confuse the address with the value. STORE R0 32 means memory address 32 changes, not that R0 becomes 32.',
          },
        ],
        exampleTitle: 'data-movement.asm',
        exampleCode: `LOAD R0 42
STORE R0 32
HALT`,
      },
      {
        id: 'arithmetic',
        title: 'Arithmetic',
        category: 'Instruction set',
        chips: ['ADD', 'SUB'],
        lead:
          'ADD and SUB read two source registers, compute a result, and write the destination register.',
        facts: [
          ['ADD Rd, Ra, Rb', '4 bytes'],
          ['SUB Rd, Ra, Rb', '4 bytes'],
          ['Result', '8-bit wrapped'],
          ['State changed', 'Destination register'],
        ],
        note:
          'The source registers are read but not overwritten unless one of them is also the destination.',
        sections: [
          {
            title: 'ADD',
            body:
              'ADD Rd, Ra, Rb calculates Ra plus Rb and stores the result in Rd.',
          },
          {
            title: 'SUB',
            body:
              'SUB Rd, Ra, Rb calculates Ra minus Rb and stores the result in Rd.',
          },
          {
            title: 'Wraparound',
            body:
              'The VM keeps arithmetic results in one byte, so values wrap between 0 and 255.',
          },
        ],
        exampleTitle: 'arithmetic.asm',
        exampleCode: `LOAD R0 12
LOAD R1 5
SUB R2 R0 R1
PRINT R2
HALT`,
      },
      {
        id: 'control-flow',
        title: 'Control flow',
        category: 'Instruction set',
        chips: ['JZ', 'JMP'],
        lead:
          'Control flow instructions update the program counter so the next instruction can come from another location.',
        facts: [
          ['JZ Rx, addr', '3 bytes'],
          ['JMP addr', '2 bytes'],
          ['State changed', 'PC'],
          ['Common use', 'Branches and loops'],
        ],
        note:
          'JZ in the current VM checks a register value directly. Future architecture tracks can evolve this into a flags-based branch model.',
        sections: [
          {
            title: 'Syntax',
            body:
              'JZ Rx, addr jumps to an address or label when the selected register is zero. JMP addr always jumps.',
          },
          {
            title: 'Behavior',
            body:
              'If the condition is true, JZ sets the program counter to the target address. If it is false, execution continues after the JZ instruction.',
          },
          {
            title: 'Labels',
            body:
              'Labels let the assembler calculate addresses for you. That is safer than counting bytes by hand.',
          },
        ],
        exampleTitle: 'jz-countdown.asm',
        exampleCode: `; counts R0 down to zero
LOAD R0 5
LOAD R1 1
loop:
PRINT R0
SUB R0 R0 R1
JZ R0 done
JMP loop
done:
PRINT R0
HALT`,
      },
      {
        id: 'system',
        title: 'System',
        category: 'Instruction set',
        chips: ['PRINT', 'HALT'],
        lead:
          'System-style instructions produce console output or stop execution cleanly.',
        facts: [
          ['PRINT Rx', '2 bytes'],
          ['HALT', '1 byte'],
          ['Output', 'Console'],
          ['Stop state', 'Halted'],
        ],
        note:
          'Beginner programs should end with HALT so the final state is intentional.',
        sections: [
          {
            title: 'PRINT',
            body:
              'PRINT reads a register and appends its value to the console output.',
          },
          {
            title: 'HALT',
            body:
              'HALT tells the VM to stop executing. It is the normal clean ending for a program.',
          },
          {
            title: 'Runtime errors',
            body:
              'A runtime error also halts execution, but it sets an error code. HALT stops without an error.',
          },
        ],
        exampleTitle: 'print-halt.asm',
        exampleCode: `LOAD R0 9
PRINT R0
HALT`,
      },
    ],
  },
  {
    title: 'Cookbook',
    items: [
      {
        id: 'loops',
        title: 'Loops',
        category: 'Cookbook',
        chips: ['labels', 'JZ', 'JMP'],
        lead:
          'A Retro Core loop is a label, a state change, a zero check, and a jump back.',
        facts: [
          ['Loop start', 'Label'],
          ['Progress', 'SUB or state change'],
          ['Exit', 'JZ'],
          ['Repeat', 'JMP'],
        ],
        note:
          'Step through loops before running them. A missing exit condition can repeat forever.',
        sections: [
          {
            title: 'Loop shape',
            body:
              'Place a label before the repeated work. Change a value each time. Use JZ to exit and JMP to repeat.',
          },
          {
            title: 'Exit condition',
            body:
              'The countdown loop exits when R0 reaches zero. That makes the final state easy to check.',
          },
          {
            title: 'Debugging loops',
            body:
              'Watch the program counter. When it jumps backward, the loop is repeating.',
          },
        ],
        exampleTitle: 'loop.asm',
        exampleCode: `LOAD R0 3
LOAD R1 1
loop: PRINT R0
SUB R0 R0 R1
JZ R0 done
JMP loop
done: PRINT R0
HALT`,
      },
      {
        id: 'debugging-errors',
        title: 'Debugging errors',
        category: 'Cookbook',
        chips: ['errors', 'raw bytes'],
        lead:
          'Runtime errors are useful signals. They tell you the VM reached a byte or operand it could not execute safely.',
        facts: [
          ['Unknown opcode', 'Unsupported byte'],
          ['Bad register', 'Register index outside R0-R7'],
          ['PC bounds', 'Bad jump or incomplete instruction'],
          ['Mode', 'Usually raw-byte demos'],
        ],
        note:
          'Assembly mode catches many mistakes before runtime. Raw-byte mode is useful for seeing VM safety checks directly.',
        sections: [
          {
            title: 'Unknown opcode',
            body:
              'An unknown opcode means the VM read a byte that does not map to a supported instruction.',
          },
          {
            title: 'Bad register',
            body:
              'A bad register error means an instruction tried to read or write a register outside R0 through R7.',
          },
          {
            title: 'PC bounds',
            body:
              'A PC bounds error means the program counter moved outside the loaded program or an instruction did not have enough bytes left.',
          },
        ],
        exampleTitle: 'bad-opcode.raw',
        exampleCode: '42',
      },
      {
        id: 'drawing-pixels',
        title: 'Drawing pixels',
        category: 'Cookbook',
        chips: ['PIX', 'PIXR'],
        lead:
          'Use PIX for fixed coordinates and PIXR when registers should decide the coordinate or color.',
        facts: [
          ['PIX x y c', 'Immediate pixel'],
          ['PIXR Rx Ry Rc', 'Register pixel'],
          ['Output', 'Framebuffer'],
          ['Learning goal', 'Visible memory side effects'],
        ],
        note:
          'PIXR is the better stepping exercise because learners can see register setup before the pixel write.',
        sections: [
          {
            title: 'Immediate pixels',
            body:
              'PIX puts x, y, and color directly in the instruction. It is short and easy to inspect.',
          },
          {
            title: 'Register pixels',
            body:
              'PIXR reads x, y, and color from registers. That makes it a better model for calculated output.',
          },
          {
            title: 'Canvas and memory',
            body:
              'The canvas changes because framebuffer memory changes. This keeps graphics connected to core machine state.',
          },
        ],
        exampleTitle: 'draw-pixel.asm',
        exampleCode: `LOAD R0 2
LOAD R1 3
LOAD R2 4
PIXR R0 R1 R2
HALT`,
      },
    ],
  },
  {
    title: 'Advanced topics',
    items: [
      {
        id: 'encoding-decode',
        title: 'Encoding and decode',
        category: 'Advanced topics',
        chips: ['encoding', 'decode'],
        lead:
          'Encoding is how readable assembly becomes bytes. Decode is how the machine decides what those bytes mean.',
        facts: [
          ['Assembly', 'Human-readable form'],
          ['Opcode', 'Instruction selector'],
          ['Operands', 'Registers, addresses, or immediates'],
          ['Decode output', 'Control behavior'],
        ],
        note:
          'This topic is conceptual, but Retro Core makes it concrete because every assembled instruction becomes a short byte sequence.',
        sections: [
          {
            title: 'Two forms of the same program',
            body:
              'The editor shows assembly text. The VM executes bytes. The assembler reads instruction names, validates operands, resolves labels, and emits opcode and operand bytes.',
          },
          {
            title: 'Opcode first',
            body:
              'Retro Core instructions start with an opcode byte. For example, LOAD uses one opcode byte followed by one register byte and one immediate byte.',
          },
          {
            title: 'Decode chooses the path',
            body:
              'Once the VM reads an opcode, it chooses the instruction behavior. In hardware terms, decode would choose which control signals are active.',
          },
        ],
        referenceTitle: 'Decode checklist',
        referenceFirstColumn: 'Field',
        referenceRows: [
          ['Opcode', 'Selects the instruction behavior.'],
          ['Register operand', 'Names a register index such as R0 or R1.'],
          ['Immediate operand', 'Carries a byte-sized constant directly in the instruction.'],
          ['Label target', 'Assembler resolves the label into a byte address.'],
          ['Control decision', 'Determines whether to write a register, memory, output, PC, or halted state.'],
        ],
        exampleTitle: 'encoding-trace.txt',
        exampleCode: `Assembly:
LOAD R1 5
ADD R2 R1 R1
HALT

Byte layout:
LOAD opcode, R1, 5
ADD opcode, R2, R1, R1
HALT opcode`,
      },
      {
        id: 'datapath-control',
        title: 'Datapath and control',
        category: 'Advanced topics',
        chips: ['datapath', 'control'],
        lead:
          'The datapath moves values. Control decides which movement is allowed for the current instruction.',
        facts: [
          ['Datapath', 'Where values travel'],
          ['Control', 'Which state changes'],
          ['ALU', 'Arithmetic and compare-style work'],
          ['Write-back', 'Saving the result'],
        ],
        note:
          'Retro Core does not draw a hardware datapath yet, but each step already exposes enough state to reason about one.',
        sections: [
          {
            title: 'Value movement',
            body:
              'For ADD R2 R0 R1, values leave R0 and R1, flow through an addition operation, and the result lands in R2. R0 and R1 are sources; R2 is the destination.',
          },
          {
            title: 'Control choices',
            body:
              'LOAD enables a register write from an immediate. STORE enables a memory write from a register. JZ may replace the normal PC update with a branch target.',
          },
          {
            title: 'State categories',
            body:
              'Every instruction can be explained by the state it reads and the state it writes: registers, memory, PC, console output, framebuffer, halted flag, or error code.',
          },
        ],
        referenceTitle: 'State update table',
        referenceFirstColumn: 'Instruction type',
        referenceRows: [
          ['LOAD', 'Writes a register from an immediate operand.'],
          ['ADD / SUB', 'Reads two registers and writes one destination register.'],
          ['STORE', 'Reads a register and writes memory.'],
          ['JZ / JMP', 'Changes the PC instead of only advancing it.'],
          ['HALT', 'Writes the halted runtime state.'],
        ],
        exampleTitle: 'datapath-add.txt',
        exampleCode: `Before:
R0 = 12
R1 = 5

Instruction:
SUB R2 R0 R1

Datapath view:
R0 and R1 feed the ALU
ALU subtracts 5 from 12
R2 receives 7`,
      },
      {
        id: 'stack-model',
        title: 'Stack model',
        category: 'Advanced topics',
        chips: ['stack', 'planned'],
        lead:
          'A stack is a disciplined memory region used for temporary storage, saved state, function calls, and local variables.',
        facts: [
          ['Status', 'Planned VM feature'],
          ['Core idea', 'Last in, first out'],
          ['Needs', 'Stack pointer'],
          ['Future ops', 'PUSH and POP'],
        ],
        note:
          'Retro Core does not run PUSH or POP yet. This page explains the concept so the implementation can be added without confusing learners.',
        sections: [
          {
            title: 'Why a stack exists',
            body:
              'Registers are limited. A stack gives a program an organized place to save values temporarily, especially when a function needs to use registers that the caller still cares about.',
          },
          {
            title: 'Stack pointer',
            body:
              'A stack pointer stores the current top of stack. PUSH changes memory and moves the pointer. POP reads memory and moves the pointer back.',
          },
          {
            title: 'Safety checks',
            body:
              'The implementation should guard stack overflow, stack underflow, and out-of-range memory access before lessons rely on the feature.',
          },
        ],
        referenceTitle: 'Planned stack behavior',
        referenceFirstColumn: 'Concept',
        referenceRows: [
          ['Stack pointer', 'Register or VM state value that marks the current stack top.'],
          ['PUSH', 'Writes a value to stack memory and moves the stack pointer.'],
          ['POP', 'Reads the last pushed value and restores the stack pointer.'],
          ['Overflow', 'Error when stack growth would leave the valid memory region.'],
          ['Underflow', 'Error when POP runs with no saved value available.'],
        ],
        exampleTitle: 'planned-stack-flow.txt',
        exampleCode: `Concept sketch only:
PUSH R1
PUSH R2
POP R3

Expected stack idea:
R3 receives the last value pushed.
Retro Core does not execute this yet.`,
      },
      {
        id: 'functions-calls',
        title: 'Functions and calls',
        category: 'Advanced topics',
        chips: ['functions', 'planned'],
        lead:
          'A function call is a controlled jump that also remembers where execution should return afterward.',
        facts: [
          ['Status', 'Planned VM feature'],
          ['CALL needs', 'Return address storage'],
          ['RET needs', 'Restore PC'],
          ['Related', 'Stack and calling convention'],
        ],
        note:
          'CALL and RET are intentionally marked planned. They should not appear as runnable Retro Core code until the VM and assembler support them.',
        sections: [
          {
            title: 'Call is more than jump',
            body:
              'JMP moves to another instruction and forgets where it came from. CALL must preserve a return address so execution can resume after the call site.',
          },
          {
            title: 'Return restores flow',
            body:
              'RET takes the saved return address and places it back into the program counter. The next instruction should be the one after the original call.',
          },
          {
            title: 'Why this needs the stack',
            body:
              'Nested calls need more than one return address. A stack gives each call a place to save its return address and temporary state.',
          },
        ],
        referenceTitle: 'Function-call state',
        referenceFirstColumn: 'State',
        referenceRows: [
          ['Call target', 'Address of the function body.'],
          ['Return address', 'Address of the instruction after CALL.'],
          ['Saved registers', 'Values preserved so the caller can keep working.'],
          ['Arguments', 'Values passed into the function.'],
          ['Return value', 'Value produced by the function for the caller.'],
        ],
        exampleTitle: 'planned-call-flow.txt',
        exampleCode: `Concept sketch only:
CALL double
PRINT R0
HALT

double:
ADD R0 R0 R0
RET

Retro Core does not execute CALL or RET yet.`,
      },
      {
        id: 'calling-conventions',
        title: 'Calling conventions',
        category: 'Advanced topics',
        chips: ['ABI', 'functions'],
        lead:
          'A calling convention is an agreement about registers, arguments, return values, saved state, and stack use.',
        facts: [
          ['Problem', 'Functions need rules'],
          ['Arguments', 'Where inputs go'],
          ['Return value', 'Where output goes'],
          ['Saved state', 'Who restores what'],
        ],
        note:
          'This is a bridge topic for MIPS, RISC-V, x86-64, and Arm. Retro Core should get a small convention before function lessons become runnable.',
        sections: [
          {
            title: 'Caller and callee',
            body:
              'The caller is the code that invokes a function. The callee is the function being invoked. The convention says which side must save which values.',
          },
          {
            title: 'Arguments and return values',
            body:
              'Real architectures usually reserve certain registers for function inputs and outputs. A beginner VM can start with one or two simple registers.',
          },
          {
            title: 'Why conventions matter',
            body:
              'Without a convention, functions accidentally overwrite each other state. With a convention, separate pieces of code can work together.',
          },
        ],
        referenceTitle: 'Convention checklist',
        referenceFirstColumn: 'Rule',
        referenceRows: [
          ['Argument registers', 'Registers used to pass values into a function.'],
          ['Return register', 'Register used for the result.'],
          ['Caller-saved state', 'Values the caller must protect before calling.'],
          ['Callee-saved state', 'Values the function must restore before returning.'],
          ['Stack frame', 'Memory area for saved state and local temporary values.'],
        ],
        exampleTitle: 'small-convention.txt',
        exampleCode: `Possible Retro Core convention:
R0 = first argument
R1 = second argument
R0 = return value
R7 = stack pointer or reserved VM state

This is a design plan, not current VM behavior.`,
      },
      {
        id: 'riscv-bridge',
        title: 'RISC-V bridge',
        category: 'Advanced topics',
        chips: ['RISC-V', 'real ISA'],
        lead:
          'RISC-V is the best long-term real ISA track because it is open, teachable, and well supported by learning tools.',
        facts: [
          ['Track role', 'Main real ISA path'],
          ['Tools', 'RARS and Venus'],
          ['Core style', 'Load/store'],
          ['Use now', 'Concept mapping'],
        ],
        note:
          'The current VM does not execute RISC-V. Use this page to connect ideas and prepare the simulator or interpreter roadmap.',
        sections: [
          {
            title: 'What transfers from Retro Core',
            body:
              'Registers, immediates, memory, branches, labels, stepping, and final-state checks all transfer directly as learning habits.',
          },
          {
            title: 'What becomes more detailed',
            body:
              'RISC-V adds more registers, stricter instruction formats, ABI names, load/store variants, pseudo-instructions, and system-level conventions.',
          },
          {
            title: 'How to teach it',
            body:
              'Start with side-by-side examples: one Retro Core program and one RISC-V-style explanation. Only mark code runnable once the app can execute it or launches an external simulator path.',
          },
        ],
        referenceTitle: 'RISC-V mapping',
        referenceFirstColumn: 'Retro Core idea',
        referenceRows: [
          ['R0-R7', 'Maps conceptually to a larger register file with ABI names.'],
          ['LOAD immediate', 'Maps to immediate-producing instructions such as loading constants.'],
          ['STORE', 'Maps to explicit store instructions using calculated addresses.'],
          ['JZ / JMP', 'Maps to conditional branches and unconditional jumps.'],
          ['Step and inspect', 'Maps to RARS/Venus debugging workflow.'],
        ],
        exampleTitle: 'riscv-concept-map.txt',
        exampleCode: `Retro Core:
LOAD R0 5
LOAD R1 1
SUB R2 R0 R1
PRINT R2
HALT

RISC-V learning idea:
load constants into registers
subtract source registers
place result in a destination register
inspect output through simulator tools`,
      },
      {
        id: 'mips-bridge',
        title: 'MIPS bridge',
        category: 'Advanced topics',
        chips: ['MIPS', 'real ISA'],
        lead:
          'MIPS is useful as a teaching bridge because many courses use it to introduce load/store architecture, registers, procedures, and datapaths.',
        facts: [
          ['Track role', 'Course bridge'],
          ['Tools', 'MARS and SPIM'],
          ['Core style', 'Load/store'],
          ['Use now', 'Terminology and comparison'],
        ],
        note:
          'The current app should not claim to run MIPS. It can teach MIPS concepts, link sources, and later add execution support.',
        sections: [
          {
            title: 'Why MIPS still helps',
            body:
              'MIPS has simple regular instruction patterns and a long teaching history. It is a good bridge from Retro Core into textbook computer organization material.',
          },
          {
            title: 'Register roles',
            body:
              'MIPS introduces conventional register roles for temporaries, arguments, return values, stack pointer, and return address. Those roles prepare learners for calling conventions.',
          },
          {
            title: 'Simulator services',
            body:
              'Educational MIPS simulators provide services such as printing. Lessons should distinguish core ISA instructions from simulator-provided convenience behavior.',
          },
        ],
        referenceTitle: 'MIPS learning map',
        referenceFirstColumn: 'Topic',
        referenceRows: [
          ['Registers', 'Move from R0-R7 into named roles and larger register sets.'],
          ['Load/store', 'Explain explicit memory transfer before arithmetic.'],
          ['Branches', 'Compare label-based jumps and conditional branches.'],
          ['Procedures', 'Introduce return address and stack pointer roles.'],
          ['MARS/SPIM', 'Use as external references until in-app MIPS execution exists.'],
        ],
        exampleTitle: 'mips-concept-map.txt',
        exampleCode: `Retro Core idea:
STORE R0 32

MIPS learning idea:
use a store instruction to copy a register value
to an address calculated from a base register and offset

This is concept mapping, not runnable Retro Core code.`,
      },
      {
        id: 'pipeline-hazards',
        title: 'Pipelining and hazards',
        category: 'Advanced topics',
        chips: ['pipeline', 'hazards'],
        lead:
          'Pipelining overlaps instruction work over time. Hazards happen when overlap creates timing conflicts.',
        facts: [
          ['Pipeline', 'Overlapped stages'],
          ['Data hazard', 'Value not ready yet'],
          ['Control hazard', 'Next PC not known yet'],
          ['Current VM', 'Sequential execution'],
        ],
        note:
          'Retro Core currently executes sequentially. Pipeline pages should stay visual and conceptual until a timeline simulator exists.',
        sections: [
          {
            title: 'Why pipelining exists',
            body:
              'A pipeline improves throughput by letting multiple instructions occupy different stages at the same time. One instruction might decode while another executes.',
          },
          {
            title: 'Data hazards',
            body:
              'A data hazard appears when an instruction needs a value produced by an earlier instruction, but that value is not available at the needed stage yet.',
          },
          {
            title: 'Control hazards',
            body:
              'A control hazard appears when the machine does not yet know which instruction should come next because a branch decision is pending.',
          },
        ],
        referenceTitle: 'Hazard guide',
        referenceFirstColumn: 'Hazard',
        referenceRows: [
          ['Read after write', 'A later instruction needs a value an earlier instruction produces.'],
          ['Branch decision', 'The next PC depends on a branch outcome.'],
          ['Stall', 'Pause progress until needed state is available.'],
          ['Forwarding', 'Use a just-produced value before normal write-back.'],
          ['Flush', 'Discard speculative work after the wrong path was started.'],
        ],
        exampleTitle: 'pipeline-dependency.txt',
        exampleCode: `Sequential program:
LOAD R1 5
ADD R2 R1 R1

Pipeline question:
ADD reads R1.
LOAD produces R1.
What happens if ADD reaches the read stage before LOAD writes back?`,
      },
      {
        id: 'x86-reading',
        title: 'x86-64 reading path',
        category: 'Advanced topics',
        chips: ['x86-64', 'advanced'],
        lead:
          'x86-64 is a practical advanced reading track for real desktop and server code, but it should come after simpler ISA habits.',
        facts: [
          ['Use case', 'Reading real programs'],
          ['Complexity', 'High'],
          ['Sources', 'OST2, Intel manuals, NASM docs'],
          ['Prereqs', 'Registers, stack, calls, memory'],
        ],
        note:
          'Do not use x86-64 as the first beginner language. Use it after learners can already trace registers, memory, branches, and calls.',
        sections: [
          {
            title: 'Why it is advanced',
            body:
              'x86-64 has many instruction forms, historical compatibility, complex addressing, implicit operands, and dense manuals. That makes it powerful but heavy for beginners.',
          },
          {
            title: 'What to teach first',
            body:
              'Start with register moves, arithmetic, stack pointer changes, call and return, comparisons, branches, and simple memory operands.',
          },
          {
            title: 'Reading instead of writing',
            body:
              'The first x86-64 goal should be reading compiler output and explaining state changes, not writing large programs from scratch.',
          },
        ],
        referenceTitle: 'x86-64 reading checklist',
        referenceFirstColumn: 'Look for',
        referenceRows: [
          ['Register roles', 'Which registers carry arguments, temporaries, and return values.'],
          ['Stack movement', 'Changes to the stack pointer and saved state.'],
          ['Calls', 'Where functions are invoked and where they return.'],
          ['Branches', 'Which comparisons control the next instruction.'],
          ['Memory operands', 'Base, index, scale, and displacement when present.'],
        ],
        exampleTitle: 'x86-reading-checklist.txt',
        exampleCode: `When reading a small x86-64 function:
1. Mark argument registers.
2. Mark stack pointer changes.
3. Find call and return.
4. Identify comparison and branch pairs.
5. Identify the return value location.`,
      },
      {
        id: 'arm-reading',
        title: 'Arm and AArch64 path',
        category: 'Advanced topics',
        chips: ['Arm', 'AArch64'],
        lead:
          'Arm is a strong later path for mobile, embedded, cloud, and Apple silicon contexts.',
        facts: [
          ['Use case', 'Modern platforms'],
          ['ISA family', 'Arm / AArch64'],
          ['Sources', 'Arm Learn the Architecture'],
          ['Prereqs', 'Load/store and function basics'],
        ],
        note:
          'Arm content should be source-backed and introduced after learners understand the common assembly ideas shared across architectures.',
        sections: [
          {
            title: 'Why add Arm later',
            body:
              'Arm appears in phones, embedded systems, cloud machines, and Apple silicon. It is worth teaching after the core learning path is stable.',
          },
          {
            title: 'What transfers',
            body:
              'Register state, load/store memory, conditional control flow, calling conventions, and stack discipline all carry over from earlier lessons.',
          },
          {
            title: 'How to keep it approachable',
            body:
              'Start with an overview and small reading examples before adding syntax-heavy lessons. Link official Arm guides for exact terminology.',
          },
        ],
        referenceTitle: 'Arm path checklist',
        referenceFirstColumn: 'Topic',
        referenceRows: [
          ['Registers', 'Introduce general-purpose registers and special roles.'],
          ['Load/store', 'Show explicit memory transfer patterns.'],
          ['Branches', 'Connect condition handling to control flow.'],
          ['Functions', 'Explain calls, returns, and ABI expectations.'],
          ['Platforms', 'Connect lessons to mobile, embedded, and Apple silicon contexts.'],
        ],
        exampleTitle: 'arm-track-plan.txt',
        exampleCode: `Arm track order:
1. Registers and state
2. Load/store memory
3. Branches and conditions
4. Functions and ABI basics
5. Reading compiler output`,
      },
      {
        id: 'external-tooling',
        title: 'External tooling',
        category: 'Advanced topics',
        chips: ['tools', 'workflow'],
        lead:
          'External tools help when learners need a real ISA, richer debugging, or assembler behavior beyond the Retro Core VM.',
        facts: [
          ['RISC-V', 'RARS and Venus'],
          ['MIPS', 'MARS and SPIM'],
          ['x86-64', 'NASM and compiler output'],
          ['Role', 'Bridge from browser to real tools'],
        ],
        note:
          'Each external tool should be introduced with a clear reason. A link alone is not a lesson.',
        sections: [
          {
            title: 'When to leave the browser',
            body:
              'Stay in retroWeb Academy while learning core state changes. Move to external tools when the lesson requires a real ISA, pseudo-instruction expansion, ABI details, or platform-specific behavior.',
          },
          {
            title: 'What to compare',
            body:
              'Compare editor workflow, assemble errors, stepping, register views, memory views, breakpoints, traces, and how each tool represents output.',
          },
          {
            title: 'How to bring ideas back',
            body:
              'Good external-tool features can become retroWeb Academy roadmap items: breakpoints, trace history, decode panes, stack visuals, and timeline views.',
          },
        ],
        referenceTitle: 'Tool map',
        referenceFirstColumn: 'Tool',
        referenceRows: [
          ['RARS', 'RISC-V assembler and simulator for local educational workflows.'],
          ['Venus', 'Browser-oriented RISC-V simulator workflow reference.'],
          ['MARS', 'MIPS assembler and simulator used in many courses.'],
          ['SPIM', 'Classic MIPS simulator reference.'],
          ['NASM', 'Assembler documentation for x86 and x86-64 syntax.'],
        ],
        exampleTitle: 'tooling-map.txt',
        exampleCode: `Choose the tool by lesson:
Retro Core basics -> retroWeb Academy
RISC-V execution -> RARS or Venus
MIPS execution -> MARS or SPIM
x86 syntax -> NASM docs
Architecture truth -> official manuals`,
      },
    ],
  },
];

const docsById = Object.fromEntries(
  docGroups.flatMap((group) => group.items.map((item) => [item.id, item])),
);

const onThisPageItems = [
  ['summary', 'Summary'],
  ['behavior', 'Behavior'],
  ['reference', 'Reference'],
  ['example', 'Example'],
  ['related', 'Related lessons'],
];

function getAnchorProps(url) {
  return { href: url, target: '_blank', rel: 'noreferrer' };
}

function getDocIdFromHash(hash = '') {
  const query = hash.split('?')[1] ?? '';
  return new URLSearchParams(query).get('doc');
}

export default function DocsPage() {
  const [activeDocId, setActiveDocId] = useState(() => {
    const docId = getDocIdFromHash(globalThis.location?.hash ?? '');
    return docsById[docId] ? docId : 'control-flow';
  });
  const sectionRefs = useRef({});
  const activeDoc = docsById[activeDocId] ?? docsById['control-flow'];
  const referenceRows = activeDoc.referenceRows ?? defaultInstructionRows;
  const referenceTitle = activeDoc.referenceTitle ?? 'Instruction reference';
  const referenceFirstColumn = activeDoc.referenceFirstColumn ?? 'Instruction';

  const scrollToSection = (sectionId) => {
    sectionRefs.current[sectionId]?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  useEffect(() => {
    const syncDocFromHash = () => {
      const docId = getDocIdFromHash(window.location.hash);
      if (docsById[docId]) {
        setActiveDocId(docId);
      }
    };

    window.addEventListener('hashchange', syncDocFromHash);
    syncDocFromHash();

    return () => {
      window.removeEventListener('hashchange', syncDocFromHash);
    };
  }, []);

  const selectDoc = (docId) => {
    setActiveDocId(docId);

    if (window.location.hash.startsWith('#/docs')) {
      window.history.replaceState(null, '', `#/docs?doc=${docId}`);
    }
  };

  return (
    <div className="space-y-6">
      <header>
        <div className="rw-eyebrow">Reference</div>
        <h1 className="mt-1 text-3xl font-semibold text-[var(--heading-color)]">Docs</h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-[var(--text-muted)]">
          Instruction reference, VM behavior notes, and runnable examples.
        </p>
      </header>

      <section className="rw-card grid min-h-[760px] overflow-hidden xl:grid-cols-[248px_minmax(0,1fr)_220px]">
        <aside className="border-b border-[var(--line)] bg-[var(--panel-soft)] p-4 xl:border-b-0 xl:border-r">
          <div className="rw-search mb-4 max-w-none">
            <span>Cmd+K</span>
            <span>search docs...</span>
          </div>

          {docGroups.map((group) => (
            <div key={group.title} className="mb-5">
              <div className="mb-2 font-mono text-[10px] uppercase tracking-[0.12em] text-[var(--ink-3)]">
                {group.title}
              </div>
              <div className="grid gap-1 text-sm">
                {group.items.map((item) => {
                  const active = item.id === activeDoc.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => selectDoc(item.id)}
                      className="rounded-[4px] border bg-transparent px-2 py-1 text-left text-[var(--ink-2)]"
                      style={{
                        borderColor: active ? 'var(--accent)' : 'var(--line)',
                        color: active ? 'var(--accent)' : undefined,
                        boxShadow: active ? 'inset 2px 0 0 var(--accent)' : 'none',
                      }}
                    >
                      {item.title}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </aside>

        <article className="min-w-0 p-5 md:p-8">
          <div className="font-mono text-[11px] text-[var(--ink-3)]">
            Docs / {activeDoc.category} / {activeDoc.title}
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            {activeDoc.chips.map((chip, index) => (
              <span key={chip} className={index === 0 ? 'rw-chip rw-chip-accent' : 'rw-chip'}>
                {chip}
              </span>
            ))}
          </div>

          <h2
            ref={(node) => {
              sectionRefs.current.summary = node;
            }}
            className="mt-4 scroll-mt-24 text-3xl font-semibold text-[var(--ink)]"
          >
            {activeDoc.title}
          </h2>
          <p className="mt-2 max-w-3xl text-base leading-7 text-[var(--text-muted)]">
            {activeDoc.lead}
          </p>

          <div className="rw-card-soft mt-5 grid gap-3 p-4 font-mono text-sm md:grid-cols-4">
            {activeDoc.facts.map(([label, value]) => (
              <span key={label}>
                <span className="text-[var(--ink-3)]">{label.toUpperCase()}</span> {value}
              </span>
            ))}
          </div>

          <div className="mt-5 border-l-4 border-[#3a6fb0] bg-[#eaf1fa] p-4 text-sm leading-6 text-[#1f436f]">
            {activeDoc.note}
          </div>

          <section
            ref={(node) => {
              sectionRefs.current.behavior = node;
            }}
            className="mt-8 scroll-mt-24 space-y-5"
          >
            {activeDoc.sections.map((section) => (
              <div key={section.title}>
                <h3 className="text-xl font-semibold text-[var(--ink)]">{section.title}</h3>
                <p className="mt-2 text-sm leading-7 text-[var(--text-muted)]">
                  {section.body}
                </p>
              </div>
            ))}
          </section>

          <section
            ref={(node) => {
              sectionRefs.current.reference = node;
            }}
            className="mt-8 scroll-mt-24"
          >
            <h3 className="text-xl font-semibold text-[var(--ink)]">{referenceTitle}</h3>
            <div className="mt-3 overflow-hidden rounded-[6px] border border-[var(--line)]">
              <table className="w-full border-collapse text-sm">
                <thead className="bg-[var(--panel-soft)] text-left text-[var(--ink-3)]">
                  <tr>
                    <th className="px-4 py-3 font-mono text-[11px] uppercase tracking-[0.08em]">{referenceFirstColumn}</th>
                    <th className="px-4 py-3 font-mono text-[11px] uppercase tracking-[0.08em]">Explanation</th>
                  </tr>
                </thead>
                <tbody>
                  {referenceRows.map(([instruction, description]) => (
                    <tr key={instruction} className="border-t border-[var(--line-2)]">
                      <td className="px-4 py-3 font-mono text-[var(--accent)]">{instruction}</td>
                      <td className="px-4 py-3 text-[var(--text-muted)]">{description}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section
            ref={(node) => {
              sectionRefs.current.example = node;
            }}
            className="mt-8 scroll-mt-24"
          >
            <h3 className="text-xl font-semibold text-[var(--ink)]">Example</h3>
            <div className="mt-3">
              <MacWindow title={activeDoc.exampleTitle}>
                <pre className="whitespace-pre-wrap font-mono text-sm leading-6 text-[#d8d2c8]">
                  {activeDoc.exampleCode}
                </pre>
              </MacWindow>
            </div>
          </section>

          <section
            ref={(node) => {
              sectionRefs.current.related = node;
            }}
            className="mt-8 scroll-mt-24"
          >
            <h3 className="text-xl font-semibold text-[var(--ink)]">Related lessons</h3>
            <div className="mt-3 grid gap-3 md:grid-cols-2">
              {docsReferenceSections.map((section) => (
                <article key={section.title} className="rw-card p-4">
                  <h4 className="font-semibold text-[var(--ink)]">{section.title}</h4>
                  <div className="mt-3 grid gap-2 text-sm leading-6 text-[var(--text-muted)]">
                    {section.items.slice(0, 3).map((item) => (
                      <p key={item}>{item}</p>
                    ))}
                  </div>
                </article>
              ))}
            </div>
          </section>
        </article>

        <aside className="border-t border-[var(--line)] p-5 xl:border-l xl:border-t-0">
          <div className="rw-eyebrow" style={{ color: 'var(--ink-3)' }}>
            On this page
          </div>
          <div className="mt-3 grid gap-2 text-sm text-[var(--text-muted)]">
            {onThisPageItems.map(([sectionId, label], index) => (
              <button
                key={sectionId}
                type="button"
                onClick={() => scrollToSection(sectionId)}
                className="border-0 bg-transparent py-1 pl-3 text-left"
                style={{
                  borderLeft: `2px solid ${index === 0 ? 'var(--accent)' : 'var(--line)'}`,
                  borderRadius: 0,
                  color: index === 0 ? 'var(--accent)' : 'var(--text-muted)',
                }}
              >
                {label}
              </button>
            ))}
          </div>

          <div className="mt-8 border-t border-[var(--line-2)] pt-5">
            <div className="rw-eyebrow" style={{ color: 'var(--ink-3)' }}>
              Help
            </div>
            <div className="mt-3 grid gap-2 text-sm">
              <a {...getAnchorProps(githubEditUrl)}>Edit this page</a>
              <a {...getAnchorProps(githubFileUrl)}>View on GitHub</a>
              <a {...getAnchorProps(githubIssueUrl)}>Report an error</a>
            </div>
          </div>
        </aside>
      </section>
    </div>
  );
}
