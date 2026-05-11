import styles from './ProgressBar.module.css';

interface ProgressBarProps {
  value: number;
  max?: number;
  showLabel?: boolean;
}

export function ProgressBar({ value, max = 100, showLabel = false }: ProgressBarProps) {
  const percent = Math.min(100, Math.max(0, (value / max) * 100));

  return (
    <div className={styles.track}>
      <div className={styles.fill} style={{ width: `${percent}%` }} />
      {showLabel && <span className={styles.label}>{Math.round(percent)}</span>}
    </div>
  );
}
