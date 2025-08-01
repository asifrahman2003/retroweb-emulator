// src/components/Navbar.jsx
import { useState, useEffect } from 'react';
import { FaGithub, FaMoon, FaSun, FaBookOpen, FaFileAlt } from 'react-icons/fa';
import { motion } from 'framer-motion';

export default function Navbar() {
  const [theme, setTheme] = useState('dark');

  // Hydrate theme on mount
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

  // Toggle light/dark
  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    document.documentElement.classList.toggle('light', next === 'light');
    localStorage.setItem('theme', next);
    setTheme(next);
  };

  return (
    <nav
      className="
        fixed top-0 left-0 right-0 z-50
        px-4 py-3 md:px-12 md:py-3
        flex justify-between items-center
        backdrop-blur-md border-b
      "
      style={{
        backgroundColor: 'var(--navbar-bg)',
        borderColor: 'var(--navbar-border)',
      }}
    >
      {/* Logo */}
      <h1
        className="font-mono font-bold transition-colors duration-200
                   text-lg md:text-xl"
        style={{
          color: theme === 'dark' ? 'var(--accent)' : '#000000',
        }}
      >
        retroWeb
      </h1>


      {/* Icons */}
      <div className="flex items-center gap-2 md:gap-4">
<motion.a
  href="https://docs.google.com/document/d/1494Jkygw0XOBvxfJfcAYc1YkzIUKNvgcumMZARnapMo/edit?usp=sharing"
  target="_blank"
  rel="noopener noreferrer"
  className="p-1 md:p-2 rounded transition"
  style={{ color: 'var(--navbar-text)' }}
  whileHover={{
    scale: 1.2,
    rotate: 3,
    backgroundColor: 'var(--navbar-hover-bg)',
  }}
  whileTap={{ scale: 0.95 }}
  transition={{ type: 'spring', stiffness: 300 }}
  aria-label="Documentation"
>
  <FaBookOpen className="w-5 h-5 md:w-6 md:h-6" />
</motion.a>

        <motion.a
  href="https://github.com/asifrahman2003/retroweb-emulator"
  target="_blank"
  rel="noopener noreferrer"
  className="p-1 md:p-2 rounded transition"
  style={{ color: 'var(--navbar-text)' }}
  whileHover={{
    scale: 1.25,
    rotate: -5,
    backgroundColor: 'var(--navbar-hover-bg)',
  }}
  whileTap={{ scale: 0.95 }}
  transition={{ type: 'spring', stiffness: 300 }}
>
  <FaGithub className="w-5 h-5 md:w-6 md:h-6" />
</motion.a>

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          aria-label="Toggle theme"
          className={`
            p-1 md:p-2 rounded-full transition-all duration-200
            ${theme === 'dark'
              ? 'border-2 border-[var(--accent)] hover:border-[var(--accent-hover)]'
              : 'border-2 border-black hover:border-gray-600'
            }
            hover:bg-[var(--navbar-hover-bg)]
          `}
          style={{
            backgroundColor: 'var(--panel)',
            color: 'var(--navbar-text)',
          }}
        >
          {theme === 'dark' ? (
            <FaSun className="w-4 h-4 md:w-5 md:h-5" />
          ) : (
            <FaMoon className="w-4 h-4 md:w-5 md:h-5" />
          )}
        </button>
      </div>
    </nav>
  );
}
