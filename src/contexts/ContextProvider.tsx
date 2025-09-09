import React from 'react';
import { AppProvider } from './AppContext';

export default function ContextsProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <AppProvider>{children}</AppProvider>
    </>
  );
}
