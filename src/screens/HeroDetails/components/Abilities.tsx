import React from 'react';
import { View, Text, Image, TouchableOpacity, Linking, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Ability } from '../../../interfaces/HeroStory.model';
import { getThemedStyles, COLORS, TYPOGRAPHY, SPACING, BORDER_RADIUS } from '../../../styles/theme';

interface AbilitiesProps {
  abilities: Ability[];
  isDarkMode: boolean;
}

export function Abilities({ abilities, isDarkMode }: AbilitiesProps) {
  const themedStyles = getThemedStyles(isDarkMode);
  const { t } = useTranslation();

  const handleMediaPress = async (link: string) => {
    await Linking.openURL(link);
  };

  return (
    <View style={[themedStyles.card, styles.section]}>
      <Text style={[themedStyles.title, themedStyles.text, styles.sectionTitle]}>
        {t('abilities')}
      </Text>
      {abilities.map((ability, index) => (
        <TouchableOpacity 
          key={index} 
          style={styles.abilityCardEnhanced}
          onPress={() => handleMediaPress(ability.video.link.mp4)}
        >
          <Image source={{ uri: ability.video.thumbnail }} style={styles.abilityThumbnail} />
          <View style={styles.abilityOverlay}>
            <Image source={{ uri: ability.icon }} style={styles.abilityIconSmall} />
            <View style={styles.abilityInfo}>
              <Text style={[themedStyles.text, styles.abilityName, styles.abilityTextWhite]}>
                {ability.name}
              </Text>
              <Text style={[themedStyles.text, styles.abilityDescription, styles.abilityTextWhite]} numberOfLines={2}>
                {ability.description}
              </Text>
            </View>
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    margin: SPACING.MD,
  },
  sectionTitle: {
    fontSize: TYPOGRAPHY.SIZES.XL,
    marginBottom: SPACING.MD,
  },
  abilityCardEnhanced: {
    marginBottom: SPACING.MD,
    borderRadius: BORDER_RADIUS.MD,
    overflow: 'hidden',
    backgroundColor: 'rgba(250, 156, 30, 0.1)',
    position: 'relative',
  },
  abilityThumbnail: {
    width: '100%',
    height: 120,
    resizeMode: 'cover',
  },
  abilityOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.SM,
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
  },
  abilityIconSmall: {
    width: 24,
    height: 24,
    marginRight: SPACING.SM,
  },
  abilityInfo: {
    flex: 1,
  },
  abilityName: {
    fontSize: TYPOGRAPHY.SIZES.LG,
    fontWeight: TYPOGRAPHY.WEIGHTS.BOLD,
    marginBottom: SPACING.XS,
  },
  abilityDescription: {
    fontSize: TYPOGRAPHY.SIZES.SM,
    lineHeight: 18,
  },
  abilityTextWhite: {
    color: COLORS.WHITE,
  },
});
