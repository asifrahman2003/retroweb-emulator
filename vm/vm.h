#ifndef VM_H
#define VM_H

#if defined(__EMSCRIPTEN__)
  #include <emscripten/emscripten.h>
#else
  // Stub out the macro so IntelliSense (and non-EMCC builds) are happy
  #define EMSCRIPTEN_KEEPALIVE
#endif  // for EMSCRIPTEN_KEEPALIVE

// screen is 32×32 = 1024 pixels
#define SCREEN_WIDTH     32
#define SCREEN_HEIGHT    32
#define FRAMEBUFFER_SIZE (SCREEN_WIDTH * SCREEN_HEIGHT)

// place framebuffer at 0x400 (1024), so total MEM_SIZE = 1024 + 1024
#define FRAMEBUFFER_START 0x400
#define MEM_SIZE          (FRAMEBUFFER_START + FRAMEBUFFER_SIZE)

#define NUM_REGS         8

// Decimal opcodes
#define OP_LOAD   1
#define OP_ADD    2
#define OP_SUB    3
#define OP_STORE 4  // store R to memory
#define OP_PRINT  5
#define OP_JZ     6
#define OP_JMP    7
#define OP_PIX    8  // immediate x,y,color
#define OP_PIXR   9  // register-based x,y,color
#define OP_HALT 255

#define VM_ERR_NONE              0
#define VM_ERR_PC_OUT_OF_BOUNDS  1
#define VM_ERR_BAD_REGISTER      2
#define VM_ERR_BAD_ADDRESS       3
#define VM_ERR_BAD_OPCODE        4

extern unsigned char memory[MEM_SIZE];
extern unsigned int  registers[NUM_REGS]; // Values are normalized to 8-bit arithmetic results.
extern unsigned int  pc;
extern unsigned int  halted;
extern unsigned int  last_error;
extern unsigned int  program_length;

// Core batch API
void           run_vm(void);
unsigned char* get_memory(void);
unsigned int   get_register(unsigned int index);
void           print_registers(void);

// ==== New single-step / debug API ====
EMSCRIPTEN_KEEPALIVE void         step_vm(void);
EMSCRIPTEN_KEEPALIVE unsigned int get_pc(void);
EMSCRIPTEN_KEEPALIVE void         reset_vm(void);
EMSCRIPTEN_KEEPALIVE unsigned int get_halted(void);
EMSCRIPTEN_KEEPALIVE unsigned int get_last_error(void);
EMSCRIPTEN_KEEPALIVE void         set_program_length(unsigned int length);
EMSCRIPTEN_KEEPALIVE unsigned int get_program_length(void);

#endif // VM_H
