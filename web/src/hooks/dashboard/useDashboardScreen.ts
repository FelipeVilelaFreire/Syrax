'use client';
import { useState, useEffect, useCallback } from 'react';
import { leadService } from '@/src/services/leadService';
import { getErrorMessage } from '@/src/lib/errors';
import type { LeadListItem } from '@/src/types/lead';

interface DashboardKpis {
  receitaRecuperada: number;
  receitaRecuperadaDelta: number;
  leadsReativados: number;
  conversoesGeradas: number;
  emNegociacao: number;
}

interface RevenuePoint {
  date: string;
  value: number;
}

export function useDashboardScreen() {
  const [kpis, setKpis] = useState<DashboardKpis | null>(null);
  const [revenueData, setRevenueData] = useState<RevenuePoint[]>([]);
  const [recentActions, setRecentActions] = useState<LeadListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [converted, inContact] = await Promise.all([
        leadService.list({ status: 'convertido', page_size: 100 }),
        leadService.list({ status: 'em_contato', page_size: 10 }),
      ]);

      const totalRecovered = converted.results.reduce((sum, l) => sum + Number(l.value), 0);
      setKpis({
        receitaRecuperada: totalRecovered,
        receitaRecuperadaDelta: 12.5,
        leadsReativados: inContact.count,
        conversoesGeradas: converted.count,
        emNegociacao: inContact.results.reduce((sum, l) => sum + Number(l.value), 0),
      });

      // Build 14-day placeholder revenue series from converted leads
      const points: RevenuePoint[] = Array.from({ length: 14 }, (_, i) => {
        const d = new Date();
        d.setDate(d.getDate() - (13 - i));
        return {
          date: d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }),
          value: 0,
        };
      });
      converted.results.forEach((lead) => {
        const leadDate = new Date(lead.created_at);
        const dayIndex = points.findIndex(
          (p) => p.date === leadDate.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }),
        );
        if (dayIndex >= 0) points[dayIndex].value += Number(lead.value);
      });
      setRevenueData(points);

      const recent = await leadService.list({ ordering: '-updated_at', page_size: 5 });
      setRecentActions(recent.results);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { refresh(); }, [refresh]);

  return { kpis, revenueData, recentActions, loading, error, refresh };
}
