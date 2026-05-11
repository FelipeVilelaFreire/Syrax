import { api } from './api';
import type { Lead, LeadListItem, LeadCreateData, LeadUpdateData, LeadFilters } from '@/src/types/lead';
import type { Interaction, InteractionCreateData } from '@/src/types/interaction';
import type { PaginatedResponse } from '@/src/types/shared';

export const leadService = {
  list: async (params?: LeadFilters) => {
    const res = await api.get<PaginatedResponse<LeadListItem>>('/leads/', { params });
    return res.data;
  },

  retrieve: async (id: string) => {
    const res = await api.get<Lead>(`/leads/${id}/`);
    return res.data;
  },

  create: async (data: LeadCreateData) => {
    const res = await api.post<Lead>('/leads/', data);
    return res.data;
  },

  update: async (id: string, data: LeadUpdateData) => {
    const res = await api.patch<Lead>(`/leads/${id}/`, data);
    return res.data;
  },

  delete: async (id: string) => api.delete(`/leads/${id}/`),

  triggerAi: async (id: string) => {
    const res = await api.post<Lead>(`/leads/${id}/trigger-ai/`);
    return res.data;
  },

  interactions: async (id: string) => {
    const res = await api.get<Interaction[]>(`/leads/${id}/interactions/`);
    return res.data;
  },

  addInteraction: async (id: string, data: InteractionCreateData) => {
    const res = await api.post<Interaction>(`/leads/${id}/interactions/`, data);
    return res.data;
  },
};
