'use client';
import { useState } from 'react';
import styles from './ConversasScreen.module.css';
import { ConversaDetail } from '@/src/components/features/ConversaDetail';
import { ErrorState } from '@/src/components/ui/ErrorState';
import { PageSkeleton } from '@/src/components/ui/Skeleton';
import { STRINGS } from '@/src/constants/strings';
import { useConversasScreen } from '@/src/hooks/conversas/useConversasScreen';

export function ConversasScreen() {
  const { leads, selectedLead, loading, error, selectLead, handleAddNote, refresh } = useConversasScreen();
  const [search, setSearch] = useState('');

  if (loading) return <PageSkeleton />;
  if (error) return <ErrorState message={error} onRetry={refresh} />;

  const filtered = leads.filter((l) =>
    l.name.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className={styles.screen}>
      <div className={styles.sidebar}>
        <input
          className={styles.search}
          placeholder={STRINGS.conversas.search}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        {filtered.map((lead) => (
          <div
            key={lead.id}
            className={[styles.leadItem, selectedLead?.id === lead.id ? styles.selected : ''].join(' ')}
            onClick={() => selectLead(lead.id)}
          >
            <p className={styles.leadName}>{lead.name}</p>
            <p className={styles.leadProduct}>{lead.product_name}</p>
          </div>
        ))}
        {filtered.length === 0 && (
          <p style={{ color: 'var(--color-text-subtle)', fontSize: 'var(--font-size-sm)', textAlign: 'center', padding: 'var(--spacing-lg)' }}>
            {STRINGS.conversas.noConversas}
          </p>
        )}
      </div>

      <div className={styles.detail}>
        {selectedLead ? (
          <ConversaDetail lead={selectedLead} onAddNote={handleAddNote} />
        ) : (
          <div className={styles.empty}>{STRINGS.conversas.noConversas}</div>
        )}
      </div>
    </div>
  );
}
