// src/components/MacWindow.jsx
import React from 'react';

export default function MacWindow({ title, children }) {
  return (
    <div
      className="rounded-xl shadow-lg overflow-hidden"
      style={{
        backgroundColor: 'var(--window-bg)',
        border: '1px solid var(--window-border)',
      }}
    >
      {/* title bar */}
      <div
        className="flex items-center px-3 py-1"
        style={{
          backgroundColor: 'var(--window-header-bg)',
          borderBottom: '1px solid var(--window-border)',
        }}
      >
        {/* traffic lights */}
        <div className="flex space-x-2">
          <span className="h-3 w-3 bg-red-500 rounded-full" />
          <span className="h-3 w-3 bg-yellow-500 rounded-full" />
          <span className="h-3 w-3 bg-green-500 rounded-full" />
        </div>

        {/* window title */}
        <div
          className="flex-1 text-xs text-[var(--window-title-text)] text-center select-none"
        >
          {title}
        </div>

        {/* spacer */}
        <div className="w-6" />
      </div>

      {/* content area */}
      <div className="p-4">{children}</div>
    </div>
  );
}
