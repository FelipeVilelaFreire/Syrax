import Icon from '@/admin/shared/components/ui/Icon';
import Badge from '@/admin/shared/components/ui/Badge';
import { ICON } from '@/admin/lib/iconMapper';

function formatDate(iso) {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' });
}

function formatCNPJ(value) {
  if (!value) return '—';
  const digits = String(value).replace(/\D/g, '');
  if (digits.length !== 14) return value;
  return `${digits.slice(0,2)}.${digits.slice(2,5)}.${digits.slice(5,8)}/${digits.slice(8,12)}-${digits.slice(12)}`;
}

function NameCell({ row }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
      <div style={{
        width: 32, height: 32, borderRadius: 8,
        background: 'var(--admin-bg-tertiary)',
        color: 'var(--admin-text-secondary)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexShrink: 0,
      }}>
        <Icon name={ICON.store} size={13} />
      </div>
      <div style={{ minWidth: 0 }}>
        <div style={{ fontWeight: 600, color: 'var(--admin-text-primary)' }}>{row.name}</div>
        <div style={{ fontSize: 11, color: 'var(--admin-text-tertiary)', fontFamily: 'monospace' }}>
          {row.id?.slice(0, 8)}...
        </div>
      </div>
    </div>
  );
}

export const TABLE_COLUMNS = [
  {
    key: 'name',
    label: 'Empresa',
    render: (_v, row) => <NameCell row={row} />,
  },
  {
    key: 'cnpj',
    label: 'CNPJ',
    render: (v) => (
      <span style={{ fontFamily: 'monospace', fontSize: 12, color: 'var(--admin-text-secondary)' }}>
        {formatCNPJ(v)}
      </span>
    ),
    width: 180,
  },
  {
    key: 'sector',
    label: 'Setor',
    render: (v) => v
      ? <Badge variant="neutral" icon={ICON.tag} size="sm">{v}</Badge>
      : <span style={{ color: 'var(--admin-text-tertiary)' }}>—</span>,
    width: 160,
  },
  {
    key: 'created_at',
    label: 'Criada em',
    render: formatDate,
    width: 140,
  },
];

export const FORM_FIELDS = [
  { name: 'name',   label: 'Nome da empresa', type: 'text', required: true, placeholder: 'Ex: Loja Felipe' },
  { name: 'cnpj',   label: 'CNPJ',            type: 'text', placeholder: '00.000.000/0001-00' },
  { name: 'sector', label: 'Setor',           type: 'text', placeholder: 'E-commerce, Infoprodutos, ...' },
];
