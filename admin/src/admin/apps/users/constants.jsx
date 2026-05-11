import Icon from '@/admin/shared/components/ui/Icon';
import Badge from '@/admin/shared/components/ui/Badge';
import { ICON } from '@/admin/lib/iconMapper';

function formatDate(iso) {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' });
}

function UserCell({ row }) {
  const initial = row.name?.charAt(0).toUpperCase() ?? '?';
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
      <div style={{
        width: 32, height: 32, borderRadius: '50%',
        background: row.is_superuser ? 'var(--admin-primary-bg)' : 'var(--admin-bg-tertiary)',
        color: row.is_superuser ? 'var(--admin-primary-hover)' : 'var(--admin-text-secondary)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexShrink: 0, fontSize: 13, fontWeight: 700,
      }}>
        {initial}
      </div>
      <div style={{ minWidth: 0 }}>
        <div style={{ fontWeight: 600, color: 'var(--admin-text-primary)' }}>{row.name}</div>
        <div style={{ fontSize: 11, color: 'var(--admin-text-tertiary)' }}>{row.email}</div>
      </div>
    </div>
  );
}

function RoleBadge({ value, row }) {
  if (row.is_superuser) {
    return <Badge variant="primary" icon={ICON.shield} size="sm">super-admin</Badge>;
  }
  if (value === 'admin') {
    return <Badge variant="primary" icon={ICON.userShield} size="sm">admin</Badge>;
  }
  return <Badge variant="neutral" icon={ICON.user} size="sm">operator</Badge>;
}

function StatusBadge({ value }) {
  return value
    ? <Badge variant="success" icon={ICON.check} size="sm">Ativo</Badge>
    : <Badge variant="muted" size="sm">Inativo</Badge>;
}

export const TABLE_COLUMNS = [
  {
    key: 'name',
    label: 'Usuário',
    render: (_v, row) => <UserCell row={row} />,
  },
  {
    key: 'role',
    label: 'Papel',
    render: (v, row) => <RoleBadge value={v} row={row} />,
    width: 160,
  },
  {
    key: 'company_id',
    label: 'Empresa',
    render: (v) => v
      ? <span style={{ fontFamily: 'monospace', fontSize: 11, color: 'var(--admin-text-tertiary)' }}>{String(v).slice(0, 8)}…</span>
      : <span style={{ color: 'var(--admin-text-tertiary)' }}>—</span>,
    width: 130,
  },
  {
    key: 'is_active',
    label: 'Status',
    render: (v) => <StatusBadge value={v} />,
    width: 100,
  },
  {
    key: 'created_at',
    label: 'Criado',
    render: formatDate,
    width: 140,
  },
];

export const ROLE_OPTIONS = [
  { value: 'admin',    label: 'Admin (do tenant)' },
  { value: 'operator', label: 'Operator' },
];

export function buildFormFields(companies = []) {
  return [
    { name: 'name',         label: 'Nome completo',                   type: 'text',     required: true,  placeholder: 'Ex: João Silva' },
    { name: 'email',        label: 'E-mail',                           type: 'email',    required: true,  placeholder: 'joao@empresa.com' },
    { name: 'password',     label: 'Senha',                            type: 'password', required: true,  placeholder: 'Mín. 8 caracteres' },
    { name: 'role',         label: 'Papel no tenant',                  type: 'select',   options: ROLE_OPTIONS, required: true },
    { name: 'company',      label: 'Empresa vinculada',                type: 'select',   options: companies.map((c) => ({ value: c.id, label: c.name })) },
    { name: 'is_active',    label: 'Conta ativa',                      type: 'boolean' },
    { name: 'is_superuser', label: 'Super-admin SYRAX (acesso ao painel admin)', type: 'boolean' },
  ];
}

export function buildEditFields(companies = []) {
  return [
    { name: 'name',         label: 'Nome completo',                    type: 'text',     required: true },
    { name: 'role',         label: 'Papel no tenant',                  type: 'select',   options: ROLE_OPTIONS, required: true },
    { name: 'company',      label: 'Empresa vinculada',                type: 'select',   options: companies.map((c) => ({ value: c.id, label: c.name })) },
    { name: 'is_active',    label: 'Conta ativa',                      type: 'boolean' },
    { name: 'is_superuser', label: 'Super-admin SYRAX',                type: 'boolean' },
    { name: 'password',     label: 'Nova senha (opcional)',            type: 'password', placeholder: 'Deixe em branco para manter atual' },
  ];
}
