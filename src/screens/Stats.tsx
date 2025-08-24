import React, { useCallback, useEffect, useState } from 'react';
import {
  ScrollView,
  Text,
  useColorScheme,
  useWindowDimensions,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { dataService } from '../hooks/data';
import { OverwatchProfile } from '../interfaces/Summary.model';
import ProfileCard from '../components/ProfileCard';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import HeroStatsSection from '../components/HeroStatsSection';
import { getThemedStyles } from '../../theme';

export default function Stats() {
  const isDarkMode = useColorScheme() === 'dark';
  const { width: windowWidth } = useWindowDimensions();
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
        {t('player')}
      </Text>
      {profile ? (
        <ProfileCard profile={profile} />
      ) : (
        <SkeletonPlaceholder
          backgroundColor={isDarkMode ? '#222222ff' : '#9f9e9cff'}
          highlightColor="#777"
        >
          <SkeletonPlaceholder.Item
            flexDirection="row"
            alignItems="center"
            marginVertical={10}
            marginHorizontal={10}
            padding={0}
          >
            <SkeletonPlaceholder.Item
              width={windowWidth - 20}
              height={110}
              borderRadius={18}
            />
          </SkeletonPlaceholder.Item>
        </SkeletonPlaceholder>
      )}
      <HeroStatsSection setScrollEnabled={setScroll} />
    </ScrollView>
  );
}
