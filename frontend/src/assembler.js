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

const operandCounts = {
  LOAD: 2,
  ADD: 3,
  SUB: 3,
  STORE: 2,
  PRINT: 1,
  JZ: 2,
  JMP: 1,
  PIX: 3,
  PIXR: 3,
  HALT: 0,
};

function normalizeLine(line) {
  return line.replace(/\/\/.*$/, '').trim();
}

function tokenizeInstruction(line) {
  return line.replaceAll(',', ' ').trim().split(/\s+/).filter(Boolean);
}

function splitLabels(line) {
  const labels = [];
  let remainder = line;

  while (true) {
    const match = remainder.match(/^([A-Za-z_][A-Za-z0-9_]*):/);
    if (!match) {
      break;
    }

    labels.push(match[1].toUpperCase());
    remainder = remainder.slice(match[0].length).trim();
  }

  return { labels, instruction: remainder };
}

function parseRegister(tok) {
  const t = tok.toUpperCase();
  if (!/^R[0-7]$/.test(t)) {
    throw new Error(`Invalid register: ${tok}`);
  }
  return Number(t.slice(1));
}

function assertByteRange(value, label) {
  if (!Number.isInteger(value) || value < 0 || value > 255) {
    throw new Error(`${label} must be between 0 and 255`);
  }
  return value;
}

function parseValue(tok, labels) {
  // hex literal?  (0x…)
  if (/^0x[0-9a-f]+$/i.test(tok)) {
    return assertByteRange(parseInt(tok, 16), `Value ${tok}`);
  }
  // decimal literal?
  if (/^\d+$/.test(tok)) {
    return assertByteRange(Number(tok), `Value ${tok}`);
  }
  // otherwise it must be a label
  const label = tok.toUpperCase();
  if (!(label in labels)) {
    throw new Error(`Unknown label: ${label}`);
  }
  return labels[label];
}

function getInstructionSize(op, code) {
  if (code === opcodeMap.LOAD) return 3;
  if (code === opcodeMap.ADD || code === opcodeMap.SUB) return 4;
  if (code === opcodeMap.STORE) return 3;
  if (code === opcodeMap.PRINT) return 2;
  if (code === opcodeMap.JZ) return 3;
  if (code === opcodeMap.JMP) return 2;
  if (code === opcodeMap.PIX) return 4;
  if (code === opcodeMap.PIXR) return 4;
  if (code === opcodeMap.HALT) return 1;

  throw new Error(`Unhandled opcode size: ${op}`);
}

function validateOperandCount(op, parts, lineNumber) {
  const expected = operandCounts[op];
  const actual = parts.length - 1;

  if (expected == null) {
    throw new Error(`Unknown opcode: ${op}`);
  }

  if (actual !== expected) {
    const operandLabel = expected === 1 ? 'operand' : 'operands';
    throw new Error(
      `${op} expects ${expected} ${operandLabel}, got ${actual} on line ${lineNumber}`,
    );
  }
}

export function assembleProgram(asmCode) {
  const lines = asmCode
    .split('\n')
    .map((rawLine, index) => ({
      lineNumber: index + 1,
      text: normalizeLine(rawLine),
    }))
    .filter(({ text }) => text.length);

  const labels = {};
  const sourceMap = {};
  let pc = 0;

  // PASS 1: record label → PC
  for (const line of lines) {
    const { labels: lineLabels, instruction } = splitLabels(line.text);

    for (const label of lineLabels) {
      if (label in labels) {
        throw new Error(`Duplicate label: ${label}`);
      }
      labels[label] = pc;
    }

    if (!instruction) {
      continue;
    }

    const [op] = tokenizeInstruction(instruction);
    const upperOp = op.toUpperCase();
    const code = opcodeMap[upperOp];
    if (code == null) throw new Error(`Unknown opcode: ${upperOp}`);

    pc += getInstructionSize(upperOp, code);
  }

  // PASS 2: emit bytecode
  const bytecode = [];
  for (const line of lines) {
    const { instruction } = splitLabels(line.text);
    if (!instruction) continue;

    const parts = tokenizeInstruction(instruction);
    const op = parts[0].toUpperCase();
    const code = opcodeMap[op];
    validateOperandCount(op, parts, line.lineNumber);
    sourceMap[bytecode.length] = line.lineNumber;
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

  return {
    bytecode,
    sourceMap,
    labels,
    diagnostics: [],
    profileVersion: 1,
  };
}

export function assemble(asmCode) {
  return assembleProgram(asmCode).bytecode;
}
