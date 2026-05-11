import styles from './Header.module.css';
import type { User } from '@/src/types/user';

interface HeaderProps {
  user: User;
  title?: string;
}

export function Header({ user, title }: HeaderProps) {
  return (
    <header className={styles.header}>
      {title && <h1 className={styles.title}>{title}</h1>}
      <div className={styles.userInfo}>
        <span className={styles.userName}>{user.name}</span>
        <div className={styles.avatar}>
          {user.name.charAt(0).toUpperCase()}
        </div>
      </div>
    </header>
  );
}
