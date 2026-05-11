'use client';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Cell,
} from 'recharts';
import styles from './DashboardCharts.module.css';
import { STRINGS } from '@/src/constants/strings';

interface RevenuePoint {
  date: string;
  value: number;
}

interface DashboardChartsProps {
  revenueData: RevenuePoint[];
}

const FUNNEL_DATA = [
  { stage: 'Leads', value: 100, pct: '100%' },
  { stage: 'Contato', value: 68, pct: '68%' },
  { stage: 'Proposta', value: 42, pct: '42%' },
  { stage: 'Fechado', value: 24, pct: '24%' },
];

export function DashboardCharts({ revenueData }: DashboardChartsProps) {
  return (
    <div className={styles.container}>
      <section className={styles.chart}>
        <h3 className={styles.chartTitle}>{STRINGS.dashboard.charts.receitaTitle}</h3>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={revenueData} margin={{ top: 4, right: 4, bottom: 0, left: 0 }}>
            <defs>
              <linearGradient id="areaFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#B8901E" stopOpacity={0.12} />
                <stop offset="100%" stopColor="#B8901E" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
            <XAxis dataKey="date" tick={{ fill: 'var(--color-text-subtle)', fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: 'var(--color-text-subtle)', fontSize: 11 }} axisLine={false} tickLine={false} width={50} />
            <Tooltip
              contentStyle={{ background: 'var(--color-card-elevated)', border: '1px solid var(--color-border)', borderRadius: '8px', color: 'var(--color-text)' }}
            />
            <Line
              type="monotone"
              dataKey="value"
              stroke="var(--color-primary)"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4, fill: 'var(--color-primary)' }}
            />
          </LineChart>
        </ResponsiveContainer>
      </section>

      <section className={styles.chart}>
        <h3 className={styles.chartTitle}>{STRINGS.dashboard.charts.funilTitle}</h3>
        <ResponsiveContainer width="100%" height={180}>
          <BarChart data={FUNNEL_DATA} layout="vertical" margin={{ top: 0, right: 60, bottom: 0, left: 0 }}>
            <XAxis type="number" hide />
            <YAxis dataKey="stage" type="category" tick={{ fill: 'var(--color-text-muted)', fontSize: 12 }} axisLine={false} tickLine={false} width={80} />
            <Tooltip
              contentStyle={{ background: 'var(--color-card-elevated)', border: '1px solid var(--color-border)', borderRadius: '8px', color: 'var(--color-text)' }}
            />
            <Bar dataKey="value" radius={[0, 4, 4, 0]} maxBarSize={20}>
              {FUNNEL_DATA.map((_, i) => (
                <Cell key={i} fill={i === 0 ? 'var(--color-primary)' : 'var(--color-border-strong)'} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </section>
    </div>
  );
}
