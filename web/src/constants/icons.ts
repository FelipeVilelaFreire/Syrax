export const ICON_NAMES = {
  // Navigation
  dashboard: 'chart-line',
  leads: 'users',
  oportunidades: 'bolt',
  conversas: 'comments',
  recuperacoes: 'circle-check',
  integracoes: 'plug',
  relatorios: 'chart-bar',
  configuracoes: 'gear',
  // Actions
  add: 'plus',
  edit: 'pencil',
  delete: 'trash',
  close: 'xmark',
  back: 'chevron-left',
  forward: 'chevron-right',
  save: 'floppy-disk',
  search: 'magnifying-glass',
  copy: 'copy',
  export: 'arrow-up-from-bracket',
  refresh: 'rotate-right',
  // Lead/AI
  triggerAi: 'bolt',
  whatsapp: 'comment',
  phone: 'phone',
  email: 'envelope',
  // Status
  connected: 'circle-dot',
  disconnected: 'circle',
  // UI
  chevronDown: 'chevron-down',
  chevronUp: 'chevron-up',
  filter: 'filter',
  menu: 'bars',
  logout: 'arrow-right-from-bracket',
  user: 'user',
  company: 'building',
  warning: 'triangle-exclamation',
  info: 'circle-info',
  check: 'check',
  pause: 'pause',
} as const;

export type IconName = (typeof ICON_NAMES)[keyof typeof ICON_NAMES];
