// src/pages/LeadsPage.tsx — Shopeers-inspired leads management page

import React, { useState, useCallback } from 'react';
import { Plus, Download, Search, Filter, RefreshCw } from 'lucide-react';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { LeadTable } from '../components/leads/LeadTable';
import { LeadForm } from '../components/leads/LeadForm';
import { Modal } from '../components/ui/Modal';
import { Button } from '../components/ui/Button';
import { ConfirmDialog } from '../components/ui/ConfirmDialog';
import { useLeads } from '../hooks/useLeads';
import { exportLeadsToCSV } from '../utils/csv';
import { LEAD_STATUSES, LEAD_SOURCES, SORT_OPTIONS } from '../utils/constants';
import type { Lead, CreateLeadPayload, UpdateLeadPayload } from '../types';
import toast from 'react-hot-toast';

export const LeadsPage: React.FC = () => {
  const {
    leads, meta, isLoading, isSubmitting,
    filters, updateFilter, resetFilters, refetch,
    createLead, updateLead, deleteLead,
  } = useLeads();

  const [modalOpen, setModalOpen] = useState(false);
  const [editingLead, setEditingLead] = useState<Lead | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Lead | null>(null);
  const [viewingLead, setViewingLead] = useState<Lead | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleCreate = useCallback(async (data: CreateLeadPayload) => {
    const ok = await createLead(data);
    if (ok) setModalOpen(false);
    return ok;
  }, [createLead]);

  const handleUpdate = useCallback(async (data: UpdateLeadPayload) => {
    if (!editingLead) return false;
    const ok = await updateLead(editingLead._id, data);
    if (ok) setEditingLead(null);
    return ok;
  }, [editingLead, updateLead]);

  const handleDelete = useCallback(async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    await deleteLead(deleteTarget._id);
    setDeleteTarget(null);
    setIsDeleting(false);
  }, [deleteTarget, deleteLead]);

  const handleExportCSV = useCallback(() => {
    if (!leads.length) return toast.error('No leads to export');
    exportLeadsToCSV(leads);
    toast.success('CSV exported');
  }, [leads]);

  const totalPages = meta?.totalPages ?? 1;

  return (
    <DashboardLayout
      title="Leads"
      subtitle={`${meta?.total ?? 0} total leads in your pipeline`}
    >
      {/* Action Bar */}
      <div className="card p-4 mb-5 animate-fade-in">
        <div className="filter-bar" style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
          {/* Search */}
          <div className="search-wrapper" style={{ flex: 1, minWidth: 200 }}>
            <Search className="search-icon" />
            <input
              className="search-input"
              placeholder="Search leads by name or email..."
              value={filters.search}
              onChange={(e) => updateFilter('search', e.target.value)}
            />
          </div>

          {/* Status Filter */}
          <select
            className="select-field"
            style={{ width: 140 }}
            value={filters.status}
            onChange={(e) => updateFilter('status', e.target.value)}
          >
            <option value="">All Status</option>
            {LEAD_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>

          {/* Source Filter */}
          <select
            className="select-field"
            style={{ width: 140 }}
            value={filters.source}
            onChange={(e) => updateFilter('source', e.target.value)}
          >
            <option value="">All Sources</option>
            {LEAD_SOURCES.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>

          {/* Sort */}
          <select
            className="select-field"
            style={{ width: 140 }}
            value={filters.sortBy}
            onChange={(e) => updateFilter('sortBy', e.target.value)}
          >
            {SORT_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>

          {/* Actions */}
          <div className="page-actions" style={{ display: 'flex', gap: 8, marginLeft: 'auto' }}>
            <Button variant="ghost" size="sm" onClick={resetFilters} leftIcon={<Filter className="w-3.5 h-3.5" />}>
              Clear
            </Button>
            <Button variant="secondary" size="sm" onClick={handleExportCSV} leftIcon={<Download className="w-3.5 h-3.5" />}>
              Export
            </Button>
            <Button size="sm" onClick={() => setModalOpen(true)} leftIcon={<Plus className="w-3.5 h-3.5" />}>
              Add Lead
            </Button>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="card animate-slide-up table-scroll-wrapper" style={{ animationDelay: '100ms', animationFillMode: 'both' }}>
        <LeadTable
          leads={leads}
          isLoading={isLoading}
          onEdit={setEditingLead}
          onDelete={setDeleteTarget}
          onView={setViewingLead}
        />

        {/* Pagination */}
        {totalPages > 1 && (
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '14px 20px', borderTop: '1px solid var(--outline)',
          }}>
            <span style={{ fontSize: 12.5, color: 'var(--on-surface-muted)' }}>
              Page {filters.page} of {totalPages} · {meta?.total ?? 0} leads
            </span>
            <div style={{ display: 'flex', gap: 6 }}>
              <Button
                variant="secondary" size="sm"
                disabled={filters.page <= 1}
                onClick={() => updateFilter('page', filters.page - 1)}
              >
                Previous
              </Button>
              <Button
                variant="secondary" size="sm"
                disabled={filters.page >= totalPages}
                onClick={() => updateFilter('page', filters.page + 1)}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Create Modal */}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Create New Lead">
        <LeadForm onSubmit={handleCreate} isSubmitting={isSubmitting} />
      </Modal>

      {/* Edit Modal */}
      <Modal isOpen={!!editingLead} onClose={() => setEditingLead(null)} title="Edit Lead">
        {editingLead && (
          <LeadForm
            initialData={editingLead}
            onSubmit={handleUpdate}
            isSubmitting={isSubmitting}
          />
        )}
      </Modal>

      {/* View Modal */}
      <Modal isOpen={!!viewingLead} onClose={() => setViewingLead(null)} title="Lead Details">
        {viewingLead && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {[
              { label: 'Name', value: viewingLead.name },
              { label: 'Email', value: viewingLead.email },
              { label: 'Status', value: viewingLead.status },
              { label: 'Source', value: viewingLead.source },
              { label: 'Notes', value: viewingLead.notes || '—' },
              { label: 'Created', value: new Date(viewingLead.createdAt).toLocaleString() },
            ].map(({ label, value }) => (
              <div key={label}>
                <p style={{ fontSize: 11.5, fontWeight: 600, color: 'var(--on-surface-muted)', marginBottom: 4, textTransform: 'uppercase', letterSpacing: '.05em' }}>{label}</p>
                <p style={{ fontSize: 14, color: 'var(--on-surface)' }}>{value}</p>
              </div>
            ))}
          </div>
        )}
      </Modal>

      {/* Delete Confirm */}
      <ConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Delete Lead"
        description={`Are you sure you want to delete "${deleteTarget?.name}"? This action cannot be undone.`}
        isLoading={isDeleting}
      />
    </DashboardLayout>
  );
};
