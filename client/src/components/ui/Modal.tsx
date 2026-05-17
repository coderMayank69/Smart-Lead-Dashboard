// src/components/ui/Modal.tsx — Animated modal with Framer Motion

import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

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

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="modal-overlay"
          onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
        >
          <motion.div
            className="modal-panel"
            style={{ maxWidth: SIZE_MAP[size] }}
            role="dialog"
            aria-modal="true"
            aria-label={title}
            initial={{ opacity: 0, scale: 0.94, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 16 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
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
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
