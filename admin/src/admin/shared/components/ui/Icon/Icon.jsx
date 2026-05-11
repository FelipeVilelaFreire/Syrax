import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export default function Icon({ name, size = 16, color, className = '', style = {} }) {
  return (
    <FontAwesomeIcon
      icon={['fas', name]}
      className={className}
      style={{ fontSize: size, color, ...style }}
    />
  );
}
