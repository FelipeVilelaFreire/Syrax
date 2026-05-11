'use client';
import { useState, useEffect, useCallback } from 'react';
import { integrationService } from '@/src/services/integrationService';
import { companyService } from '@/src/services/companyService';
import { getErrorMessage } from '@/src/lib/errors';
import type { Integration } from '@/src/types/integration';
import type { Company } from '@/src/types/company';

export function useIntegracoesScreen() {
  const [integrations, setIntegrations] = useState<Integration[]>([]);
  const [company, setCompany] = useState<Company | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const [intRes, comp] = await Promise.all([
        integrationService.list(),
        companyService.me(),
      ]);
      setIntegrations(intRes.results);
      setCompany(comp);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { refresh(); }, [refresh]);

  const getWebhookUrl = useCallback((platform: string) => {
    if (!company) return '';
    const base = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000/api';
    return `${base}/webhooks/${platform}/${company.webhook_token}/`;
  }, [company]);

  return { integrations, company, loading, error, getWebhookUrl, refresh };
}
