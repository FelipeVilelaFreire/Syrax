import FormPage from '@/admin/shared/components/layout/FormPage';
import { API_ENDPOINTS } from '@/admin/ini/config/endpoints';
import { FORM_FIELDS } from '../constants';
import WebhookPanel from '../components/WebhookPanel';
import MetaPanel from '../components/MetaPanel';

export default function CompanyDetail() {
  return (
    <FormPage
      title="Editar empresa"
      subtitle="Atualize os dados ou copie as URLs de webhook abaixo."
      endpoint={API_ENDPOINTS.ADMIN_COMPANIES}
      fields={FORM_FIELDS}
      backPath="/companies"
      mode="edit"
      renderExtras={(data) => (
        <>
          <WebhookPanel company={data} />
          <MetaPanel data={data} />
        </>
      )}
    />
  );
}
