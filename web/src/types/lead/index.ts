import type { Interaction } from '../interaction';

export type LeadStatus = 'novo' | 'em_contato' | 'convertido' | 'perdido';
export type AbandonType = 'pix' | 'boleto' | 'cart';

export interface LeadListItem {
  id: string;
  name: string;
  phone: string;
  email: string;
  product_name: string;
  value: string;
  abandon_type: AbandonType;
  status: LeadStatus;
  status_display: string;
  origin: string;
  score: number;
  time_without_contact: number;
  created_at: string;
  updated_at: string;
}

export interface Lead extends LeadListItem {
  abandon_type_display: string;
  interactions: Interaction[];
}

export interface LeadCreateData {
  name: string;
  phone: string;
  email?: string;
  product_name: string;
  value: number;
  abandon_type: AbandonType;
  status?: LeadStatus;
  origin?: string;
}

export interface LeadUpdateData {
  status?: LeadStatus;
  name?: string;
  phone?: string;
  email?: string;
  product_name?: string;
  value?: number;
  abandon_type?: AbandonType;
}

export interface LeadFilters {
  status?: LeadStatus;
  abandon_type?: AbandonType;
  origin?: string;
  search?: string;
  ordering?: string;
  page?: number;
  page_size?: number;
}
