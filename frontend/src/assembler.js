// frontend/src/assembler.js

export const opcodeMap = {
  LOAD: 1,
  ADD: 2,
  SUB: 3,
  PRINT: 5,
  JZ: 6,
  JMP: 7,
  HALT: 255,
};

// Helper functions
function parseRegister(token) {
  if (!/^R\d$/.test(token.toUpperCase())) {
    throw new Error(`Invalid register: ${token}`);
  }
  return Number(token.slice(1));
}

function parseValue(token, labels) {
  if (/^\d+$/.test(token)) return Number(token);
  const label = token.toUpperCase();
  if (!(label in labels)) throw new Error(`Unknown label: ${label}`);
  return labels[label];
}

export function assemble(asmCode) {
  const lines = asmCode.trim().split('\n').map(line => line.trim());
  const labels = {};
  const bytecode = [];

  // --- PASS 1: Find labels and assign PC values ---
  let pc = 0;
  for (let line of lines) {
    if (line === '' || line.startsWith('//')) continue;

    if (line.endsWith(':')) {
      const label = line.slice(0, -1).toUpperCase();
      labels[label] = pc;
    } else {
      const [op] = line.split(/\s+/);
      const opcode = opcodeMap[op.toUpperCase()];
      if (opcode === undefined) throw new Error(`Unknown opcode: ${op}`);

      // Determine instruction size
      if (opcode === 1) pc += 3; // LOAD
      else if (opcode === 2 || opcode === 3) pc += 4; // ADD / SUB
      else if (opcode === 4) pc += 2; // PRINT
      else if (opcode === 6) pc += 3; // JZ
      else if (opcode === 7) pc += 2; // JMP
      else if (opcode === 255) pc += 1; // HALT
    }
  }

  // --- PASS 2: Generate bytecode with label resolution ---
  for (let line of lines) {
    if (line === '' || line.startsWith('//') || line.endsWith(':')) continue;

    const parts = line.split(/\s+/);
    const op = parts[0].toUpperCase();
    const opcode = opcodeMap[op];
    if (opcode === undefined) throw new Error(`Unknown opcode: ${op}`);

    bytecode.push(opcode);

    if (opcode === 1) {
      // LOAD Rn val
      bytecode.push(parseRegister(parts[1]));
      bytecode.push(parseValue(parts[2], labels));
        } else if (opcode === 2 || opcode === 3) {
      // ADD / SUB dest src1 src2
      bytecode.push(parseRegister(parts[1])); // dest
      bytecode.push(parseRegister(parts[2])); // src1
      bytecode.push(parseRegister(parts[3])); // src2
    } else if (opcode === 5) {
      // PRINT Rn
      bytecode.push(parseRegister(parts[1]));
    } else if (opcode === 6) {
      // JZ Rn label
      bytecode.push(parseRegister(parts[1]));
      bytecode.push(parseValue(parts[2], labels));
    } else if (opcode === 7) {
      // JMP label
      bytecode.push(parseValue(parts[1], labels));
    }
  }

  return bytecode;
}
