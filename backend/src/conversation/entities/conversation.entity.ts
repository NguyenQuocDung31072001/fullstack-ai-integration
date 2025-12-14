export interface Conversation {
  id: string;
  title: string;
  messages: any[];
  model?: string;
  provider?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ConversationListItem {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  messageCount: number;
}

