// src/components/ui/Modal.tsx — Shopeers-style modal dialog

import React, { useEffect, useRef } from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg';
}

const SIZE_MAP = { sm: 400, md: 480, lg: 560 };

export const Modal: React.FC<ModalProps> = ({
  isOpen, onClose, title, children, size = 'md',
}) => {
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKeyDown);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div
        ref={panelRef}
        className="modal-panel"
        style={{ maxWidth: SIZE_MAP[size] }}
        role="dialog"
        aria-modal="true"
        aria-label={title}
      >
        <div className="modal-header">
          <h2 style={{ fontSize: 17, fontWeight: 700, color: 'var(--on-surface)', letterSpacing: '-0.01em' }}>
            {title}
          </h2>
          <button
            onClick={onClose}
            aria-label="Close"
            style={{
              width: 32, height: 32, borderRadius: 'var(--radius-sm)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: 'var(--surface-low)', border: 'none', cursor: 'pointer',
              color: 'var(--on-surface-muted)', transition: 'background 150ms',
            }}
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="modal-body">{children}</div>
      </div>
    </div>
  );
};
