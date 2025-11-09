import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AppProvider } from './AppContext';
import { AthenaProvider } from './AthenaContext';
import { BandProvider } from './BandContext';

export default function ContextsProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SafeAreaProvider>
      <AppProvider>
        <BandProvider>
          <AthenaProvider>{children}</AthenaProvider>
        </BandProvider>
      </AppProvider>
    </SafeAreaProvider>
  );
}
