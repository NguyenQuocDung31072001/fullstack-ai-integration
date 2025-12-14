export interface ChatRequestDto {
  messages: any[];
  conversationId?: string;
  model?: string;
  provider?: 'openai' | 'anthropic' | 'gemini';
}

