import { FaGithub, FaLinkedin } from 'react-icons/fa';
import { motion } from 'framer-motion';

export default function Footer() {
  return (
    <footer
      className="border-t border-[var(--panel-border)] px-6 py-10"
    >
      <div className="mx-auto flex max-w-7xl flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-sm font-semibold text-[var(--text-main)]">
            retroWeb Academy
          </p>
          <p className="mt-2 max-w-2xl text-sm leading-7 text-[var(--text-muted)]">
            Browser-first scaffolding for a low-level programming education SaaS: emulator workspace, lessons, labs, progress, reports, and instructor tooling.
          </p>
          <p className="mt-3 text-xs uppercase tracking-[0.22em] text-[var(--text-muted)]">
            © {new Date().getFullYear()} Asifur Rahman
          </p>
        </div>

        <div className="flex items-center gap-4">
          <motion.a
            href="https://github.com/asifrahman2003"
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.1, rotate: -3 }}
            whileTap={{ scale: 0.96 }}
            transition={{ type: 'spring', stiffness: 300 }}
            className="rounded-full border border-[var(--panel-border)] p-3 text-[var(--text-main)]"
          >
            <FaGithub size={20} />
          </motion.a>

          <motion.a
            href="https://www.linkedin.com/in/iamasiff"
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.1, rotate: 3 }}
            whileTap={{ scale: 0.96 }}
            transition={{ type: 'spring', stiffness: 300 }}
            className="rounded-full border border-[var(--panel-border)] p-3 text-[var(--text-main)]"
          >
            <FaLinkedin size={20} />
          </motion.a>
        </div>
      </div>
    </footer>
  );
}
