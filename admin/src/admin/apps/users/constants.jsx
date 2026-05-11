import Badge from '@/admin/shared/components/ui/Badge';
import { ICON } from '@/admin/lib/iconMapper';

function formatDate(iso) {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' });
}

export function RoleBadge({ user }) {
  if (user.is_superuser) return <Badge variant="primary"  icon={ICON.shield}      size="sm">Super Admin</Badge>;
  if (user.role === 'admin')    return <Badge variant="warning"  icon={ICON.userShield} size="sm">Gerente</Badge>;
  return                               <Badge variant="neutral"  icon={ICON.user}        size="sm">Operador</Badge>;
}

export function StatusBadge({ active }) {
  return active
    ? <Badge variant="success" icon={ICON.check} size="sm">Ativo</Badge>
    : <Badge variant="muted"   size="sm">Inativo</Badge>;
}

export { formatDate };

export const ROLE_OPTIONS = [
  { value: 'admin',    label: 'Gerente'  },
  { value: 'operator', label: 'Operador' },
];

export function buildFormFields(companies = []) {
  return [
    { name: 'name',     label: 'Nome completo',      type: 'text',     required: true, placeholder: 'Ex: João Silva' },
    { name: 'email',    label: 'E-mail',              type: 'email',    required: true, placeholder: 'joao@empresa.com' },
    { name: 'password', label: 'Senha',               type: 'password', required: true, placeholder: 'Mín. 8 caracteres' },
    { name: 'role',     label: 'Cargo',               type: 'select',   required: true, options: ROLE_OPTIONS },
    { name: 'company',  label: 'Empresa vinculada',   type: 'select',   options: companies.map((c) => ({ value: c.id, label: c.name })) },
    { name: 'is_active', label: 'Conta ativa',        type: 'boolean' },
  ];
}

export function buildEditFields(companies = []) {
  return [
    { name: 'name',      label: 'Nome completo',    type: 'text',     required: true },
    { name: 'role',      label: 'Cargo',            type: 'select',   required: true, options: ROLE_OPTIONS },
    { name: 'company',   label: 'Empresa vinculada', type: 'select',  options: companies.map((c) => ({ value: c.id, label: c.name })) },
    { name: 'is_active', label: 'Conta ativa',      type: 'boolean' },
    { name: 'password',  label: 'Nova senha (opcional)', type: 'password', placeholder: 'Deixe em branco para manter atual' },
  ];
}
