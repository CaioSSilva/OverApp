import React, { useEffect, useRef } from 'react';
import {
  View,
  StyleSheet,
  useColorScheme,
  Animated,
  Easing,
} from 'react-native';
import { COLORS, SPACING, BORDER_RADIUS } from '../styles/theme';

interface SkeletonProps {
  height: number;
  width?: number | string;
  borderRadius?: number;
  marginVertical?: number;
  marginHorizontal?: number;
  style?: any;
  count?: number;
  gap?: number;
}

const Skeleton: React.FC<SkeletonProps> = ({
  height,
  width = '95%',
  borderRadius = BORDER_RADIUS.LG,
  marginVertical = SPACING.XS,
  marginHorizontal = 0,
  style,
  count = 1,
  gap = SPACING.SM * 1.3,
}) => {
  const isDarkMode = useColorScheme() === 'dark';
  const shimmerAnimation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const shimmer = () => {
      shimmerAnimation.setValue(0);
      Animated.loop(
        Animated.timing(shimmerAnimation, {
          toValue: 1,
          duration: 1500,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
      ).start();
    };

    shimmer();
  }, [shimmerAnimation]);

  const shimmerStyle = {
    opacity: shimmerAnimation.interpolate({
      inputRange: [0, 0.5, 1],
      outputRange: [0.3, 0.7, 0.3],
    }),
  };

  const renderSkeletonItem = (index: number) => {
    const itemMarginTop = gap;

    return (
      <View
        key={index}
        style={[
          styles.container,
          {
            height,
            width,
            borderRadius,
            marginVertical: marginVertical,
            marginHorizontal,
            marginTop: itemMarginTop,
            backgroundColor: isDarkMode
              ? COLORS.DARK.BORDER
              : COLORS.LIGHT.BORDER,
          },
          style,
        ]}
      >
        <Animated.View
          style={[
            styles.shimmer,
            {
              borderRadius,
              backgroundColor: isDarkMode
                ? COLORS.DARK.TEXT
                : COLORS.LIGHT.TEXT,
            },
            shimmerStyle,
          ]}
        />
      </View>
    );
  };

  if (count === 1) {
    return renderSkeletonItem(0);
  }

  return (
    <View>
      {Array.from({ length: count }, (_, index) => renderSkeletonItem(index))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    alignSelf: 'center',
  },
  shimmer: {
    flex: 1,
    opacity: 0.3,
  },
});

export default Skeleton;
