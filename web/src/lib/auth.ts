import { storage } from './storage';

const ACCESS_KEY = 'syrax_access';
const REFRESH_KEY = 'syrax_refresh';

export const getAccessToken = (): string | null => storage.get(ACCESS_KEY);
export const getRefreshToken = (): string | null => storage.get(REFRESH_KEY);

export const setTokens = (access: string, refresh: string): void => {
  storage.set(ACCESS_KEY, access);
  storage.set(REFRESH_KEY, refresh);
};

export const clearTokens = (): void => {
  storage.remove(ACCESS_KEY);
  storage.remove(REFRESH_KEY);
};

export const refreshAccessToken = async (): Promise<void> => {
  const refresh = getRefreshToken();
  if (!refresh) throw new Error('No refresh token');

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/token/refresh/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refresh }),
  });

  if (!res.ok) {
    clearTokens();
    throw new Error('Refresh failed');
  }

  const data = await res.json();
  storage.set(ACCESS_KEY, data.access);
};
