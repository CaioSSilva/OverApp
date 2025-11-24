import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AppProvider } from './AppContext';
import { AthenaProvider } from './AthenaContext';
import { BandProvider } from './BandContext';
import { VoiceProvider } from './VoiceContext';

export default function ContextsProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SafeAreaProvider>
      <AppProvider>
        <BandProvider>
          <AthenaProvider>
            <VoiceProvider>{children}</VoiceProvider>
          </AthenaProvider>
        </BandProvider>
      </AppProvider>
    </SafeAreaProvider>
  );
}
