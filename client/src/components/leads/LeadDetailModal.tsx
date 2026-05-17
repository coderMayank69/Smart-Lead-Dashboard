import React from 'react';
import { format } from 'date-fns';
import { Mail, Calendar, User, FileText } from 'lucide-react';
import { Modal } from '../ui/Modal';
import { StatusBadge, SourceBadge } from '../ui/Badge';
import { Button } from '../ui/Button';
import type { Lead } from '../../types';

interface LeadDetailModalProps {
  lead: Lead | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit: (lead: Lead) => void;
}

interface DetailRowProps {
  icon: React.ReactNode;
  label: string;
  value: React.ReactNode;
}

const DetailRow: React.FC<DetailRowProps> = ({ icon, label, value }) => (
  <div className="flex items-start gap-3 py-3 border-b border-slate-100 dark:border-slate-800 last:border-0">
    <div className="text-slate-400 mt-0.5 flex-shrink-0">{icon}</div>
    <div>
      <p className="text-xs text-slate-400 mb-0.5">{label}</p>
      <div className="text-sm text-slate-700 dark:text-slate-300">{value}</div>
    </div>
  </div>
);

export const LeadDetailModal: React.FC<LeadDetailModalProps> = ({
  lead,
  isOpen,
  onClose,
  onEdit,
}) => {
  if (!lead) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Lead Details"
    >
      {/* Name header */}
      <div className="flex items-center gap-4 mb-6 pb-5 border-b border-slate-200 dark:border-slate-700">
        <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary-400 to-blue-600 flex items-center justify-center text-white text-xl font-bold">
          {lead.name.charAt(0).toUpperCase()}
        </div>
        <div>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
            {lead.name}
          </h3>
          <p className="text-sm text-slate-400">{lead.email}</p>
          <div className="flex gap-2 mt-2">
            <StatusBadge status={lead.status} />
            <SourceBadge source={lead.source} />
          </div>
        </div>
      </div>

      {/* Details grid */}
      <div className="space-y-0">
        <DetailRow
          icon={<Mail className="w-4 h-4" />}
          label="Email"
          value={<a href={`mailto:${lead.email}`} className="text-primary-600 hover:underline">{lead.email}</a>}
        />
        <DetailRow
          icon={<User className="w-4 h-4" />}
          label="Created By"
          value={lead.createdBy?.name ?? '—'}
        />
        <DetailRow
          icon={<Calendar className="w-4 h-4" />}
          label="Created At"
          value={format(new Date(lead.createdAt), 'PPP')}
        />
        <DetailRow
          icon={<Calendar className="w-4 h-4" />}
          label="Last Updated"
          value={format(new Date(lead.updatedAt), 'PPP p')}
        />
        {lead.notes && (
          <DetailRow
            icon={<FileText className="w-4 h-4" />}
            label="Notes"
            value={<p className="whitespace-pre-wrap">{lead.notes}</p>}
          />
        )}
      </div>

      {/* Footer actions */}
      <div className="flex gap-3 mt-6">
        <Button variant="secondary" className="flex-1" onClick={onClose}>
          Close
        </Button>
        <Button
          variant="primary"
          className="flex-1"
          onClick={() => { onClose(); onEdit(lead); }}
        >
          Edit Lead
        </Button>
      </div>
    </Modal>
  );
};
