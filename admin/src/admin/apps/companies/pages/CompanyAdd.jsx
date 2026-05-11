import FormPage from '@/admin/shared/components/layout/FormPage';
import { API_ENDPOINTS } from '@/admin/ini/config/endpoints';
import { FORM_FIELDS } from '../constants';

export default function CompanyAdd() {
  return (
    <FormPage
      title="Nova empresa"
      subtitle="Após criar, um webhook_token único é gerado automaticamente."
      endpoint={API_ENDPOINTS.ADMIN_COMPANIES}
      fields={FORM_FIELDS}
      backPath="/companies"
      mode="create"
    />
  );
}
