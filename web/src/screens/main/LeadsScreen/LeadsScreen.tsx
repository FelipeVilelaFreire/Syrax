'use client';
import styles from './LeadsScreen.module.css';
import { LeadCard } from '@/src/components/cards/LeadCard';
import { Button } from '@/src/components/ui/Button';
import { ErrorState } from '@/src/components/ui/ErrorState';
import { PageSkeleton } from '@/src/components/ui/Skeleton';
import { STRINGS } from '@/src/constants/strings';
import { useLeadsScreen } from '@/src/hooks/leads/useLeadsScreen';
import type { LeadStatus } from '@/src/types/lead';

const STATUS_FILTERS: Array<{ label: string; value: LeadStatus | undefined }> = [
  { label: STRINGS.lead.filterAll, value: undefined },
  { label: STRINGS.lead.filterNovo, value: 'novo' },
  { label: STRINGS.lead.filterEmContato, value: 'em_contato' },
  { label: STRINGS.lead.filterConvertido, value: 'convertido' },
  { label: STRINGS.lead.filterPerdido, value: 'perdido' },
];

export function LeadsScreen() {
  const {
    data, loading, error,
    statusFilter, setStatusFilter,
    search, setSearch,
    page, setPage,
    handleTriggerAi, refresh,
  } = useLeadsScreen();

  const handleTriggerAiAndOpen = async (id: string) => {
    const updated = await handleTriggerAi(id);
    if (updated?.phone) {
      const text = STRINGS.lead.whatsappTemplate(updated.name, updated.product_name ?? '', String(updated.value));
      window.open(`https://wa.me/${updated.phone}?text=${encodeURIComponent(text)}`, '_blank');
    }
  };

  if (loading) return <PageSkeleton />;
  if (error) return <ErrorState message={error} onRetry={refresh} />;

  return (
    <div className={styles.screen}>
      <div className={styles.toolbar}>
        <div className={styles.filters}>
          {STATUS_FILTERS.map((f) => (
            <button
              key={String(f.value)}
              className={[styles.filterBtn, statusFilter === f.value ? styles.active : ''].join(' ')}
              onClick={() => { setStatusFilter(f.value); setPage(1); }}
            >
              {f.label}
            </button>
          ))}
        </div>
        <div className={styles.searchWrapper}>
          <input
            className={styles.search}
            placeholder={STRINGS.lead.searchPlaceholder}
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          />
        </div>
      </div>

      <div className={styles.list}>
        {data?.results.length === 0 && (
          <p className={styles.empty}>{STRINGS.lead.noLeads}</p>
        )}
        {data?.results.map((lead) => (
          <LeadCard key={lead.id} lead={lead} onTriggerAi={handleTriggerAiAndOpen} />
        ))}
      </div>

      {data && data.count > 20 && (
        <div className={styles.pagination}>
          <Button variant="ghost" onClick={() => setPage(page - 1)} disabled={page === 1}>
            {STRINGS.actions.previous}
          </Button>
          <span>{page}</span>
          <Button variant="ghost" onClick={() => setPage(page + 1)} disabled={!data.next}>
            {STRINGS.actions.next}
          </Button>
        </div>
      )}
    </div>
  );
}
