import React from 'react';
import { AppProvider } from './AppContext';
import { AthenaProvider } from './AthenaContext';

export default function ContextsProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <AppProvider>
        <AthenaProvider>{children}</AthenaProvider>
      </AppProvider>
    </>
  );
}
