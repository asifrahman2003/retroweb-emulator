export default function MacWindow({ title, children, className = '', contentClassName = '', style = {} }) {
  return (
    <div
      className={`overflow-hidden rounded-[8px] ${className}`.trim()}
      style={{
        backgroundColor: 'var(--window-bg)',
        border: '1px solid var(--window-border)',
        boxShadow: 'var(--shadow-window)',
        ...style,
      }}
    >
      <div
        className="flex items-center gap-2 px-4 py-3"
        style={{
          backgroundColor: 'var(--window-header-bg)',
          borderBottom: '1px solid var(--window-border)',
        }}
      >
        <div className="flex gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-[#e0624a]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#d4a23a]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#4a9e5a]" />
        </div>
        <span
          className="flex-1 text-center text-xs font-medium"
          style={{
            color: 'var(--window-title-text)',
            fontFamily: '"JetBrains Mono", monospace',
            letterSpacing: '0.04em',
          }}
        >
          {title}
        </span>
        <div className="w-12" />
      </div>

      <div className={`p-4 ${contentClassName}`.trim()}>
        {children}
      </div>
    </div>
  );
}
