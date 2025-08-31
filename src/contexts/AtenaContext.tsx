import { createContext } from 'react';

interface AtenaContextType {
}

export const AthenaContext = createContext({} as AtenaContextType);

export const AthenaProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <AthenaContext.Provider
      value={{
      }}
    >
      {children}
    </AthenaContext.Provider>
  );
};

export default AthenaProvider;
