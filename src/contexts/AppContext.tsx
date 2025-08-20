import { createContext, useState } from 'react';
interface MainContextType {
  Loaded: boolean;
  setLoaded: React.Dispatch<React.SetStateAction<boolean>>;
}

export const AppContext = createContext({} as MainContextType);

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const [Loaded, setLoaded] = useState(false);
  return (
    <AppContext.Provider value={{ Loaded, setLoaded }}>
      {children}
    </AppContext.Provider>
  );
};

export default AppProvider;
