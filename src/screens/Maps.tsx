import { View, Text, useColorScheme } from 'react-native';
import { getThemedStyles } from '../../styles';

export default function Maps() {
  const isDarkMode = useColorScheme() === 'dark';
  return (
    <View style={getThemedStyles(isDarkMode).container}>
      <Text style={getThemedStyles(isDarkMode).text}>
        Olá, Maps funcionando!
      </Text>
    </View>
  );
}
