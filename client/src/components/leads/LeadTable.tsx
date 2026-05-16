// ─────────────────────────────────────────────────────────────────────────────
// src/components/leads/LeadTable.tsx – Precision CRM table design
// ─────────────────────────────────────────────────────────────────────────────

import React, { useState } from 'react';
import { format } from 'date-fns';
import { Edit2, Trash2, Eye, MoreHorizontal } from 'lucide-react';
import { StatusBadge, SourceBadge } from '../ui/Badge';
import { ConfirmDialog } from '../ui/ConfirmDialog';
import { Lead } from '../../types';
import { cn } from '../../utils/cn';

interface LeadTableProps {
  leads: Lead[];
  isLoading: boolean;
  onEdit: (lead: Lead) => void;
  onDelete: (id: string) => Promise<boolean>;
  onView: (lead: Lead) => void;
}

const ROW_SKELETON = () => (
  <tr>
    {[1,2,3,4,5,6].map(i => (
      <td key={i} className="px-4 py-3">
        <div className={cn('skeleton h-4 rounded', i === 1 ? 'w-32' : i === 2 ? 'w-40' : 'w-20')} />
      </td>
    ))}
  </tr>
);

export const LeadTable: React.FC<LeadTableProps> = ({
  leads,
  isLoading,
  onEdit,
  onDelete,
  onView,
}) => {
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!deleteId) return;
    setIsDeleting(true);
    await onDelete(deleteId);
    setIsDeleting(false);
    setDeleteId(null);
  };

  return (
    <>
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="data-table" aria-label="Leads table">
            <thead>
              <tr>
                <th scope="col">Name</th>
                <th scope="col">Email</th>
                <th scope="col">Status</th>
                <th scope="col">Source</th>
                <th scope="col">Created</th>
                <th scope="col" className="text-right pr-5">Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                [...Array(5)].map((_, i) => <ROW_SKELETON key={i} />)
              ) : leads.length === 0 ? (
                <tr>
                  <td colSpan={6}>
                    <div className="empty-state py-12">
                      <div
                        className="w-12 h-12 rounded-xl flex items-center justify-center mb-3"
                        style={{ background: 'var(--surface-container)' }}
                      >
                        <span className="text-2xl">📋</span>
                      </div>
                      <p className="font-medium text-sm" style={{ color: 'var(--on-surface)' }}>
                        No leads found
                      </p>
                      <p className="text-xs mt-1">
                        Try adjusting your filters or add a new lead to get started.
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                leads.map((lead) => (
                  <tr key={lead._id}>
                    {/* Name */}
                    <td>
                      <div className="flex items-center gap-2.5">
                        <div
                          className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
                          style={{ background: 'linear-gradient(135deg,#6366f1,#4f46e5)' }}
                        >
                          {lead.name.charAt(0).toUpperCase()}
                        </div>
                        <button
                          onClick={() => onView(lead)}
                          className="font-medium text-sm hover:underline"
                          style={{ color: 'var(--on-surface)' }}
                        >
                          {lead.name}
                        </button>
                      </div>
                    </td>

                    {/* Email */}
                    <td>
                      <a
                        href={`mailto:${lead.email}`}
                        className="text-sm hover:underline"
                        style={{ color: 'var(--on-surface-muted)' }}
                      >
                        {lead.email}
                      </a>
                    </td>

                    {/* Status */}
                    <td>
                      <StatusBadge status={lead.status} />
                    </td>

                    {/* Source */}
                    <td>
                      <SourceBadge source={lead.source} />
                    </td>

                    {/* Created */}
                    <td className="text-sm text-muted whitespace-nowrap">
                      {format(new Date(lead.createdAt), 'MMM d, yyyy')}
                    </td>

                    {/* Actions */}
                    <td className="text-right pr-4">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => onView(lead)}
                          className="btn-ghost w-7 h-7 p-0 rounded"
                          aria-label={`View ${lead.name}`}
                          title="View details"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => onEdit(lead)}
                          className="btn-ghost w-7 h-7 p-0 rounded"
                          aria-label={`Edit ${lead.name}`}
                          title="Edit lead"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setDeleteId(lead._id)}
                          className="btn-ghost w-7 h-7 p-0 rounded text-red-400 hover:bg-red-50 hover:text-red-600"
                          aria-label={`Delete ${lead.name}`}
                          title="Delete lead"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
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
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        isLoading={isDeleting}
        title="Delete Lead"
        description="This will permanently delete the lead and all associated data. This action cannot be undone."
        confirmLabel="Delete Lead"
      />
    </>
  );
};
