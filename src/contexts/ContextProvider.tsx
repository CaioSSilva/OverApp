import React from 'react';
import { AppProvider } from './AppContext';
import { AthenaProvider } from './AthenaContext';
import { BandProvider } from './BandContext';

export default function ContextsProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <AppProvider>
        <BandProvider>
          <AthenaProvider>{children}</AthenaProvider>
        </BandProvider>
      </AppProvider>
    </>
  );
}
