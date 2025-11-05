import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  StyleProp,
  ViewStyle,
  Animated,
  Pressable,
  Easing,
} from 'react-native';
import {
  COLORS,
  BORDER_RADIUS,
  getTheme,
  SPACING,
  TYPOGRAPHY,
  ANIMATIONS,
} from '../styles/theme';

const TRACK_WIDTH = 45;
const TRACK_HEIGHT = 25;
const THUMB_DIAMETER = 18;
const PADDING = (TRACK_HEIGHT - THUMB_DIAMETER) / 2;
const TRAVEL_DISTANCE = TRACK_WIDTH - THUMB_DIAMETER - PADDING * 2;

type StyledToggleProps = {
  value: boolean;
  onPress: (newState: boolean) => void;
  isDarkMode: boolean;
  label?: string;
  style?: StyleProp<ViewStyle>;
};

export const StyledToggle: React.FC<StyledToggleProps> = ({
  value,
  onPress,
  isDarkMode,
  label,
  style,
}) => {
  const theme = getTheme(isDarkMode);

  const animatedValue = useRef(new Animated.Value(value ? 1 : 0)).current;

  useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: value ? 1 : 0,
      duration: ANIMATIONS.FAST,
      easing: Easing.out(Easing.circle),
      useNativeDriver: true,
    }).start();
  }, [value, animatedValue]);

  const animatedThumbStyles = {
    transform: [
      {
        translateX: animatedValue.interpolate({
          inputRange: [0, 1],
          outputRange: [0, TRAVEL_DISTANCE],
          extrapolate: 'clamp',
        }),
      },
    ],
  };

  const animatedTrackStyles = {
    backgroundColor: animatedValue.interpolate({
      inputRange: [0, 1],
      outputRange: [theme.border, COLORS.PRIMARY],
      extrapolate: 'clamp',
    }),
  };

  return (
    <View style={[styles.outerContainer, style]}>
      <Pressable onPress={() => onPress(!value)}>
        <Animated.View style={[styles.track, animatedTrackStyles]}>
          <Animated.View style={[styles.thumb, animatedThumbStyles]} />
        </Animated.View>
      </Pressable>

      {label && (
        <Text style={[styles.label, { color: theme.text }]}>
          {label}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  outerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: SPACING.SM,
  },
  label: {
    marginLeft: SPACING.SM,
    fontSize: TYPOGRAPHY.SIZES.MD,
  },
  track: {
    width: TRACK_WIDTH,
    height: TRACK_HEIGHT,
    borderRadius: BORDER_RADIUS.ROUND,
    justifyContent: 'center',
  },
  thumb: {
    width: THUMB_DIAMETER,
    height: THUMB_DIAMETER,
    borderRadius: BORDER_RADIUS.ROUND,
    backgroundColor: COLORS.WHITE,
    position: 'absolute',
    top: PADDING,
    left: PADDING,
  },
});