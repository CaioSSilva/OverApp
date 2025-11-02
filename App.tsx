import { StatusBar, useColorScheme, View } from 'react-native';
import './ReactotronConfig' ;
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import Splash from './src/screens/Splash';
import { useContext, useEffect } from 'react';
import { AppContext } from './src/contexts/AppContext';
import ContextsProvider from './src/contexts/ContextProvider';
import Routes from './src/navigation/Routes';
import { NavigationContainer } from '@react-navigation/native';
import { getThemedStyles } from './src/styles/theme';
import React from 'react';

export default function App() {
  return (
    <SafeAreaProvider>
      <StatusBar />
      <ContextsProvider>
        <AppContent />
      </ContextsProvider>
    </SafeAreaProvider>
  );
}

function AppContent() {
  const isDarkMode = useColorScheme() === 'dark';
  const safeAreaInsets = useSafeAreaInsets();

  const { setLoaded, Loaded } = useContext(AppContext);

  useEffect(() => {
    const randomDelay = Math.floor(Math.random() * (8000 - 2000 + 1)) + 2000;
    const timer = setTimeout(() => {
      setLoaded(true);
    }, randomDelay);
    return () => clearTimeout(timer);
  }, [setLoaded]);

  return (
    <View
      style={[
        getThemedStyles(isDarkMode).container,
        {
          paddingTop: safeAreaInsets.top,
        },
      ]}
    >
      {Loaded ? (
        <NavigationContainer>
          <Routes />
        </NavigationContainer>
      ) : (
        <Splash />
      )}
    </View>
  );
}
