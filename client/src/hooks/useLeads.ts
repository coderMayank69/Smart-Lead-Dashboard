// ─────────────────────────────────────────────────────────────────────────────
// src/hooks/useLeads.ts – Lead data fetching and mutation hooks
// ─────────────────────────────────────────────────────────────────────────────

import { useState, useEffect, useCallback } from 'react';
import { leadsApi } from '../api/leads.api';
import { Lead, LeadFilters, PaginationMeta, CreateLeadPayload, UpdateLeadPayload, LeadStats } from '../types';
import { useDebounce } from './useDebounce';
import toast from 'react-hot-toast';

const DEFAULT_FILTERS: LeadFilters = {
  status: '',
  source: '',
  search: '',
  sortBy: 'latest',
  page: 1,
  limit: 10,
};

export const useLeads = () => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [meta, setMeta] = useState<PaginationMeta | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [filters, setFilters] = useState<LeadFilters>(DEFAULT_FILTERS);

  const debouncedSearch = useDebounce(filters.search, 400);

  const fetchLeads = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await leadsApi.getAll({
        ...filters,
        search: debouncedSearch,
      });
      setLeads(response.data?.leads ?? []);
      setMeta(response.meta ?? null);
    } catch {
      toast.error('Failed to fetch leads');
    } finally {
      setIsLoading(false);
    }
  }, [filters, debouncedSearch]);

  useEffect(() => {
    fetchLeads();
  }, [fetchLeads]);

  const updateFilter = useCallback(<K extends keyof LeadFilters>(key: K, value: LeadFilters[K]) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
      // Reset to page 1 when filter changes (except page itself)
      ...(key !== 'page' ? { page: 1 } : {}),
    }));
  }, []);

  const resetFilters = useCallback(() => {
    setFilters(DEFAULT_FILTERS);
  }, []);

  const createLead = useCallback(async (data: CreateLeadPayload): Promise<boolean> => {
    setIsSubmitting(true);
    try {
      await leadsApi.create(data);
      toast.success('Lead created successfully! 🎉');
      await fetchLeads();
      return true;
    } catch (err: unknown) {
      const message = (err as { response?: { data?: { message?: string } } })
        ?.response?.data?.message ?? 'Failed to create lead';
      toast.error(message);
      return false;
    } finally {
      setIsSubmitting(false);
    }
  }, [fetchLeads]);

  const updateLead = useCallback(async (id: string, data: UpdateLeadPayload): Promise<boolean> => {
    setIsSubmitting(true);
    try {
      await leadsApi.update(id, data);
      toast.success('Lead updated successfully!');
      await fetchLeads();
      return true;
    } catch (err: unknown) {
      const message = (err as { response?: { data?: { message?: string } } })
        ?.response?.data?.message ?? 'Failed to update lead';
      toast.error(message);
      return false;
    } finally {
      setIsSubmitting(false);
    }
  }, [fetchLeads]);

  const deleteLead = useCallback(async (id: string): Promise<boolean> => {
    try {
      await leadsApi.delete(id);
      toast.success('Lead deleted');
      await fetchLeads();
      return true;
    } catch {
      toast.error('Failed to delete lead');
      return false;
    }
  }, [fetchLeads]);

  return {
    leads,
    meta,
    isLoading,
    isSubmitting,
    filters,
    updateFilter,
    resetFilters,
    refetch: fetchLeads,
    createLead,
    updateLead,
    deleteLead,
  };
};

export const useLeadStats = () => {
  const [stats, setStats] = useState<LeadStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await leadsApi.getStats();
        setStats(res.data?.stats ?? null);
      } catch {
        // Silently fail — stats are not critical
      } finally {
        setIsLoading(false);
      }
    };
    fetch();
  }, []);

  return { stats, isLoading };
};
