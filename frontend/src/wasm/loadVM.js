export async function loadVM(moduleOverrides = {}) {
  const instance = await window.createVM(moduleOverrides);
  return instance;
}
