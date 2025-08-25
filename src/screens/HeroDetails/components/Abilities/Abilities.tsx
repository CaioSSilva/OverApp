import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Ability } from '../../../../interfaces/HeroStory.model';
import { getThemedStyles, TYPOGRAPHY, SPACING } from '../../../../styles/theme';
import { AbilityCard } from './AbilityCard';
import { useVideoManager } from './useVideoManager';

interface AbilitiesProps {
  abilities: Ability[];
  isDarkMode: boolean;
}

export const Abilities = React.memo(({ abilities, isDarkMode }: AbilitiesProps) => {
  const themedStyles = getThemedStyles(isDarkMode);
  const { t } = useTranslation();
  const { handleVideoLoad, getVideoDuration } = useVideoManager();

  return (
    <View style={[themedStyles.card, styles.section]}>
      <Text style={[themedStyles.title, themedStyles.text, styles.sectionTitle]}>
        {t('heroDetails.abilities')}
      </Text>
      <View style={styles.abilitiesContainer}>
        {abilities.map((ability, index) => (
          <AbilityCard
            key={`${ability.name}-${index}`}
            ability={ability}
            index={index}
            isDarkMode={isDarkMode}
            onVideoLoad={handleVideoLoad}
            videoDuration={getVideoDuration(index)}
          />
        ))}
      </View>
    </View>
  );
});

Abilities.displayName = 'Abilities';

const styles = StyleSheet.create({
  section: {
    margin: SPACING.MD,
  },
  sectionTitle: {
    fontSize: TYPOGRAPHY.SIZES.XL,
    marginBottom: SPACING.MD,
  },
  abilitiesContainer: {
    gap: SPACING.MD,
  },
});
