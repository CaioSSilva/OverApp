import { Chat } from "@google/genai";

export interface MessageInterface {
  text: string;
  actor: string
}

export interface ChatInterface {
  id: string;
  chat: Chat;
}
