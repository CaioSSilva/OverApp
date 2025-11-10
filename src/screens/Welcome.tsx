import {
  Animated,
  Dimensions,
  ImageBackground,
  StyleSheet,
  Text,
  useColorScheme,
  ViewStyle,
} from 'react-native';
import React, { useContext, useEffect, useRef } from 'react';
import { COLORS, getThemedStyles } from '../styles/theme';
import Button from '../components/Button';
import { ActionSheetRef } from 'react-native-actions-sheet';
import { useTranslation } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AppContext } from '../contexts/AppContext';
import { dataService } from '../hooks/data';
import Toast from 'react-native-toast-message';
import { useBiometrics } from '../hooks/useBiometrics';
import { LoginSheet } from '../components/LoginSheet';

export default function Welcome() {
  const isDarkMode = useColorScheme() === 'dark';
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const imageAnim = useRef(new Animated.Value(0)).current;
  const titleAnim = useRef(new Animated.Value(0)).current;
  const { checkUserExists } = dataService();
  const { authenticate, setBiometryActive, checkBiometricSupport } =
    useBiometrics();
  const { t } = useTranslation();

  const { setUser } = useContext(AppContext);

  const styles = getThemedStyles(isDarkMode);
  const splashStyle: ViewStyle = {
    justifyContent: 'center',
    alignItems: 'center',
  };

  const loginSheet = useRef<ActionSheetRef>(null);

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();

    Animated.timing(imageAnim, {
      toValue: -Dimensions.get('screen').height * 0.1,
      duration: 2000,
      useNativeDriver: true,
    }).start();

    Animated.timing(titleAnim, {
      toValue: -Dimensions.get('screen').height * 0.05,
      duration: 2000,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim, imageAnim, titleAnim]);

  const handleLogin = async (battleNetId: string, enableBiometrics: boolean) => {
    const profile = await checkUserExists(battleNetId);

    if (profile) {
      const userObj = { name: battleNetId };
      const isAuthenticated = await AsyncStorage.getItem('authenticated');

      if (enableBiometrics && isAuthenticated !== 'true') {
        const isSupported = await checkBiometricSupport();
        if (!isSupported) {
          Toast.show({
            type: 'error',
            text1: t('biometrics.disabledMessage'),
            text2: t('biometrics.notSupported'),
          });
          return;
        }
        const auth = await authenticate();
        if (!auth.success) {
          return;
        }
        setBiometryActive(true);
      }

      await AsyncStorage.setItem('user', JSON.stringify(userObj));
      loginSheet.current?.hide();
      setUser(userObj);
    } else {
      Toast.show({
        type: 'error',
        text1: t('errors.unexpectedError'),
        text2: t('errors.userNotFound'),
      });
    }
  };

  const onEnterPress = () => {
    if (loginSheet.current) {
      loginSheet.current.show();
    }
  };

  return (
    <Animated.View
      style={[styles.container, { opacity: fadeAnim }, splashStyle]}
    >
      <Animated.View
        style={[
          {
            transform: [
              {
                translateY: imageAnim,
              },
            ],
          },
        ]}
      >
        <ImageBackground
          style={welcomeStyles(isDarkMode).imageBackground}
          source={
            isDarkMode
              ? require('../assets/logo_white.png')
              : require('../assets/logo_black.png')
          }
        />
      </Animated.View>

      <Animated.View
        style={[
          {
            transform: [
              {
                translateY: titleAnim,
              },
            ],
          },
        ]}
      >
        <Text style={welcomeStyles(isDarkMode).title}>OverApp</Text>
      </Animated.View>

      <Button title={t('common.enter')} onPress={() => onEnterPress()} />

      <LoginSheet ref={loginSheet} onLogin={handleLogin} />
    </Animated.View>
  );
}
const welcomeStyles = (isDarkMode: boolean) =>
  StyleSheet.create({
    imageBackground: {
      width: 200,
      height: 200,
    },
    title: {
      color: isDarkMode ? COLORS.DARK.TEXT : COLORS.PRIMARY,
      fontWeight: '700',
      fontSize: 32,
    },
  });
