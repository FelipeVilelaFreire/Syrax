import Icon from '@/admin/shared/components/ui/Icon';
import { ICON } from '@/admin/lib/iconMapper';
import styles from './MetaPanel.module.css';

function fmt(iso) {
  if (!iso) return '—';
  return new Date(iso).toLocaleString('pt-BR', {
    day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
}

export default function MetaPanel({ data }) {
  if (!data?.id) return null;

  const rows = [
    { icon: ICON.badge,   label: 'ID',         value: data.id,          mono: true },
    { icon: ICON.clock,   label: 'Criada em',  value: fmt(data.created_at) },
    { icon: ICON.clock,   label: 'Atualizada', value: fmt(data.updated_at) },
  ];

  return (
    <section className={styles.panel}>
      <div className={styles.header}>
        <Icon name={ICON.info} size={14} />
        <h3 className={styles.title}>Metadata</h3>
      </div>
      <dl className={styles.grid}>
        {rows.map((r) => (
          <div key={r.label} className={styles.cell}>
            <dt className={styles.label}>
              <Icon name={r.icon} size={11} />
              <span>{r.label}</span>
            </dt>
            <dd className={[styles.value, r.mono ? styles.mono : ''].join(' ')}>{r.value}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
