import Input from '@/admin/shared/components/ui/Input';
import styles from './FormBuilder.module.css';

export default function FormBuilder({ fields, data, errors = {}, onChange, readOnly = false }) {
  return (
    <div className={styles.form}>
      {fields.map((field) => {
        const value = data?.[field.name] ?? '';
        const err = errors[field.name];

        if (field.type === 'select') {
          return (
            <div key={field.name} className={styles.field}>
              <label className={styles.label}>{field.label}</label>
              <select
                className={styles.select}
                value={value ?? ''}
                disabled={readOnly}
                onChange={(e) => onChange(field.name, e.target.value)}
              >
                <option value="">— selecione —</option>
                {(field.options ?? []).map((opt) => {
                  const v = typeof opt === 'object' ? opt.value : opt;
                  const l = typeof opt === 'object' ? opt.label : opt;
                  return <option key={v} value={v}>{l}</option>;
                })}
              </select>
              {err && <p className={styles.error}>{err}</p>}
            </div>
          );
        }

        if (field.type === 'boolean') {
          return (
            <label key={field.name} className={styles.checkboxRow}>
              <input
                type="checkbox"
                checked={!!value}
                disabled={readOnly}
                onChange={(e) => onChange(field.name, e.target.checked)}
              />
              <span>{field.label}</span>
            </label>
          );
        }

        if (field.type === 'textarea') {
          return (
            <div key={field.name} className={styles.field}>
              <label className={styles.label}>{field.label}</label>
              <textarea
                className={styles.textarea}
                rows={field.rows ?? 4}
                value={value ?? ''}
                readOnly={readOnly}
                placeholder={field.placeholder}
                onChange={(e) => onChange(field.name, e.target.value)}
              />
              {err && <p className={styles.error}>{err}</p>}
            </div>
          );
        }

        return (
          <Input
            key={field.name}
            label={field.label}
            type={field.type ?? 'text'}
            placeholder={field.placeholder}
            value={value ?? ''}
            error={err}
            readOnly={readOnly}
            required={field.required}
            onChange={(e) => onChange(field.name, e.target.value)}
          />
        );
      })}
    </div>
  );
}
