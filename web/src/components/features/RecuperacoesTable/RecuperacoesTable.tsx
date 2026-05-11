import styles from './RecuperacoesTable.module.css';
import { STRINGS } from '@/src/constants/strings';
import { formatBRL, formatDate } from '@/src/lib/format';
import type { LeadListItem } from '@/src/types/lead';

interface RecuperacoesTableProps {
  leads: LeadListItem[];
}

export function RecuperacoesTable({ leads }: RecuperacoesTableProps) {
  const s = STRINGS.recuperacoes;

  if (leads.length === 0) {
    return (
      <div className={styles.wrapper}>
        <p className={styles.empty}>{s.noRecuperacoes}</p>
      </div>
    );
  }

  return (
    <div className={styles.wrapper}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>{s.colLead}</th>
            <th>{s.colValor}</th>
            <th>{s.colData}</th>
            <th>{s.colCanal}</th>
            <th>{s.colStatus}</th>
          </tr>
        </thead>
        <tbody>
          {leads.map((lead) => (
            <tr key={lead.id}>
              <td>{lead.name}</td>
              <td className={styles.value}>{formatBRL(lead.value)}</td>
              <td>{formatDate(lead.updated_at)}</td>
              <td>{lead.origin}</td>
              <td>
                <span className={styles.statusBadge}>{s.fechadoViaIa}</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
