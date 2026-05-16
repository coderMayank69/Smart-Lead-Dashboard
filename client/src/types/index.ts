// ─────────────────────────────────────────────────────────────────────────────
// src/types/index.ts – Shared TypeScript interfaces for the client
// ─────────────────────────────────────────────────────────────────────────────

// ── Auth ──────────────────────────────────────────────────────────────────────
export type UserRole = 'admin' | 'sales';

export interface User {
  _id: string;
  name: string;
  email: string;
  role: UserRole;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

// ── Leads ─────────────────────────────────────────────────────────────────────
export type LeadStatus = 'New' | 'Contacted' | 'Qualified' | 'Lost';
export type LeadSource = 'Website' | 'Instagram' | 'Referral';
export type SortOrder = 'latest' | 'oldest';

export interface Lead {
  _id: string;
  name: string;
  email: string;
  status: LeadStatus;
  source: LeadSource;
  notes?: string;
  assignedTo?: User;
  createdBy: User;
  createdAt: string;
  updatedAt: string;
}

export interface CreateLeadPayload {
  name: string;
  email: string;
  status?: LeadStatus;
  source: LeadSource;
  notes?: string;
  assignedTo?: string;
}

export interface UpdateLeadPayload extends Partial<CreateLeadPayload> {}

// ── Filters ───────────────────────────────────────────────────────────────────
export interface LeadFilters {
  status?: LeadStatus | '';
  source?: LeadSource | '';
  search: string;
  sortBy: SortOrder;
  page: number;
  limit: number;
}

// ── API Response ──────────────────────────────────────────────────────────────
export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
  meta?: PaginationMeta;
}

// ── Stats ─────────────────────────────────────────────────────────────────────
export interface StatItem {
  _id: string;
  count: number;
}

export interface LeadStats {
  total: number;
  byStatus: StatItem[];
  bySource: StatItem[];
}
