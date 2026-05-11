'use client';
import { useState } from 'react';
import styles from './ConversaDetail.module.css';
import { Button } from '@/src/components/ui/Button';
import { STRINGS } from '@/src/constants/strings';
import { formatBRL, formatDateTime } from '@/src/lib/format';
import type { Lead } from '@/src/types/lead';

interface ConversaDetailProps {
  lead: Lead;
  onAddNote: (content: string) => void;
}

export function ConversaDetail({ lead, onAddNote }: ConversaDetailProps) {
  const [message, setMessage] = useState('');

  const handleSend = () => {
    if (!message.trim()) return;
    onAddNote(message.trim());
    setMessage('');
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <p className={styles.name}>{lead.name}</p>
        <p className={styles.meta}>{lead.product_name} · {formatBRL(lead.value)}</p>
      </div>

      <div className={styles.messages}>
        {lead.interactions.length === 0 && (
          <div className={styles.empty}>{STRINGS.conversas.noConversas}</div>
        )}
        {lead.interactions.map((item) => (
          <div key={item.id} className={styles.messageItem}>
            <p className={styles.messageText}>{item.content}</p>
            <p className={styles.messageMeta}>
              {item.user_name ?? 'Sistema'} · {formatDateTime(item.created_at)}
            </p>
          </div>
        ))}
      </div>

      <div className={styles.inputRow}>
        <input
          className={styles.input}
          placeholder={STRINGS.conversas.typeMessage}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter') handleSend(); }}
        />
        <Button onClick={handleSend} disabled={!message.trim()} variant="primary">
          {STRINGS.actions.confirm}
        </Button>
      </div>
    </div>
  );
}
