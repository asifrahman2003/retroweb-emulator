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
      {/* Title bar */}
      <div
        className="relative flex items-center px-3 py-2"
        style={{
          backgroundColor: 'var(--window-header-bg)',
          borderBottom: '1px solid var(--window-border)',
        }}
      >
        {/* Traffic lights */}
        <div className="flex space-x-2 z-10">
          <span className="h-3 w-3 bg-red-500 rounded-full" />
          <span className="h-3 w-3 bg-yellow-500 rounded-full" />
          <span className="h-3 w-3 bg-green-500 rounded-full" />
        </div>

        {/* Centered window title */}
        <div className="absolute inset-0 flex justify-center items-center pointer-events-none">
          <span className="text-sm text-[var(--window-title-text)] select-none">
            {title}
          </span>
        </div>

        {/* Spacer to preserve layout symmetry */}
        <div className="w-6" />
      </div>

      {/* Content area */}
      <div className="p-4">
        {children}
      </div>
    </div>
  );
}
