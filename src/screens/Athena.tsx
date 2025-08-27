import React from 'react';
import { Text, useColorScheme, View } from 'react-native';
import { getThemedStyles } from '../styles/theme';

export default function Athena() {
  const isDarkMode = useColorScheme() === 'dark';
  return (
    <View style={getThemedStyles(isDarkMode).container}>
    
    </View>
  );
}
