import { ArrowLeft } from 'lucide-react-native';
import React, { useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS } from '../../styles/theme';
import { NavigationProp, useNavigation } from '@react-navigation/native';

interface HeroHeaderProps {
  heroName: string;
  isDarkMode: boolean;
}

const HeroHeader = React.memo<HeroHeaderProps>(({ heroName, isDarkMode }) => {
  const headerStyle = useMemo(
    () => ({
      ...styles.heroHeader,
      backgroundColor: isDarkMode ? '#1e1e1e' : '#667eea',
    }),
    [isDarkMode],
  );
  const navigation = useNavigation<NavigationProp<any>>();

  return (
    <View style={headerStyle}>
      <ArrowLeft
        style={styles.backIco}
        onPress={() => navigation.goBack()}
        size={23}
        color={COLORS.WHITE}
      />

      <Text style={styles.heroTitle}>{heroName}</Text>
    </View>
  );
});

const styles = StyleSheet.create({
  heroHeader: {
    padding: 12,
    alignItems: 'center',
    borderRadius: 8,
    marginHorizontal: 8,
    marginTop: 8,
    marginBottom: 12,
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

export default HeroHeader;
