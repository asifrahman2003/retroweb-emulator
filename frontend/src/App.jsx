import { useEffect, useState } from 'react';
import { loadVM } from './wasm/loadVM';
import { assemble } from './assembler';
import Navbar from './components/Navbar';
import MemoryViewer from './components/MemoryViewer';
import Footer from './components/Footer';
import { motion, AnimatePresence } from 'framer-motion';
import Editor from '@monaco-editor/react';


function App() {
  const [vmInstance, setVmInstance] = useState(null);
  const [input, setInput] = useState('');
  const [isAssembly, setIsAssembly] = useState(true);
  const [output, setOutput] = useState('');
  const [easterEggActive, setEasterEggActive] = useState(false);

  useEffect(() => {
  const script = document.createElement('script');
  script.src = '/vm.js';
  script.onload = async () => {
    const Module = await loadVM();
    console.log('✅ VM loaded');
    setVmInstance(Module);

    // ✅ Set default code if empty
    setInput(`LOAD R1 5\nADD R2 R1 R1\nPRINT R2\nHALT`);
  };
  document.body.appendChild(script);
}, []);

  const handleRunVM = () => {
  if (input.trim().toUpperCase() === 'HALT\nHALT') {
    setEasterEggActive(true);
    setTimeout(() => setEasterEggActive(false), 4000);
    return;
  }

  if (!vmInstance || typeof vmInstance._run_vm !== 'function') {
    setOutput("❌ VM not ready.");
    return;
  }

  const heap = vmInstance.HEAPU8 || vmInstance.HEAP8;
  if (!heap || !heap.buffer) {
    setOutput("❌ HEAP memory not initialized.");
    return;
  }

  let bytes = [];
  try {
    bytes = isAssembly
      ? assemble(input)
      : input.trim().split(/\s+/).map(Number);

    console.log("🧠 Written Bytecode to VM memory:", bytes);

    const memPtr = vmInstance._get_memory();
    const heapU8 = new Uint8Array(vmInstance.HEAPU8.buffer);
    heapU8.fill(0, memPtr, memPtr + 256);
    heapU8.set(bytes, memPtr);
  } catch (e) {
    setOutput("❌ Assembly Error: " + e.message);
    return;
  }

  let buffer = '';
  const oldLog = console.log;
  console.log = (...args) => {
    buffer += args.join(' ') + '\n';
    oldLog(...args);
  };

  try {
    vmInstance._run_vm();
  } catch (e) {
    console.log = oldLog;
    setOutput("❌ Runtime Error: " + e.message);
    return;
  }

  console.log = oldLog;

  const registerDump = Array.from({ length: 8 }, (_, i) =>
    `R${i} = ${vmInstance._get_register(i)}`
  ).join('\n');

  const cleanedBuffer = buffer.trim();
  const finalOutput = cleanedBuffer
    ? `${cleanedBuffer}\n\n${registerDump}`
    : registerDump;

  setOutput(finalOutput);
};







  return (
    <>
      <Navbar />
      <main className="min-h-screen w-full bg-[var(--bg)] text-white px-4 md:px-8 py-12 font-mono">
        <h1 className="text-4xl font-bold text-orange-500 mb-8 text-center tracking-tight">
          RetroWeb Emulator
        </h1>

        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-10">
          {/* Editor Panel */}
          <div className="space-y-4 bg-[var(--panel)] p-6 rounded-xl border border-white/10 shadow-lg">
            <label htmlFor="assemblyToggle" className="flex items-center text-sm gap-2 text-gray-300">
              <input
                id="assemblyToggle"
                type="checkbox"
                checked={isAssembly}
                onChange={() => setIsAssembly(!isAssembly)}
              />
              Use Assembly Syntax
            </label>

            <Editor
  height="240px"
  defaultLanguage="plaintext"
  defaultValue={isAssembly
    ? "LOAD R1 5\nADD R2 R1 R1\nPRINT R2\nHALT"
    : "0 1 5 2 2 1 1 5 255"}
  value={input}
  onChange={(value) => setInput(value || "")}
  theme="vs-dark"
  options={{
    fontSize: 14,
    fontFamily: 'monospace',
    minimap: { enabled: false },
    lineNumbers: "on",
    scrollBeyondLastLine: false,
    wordWrap: "on",
  }}
/>

            <div className="flex space-x-4">
              <button
                className="bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white px-4 py-2 rounded-lg shadow transition"
                onClick={handleRunVM}
              >
                Run VM
              </button>
              <button
                className="bg-gray-800 hover:bg-gray-700 text-gray-200 px-4 py-2 rounded-lg border border-gray-600 shadow transition"
                onClick={() => {
                  setInput('');
                  setOutput('');
                }}
              >
                Reset
              </button>
            </div>
          </div>

          {/* Output & Memory */}
          <div className="space-y-6">
            <section className="bg-[var(--panel)] p-6 rounded-xl border border-white/10 shadow-lg">
              <h2 className="text-lg font-semibold text-orange-300 mb-2">Output</h2>
              <pre className="bg-black p-4 rounded text-green-400 text-sm whitespace-pre-wrap min-h-[120px]">
  {output}
</pre>
            </section>

            {vmInstance && <MemoryViewer vmInstance={vmInstance} />}

            <p className="text-gray-500 text-xs mt-2">
              VM Status: {vmInstance ? 'Ready' : 'Loading...'}
            </p>
          </div>
        </div>
      </main>

      <AnimatePresence>
        {easterEggActive && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ type: 'spring', stiffness: 200, damping: 20 }}
          >
            <motion.div
  className="bg-gradient-to-r from-black via-zinc-900 to-black border border-orange-400 text-orange-300 font-mono text-base px-6 py-4 rounded-xl shadow-xl"
  initial={{ rotate: -2 }}
  animate={{ rotate: [2, -2, 2], transition: { repeat: Infinity, duration: 0.8 } }}
>
  <span className="flex items-center gap-2">
    Debug Mode Activated — <span className="font-bold text-orange-400">RETRO CORE UNLOCKED</span>
  </span>
</motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />
    </>
  );
}

export default App;
