export interface Company {
  id: string;
  name: string;
  cnpj: string;
  sector: string;
  webhook_token: string;
  created_at: string;
  updated_at: string;
}

export interface CompanyCreateData {
  name: string;
  cnpj?: string;
  sector?: string;
}

export interface CompanyUpdateData {
  name?: string;
  cnpj?: string;
  sector?: string;
}
