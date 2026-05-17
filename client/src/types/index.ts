// Shared TypeScript types for the client.
// All exports are type-only — nothing here gets emitted at runtime.

export type UserRole = 'admin' | 'sales';

export type User = {
  _id: string;
  name: string;
  email: string;
  role: UserRole;
  createdAt: string;
  updatedAt: string;
};

export type AuthResponse = {
  user: User;
  token: string;
};

export type LeadStatus = 'New' | 'Contacted' | 'Qualified' | 'Lost';
export type LeadSource = 'Website' | 'Instagram' | 'Referral';
export type SortOrder = 'latest' | 'oldest';

export type Lead = {
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
};

export type CreateLeadPayload = {
  name: string;
  email: string;
  status?: LeadStatus;
  source: LeadSource;
  notes?: string;
  assignedTo?: string;
};

export type UpdateLeadPayload = Partial<CreateLeadPayload>;

export type LeadFilters = {
  status?: LeadStatus | '';
  source?: LeadSource | '';
  search: string;
  sortBy: SortOrder;
  page: number;
  limit: number;
};

export type PaginationMeta = {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
};

export type ApiResponse<T = unknown> = {
  success: boolean;
  message: string;
  data?: T;
  meta?: PaginationMeta;
};

export type StatItem = {
  _id: string;
  count: number;
};

export type LeadStats = {
  total: number;
  byStatus: StatItem[];
  bySource: StatItem[];
};
