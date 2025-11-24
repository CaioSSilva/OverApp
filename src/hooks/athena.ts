import { useState, useEffect, useContext } from 'react';
import { GenerateContentResponse, GoogleGenAI } from '@google/genai';
import { defaultPayload } from './athenaAct';
import { Chat, ChatMessage } from '../interfaces/Athena.model';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';
import AthenaContext from '../contexts/AthenaContext';
import { useTranslation } from 'react-i18next';

const CHATS_STORAGE_KEY = '@athena_chats';
const MAX_CHATS = 8;

const athena = new GoogleGenAI({
  apiKey: 'AIzaSyChsNNivhH1VZjxg8YYZ9XT-OeImlcLwL8',
});

const extractAthenaText = (response: GenerateContentResponse | undefined): string | undefined => {
  return response?.candidates?.[0]?.content?.parts?.[0]?.text;
};

const askAthena = async (question: string): Promise<string | undefined> => {
  const response = await athena.models.generateContent({
    model: 'gemini-2.0-flash',
    contents: { text: defaultPayload + question },
  });
  return extractAthenaText(response);
};

const createNewChat = (): Chat => ({
  id: Date.now().toString(),
  name: '',
  messages: [],
  createdAt: Date.now(),
  updatedAt: Date.now(),
});

const addUserMessage = (chats: Chat[], chatId: string, content: string): Chat[] => {
  return chats.map((chat) =>
    chat.id === chatId
      ? {
          ...chat,
          messages: [...chat.messages, { role: 'user', content }],
          updatedAt: Date.now(),
        }
      : chat,
  );
};

const addModelMessage = (chats: Chat[], chatId: string, content: string): Chat[] => {
  return chats.map((chat) =>
    chat.id === chatId
      ? {
          ...chat,
          messages: [...chat.messages, { role: 'model', content }],
          updatedAt: Date.now(),
        }
      : chat,
  );
};

const buildPromptHistory = (messages: ChatMessage[]): string => {
  return messages.map((msg) => `${msg.role}: ${msg.content}`).join('\n');
};

export function useAthenaChat() {
  const { t } = useTranslation();
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { actualChatId, setActualChatId, chats, setChats } = useContext(AthenaContext);

  useEffect(() => {
    const loadChats = async () => {
      try {
        const storedChats = await AsyncStorage.getItem(CHATS_STORAGE_KEY);
        if (storedChats) {
          setChats(JSON.parse(storedChats));
        }
      } catch (error) {
        Toast.show({
          type: 'error',
          text1: t('athena.errors.loadChatsFailed'),
        });
      }
    };
    loadChats();
  }, [setChats, t]);

  useEffect(() => {
    const saveChats = async () => {
      try {
        await AsyncStorage.setItem(CHATS_STORAGE_KEY, JSON.stringify(chats));
      } catch (error) {
        Toast.show({
          type: 'error',
          text1: t('athena.errors.saveChatsFailed'),
        });
      }
    };

    if (chats.length > 0) {
      saveChats();
    }
  }, [chats, t]);

  const createChat = () => {
    if (chats.length >= MAX_CHATS) {
      Toast.show({
        type: 'info',
        text1: t('athena.errors.chatsLimit'),
        text2: t('athena.errors.chatsLimitSub'),
      });
      return;
    }
    const newChat = createNewChat();
    setChats([newChat, ...chats]);
    setActualChatId(newChat.id);
  };

  const selectChat = (chatId: string) => {
    setActualChatId(chatId);
  };

  const deleteChat = (chatId: string) => {
    const updatedChats = chats.filter((chat) => chat.id !== chatId);
    setChats(updatedChats);
    if (actualChatId === chatId) {
      setActualChatId(null);
    }
  };

  const sendMessage = async (text: string) => {
    if (!text.trim()) return;

    let currentChatId = actualChatId;

    if (!currentChatId) {
      const newChat = createNewChat();
      setChats([newChat, ...chats]);
      setActualChatId(newChat.id);
      currentChatId = newChat.id;
    }

    let updatedChats = addUserMessage(chats, currentChatId, text);
    setChats(updatedChats);
    setMessage('');
    setIsLoading(true);

    try {
      const previousMessages = updatedChats.find((c) => c.id === currentChatId)?.messages || [];
      const historyString = buildPromptHistory(previousMessages.slice(0, -1));
      const fullPrompt = historyString ? `${historyString}\nuser: ${text}` : text;
      const response = await askAthena(fullPrompt);

      if (response) {
        updatedChats = addModelMessage(updatedChats, currentChatId, response);
        setChats(updatedChats);
      }
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: t('errors.unexpectedError'),
      });
    } finally {
      setIsLoading(false);
    }
  };

  const currentChat = chats.find((chat) => chat.id === actualChatId);
  const hasMessages = currentChat && currentChat.messages.length > 0;

  return {
    message,
    setMessage,
    isLoading,
    currentChat,
    hasMessages,
    createChat,
    selectChat,
    deleteChat,
    sendMessage,
  };
}

export function AthenaService() {
  return {
    askAthena,
  };
}
