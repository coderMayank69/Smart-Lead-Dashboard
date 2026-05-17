import type { Lead } from '../types';
import { format } from 'date-fns';

// Wrap a cell in quotes if it contains commas, quotes, or newlines.
const escapeCell = (value: unknown): string => {
  const str = value == null ? '' : String(value);
  if (str.includes(',') || str.includes('"') || str.includes('\n')) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
};

const CSV_HEADERS = [
  'Name', 'Email', 'Status', 'Source', 'Notes',
  'Created By', 'Created At', 'Updated At',
];

export const exportLeadsToCSV = (leads: Lead[], filename?: string): void => {
  const rows = leads.map((lead) => [
    lead.name,
    lead.email,
    lead.status,
    lead.source,
    lead.notes ?? '',
    lead.createdBy?.name ?? '',
    format(new Date(lead.createdAt), 'yyyy-MM-dd HH:mm'),
    format(new Date(lead.updatedAt), 'yyyy-MM-dd HH:mm'),
  ]);

  const csvContent = [
    CSV_HEADERS.map(escapeCell).join(','),
    ...rows.map((row) => row.map(escapeCell).join(',')),
  ].join('\r\n');

  // Prepend BOM so Excel opens UTF-8 files correctly
  const blob = new Blob([`\uFEFF${csvContent}`], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename ?? `leads_export_${format(new Date(), 'yyyy-MM-dd')}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
