import { createContext, useContext, useState, useCallback } from 'react';
import Icon from '@/admin/shared/components/ui/Icon';
import { ICON } from '@/admin/lib/iconMapper';
import styles from './Toast.module.css';

const ToastContext = createContext(null);

const TYPE_ICON = {
  success: ICON.success,
  error:   ICON.error,
  info:    ICON.info,
  warning: ICON.warning,
};

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const dismiss = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const show = useCallback((message, type = 'info') => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => dismiss(id), 4000);
  }, [dismiss]);

  const success = useCallback((m) => show(m, 'success'), [show]);
  const error = useCallback((m) => show(m, 'error'), [show]);
  const info = useCallback((m) => show(m, 'info'), [show]);
  const warning = useCallback((m) => show(m, 'warning'), [show]);

  return (
    <ToastContext.Provider value={{ show, success, error, info, warning }}>
      {children}
      <div className={styles.container}>
        {toasts.map((t) => (
          <div key={t.id} className={[styles.toast, styles[t.type]].join(' ')}>
            <Icon name={TYPE_ICON[t.type] ?? ICON.info} size={14} />
            <span className={styles.message}>{t.message}</span>
            <button type="button" className={styles.dismiss} onClick={() => dismiss(t.id)}>
              <Icon name={ICON.close} size={11} />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be inside ToastProvider');
  return ctx;
}
