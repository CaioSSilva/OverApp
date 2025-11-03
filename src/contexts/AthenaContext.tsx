import { createContext, useState } from 'react';
import { Chat } from '../interfaces/Athena.model';

const AthenaContext = createContext({});

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
