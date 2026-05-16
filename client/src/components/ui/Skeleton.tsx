// ─────────────────────────────────────────────────────────────────────────────
// src/components/ui/Skeleton.tsx – Loading skeleton components
// ─────────────────────────────────────────────────────────────────────────────

import React from 'react';
import { cn } from '../../utils/cn';

interface SkeletonProps {
  className?: string;
}

export const Skeleton: React.FC<SkeletonProps> = ({ className }) => (
  <div className={cn('skeleton', className)} />
);

export const LeadRowSkeleton: React.FC = () => (
  <tr>
    {[...Array(7)].map((_, i) => (
      <td key={i} className="table-cell">
        <Skeleton className={cn('h-4 rounded', i === 0 ? 'w-32' : i === 1 ? 'w-40' : 'w-20')} />
      </td>
    ))}
  </tr>
);

export const StatCardSkeleton: React.FC = () => (
  <div className="card p-6">
    <Skeleton className="h-4 w-24 mb-3" />
    <Skeleton className="h-8 w-16 mb-2" />
    <Skeleton className="h-3 w-32" />
  </div>
);
