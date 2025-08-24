import * as React from 'react';
import { useEffect, useRef, useState } from 'react';
import { PulseIndicator } from 'react-native-indicators';
import {
  ImageBackground,
  useColorScheme,
  Animated,
  StyleSheet,
  Text,
  ViewStyle,
} from 'react-native';

import { messages } from '../../messages';
import { useTranslation } from 'react-i18next';
import { getTheme, getThemedStyles } from '../styles/theme';

export default function Splash() {
  const isDarkMode = useColorScheme() === 'dark';
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const [messageIndex, setMessageIndex] = useState(0);
  const styles = getThemedStyles(isDarkMode);
  const { t } = useTranslation();
  const splashStyle: ViewStyle = {
    justifyContent: 'center',
    alignItems: 'center',
  };

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();

    const messageInterval = setInterval(() => {
      setMessageIndex(prevIndex => (prevIndex + 1) % messages.splash.length);
    }, 2000);

    return () => clearInterval(messageInterval);
  }, [fadeAnim]);

  const currentKey = messages.splash[messageIndex];

  return (
    <Animated.View
      style={[styles.container, { opacity: fadeAnim }, splashStyle]}
    >
      <ImageBackground
        style={splashStyles(isDarkMode).imageBackground}
        source={require('../assets/logo.png')}
      />
      <PulseIndicator
        style={splashStyles(isDarkMode).activityIndicator}
        color={splashStyles(isDarkMode).activityIndicator.color}
      />
      <Text
        style={[
          getThemedStyles(isDarkMode).text,
          getThemedStyles(isDarkMode).boldText,
        ]}
      >
        {t(`messages.splash.${currentKey}`)}
      </Text>
    </Animated.View>
  );
}

const splashStyles = (isDarkMode: boolean) =>
  StyleSheet.create({
    imageBackground: {
      width: 200,
      height: 200,
    },
    activityIndicator: {
      marginVertical: 50,
      maxHeight: 0,
      color: getTheme(isDarkMode).activityIndicator,
    },
  });
