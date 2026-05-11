'use client';
import { useState, useEffect, useCallback } from 'react';
import { leadService } from '@/src/services/leadService';
import { getErrorMessage } from '@/src/lib/errors';
import type { LeadListItem, Lead } from '@/src/types/lead';

export function useConversasScreen() {
  const [leads, setLeads] = useState<LeadListItem[]>([]);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const res = await leadService.list({ status: 'em_contato', page_size: 50 });
      setLeads(res.results);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { refresh(); }, [refresh]);

  const selectLead = useCallback(async (id: string) => {
    setLoadingDetail(true);
    try {
      const detail = await leadService.retrieve(id);
      setSelectedLead(detail);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoadingDetail(false);
    }
  }, []);

  const handleAddNote = useCallback(async (content: string) => {
    if (!selectedLead) return;
    try {
      const interaction = await leadService.addInteraction(selectedLead.id, { type: 'note', content });
      setSelectedLead((prev) => prev ? { ...prev, interactions: [interaction, ...prev.interactions] } : prev);
    } catch (err) {
      setError(getErrorMessage(err));
    }
  }, [selectedLead]);

  return { leads, selectedLead, loading, loadingDetail, error, selectLead, handleAddNote, refresh };
}
