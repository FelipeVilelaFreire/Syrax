import { api } from './api';
import type { Company, CompanyCreateData, CompanyUpdateData } from '@/src/types/company';
import type { User } from '@/src/types/user';

export const companyService = {
  onboarding: async (data: CompanyCreateData) => {
    const res = await api.post<{ company: Company; user: User; access: string; refresh: string }>(
      '/companies/onboarding/',
      data,
    );
    return res.data;
  },

  me: async () => {
    const res = await api.get<Company>('/companies/me/');
    return res.data;
  },

  update: async (data: CompanyUpdateData) => {
    const res = await api.patch<Company>('/companies/me/', data);
    return res.data;
  },

  team: async () => {
    const res = await api.get<User[]>('/companies/team/');
    return res.data;
  },
};
