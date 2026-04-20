#include <stdio.h>
#include <string.h>
#include "vm.h"

unsigned char memory[MEM_SIZE] = {0};
unsigned int registers[NUM_REGS] = {0};
unsigned int pc = 0;
unsigned int halted = 0;
unsigned int last_error = VM_ERR_NONE;
unsigned int program_length = 0;

static void set_vm_error(unsigned int error_code, const char *message) {
    last_error = error_code;
    halted = 1;
    printf("VM ERROR: %s\n", message);
}

static int require_pc_window(unsigned int width) {
    if (pc + width > program_length) {
        char message[128];
        snprintf(
            message,
            sizeof(message),
            "instruction at PC=%u needs %u bytes but program ends at %u",
            pc,
            width,
            program_length
        );
        set_vm_error(VM_ERR_PC_OUT_OF_BOUNDS, message);
        return 0;
    }

    return 1;
}

static int require_program_address(unsigned int address) {
    if (address >= program_length) {
        char message[96];
        snprintf(message, sizeof(message), "jump target %u is outside program length %u", address, program_length);
        set_vm_error(VM_ERR_PC_OUT_OF_BOUNDS, message);
        return 0;
    }

    return 1;
}

static int require_register_index(unsigned int index) {
    if (index >= NUM_REGS) {
        char message[96];
        snprintf(message, sizeof(message), "invalid register index R%u", index);
        set_vm_error(VM_ERR_BAD_REGISTER, message);
        return 0;
    }

    return 1;
}

static int require_memory_address(unsigned int address) {
    if (address >= MEM_SIZE) {
        char message[96];
        snprintf(message, sizeof(message), "invalid memory address %u", address);
        set_vm_error(VM_ERR_BAD_ADDRESS, message);
        return 0;
    }

    return 1;
}

