import React from 'react';
import {
  Image,
  Text,
  View,
  useColorScheme,
  TouchableOpacity,
  ViewStyle,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import LinearGradient from 'react-native-linear-gradient';

import { HeroCardProps, roleColors } from '../../interfaces/HeroCard.model';
import Button from '../Button';
import { getThemedStyles } from '../../styles/theme';
import { styles, getCardBg, getTextColor } from './styles';
import { useHeroCard } from './hooks';
import NoDataTooltip from './components/NoDataTooltip/NoDataTooltip';

export default function HeroCard({
  hero,
  status,
  time,
  maxSize,
}: HeroCardProps) {
  const { t } = useTranslation();
  const isDarkMode = useColorScheme() === 'dark';

  const {
    fillWidth,
    fillOpacity,
    gradientColors,
    timePlayedDisplay,
    isOnCharScreen,
    heroStatusData,
    handleHeroDetailsPress,
    handleStatusPress,
  } = useHeroCard(hero, status, time, maxSize);

  return (
    <TouchableOpacity
      style={[
        styles.card,
        getCardBg(isDarkMode),
        { borderLeftColor: roleColors[hero.role] },
      ]}
      onPress={handleHeroDetailsPress}
      disabled={!isOnCharScreen}
    >
      <LinearGradient
        colors={gradientColors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={
          {
            opacity: fillOpacity,
            position: 'absolute',
            top: 0,
            left: 0,
            width: fillWidth,
            height: '170%',
            borderRadius: 12,
          } as ViewStyle
        }
      />

      <Image
        source={{ uri: hero.portrait }}
        style={styles.image}
        resizeMode="cover"
      />

      <View style={styles.infoBox}>
        <View>
          <Text style={[styles.name, getTextColor(isDarkMode)]}>
            {hero.name}
          </Text>
          <View
            style={[
              styles.roleBox,
              {
                backgroundColor: roleColors[hero.role],
                shadowColor: roleColors[hero.role],
              },
            ]}
          >
            <Text style={styles.roleText}>
              {t(`characters.${hero.role}`).toUpperCase()}
            </Text>
          </View>
        </View>

        <View style={styles.statsContainer}>
          {status &&
            (heroStatusData ? (
              <Button title={t('common.details')} onPress={handleStatusPress} />
            ) : (
              <NoDataTooltip />
            ))}

          {timePlayedDisplay && (
            <View style={styles.timeContainer}>
              <Text
                style={[
                  getThemedStyles(isDarkMode).text,
                  getThemedStyles(isDarkMode).boldText,
                  styles.timeText,
                ]}
              >
                {timePlayedDisplay}
              </Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
}
