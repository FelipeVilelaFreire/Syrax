import Icon from '../Icon';
import styles from './Badge.module.css';

export default function Badge({ variant = 'neutral', icon, children, size = 'md' }) {
  return (
    <span className={[styles.badge, styles[variant], styles[size]].join(' ')}>
      {icon && <Icon name={icon} size={size === 'sm' ? 10 : 11} />}
      <span>{children}</span>
    </span>
  );
}