static void exec_instruction(void) {
    unsigned char opcode;

    if (halted) {
        return;
    }

    if (!require_pc_window(1)) {
        return;
    }

    opcode = memory[pc];
    printf("PC: %u, OPCODE: %u\n", pc, opcode);

    switch (opcode) {
      case OP_LOAD: {
        unsigned char r;
        unsigned char v;

        if (!require_pc_window(3)) {
            return;
        }

        r = memory[pc + 1];
        v = memory[pc + 2];
        if (!require_register_index(r)) {
            return;
        }

        registers[r] = v;
        printf("LOAD R%u <- %u\n", r, v);
        pc += 3;
        break;
      }

      case OP_ADD: {
        unsigned char d;
        unsigned char a;
        unsigned char b;

        if (!require_pc_window(4)) {
            return;
        }

        d = memory[pc + 1];
        a = memory[pc + 2];
        b = memory[pc + 3];
        if (!require_register_index(d) ||
            !require_register_index(a) ||
            !require_register_index(b)) {
            return;
        }

        registers[d] = (registers[a] + registers[b]) & 0xFF;
        printf("ADD R%u = R%u + R%u => %u\n", d, a, b, registers[d]);
        pc += 4;
        break;
      }

      case OP_SUB: {
        unsigned char d;
        unsigned char a;
        unsigned char b;

        if (!require_pc_window(4)) {
            return;
        }

        d = memory[pc + 1];
        a = memory[pc + 2];
        b = memory[pc + 3];
        if (!require_register_index(d) ||
            !require_register_index(a) ||
            !require_register_index(b)) {
            return;
        }

        registers[d] = (registers[a] - registers[b]) & 0xFF;
        printf("SUB R%u = R%u - R%u => %u\n", d, a, b, registers[d]);
        pc += 4;
        break;
      }

      case OP_STORE: {
        unsigned char r;
        unsigned char addr;

        if (!require_pc_window(3)) {
            return;
        }

        r = memory[pc + 1];
        addr = memory[pc + 2];
        if (!require_register_index(r) || !require_memory_address(addr)) {
            return;
        }

        memory[addr] = (unsigned char)registers[r];
        printf("STORE R%u (%u) -> mem[%u]\n", r, registers[r], addr);
        pc += 3;
        break;
      }

      case OP_PRINT: {
        unsigned char r;

        if (!require_pc_window(2)) {
            return;
        }

        r = memory[pc + 1];
        if (!require_register_index(r)) {
            return;
        }

        printf("PRINT R%u = %u\n", r, registers[r]);
        pc += 2;
        break;
      }

      case OP_JZ: {
        unsigned char r;
        unsigned char addr;

        if (!require_pc_window(3)) {
            return;
        }

        r = memory[pc + 1];
        addr = memory[pc + 2];
        if (!require_register_index(r) || !require_program_address(addr)) {
            return;
        }

        if (registers[r] == 0) {
          printf("JZ: R%u == 0 -> Jump to %u\n", r, addr);
          pc = addr;
        } else {
          printf("JZ: R%u != 0 -> continue\n", r);
          pc += 3;
        }
        break;
      }

      case OP_JMP: {
        unsigned char addr;

        if (!require_pc_window(2)) {
            return;
        }

        addr = memory[pc + 1];
        if (!require_program_address(addr)) {
            return;
        }

        printf("JMP to %u\n", addr);
        pc = addr;
        break;
      }

      case OP_PIX: {
        unsigned char x;
        unsigned char y;
        unsigned char c;

        if (!require_pc_window(4)) {
            return;
        }

        x = memory[pc + 1];
        y = memory[pc + 2];
        c = memory[pc + 3];
        if (x < SCREEN_WIDTH && y < SCREEN_HEIGHT) {
          unsigned int framebuffer_index = FRAMEBUFFER_START + y * SCREEN_WIDTH + x;
          if (!require_memory_address(framebuffer_index)) {
              return;
          }
          memory[framebuffer_index] = c;
        }
        printf("PIX -> (%u,%u)=color %u\n", x, y, c);
        pc += 4;
        break;
      }

      case OP_PIXR: {
        unsigned char rx;
        unsigned char ry;
        unsigned char rc;
        unsigned int x;
        unsigned int y;
        unsigned int c;

        if (!require_pc_window(4)) {
            return;
        }

        rx = memory[pc + 1];
        ry = memory[pc + 2];
        rc = memory[pc + 3];
        if (!require_register_index(rx) ||
            !require_register_index(ry) ||
            !require_register_index(rc)) {
            return;
        }

        x = registers[rx];
        y = registers[ry];
        c = registers[rc];
        if (x < SCREEN_WIDTH && y < SCREEN_HEIGHT) {
          unsigned int framebuffer_index = FRAMEBUFFER_START + y * SCREEN_WIDTH + x;
          if (!require_memory_address(framebuffer_index)) {
              return;
          }
          memory[framebuffer_index] = (unsigned char)c;
        }
        printf("PIXR R%u,R%u,R%u -> (%u,%u)=color %u\n", rx, ry, rc, x, y, c);
        pc += 4;
        break;
      }

      case OP_HALT:
        printf("HALT\n");
        halted = 1;
        break;

      default: {
        char message[96];
        snprintf(message, sizeof(message), "unknown opcode 0x%02X at PC=%u", opcode, pc);
        set_vm_error(VM_ERR_BAD_OPCODE, message);
        break;
      }
    }
}

EMSCRIPTEN_KEEPALIVE
unsigned char *get_memory(void) {
    return memory;
}

EMSCRIPTEN_KEEPALIVE
unsigned int get_register(unsigned int index) {
    if (index >= NUM_REGS) {
        return 0;
    }

    return registers[index];
}

EMSCRIPTEN_KEEPALIVE
void step_vm(void) {
    exec_instruction();
}

EMSCRIPTEN_KEEPALIVE
unsigned int get_pc(void) {
    return pc;
}

EMSCRIPTEN_KEEPALIVE
void reset_vm(void) {
    pc = 0;
    halted = 0;
    last_error = VM_ERR_NONE;
    memset(registers, 0, sizeof(registers));
}

