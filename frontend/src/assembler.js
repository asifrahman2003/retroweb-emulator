// frontend/src/assembler.js

export const opcodeMap = {
  LOAD:  1,
  ADD:   2,
  SUB:   3,
  STORE: 4,
  PRINT: 5,
  JZ:    6,
  JMP:   7,
  PIX:   8,   // draw with immediate x,y,color
  PIXR:  9,   // draw with register x,y,color
  HALT: 255,
};

function parseRegister(tok) {
  const t = tok.toUpperCase();
  if (!/^R[0-7]$/.test(t)) {
    throw new Error(`Invalid register: ${tok}`);
  }
  return Number(t.slice(1));
}

function parseValue(tok, labels) {
  // hex literal?  (0x…)
  if (/^0x[0-9a-f]+$/i.test(tok)) {
    return parseInt(tok, 16)
  }
  // decimal literal?
  if (/^\d+$/.test(tok)) {
    return Number(tok)
  }
  // otherwise it must be a label
  const label = tok.toUpperCase()
  if (!(label in labels)) {
    throw new Error(`Unknown label: ${label}`)
  }
  return labels[label]
}


export function assemble(asmCode) {
  const lines = asmCode
    .split('\n')
    .map(l => l.replace(/\/\/.*$/, '').trim())  // strip comments
    .filter(l => l.length);

  const labels = {};
  let pc = 0;

  // PASS 1: record label → PC
  for (const line of lines) {
    if (line.endsWith(':')) {
      labels[line.slice(0, -1).toUpperCase()] = pc;
    } else {
      const op = line.split(/\s+/)[0].toUpperCase();
      const code = opcodeMap[op];
      if (code == null) throw new Error(`Unknown opcode: ${op}`);

      // instruction size
      if (code === opcodeMap.LOAD)           pc += 3;
      else if (code === opcodeMap.ADD ||
               code === opcodeMap.SUB)       pc += 4;
      else if (code === opcodeMap.STORE)     pc += 3;
      else if (code === opcodeMap.PRINT)     pc += 2;
      else if (code === opcodeMap.JZ)        pc += 3;
      else if (code === opcodeMap.JMP)       pc += 2;
      else if (code === opcodeMap.PIX)       pc += 4;
      else if (code === opcodeMap.PIXR)      pc += 4;
      else if (code === opcodeMap.HALT)      pc += 1;
      else throw new Error(`Unhandled opcode size: ${op}`);
    }
  }

  // PASS 2: emit bytecode
  const bytecode = [];
  for (const line of lines) {
    if (line.endsWith(':')) continue;
    const parts = line.split(/\s+/);
    const op = parts[0].toUpperCase();
    const code = opcodeMap[op];
    bytecode.push(code);

    switch (code) {
      case opcodeMap.LOAD:
        bytecode.push(parseRegister(parts[1]));
        bytecode.push(parseValue(parts[2], labels));
        break;

      case opcodeMap.ADD:
      case opcodeMap.SUB:
        bytecode.push(parseRegister(parts[1]));
        bytecode.push(parseRegister(parts[2]));
        bytecode.push(parseRegister(parts[3]));
        break;
      case opcodeMap.STORE:
        bytecode.push(parseRegister(parts[1]));
        bytecode.push(parseValue(parts[2], labels));
        break;

      case opcodeMap.PRINT:
        bytecode.push(parseRegister(parts[1]));
        break;

      case opcodeMap.JZ:
        bytecode.push(parseRegister(parts[1]));
        bytecode.push(parseValue(parts[2], labels));
        break;

      case opcodeMap.JMP:
        bytecode.push(parseValue(parts[1], labels));
        break;

      case opcodeMap.PIX:
        // PIX x y color (all immediates)
        bytecode.push(parseValue(parts[1], labels));
        bytecode.push(parseValue(parts[2], labels));
        bytecode.push(parseValue(parts[3], labels));
        break;

      case opcodeMap.PIXR:
        // PIXR Rx Ry Rc (all registers)
        bytecode.push(parseRegister(parts[1]));
        bytecode.push(parseRegister(parts[2]));
        bytecode.push(parseRegister(parts[3]));
        break;

      case opcodeMap.HALT:
        // no operands
        break;

      default:
        throw new Error(`Unhandled opcode in assembler: ${code}`);
    }
  }

  return bytecode;
}
