// src/components/leads/LeadTable.tsx — Shopeers-inspired data table

import React from 'react';
import { Eye, Pencil, Trash2, Users } from 'lucide-react';
import { StatusBadge, SourceBadge } from '../ui/Badge';
import { EmptyState } from '../ui/EmptyState';
import { LeadRowSkeleton } from '../ui/Skeleton';
import type { Lead } from '../../types';
import { format } from 'date-fns';

interface LeadTableProps {
  leads: Lead[];
  isLoading: boolean;
  onEdit: (lead: Lead) => void;
  onDelete: (lead: Lead) => void;
  onView: (lead: Lead) => void;
}

export const LeadTable: React.FC<LeadTableProps> = React.memo(({
  leads, isLoading, onEdit, onDelete, onView,
}) => {
  if (!isLoading && leads.length === 0) {
    return (
      <EmptyState
        icon={Users}
        title="No leads found"
        description="Add your first lead or adjust your filters."
      />
    );
  }

  return (
    <div style={{ overflowX: 'auto' }}>
      <table className="data-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Status</th>
            <th className="col-source">Source</th>
            <th className="col-date">Created</th>
            <th style={{ textAlign: 'right' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {isLoading ? (
            [...Array(5)].map((_, i) => <LeadRowSkeleton key={i} />)
          ) : (
            leads.map((lead) => (
              <tr key={lead._id}>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{
                      width: 32, height: 32, borderRadius: '50%',
                      background: 'var(--primary-light)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 12, fontWeight: 700, color: 'var(--primary)',
                      flexShrink: 0,
                    }}>
                      {lead.name.charAt(0).toUpperCase()}
                    </div>
                    <span style={{ fontWeight: 500 }}>{lead.name}</span>
                  </div>
                </td>
                <td style={{ color: 'var(--on-surface-muted)' }}>{lead.email}</td>
                <td><StatusBadge status={lead.status} /></td>
                <td className="col-source"><SourceBadge source={lead.source} /></td>
                <td className="col-date" style={{ color: 'var(--on-surface-muted)', fontSize: 12.5 }}>
                  {format(new Date(lead.createdAt), 'MMM d, yyyy')}
                </td>
                <td>
                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 4 }}>
                    {[
                      { icon: <Eye className="w-3.5 h-3.5" />, onClick: () => onView(lead), label: 'View' },
                      { icon: <Pencil className="w-3.5 h-3.5" />, onClick: () => onEdit(lead), label: 'Edit' },
                      { icon: <Trash2 className="w-3.5 h-3.5" />, onClick: () => onDelete(lead), label: 'Delete', danger: true },
                    ].map(({ icon, onClick, label, danger }) => (
                      <button
                        key={label}
                        onClick={onClick}
                        aria-label={label}
                        className="btn-ghost"
                        style={{
                          width: 30, height: 30, padding: 0,
                          borderRadius: 'var(--radius-sm)',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          color: danger ? '#ef4444' : 'var(--on-surface-muted)',
                        }}
                      >
                        {icon}
                      </button>
                    ))}
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
});
