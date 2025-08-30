import { Chat, GenerateContentResponse, GoogleGenAI } from '@google/genai';
import { defaultPayload } from './athenaAct';

const athena = new GoogleGenAI({
  apiKey: 'AIzaSyDhS8-CVMB7Sfs6_vXe4E9xZmaVcLbc6yA',
});

const newChat = async (): Promise<Chat> => {
  const chat = athena.chats.create({
    model: 'gemini-2.5-flash',
    config:{
      systemInstruction: {
        text: defaultPayload,
      }
    }
  });

  return chat;
};

const sendMessage = async (
  chat: Chat,
  message: string,
): Promise<GenerateContentResponse> => {
  const res = await chat.sendMessage({
    message: message,
  });

  return res;
};

export function AthenaService() {
  return {
    newChat,
    sendMessage,
  };
}
