import { isAxiosError } from 'axios';
import { STRINGS } from '@/src/constants/strings';

export function getErrorMessage(err: unknown): string {
  if (isAxiosError(err)) {
    const data = err.response?.data;
    if (typeof data === 'string') return data;
    if (data?.detail) return String(data.detail);
    if (data && typeof data === 'object') {
      const first = Object.values(data)[0];
      return Array.isArray(first) ? String(first[0]) : String(first);
    }
    if (err.code === 'ERR_NETWORK') return STRINGS.errors.networkError;
  }
  if (err instanceof Error) return err.message;
  return STRINGS.errors.generic;
}
