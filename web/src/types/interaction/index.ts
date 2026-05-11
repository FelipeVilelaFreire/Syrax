export type InteractionType = 'whatsapp_sent' | 'status_change' | 'note' | 'ai_triggered';

export interface Interaction {
  id: string;
  type: InteractionType;
  content: string;
  user_name: string | null;
  created_at: string;
}

export interface InteractionCreateData {
  type: InteractionType;
  content: string;
}
