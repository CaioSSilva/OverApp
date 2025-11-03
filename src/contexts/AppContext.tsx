import { createContext, useState } from 'react';
import React from 'react';
interface MainContextType {
  Loaded: boolean;
  setLoaded: React.Dispatch<React.SetStateAction<boolean>>;
  User: { name: string } | null;
  setUser: React.Dispatch<React.SetStateAction<{ name: string } | null>>;
}

export const AppContext = createContext({} as MainContextType);

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const [Loaded, setLoaded] = useState(false);
  const [User, setUser] = useState<{ name: string } | null>(null);

  return (
    <AppContext.Provider value={{ Loaded, setLoaded, User, setUser }}>
      {children}
    </AppContext.Provider>
  );
};

export default AppProvider;
