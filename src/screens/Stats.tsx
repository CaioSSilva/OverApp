import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import {
  Animated,
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

  const ballAnim = useRef(new Animated.Value(0)).current;

  const flex = { flex: 1 };

  const fetchProfile = useCallback(
    () => getProfileById(User?.name),
    [User?.name, getProfileById],
  );

  useEffect(() => {
    fetchProfile().then(setProfile);

    const animateBall = () => {
      Animated.sequence([
      Animated.timing(ballAnim, {
        toValue: 1.2,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(ballAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      ]).start(() => animateBall());
    };
    animateBall();
  }, [ballAnim, fetchProfile]);

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
          {isConnected && <Animated.View style={[style().statusBall, {
            transform: [
              {
                scale: ballAnim,
              },
            ],
          }]} />}
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
