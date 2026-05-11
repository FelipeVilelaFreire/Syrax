import { useEffect, useState } from 'react';
import { api } from '@/services/api';
import { API_ENDPOINTS } from '@/admin/ini/config/endpoints';
import FormPage from '@/admin/shared/components/layout/FormPage';
import Spinner from '@/admin/shared/components/ui/Spinner';
import { buildEditFields } from '../constants';

export default function UserDetail() {
  const [companies, setCompanies] = useState(null);

  useEffect(() => {
    api.get(API_ENDPOINTS.ADMIN_COMPANIES, { params: { page_size: 200 } })
      .then((res) => setCompanies(res.data.results ?? res.data))
      .catch(() => setCompanies([]));
  }, []);

  if (!companies) return <Spinner />;

  return (
    <FormPage
      title="Editar usuário"
      subtitle="Atualize papel, empresa vinculada ou redefina a senha."
      endpoint={API_ENDPOINTS.ADMIN_USERS}
      fields={buildEditFields(companies)}
      backPath="/users"
      mode="edit"
    />
  );
}
