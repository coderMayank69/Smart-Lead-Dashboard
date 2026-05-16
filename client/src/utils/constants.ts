// ─────────────────────────────────────────────────────────────────────────────
// src/utils/constants.ts – App-wide constants
// ─────────────────────────────────────────────────────────────────────────────

import { LeadStatus, LeadSource } from '../types';

export const LEAD_STATUSES: LeadStatus[] = ['New', 'Contacted', 'Qualified', 'Lost'];

export const LEAD_SOURCES: LeadSource[] = ['Website', 'Instagram', 'Referral'];

export const STATUS_CONFIG: Record<
  LeadStatus,
  { label: string; color: string; bg: string; dot: string }
> = {
  New: {
    label: 'New',
    color: 'text-blue-700 dark:text-blue-300',
    bg: 'bg-blue-50 dark:bg-blue-900/30',
    dot: 'bg-blue-500',
  },
  Contacted: {
    label: 'Contacted',
    color: 'text-amber-700 dark:text-amber-300',
    bg: 'bg-amber-50 dark:bg-amber-900/30',
    dot: 'bg-amber-500',
  },
  Qualified: {
    label: 'Qualified',
    color: 'text-emerald-700 dark:text-emerald-300',
    bg: 'bg-emerald-50 dark:bg-emerald-900/30',
    dot: 'bg-emerald-500',
  },
  Lost: {
    label: 'Lost',
    color: 'text-red-700 dark:text-red-300',
    bg: 'bg-red-50 dark:bg-red-900/30',
    dot: 'bg-red-500',
  },
};

export const SOURCE_CONFIG: Record<
  LeadSource,
  { label: string; icon: string; color: string }
> = {
  Website: { label: 'Website', icon: '🌐', color: 'text-purple-600' },
  Instagram: { label: 'Instagram', icon: '📸', color: 'text-pink-600' },
  Referral: { label: 'Referral', icon: '👥', color: 'text-teal-600' },
};
