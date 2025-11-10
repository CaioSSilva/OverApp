import { useState, useEffect, useContext } from 'react';
import { GenerateContentResponse, GoogleGenAI } from '@google/genai';
import { defaultPayload } from './athenaAct';
import { Chat, ChatMessage } from '../interfaces/Athena.model';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';
import AthenaContext from '../contexts/AthenaContext';
import { useTranslation } from 'react-i18next';

const CHATS_STORAGE_KEY = '@athena_chats';

const athena = new GoogleGenAI({
  apiKey: 'AIzaSyC-4cXUks22_UTfBp_iYpUZ7FYGR_f1wq0',
});

const askAthena = async (question: string): Promise<string | undefined> => {
  const response = await athena.models.generateContent({
    model: 'gemini-2.0-flash',
    contents: { text: defaultPayload + question },
  });
  return extractAthenaText(response);
};

function extractAthenaText(
  response: GenerateContentResponse | undefined,
): string | undefined {
  return response?.candidates?.[0]?.content?.parts?.[0]?.text;
}

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
    if (chats.length > 8) {
      Toast.show({
        type: 'info',
        text1: t('athena.errors.chatsLimit'),
        text2: t('athena.errors.chatsLimitSub'),
      });
    }
    const newChat: Chat = {
      id: Date.now().toString(),
      name: '',
      messages: [],
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
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
      const newChat: Chat = {
        id: Date.now().toString(),
        name: '',
        messages: [],
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };
      setChats([newChat, ...chats]);
      setActualChatId(newChat.id);
      currentChatId = newChat.id;
    }

    const userMessage: ChatMessage = {
      role: 'user',
      content: text,
    };

    const updatedChats = chats.map((chat) => {
      if (chat.id === currentChatId) {
        return {
          ...chat,
          messages: [...chat.messages, userMessage],
          updatedAt: Date.now(),
        };
      }
      return chat;
    });

    if (!chats.find((c) => c.id === currentChatId)) {
      updatedChats.unshift({
        id: currentChatId,
        name: '',
        messages: [userMessage],
        createdAt: Date.now(),
        updatedAt: Date.now(),
      });
    }

    setChats(updatedChats);
    setMessage('');
    setIsLoading(true);

    try {
      const previousMessages =
        updatedChats.find((c) => c.id === currentChatId)?.messages || [];
      const historyString = previousMessages
        .map((msg) => `${msg.role}: ${msg.content}`)
        .join('\n');

      const fullPrompt = historyString
        ? `${historyString}\nuser: ${text}`
        : text;
      const response = await askAthena(fullPrompt);

      if (response) {
        const modelMessage: ChatMessage = {
          role: 'model',
          content: response,
        };

        const finalChats = updatedChats.map((chat) => {
          if (chat.id === currentChatId) {
            return {
              ...chat,
              messages: [...chat.messages, modelMessage],
              updatedAt: Date.now(),
            };
          }
          return chat;
        });

        setChats(finalChats);
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

  const getCurrentChat = () => {
    return chats.find((chat) => chat.id === actualChatId);
  };

  const currentChat = getCurrentChat();
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
