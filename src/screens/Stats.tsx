import React, { useCallback, useEffect, useState } from 'react';
import { ScrollView, Text, useColorScheme } from 'react-native';
import { useTranslation } from 'react-i18next';
import { dataService } from '../hooks/data';
import { OverwatchProfile } from '../interfaces/Summary.model';
import ProfileCard from '../components/ProfileCard';
import HeroStatsSection from '../components/HeroStatsSection';
import { getThemedStyles } from '../styles/theme';
import Skeleton from '../components/Skeleton';

export default function Stats() {
  const isDarkMode = useColorScheme() === 'dark';
  const [profile, setProfile] = useState<OverwatchProfile | null>(null);
  const [scroll, setScroll] = useState<boolean>(true);
  const { getProfileById } = dataService();
  const { t } = useTranslation();

  const fetchProfile = useCallback(() => getProfileById(), [getProfileById]);

  useEffect(() => {
    fetchProfile().then(setProfile);
  }, [fetchProfile]);

  return (
    <ScrollView
      scrollEnabled={scroll}
      style={getThemedStyles(isDarkMode).container}
    >
      <Text
        style={[
          getThemedStyles(isDarkMode).text,
          getThemedStyles(isDarkMode).title,
        ]}
      >
        {t('common.player')}
      </Text>
      {profile ? <ProfileCard profile={profile} /> : <Skeleton height={136} />}
      <HeroStatsSection setScrollEnabled={setScroll} />
    </ScrollView>
  );
}
