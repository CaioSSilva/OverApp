import { ArrowLeft } from 'lucide-react-native';
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS } from '../../styles/theme';
import { NavigationProp, useNavigation } from '@react-navigation/native';

interface HeroHeaderProps {
  heroName: string;
  isDarkMode: boolean;
}

export default function HeroHeader({ heroName, isDarkMode }: HeroHeaderProps) {
 
  const navigation = useNavigation<NavigationProp<any>>();

  return (
    <View style={styles(isDarkMode).heroHeader}>
      <ArrowLeft
        style={styles(isDarkMode).backIco}
        onPress={() => navigation.goBack()}
        size={23}
        color={COLORS.WHITE}
      />

      <Text style={styles(isDarkMode).heroTitle}>{heroName}</Text>
    </View>
  );
}

const styles = (isDarkMode: boolean) => StyleSheet.create({
  heroHeader: {
    padding: 12,
    alignItems: 'center',
    borderRadius: 8,
    marginHorizontal: 8,
    marginTop: 8,
    marginBottom: 12,
    backgroundColor:  isDarkMode ? '#1e1e1e' : '#667eea',
  },
  heroTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
  },
  backIco: {
    position: 'absolute',
    left: 16,
    top: 12,
    padding: 4,
  },
});
