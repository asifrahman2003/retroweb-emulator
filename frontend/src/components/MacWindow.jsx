// src/components/MacWindow.jsx

import React from 'react';

export default function MacWindow({ title, children, className = '', contentClassName = '' }) {
  return (
    <div
      className={`overflow-hidden rounded-[16px] shadow-[0_18px_40px_rgba(2,6,23,0.22)] ${className}`.trim()}
      style={{
        backgroundColor: 'var(--window-bg)',
        border: '1px solid var(--window-border)',
        boxShadow: '0 18px 40px rgba(2, 6, 23, 0.22), 0 1px 0 rgba(255, 255, 255, 0.04) inset',
      }}
    >
      <div
        className="relative flex items-center px-4 py-2.5"
        style={{
          background:
            'linear-gradient(180deg, rgba(255,255,255,0.045) 0%, rgba(255,255,255,0.015) 100%)',
          backgroundColor: 'var(--window-header-bg)',
          borderBottom: '1px solid var(--window-border)',
        }}
      >
        <div className="z-10 flex space-x-2">
          <span className="h-3 w-3 rounded-full border border-black/15 bg-[#ff5f57] shadow-[0_1px_0_rgba(255,255,255,0.2)_inset]" />
          <span className="h-3 w-3 rounded-full border border-black/15 bg-[#febc2e] shadow-[0_1px_0_rgba(255,255,255,0.2)_inset]" />
          <span className="h-3 w-3 rounded-full border border-black/15 bg-[#28c840] shadow-[0_1px_0_rgba(255,255,255,0.2)_inset]" />
        </div>

        <div className="absolute inset-0 flex justify-center items-center pointer-events-none">
          <span className="select-none text-[13px] font-medium tracking-[0.01em] text-[var(--window-title-text)]">
            {title}
          </span>
        </div>

        <div className="w-6" />
      </div>

      <div className={`p-4 ${contentClassName}`.trim()}>
        {children}
      </div>
    </div>
  );
}
