'use client';
import { useState } from 'react';
import styles from './ConfiguracoesScreen.module.css';
import { Input } from '@/src/components/ui/Input';
import { Button } from '@/src/components/ui/Button';
import { ErrorState } from '@/src/components/ui/ErrorState';
import { PageSkeleton } from '@/src/components/ui/Skeleton';
import { STRINGS } from '@/src/constants/strings';
import { useConfiguracoesScreen } from '@/src/hooks/configuracoes/useConfiguracoesScreen';

type Tab = 'empresa' | 'equipe' | 'faturamento';

export function ConfiguracoesScreen() {
  const { company, team, loading, isSaving, error, handleSaveCompany, refresh } = useConfiguracoesScreen();
  const [tab, setTab] = useState<Tab>('empresa');
  const [form, setForm] = useState({ name: '', cnpj: '', sector: '' });
  const s = STRINGS.configuracoes;

  if (loading) return <PageSkeleton />;
  if (error && !company) return <ErrorState message={error} onRetry={refresh} />;

  const companyData = company ?? { name: '', cnpj: '', sector: '' };

  return (
    <div className={styles.screen}>
      <div className={styles.tabs}>
        {(['empresa', 'equipe', 'faturamento'] as Tab[]).map((t) => (
          <button
            key={t}
            className={[styles.tab, tab === t ? styles.active : ''].join(' ')}
            onClick={() => setTab(t)}
          >
            {s.tabs[t]}
          </button>
        ))}
      </div>

      {tab === 'empresa' && (
        <div className={styles.section}>
          <p className={styles.sectionTitle}>{s.empresa.title}</p>
          {error && <p className={styles.error}>{error}</p>}
          <div className={styles.form}>
            <Input
              label={s.empresa.nameLabel}
              defaultValue={companyData.name}
              onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
            />
            <Input
              label={s.empresa.cnpjLabel}
              defaultValue={companyData.cnpj}
              onChange={(e) => setForm((p) => ({ ...p, cnpj: e.target.value }))}
            />
            <Input
              label={s.empresa.sectorLabel}
              defaultValue={companyData.sector}
              onChange={(e) => setForm((p) => ({ ...p, sector: e.target.value }))}
            />
            <div className={styles.saveBtn}>
              <Button
                loading={isSaving}
                onClick={() => handleSaveCompany(form)}
              >
                {isSaving ? STRINGS.actions.saving : STRINGS.actions.save}
              </Button>
            </div>
          </div>
        </div>
      )}

      {tab === 'equipe' && (
        <div className={styles.section}>
          <p className={styles.sectionTitle}>{s.equipe.title}</p>
          <div className={styles.teamList}>
            {team.map((member) => (
              <div key={member.id} className={styles.teamMember}>
                <div>
                  <p className={styles.memberName}>{member.name}</p>
                  <p className={styles.memberEmail}>{member.email}</p>
                </div>
                <span className={styles.memberRole}>
                  {member.role === 'admin' ? s.equipe.roleAdmin : s.equipe.roleOperator}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === 'faturamento' && (
        <div className={styles.section}>
          <p className={styles.sectionTitle}>{s.faturamento.title}</p>
          <p className={styles.comingSoon}>{s.faturamento.comingSoon}</p>
        </div>
      )}
    </div>
  );
}
