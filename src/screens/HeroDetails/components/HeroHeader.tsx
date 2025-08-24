import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { HeroDetails } from '../../../interfaces/HeroStory.model';
import { getThemedStyles, COLORS, TYPOGRAPHY, SPACING, BORDER_RADIUS } from '../../../styles/theme';

interface HeroHeaderProps {
  heroDetails: HeroDetails;
  isDarkMode: boolean;
}

export function HeroHeader({ heroDetails, isDarkMode }: HeroHeaderProps) {
  const themedStyles = getThemedStyles(isDarkMode);
  const { t } = useTranslation();

  const getRoleColor = (role: string) => {
    switch (role.toLowerCase()) {
      case 'tank':
        return '#f99e1a';
      case 'damage':
        return '#f44336';
      case 'support':
        return '#13cd13';
      default:
        return COLORS.PRIMARY;
    }
  };

  return (
    <View style={styles.headerGradient}>
      <View style={styles.headerContainer}>
        <Image source={{ uri: heroDetails.portrait }} style={styles.heroImage} />
        <View style={styles.heroInfo}>
          <Text style={[themedStyles.title, themedStyles.text, styles.heroName]}>
            {heroDetails.name}
          </Text>
          <View style={[styles.roleContainer, { backgroundColor: getRoleColor(heroDetails.role) }]}>
            <Text style={styles.roleText}>{heroDetails.role.toUpperCase()}</Text>
          </View>
          <Text style={[themedStyles.text, styles.location]}>{heroDetails.location}</Text>
          <View style={styles.personalInfoContainer}>
            <View style={styles.infoItem}>
              <Text style={[themedStyles.text, styles.infoLabel]}>{t('age')}</Text>
              <Text style={[themedStyles.text, styles.infoValue, { color: COLORS.PRIMARY }]}>
                {heroDetails.age}
              </Text>
            </View>
            <View style={styles.infoDivider} />
            <View style={styles.infoItem}>
              <Text style={[themedStyles.text, styles.infoLabel]}>{t('birthday')}</Text>
              <Text style={[themedStyles.text, styles.infoValue, { color: COLORS.PRIMARY }]}>
                {heroDetails.birthday}
              </Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    padding: SPACING.MD,
    alignItems: 'center',
  },
  headerGradient: {
    backgroundColor: 'rgba(250, 156, 30, 0.1)',
    borderBottomLeftRadius: BORDER_RADIUS.LG,
    borderBottomRightRadius: BORDER_RADIUS.LG,
  },
  heroImage: {
    width: 120,
    height: 120,
    borderRadius: BORDER_RADIUS.XL,
    marginRight: SPACING.MD,
  },
  heroInfo: {
    flex: 1,
  },
  heroName: {
    fontSize: TYPOGRAPHY.SIZES.XXL,
    marginBottom: SPACING.XS,
  },
  roleContainer: {
    paddingHorizontal: SPACING.SM,
    paddingVertical: SPACING.XS,
    borderRadius: BORDER_RADIUS.SM,
    alignSelf: 'flex-start',
    marginBottom: SPACING.XS,
  },
  roleText: {
    color: COLORS.WHITE,
    fontSize: TYPOGRAPHY.SIZES.SM,
    fontWeight: TYPOGRAPHY.WEIGHTS.BOLD,
  },
  location: {
    fontSize: TYPOGRAPHY.SIZES.SM,
    marginBottom: SPACING.XS,
  },
  personalInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: SPACING.XS,
    backgroundColor: 'rgba(250, 156, 30, 0.1)',
    borderRadius: BORDER_RADIUS.SM,
    padding: SPACING.SM,
  },
  infoItem: {
    flex: 1,
    alignItems: 'center',
  },
  infoDivider: {
    width: 1,
    height: 30,
    backgroundColor: COLORS.PRIMARY,
    marginHorizontal: SPACING.SM,
  },
  infoLabel: {
    fontSize: TYPOGRAPHY.SIZES.XS,
    opacity: 0.7,
    marginBottom: SPACING.XS / 2,
    textTransform: 'uppercase',
    fontWeight: TYPOGRAPHY.WEIGHTS.MEDIUM,
  },
  infoValue: {
    fontSize: TYPOGRAPHY.SIZES.MD,
    fontWeight: TYPOGRAPHY.WEIGHTS.BOLD,
  },
});
