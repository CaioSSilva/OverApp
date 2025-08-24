import React, { useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';

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

  return (
    <View style={headerStyle}>
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
});

export default HeroHeader;
