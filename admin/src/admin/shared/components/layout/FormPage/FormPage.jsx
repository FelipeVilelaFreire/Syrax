import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { api, getErrorMessage } from '@/services/api';
import { useToast } from '@/admin/contexts/ToastContext';
import FormBuilder from '@/admin/shared/components/form/FormBuilder';
import Button from '@/admin/shared/components/ui/Button';
import Icon from '@/admin/shared/components/ui/Icon';
import Spinner from '@/admin/shared/components/ui/Spinner';
import { ICON } from '@/admin/lib/iconMapper';
import styles from './FormPage.module.css';

export default function FormPage({
  title,
  subtitle,
  endpoint,
  fields,
  backPath,
  initialData = {},
  mode = 'create',
  renderExtras,
}) {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const [data, setData] = useState(initialData);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(mode === 'edit');
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (mode !== 'edit' || !id) return;
    (async () => {
      try {
        const res = await api.get(`${endpoint}${id}/`);
        setData(res.data);
      } catch (err) {
        toast.error(getErrorMessage(err));
      } finally {
        setLoading(false);
      }
    })();
  }, [mode, id, endpoint]);

  const handleChange = (name, value) => {
    setData((p) => ({ ...p, [name]: value }));
    setErrors((p) => ({ ...p, [name]: null }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setErrors({});
    try {
      if (mode === 'edit') {
        await api.patch(`${endpoint}${id}/`, data);
        toast.success('Alterações salvas.');
      } else {
        await api.post(endpoint, data);
        toast.success('Criado com sucesso.');
      }
      navigate(backPath);
    } catch (err) {
      const payload = err?.response?.data;
      if (payload && typeof payload === 'object') {
        const fieldErrors = {};
        Object.entries(payload).forEach(([k, v]) => {
          fieldErrors[k] = Array.isArray(v) ? v[0] : String(v);
        });
        setErrors(fieldErrors);
      }
      toast.error(getErrorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Tem certeza que deseja excluir? Esta ação faz soft-delete e pode ser revertida.')) return;
    setDeleting(true);
    try {
      await api.delete(`${endpoint}${id}/`);
      toast.success('Excluído.');
      navigate(backPath);
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setDeleting(false);
    }
  };

  if (loading) return <div className={styles.center}><Spinner /></div>;

  return (
    <form className={styles.page} onSubmit={handleSubmit}>
      <button type="button" className={styles.backLink} onClick={() => navigate(backPath)}>
        <Icon name={ICON.back} size={11} />
        <span>Voltar</span>
      </button>

      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>{title}</h1>
          {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
        </div>
        <div className={styles.actions}>
          {mode === 'edit' && (
            <Button type="button" variant="destructive" loading={deleting} onClick={handleDelete}>
              <Icon name={ICON.trash} size={12} />
              <span>Excluir</span>
            </Button>
          )}
          <Button type="submit" loading={saving}>
            <Icon name={ICON.save} size={12} />
            <span>{mode === 'edit' ? 'Salvar' : 'Criar'}</span>
          </Button>
        </div>
      </div>

      <div className={styles.card}>
        <FormBuilder fields={fields} data={data} errors={errors} onChange={handleChange} />
      </div>

      {renderExtras && renderExtras(data)}
    </form>
  );
}
