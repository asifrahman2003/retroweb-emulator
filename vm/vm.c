// vm.c
#include <stdio.h>
#include <string.h>
#include "vm.h"

// globals
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

      case OP_STORE: {
        unsigned char r = memory[pc+1];      // Register to store
        unsigned char addr = memory[pc+2];   // Memory address
        memory[addr] = (unsigned char)registers[r];
        printf("STORE R%u (%u) → mem[%u]\n", r, registers[r], addr);
        pc += 3;
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
    printf("\n=== Running VM Test Suite ===\n");

    // Test Program: writes results to 0x20 and 0x21, well past the 17-byte code
    unsigned char program[] = {
        OP_LOAD,  0, 42,       // R0 = 42
        OP_STORE, 0, 0x20,     // mem[0x20] = 42
        OP_LOAD,  1, 7,        // R1 = 7
        OP_ADD,   2, 0, 1,     // R2 = R0 + R1 = 49
        OP_STORE, 2, 0x21,     // mem[0x21] = 49
        OP_HALT
    };

    // clear and load
    memset(memory, 0, sizeof(memory));
    memset(registers, 0, sizeof(registers));
    pc = 0;
    memcpy(memory, program, sizeof(program));

    // run
    while (memory[pc] != OP_HALT) step_vm();
    step_vm();  // final HALT

    // verify
    assert(registers[0] == 42);
    assert(memory[0x20] == 42);
    assert(registers[1] == 7);
    assert(registers[2] == 49);
    assert(memory[0x21] == 49);

    printf("✅ All assertions passed! OP_STORE and related ops are working correctly.\n");
    return 0;
}
#endif