import Link from 'next/link';
import { ROUTES } from '@/src/constants/routes';
import { STRINGS } from '@/src/constants/strings';

export default function NotFound() {
  return (
    <main style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', gap: '16px' }}>
      <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--font-size-4xl)', color: 'var(--color-text)' }}>404</h1>
      <p style={{ color: 'var(--color-text-muted)' }}>{STRINGS.errors.notFound}</p>
      <Link href={ROUTES.DASHBOARD} style={{ color: 'var(--color-primary)' }}>{STRINGS.actions.back}</Link>
    </main>
  );
}
