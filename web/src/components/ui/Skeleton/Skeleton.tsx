import styles from './Skeleton.module.css';

interface SkeletonProps {
  height?: number | string;
  width?: number | string;
  borderRadius?: string;
  className?: string;
  lines?: number;
}

export function Skeleton({ height = 20, width = '100%', borderRadius, className, lines = 1 }: SkeletonProps) {
  if (lines > 1) {
    return (
      <div className={styles.stack}>
        {Array.from({ length: lines }, (_, i) => (
          <div
            key={i}
            className={[styles.skeleton, className ?? ''].join(' ')}
            style={{
              height,
              width: i === lines - 1 ? '60%' : width,
              borderRadius: borderRadius ?? 'var(--radius-sm)',
            }}
          />
        ))}
      </div>
    );
  }

  return (
    <div
      className={[styles.skeleton, className ?? ''].join(' ')}
      style={{ height, width, borderRadius: borderRadius ?? 'var(--radius-sm)' }}
    />
  );
}

export function PageSkeleton() {
  return (
    <div className={styles.page}>
      <Skeleton height={32} width={200} />
      <div className={styles.grid}>
        {Array.from({ length: 4 }, (_, i) => (
          <Skeleton key={i} height={100} borderRadius="var(--radius-xl)" />
        ))}
      </div>
      <Skeleton height={300} borderRadius="var(--radius-xl)" />
    </div>
  );
}
