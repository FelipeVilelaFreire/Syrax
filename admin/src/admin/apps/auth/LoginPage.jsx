import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/admin/contexts/AuthContext';
import { useToast } from '@/admin/contexts/ToastContext';
import { getErrorMessage } from '@/services/api';
import Input from '@/admin/shared/components/ui/Input';
import Button from '@/admin/shared/components/ui/Button';
import Icon from '@/admin/shared/components/ui/Icon';
import { ICON } from '@/admin/lib/iconMapper';
import styles from './LoginPage.module.css';

export default function LoginPage() {
  const { login } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const user = await login(email, password);
      if (!user.is_superuser) {
        toast.error('Esta conta não tem permissão para acessar o admin.');
        return;
      }
      toast.success(`Bem-vindo, ${user.name}!`);
      navigate('/');
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.shell}>
      <div className={styles.bgGlow} />
      <form className={styles.card} onSubmit={handleSubmit}>
        <div className={styles.iconWrap}>
          <Icon name={ICON.shieldHalf} size={28} />
        </div>
        <div className={styles.brandRow}>
          <p className={styles.brand}>SYRAX</p>
          <span className={styles.brandTag}>admin</span>
        </div>
        <h1 className={styles.title}>Entrar no painel</h1>
        <p className={styles.subtitle}>Acesso restrito à equipe SYRAX</p>

        <div className={styles.fields}>
          <Input
            label="E-mail"
            type="email"
            autoComplete="email"
            placeholder="seu@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Input
            label="Senha"
            type="password"
            autoComplete="current-password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <Button type="submit" loading={loading}>Entrar no admin</Button>
      </form>

      <p className={styles.footer}>
        Não é admin? <a href="http://localhost:3000" className={styles.footerLink}>Acessar app cliente</a>
      </p>
    </div>
  );
}
