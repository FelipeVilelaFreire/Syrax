import { useEffect, useState } from 'react';
import { api } from '@/services/api';
import { API_ENDPOINTS } from '@/admin/ini/config/endpoints';
import FormPage from '@/admin/shared/components/layout/FormPage';
import Spinner from '@/admin/shared/components/ui/Spinner';
import { buildFormFields } from '../constants';

export default function UserAdd() {
  const [companies, setCompanies] = useState(null);

  useEffect(() => {
    api.get(API_ENDPOINTS.ADMIN_COMPANIES, { params: { page_size: 200 } })
      .then((res) => setCompanies(res.data.results ?? res.data))
      .catch(() => setCompanies([]));
  }, []);

  if (!companies) return <Spinner />;

  return (
    <FormPage
      title="Novo usuário"
      subtitle="Vincule a uma empresa para liberar acesso ao app cliente."
      endpoint={API_ENDPOINTS.ADMIN_USERS}
      fields={buildFormFields(companies)}
      backPath="/users"
      initialData={{ role: 'operator', is_active: true, is_superuser: false }}
      mode="create"
    />
  );
}
