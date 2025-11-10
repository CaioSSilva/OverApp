import React, { createContext, useState } from 'react';
import { Chat } from '../interfaces/Athena.model';

interface AthenaContextData {
  actualChatId: string | null;
  setActualChatId: (id: string | null) => void;
  chats: Chat[];
  setChats: (chats: Chat[]) => void;
}

const AthenaContext = createContext<AthenaContextData>({
  actualChatId: null,
  setActualChatId: () => {},
  chats: [],
  setChats: () => {},
});

export const AthenaProvider = (children: { children: React.ReactNode }) => {
  const [actualChatId, setActualChatId] = useState<string | null>(null);
  const [chats, setChats] = useState<Chat[]>([]);

  return (
    <AthenaContext.Provider
      value={{ actualChatId, setActualChatId, chats, setChats }}
    >
      {children.children}
    </AthenaContext.Provider>
  );
};

export default AthenaContext;
