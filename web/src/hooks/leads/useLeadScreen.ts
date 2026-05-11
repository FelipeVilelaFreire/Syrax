'use client';
import { useState, useEffect, useCallback } from 'react';
import { leadService } from '@/src/services/leadService';
import { getErrorMessage } from '@/src/lib/errors';
import { STRINGS } from '@/src/constants/strings';
import type { Lead, LeadUpdateData } from '@/src/types/lead';
import type { InteractionCreateData } from '@/src/types/interaction';

export function useLeadScreen(id: string) {
  const [data, setData] = useState<Lead | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setData(await leadService.retrieve(id));
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => { refresh(); }, [refresh]);

  const handleUpdate = useCallback(async (payload: LeadUpdateData) => {
    setIsSaving(true);
    try {
      const updated = await leadService.update(id, payload);
      setData(updated);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setIsSaving(false);
    }
  }, [id]);

  const handleAddNote = useCallback(async (content: string) => {
    if (!content.trim()) return;
    const payload: InteractionCreateData = { type: 'note', content };
    try {
      const interaction = await leadService.addInteraction(id, payload);
      setData((prev) => prev ? { ...prev, interactions: [interaction, ...prev.interactions] } : prev);
    } catch (err) {
      setError(getErrorMessage(err));
    }
  }, [id]);

  const handleTriggerAi = useCallback(async () => {
    if (!data) return;
    const phone = data.phone.replace(/\D/g, '');
    const text = STRINGS.lead.whatsappTemplate(data.name, data.product_name, data.value);
    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(text)}`, '_blank');
    try {
      const updated = await leadService.triggerAi(id);
      setData(updated);
    } catch (err) {
      setError(getErrorMessage(err));
    }
  }, [id, data]);

  return { data, loading, error, isSaving, handleUpdate, handleAddNote, handleTriggerAi, refresh };
}
