import { library } from '@fortawesome/fontawesome-svg-core';
import {
  // navigation
  faGaugeHigh, faBuilding, faUsers, faRightFromBracket,
  // actions
  faPlus, faPenToSquare, faTrash, faMagnifyingGlass, faFloppyDisk,
  faArrowLeft, faChevronRight, faChevronLeft, faXmark, faCopy, faCheck,
  // status / data
  faCircleCheck, faCircleXmark, faCircleInfo, faCircleExclamation,
  faShield, faShieldHalved, faUserShield, faIdBadge,
  faSackDollar, faChartLine, faChartColumn, faClock,
  // people
  faUser, faUserGear, faUserTie, faEnvelope, faLock,
  // entities
  faStore, faBriefcase, faTag, faPlug, faWaveSquare,
  // misc
  faEllipsisVertical, faArrowTrendUp, faArrowTrendDown,
} from '@fortawesome/free-solid-svg-icons';

library.add(
  faGaugeHigh, faBuilding, faUsers, faRightFromBracket,
  faPlus, faPenToSquare, faTrash, faMagnifyingGlass, faFloppyDisk,
  faArrowLeft, faChevronRight, faChevronLeft, faXmark, faCopy, faCheck,
  faCircleCheck, faCircleXmark, faCircleInfo, faCircleExclamation,
  faShield, faShieldHalved, faUserShield, faIdBadge,
  faSackDollar, faChartLine, faChartColumn, faClock,
  faUser, faUserGear, faUserTie, faEnvelope, faLock,
  faStore, faBriefcase, faTag, faPlug, faWaveSquare,
  faEllipsisVertical, faArrowTrendUp, faArrowTrendDown,
);

export const ICON = {
  dashboard:    'gauge-high',
  companies:    'building',
  users:        'users',
  logout:       'right-from-bracket',

  add:          'plus',
  edit:         'pen-to-square',
  trash:        'trash',
  search:       'magnifying-glass',
  save:         'floppy-disk',
  back:         'arrow-left',
  next:         'chevron-right',
  prev:         'chevron-left',
  close:        'xmark',
  copy:         'copy',
  check:        'check',

  success:      'circle-check',
  error:        'circle-xmark',
  info:         'circle-info',
  warning:      'circle-exclamation',

  shield:       'shield',
  shieldHalf:   'shield-halved',
  userShield:   'user-shield',
  badge:        'id-badge',

  revenue:      'sack-dollar',
  chartLine:    'chart-line',
  chartColumn:  'chart-column',
  clock:        'clock',

  user:         'user',
  userGear:     'user-gear',
  userTie:      'user-tie',
  email:        'envelope',
  lock:         'lock',

  store:        'store',
  briefcase:    'briefcase',
  tag:          'tag',
  plug:         'plug',
  webhook:      'wave-square',

  more:         'ellipsis-vertical',
  trendUp:      'arrow-trend-up',
  trendDown:    'arrow-trend-down',
};
