// vm.c
#include <stdio.h>
#include <string.h>
#include "vm.h"

// your globals
unsigned char memory[MEM_SIZE]    = {0};
unsigned int  registers[NUM_REGS] = {0};
unsigned int  pc                  = 0;

// single-instruction executor
static void exec_instruction(void) {
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
        unsigned char r    = memory[pc+1];
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
        // do not advance PC further
        break;

      default:
        printf("❌ Unknown opcode at PC=%u: 0x%02X\n", pc, opcode);
        break;
    }
}

// === full-memory & register exports ===
EMSCRIPTEN_KEEPALIVE
unsigned char* get_memory(void) {
    return memory;
}

EMSCRIPTEN_KEEPALIVE
unsigned int get_register(unsigned int index) {
    return registers[index];
}

// === debug APIs ===
EMSCRIPTEN_KEEPALIVE
void step_vm(void) { exec_instruction(); }

EMSCRIPTEN_KEEPALIVE
unsigned int get_pc(void) { return pc; }

EMSCRIPTEN_KEEPALIVE
void reset_vm(void) {
    pc = 0;
    memset(registers, 0, sizeof(registers));
    // keep memory intact so code stays loaded
}

// === batch-run ===
void run_vm(void) {
    reset_vm();
    while (memory[pc] != OP_HALT) {
        exec_instruction();
    }
}

#ifdef TEST_VM
#include <assert.h>

int main() {
    // 1) Build a tiny program in memory:
    //    LOAD R0 ← 5       (3 bytes)
    //    ADD  R1 ← R0 + R0 (4 bytes)
    //    HALT              (1 byte)
    unsigned char program[] = {
      OP_LOAD, 0, 5,
      OP_ADD,  1, 0, 0,
      OP_HALT
    };
    memcpy(memory, program, sizeof(program));

    // 2) Reset and check PC/reset behavior
    reset_vm();
    assert(get_pc() == 0);

    // 3) Step once: should execute LOAD, advancing PC by 3
    step_vm();
    unsigned int pc1 = get_pc();
    printf("After 1 step, PC = %u (expect 3)\n", pc1);
    assert(pc1 == 3);

    // 4) Check register R0 was set to 5
    unsigned int r0 = get_register(0);
    printf("R0 = %u (expect 5)\n", r0);
    assert(r0 == 5);

    // 5) Step again: should execute ADD, advancing PC by 4 (to 7)
    step_vm();
    unsigned int pc2 = get_pc();
    printf("After 2 steps, PC = %u (expect 7)\n", pc2);
    assert(pc2 == 7);

    // 6) Check R1 = R0 + R0 = 10
    unsigned int r1 = get_register(1);
    printf("R1 = %u (expect 10)\n", r1);
    assert(r1 == 10);

    printf("✅ TEST_VM all assertions passed.\n");
    return 0;
}
#endif