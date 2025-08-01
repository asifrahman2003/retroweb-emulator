// src/App.jsx
import React, { useEffect, useState } from 'react';
import { loadVM } from './wasm/loadVM';
import { assemble } from './assembler';
import Navbar from './components/Navbar';
import MemoryViewer from './components/MemoryViewer';
import CanvasOutput from './components/CanvasOutput';
import DebugControls from './components/DebugControls';
import Footer from './components/Footer';
import { motion, AnimatePresence } from 'framer-motion';
import Editor from '@monaco-editor/react';
import { askGPT } from './askGPT';

function App() {
  const [vmInstance, setVmInstance] = useState(null);
  const [input, setInput] = useState('');
  const [isAssembly, setIsAssembly] = useState(true);
  const [output, setOutput] = useState('');
  const [easterEggActive, setEasterEggActive] = useState(false);
  const [runCount, setRunCount] = useState(0);
  const [programBytes, setProgramBytes] = useState(new Uint8Array());
  const [editor, setEditor] = useState(null);
  const [monaco, setMonaco] = useState(null);
  const [sourceMap, setSourceMap] = useState({});
  const [aiPrompt, setAiPrompt] = useState('');


  useEffect(() => {
    const script = document.createElement('script');
    script.src = '/vm.js';
    script.onload = async () => {
      const Module = await loadVM();
      setVmInstance(Module);

      const demo = `LOAD R1 5\nADD R2 R1 R1\nPRINT R2\nHALT`;
      setInput(demo);

      const bytes = assemble(demo);
      setSourceMap({});
      setProgramBytes(Uint8Array.from(bytes));

      const ptr = Module._get_memory();
      const heap = new Uint8Array(Module.HEAPU8.buffer);
      heap.fill(0, ptr, ptr + 2048);
      heap.set(bytes, ptr);
    };
    document.body.appendChild(script);
  }, []);

  const handleRunVM = () => {
    if (!vmInstance?._run_vm) {
      setOutput('❌ VM not ready.');
      return;
    }

    if (input.trim().toUpperCase() === 'HALT\nHALT') {
      setEasterEggActive(true);
      setTimeout(() => setEasterEggActive(false), 4000);
      return;
    }

    let bytes;
    try {
      bytes = isAssembly
        ? assemble(input)
        : input.trim().split(/\s+/).map(Number);
      setProgramBytes(Uint8Array.from(bytes));
    } catch (e) {
      setOutput('❌ Assembly Error: ' + e.message);
      return;
    }

    const ptr = vmInstance._get_memory();
    const heapU = new Uint8Array(vmInstance.HEAPU8.buffer);
    heapU.fill(0, ptr, ptr + 2048);
    heapU.set(bytes, ptr);

    let buf = '';
    const realLog = console.log;
    console.log = (...args) => {
      buf += args.join(' ') + '\n';
      realLog(...args);
    };

    try {
      vmInstance._run_vm();
    } catch (e) {
      console.log = realLog;
      setOutput('❌ Runtime Error: ' + e.message);
      return;
    }
    console.log = realLog;

    const regs = Array.from({ length: 8 }, (_, i) =>
      `R${i} = ${vmInstance._get_register(i)}`
    ).join('\n');

    const out = buf.trim();
    setOutput(out ? `${out}\n\n${regs}` : regs);
    setRunCount(c => c + 1);
  };

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[var(--bg)] text-white px-4 md:px-8 py-12 font-mono">
        <h1 className="text-4xl font-bold text-orange-500 mb-8 text-center">
          retroWeb Emulator
        </h1>

        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-10">

          {/* Left Panel */}
          <div className="flex flex-col gap-6 bg-[var(--panel)] p-6 rounded-xl border border-white/10 shadow-lg">
            <div>
              <label className="flex items-center text-gray-300 gap-2 text-sm mb-2">
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
                onChange={(v) => setInput(v || '')}
                onMount={(ed, mon) => {
                  setEditor(ed);
                  setMonaco(mon);
                }}
                theme="vs-dark"
                options={{
                  fontSize: 14,
                  fontFamily: 'monospace',
                  minimap: { enabled: false },
                  lineNumbers: 'on',
                  scrollBeyondLastLine: false,
                  wordWrap: 'on',
                  readOnly: !isAssembly,
                  ariaLabel: 'Assembly Code Editor',
                  placeholder: isAssembly
                    ? 'Enter your program using custom Assembly \n (e.g., LOAD R1 5)...'
                    : 'Enter raw byte values separated by spaces \n (e.g., 1 17 5 2 18 17 17 3 18 7)',
                }}
              />
              {/* AI Assistant Input */}
<div className="mt-4">
  <input
    type="text"
    className="w-full px-3 py-2 text-sm text-white rounded"
    placeholder="Ask AI: e.g., load and print a number"
    value={aiPrompt}
    onChange={(e) => setAiPrompt(e.target.value)}
  />
  <button
    onClick={async () => {
      const response = await askGPT(
        `Convert this idea into assembly for a custom VM:\n\n${aiPrompt}`
      );
      setInput(response);
    }}
    className="mt-2 bg-sky-600 hover:bg-sky-700 text-white px-4 py-2 rounded transition w-full"
  >
    Generate with GPT
  </button>
</div>
            </div>

            {vmInstance && editor && monaco && (
              <DebugControls
                vmInstance={vmInstance}
                editor={editor}
                monaco={monaco}
                sourceMap={sourceMap}
                programBytes={programBytes}
              />
            )}

            <div className="flex gap-4">
              <button
                onClick={handleRunVM}
                className="flex-1 bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white py-2 rounded-lg shadow transition"
              >
                Run VM
              </button>
              <button
                onClick={() => { setInput(''); setOutput(''); }}
                className="flex-1 bg-gray-800 hover:bg-gray-700 text-gray-200 py-2 rounded-lg border border-gray-600 shadow transition"
              >
                Clear Code
              </button>
            </div>
          </div>

          {/* Right Panel */}
          <div className="space-y-6">
            <section className="bg-[var(--panel)] p-6 rounded-xl border border-white/10 shadow-lg">
              <h2 className="text-lg font-semibold text-orange-300 mb-2">Output</h2>
              <pre className="bg-black p-4 rounded text-green-400 text-sm whitespace-pre-wrap min-h-[120px]">
                {output}
              </pre>
            </section>

            {vmInstance && (
              <MemoryViewer vmInstance={vmInstance} version={runCount} />
            )}
            {vmInstance && (
              <CanvasOutput vmInstance={vmInstance} drawTrigger={runCount} />
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
