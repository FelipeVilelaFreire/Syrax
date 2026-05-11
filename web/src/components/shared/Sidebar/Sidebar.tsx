'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './Sidebar.module.css';
import { Icon } from '@/src/components/ui/Icon';
import { STRINGS } from '@/src/constants/strings';
import { ROUTES } from '@/src/constants/routes';
import { ICON_NAMES } from '@/src/constants/icons';
import type { UserRole } from '@/src/types/user';

interface NavItem {
  label: string;
  href: string;
  icon: string;
  adminOnly?: boolean;
}

interface NavSection {
  title: string;
  items: NavItem[];
}

const NAV_SECTIONS: NavSection[] = [
  {
    title: STRINGS.nav.sectionPrincipal,
    items: [
      { label: STRINGS.nav.dashboard, href: ROUTES.DASHBOARD, icon: ICON_NAMES.dashboard, adminOnly: true },
      { label: STRINGS.nav.leads, href: ROUTES.LEADS, icon: ICON_NAMES.leads },
      { label: STRINGS.nav.oportunidades, href: ROUTES.OPORTUNIDADES, icon: ICON_NAMES.oportunidades },
      { label: STRINGS.nav.conversas, href: ROUTES.CONVERSAS, icon: ICON_NAMES.conversas },
      { label: STRINGS.nav.recuperacoes, href: ROUTES.RECUPERACOES, icon: ICON_NAMES.recuperacoes },
    ],
  },
  {
    title: STRINGS.nav.sectionSistema,
    items: [
      { label: STRINGS.nav.integracoes, href: ROUTES.INTEGRACOES, icon: ICON_NAMES.integracoes, adminOnly: true },
      { label: STRINGS.nav.relatorios, href: ROUTES.RELATORIOS, icon: ICON_NAMES.relatorios, adminOnly: true },
      { label: STRINGS.nav.configuracoes, href: ROUTES.CONFIGURACOES, icon: ICON_NAMES.configuracoes, adminOnly: true },
    ],
  },
];

interface SidebarProps {
  role: UserRole;
  onLogout: () => void;
}

export function Sidebar({ role, onLogout }: SidebarProps) {
  const pathname = usePathname();

  const visibleSections = NAV_SECTIONS
    .map((section) => ({
      ...section,
      items: section.items.filter((item) => !item.adminOnly || role === 'admin'),
    }))
    .filter((section) => section.items.length > 0);

  return (
    <aside className={styles.sidebar}>
      <div className={styles.logo}>
        {/* TODO: Replace with ReactBits ShinyText — https://www.reactbits.dev/text-animations/shiny-text */}
        <span className={styles.logoText}>SYRAX</span>
      </div>

      <nav className={styles.nav}>
        {visibleSections.map((section) => (
          <div key={section.title} className={styles.section}>
            <p className={styles.sectionTitle}>{section.title}</p>
            <div className={styles.sectionItems}>
              {section.items.map((item) => {
                const isActive = pathname.startsWith(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={[styles.navItem, isActive ? styles.active : ''].join(' ')}
                  >
                    <Icon name={item.icon} size={16} />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      <button className={styles.logout} onClick={onLogout}>
        <Icon name={ICON_NAMES.logout} size={14} />
        <span>{STRINGS.nav.logout}</span>
      </button>
    </aside>
  );
}
