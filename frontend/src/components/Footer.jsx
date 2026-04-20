import { FaGithub, FaLinkedin } from 'react-icons/fa';

export default function Footer() {
  return (
    <footer
      className="border-t px-6 py-8"
      style={{ borderColor: 'var(--line)', background: 'var(--panel-soft)' }}
    >
      <div className="mx-auto flex max-w-[1480px] flex-col items-start gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="brand-mark scale-90" />
            <span className="text-sm font-semibold" style={{ color: 'var(--heading-color)' }}>
              retroWeb
            </span>
          </div>
          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
            Learn the machine by running it. © {new Date().getFullYear()} Asifur Rahman
          </p>
        </div>

        <div className="flex items-center gap-2">
          <a
            href="https://github.com/asifrahman2003"
            target="_blank"
            rel="noopener noreferrer"
            className="flex h-8 w-8 items-center justify-center rounded-lg transition-all"
            style={{
              color: 'var(--text-muted)',
              border: '1px solid var(--panel-border)',
            }}
            aria-label="GitHub"
          >
            <FaGithub size={15} />
          </a>
          <a
            href="https://www.linkedin.com/in/iamasiff"
            target="_blank"
            rel="noopener noreferrer"
            className="flex h-8 w-8 items-center justify-center rounded-lg transition-all"
            style={{
              color: 'var(--text-muted)',
              border: '1px solid var(--panel-border)',
            }}
            aria-label="LinkedIn"
          >
            <FaLinkedin size={15} />
          </a>
        </div>
      </div>
    </footer>
  );
}
