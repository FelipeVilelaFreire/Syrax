'use client';
import { useState, useEffect, useCallback } from 'react';
import { leadService } from '@/src/services/leadService';
import { getErrorMessage } from '@/src/lib/errors';
import { STRINGS } from '@/src/constants/strings';
import type { LeadListItem } from '@/src/types/lead';

export function useOportunidadesScreen() {
  const [leads, setLeads] = useState<LeadListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await leadService.list({
        status: 'novo',
        ordering: '-score',
        page_size: 100,
      });
      // Include em_contato too
      const inContact = await leadService.list({
        status: 'em_contato',
        ordering: '-score',
        page_size: 100,
      });
      setLeads([...res.results, ...inContact.results]);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { refresh(); }, [refresh]);

  const totalRisco = leads.reduce((s, l) => s + Number(l.value), 0);
  const altaProbabilidade = leads.filter((l) => l.score >= 60).length;
  const tempoMedioParado = leads.length
    ? leads.reduce((s, l) => s + l.time_without_contact, 0) / leads.length
    : 0;

  const handleTriggerAi = useCallback(async (lead: LeadListItem) => {
    const phone = lead.phone.replace(/\D/g, '');
    const text = STRINGS.lead.whatsappTemplate(lead.name, lead.product_name, lead.value);
    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(text)}`, '_blank');
    try {
      const updated = await leadService.triggerAi(lead.id);
      setLeads((prev) => prev.map((l) => (l.id === lead.id ? { ...l, ...updated } : l)));
    } catch (err) {
      setError(getErrorMessage(err));
    }
  }, []);

  return {
    leads,
    loading,
    error,
    kpis: { totalRisco, altaProbabilidade, tempoMedioParado },
    handleTriggerAi,
    refresh,
  };
}
