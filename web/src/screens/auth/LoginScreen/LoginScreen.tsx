'use client';
import styles from './LoginScreen.module.css';
import { Input } from '@/src/components/ui/Input';
import { Button } from '@/src/components/ui/Button';
import { STRINGS } from '@/src/constants/strings';
import { useLoginForm } from '@/src/hooks/auth/useAuthForm';

export function LoginScreen() {
  const { form, error, isLoading, setField, handleSubmit } = useLoginForm();
  const s = STRINGS.auth.login;

  return (
    <div className={styles.container}>
      {/* TODO: ReactBits Aurora background — https://www.reactbits.dev/backgrounds/aurora */}
      <p className={styles.logo}>SYRAX</p>
      <h1 className={styles.title}>{s.title}</h1>
      <p className={styles.subtitle}>{s.subtitle}</p>

      {error && <p className={styles.error}>{error}</p>}

      <form
        className={styles.form}
        onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}
      >
        <Input
          label={s.emailLabel}
          type="email"
          autoComplete="email"
          placeholder={s.emailPlaceholder}
          value={form.email}
          onChange={(e) => setField('email', e.target.value)}
        />
        <Input
          label={s.passwordLabel}
          type="password"
          autoComplete="current-password"
          placeholder={s.passwordPlaceholder}
          value={form.password}
          onChange={(e) => setField('password', e.target.value)}
        />
        <Button type="submit" loading={isLoading} fullWidth>
          {s.submit}
        </Button>
      </form>
    </div>
  );
}
