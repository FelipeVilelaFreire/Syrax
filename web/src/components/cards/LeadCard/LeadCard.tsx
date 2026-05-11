import styles from './LeadCard.module.css';
import { Badge } from '@/src/components/ui/Badge';
import { ProgressBar } from '@/src/components/ui/ProgressBar';
import { Icon } from '@/src/components/ui/Icon';
import { STRINGS } from '@/src/constants/strings';
import { ICON_NAMES } from '@/src/constants/icons';
import { formatBRL, formatHoursAgo } from '@/src/lib/format';
import type { LeadListItem } from '@/src/types/lead';

interface LeadCardProps {
  lead: LeadListItem;
  onTriggerAi: (id: string) => void;
}

export function LeadCard({ lead, onTriggerAi }: LeadCardProps) {
  return (
    <div className={styles.card}>
      <div className={styles.row}>
        <div className={styles.info}>
          <p className={styles.name}>{lead.name}</p>
          <p className={styles.product}>{lead.product_name}</p>
        </div>
        <div className={styles.right}>
          <p className={styles.value}>{formatBRL(lead.value)}</p>
          <Badge status={lead.status} label={STRINGS.lead.status[lead.status]} />
        </div>
      </div>
      <div className={styles.meta}>
        <span className={styles.origin}>{lead.origin}</span>
        <span className={styles.idle}>{formatHoursAgo(lead.time_without_contact)}</span>
      </div>
      <div className={styles.scoreRow}>
        <ProgressBar value={lead.score} />
        <span className={styles.scoreValue}>{lead.score}</span>
      </div>
      <button className={styles.aiBtn} onClick={() => onTriggerAi(lead.id)}>
        <Icon name={ICON_NAMES.triggerAi} size={14} color="var(--color-primary)" />
      </button>
    </div>
  );
}
