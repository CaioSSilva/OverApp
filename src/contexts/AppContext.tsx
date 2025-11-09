import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useState } from 'react';
import React from 'react';
interface MainContextType {
  Loaded: boolean;
  setLoaded: React.Dispatch<React.SetStateAction<boolean>>;
  User: { name: string } | null;
  setUser: React.Dispatch<React.SetStateAction<{ name: string } | null>>;
  Authenticated: boolean;
  setAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
  logOut: () => Promise<void>;
}

export const AppContext = createContext({} as MainContextType);

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const [Loaded, setLoaded] = useState(false);
  const [User, setUser] = useState<{ name: string } | null>(null);
  const [Authenticated, setAuthenticated] = useState(false);

  const logOut = async () => {
    await AsyncStorage.clear();
    setUser(null);
  };

  return (
    <AppContext.Provider value={{ Loaded, setLoaded, User, setUser, logOut, Authenticated, setAuthenticated }}>
      {children}
    </AppContext.Provider>
  );
};

export default AppProvider;
