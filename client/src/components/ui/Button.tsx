// ─────────────────────────────────────────────────────────────────────────────
// src/components/ui/Button.tsx
// ─────────────────────────────────────────────────────────────────────────────

import React from 'react';
import { cn } from '../../utils/cn';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const VARIANT_CLASSES: Record<ButtonVariant, string> = {
  primary:   'btn-primary',
  secondary: 'btn-secondary',
  ghost:     'btn-ghost',
  danger:    'btn-danger',
};

const SIZE_CLASSES: Record<ButtonSize, string> = {
  sm: 'btn-sm',
  md: '',
  lg: 'btn-lg',
};

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  leftIcon,
  rightIcon,
  children,
  className,
  disabled,
  ...rest
}) => (
  <button
    className={cn(
      VARIANT_CLASSES[variant],
      SIZE_CLASSES[size],
      className
    )}
    disabled={disabled || isLoading}
    aria-busy={isLoading}
    {...rest}
  >
    {isLoading ? (
      <>
        <span
          className="w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin"
          aria-hidden="true"
        />
        <span>Loading…</span>
      </>
    ) : (
      <>
        {leftIcon && <span aria-hidden="true">{leftIcon}</span>}
        {children}
        {rightIcon && <span aria-hidden="true">{rightIcon}</span>}
      </>
    )}
  </button>
);
