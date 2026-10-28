import React, { useEffect } from 'react';
import { CheckCircle2, Info, X } from 'lucide-react';

export default function Toast({ message, onClose }) {
  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(() => {
      onClose();
    }, 4000);
    return () => clearTimeout(timer);
  }, [message, onClose]);

  if (!message) return null;

  return (
    <div style={{
      position: 'fixed',
      bottom: '1.5rem',
      right: '1.5rem',
      backgroundColor: 'var(--text-primary)',
      color: 'var(--text-inverse)',
      padding: '0.75rem 1.15rem',
      borderRadius: 'var(--radius-md)',
      boxShadow: 'var(--shadow-xl)',
      display: 'flex',
      alignItems: 'center',
      gap: '0.65rem',
      zIndex: 200,
      fontSize: '0.88rem',
      maxWidth: '380px',
      animation: 'fadeIn 0.25s ease-out',
    }}>
      <CheckCircle2 size={18} color="#10b981" />
      <span style={{ flex: 1 }}>{message}</span>
      <button
        onClick={onClose}
        style={{
          background: 'none',
          border: 'none',
          color: 'inherit',
          cursor: 'pointer',
          padding: '0.2rem',
          opacity: 0.8,
        }}
        aria-label="Dismiss message"
      >
        <X size={16} />
      </button>
    </div>
  );
}
