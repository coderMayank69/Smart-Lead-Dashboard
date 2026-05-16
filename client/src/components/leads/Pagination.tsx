// ─────────────────────────────────────────────────────────────────────────────
// src/components/leads/Pagination.tsx – Page navigation
// ─────────────────────────────────────────────────────────────────────────────

import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { PaginationMeta } from '../../types';
import { cn } from '../../utils/cn';

interface PaginationProps {
  meta: PaginationMeta;
  onPageChange: (page: number) => void;
}

export const Pagination: React.FC<PaginationProps> = ({ meta, onPageChange }) => {
  const { page, totalPages, total, limit, hasNextPage, hasPrevPage } = meta;

  const start = (page - 1) * limit + 1;
  const end = Math.min(page * limit, total);

  // Generate page numbers to display
  const getPages = (): (number | '...')[] => {
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    const pages: (number | '...')[] = [1];
    if (page > 3) pages.push('...');
    for (let i = Math.max(2, page - 1); i <= Math.min(totalPages - 1, page + 1); i++) {
      pages.push(i);
    }
    if (page < totalPages - 2) pages.push('...');
    pages.push(totalPages);
    return pages;
  };

  return (
    <div className="flex items-center justify-between">
      <p className="text-sm text-slate-500 dark:text-slate-400">
        Showing <span className="font-medium text-slate-700 dark:text-slate-300">{start}–{end}</span> of{' '}
        <span className="font-medium text-slate-700 dark:text-slate-300">{total}</span> leads
      </p>

      <div className="flex items-center gap-1">
        <button
          onClick={() => onPageChange(page - 1)}
          disabled={!hasPrevPage}
          className={cn(
            'p-2 rounded-lg text-slate-500 hover:text-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800',
            'disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-150'
          )}
          aria-label="Previous page"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        {getPages().map((p, i) =>
          p === '...' ? (
            <span key={`ellipsis-${i}`} className="px-2 text-slate-400">…</span>
          ) : (
            <button
              key={p}
              onClick={() => onPageChange(p as number)}
              className={cn(
                'w-8 h-8 rounded-lg text-sm font-medium transition-all duration-150',
                p === page
                  ? 'bg-primary-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
              )}
              aria-label={`Page ${p}`}
              aria-current={p === page ? 'page' : undefined}
            >
              {p}
            </button>
          )
        )}

        <button
          onClick={() => onPageChange(page + 1)}
          disabled={!hasNextPage}
          className={cn(
            'p-2 rounded-lg text-slate-500 hover:text-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800',
            'disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-150'
          )}
          aria-label="Next page"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
