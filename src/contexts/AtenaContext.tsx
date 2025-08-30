import { createContext, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { AthenaService } from '../hooks/athena';
import Toast from '@svipwrap/react-native-toast-message';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ChatInterface } from '../interfaces/Message.model';

interface AtenaContextType {
  chats: ChatInterface[];
  selectedChatId?: string | null;
  createChat: () => void;
  deleteChat: (chatId: string) => void;
  selectChat: (chatId: string) => void;
  sendMessage: (message: string) => void;
  getSelectedChat: () => ChatInterface | undefined;
}

export const AthenaContext = createContext({} as AtenaContextType);

export const AthenaProvider = ({ children }: { children: React.ReactNode }) => {
  const { t } = useTranslation();
  const [chats, setChats] = useState<ChatInterface[]>([]);
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);

  const { newChat } = AthenaService();

  const createChat = () => {
    if (chats.length >= 10) {
      Toast.show({
        type: 'error',
        text1: t('toasts.error'),
        text2: t('toasts.limitReached'),
      });
      return;
    }

    newChat().then(chat => {
      const randomId = Math.random().toString(36).substring(7);
      AsyncStorage.setItem('chat-' + randomId, JSON.stringify(chat));
      setChats(prev => [...prev, { id: 'chat-' + randomId, chat: chat }]);
      setSelectedChatId('chat-' + randomId);
      Toast.show({
        type: 'success',
        text1: t('toasts.chatCreated'),
      });
    });
  };

  const deleteChat = (chatId: string) => {
    AsyncStorage.removeItem(chatId).then(() => {
      setChats(prev => prev.filter(c => c.id !== chatId));
      if (selectedChatId === chatId) {
        setSelectedChatId(null);
      }
      Toast.show({
        type: 'success',
        text1: t('toasts.chatDeleted'),
      });
    });
  };

  const sendMessage = (message: string) => {
    if (!selectedChatId) createChat();
    const chat = chats.find(c => c.id === selectedChatId)?.chat;
    if (!chat) return;

    chat
      .sendMessage({
        message: message,
      })
      .then(() => {
        AsyncStorage.setItem(selectedChatId!, JSON.stringify(chat));
        setChats(prev =>
          prev.map(c => (c.id === selectedChatId ? { ...c, chat } : c)),
        );
      });
  };

  const selectChat = (chatId: string) => {
    setSelectedChatId(chatId);
  };

  const getSelectedChat = () => {
    return chats.find(c => c.id === selectedChatId);
  };

  return (
    <AthenaContext.Provider
      value={{
        chats,
        selectedChatId,
        createChat,
        deleteChat,
        selectChat,
        sendMessage,
        getSelectedChat,
      }}
    >
      {children}
    </AthenaContext.Provider>
  );
};

export default AthenaProvider;
