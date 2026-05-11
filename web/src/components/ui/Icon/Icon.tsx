'use client';
import '@/src/lib/iconMapper';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { resolveIconName } from '@/src/lib/iconMapper';
import styles from './Icon.module.css';

interface IconProps {
  name: string;
  size?: number;
  color?: string;
  className?: string;
}

export function Icon({ name, size = 16, color, className }: IconProps) {
  return (
    <FontAwesomeIcon
      icon={['fas', resolveIconName(name)] as never}
      style={{ fontSize: size, color }}
      className={[styles.icon, className ?? ''].join(' ')}
    />
  );
}
