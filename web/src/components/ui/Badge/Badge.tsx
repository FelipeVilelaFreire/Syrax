import styles from './Badge.module.css';
import type { LeadStatus } from '@/src/types/lead';

interface BadgeProps {
  status: LeadStatus;
  label: string;
}

const statusClass: Record<LeadStatus, string> = {
  novo: styles.neutral,
  em_contato: styles.warning,
  convertido: styles.success,
  perdido: styles.error,
};

export function Badge({ status, label }: BadgeProps) {
  return <span className={[styles.badge, statusClass[status]].join(' ')}>{label}</span>;
}
