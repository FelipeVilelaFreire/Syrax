'use client';
import { useState, useEffect, useCallback } from 'react';
import { leadService } from '@/src/services/leadService';
import { getErrorMessage } from '@/src/lib/errors';
import type { LeadListItem, LeadStatus, LeadFilters } from '@/src/types/lead';
import type { PaginatedResponse } from '@/src/types/shared';

export function useLeadsScreen() {
  const [data, setData] = useState<PaginatedResponse<LeadListItem> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<LeadStatus | undefined>(undefined);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  const load = useCallback(async (filters: LeadFilters) => {
    setLoading(true);
    setError(null);
    try {
      const res = await leadService.list(filters);
      setData(res);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load({ status: statusFilter, search: search || undefined, page });
  }, [load, statusFilter, search, page]);

  const handleTriggerAi = useCallback(async (id: string) => {
    try {
      const updated = await leadService.triggerAi(id);
      setData((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          results: prev.results.map((l) => (l.id === id ? { ...l, ...updated } : l)),
        };
      });
      // Open wa.me in new tab is handled by the component/screen via the returned lead
      return updated;
    } catch (err) {
      setError(getErrorMessage(err));
      return null;
    }
  }, []);

  return {
    data,
    loading,
    error,
    statusFilter,
    setStatusFilter,
    search,
    setSearch,
    page,
    setPage,
    handleTriggerAi,
    refresh: () => load({ status: statusFilter, search: search || undefined, page }),
  };
}
