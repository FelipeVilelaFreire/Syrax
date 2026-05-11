'use client';
import { useState, useEffect, useCallback } from 'react';
import { companyService } from '@/src/services/companyService';
import { getErrorMessage } from '@/src/lib/errors';
import type { Company } from '@/src/types/company';
import type { User } from '@/src/types/user';

export function useConfiguracoesScreen() {
  const [company, setCompany] = useState<Company | null>(null);
  const [team, setTeam] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const [comp, teamData] = await Promise.all([
        companyService.me(),
        companyService.team(),
      ]);
      setCompany(comp);
      setTeam(teamData);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { refresh(); }, [refresh]);

  const handleSaveCompany = useCallback(async (data: Partial<Company>) => {
    setIsSaving(true);
    try {
      const updated = await companyService.update(data);
      setCompany(updated);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setIsSaving(false);
    }
  }, []);

  return { company, team, loading, isSaving, error, handleSaveCompany, refresh };
}
