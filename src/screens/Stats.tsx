import React, { useCallback, useContext, useEffect, useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { OverwatchProfile } from '../interfaces/Summary.model';
import ProfileCard from '../components/ProfileCard';
import HeroStatsSection from '../components/HeroStatsSection';
import { COLORS, getThemedStyles } from '../styles/theme';
import Skeleton from '../components/Skeleton';
import { Activity, IterationCw } from 'lucide-react-native';
import Button from '../components/Button';
import { AppContext } from '../contexts/AppContext';
import BandContext from '../contexts/BandContext';
import { dataService } from '../hooks/data';

export default function Stats() {
  const isDarkMode = useColorScheme() === 'dark';
  const [profile, setProfile] = useState<OverwatchProfile | null>(null);
  const [scroll, setScroll] = useState<boolean>(true);
  const { getProfileById } = dataService();
  const { User } = useContext(AppContext);
  const { bandModalRef, isConnected } = useContext(BandContext);
  const { t } = useTranslation();

  const flex = { flex: 1 };

  const fetchProfile = useCallback(
    () => getProfileById(User?.name),
    [User?.name, getProfileById],
  );

  useEffect(() => {
    fetchProfile().then(setProfile);
  }, [fetchProfile]);

  return (
    <ScrollView
      scrollEnabled={scroll}
      style={getThemedStyles(isDarkMode).container}
    >
      <View style={getThemedStyles(isDarkMode).header}>
        <View>
          <Button
            onPress={() => {
              bandModalRef.current?.show();
            }}
            icon={<Activity size={20} color={COLORS.WHITE} />}
          />
          {isConnected && <View style={style().statusBall} />}
        </View>
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

export const style = () =>
  StyleSheet.create({
    statusBall: {
      width: 10,
      height: 10,
      borderRadius: 6,
      backgroundColor: COLORS.INFO,
      position: 'absolute',
      top: -2,
      right: -2,
    },
  });
