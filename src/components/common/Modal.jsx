import React from 'react';
import { FiX } from 'react-icons/fi';

export default function Modal({ open, onClose, title, children }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={onClose}>
      <div className="card w-full max-w-lg p-6" onClick={(e) => e.stopPropagation()}>
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-xl font-display tracking-wide">{title}</h3>
          <button onClick={onClose} aria-label="Close"><FiX /></button>
        </div>
        {children}
      </div>
    </div>
  );
}
