'use client';
import Link from 'next/link';
import styles from './LeadScreen.module.css';
import { LeadDetail } from '@/src/components/features/LeadDetail';
import { ErrorState } from '@/src/components/ui/ErrorState';
import { PageSkeleton } from '@/src/components/ui/Skeleton';
import { Button } from '@/src/components/ui/Button';
import { STRINGS } from '@/src/constants/strings';
import { ROUTES } from '@/src/constants/routes';
import { useLeadScreen } from '@/src/hooks/leads/useLeadScreen';

interface LeadScreenProps {
  id: string;
}

export function LeadScreen({ id }: LeadScreenProps) {
  const { data, loading, error, handleTriggerAi, handleAddNote, refresh } = useLeadScreen(id);

  if (loading) return <PageSkeleton />;
  if (error) return <ErrorState message={error} onRetry={refresh} />;
  if (!data) return null;

  return (
    <div className={styles.screen}>
      <div className={styles.backBtn}>
        <Link href={ROUTES.LEADS}>
          <Button variant="ghost">{STRINGS.actions.back}</Button>
        </Link>
      </div>
      <LeadDetail lead={data} onTriggerAi={handleTriggerAi} onAddNote={handleAddNote} />
    </div>
  );
}
