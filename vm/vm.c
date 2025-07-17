// core instruction loop and opcode logic

#include <stdio.h>
#include "vm.h"

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
    while (1) {
        unsigned char opcode = memory[pc];

        if (opcode == OP_LOAD) {
            // LOAD Rn, value
            unsigned char reg = memory[pc + 1];
            unsigned char value = memory[pc + 2];
            registers[reg] = value;
            pc += 3;
        }
        else if (opcode == OP_ADD) {
            // ADD Rn, Rm, Rd
            unsigned char r1 = memory[pc + 1];
            unsigned char r2 = memory[pc + 2];
            unsigned char dest = memory[pc + 3];
            registers[dest] = registers[r1] + registers[r2];
            pc += 4;
        }
        else if (opcode == OP_HALT) {
            break;
        }
        else {
            printf("Unknown opcode at PC=%d: 0x%02X\n", pc, opcode);
            break;
        }
    }
}

#ifdef TEST_VM

int main() {
    // LOAD R0, 5
    memory[0] = OP_LOAD;
    memory[1] = 0;
    memory[2] = 5;

    // LOAD R1, 7
    memory[3] = OP_LOAD;
    memory[4] = 1;
    memory[5] = 7;

    // ADD R0 + R1 -> R2
    memory[6] = OP_ADD;
    memory[7] = 0;
    memory[8] = 1;
    memory[9] = 2;

    // HALT
    memory[10] = OP_HALT;

    run_vm();

    printf("R2 = %d\n", registers[2]); // Should print 12

    return 0;
}

#endif
