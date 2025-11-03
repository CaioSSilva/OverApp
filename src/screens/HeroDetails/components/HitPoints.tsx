import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { HeroDetails } from '../../../interfaces/HeroStory.model';
import {
  getThemedStyles,
  COLORS,
  TYPOGRAPHY,
  SPACING,
  BORDER_RADIUS,
} from '../../../styles/theme';

interface HitPointsProps {
  heroDetails: HeroDetails;
  isDarkMode: boolean;
}

export function HitPoints({ heroDetails, isDarkMode }: HitPointsProps) {
  const themedStyles = getThemedStyles(isDarkMode);
  const { t } = useTranslation();

  return (
    <View style={[themedStyles.card, styles.section]}>
      <Text
        style={[themedStyles.title, themedStyles.text, styles.sectionTitle]}
      >
        {t('heroDetails.hitpoints')}
      </Text>
      <View style={styles.hitpointsContainer}>
        {heroDetails.hitpoints.health > 0 && (
          <View style={styles.hitpointItemEnhanced}>
            <Text style={[themedStyles.text, styles.hitpointLabel]}>
              {t('heroDetails.health')}
            </Text>
            <View style={styles.hitpointBarContainer}>
              <View style={styles.hitpointBar}>
                <View
                  style={[
                    styles.hitpointFill,
                    styles.healthFill,
                    {
                      width: `${
                        (heroDetails.hitpoints.health /
                          heroDetails.hitpoints.total) *
                        100
                      }%`,
                    },
                  ]}
                />
              </View>
              <Text
                style={[
                  themedStyles.text,
                  styles.hitpointValue,
                  styles.healthValue,
                ]}
              >
                {heroDetails.hitpoints.health}
              </Text>
            </View>
          </View>
        )}
        {heroDetails.hitpoints.armor > 0 && (
          <View style={styles.hitpointItemEnhanced}>
            <Text style={[themedStyles.text, styles.hitpointLabel]}>
              {t('heroDetails.armor')}
            </Text>
            <View style={styles.hitpointBarContainer}>
              <View style={styles.hitpointBar}>
                <View
                  style={[
                    styles.hitpointFill,
                    styles.armorFill,
                    {
                      width: `${
                        (heroDetails.hitpoints.armor /
                          heroDetails.hitpoints.total) *
                        100
                      }%`,
                    },
                  ]}
                />
              </View>
              <Text
                style={[
                  themedStyles.text,
                  styles.hitpointValue,
                  styles.armorValue,
                ]}
              >
                {heroDetails.hitpoints.armor}
              </Text>
            </View>
          </View>
        )}
        {heroDetails.hitpoints.shields > 0 && (
          <View style={styles.hitpointItemEnhanced}>
            <Text style={[themedStyles.text, styles.hitpointLabel]}>
              {t('heroDetails.shields')}
            </Text>
            <View style={styles.hitpointBarContainer}>
              <View style={styles.hitpointBar}>
                <View
                  style={[
                    styles.hitpointFill,
                    styles.shieldsFill,
                    {
                      width: `${
                        (heroDetails.hitpoints.shields /
                          heroDetails.hitpoints.total) *
                        100
                      }%`,
                    },
                  ]}
                />
              </View>
              <Text
                style={[
                  themedStyles.text,
                  styles.hitpointValue,
                  styles.shieldsValue,
                ]}
              >
                {heroDetails.hitpoints.shields}
              </Text>
            </View>
          </View>
        )}
        <View style={styles.hitpointItemEnhanced}>
          <Text style={[themedStyles.text, styles.hitpointLabel]}>
            {t('common.total')}
          </Text>
          <View style={styles.hitpointBarContainer}>
            <View style={styles.hitpointBar}>
              <View style={[styles.hitpointFill, styles.totalFill]} />
            </View>
            <Text
              style={[
                themedStyles.text,
                styles.hitpointValue,
                styles.totalValue,
              ]}
            >
              {heroDetails.hitpoints.total}
            </Text>
          </View>
        </View>
      </View>
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
  hitpointsContainer: {
    flexDirection: 'column',
  },
  hitpointItemEnhanced: {
    marginBottom: SPACING.MD,
    width: '100%',
  },
  hitpointBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: SPACING.XS,
  },
  hitpointBar: {
    flex: 1,
    height: 8,
    backgroundColor: 'rgba(0,0,0,0.1)',
    borderRadius: BORDER_RADIUS.SM,
    marginRight: SPACING.SM,
    overflow: 'hidden',
  },
  hitpointFill: {
    height: '100%',
    borderRadius: BORDER_RADIUS.SM,
  },
  hitpointLabel: {
    fontSize: TYPOGRAPHY.SIZES.SM,
    marginBottom: SPACING.XS,
  },
  hitpointValue: {
    fontSize: TYPOGRAPHY.SIZES.LG,
    fontWeight: TYPOGRAPHY.WEIGHTS.BOLD,
  },
  healthFill: {
    backgroundColor: COLORS.SUCCESS,
  },
  armorFill: {
    backgroundColor: COLORS.WARNING,
  },
  shieldsFill: {
    backgroundColor: COLORS.INFO,
  },
  totalFill: {
    backgroundColor: COLORS.PRIMARY,
    width: '100%',
  },
  healthValue: {
    color: COLORS.SUCCESS,
    fontWeight: TYPOGRAPHY.WEIGHTS.BOLD,
  },
  armorValue: {
    color: COLORS.WARNING,
    fontWeight: TYPOGRAPHY.WEIGHTS.BOLD,
  },
  shieldsValue: {
    color: COLORS.INFO,
    fontWeight: TYPOGRAPHY.WEIGHTS.BOLD,
  },
  totalValue: {
    color: COLORS.PRIMARY,
  },
});
