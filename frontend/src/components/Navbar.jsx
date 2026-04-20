import { useEffect, useState } from 'react';
import { FaGithub, FaMoon, FaSun } from 'react-icons/fa';

export default function Navbar({ productName, activeRoute, links, onNavigate }) {
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    const saved = localStorage.getItem('theme');
    const initial = saved === 'dark' || saved === 'light' ? saved : 'light';

    document.documentElement.classList.remove('light');
    document.documentElement.classList.toggle('dark', initial === 'dark');
    setTheme(initial);
  }, []);

  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark';

    document.documentElement.classList.remove('light');
    document.documentElement.classList.toggle('dark', next === 'dark');
    localStorage.setItem('theme', next);
    setTheme(next);
  };

  return (
    <nav
      className="fixed left-0 right-0 top-0 z-50 border-b"
      style={{
        background: 'var(--navbar-bg)',
        borderColor: 'var(--navbar-border)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        boxShadow: 'var(--shadow-navbar)',
      }}
    >
      <div className="mx-auto flex max-w-[1480px] items-center gap-5 px-4 py-2.5 md:px-6">
        <button
          type="button"
          onClick={() => onNavigate('landing')}
          className="flex shrink-0 items-center gap-2 border-0 bg-transparent p-0 shadow-none"
          aria-label="Open landing page"
        >
          <span className="brand-mark" />
          <span className="flex items-baseline gap-2">
            <span className="text-[15px] font-semibold" style={{ color: 'var(--navbar-title)' }}>
              {productName.replace(' Academy', '')}
            </span>
            <span
              className="hidden text-[10px] uppercase tracking-[0.12em] sm:inline"
              style={{ color: 'var(--text-subtle)' }}
            >
              academy
            </span>
          </span>
        </button>

        <div className="flex flex-1 items-center gap-0.5 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {links.map((link, index) => {
            const active = link.id === activeRoute;

            return (
              <button
                key={link.id}
                type="button"
                onClick={() => onNavigate(link.id)}
                className="shrink-0 px-3 py-1.5 text-[12px] md:text-[13px]"
                style={{
                  background: active ? 'var(--panel)' : 'transparent',
                  borderColor: active ? 'var(--line)' : 'transparent',
                  color: active ? 'var(--ink)' : 'var(--navbar-text)',
                  boxShadow: active ? '0 1px 0 rgba(0, 0, 0, 0.03)' : 'none',
                }}
              >
                <span className="hidden font-mono text-[10px] text-[var(--text-subtle)] md:inline">
                  {String(index + 1).padStart(2, '0')} ·{' '}
                </span>
                {link.label}
              </button>
            );
          })}
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <a
            href="https://github.com/asifrahman2003/retroweb-emulator"
            target="_blank"
            rel="noopener noreferrer"
            className="flex h-8 w-8 items-center justify-center rounded-[5px] border"
            style={{
              color: 'var(--navbar-text)',
              borderColor: 'var(--panel-border)',
              background: 'var(--panel)',
            }}
            aria-label="GitHub repository"
          >
            <FaGithub className="h-4 w-4" />
          </a>

          <button
            type="button"
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="flex h-8 w-8 items-center justify-center rounded-[5px] p-0"
            style={{
              color: 'var(--navbar-text)',
              borderColor: 'var(--panel-border)',
              background: 'var(--panel)',
            }}
          >
            {theme === 'dark' ? (
              <FaSun className="h-3.5 w-3.5" />
            ) : (
              <FaMoon className="h-3.5 w-3.5" />
            )}
          </button>
        </div>
      </div>
    </nav>
  );
}
