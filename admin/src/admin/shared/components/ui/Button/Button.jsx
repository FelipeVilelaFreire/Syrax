import styles from './Button.module.css';

export default function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled,
  className = '',
  children,
  ...props
}) {
  return (
    <button
      className={[styles.btn, styles[variant], styles[size], className].join(' ')}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? '...' : children}
    </button>
  );
}
