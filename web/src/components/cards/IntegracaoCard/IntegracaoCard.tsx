import styles from './IntegracaoCard.module.css';
import { Button } from '@/src/components/ui/Button';
import { STRINGS } from '@/src/constants/strings';
import type { Integration } from '@/src/types/integration';

interface IntegracaoCardProps {
  integration: Integration;
  webhookUrl: string;
  onCopyUrl: (url: string) => void;
  showUrl: boolean;
  onToggleUrl: () => void;
}

export function IntegracaoCard({ integration, webhookUrl, onCopyUrl, showUrl, onToggleUrl }: IntegracaoCardProps) {
  const s = STRINGS.integracoes;
  const isConnected = integration.status === 'connected';
  const isWhatsapp = integration.platform === 'whatsapp';

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <div>
          <p className={styles.platform}>{s.platforms[integration.platform]}</p>
          <p className={styles.events}>{s.totalEvents(integration.total_events_received)}</p>
        </div>
        <span className={[styles.statusDot, isConnected ? styles.connected : styles.disconnected].join(' ')}>
          {isConnected ? '●' : '○'}&nbsp;
          {isConnected ? s.status.connected : s.status.disconnected}
        </span>
      </div>

      {isWhatsapp ? (
        <p className={styles.note}>{s.whatsappMvpNote}</p>
      ) : (
        <>
          <Button variant="secondary" onClick={onToggleUrl}>
            {isConnected ? STRINGS.actions.manage : STRINGS.actions.connect}
          </Button>
          {showUrl && (
            <div className={styles.webhookBox}>
              <p className={styles.webhookLabel}>{s.webhookUrl}</p>
              <p className={styles.webhookInstructions}>{s.webhookInstructions}</p>
              <div className={styles.urlRow}>
                <code className={styles.url}>{webhookUrl}</code>
                <button className={styles.copyBtn} onClick={() => onCopyUrl(webhookUrl)}>
                  {STRINGS.actions.copy}
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
