import { PT_BR } from './pt-BR';
import { EN } from './en';

const LOCALE = (process.env.NEXT_PUBLIC_LOCALE ?? 'pt-BR') as 'pt-BR' | 'en';
export const STRINGS = LOCALE === 'en' ? EN : PT_BR;
