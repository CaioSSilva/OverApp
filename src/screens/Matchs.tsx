import React from 'react';
import { Text, useColorScheme, View } from 'react-native';
import { getThemedStyles } from '../../theme';

export default function Matchs() {
  const isDarkMode = useColorScheme() === 'dark';
  return (
    <View style={getThemedStyles(isDarkMode).container}>
      <Text style={getThemedStyles(isDarkMode).text}>Olá, Matchs funcionando!</Text>
    </View>
  );
}
