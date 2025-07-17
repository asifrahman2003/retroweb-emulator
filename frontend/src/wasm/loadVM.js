export async function loadVM() {
  const instance = await window.createVM(); // this returns the actual module
  return instance;
}
