import { useState } from 'react';
import Icon from '@/admin/shared/components/ui/Icon';
import Badge from '@/admin/shared/components/ui/Badge';
import { ICON } from '@/admin/lib/iconMapper';
import { useToast } from '@/admin/contexts/ToastContext';
import styles from './WebhookPanel.module.css';

const API_BASE = import.meta.env.VITE_API_URL ?? 'http://localhost:8001/api';

const PLATFORMS = [
  { key: 'kiwify',  label: 'Kiwify',   icon: ICON.plug },
  { key: 'hotmart', label: 'Hotmart',  icon: ICON.plug },
];

function WebhookRow({ platform, label, icon, url }) {
  const toast = useToast();
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      toast.success('URL copiada.');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error('Falha ao copiar.');
    }
  };

  return (
    <div className={styles.row}>
      <div className={styles.platformInfo}>
        <div className={styles.platformIcon}>
          <Icon name={icon} size={14} />
        </div>
        <div>
          <p className={styles.platformLabel}>{label}</p>
          <p className={styles.platformPath}>POST /webhooks/{platform}/...</p>
        </div>
      </div>
      <code className={styles.url}>{url}</code>
      <button type="button" className={styles.copyBtn} onClick={handleCopy}>
        <Icon name={copied ? ICON.check : ICON.copy} size={12} />
        <span>{copied ? 'Copiado' : 'Copiar'}</span>
      </button>
    </div>
  );
}

export default function WebhookPanel({ company }) {
  if (!company?.webhook_token) {
    return (
      <section className={styles.panel}>
        <div className={styles.header}>
          <Icon name={ICON.webhook} size={14} />
          <h3 className={styles.title}>Webhooks</h3>
        </div>
        <p className={styles.empty}>Token de webhook ainda não gerado.</p>
      </section>
    );
  }

  return (
    <section className={styles.panel}>
      <div className={styles.header}>
        <Icon name={ICON.webhook} size={14} />
        <h3 className={styles.title}>Webhooks</h3>
        <Badge variant="success" icon={ICON.check} size="sm">Ativo</Badge>
      </div>
      <p className={styles.description}>
        URLs únicas para configurar nas plataformas externas. Cada empresa tem suas próprias.
      </p>
      <div className={styles.list}>
        {PLATFORMS.map((p) => (
          <WebhookRow
            key={p.key}
            platform={p.key}
            label={p.label}
            icon={p.icon}
            url={`${API_BASE}/webhooks/${p.key}/${company.webhook_token}/`}
          />
        ))}
      </div>
    </section>
  );
}
