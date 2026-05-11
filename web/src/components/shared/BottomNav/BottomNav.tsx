'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './BottomNav.module.css';
import { Icon } from '@/src/components/ui/Icon';
import { STRINGS } from '@/src/constants/strings';
import { ROUTES } from '@/src/constants/routes';
import { ICON_NAMES } from '@/src/constants/icons';
import type { UserRole } from '@/src/types/user';

interface BottomNavProps {
  role: UserRole;
}

export function BottomNav({ role }: BottomNavProps) {
  const pathname = usePathname();

  const items = [
    { label: STRINGS.nav.dashboard,    href: ROUTES.DASHBOARD,    icon: ICON_NAMES.dashboard },
    { label: STRINGS.nav.leads,        href: ROUTES.LEADS,        icon: ICON_NAMES.leads },
    { label: STRINGS.nav.oportunidades, href: ROUTES.OPORTUNIDADES, icon: ICON_NAMES.oportunidades },
    { label: STRINGS.nav.conversas,    href: ROUTES.CONVERSAS,    icon: ICON_NAMES.conversas },
    { label: STRINGS.nav.recuperacoes, href: ROUTES.RECUPERACOES, icon: ICON_NAMES.recuperacoes },
  ];

  return (
    <nav className={styles.nav}>
      {items.map((item) => {
        const isActive = pathname.startsWith(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            className={[styles.item, isActive ? styles.active : ''].join(' ')}
          >
            <Icon name={item.icon} size={20} />
            <span className={styles.label}>{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
