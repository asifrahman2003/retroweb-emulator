#ifndef VM_H
#define VM_H

#define MEM_SIZE 1024         // 1KB memory
#define NUM_REGS 8            // 8 registers

// Opcode definitions
#define OP_LOAD 0x01
#define OP_ADD  0x02
#define OP_HALT 0xFF

// Shared VM state
extern unsigned char memory[MEM_SIZE];
extern unsigned int registers[NUM_REGS];
extern unsigned int pc;

// Function to run the VM
void run_vm();

#endif
