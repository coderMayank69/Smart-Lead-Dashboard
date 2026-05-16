// ─────────────────────────────────────────────────────────────────────────────
// src/components/leads/LeadTable.tsx – Leads data table with actions
// ─────────────────────────────────────────────────────────────────────────────

import React, { useState } from 'react';
import { Edit2, Trash2, Eye, Users } from 'lucide-react';
import { format } from 'date-fns';
import { Lead } from '../../types';
import { StatusBadge, SourceBadge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { EmptyState } from '../ui/EmptyState';
import { LeadRowSkeleton } from '../ui/Skeleton';
import { ConfirmDialog } from '../ui/ConfirmDialog';
import { useAuthStore } from '../../store/auth.store';
import { cn } from '../../utils/cn';

interface LeadTableProps {
  leads: Lead[];
  isLoading: boolean;
  onEdit: (lead: Lead) => void;
  onDelete: (id: string) => Promise<boolean>;
  onView: (lead: Lead) => void;
}

export const LeadTable: React.FC<LeadTableProps> = ({
  leads,
  isLoading,
  onEdit,
  onDelete,
  onView,
}) => {
  const { user } = useAuthStore();
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [confirmId, setConfirmId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteConfirm = async () => {
    if (!confirmId) return;
    setIsDeleting(true);
    await onDelete(confirmId);
    setIsDeleting(false);
    setConfirmId(null);
  };

  return (
    <>
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-700">
              <tr>
                <th className="table-header">Lead</th>
                <th className="table-header">Status</th>
                <th className="table-header">Source</th>
                <th className="table-header hidden md:table-cell">Created By</th>
                <th className="table-header hidden lg:table-cell">Date</th>
                <th className="table-header text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {isLoading ? (
                <>
                  {[...Array(5)].map((_, i) => <LeadRowSkeleton key={i} />)}
                </>
              ) : leads.length === 0 ? (
                <tr>
                  <td colSpan={6}>
                    <EmptyState
                      icon={Users}
                      title="No leads found"
                      description="Try adjusting your filters or create a new lead to get started."
                    />
                  </td>
                </tr>
              ) : (
                leads.map((lead) => (
                  <tr
                    key={lead._id}
                    className={cn(
                      'hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors',
                      deletingId === lead._id && 'opacity-50'
                    )}
                  >
                    {/* Lead name + email */}
                    <td className="table-cell">
                      <div>
                        <p className="font-medium text-slate-900 dark:text-slate-100">
                          {lead.name}
                        </p>
                        <p className="text-xs text-slate-400">{lead.email}</p>
                      </div>
                    </td>

                    <td className="table-cell">
                      <StatusBadge status={lead.status} />
                    </td>

                    <td className="table-cell">
                      <SourceBadge source={lead.source} />
                    </td>

                    <td className="table-cell hidden md:table-cell">
                      <span className="text-slate-500 dark:text-slate-400">
                        {lead.createdBy?.name ?? '—'}
                      </span>
                    </td>

                    <td className="table-cell hidden lg:table-cell">
                      <span className="text-slate-400 text-xs">
                        {format(new Date(lead.createdAt), 'MMM d, yyyy')}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="table-cell">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => onView(lead)}
                          className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                          aria-label={`View ${lead.name}`}
                          title="View details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => onEdit(lead)}
                          className="p-1.5 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 text-slate-400 hover:text-blue-600 transition-colors"
                          aria-label={`Edit ${lead.name}`}
                          title="Edit lead"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        {(user?.role === 'admin' || lead.createdBy?._id === user?._id) && (
                          <button
                            onClick={() => setConfirmId(lead._id)}
                            className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-slate-400 hover:text-red-600 transition-colors"
                            aria-label={`Delete ${lead.name}`}
                            title="Delete lead"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <ConfirmDialog
        isOpen={!!confirmId}
        onClose={() => setConfirmId(null)}
        onConfirm={handleDeleteConfirm}
        title="Delete Lead"
        description="Are you sure you want to delete this lead? This action cannot be undone."
        isLoading={isDeleting}
      />
    </>
  );
};
