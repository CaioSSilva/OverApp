import React, { useCallback, useEffect, useState } from 'react';
import { ScrollView, Text, useColorScheme, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { dataService } from '../hooks/data';
import { OverwatchProfile } from '../interfaces/Summary.model';
import ProfileCard from '../components/ProfileCard';
import HeroStatsSection from '../components/HeroStatsSection';
import { COLORS, getThemedStyles } from '../styles/theme';
import Skeleton from '../components/Skeleton';
import { IterationCw } from 'lucide-react-native';
import Button from '../components/Button';

export default function Stats() {
  const isDarkMode = useColorScheme() === 'dark';
  const [profile, setProfile] = useState<OverwatchProfile | null>(null);
  const [scroll, setScroll] = useState<boolean>(true);
  const { getProfileById } = dataService();
  const { t } = useTranslation();

  const flex = { flex: 1 };

  const fetchProfile = useCallback(() => getProfileById(), [getProfileById]);

  useEffect(() => {
    fetchProfile().then(setProfile);
  }, [fetchProfile]);

  return (
    <ScrollView
      scrollEnabled={scroll}
      style={getThemedStyles(isDarkMode).container}
    >
      <View style={getThemedStyles(isDarkMode).header}>
        <Text
          style={[
            getThemedStyles(isDarkMode).text,
            getThemedStyles(isDarkMode).title,
            flex,
          ]}
        >
          {t('common.player')}
        </Text>
        <Button
          onPress={() => {
            setProfile(null);
            fetchProfile().then(setProfile);
          }}
          icon={<IterationCw size={20} color={COLORS.WHITE} />}
        />
      </View>
      {profile ? <ProfileCard profile={profile} /> : <Skeleton height={136} />}
      <HeroStatsSection setScrollEnabled={setScroll} />
    </ScrollView>
  );
}
