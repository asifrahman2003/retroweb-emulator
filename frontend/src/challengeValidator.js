function validateRegisters(expectedRegisters = {}, registerValues = []) {
  return Object.entries(expectedRegisters).map(([registerIndex, expectedValue]) => {
    const index = Number(registerIndex);
    const actualValue = registerValues[index];
    const passed = actualValue === expectedValue;

    return {
      label: `R${index} should equal ${expectedValue}`,
      passed,
      actual: actualValue,
      expected: expectedValue,
    };
  });
}

function validateMemory(expectedMemory = {}, memorySnapshot = new Uint8Array()) {
  return Object.entries(expectedMemory).map(([address, expectedValue]) => {
    const index = Number(address);
    const actualValue = memorySnapshot[index];
    const passed = actualValue === expectedValue;

    return {
      label: `Memory[0x${index.toString(16).padStart(4, '0').toUpperCase()}] should equal ${expectedValue}`,
      passed,
      actual: actualValue,
      expected: expectedValue,
    };
  });
}

function validateRuntime(expectedRuntime = {}, vmRuntimeState = {}) {
  return Object.entries(expectedRuntime).map(([field, expectedValue]) => {
    const actualValue = vmRuntimeState[field];
    const passed = actualValue === expectedValue;
    const label = field === 'lastError'
      ? `VM error code should equal ${expectedValue}`
      : `VM ${field} should equal ${String(expectedValue)}`;

    return {
      label,
      passed,
      actual: actualValue,
      expected: expectedValue,
    };
  });
}

export function evaluateChallenge(challenge, executionState) {
  if (!challenge) {
    return null;
  }

  const registerChecks = validateRegisters(
    challenge.checks?.registers,
    executionState.registerValues,
  );
  const memoryChecks = validateMemory(
    challenge.checks?.memory,
    executionState.memorySnapshot,
  );
  const runtimeChecks = validateRuntime(
    challenge.checks?.runtime,
    executionState.vmRuntimeState,
  );
  const checks = [...registerChecks, ...memoryChecks, ...runtimeChecks];
  const passed = checks.length > 0 && checks.every((check) => check.passed);

  return {
    passed,
    checks,
    summary: passed
      ? 'Challenge complete.'
      : 'Challenge not complete yet. Compare the failed checks with the current VM state.',
  };
}
