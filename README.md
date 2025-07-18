# Project Overview & Goals

## Project Title: RetroWeb Emulator
RetroWeb Emulator is a web-based interactive emulator built from scratch, featuring a custom virtual machine (VM) and a MIPS-inspired assembly-like instruction set. It serves as an educational sandbox that makes low-level systems programming accessible in the browser, with a modern React frontend and WebAssembly backend.

## What We've Built So Far

### Custom Virtual Machine (VM):

- Written in C and compiled to WebAssembly using Emscripten.

- Supports a basic instruction set: LOAD, ADD, SUB, PRINT, HALT.

- 8 General Purpose Registers (R0–R7).

- Memory-mapped architecture to simulate instruction loading.

### Assembler Implementation:

- Built a custom JavaScript-based assembler that converts human-readable assembly into bytecode.

- Handles syntax like: LOAD R1 5, ADD R2 R1 R1, PRINT R2, HALT.

- Frontend (React + Framer Motion):

- Beautiful, interactive UI inspired by retro terminal themes.

- Monaco-powered code editor for inputting either raw bytecode or assembly.

- Memory viewer and output console displaying register values and print statements.

- Easter egg trigger with hidden debug mode.

- Toggle between raw bytecode and assembly syntax.

- Console logs mapped in real-time via the browser devtools and UI.

### Dynamic Output System:

- VM output reflects actual console state and register values post-execution.

- Logs updates in correct order with improved formatting.

### What We're Planning Next
- Add More VM Instructions:

```
MUL, DIV

JMP, JZ, JNZ (jump, conditional execution)

MOV, CMP, NOP
```

## Error Handling & Debugging Features:

Highlight syntax errors inline.

Step-by-step execution mode (debugger).

Display program counter and instruction decoding visually.

## Syntax Highlighting for Assembly:

Add basic syntax highlighting inside the Monaco editor for our custom instruction set.

## Save/Load Programs:

Save programs in browser localStorage or export as .retro files.

Load example programs via a dropdown.

## Testing & Validation Suite:

Implement test cases to ensure assembler accuracy and instruction execution.

Add logging snapshots to help debug instruction misbehavior.

## Responsive UI & Mobile Optimization:

Tweak layout and orientation issues for mobile devices.

## Documentation & Playground:

Add user-friendly docs to teach how to use the emulator and write instructions.

Include an embedded tutorial mode or a list of challenges to try.

## Why This Project Stands Out

Invented a fully custom VM from the ground up, not based on existing chipsets.

Compiled native C code to WebAssembly and connected it with a modern React frontend.

Made low-level computing concepts interactive, visual, and browser-based.

Focused on education, experimentation, and systems design. 

## Developer

Ⓒ Asifur Rahman. Licensed under MIT License. 