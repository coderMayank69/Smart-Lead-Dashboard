// ─────────────────────────────────────────────────────────────────────────────
// src/components/ui/EmptyState.tsx
// ─────────────────────────────────────────────────────────────────────────────

import React from 'react';
import { LucideIcon } from 'lucide-react';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description?: string;
  action?: React.ReactNode;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon: Icon,
  title,
  description,
  action,
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center animate-fade-in">
      <div className="w-16 h-16 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-4">
        <Icon className="w-8 h-8 text-slate-400" />
      </div>
      <h3 className="text-base font-semibold text-slate-700 dark:text-slate-300 mb-1">
        {title}
      </h3>
      {description && (
        <p className="text-sm text-slate-400 max-w-xs mb-4">{description}</p>
      )}
      {action}
    </div>
  );
};
