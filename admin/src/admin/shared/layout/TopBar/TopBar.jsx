import { useLocation } from 'react-router-dom';
import Icon from '@/admin/shared/components/ui/Icon';
import { ICON } from '@/admin/lib/iconMapper';
import styles from './TopBar.module.css';

const TITLES = {
  '/':          { label: 'Dashboard', icon: ICON.dashboard },
  '/companies': { label: 'Empresas',  icon: ICON.companies },
  '/users':     { label: 'Acessos ao sistema', icon: ICON.users },
};

function resolveTitle(pathname) {
  if (pathname === '/') return TITLES['/'];
  if (pathname.startsWith('/companies')) return TITLES['/companies'];
  if (pathname.startsWith('/users')) return TITLES['/users'];
  return { label: 'SYRAX Admin', icon: ICON.shield };
}

export default function TopBar() {
  const { pathname } = useLocation();
  const { label, icon } = resolveTitle(pathname);

  return (
    <header className={styles.topbar}>
      <div className={styles.titleRow}>
        <Icon name={icon} size={16} />
        <h1 className={styles.title}>{label}</h1>
      </div>
    </header>
  );
}
