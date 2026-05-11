'use client';
import styles from './RecuperacoesScreen.module.css';
import { RecuperacoesTable } from '@/src/components/features/RecuperacoesTable';
import { KpiCard } from '@/src/components/features/KpiCard';
import { ErrorState } from '@/src/components/ui/ErrorState';
import { PageSkeleton } from '@/src/components/ui/Skeleton';
import { STRINGS } from '@/src/constants/strings';
import { formatBRL, formatPercent } from '@/src/lib/format';
import { useRecuperacoesScreen } from '@/src/hooks/recuperacoes/useRecuperacoesScreen';

export function RecuperacoesScreen() {
  const { leads, loading, error, kpis, refresh } = useRecuperacoesScreen();
  const s = STRINGS.recuperacoes;

  if (loading) return <PageSkeleton />;
  if (error) return <ErrorState message={error} onRetry={refresh} />;

  return (
    <div className={styles.screen}>
      <div className={styles.kpiRow}>
        <KpiCard label={s.kpi.totalRecuperado} value={formatBRL(kpis.totalRecuperado)} />
        <KpiCard label={s.kpi.conversoes} value={String(kpis.conversoes)} />
        <KpiCard label={s.kpi.ticketMedio} value={formatBRL(kpis.ticketMedio)} />
        <KpiCard label={s.kpi.roiMedio} value={formatPercent(kpis.roiMedio)} />
      </div>
      <RecuperacoesTable leads={leads} />
    </div>
  );
}
