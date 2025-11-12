import React, { useEffect, useRef } from 'react';
import { Animated } from 'react-native';
import { COLORS } from '../../styles/theme';
import { Mic } from 'lucide-react-native';

export function MicRecording() {
  const opacity = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 0.3,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
      ]),
    ).start();
  }, [opacity]);

  return (
      <Animated.View style={{ opacity }}>
        <Mic size={24} color={COLORS.WHITE} />
      </Animated.View>

  );
}
