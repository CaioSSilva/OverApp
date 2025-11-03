export interface ChatMessage {
  role: 'user' | 'model';
  content: string;
}

export interface Chat {
  id: string;
  name: string;
  messages: ChatMessage[];
  createdAt: number;
  updatedAt: number;
}
