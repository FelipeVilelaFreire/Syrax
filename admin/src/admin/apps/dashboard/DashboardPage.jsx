import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '@/services/api';
import { API_ENDPOINTS } from '@/admin/ini/config/endpoints';
import Icon from '@/admin/shared/components/ui/Icon';
import Badge from '@/admin/shared/components/ui/Badge';
import Spinner from '@/admin/shared/components/ui/Spinner';
import { ICON } from '@/admin/lib/iconMapper';
import styles from './DashboardPage.module.css';

function formatDate(iso) {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' });
}

export default function DashboardPage() {
  const [stats, setStats] = useState(null);
  const [recentCompanies, setRecentCompanies] = useState([]);
  const [recentUsers, setRecentUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const [companies, users] = await Promise.all([
          api.get(API_ENDPOINTS.ADMIN_COMPANIES, { params: { page_size: 5 } }),
          api.get(API_ENDPOINTS.ADMIN_USERS, { params: { page_size: 5 } }),
        ]);
        const companiesList = companies.data.results ?? companies.data ?? [];
        const usersList = users.data.results ?? users.data ?? [];
        setStats({
          companies: companies.data.count ?? companiesList.length,
          users: users.data.count ?? usersList.length,
          superAdmins: usersList.filter((u) => u.is_superuser).length,
          activeUsers: usersList.filter((u) => u.is_active).length,
        });
        setRecentCompanies(companiesList);
        setRecentUsers(usersList);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) return <div className={styles.center}><Spinner /></div>;

  const kpis = [
    { label: 'Empresas',     value: stats?.companies ?? 0,    icon: ICON.companies,   variant: 'primary' },
    { label: 'Usuários',     value: stats?.users ?? 0,         icon: ICON.users,       variant: 'success' },
    { label: 'Super-admins', value: stats?.superAdmins ?? 0,   icon: ICON.shieldHalf,  variant: 'warning' },
    { label: 'Ativos',       value: stats?.activeUsers ?? 0,   icon: ICON.check,       variant: 'success' },
  ];

  return (
    <div className={styles.page}>
      <div>
        <h2 className={styles.greeting}>Visão geral</h2>
        <p className={styles.greetingSub}>Status atual da plataforma SYRAX</p>
      </div>

      <div className={styles.kpiGrid}>
        {kpis.map((kpi) => (
          <div key={kpi.label} className={styles.kpiCard}>
            <div className={[styles.kpiIcon, styles[`kpiIcon_${kpi.variant}`]].join(' ')}>
              <Icon name={kpi.icon} size={18} />
            </div>
            <p className={styles.kpiLabel}>{kpi.label}</p>
            <p className={styles.kpiValue}>{kpi.value}</p>
          </div>
        ))}
      </div>

      <div className={styles.twoCol}>
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <div className={styles.sectionTitleRow}>
              <Icon name={ICON.companies} size={14} />
              <h3 className={styles.sectionTitle}>Empresas recentes</h3>
            </div>
            <Link to="/companies" className={styles.sectionLink}>Ver todas →</Link>
          </div>
          <div className={styles.list}>
            {recentCompanies.length === 0 && (
              <div className={styles.empty}>Nenhuma empresa cadastrada.</div>
            )}
            {recentCompanies.map((c) => (
              <Link key={c.id} to={`/companies/${c.id}`} className={styles.listItem}>
                <div className={styles.itemAvatarIcon}>
                  <Icon name={ICON.store} size={14} />
                </div>
                <div className={styles.itemMain}>
                  <p className={styles.itemTitle}>{c.name}</p>
                  <p className={styles.itemSub}>{c.sector || 'Sem setor'} · {c.cnpj || 'sem CNPJ'}</p>
                </div>
                <span className={styles.itemDate}>{formatDate(c.created_at)}</span>
              </Link>
            ))}
          </div>
        </section>

        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <div className={styles.sectionTitleRow}>
              <Icon name={ICON.users} size={14} />
              <h3 className={styles.sectionTitle}>Usuários recentes</h3>
            </div>
            <Link to="/users" className={styles.sectionLink}>Ver todos →</Link>
          </div>
          <div className={styles.list}>
            {recentUsers.length === 0 && (
              <div className={styles.empty}>Nenhum usuário cadastrado.</div>
            )}
            {recentUsers.map((u) => (
              <Link key={u.id} to={`/users/${u.id}`} className={styles.listItem}>
                <div className={styles.itemAvatar}>
                  {u.name?.charAt(0).toUpperCase() ?? '?'}
                </div>
                <div className={styles.itemMain}>
                  <p className={styles.itemTitle}>{u.name}</p>
                  <p className={styles.itemSub}>{u.email}</p>
                </div>
                <div className={styles.itemBadges}>
                  {u.is_superuser && <Badge variant="primary" icon={ICON.shield} size="sm">super</Badge>}
                  {!u.is_active && <Badge variant="muted" size="sm">inativo</Badge>}
                </div>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
