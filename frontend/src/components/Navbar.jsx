import { useState, useEffect } from 'react';
import { FaGithub, FaMoon, FaSun } from 'react-icons/fa';
import { motion } from 'framer-motion';

export default function Navbar({ productName, activeRoute, links, onNavigate }) {
  const [theme, setTheme] = useState('dark');

  useEffect(() => {
    const saved = localStorage.getItem('theme');
    const initial = saved
      ? saved
      : window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light';
    document.documentElement.classList.toggle('light', initial === 'light');
    setTheme(initial);
  }, []);

  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    document.documentElement.classList.toggle('light', next === 'light');
    localStorage.setItem('theme', next);
    setTheme(next);
  };

  return (
    <nav
      className="fixed left-0 right-0 top-0 z-50 border-b px-4 py-3 backdrop-blur-xl md:px-8"
      style={{
        backgroundColor: 'var(--navbar-bg)',
        borderColor: 'var(--navbar-border)',
      }}
    >
      <div className="mx-auto flex max-w-7xl flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <button
          type="button"
          onClick={() => onNavigate('landing')}
          className="flex items-center gap-3 border-none bg-transparent px-0 py-0 text-left shadow-none"
        >
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-[var(--accent)] bg-[var(--accent-soft)] text-lg font-bold text-[var(--accent)]">
            rw
          </div>
          <div>
            <h1
              className="text-lg font-semibold tracking-wide md:text-xl"
              style={{ color: theme === 'dark' ? 'var(--heading-color)' : '#111111' }}
            >
              {productName}
            </h1>
            <p className="text-xs uppercase tracking-[0.22em] text-[var(--text-muted)]">
              Low-Level Learning Platform
            </p>
          </div>
        </button>

        <div className="flex flex-1 flex-wrap items-center gap-2 lg:justify-center">
          {links.map((link) => {
            const active = link.id === activeRoute;
            return (
              <button
                key={link.id}
                type="button"
                onClick={() => onNavigate(link.id)}
                className={`rounded-full px-4 py-2 text-sm transition ${
                  active
                    ? 'border-[var(--accent)] bg-[var(--accent-soft)] text-[var(--text-main)]'
                    : 'border-[var(--panel-border)] bg-[var(--panel)] text-[var(--text-muted)] hover:border-[var(--accent)] hover:text-[var(--text-main)]'
                }`}
              >
                {link.label}
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-2 md:gap-3">
          <motion.a
            href="https://github.com/asifrahman2003/retroweb-emulator"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full p-2 transition"
            style={{ color: 'var(--navbar-text)' }}
            whileHover={{
              scale: 1.1,
              backgroundColor: 'var(--navbar-hover-bg)',
            }}
            whileTap={{ scale: 0.96 }}
            transition={{ type: 'spring', stiffness: 300 }}
            aria-label="GitHub repository"
          >
            <FaGithub className="h-5 w-5" />
          </motion.a>

          <button
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="rounded-full border-2 border-[var(--panel-border)] p-2 transition hover:border-[var(--accent)] hover:bg-[var(--navbar-hover-bg)]"
            style={{
              backgroundColor: 'var(--panel)',
              color: 'var(--navbar-text)',
            }}
          >
            {theme === 'dark' ? <FaSun className="h-4 w-4" /> : <FaMoon className="h-4 w-4" />}
          </button>
        </div>
      </div>
    </nav>
  );
}
