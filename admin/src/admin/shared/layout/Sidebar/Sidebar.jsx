import { NavLink } from 'react-router-dom';
import Icon from '@/admin/shared/components/ui/Icon';
import { ICON } from '@/admin/lib/iconMapper';
import { useAuth } from '@/admin/contexts/AuthContext';
import styles from './Sidebar.module.css';

const NAV = [
  { path: '/',          label: 'Dashboard', icon: ICON.dashboard },
  { path: '/companies', label: 'Empresas',  icon: ICON.companies },
  { path: '/users',     label: 'Acessos',   icon: ICON.users },
];

export default function Sidebar() {
  const { user, logout } = useAuth();
  const initial = user?.name?.charAt(0).toUpperCase() ?? 'A';

  return (
    <aside className={styles.sidebar}>
      <div className={styles.brand}>
        <span className={styles.brandText}>SYRAX</span>
        <span className={styles.brandTag}>admin</span>
      </div>

      <nav className={styles.nav}>
        <p className={styles.sectionTitle}>Geral</p>
        {NAV.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === '/'}
            className={({ isActive }) => [styles.item, isActive ? styles.active : ''].join(' ')}
          >
            <Icon name={item.icon} size={15} />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className={styles.footer}>
        <div className={styles.userCard}>
          <div className={styles.avatar}>{initial}</div>
          <div className={styles.userInfo}>
            <p className={styles.userName}>{user?.name ?? '—'}</p>
            <p className={styles.userMail}>{user?.email ?? '—'}</p>
          </div>
        </div>
        <button className={styles.logout} onClick={logout}>
          <Icon name={ICON.logout} size={13} />
          <span>Sair</span>
        </button>
      </div>
    </aside>
  );
}
