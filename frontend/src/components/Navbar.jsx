// src/components/Navbar.jsx
import { useState } from 'react';
import { FaGithub, FaMoon, FaSun } from 'react-icons/fa';

export default function Navbar() {
  const [darkMode, setDarkMode] = useState(true);

  const toggleTheme = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle('light');
  };

  return (
    <nav className="font-mono w-full px-6 py-4 flex justify-between items-center backdrop-blur-md bg-black/30 border-b border-white/10">
      <h1 className="text-xl font-bold text-orange-400">RetroWeb Emulator</h1>
      <div className="flex items-center gap-4 text-sm text-gray-300">
        <a
          href="https://github.com/asifrahman2003/retroweb-emulator"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-white transition"
        >
          <FaGithub size={20} />
        </a>
        <button
          onClick={toggleTheme}
          className="text-gray-300 hover:text-white transition"
        >
          {darkMode ? <FaSun /> : <FaMoon />}
        </button>
      </div>
    </nav>
  );
}
