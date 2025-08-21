import React, { useCallback, useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, useColorScheme, useWindowDimensions, View } from 'react-native';
import { getThemedStyles } from '../../styles';
import { useTranslation } from 'react-i18next';
import { dataService } from '../hooks/data';
import { OverwatchProfile } from '../interfaces/Summary.model';
import ProfileCard from '../components/ProfileCard';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';

export default function Stats() {
  const isDarkMode = useColorScheme() === 'dark';
  const { width: windowWidth } = useWindowDimensions();
  const [profile, setProfile] = useState<OverwatchProfile | null>(null);
  const { getProfileById } = dataService();
  const { t } = useTranslation();

  const fetchProfile = useCallback(
    () => getProfileById('Kento-12528'),
    [getProfileById],
  );

  useEffect(() => {
    fetchProfile().then(setProfile);
  }, [fetchProfile]);

  return (
    <ScrollView style={getThemedStyles(isDarkMode).container}>
      <Text style={[getThemedStyles(isDarkMode).text, statsStyles.statsTitle]}>
        {t('player')}
      </Text>
      {profile ? (
        <ProfileCard profile={profile} />
      ) : (
        <SkeletonPlaceholder backgroundColor={isDarkMode ? "#222222ff" : "#9f9e9cff"}>
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
      <View>
        <Text style={[getThemedStyles(isDarkMode).text, statsStyles.statsTitle]}>
          {t('characters')}
        </Text>
      </View>
    </ScrollView>
  );
}

const statsStyles = StyleSheet.create({
  statsTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 16,
  },
});
