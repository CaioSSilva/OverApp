import { AppRegistry } from 'react-native';
import './i18n';
import App from './App';
import { name as appName } from './app.json';
import ContextsProvider from './src/contexts/ContextProvider';
import React from 'react';

const AppWithProviders = () => (
  <ContextsProvider>
    <App />
  </ContextsProvider>
);

AppRegistry.registerComponent(appName, () => AppWithProviders);
