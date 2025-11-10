import { View, Text, Animated, useColorScheme, StyleSheet } from 'react-native';
import {
  COLORS,
  getThemedStyles,
  GLASS_COLORS,
  SPACING,
  TYPOGRAPHY,
} from '../../styles/theme';
import { useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import React from 'react';

export function AthenaGrettings() {
  const isDarkMode = useColorScheme() === 'dark';
  const themedStyles = getThemedStyles(isDarkMode);
  const bounceValue = useBounceAnimation();
  const { t } = useTranslation();

  function useBounceAnimation() {
    const val = useRef(new Animated.Value(1)).current;

    useEffect(() => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(bounceValue, {
            toValue: 1.2,
            duration: 400,
            useNativeDriver: true,
          }),
          Animated.timing(bounceValue, {
            toValue: 1,
            duration: 400,
            useNativeDriver: true,
          }),
        ]),
      ).start();
    }, [val]);

    return val;
  }

  return (
    <View style={styles.content}>
      <Text
        style={[themedStyles.title, themedStyles.text, styles.welcomeTitle]}
      >
        {t('athena.welcome')}
      </Text>

      <Text style={[themedStyles.text, styles.subtitle]}>
        {t('athena.subtitle')}
      </Text>

      <Text style={[themedStyles.text, styles.description]}>
        {t('athena.description')}
      </Text>
      <View style={styles.pill}>
        <Text style={[themedStyles.text, styles.pillText]}>
          {t('athena.poweredBy')}
        </Text>

        <Animated.Image
          source={require('../../assets/gemini_color.png')}
          style={[styles.geminiLogo, { transform: [{ scale: bounceValue }] }]}
          resizeMode="contain"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    paddingHorizontal: SPACING.LG,
    paddingTop: SPACING.XXL,
    justifyContent: 'center',
  },
  welcomeTitle: {
    textAlign: 'center',
    marginBottom: SPACING.SM,
  },
  subtitle: {
    textAlign: 'center',
    fontSize: TYPOGRAPHY.SIZES.LG,
    marginBottom: SPACING.SM,
    opacity: 0.8,
  },
  description: {
    textAlign: 'center',
    fontSize: TYPOGRAPHY.SIZES.SM,
    opacity: 0.7,
    lineHeight: 20,
  },
  pill: {
    marginHorizontal: 'auto',
    marginTop: SPACING.MD,
    borderRadius: 20,
    backgroundColor: '#656565ad',
    borderColor: GLASS_COLORS.WHITE_BORDER,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    padding: 5,
  },
  pillText: {
    marginHorizontal: 8,
    color: COLORS.WHITE,
  },
  geminiLogo: {
    width: 18,
    height: 18,
  },
});
