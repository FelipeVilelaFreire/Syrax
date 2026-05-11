'use client';
import styles from './BottomModal.module.css';
import { Icon } from '@/src/components/ui/Icon';

interface BottomModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
}

export function BottomModal({ open, onClose, title, children }: BottomModalProps) {
  if (!open) return null;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.sheet} onClick={(e) => e.stopPropagation()}>
        <div className={styles.handle} />
        {title && (
          <div className={styles.header}>
            <span className={styles.title}>{title}</span>
            <button className={styles.close} onClick={onClose}>
              <Icon name="xmark" size={16} />
            </button>
          </div>
        )}
        <div className={styles.body}>{children}</div>
      </div>
    </div>
  );
}
