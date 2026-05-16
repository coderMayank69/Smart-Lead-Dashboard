// ─────────────────────────────────────────────────────────────────────────────
// src/components/ui/Badge.tsx
// ─────────────────────────────────────────────────────────────────────────────

import React from 'react';
import { cn } from '../../utils/cn';
import { LeadStatus, LeadSource } from '../../types';
import { STATUS_CONFIG, SOURCE_CONFIG } from '../../utils/constants';

interface StatusBadgeProps {
  status: LeadStatus;
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, className }) => {
  const config = STATUS_CONFIG[status];
  return (
    <span className={cn('badge', config.color, config.bg, className)}>
      <span className={cn('w-1.5 h-1.5 rounded-full', config.dot)} />
      {config.label}
    </span>
  );
};

interface SourceBadgeProps {
  source: LeadSource;
  className?: string;
}

export const SourceBadge: React.FC<SourceBadgeProps> = ({ source, className }) => {
  const config = SOURCE_CONFIG[source];
  return (
    <span
      className={cn(
        'badge bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300',
        className
      )}
    >
      <span>{config.icon}</span>
      {config.label}
    </span>
  );
};
