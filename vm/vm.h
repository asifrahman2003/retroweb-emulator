#ifndef VM_H
#define VM_H

#define MEM_SIZE 1024
#define NUM_REGS 8

// Decimal opcodes
#define OP_LOAD 1
#define OP_ADD  2
#define OP_SUB  3
#define OP_PRINT 5
#define OP_JZ  6
#define OP_JMP 7
#define OP_HALT 255

// Shared VM state
extern unsigned char memory[MEM_SIZE];
extern unsigned int registers[NUM_REGS];
extern unsigned int pc;

// Function to run the VM
void run_vm();

#endif
