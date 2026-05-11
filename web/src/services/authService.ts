import { api } from './api';
import { setTokens } from '@/src/lib/auth';
import type { User, LoginData, RegisterData } from '@/src/types/user';

export const authService = {
  register: async (data: RegisterData) => {
    const res = await api.post<{ user: User; access: string; refresh: string }>('/users/register/', data);
    setTokens(res.data.access, res.data.refresh);
    return res.data;
  },

  login: async (data: LoginData) => {
    const res = await api.post<{ user: User; access: string; refresh: string }>('/users/login/', data);
    setTokens(res.data.access, res.data.refresh);
    return res.data;
  },

  logout: async (refresh: string) => {
    await api.post('/users/logout/', { refresh });
  },

  me: async () => {
    const res = await api.get<User>('/users/me/');
    return res.data;
  },

  updateMe: async (data: Partial<Pick<User, 'name'>>) => {
    const res = await api.patch<User>('/users/me/', data);
    return res.data;
  },
};
