import { View, Text, ScrollView, useColorScheme } from 'react-native';
import React from 'react';
import { Hero } from '../../interfaces/Hero.model';
import { getThemedStyles } from '../../styles/theme';
import { SPACING, TYPOGRAPHY } from '../../styles/theme';
import { useHeroDetails } from '../../hooks/useHeroDetails';
import { HeroHeader } from './components/HeroHeader';
import { HitPoints } from './components/HitPoints';
import { Abilities } from './components/Abilities/Abilities';
import { Story } from './components/Story';
import { LoadingSkeleton } from './components/LoadingSkeleton';

export default function HeroDetails({ hero }: { hero: Hero }) {
  const isDarkMode = useColorScheme() === 'dark';
  const themedStyles = getThemedStyles(isDarkMode);
  const { heroDetails, loading } = useHeroDetails(hero);

  return (
    <View style={themedStyles.container}>
      {loading || !heroDetails ? (
        <LoadingSkeleton />
      ) : (
        <ScrollView showsVerticalScrollIndicator={false}>
          <HeroHeader heroDetails={heroDetails} isDarkMode={isDarkMode} />

          <View style={[themedStyles.card, { margin: SPACING.MD }]}>
            <Text
              style={[themedStyles.text, { fontSize: TYPOGRAPHY.SIZES.MD }]}
            >
              {heroDetails.description}
            </Text>
          </View>
          <HitPoints heroDetails={heroDetails} isDarkMode={isDarkMode} />
          <Abilities
            abilities={heroDetails.abilities}
            isDarkMode={isDarkMode}
          />
          <Story story={heroDetails.story} isDarkMode={isDarkMode} />
        </ScrollView>
      )}
    </View>
  );
}
