// src/components/MacWindow.jsx
import React from 'react';

export default function MacWindow({ title, children }) {
  return (
    <div className="bg-[var(--panel)] rounded-xl border border-white/10 shadow-lg overflow-hidden">
      {/* title bar */}
      <div className="flex items-center bg-gray-800 px-3 py-1">
        {/* traffic lights */}
        <div className="flex space-x-2">
          <span className="h-3 w-3 bg-red-500 rounded-full" />
          <span className="h-3 w-3 bg-yellow-500 rounded-full" />
          <span className="h-3 w-3 bg-green-500 rounded-full" />
        </div>
        {/* window title */}
        <div className="flex-1 text-xs text-gray-300 text-center select-none">
          {title}
        </div>
        {/* spacer */}
        <div className="w-6" />
      </div>
      {/* content area */}
      <div className="p-4">
        {children}
      </div>
    </div>
  );
}
