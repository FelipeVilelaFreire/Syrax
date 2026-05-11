import { api } from './api';
import type { Integration } from '@/src/types/integration';
import type { PaginatedResponse } from '@/src/types/shared';

export const integrationService = {
  list: async () => {
    const res = await api.get<PaginatedResponse<Integration>>('/integrations/');
    return res.data;
  },

  retrieve: async (id: string) => {
    const res = await api.get<Integration>(`/integrations/${id}/`);
    return res.data;
  },
};
