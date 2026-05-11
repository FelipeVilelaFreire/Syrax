import styles from './OportunidadeCard.module.css';
import { Badge } from '@/src/components/ui/Badge';
import { ProgressBar } from '@/src/components/ui/ProgressBar';
import { Button } from '@/src/components/ui/Button';
import { Icon } from '@/src/components/ui/Icon';
import { STRINGS } from '@/src/constants/strings';
import { ICON_NAMES } from '@/src/constants/icons';
import { formatBRL, formatHoursAgo } from '@/src/lib/format';
import type { LeadListItem } from '@/src/types/lead';

interface OportunidadeCardProps {
  lead: LeadListItem;
  onTriggerAi: (lead: LeadListItem) => void;
}

function getTemperature(score: number) {
  if (score >= 70) return { label: STRINGS.lead.temperature.quente, css: 'hot' };
  if (score >= 40) return { label: STRINGS.lead.temperature.morno, css: 'warm' };
  return { label: STRINGS.lead.temperature.frio, css: 'cold' };
}

export function OportunidadeCard({ lead, onTriggerAi }: OportunidadeCardProps) {
  const temp = getTemperature(lead.score);

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <div>
          <p className={styles.name}>{lead.name}</p>
          <p className={styles.product}>{lead.product_name}</p>
        </div>
        <span className={[styles.temp, styles[temp.css]].join(' ')}>{temp.label}</span>
      </div>

      <p className={styles.value}>{formatBRL(lead.value)}</p>

      <div className={styles.scoreRow}>
        <span className={styles.scoreLabel}>Score</span>
        <span className={styles.scoreValue}>{lead.score}</span>
      </div>
      <ProgressBar value={lead.score} />

      <p className={styles.idle}>
        <Icon name={ICON_NAMES.warning} size={12} />
        {lead.time_without_contact < 24
          ? STRINGS.oportunidades.horasSemContato(lead.time_without_contact)
          : STRINGS.oportunidades.diasSemContato(Math.floor(lead.time_without_contact / 24))}
      </p>

      <Badge status={lead.status} label={STRINGS.lead.status[lead.status]} />

      <Button
        variant="primary"
        fullWidth
        onClick={() => onTriggerAi(lead)}
      >
        <Icon name={ICON_NAMES.triggerAi} size={14} />
        {STRINGS.lead.triggerAi}
      </Button>
    </div>
  );
}
