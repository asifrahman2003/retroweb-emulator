// vm.c
#include <stdio.h>
#include <string.h>
#include "vm.h"

unsigned char memory[MEM_SIZE]     = {0};
unsigned int  registers[NUM_REGS]  = {0};
unsigned int  pc                   = 0;

unsigned char* get_memory(void) {
    return memory;
}

unsigned int get_register(int index) {
    return registers[index];
}

void print_registers(void) {
    for (int i = 0; i < NUM_REGS; i++) {
        printf("R%d = %u\n", i, registers[i]);
    }
}

void run_vm(void) {
    pc = 0;
    memset(registers, 0, sizeof(registers));

    while (1) {
        unsigned char opcode = memory[pc];
        printf("PC: %u, OPCODE: %u\n", pc, opcode);

        switch (opcode) {

          case OP_LOAD: {
            unsigned char r = memory[pc+1];
            unsigned char v = memory[pc+2];
            registers[r] = v;
            printf("LOAD R%u <- %u\n", r, v);
            pc += 3;
            break;
          }

          case OP_ADD: {
            unsigned char d = memory[pc+1],
                          a = memory[pc+2],
                          b = memory[pc+3];
            registers[d] = registers[a] + registers[b];
            printf("ADD R%u = R%u + R%u => %u\n", d, a, b, registers[d]);
            pc += 4;
            break;
          }

          case OP_SUB: {
            unsigned char d = memory[pc+1],
                          a = memory[pc+2],
                          b = memory[pc+3];
            registers[d] = registers[a] - registers[b];
            printf("SUB R%u = R%u - R%u => %u\n", d, a, b, registers[d]);
            pc += 4;
            break;
          }

          case OP_PRINT: {
            unsigned char r = memory[pc+1];
            printf("PRINT R%u = %u\n", r, registers[r]);
            pc += 2;
            break;
          }

          case OP_JZ: {
            unsigned char r = memory[pc+1];
            unsigned char addr = memory[pc+2];
            if (registers[r] == 0) {
              printf("JZ: R%u == 0 → Jump to %u\n", r, addr);
              pc = addr;
            } else {
              printf("JZ: R%u != 0 → continue\n", r);
              pc += 3;
            }
            break;
          }

          case OP_JMP: {
            unsigned char addr = memory[pc+1];
            printf("JMP to %u\n", addr);
            pc = addr;
            break;
          }

          case OP_PIX: {
            // immediate x, y, color
            unsigned char x = memory[pc+1];
            unsigned char y = memory[pc+2];
            unsigned char c = memory[pc+3];
            if (x < SCREEN_WIDTH && y < SCREEN_HEIGHT) {
              memory[FRAMEBUFFER_START + y*SCREEN_WIDTH + x] = c;
            }
            printf("PIX → (%u,%u)=color %u\n", x, y, c);
            pc += 4;
            break;
          }

          case OP_PIXR: {
            // register x, register y, register color
            unsigned char rx = memory[pc+1];
            unsigned char ry = memory[pc+2];
            unsigned char rc = memory[pc+3];
            unsigned int  x  = registers[rx];
            unsigned int  y  = registers[ry];
            unsigned int  c  = registers[rc];
            if (x < SCREEN_WIDTH && y < SCREEN_HEIGHT) {
              memory[FRAMEBUFFER_START + y*SCREEN_WIDTH + x] = c;
            }
            printf("PIXR R%u,R%u,R%u → (%u,%u)=color %u\n",
                   rx, ry, rc, x, y, c);
            pc += 4;
            break;
          }

          case OP_HALT:
            printf("🛑 HALT\n");
            return;

          default:
            printf("❌ Unknown opcode at PC=%u: 0x%02X\n", pc, opcode);
            return;
        }
    }
}

#ifdef TEST_VM
int main() {
    // A quick smoke test for the immediate-PIX opcode
    unsigned char program[] = {
      OP_PIX,  2, 3, 7,
      OP_HALT
    };
    memcpy(memory, program, sizeof(program));
    run_vm();
    unsigned int idx = FRAMEBUFFER_START + 3*SCREEN_WIDTH + 2;
    printf("Framebuffer[3][2] = %u (expect 7)\n", memory[idx]);
    return 0;
}
#endif
