import styles from './KpiCard.module.css';

interface KpiCardProps {
  title: string;
  value: string;
  delta?: string;
  deltaPositive?: boolean;
  subtitle?: string;
}

export function KpiCard({ title, value, delta, deltaPositive, subtitle }: KpiCardProps) {
  return (
    <div className={styles.card}>
      <p className={styles.title}>{title}</p>
      <p className={styles.value}>{value}</p>
      {delta && (
        <span className={[styles.delta, deltaPositive ? styles.positive : styles.negative].join(' ')}>
          {delta}
        </span>
      )}
      {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
    </div>
  );
}
