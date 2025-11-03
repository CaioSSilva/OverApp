import React from 'react';
import { useColorScheme } from 'react-native';
import {
  NavigationProp,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import { Hero } from '../../interfaces/Hero.model';
import { HeroStatsResponse } from '../../interfaces/Status.model';
import { HeroTime } from '../../interfaces/Summary.model';
import {
  findCardStatus,
  calculateFillWidth,
  calculateFillOpacity,
  calculateGradientColors,
  formatTimeDisplay,
} from './utils';
import { useTranslation } from 'react-i18next';

export const useHeroCard = (
  hero: Hero,
  status?: HeroStatsResponse,
  time?: HeroTime,
  maxSize?: number,
) => {
  const isDarkMode = useColorScheme() === 'dark';
  const navigation = useNavigation<NavigationProp<any>>();

  const { t } = useTranslation();

  const fillWidth = React.useMemo(
    () => calculateFillWidth(time, maxSize),
    [time, maxSize],
  );

  const fillOpacity = React.useMemo(
    () => calculateFillOpacity(time, maxSize),
    [time, maxSize],
  );

  const gradientColors = React.useMemo(
    () => calculateGradientColors(time, maxSize, hero.role, isDarkMode),
    [time, maxSize, hero.role, isDarkMode],
  );

  const timePlayedDisplay = React.useMemo(
    () => formatTimeDisplay(time),
    [time],
  );

  const isOnCharScreen = useRoute().name === t('navigation.characters');

  const heroStatusData = status ? findCardStatus(status, hero.key) : undefined;

  const handleHeroDetailsPress = React.useCallback(() => {
    navigation.navigate('Stack', {
      screen: 'HeroDetails',
      params: { hero },
    });
  }, [navigation, hero]);

  const handleStatusPress = React.useCallback(() => {
    const heroStatus = findCardStatus(status!, hero.key);
    navigation.navigate('Stack', {
      screen: 'Details',
      params: {
        status: heroStatus,
        hero,
      },
    });
  }, [navigation, status, hero]);

  return {
    isDarkMode,
    fillWidth,
    fillOpacity,
    gradientColors,
    timePlayedDisplay,
    isOnCharScreen,
    heroStatusData,
    handleHeroDetailsPress,
    handleStatusPress,
  };
};
