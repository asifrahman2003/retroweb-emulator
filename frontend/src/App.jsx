// src/App.jsx
import { useEffect, useState } from 'react';
import { loadVM } from './wasm/loadVM';
import { assemble } from './assembler';
import Navbar from './components/Navbar';
import MemoryViewer from './components/MemoryViewer';
import CanvasOutput from './components/CanvasOutput';
import Footer from './components/Footer';
import { motion, AnimatePresence } from 'framer-motion';
import Editor from '@monaco-editor/react';

function App() {
  const [vmInstance, setVmInstance]         = useState(null);
  const [input, setInput]                   = useState('');
  const [isAssembly, setIsAssembly]         = useState(true);
  const [output, setOutput]                 = useState('');
  const [easterEggActive, setEasterEggActive] = useState(false);
  const [runCount, setRunCount]             = useState(0);

  // load wasm glue & clear memory once
  useEffect(() => {
    const script = document.createElement('script');
    script.src = '/vm.js';
    script.onload = async () => {
      const Module = await loadVM();
      console.log('✅ VM loaded');
      setVmInstance(Module);

      // default program
      setInput(`LOAD R1 5\nADD R2 R1 R1\nPRINT R2\nHALT`);

      // clear code + framebuffer (2 KB)
      const ptr  = Module._get_memory();
      const heap = new Uint8Array(Module.HEAPU8.buffer);
      heap.fill(0, ptr, ptr + 2048);
      console.log('🧹 VM memory cleared');
    };
    document.body.appendChild(script);
  }, []);

  const handleRunVM = () => {
    // Easter-egg: HALT twice
    if (input.trim().toUpperCase() === 'HALT\nHALT') {
      setEasterEggActive(true);
      setTimeout(() => setEasterEggActive(false), 4000);
      return;
    }

    if (!vmInstance?._run_vm) {
      setOutput('❌ VM not ready.');
      return;
    }

    // assemble
    let bytes = [];
    try {
      bytes = isAssembly
        ? assemble(input)
        : input.trim().split(/\s+/).map(Number);
    } catch (e) {
      setOutput('❌ Assembly Error: ' + e.message);
      return;
    }

    console.log('🧠 Writing bytecode:', bytes);
    const ptr   = vmInstance._get_memory();
    const heapU = new Uint8Array(vmInstance.HEAPU8.buffer);
    heapU.fill(0, ptr, ptr + 2048);
    heapU.set(bytes, ptr);

    // capture VM console.log
    let buf = '';
    const realLog = console.log;
    console.log = (...args) => {
      buf += args.join(' ') + '\n';
      realLog(...args);
    };

    // run
    try {
      vmInstance._run_vm();
    } catch (e) {
      console.log = realLog;
      setOutput('❌ Runtime Error: ' + e.message);
      return;
    }
    console.log = realLog;

    // register dump
    const regs = Array.from({ length: 8 }, (_, i) =>
      `R${i} = ${vmInstance._get_register(i)}`
    ).join('\n');

    const out = buf.trim();
    setOutput(out ? `${out}\n\n${regs}` : regs);

    // bump runCount → forces MemoryViewer & CanvasOutput to refresh
    setRunCount(c => c + 1);
  };

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[var(--bg)] text-white px-4 md:px-8 py-12 font-mono">
        <h1 className="text-4xl font-bold text-orange-500 mb-8 text-center">
          RetroWeb Emulator
        </h1>
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-10">
          {/* Editor */}
          <div className="space-y-4 bg-[var(--panel)] p-6 rounded-xl border border-white/10 shadow-lg">
            <label className="flex items-center text-gray-300 gap-2 text-sm">
              <input
                type="checkbox"
                checked={isAssembly}
                onChange={() => setIsAssembly(a => !a)}
              />
              Use Assembly Syntax
            </label>
            <Editor
              height="240px"
              defaultLanguage="plaintext"
              value={input}
              onChange={v => setInput(v || '')}
              theme="vs-dark"
              options={{
                fontSize: 14,
                fontFamily: 'monospace',
                minimap: { enabled: false },
                lineNumbers: 'on',
                scrollBeyondLastLine: false,
                wordWrap: 'on',
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
                  setInput(''); setOutput('');
                }}
              >
                Reset
              </button>
            </div>
          </div>

          {/* Output & Viewers */}
          <div className="space-y-6">
            <section className="bg-[var(--panel)] p-6 rounded-xl border border-white/10 shadow-lg">
              <h2 className="text-lg font-semibold text-orange-300 mb-2">Output</h2>
              <pre className="bg-black p-4 rounded text-green-400 text-sm whitespace-pre-wrap min-h-[120px]">
                {output}
              </pre>
            </section>

            {vmInstance && (
              <MemoryViewer
                vmInstance={vmInstance}
                version={runCount}        // ← trigger re-read
              />
            )}

            {vmInstance && (
              <CanvasOutput
                vmInstance={vmInstance}
                drawTrigger={runCount}    // ← trigger repaint
              />
            )}

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
              className="bg-gradient-to-r from-black via-zinc-900 to-black border border-orange-400 text-orange-300 font-mono px-6 py-4 rounded-xl shadow-xl"
              initial={{ rotate: -2 }}
              animate={{ rotate: [2, -2, 2], repeat: Infinity, duration: 0.8 }}
            >
              Debug Mode Activated —{' '}
              <span className="font-bold text-orange-400">RETRO CORE UNLOCKED</span>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />
    </>
  );
}

export default App;
