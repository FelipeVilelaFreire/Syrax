'use client';
import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import styles from './layout.module.css';
import { useAuth } from '@/src/contexts/AuthContext';
import { Sidebar } from '@/src/components/shared/Sidebar';
import { Header } from '@/src/components/shared/Header';
import { BottomNav } from '@/src/components/shared/BottomNav';
import { PageSkeleton } from '@/src/components/ui/Skeleton';
import { ROUTES } from '@/src/constants/routes';
import { STRINGS } from '@/src/constants/strings';

const PAGE_TITLES: Record<string, string> = {
  [ROUTES.DASHBOARD]: STRINGS.dashboard.title,
  [ROUTES.LEADS]: STRINGS.lead.title,
  [ROUTES.OPORTUNIDADES]: STRINGS.oportunidades.title,
  [ROUTES.CONVERSAS]: STRINGS.conversas.title,
  [ROUTES.RECUPERACOES]: STRINGS.recuperacoes.title,
  [ROUTES.INTEGRACOES]: STRINGS.integracoes.title,
  [ROUTES.RELATORIOS]: STRINGS.relatorios.title,
  [ROUTES.CONFIGURACOES]: STRINGS.configuracoes.title,
};

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (loading) return;
    if (!user) { router.replace(ROUTES.LOGIN); return; }
  }, [user, loading, router]);

  if (loading) return <PageSkeleton />;
  if (!user) return null;

  const title = Object.entries(PAGE_TITLES).find(([route]) => pathname.startsWith(route))?.[1];

  return (
    <div className={styles.shell}>
      <Sidebar role={user.role} onLogout={logout} />
      <div className={styles.main}>
        <Header user={user} title={title} />
        <main className={styles.content}>{children}</main>
      </div>
      <BottomNav role={user.role} />
    </div>
  );
}
