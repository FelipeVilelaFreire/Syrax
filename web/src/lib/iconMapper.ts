'use client';
import { library } from '@fortawesome/fontawesome-svg-core';
import {
  faChartLine, faUsers, faBolt, faComments, faCircleCheck, faPlug,
  faChartBar, faGear, faPlus, faPencil, faTrash, faXmark, faChevronLeft,
  faChevronRight, faChevronDown, faChevronUp, faFloppyDisk, faMagnifyingGlass,
  faCopy, faArrowUpFromBracket, faRotateRight, faComment, faPhone, faEnvelope,
  faCircleDot, faCircle, faFilter, faBars, faArrowRightFromBracket, faUser,
  faBuilding, faTriangleExclamation, faCircleInfo, faCheck, faPause,
} from '@fortawesome/free-solid-svg-icons';

library.add(
  faChartLine, faUsers, faBolt, faComments, faCircleCheck, faPlug,
  faChartBar, faGear, faPlus, faPencil, faTrash, faXmark, faChevronLeft,
  faChevronRight, faChevronDown, faChevronUp, faFloppyDisk, faMagnifyingGlass,
  faCopy, faArrowUpFromBracket, faRotateRight, faComment, faPhone, faEnvelope,
  faCircleDot, faCircle, faFilter, faBars, faArrowRightFromBracket, faUser,
  faBuilding, faTriangleExclamation, faCircleInfo, faCheck, faPause,
);

const aliasMap: Record<string, string> = {
  'pencil-alt': 'pencil',
  'times': 'xmark',
  'edit': 'pencil',
  'remove': 'trash',
};

export function resolveIconName(name: string): string {
  return aliasMap[name] ?? name;
}
