const isClient = typeof window !== 'undefined';

export const storage = {
  get: (key: string): string | null => (isClient ? localStorage.getItem(key) : null),
  set: (key: string, value: string): void => { if (isClient) localStorage.setItem(key, value); },
  remove: (key: string): void => { if (isClient) localStorage.removeItem(key); },
  clear: (): void => { if (isClient) localStorage.clear(); },
};
