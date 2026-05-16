// ─────────────────────────────────────────────────────────────────────────────
// src/components/leads/LeadFilters.tsx – Filter bar with search, status, source
// ─────────────────────────────────────────────────────────────────────────────

import React from 'react';
import { Search, RotateCcw, ArrowUpDown } from 'lucide-react';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { Button } from '../ui/Button';
import { LeadFilters, LeadStatus, LeadSource, SortOrder } from '../../types';
import { LEAD_SOURCES, LEAD_STATUSES } from '../../utils/constants';

interface LeadFiltersBarProps {
  filters: LeadFilters;
  onFilterChange: <K extends keyof LeadFilters>(key: K, value: LeadFilters[K]) => void;
  onReset: () => void;
}

const STATUS_OPTIONS = [
  { value: '', label: 'All Statuses' },
  ...LEAD_STATUSES.map((s) => ({ value: s, label: s })),
];

const SOURCE_OPTIONS = [
  { value: '', label: 'All Sources' },
  ...LEAD_SOURCES.map((s) => ({ value: s, label: s })),
];

const SORT_OPTIONS = [
  { value: 'latest', label: 'Latest First' },
  { value: 'oldest', label: 'Oldest First' },
];

const hasActiveFilters = (filters: LeadFilters) =>
  !!(filters.search || filters.status || filters.source || filters.sortBy !== 'latest');

export const LeadFiltersBar: React.FC<LeadFiltersBarProps> = ({
  filters,
  onFilterChange,
  onReset,
}) => {
  const active = hasActiveFilters(filters);

  return (
    <div className="card p-4">
      <div className="flex flex-wrap gap-3 items-end">
        {/* Search */}
        <div className="flex-1 min-w-[200px]">
          <Input
            placeholder="Search by name or email..."
            value={filters.search}
            onChange={(e) => onFilterChange('search', e.target.value)}
            leftIcon={<Search className="w-4 h-4" />}
            aria-label="Search leads"
          />
        </div>

        {/* Status filter */}
        <div className="w-40">
          <Select
            value={filters.status}
            onChange={(e) => onFilterChange('status', e.target.value as LeadStatus | '')}
            options={STATUS_OPTIONS}
            aria-label="Filter by status"
          />
        </div>

        {/* Source filter */}
        <div className="w-40">
          <Select
            value={filters.source}
            onChange={(e) => onFilterChange('source', e.target.value as LeadSource | '')}
            options={SOURCE_OPTIONS}
            aria-label="Filter by source"
          />
        </div>

        {/* Sort */}
        <div className="w-40">
          <Select
            value={filters.sortBy}
            onChange={(e) => onFilterChange('sortBy', e.target.value as SortOrder)}
            options={SORT_OPTIONS}
            aria-label="Sort leads"
          />
        </div>

        {/* Reset */}
        {active && (
          <Button
            variant="ghost"
            size="md"
            onClick={onReset}
            leftIcon={<RotateCcw className="w-4 h-4" />}
            aria-label="Reset filters"
          >
            Reset
          </Button>
        )}

        {/* Sort indicator */}
        <div className="hidden sm:flex items-center gap-1 text-xs text-slate-400">
          <ArrowUpDown className="w-3 h-3" />
          <span>{filters.sortBy === 'latest' ? 'Newest first' : 'Oldest first'}</span>
        </div>
      </div>
    </div>
  );
};
