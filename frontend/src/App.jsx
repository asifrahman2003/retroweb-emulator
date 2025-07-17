import { useEffect, useState } from 'react';
import { loadVM } from './wasm/loadVM';
// import reactLogo from './assets/react.svg';
// import viteLogo from '/vite.svg';
import { assemble } from './assembler';


function App() {
  const [count, setCount] = useState(0);
  const [vmInstance, setVmInstance] = useState(null);

  useEffect(() => {
    // Dynamically load the compiled WebAssembly runtime (vm.js)
    const script = document.createElement('script');
    script.src = '/vm.js';
    script.onload = async () => {
  const Module = await loadVM();
  console.log('✅ VM loaded');
  setVmInstance(Module);
};

    document.body.appendChild(script);
  }, []);

const [input, setInput] = useState('');
const [isAssembly, setIsAssembly] = useState(true);

const [output, setOutput] = useState('');

const handleRunVM = () => {
  if (!vmInstance || typeof vmInstance._run_vm !== 'function') {
    setOutput("❌ VM not ready.");
    return;
  }

  const heap = vmInstance.HEAPU8 || vmInstance.HEAP8;
  if (!heap || !heap.buffer) {
    setOutput("❌ HEAP memory not initialized.");
    return;
  }

  // ✅ Convert input to bytes (via assembler or manual mode)
  let bytes = [];
  try {
    bytes = isAssembly
      ? assemble(input)
      : input.trim().split(/\s+/).map(Number);
  } catch (e) {
    setOutput("❌ Assembly Error: " + e.message);
    return;
  }

  const memPtr = vmInstance._get_memory();
  const heapU8 = new Uint8Array(vmInstance.HEAPU8.buffer);
  heapU8.set(bytes, memPtr);

  // 🧪 Debug logs
  console.log("🧪 VM instance keys:", Object.keys(vmInstance));
  console.log("🧾 Assembled bytecode:", bytes);
  console.log("📌 Memory address (memPtr):", memPtr);
  console.log("📦 Heap snapshot:", Array.from(heapU8.slice(memPtr, memPtr + bytes.length)));

  // 🔁 Capture output
  let buffer = '';
  const oldLog = console.log;
  console.log = (...args) => {
    buffer += args.join(' ') + '\n';
    oldLog(...args);
  };

  try {
    vmInstance._run_vm();
    const result = vmInstance._get_register(2); // ✅ Example: Show R2
    setOutput(`✅ R2 = ${result}`);
  } catch (e) {
    setOutput("❌ Runtime Error: " + e.message);
  }

  console.log = oldLog;
};


  return (
    <main className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-8 space-y-6">
  <h1 className="text-3xl font-bold text-orange-400">🚀 RetroWeb Emulator</h1>
<div className="text-sm text-gray-300 space-x-4">
  <label>
    <input
      type="checkbox"
      checked={isAssembly}
      onChange={() => setIsAssembly(!isAssembly)}
      className="mr-2"
    />
    Use Assembly Syntax
  </label>
</div>


  <textarea
    className="w-full max-w-xl h-48 p-3 rounded bg-gray-800 text-sm font-mono text-green-300 outline-none"
    placeholder="Enter bytecode manually, e.g.\n0 0 5 0 1 7 1 0 1 2 2"
    value={input}
    onChange={(e) => setInput(e.target.value)}
  />

  <button
    className="bg-orange-600 hover:bg-orange-700 px-4 py-2 rounded shadow"
    onClick={handleRunVM}
  >
    Run VM
  </button>

  <pre className="w-full max-w-xl bg-black p-3 rounded text-green-400 text-sm whitespace-pre-wrap">
  {output}
  {vmInstance && Array.from({ length: 8 }, (_, i) =>
    `R${i} = ${vmInstance._get_register(i)}`
  ).join('\n')}
</pre>

{vmInstance && (
  <details className="w-full max-w-xl bg-gray-800 text-green-300 p-3 rounded mt-2 text-sm">
    <summary className="cursor-pointer">🧠 View Memory</summary>
    <pre>
      {Array.from(
        new Uint8Array(vmInstance.HEAPU8.buffer).slice(
          vmInstance._get_memory(),
          vmInstance._get_memory() + 32
        )
      ).join(' ')}
    </pre>
  </details>
)}


  <p className="text-gray-500 text-xs">
    WebAssembly VM Status: {vmInstance ? '✅ Loaded' : '⏳ Loading...'}
  </p>
</main>
  );
}

export default App;
