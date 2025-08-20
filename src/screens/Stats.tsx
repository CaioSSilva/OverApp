import React from 'react';
import { Text, useColorScheme, View } from 'react-native';
import { getThemedStyles } from '../../styles';

export default function Stats() {
  const isDarkMode = useColorScheme() === 'dark';
  return (
    <View style={getThemedStyles(isDarkMode).container}>
      <Text style={getThemedStyles(isDarkMode).text}>Olá, Stats funcionando!</Text>
    </View>
  );
}
