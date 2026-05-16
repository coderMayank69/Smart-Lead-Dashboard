// ─────────────────────────────────────────────────────────────────────────────
// src/api/leads.api.ts – Typed leads API calls
// ─────────────────────────────────────────────────────────────────────────────

import { api } from './axios';
import {
  ApiResponse,
  CreateLeadPayload,
  Lead,
  LeadFilters,
  LeadStats,
  UpdateLeadPayload,
} from '../types';

// Build query params from filters (omit empty values)
const buildParams = (filters: Partial<LeadFilters>): Record<string, string> => {
  const params: Record<string, string> = {};
  if (filters.status) params.status = filters.status;
  if (filters.source) params.source = filters.source;
  if (filters.search) params.search = filters.search;
  if (filters.sortBy) params.sortBy = filters.sortBy;
  if (filters.page) params.page = String(filters.page);
  if (filters.limit) params.limit = String(filters.limit);
  return params;
};

export const leadsApi = {
  async getAll(filters: Partial<LeadFilters> = {}) {
    const res = await api.get<ApiResponse<{ leads: Lead[] }>>('/leads', {
      params: buildParams(filters),
    });
    return res.data;
  },

  async getById(id: string) {
    const res = await api.get<ApiResponse<{ lead: Lead }>>(`/leads/${id}`);
    return res.data;
  },

  async create(data: CreateLeadPayload) {
    const res = await api.post<ApiResponse<{ lead: Lead }>>('/leads', data);
    return res.data;
  },

  async update(id: string, data: UpdateLeadPayload) {
    const res = await api.put<ApiResponse<{ lead: Lead }>>(`/leads/${id}`, data);
    return res.data;
  },

  async delete(id: string) {
    const res = await api.delete<ApiResponse>(`/leads/${id}`);
    return res.data;
  },

  async getStats() {
    const res = await api.get<ApiResponse<{ stats: LeadStats }>>('/leads/stats');
    return res.data;
  },
};
