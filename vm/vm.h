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
#define OP_PRINT  5
#define OP_JZ     6
#define OP_JMP    7
#define OP_PIX    8  // immediate x,y,color
#define OP_PIXR   9  // register-based x,y,color
#define OP_HALT 255

extern unsigned char memory[MEM_SIZE];
extern unsigned int  registers[NUM_REGS];
extern unsigned int  pc;

// Core batch API
void           run_vm(void);
unsigned char* get_memory(void);
unsigned int   get_register(unsigned int index);
void           print_registers(void);

// ==== New single-step / debug API ====
EMSCRIPTEN_KEEPALIVE void         step_vm(void);
EMSCRIPTEN_KEEPALIVE unsigned int get_pc(void);
EMSCRIPTEN_KEEPALIVE void         reset_vm(void);

#endif // VM_H
// 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