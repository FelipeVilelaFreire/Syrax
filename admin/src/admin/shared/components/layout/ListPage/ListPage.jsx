import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api, getErrorMessage } from '@/services/api';
import { useToast } from '@/admin/contexts/ToastContext';
import Button from '@/admin/shared/components/ui/Button';
import Icon from '@/admin/shared/components/ui/Icon';
import Spinner from '@/admin/shared/components/ui/Spinner';
import { ICON } from '@/admin/lib/iconMapper';
import styles from './ListPage.module.css';

export default function ListPage({
  title,
  subtitle,
  endpoint,
  columns,
  addPath,
  addLabel = 'Adicionar',
  rowLinkPath,
  searchKeys,
  emptyTitle = 'Nada por aqui ainda',
  emptyBody = 'Quando algo for criado, aparecerá nesta lista.',
  emptyIcon = ICON.companies,
}) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const toast = useToast();
  const navigate = useNavigate();

  const load = async () => {
    setLoading(true);
    try {
      const res = await api.get(endpoint);
      setItems(res.data.results ?? res.data);
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [endpoint]);

  const filtered = useMemo(() => {
    if (!search || !searchKeys?.length) return items;
    const q = search.toLowerCase();
    return items.filter((row) =>
      searchKeys.some((k) => String(row[k] ?? '').toLowerCase().includes(q)),
    );
  }, [items, search, searchKeys]);

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>{title}</h1>
          {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
        </div>
        {addPath && (
          <Link to={addPath}>
            <Button>
              <Icon name={ICON.add} size={12} />
              <span>{addLabel}</span>
            </Button>
          </Link>
        )}
      </div>

      {searchKeys?.length > 0 && (
        <div className={styles.toolbar}>
          <div className={styles.searchWrap}>
            <Icon name={ICON.search} size={13} className={styles.searchIcon} />
            <input
              className={styles.searchInput}
              placeholder="Buscar..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <span className={styles.count}>
            {filtered.length} {filtered.length === 1 ? 'registro' : 'registros'}
          </span>
        </div>
      )}

      {loading ? (
        <div className={styles.center}><Spinner /></div>
      ) : filtered.length === 0 ? (
        <div className={styles.emptyCard}>
          <div className={styles.emptyIcon}>
            <Icon name={emptyIcon} size={22} />
          </div>
          <p className={styles.emptyTitle}>{emptyTitle}</p>
          <p className={styles.emptyBody}>{emptyBody}</p>
          {addPath && (
            <Link to={addPath} className={styles.emptyAction}>
              <Button>
                <Icon name={ICON.add} size={12} />
                <span>{addLabel}</span>
              </Button>
            </Link>
          )}
        </div>
      ) : (
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                {columns.map((col) => (
                  <th key={col.key} style={{ width: col.width, textAlign: col.align }}>
                    {col.label}
                  </th>
                ))}
                {rowLinkPath && <th style={{ width: 40 }}></th>}
              </tr>
            </thead>
            <tbody>
              {filtered.map((row) => (
                <tr
                  key={row.id}
                  onClick={() => rowLinkPath && navigate(rowLinkPath(row))}
                  className={rowLinkPath ? styles.clickable : ''}
                >
                  {columns.map((col) => (
                    <td key={col.key} style={{ textAlign: col.align }}>
                      {col.render ? col.render(row[col.key], row) : row[col.key]}
                    </td>
                  ))}
                  {rowLinkPath && (
                    <td className={styles.chevronCell}>
                      <Icon name={ICON.next} size={11} />
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
