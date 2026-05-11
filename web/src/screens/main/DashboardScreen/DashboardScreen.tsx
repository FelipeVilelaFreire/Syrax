'use client';
import styles from './DashboardScreen.module.css';
import { KpiCard } from '@/src/components/features/KpiCard';
import { DashboardCharts } from '@/src/components/features/DashboardCharts';
import { ErrorState } from '@/src/components/ui/ErrorState';
import { PageSkeleton } from '@/src/components/ui/Skeleton';
import { STRINGS } from '@/src/constants/strings';
import { formatBRL, formatDateTime } from '@/src/lib/format';
import { useDashboardScreen } from '@/src/hooks/dashboard/useDashboardScreen';

export function DashboardScreen() {
  const {
    isAdmin,
    adminKpis,
    operationalKpis,
    revenueData,
    recentActions,
    loading,
    error,
    refresh,
  } = useDashboardScreen();

  const s = STRINGS.dashboard;

  if (loading) return <PageSkeleton />;
  if (error)   return <ErrorState message={error} onRetry={refresh} />;
  if (!operationalKpis) return null;

  return (
    <div className={styles.screen}>

      {/* KPIs financeiros — só Gerente */}
      {isAdmin && adminKpis && (
        <div className={styles.kpiGrid}>
          <KpiCard
            label={s.kpi.receitaRecuperada}
            value={formatBRL(adminKpis.receitaRecuperada)}
            delta={adminKpis.receitaRecuperadaDelta}
          />
          <KpiCard
            label={s.kpi.emNegociacao}
            value={formatBRL(adminKpis.emNegociacaoValor)}
          />
          <KpiCard
            label={s.kpi.conversoesGeradas}
            value={String(operationalKpis.conversoesGeradas)}
          />
          <KpiCard
            label={s.kpi.leadsReativados}
            value={String(operationalKpis.emNegociacao)}
          />
        </div>
      )}

      {/* KPIs operacionais — todos (Gerente e Operador) */}
      {!isAdmin && (
        <div className={styles.kpiGrid}>
          <KpiCard
            label={s.kpi.leadsNovos}
            value={String(operationalKpis.leadsNovos)}
          />
          <KpiCard
            label={s.kpi.emNegociacao}
            value={String(operationalKpis.emNegociacao)}
          />
          <KpiCard
            label={s.kpi.conversoesGeradas}
            value={String(operationalKpis.conversoesGeradas)}
          />
          <KpiCard
            label={s.kpi.leadsPerdidos}
            value={String(operationalKpis.leadsPerdidos)}
          />
        </div>
      )}

      {/* Gráfico de receita — só Gerente */}
      {isAdmin && <DashboardCharts revenueData={revenueData} />}

      {/* Atividade recente — todos */}
      {recentActions.length > 0 && (
        <div className={styles.section}>
          <p className={styles.sectionTitle}>{s.acoesIa.title}</p>
          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>{s.acoesIa.colLead}</th>
                  <th>{s.acoesIa.colAcao}</th>
                  <th>{s.acoesIa.colResultado}</th>
                  <th>{s.acoesIa.colHorario}</th>
                </tr>
              </thead>
              <tbody>
                {recentActions.map((lead) => (
                  <tr key={lead.id}>
                    <td>{lead.name}</td>
                    <td>{STRINGS.lead.triggerAi}</td>
                    <td>{STRINGS.lead.status[lead.status]}</td>
                    <td>{formatDateTime(lead.updated_at)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
