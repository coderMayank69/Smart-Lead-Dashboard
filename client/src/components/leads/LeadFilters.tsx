// ─────────────────────────────────────────────────────────────────────────────
// src/components/leads/LeadFilters.tsx – Minimal CRM filter bar
// ─────────────────────────────────────────────────────────────────────────────

import React from 'react';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import { LeadFilters } from '../../types';
import { LEAD_STATUSES, LEAD_SOURCES, SORT_OPTIONS } from '../../utils/constants';

interface LeadFiltersBarProps {
  filters: Partial<LeadFilters>;
  onFilterChange: (key: keyof LeadFilters, value: string | number) => void;
  onReset: () => void;
}

interface FilterOption { value: string; label: string; }

const statusOptions: FilterOption[] = [
  { value: '', label: 'All Statuses' },
  ...LEAD_STATUSES.map(s => ({ value: s, label: s })),
];

const sourceOptions: FilterOption[] = [
  { value: '', label: 'All Sources' },
  ...LEAD_SOURCES.map(s => ({ value: s, label: s })),
];

const sortOptions: FilterOption[] = [
  { value: 'latest', label: 'Newest First' },
  { value: 'oldest', label: 'Oldest First' },
];

const hasActiveFilters = (filters: Partial<LeadFilters>) =>
  !!(filters.status || filters.source || filters.search);

export const LeadFiltersBar: React.FC<LeadFiltersBarProps> = ({
  filters,
  onFilterChange,
  onReset,
}) => {
  const active = hasActiveFilters(filters);

  return (
    <div className="card px-4 py-3">
      <div className="flex flex-wrap items-center gap-2">
        {/* Search */}
        <div className="search-wrapper flex-1 min-w-48">
          <Search className="search-icon" aria-hidden="true" />
          <input
            type="search"
            placeholder="Search by name or email…"
            className="search-input"
            value={filters.search ?? ''}
            onChange={(e) => onFilterChange('search', e.target.value)}
            aria-label="Search leads"
            id="lead-search"
          />
        </div>

        {/* Divider */}
        <div className="hidden sm:block w-px h-6" style={{ background: 'var(--outline)' }} />

        {/* Status filter */}
        <select
          className="select-field w-36"
          value={filters.status ?? ''}
          onChange={(e) => onFilterChange('status', e.target.value)}
          aria-label="Filter by status"
        >
          {statusOptions.map(o => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>

        {/* Source filter */}
        <select
          className="select-field w-36"
          value={filters.source ?? ''}
          onChange={(e) => onFilterChange('source', e.target.value)}
          aria-label="Filter by source"
        >
          {sourceOptions.map(o => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>

        {/* Sort */}
        <select
          className="select-field w-36"
          value={filters.sortBy ?? 'latest'}
          onChange={(e) => onFilterChange('sortBy', e.target.value)}
          aria-label="Sort order"
        >
          {sortOptions.map(o => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>

        {/* Clear */}
        {active && (
          <button
            onClick={onReset}
            className="btn-ghost btn-sm flex items-center gap-1 text-red-500 hover:bg-red-50 hover:text-red-700"
            aria-label="Clear all filters"
          >
            <X className="w-3 h-3" />
            Clear
          </button>
        )}

        {/* Active filter count chip */}
        {active && (
          <span className="badge" style={{ background: 'var(--primary-light)', color: 'var(--primary)' }}>
            <SlidersHorizontal className="w-3 h-3" />
            Filtered
          </span>
        )}
      </div>
    </div>
  );
};
