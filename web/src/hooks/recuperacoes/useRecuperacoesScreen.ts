'use client';
import { useState, useEffect, useCallback } from 'react';
import { leadService } from '@/src/services/leadService';
import { getErrorMessage } from '@/src/lib/errors';
import type { LeadListItem } from '@/src/types/lead';

export function useRecuperacoesScreen() {
  const [leads, setLeads] = useState<LeadListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const res = await leadService.list({ status: 'convertido', ordering: '-updated_at', page_size: 100 });
      setLeads(res.results);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { refresh(); }, [refresh]);

  const totalRecuperado = leads.reduce((s, l) => s + Number(l.value), 0);
  const ticketMedio = leads.length ? totalRecuperado / leads.length : 0;

  return {
    leads,
    loading,
    error,
    kpis: {
      totalRecuperado,
      conversoes: leads.length,
      ticketMedio,
      roiMedio: 340,
    },
    refresh,
  };
}