EMSCRIPTEN_KEEPALIVE
unsigned int get_halted(void) {
    return halted;
}

EMSCRIPTEN_KEEPALIVE
unsigned int get_last_error(void) {
    return last_error;
}

EMSCRIPTEN_KEEPALIVE
void set_program_length(unsigned int length) {
    if (length > MEM_SIZE) {
        program_length = MEM_SIZE;
    } else {
        program_length = length;
    }
}

EMSCRIPTEN_KEEPALIVE
unsigned int get_program_length(void) {
    return program_length;
}

void print_registers(void) {
    unsigned int index;

    for (index = 0; index < NUM_REGS; index++) {
        printf("R%u = %u\n", index, registers[index]);
    }
}

void run_vm(void) {
    reset_vm();
    while (!halted) {
        exec_instruction();
    }
}

#ifdef TEST_VM
#include <assert.h>

static void load_test_program(const unsigned char *program, unsigned int length) {
    memset(memory, 0, sizeof(memory));
    reset_vm();
    set_program_length(length);
    memcpy(memory, program, length);
}

int main(void) {
    unsigned char arithmetic_program[] = {
        OP_LOAD,  0, 42,
        OP_STORE, 0, 0x20,
        OP_LOAD,  1, 7,
        OP_ADD,   2, 0, 1,
        OP_STORE, 2, 0x21,
        OP_HALT
    };
    unsigned char pixel_program[] = {
        OP_PIX, 1, 2, 3,
        OP_HALT
    };
    unsigned char invalid_register_program[] = {
        OP_LOAD, 8, 1,
        OP_HALT
    };
    unsigned char truncated_program[] = {
        OP_ADD, 0, 1
    };
    unsigned char bad_jump_program[] = {
        OP_JMP, 8
    };
    unsigned char overflow_program[] = {
        OP_LOAD, 0, 255,
        OP_LOAD, 1, 1,
        OP_ADD, 2, 0, 1,
        OP_HALT
    };
    unsigned char underflow_program[] = {
        OP_LOAD, 0, 5,
        OP_LOAD, 1, 7,
        OP_SUB, 2, 0, 1,
        OP_HALT
    };

    printf("\n=== Running VM Test Suite ===\n");

    load_test_program(arithmetic_program, sizeof(arithmetic_program));
    run_vm();
    assert(registers[0] == 42);
    assert(memory[0x20] == 42);
    assert(registers[1] == 7);
    assert(registers[2] == 49);
    assert(memory[0x21] == 49);
    assert(get_halted() == 1);
    assert(get_last_error() == VM_ERR_NONE);
    assert(get_pc() == sizeof(arithmetic_program) - 1);

    load_test_program(pixel_program, sizeof(pixel_program));
    step_vm();
    assert(memory[FRAMEBUFFER_START + 2 * SCREEN_WIDTH + 1] == 3);
    assert(get_halted() == 0);
    step_vm();
    assert(get_halted() == 1);
    assert(get_last_error() == VM_ERR_NONE);

    load_test_program(invalid_register_program, sizeof(invalid_register_program));
    step_vm();
    assert(get_halted() == 1);
    assert(get_last_error() == VM_ERR_BAD_REGISTER);

    load_test_program(truncated_program, sizeof(truncated_program));
    step_vm();
    assert(get_halted() == 1);
    assert(get_last_error() == VM_ERR_PC_OUT_OF_BOUNDS);

    load_test_program(bad_jump_program, sizeof(bad_jump_program));
    step_vm();
    assert(get_halted() == 1);
    assert(get_last_error() == VM_ERR_PC_OUT_OF_BOUNDS);

    load_test_program(overflow_program, sizeof(overflow_program));
    run_vm();
    assert(registers[2] == 0);
    assert(get_last_error() == VM_ERR_NONE);

    load_test_program(underflow_program, sizeof(underflow_program));
    run_vm();
    assert(registers[2] == 254);
    assert(get_last_error() == VM_ERR_NONE);

    printf("All VM assertions passed.\n");
    return 0;
}
#endif
