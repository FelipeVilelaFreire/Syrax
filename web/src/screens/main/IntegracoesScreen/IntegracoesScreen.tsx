'use client';
import styles from './IntegracoesScreen.module.css';
import { IntegracaoCard } from '@/src/components/cards/IntegracaoCard';
import { ErrorState } from '@/src/components/ui/ErrorState';
import { PageSkeleton } from '@/src/components/ui/Skeleton';
import { useIntegracoesScreen } from '@/src/hooks/integracoes/useIntegracoesScreen';

export function IntegracoesScreen() {
  const { integrations, loading, error, getWebhookUrl, refresh } = useIntegracoesScreen();

  if (loading) return <PageSkeleton />;
  if (error) return <ErrorState message={error} onRetry={refresh} />;

  return (
    <div className={styles.screen}>
      <div className={styles.grid}>
        {integrations.map((integration) => (
          <IntegracaoCard
            key={integration.id}
            integration={integration}
            webhookUrl={getWebhookUrl(integration.platform)}
          />
        ))}
      </div>
    </div>
  );
}
