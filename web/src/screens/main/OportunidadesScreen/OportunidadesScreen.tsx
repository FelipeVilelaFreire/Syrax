'use client';
import styles from './OportunidadesScreen.module.css';
import { OportunidadeCard } from '@/src/components/cards/OportunidadeCard';
import { KpiCard } from '@/src/components/features/KpiCard';
import { ErrorState } from '@/src/components/ui/ErrorState';
import { PageSkeleton } from '@/src/components/ui/Skeleton';
import { STRINGS } from '@/src/constants/strings';
import { formatBRL } from '@/src/lib/format';
import { useOportunidadesScreen } from '@/src/hooks/oportunidades/useOportunidadesScreen';

export function OportunidadesScreen() {
  const { leads, loading, error, kpis, handleTriggerAi, refresh } = useOportunidadesScreen();
  const s = STRINGS.oportunidades;

  if (loading) return <PageSkeleton />;
  if (error) return <ErrorState message={error} onRetry={refresh} />;

  return (
    <div className={styles.screen}>
      <div className={styles.kpiRow}>
        <KpiCard label={s.kpi.totalRisco} value={formatBRL(kpis.totalRisco)} />
        <KpiCard label={s.kpi.altaProbabilidade} value={String(kpis.altaProbabilidade)} />
        <KpiCard
          label={s.kpi.tempoMedioParado}
          value={`${Math.round(kpis.tempoMedioParado)}h`}
        />
      </div>

      <div className={styles.grid}>
        {leads.length === 0 && <p className={styles.empty}>{s.emptyState}</p>}
        {leads.map((lead) => (
          <OportunidadeCard
            key={lead.id}
            lead={lead}
            onTriggerAi={() => handleTriggerAi(lead)}
          />
        ))}
      </div>
    </div>
  );
}
