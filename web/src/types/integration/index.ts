export type IntegrationPlatform = 'kiwify' | 'hotmart' | 'whatsapp';
export type IntegrationStatus = 'connected' | 'disconnected';

export interface Integration {
  id: string;
  platform: IntegrationPlatform;
  platform_display: string;
  status: IntegrationStatus;
  status_display: string;
  total_events_received: number;
  created_at: string;
  updated_at: string;
}
