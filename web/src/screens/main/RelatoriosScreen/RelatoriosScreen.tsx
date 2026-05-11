'use client';
import styles from './RelatoriosScreen.module.css';
import { ErrorState } from '@/src/components/ui/ErrorState';
import { PageSkeleton } from '@/src/components/ui/Skeleton';
import { STRINGS } from '@/src/constants/strings';
import { useRelatoriosScreen } from '@/src/hooks/relatorios/useRelatoriosScreen';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from 'recharts';

type DateRange = '7d' | '30d' | '90d';

const DATE_FILTERS: Array<{ label: string; value: DateRange }> = [
  { label: STRINGS.relatorios.dateFilter.last7d, value: '7d' },
  { label: STRINGS.relatorios.dateFilter.last30d, value: '30d' },
  { label: STRINGS.relatorios.dateFilter.last90d, value: '90d' },
];

const TOOLTIP_STYLE = {
  backgroundColor: 'var(--color-card)',
  border: '1px solid var(--color-border)',
  borderRadius: '8px',
  color: 'var(--color-text)',
  fontSize: '12px',
};

export function RelatoriosScreen() {
  const { dateRange, setDateRange, weeklyData, loading, error, refresh } = useRelatoriosScreen();
  const s = STRINGS.relatorios;

  if (loading) return <PageSkeleton />;
  if (error) return <ErrorState message={error} onRetry={refresh} />;

  return (
    <div className={styles.screen}>
      <div className={styles.toolbar}>
        {DATE_FILTERS.map((f) => (
          <button
            key={f.value}
            className={[styles.filterBtn, dateRange === f.value ? styles.active : ''].join(' ')}
            onClick={() => setDateRange(f.value)}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className={styles.chartCard}>
        <p className={styles.chartTitle}>{s.charts.leadsVsConversoes}</p>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={weeklyData} margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
            <XAxis dataKey="week" tick={{ fill: 'var(--color-text-subtle)', fontSize: 12 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: 'var(--color-text-subtle)', fontSize: 12 }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={TOOLTIP_STYLE} />
            <Legend wrapperStyle={{ fontSize: 12, color: 'var(--color-text-muted)' }} />
            <Bar dataKey="leads" name="Leads" fill="var(--color-border-strong)" radius={[4, 4, 0, 0]} />
            <Bar dataKey="conversoes" name="Conversões" fill="var(--color-primary)" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>{s.performance.colCampanha}</th>
              <th>{s.performance.colLeads}</th>
              <th>{s.performance.colContatos}</th>
              <th>{s.performance.colConversoes}</th>
              <th>{s.performance.colReceita}</th>
              <th>{s.performance.colRoi}</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td colSpan={6} style={{ textAlign: 'center', color: 'var(--color-text-subtle)', padding: 'var(--spacing-xl)' }}>
                {STRINGS.configuracoes.faturamento.comingSoon}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
