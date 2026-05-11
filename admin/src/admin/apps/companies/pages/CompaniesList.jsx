import ListPage from '@/admin/shared/components/layout/ListPage';
import { API_ENDPOINTS } from '@/admin/ini/config/endpoints';
import { ICON } from '@/admin/lib/iconMapper';
import { TABLE_COLUMNS } from '../constants';

export default function CompaniesList() {
  return (
    <ListPage
      title="Empresas"
      subtitle="Workspaces dos clientes da SYRAX"
      endpoint={API_ENDPOINTS.ADMIN_COMPANIES}
      columns={TABLE_COLUMNS}
      addPath="/companies/new"
      addLabel="Nova empresa"
      rowLinkPath={(row) => `/companies/${row.id}`}
      searchKeys={['name', 'cnpj', 'sector']}
      emptyTitle="Nenhuma empresa cadastrada"
      emptyBody="Cadastre a primeira empresa pra começar a provisionar usuários e webhooks."
      emptyIcon={ICON.companies}
    />
  );
}
