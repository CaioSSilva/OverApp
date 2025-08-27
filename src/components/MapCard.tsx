import React from 'react';
import { Image, Text, View, StyleSheet, useColorScheme } from 'react-native';
import { useTranslation } from 'react-i18next';
import { MapPin } from 'lucide-react-native';

import { MapCardProps } from '../interfaces/Map.model';
import { COLORS, TYPOGRAPHY, SPACING } from '../styles/theme';

const getCardBg = (isDarkMode: boolean) =>
  isDarkMode ? styles.cardDark : styles.cardLight;

export default function MapCard({ map }: MapCardProps) {
  const { t } = useTranslation();
  const isDarkMode = useColorScheme() === 'dark';

  const formatGamemodes = (gamemodes: string[]) => {
    return gamemodes.map(mode => t(`maps.${mode}`, mode)).join(', ');
  };

  return (
    <View style={[styles.card, getCardBg(isDarkMode)]}>
      <Image
        source={{ uri: map.screenshot }}
        style={styles.image}
        resizeMode="cover"
      />

      <View style={styles.overlay} />

      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.name}>{map.name}</Text>

          <View style={styles.locationContainer}>
            {map.country_code && (
              <>
                <MapPin size={14} color={COLORS.WHITE} />
                <Text style={styles.location}>{map.location}</Text>
              </>
            )}
          </View>
        </View>

        <View style={styles.footer}>
          <View style={styles.gamemodesContainer}>
            <Text style={styles.gamemodesLabel}>
              {t('maps.gamemodes', 'Game Modes')}:
            </Text>
            <Text style={styles.gamemodes}>
              {formatGamemodes(map.gamemodes)}
            </Text>
          </View>

          <View style={styles.countryContainer}>
            <Text style={styles.countryCode}>
              {map.country_code || map.location}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    overflow: 'hidden',
    marginVertical: SPACING.SM,
    width: '95%',
    alignSelf: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  cardLight: {
    backgroundColor: COLORS.LIGHT.CARD,
  },
  cardDark: {
    backgroundColor: COLORS.DARK.CARD,
  },
  image: {
    width: '100%',
    height: 200,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 200,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  content: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: SPACING.MD,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
  },
  header: {
    marginBottom: SPACING.SM,
  },
  name: {
    fontSize: TYPOGRAPHY.SIZES.XL,
    fontWeight: TYPOGRAPHY.WEIGHTS.BOLD,
    marginBottom: SPACING.XS,
    color: COLORS.WHITE,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  location: {
    fontSize: TYPOGRAPHY.SIZES.SM,
    marginLeft: SPACING.XS,
    color: COLORS.WHITE,
    opacity: 0.8,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  gamemodesContainer: {
    flex: 1,
  },
  gamemodesLabel: {
    fontSize: TYPOGRAPHY.SIZES.XS,
    fontWeight: TYPOGRAPHY.WEIGHTS.MEDIUM,
    marginBottom: 2,
    color: COLORS.WHITE,
    opacity: 0.7,
    textTransform: 'uppercase',
  },
  gamemodes: {
    fontSize: TYPOGRAPHY.SIZES.SM,
    fontWeight: TYPOGRAPHY.WEIGHTS.MEDIUM,
    color: COLORS.PRIMARY,
    textTransform: 'capitalize',
  },
  countryContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: SPACING.SM,
    paddingVertical: SPACING.XS,
    borderRadius: 8,
  },
  countryCode: {
    fontSize: TYPOGRAPHY.SIZES.SM,
    fontWeight: TYPOGRAPHY.WEIGHTS.BOLD,
    color: COLORS.WHITE,
  },
});
