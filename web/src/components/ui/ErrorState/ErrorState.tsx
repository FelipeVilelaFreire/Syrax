import styles from './ErrorState.module.css';
import { STRINGS } from '@/src/constants/strings';

interface ErrorStateProps {
  message?: string | null;
  onRetry?: () => void;
}

export function ErrorState({ message, onRetry }: ErrorStateProps) {
  return (
    <div className={styles.container}>
      <p className={styles.message}>{message ?? STRINGS.errors.generic}</p>
      {onRetry && (
        <button className={styles.retry} onClick={onRetry}>
          {STRINGS.actions.refresh}
        </button>
      )}
    </div>
  );
}
