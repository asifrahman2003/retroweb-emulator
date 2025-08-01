// src/RetroVM.js
export default class RetroVM {
  /**
   * @param {() => Promise<Module>} createModule
   */
  constructor(createModule) {
    // When createModule() resolves, we have the Emscripten Module
    this.ready = createModule().then((Module) => {
      this._mod   = Module;
      // Wrap the C functions
      this._step       = Module.cwrap('step_vm',   null,    []);
      this._getPc      = Module.cwrap('get_pc',    'number', []);
      this._reset      = Module.cwrap('reset_vm',  null,    []);
      this._run        = Module.cwrap('run_vm',    null,    []);
      this._getMemPtr  = Module.cwrap('get_memory','number', []);
      this._getReg     = Module.cwrap('get_register','number',['number']);
    });
  }

  async step() {
    await this.ready;
    this._step();
    return this.getPC();
  }

  async run() {
    await this.ready;
    this._run();
  }

  async reset() {
    await this.ready;
    this._reset();
  }

  async getPC() {
    await this.ready;
    return this._getPc();
  }

  async getRegisters() {
    await this.ready;
    const regs = [];
    for (let i = 0; i < 8; i++) {
      regs.push(this._getReg(i));
    }
    return regs;
  }

  async getMemory() {
    await this.ready;
    const ptr = this._getMemPtr();
    return this._mod.HEAPU8.subarray(ptr, ptr + (/* MEM_SIZE */ 0x800));
  }
}
