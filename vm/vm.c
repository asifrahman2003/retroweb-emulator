// core instruction loop and opcode logic
#include <stdio.h>
#include <string.h>
#include "vm.h"
#define TEST_VM



// Define memory and register storage
unsigned char memory[MEM_SIZE] = {0};       // 1KB memory
unsigned int registers[NUM_REGS] = {0};     // 8 general-purpose registers
unsigned int pc = 0;                         // Program counter

// Expose pointer to memory[] for JS to write bytecode
unsigned char* get_memory() {
    return memory;
}

// Get value of a register (to expose to JS)
unsigned int get_register(int index) {
    return registers[index];
}


// Main execution loop
void run_vm() {
    pc = 0;

    for (int i = 0; i < NUM_REGS; i++) {
        registers[i] = 0;
    }

    while (1) {
        unsigned char opcode = memory[pc];

        printf("PC: %d, OPCODE: %d\n", pc, opcode);  // 🪵 Debug output

        if (opcode == OP_LOAD) {
            unsigned char reg = memory[pc + 1];
            unsigned char value = memory[pc + 2];
            registers[reg] = value;
            printf("LOAD R%d <- %d\n", reg, value);
            pc += 3;
        }
        else if (opcode == OP_ADD) {
            unsigned char dest = memory[pc + 1];
            unsigned char src1 = memory[pc + 2];
            unsigned char src2 = memory[pc + 3];
            registers[dest] = registers[src1] + registers[src2];
            printf("ADD R%d = R%d + R%d => %d\n", dest, src1, src2, registers[dest]);
            pc += 4;
        }
        else if (opcode == OP_SUB) {
            unsigned char dest = memory[pc + 1];
            unsigned char src1 = memory[pc + 2];
            unsigned char src2 = memory[pc + 3];
            registers[dest] = registers[src1] - registers[src2];
            printf("SUB R%d = R%d - R%d => %d\n", dest, src1, src2, registers[dest]);
            pc += 4;
        }
        else if (opcode == OP_PRINT) {
            unsigned char reg = memory[pc + 1];
            printf("✅ PRINT R%d = %d\n", reg, registers[reg]);
            pc += 2;
        }
        else if (opcode == OP_JMP) {
            unsigned char addr = memory[pc + 1];
            printf("JMP to %d\n", addr);
            pc = addr;
        }
        else if (opcode == OP_JZ) {
            unsigned char reg = memory[pc + 1];
            unsigned char addr = memory[pc + 2];
            if (registers[reg] == 0) {
                printf("JZ: R%d == 0 → Jumping to %d\n", reg, addr);
                pc = addr;
            } else {
                printf("JZ: R%d != 0 → Continuing\n", reg);
                pc += 3;
            }
        }
        else if (opcode == OP_HALT) {
            printf("🛑 HALT\n");
            break;
        }
        else {
            printf("❌ Unknown opcode at PC=%d: 0x%02X\n", pc, opcode);
            break;
        }
    }
}


#ifdef TEST_VM

int main() {
    unsigned char test[] = {
    1, 1, 5,      // LOAD R0, 10
    2, 2, 1, 1,       // LOAD R1, 1
    5, 2,   // SUB R0 = R0 - R1
    255           // HALT
};



    // Copy test program into memory
    memcpy(memory, test, sizeof(test));

    run_vm();

    return 0;
}

#endif
