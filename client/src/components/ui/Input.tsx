// src/components/ui/Input.tsx — Shopeers-style form inputs

import React from 'react';
import { cn } from '../../utils/cn';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  rightIcon?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, rightIcon, className, id, ...props }, ref) => {
    const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-');

    return (
      <div className="input-wrapper">
        {label && (
          <label
            htmlFor={inputId}
            className={cn('input-label', props.required && 'input-label-required')}
          >
            {label}
          </label>
        )}

        <div style={{ position: 'relative' }}>
          <input
            ref={ref}
            id={inputId}
            className={cn('input-field', error && 'input-error', rightIcon && 'pr-10', className)}
            {...props}
          />
          {rightIcon && (
            <div style={{
              position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
              display: 'flex', alignItems: 'center', color: 'var(--on-surface-muted)',
            }}>
              {rightIcon}
            </div>
          )}
        </div>

        {error && <p className="input-error-msg">⚠ {error}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';
