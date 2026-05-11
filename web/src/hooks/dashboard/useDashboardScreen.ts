'use client';
import { useState, useEffect, useCallback } from 'react';
import { leadService } from '@/src/services/leadService';
import { getErrorMessage } from '@/src/lib/errors';
import { useRole } from '@/src/hooks/auth/useRole';
import type { LeadListItem } from '@/src/types/lead';

// KPIs visíveis apenas para Gerente (envolvem receita em R$)
export interface AdminKpis {
  receitaRecuperada: number;
  receitaRecuperadaDelta: number;
  emNegociacaoValor: number;
}

// KPIs visíveis para todos (contagens operacionais, sem R$)
export interface OperationalKpis {
  leadsNovos: number;
  emNegociacao: number;
  conversoesGeradas: number;
  leadsPerdidos: number;
}

export interface RevenuePoint {
  date: string;
  value: number;
}

export function useDashboardScreen() {
  const { isAdmin } = useRole();

  const [adminKpis,       setAdminKpis]       = useState<AdminKpis | null>(null);
  const [operationalKpis, setOperationalKpis] = useState<OperationalKpis | null>(null);
  const [revenueData,     setRevenueData]     = useState<RevenuePoint[]>([]);
  const [recentActions,   setRecentActions]   = useState<LeadListItem[]>([]);
  const [loading,         setLoading]         = useState(true);
  const [error,           setError]           = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [novos, emContato, convertidos, perdidos, recent] = await Promise.all([
        leadService.list({ status: 'novo',        page_size: 1 }),
        leadService.list({ status: 'em_contato',  page_size: isAdmin ? 100 : 1 }),
        leadService.list({ status: 'convertido',  page_size: isAdmin ? 100 : 1 }),
        leadService.list({ status: 'perdido',     page_size: 1 }),
        leadService.list({ ordering: '-updated_at', page_size: 5 }),
      ]);

      setOperationalKpis({
        leadsNovos:       novos.count,
        emNegociacao:     emContato.count,
        conversoesGeradas: convertidos.count,
        leadsPerdidos:    perdidos.count,
      });

      if (isAdmin) {
        const allConverted  = convertidos.results;
        const allInContact  = emContato.results;

        setAdminKpis({
          receitaRecuperada:    allConverted.reduce((s, l) => s + Number(l.value), 0),
          receitaRecuperadaDelta: 12.5,
          emNegociacaoValor:    allInContact.reduce((s, l) => s + Number(l.value), 0),
        });

        const points: RevenuePoint[] = Array.from({ length: 14 }, (_, i) => {
          const d = new Date();
          d.setDate(d.getDate() - (13 - i));
          return { date: d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }), value: 0 };
        });
        allConverted.forEach((lead) => {
          const idx = points.findIndex(
            (p) => p.date === new Date(lead.created_at).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }),
          );
          if (idx >= 0) points[idx].value += Number(lead.value);
        });
        setRevenueData(points);
      }

      setRecentActions(recent.results);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, [isAdmin]);

  useEffect(() => { refresh(); }, [refresh]);

  return { isAdmin, adminKpis, operationalKpis, revenueData, recentActions, loading, error, refresh };
}
