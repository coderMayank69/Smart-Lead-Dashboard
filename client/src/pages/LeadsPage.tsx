// ─────────────────────────────────────────────────────────────────────────────
// src/pages/LeadsPage.tsx – Full lead management CRUD page
// ─────────────────────────────────────────────────────────────────────────────

import React, { useState } from 'react';
import { Plus, Download } from 'lucide-react';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { LeadFiltersBar } from '../components/leads/LeadFilters';
import { LeadTable } from '../components/leads/LeadTable';
import { LeadForm } from '../components/leads/LeadForm';
import { LeadDetailModal } from '../components/leads/LeadDetailModal';
import { Pagination } from '../components/leads/Pagination';
import { Button } from '../components/ui/Button';
import { useLeads } from '../hooks/useLeads';
import { exportLeadsToCSV } from '../utils/csv';
import { Lead, CreateLeadPayload, UpdateLeadPayload } from '../types';
import toast from 'react-hot-toast';

export const LeadsPage: React.FC = () => {
  const {
    leads,
    meta,
    isLoading,
    isSubmitting,
    filters,
    updateFilter,
    resetFilters,
    createLead,
    updateLead,
    deleteLead,
  } = useLeads();

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingLead, setEditingLead] = useState<Lead | null>(null);
  const [viewingLead, setViewingLead] = useState<Lead | null>(null);

  const handleCreate = async (data: CreateLeadPayload) => {
    return createLead(data);
  };

  const handleUpdate = async (data: UpdateLeadPayload) => {
    if (!editingLead) return false;
    const success = await updateLead(editingLead._id, data);
    if (success) setEditingLead(null);
    return success;
  };

  const handleExportCSV = () => {
    if (leads.length === 0) {
      toast.error('No leads to export');
      return;
    }
    exportLeadsToCSV(leads);
    toast.success(`Exported ${leads.length} leads to CSV ✅`);
  };

  return (
    <DashboardLayout
      title="Leads"
      subtitle={meta ? `${meta.total} total leads` : undefined}
    >
      <div className="space-y-4">
        {/* Page actions */}
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-medium text-slate-500 dark:text-slate-400">
            Manage your leads pipeline
          </h2>
          <div className="flex gap-3">
            <Button
              variant="secondary"
              size="sm"
              leftIcon={<Download className="w-4 h-4" />}
              onClick={handleExportCSV}
              disabled={leads.length === 0}
            >
              Export CSV
            </Button>
            <Button
              variant="primary"
              size="sm"
              leftIcon={<Plus className="w-4 h-4" />}
              onClick={() => setIsCreateOpen(true)}
            >
              Add Lead
            </Button>
          </div>
        </div>

        {/* Filters */}
        <LeadFiltersBar
          filters={filters}
          onFilterChange={updateFilter}
          onReset={resetFilters}
        />

        {/* Table */}
        <LeadTable
          leads={leads}
          isLoading={isLoading}
          onEdit={setEditingLead}
          onDelete={deleteLead}
          onView={setViewingLead}
        />

        {/* Pagination */}
        {meta && meta.totalPages > 1 && (
          <Pagination
            meta={meta}
            onPageChange={(page) => updateFilter('page', page)}
          />
        )}
      </div>

      {/* Create modal */}
      <LeadForm
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onSubmit={handleCreate}
        isLoading={isSubmitting}
      />

      {/* Edit modal */}
      <LeadForm
        isOpen={!!editingLead}
        onClose={() => setEditingLead(null)}
        onSubmit={handleUpdate}
        isLoading={isSubmitting}
        initialData={editingLead ?? undefined}
      />

      {/* Detail modal */}
      <LeadDetailModal
        lead={viewingLead}
        isOpen={!!viewingLead}
        onClose={() => setViewingLead(null)}
        onEdit={(lead) => {
          setViewingLead(null);
          setEditingLead(lead);
        }}
      />
    </DashboardLayout>
  );
};
