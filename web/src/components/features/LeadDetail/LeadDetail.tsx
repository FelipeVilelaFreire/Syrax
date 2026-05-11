'use client';
import { useState } from 'react';
import styles from './LeadDetail.module.css';
import { Badge } from '@/src/components/ui/Badge';
import { ProgressBar } from '@/src/components/ui/ProgressBar';
import { Button } from '@/src/components/ui/Button';
import { STRINGS } from '@/src/constants/strings';
import { formatBRL, formatDateTime, formatHoursAgo } from '@/src/lib/format';
import type { Lead } from '@/src/types/lead';

interface LeadDetailProps {
  lead: Lead;
  onTriggerAi: () => void;
  onAddNote: (content: string) => void;
}

export function LeadDetail({ lead, onTriggerAi, onAddNote }: LeadDetailProps) {
  const [note, setNote] = useState('');
  const s = STRINGS.lead;

  const handleAddNote = () => {
    if (!note.trim()) return;
    onAddNote(note.trim());
    setNote('');
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.headerRow}>
          <div>
            <p className={styles.name}>{lead.name}</p>
            <p className={styles.value}>{formatBRL(lead.value)}</p>
          </div>
          <Badge status={lead.status} label={s.status[lead.status]} />
        </div>

        <div className={styles.metaGrid}>
          <div className={styles.metaItem}>
            <span className={styles.metaLabel}>{s.colEmpresa}</span>
            <span className={styles.metaValue}>{lead.email}</span>
          </div>
          <div className={styles.metaItem}>
            <span className={styles.metaLabel}>{s.colOrigem}</span>
            <span className={styles.metaValue}>{lead.origin}</span>
          </div>
          <div className={styles.metaItem}>
            <span className={styles.metaLabel}>{s.colUltimoContato}</span>
            <span className={styles.metaValue}>{formatHoursAgo(lead.time_without_contact)}</span>
          </div>
          <div className={styles.metaItem}>
            <span className={styles.metaLabel}>{s.colScore}</span>
            <ProgressBar value={lead.score} />
          </div>
        </div>

        <div className={styles.aiBtn}>
          <Button onClick={onTriggerAi}>
            {s.triggerAi}
          </Button>
        </div>
      </div>

      <div className={styles.timeline}>
        <p className={styles.timelineTitle}>{s.detail.timeline}</p>

        <div className={styles.noteForm}>
          <textarea
            className={styles.noteInput}
            rows={2}
            placeholder={s.detail.notePlaceholder}
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />
          <Button onClick={handleAddNote} disabled={!note.trim()} variant="secondary">
            {s.detail.addNote}
          </Button>
        </div>

        <div className={styles.timelineList}>
          {lead.interactions.length === 0 && (
            <p className={styles.emptyTimeline}>{STRINGS.search.noResults}</p>
          )}
          {lead.interactions.map((item) => (
            <div key={item.id} className={styles.timelineItem}>
              <div className={styles.timelineDot} />
              <div className={styles.timelineContent}>
                <p className={styles.timelineText}>{item.content}</p>
                <p className={styles.timelineMeta}>
                  {item.user_name ?? 'Sistema'} · {formatDateTime(item.created_at)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
