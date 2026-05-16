// ─────────────────────────────────────────────────────────────────────────────
// src/components/ui/Badge.tsx
// ─────────────────────────────────────────────────────────────────────────────

import React from 'react';
import { cn } from '../../utils/cn';

type LeadStatus = 'New' | 'Contacted' | 'Qualified' | 'Lost';
type LeadSource = 'Website' | 'Instagram' | 'Referral';

interface StatusBadgeProps {
  status: LeadStatus;
  className?: string;
}

const STATUS_CLASSES: Record<LeadStatus, string> = {
  New:       'badge badge-new',
  Contacted: 'badge badge-contacted',
  Qualified: 'badge badge-qualified',
  Lost:      'badge badge-lost',
};

const STATUS_DOT_COLORS: Record<LeadStatus, string> = {
  New:       'bg-blue-500',
  Contacted: 'bg-amber-500',
  Qualified: 'bg-green-500',
  Lost:      'bg-red-500',
};

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, className }) => (
  <span className={cn(STATUS_CLASSES[status] ?? 'badge', className)}>
    <span className={cn('badge-dot', STATUS_DOT_COLORS[status] ?? 'bg-slate-400')} />
    {status}
  </span>
);

interface SourceBadgeProps {
  source: LeadSource;
  className?: string;
}

const SOURCE_CLASSES: Record<LeadSource, string> = {
  Website:   'bg-purple-50 text-purple-700',
  Instagram: 'bg-pink-50 text-pink-700',
  Referral:  'bg-teal-50 text-teal-700',
};

const SOURCE_ICONS: Record<LeadSource, string> = {
  Website:   '🌐',
  Instagram: '📱',
  Referral:  '👥',
};

export const SourceBadge: React.FC<SourceBadgeProps> = ({ source, className }) => (
  <span
    className={cn(
      'badge text-xs font-medium',
      SOURCE_CLASSES[source] ?? 'bg-slate-50 text-slate-700',
      className
    )}
  >
    <span>{SOURCE_ICONS[source] ?? '📌'}</span>
    {source}
  </span>
);
