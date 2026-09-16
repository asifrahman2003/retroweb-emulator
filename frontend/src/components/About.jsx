// src/components/About.jsx
export default function About() {
  return (
    <section className="max-w-4xl mx-auto px-6 py-14 font-mono text-[var(--text-main)]">
      <h2 className="text-2xl sm:text-3xl font-bold mb-6 pb-2 text-center border-b border-[var(--panel-border)]"
  style={{ color: 'var(--heading-color)' }}
>
        About retroWeb Academy
      </h2>
      <p className="mb-4 leading-relaxed text-sm sm:text-base text-center">
        <strong>retroWeb Academy</strong> teaches assembly programming with a web-based virtual machine.
        You can write short programs, step through each instruction, and see how the VM state changes without setting up extra tools.
      </p>

      <p className="mb-4 leading-relaxed text-sm sm:text-base text-center">
        It supports a custom instruction set (e.g. <code className="text-[var(--accent)] font-semibold">LOAD, ADD, PRINT, HALT</code>) and includes 
        a memory viewer, console output, guided examples, and step-by-step execution.
      </p>

      <p className="mb-4 leading-relaxed text-sm sm:text-base text-center">
        It is meant for students learning computer architecture and anyone who wants a small, readable CPU model to experiment with.
      </p>

      <p className="leading-relaxed text-sm sm:text-base italic text-[var(--text-muted)] mt-6 text-center">
        The current build focuses on stepping through code, inspecting memory, and understanding how framebuffer-driven output works.
      </p>
    </section>
  );
}
