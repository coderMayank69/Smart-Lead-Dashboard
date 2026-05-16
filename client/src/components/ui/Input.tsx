// ─────────────────────────────────────────────────────────────────────────────
// src/components/ui/Input.tsx
// ─────────────────────────────────────────────────────────────────────────────

import React from 'react';
import { cn } from '../../utils/cn';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, leftIcon, rightIcon, className, required, id, ...rest }, ref) => {
    const inputId = id ?? `input-${label?.toLowerCase().replace(/\s+/g, '-')}`;

    return (
      <div className="input-wrapper">
        {label && (
          <label
            htmlFor={inputId}
            className={cn('input-label', required && 'input-label-required')}
          >
            {label}
          </label>
        )}
        <div className="relative">
          {leftIcon && (
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted pointer-events-none">
              {leftIcon}
            </span>
          )}
          <input
            ref={ref}
            id={inputId}
            className={cn(
              'input-field',
              leftIcon && 'pl-9',
              rightIcon && 'pr-9',
              error && 'input-error',
              className
            )}
            aria-invalid={!!error}
            aria-describedby={error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined}
            {...rest}
          />
          {rightIcon && (
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted">
              {rightIcon}
            </span>
          )}
        </div>
        {error && (
          <p id={`${inputId}-error`} className="input-error-msg" role="alert">
            {error}
          </p>
        )}
        {hint && !error && (
          <p id={`${inputId}-hint`} className="text-xs text-muted">
            {hint}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
