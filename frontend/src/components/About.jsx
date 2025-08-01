// src/components/About.jsx
export default function About() {
  return (
    <section className="max-w-4xl mx-auto px-6 py-16 font-mono text-[var(--text-main)]">
      <h2 className="text-2xl sm:text-3xl font-bold mb-6 pb-2 text-center border-b border-[var(--panel-border)]"
  style={{ color: 'var(--heading-color)' }}
>
        About retroWeb
      </h2>
      <p className="mb-4 leading-relaxed text-sm sm:text-base text-center">
        <strong>retroWeb Emulator</strong> is a web-based virtual machine that brings low-level assembly-style programming into your browser. 
        Designed as an educational tool and nostalgic experiment, this emulator lets you write and step through simplified instructions, 
        mimicking how early computers executed code without needing real hardware.
      </p>

      <p className="mb-4 leading-relaxed text-sm sm:text-base text-center">
        It supports a custom instruction set (e.g. <code className="text-[var(--accent)] font-semibold">LOAD, ADD, PRINT, HALT</code>) and includes 
        a memory viewer, console output, and step-by-step execution to help you visualize how each operation affects the system.
      </p>

      <p className="mb-4 leading-relaxed text-sm sm:text-base text-center">
        Whether you're a student learning computer architecture or a curious developer who loves retro-style programming, 
        this emulator gives you a hands-on way to explore how a basic CPU works.
      </p>

      <p className="leading-relaxed text-sm sm:text-base italic text-[var(--text-muted)] mt-6 text-center">
        P.S. It also supports AI-powered code generation via GPT (Coming soon)!
      </p>
    </section>
  );
}
