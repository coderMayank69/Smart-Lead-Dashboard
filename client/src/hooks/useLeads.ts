// Lead data fetching and mutation hooks.
//
// useLeads: manages the full leads list with pagination, filtering, and CRUD.
// useLeadStats: fetches aggregate stats for the dashboard — fires once on mount.
//
// Search is debounced at 400ms to avoid hammering the API on each keystroke.

import { useState, useEffect, useCallback } from 'react';
import { leadsApi } from '../api/leads.api';
import type { Lead, LeadFilters, PaginationMeta, CreateLeadPayload, UpdateLeadPayload, LeadStats } from '../types';
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

// Simple in-memory cache for API requests
const cache = new Map<string, { leads: Lead[]; meta: PaginationMeta; timestamp: number }>();
const CACHE_TTL = 1000 * 60 * 5; // 5 minutes

export const useLeads = () => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [meta, setMeta] = useState<PaginationMeta | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [filters, setFilters] = useState<LeadFilters>(DEFAULT_FILTERS);

  const debouncedSearch = useDebounce(filters.search, 400);

  const fetchLeads = useCallback(async (forceRefresh = false) => {
    setIsLoading(true);
    try {
      const queryKey = JSON.stringify({ ...filters, search: debouncedSearch });
      
      // Check cache first
      if (!forceRefresh && cache.has(queryKey)) {
        const cached = cache.get(queryKey)!;
        if (Date.now() - cached.timestamp < CACHE_TTL) {
          setLeads(cached.leads);
          setMeta(cached.meta);
          setIsLoading(false);
          return;
        }
      }

      const response = await leadsApi.getAll({
        ...filters,
        search: debouncedSearch,
      });
      
      const newLeads = response.data?.leads ?? [];
      const newMeta = response.meta ?? null;
      
      // Save to cache
      if (newMeta) {
        cache.set(queryKey, { leads: newLeads, meta: newMeta, timestamp: Date.now() });
      }

      setLeads(newLeads);
      setMeta(newMeta);
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
      // Reset to page 1 when any filter other than page itself changes
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
      toast.success('Lead created successfully!');
      cache.clear(); // Invalidate cache
      await fetchLeads(true);
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
      toast.success('Lead updated');
      cache.clear(); // Invalidate cache
      await fetchLeads(true);
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
      cache.clear(); // Invalidate cache
      await fetchLeads(true);
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
        // stats are supplementary — don't surface this to the user
      } finally {
        setIsLoading(false);
      }
    };
    fetch();
  }, []);

  return { stats, isLoading };
};
