import { StatusBar, useColorScheme, View } from 'react-native';
import './ReactotronConfig';
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
import Welcome from './src/screens/Welcome';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';
import NoConnectionModal from './src/components/NoConnectionModal/NoConnectionModal';
import PulseBandSheet from './src/components/HearthGraph/PulseBandSheet';

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

  const { setLoaded, Loaded, User, setUser } = useContext(AppContext);

  useEffect(() => {
    const loadingTimeout = () => {
      const randomDelay = Math.floor(Math.random() * (6000 + 1));
      const timer = setTimeout(() => {
        setLoaded(true);
      }, randomDelay);
      return () => clearTimeout(timer);
    };

    const getUser = async () => {
      const userString = await AsyncStorage.getItem('user');
      if (userString) {
        const userObj = JSON.parse(userString);
        setUser(userObj);
      }
    };

    getUser();

    loadingTimeout();
  }, [setUser, setLoaded]);

  return (
    <View
      style={[
        getThemedStyles(isDarkMode).container,
        {
          paddingTop: safeAreaInsets.top,
        },
      ]}
    >
      {!User ? (
        <Welcome />
      ) : Loaded ? (
        <NavigationContainer>
          <Routes />
          <PulseBandSheet />
        </NavigationContainer>
      ) : (
        <Splash />
      )}
      <Toast />
      <NoConnectionModal />
    </View>
  );
}
