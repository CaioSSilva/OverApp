/* eslint-disable react-native/no-inline-styles */
import * as React from 'react';
import { useEffect, useRef, useState } from 'react';
import { PulseIndicator } from 'react-native-indicators';
import {
  ImageBackground,
  useColorScheme,
  Animated,
  StyleSheet,
  Text,
} from 'react-native';

import { getTheme, getThemedStyles } from '../../styles';
import { messages } from '../../messages';

export default function Splash() {
  const isDarkMode = useColorScheme() === 'dark';
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const [messageIndex, setMessageIndex] = useState(0);
  const styles = getThemedStyles(isDarkMode);

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

  return (
    <Animated.View
      style={[
        styles.container,
        { opacity: fadeAnim, justifyContent: 'center', alignItems: 'center' },
      ]}
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
        {messages.splash[messageIndex]}
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
