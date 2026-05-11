import ListPage from '@/admin/shared/components/layout/ListPage';
import { API_ENDPOINTS } from '@/admin/ini/config/endpoints';
import { ICON } from '@/admin/lib/iconMapper';
import { TABLE_COLUMNS } from '../constants';

export default function UsersList() {
  return (
    <ListPage
      title="Usuários"
      subtitle="Todos os acessos da plataforma (super-admins + tenants)"
      endpoint={API_ENDPOINTS.ADMIN_USERS}
      columns={TABLE_COLUMNS}
      addPath="/users/new"
      addLabel="Novo usuário"
      rowLinkPath={(row) => `/users/${row.id}`}
      searchKeys={['name', 'email']}
      emptyTitle="Nenhum usuário cadastrado"
      emptyBody="Crie usuários e vincule-os a uma empresa para liberar acesso ao app cliente."
      emptyIcon={ICON.users}
    />
  );
}
