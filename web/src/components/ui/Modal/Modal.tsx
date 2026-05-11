'use client';
import styles from './Modal.module.css';
import { Icon } from '@/src/components/ui/Icon';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
}

export function Modal({ open, onClose, title, children }: ModalProps) {
  if (!open) return null;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.panel} onClick={(e) => e.stopPropagation()}>
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
