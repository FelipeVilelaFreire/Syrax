import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api, getErrorMessage } from '@/services/api';
import { useToast } from '@/admin/contexts/ToastContext';
import { API_ENDPOINTS } from '@/admin/ini/config/endpoints';
import Button from '@/admin/shared/components/ui/Button';
import Icon from '@/admin/shared/components/ui/Icon';
import Spinner from '@/admin/shared/components/ui/Spinner';
import { ICON } from '@/admin/lib/iconMapper';
import { RoleBadge, StatusBadge, formatDate } from '../constants';
import styles from './UsersList.module.css';

const TABS = [
  { value: '',          label: 'Todos'       },
  { value: 'superuser', label: 'Super Admin' },
  { value: 'admin',     label: 'Gerente'     },
  { value: 'operator',  label: 'Operador'    },
];

function getRoleGroup(user) {
  if (user.is_superuser) return 'superuser';
  return user.role;
}

export default function UsersList() {
  const [users,     setUsers]       = useState([]);
  const [companies, setCompanies]   = useState({});
  const [loading,   setLoading]     = useState(true);
  const [search,    setSearch]      = useState('');
  const [activeTab, setActiveTab]   = useState('');
  const toast    = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      try {
        const [uRes, cRes] = await Promise.all([
          api.get(API_ENDPOINTS.ADMIN_USERS),
          api.get(API_ENDPOINTS.ADMIN_COMPANIES),
        ]);
        const userList    = uRes.data.results ?? uRes.data ?? [];
        const companyList = cRes.data.results ?? cRes.data ?? [];
        setUsers(userList);
        setCompanies(Object.fromEntries(companyList.map((c) => [c.id, c.name])));
      } catch (err) {
        toast.error(getErrorMessage(err));
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const counts = useMemo(() => ({
    '':          users.length,
    superuser:   users.filter((u) => u.is_superuser).length,
    admin:       users.filter((u) => !u.is_superuser && u.role === 'admin').length,
    operator:    users.filter((u) => !u.is_superuser && u.role === 'operator').length,
  }), [users]);

  const filtered = useMemo(() => {
    let list = users;
    if (activeTab) list = list.filter((u) => getRoleGroup(u) === activeTab);
    if (search) {
      const q = search.toLowerCase();
      list = list.filter((u) =>
        u.name?.toLowerCase().includes(q) || u.email?.toLowerCase().includes(q),
      );
    }
    return list;
  }, [users, activeTab, search]);

  return (
    <div className={styles.page}>

      {/* Header */}
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Acessos ao sistema</h1>
          <p className={styles.subtitle}>
            Super admins Syrax e usuários vinculados às empresas clientes
          </p>
        </div>
        <Link to="/users/new">
          <Button>
            <Icon name={ICON.add} size={12} />
            <span>Novo acesso</span>
          </Button>
        </Link>
      </div>

      {/* Tabs + search */}
      <div className={styles.toolbar}>
        <div className={styles.tabs}>
          {TABS.map((tab) => (
            <button
              key={tab.value}
              className={[styles.tab, activeTab === tab.value ? styles.tabActive : ''].join(' ')}
              onClick={() => setActiveTab(tab.value)}
            >
              {tab.label}
              <span className={styles.tabCount}>{counts[tab.value]}</span>
            </button>
          ))}
        </div>

        <div className={styles.searchWrap}>
          <Icon name={ICON.search} size={13} className={styles.searchIcon} />
          <input
            className={styles.searchInput}
            placeholder="Buscar por nome ou e-mail..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div className={styles.center}><Spinner /></div>
      ) : filtered.length === 0 ? (
        <div className={styles.empty}>
          <div className={styles.emptyIcon}><Icon name={ICON.users} size={22} /></div>
          <p className={styles.emptyTitle}>Nenhum acesso encontrado</p>
          <p className={styles.emptyBody}>
            {search ? 'Tente outro termo de busca.' : 'Crie o primeiro acesso usando o botão acima.'}
          </p>
        </div>
      ) : (
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Usuário</th>
                <th>Cargo</th>
                <th>Empresa</th>
                <th>Status</th>
                <th>Criado em</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {filtered.map((user) => (
                <tr
                  key={user.id}
                  className={styles.row}
                  onClick={() => navigate(`/users/${user.id}`)}
                >
                  <td>
                    <div className={styles.userCell}>
                      <div className={[
                        styles.avatar,
                        user.is_superuser ? styles.avatarSuper : '',
                      ].join(' ')}>
                        {user.name?.charAt(0).toUpperCase() ?? '?'}
                      </div>
                      <div className={styles.userInfo}>
                        <span className={styles.userName}>{user.name}</span>
                        <span className={styles.userEmail}>{user.email}</span>
                      </div>
                    </div>
                  </td>

                  <td><RoleBadge user={user} /></td>

                  <td>
                    {user.company_name
                      ? <span className={styles.companyName}>{user.company_name}</span>
                      : <span className={styles.dim}>—</span>
                    }
                  </td>

                  <td><StatusBadge active={user.is_active} /></td>

                  <td className={styles.dim}>{formatDate(user.created_at)}</td>

                  <td className={styles.chevron}>
                    <Icon name={ICON.next} size={11} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
