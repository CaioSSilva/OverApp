import React, { useState, useCallback, useEffect, useRef } from 'react';
import { View, Text, Image, StyleSheet, Platform } from 'react-native';
import { Ability } from '../../../../interfaces/HeroStory.model';
import { getThemedStyles, COLORS, TYPOGRAPHY, SPACING, BORDER_RADIUS } from '../../../../styles/theme';
import { OptimizedVideo } from './OptimizedVideo';

interface AbilityCardProps {
  ability: Ability;
  index: number;
  isDarkMode: boolean;
  onVideoLoad: (index: number, data: any) => void;
  videoDuration?: number;
}

export const AbilityCard = React.memo(({ 
  ability, 
  index, 
  isDarkMode, 
  onVideoLoad,
  videoDuration = 5 
}: AbilityCardProps) => {
  const themedStyles = getThemedStyles(isDarkMode);
  const [isOverlayVisible, setIsOverlayVisible] = useState(true);
  const [overlayHeight, setOverlayHeight] = useState<number>(0);
  const [hideTimer, setHideTimer] = useState<ReturnType<typeof setTimeout> | null>(null);
  const [isPaused, setIsPaused] = useState(true);
  const videoRef = useRef<any>(null);

  const handleCardPress = useCallback(() => {
    if (Platform.OS === 'android') {
      if (isPaused) {
        setIsPaused(false);
        setIsOverlayVisible(false);
        if (videoRef.current) {
          videoRef.current.seek(0);
        }
      } else {
        setIsPaused(true);
        setIsOverlayVisible(true);
      }
    } else {
      if (hideTimer) {
        clearTimeout(hideTimer);
      }

      setIsOverlayVisible(false);

      const timer = setTimeout(() => {
        setIsOverlayVisible(true);
        setHideTimer(null);
      }, videoDuration * 1000);

      setHideTimer(timer);
    }
  }, [hideTimer, videoDuration, isPaused]);

  const handleVideoLoad = useCallback((data: any) => {
    onVideoLoad(index, data);
  }, [index, onVideoLoad]);

  const handleVideoEnd = useCallback(() => {
    if (Platform.OS === 'android') {
      setIsPaused(true);
      setIsOverlayVisible(true);
      if (videoRef.current) {
        videoRef.current.seek(0);
      }
    }
  }, []);

  const handleOverlayLayout = useCallback((event: any) => {
    const { height } = event.nativeEvent.layout;
    setOverlayHeight(height);
  }, []);

  const calculateGradientHeight = useCallback(() => {
    if (overlayHeight > 0) {
      return Math.min(overlayHeight + 10, 180);
    }
    
    const words = ability.description.split(' ').length;
    const estimatedLines = Math.max(1, Math.ceil(words / 8));
    const totalHeight = 32 + SPACING.SM + (estimatedLines * 20) + (SPACING.MD * 2);
    
    return Math.min(totalHeight + 10, 180);
  }, [overlayHeight, ability.description]);

  useEffect(() => {
    return () => {
      if (hideTimer) {
        clearTimeout(hideTimer);
      }
    };
  }, [hideTimer]);

  const gradientHeight = calculateGradientHeight();

  return (
    <View
      style={styles.abilityCardEnhanced}
      onTouchEnd={handleCardPress}
    >
      <OptimizedVideo
        ref={videoRef}
        source={{ uri: ability.video.link.mp4 }}
        style={styles.abilityVideo}
        resizeMode="cover"
        repeat={Platform.OS === 'android' ? false : true}
        muted={true}
        onLoad={handleVideoLoad}
        onEnd={handleVideoEnd}
        poster={ability.video.thumbnail}
        paused={Platform.OS === 'android' ? isPaused : false}
      />

      {isOverlayVisible && (
        <>
          <View style={[styles.abilityGradientBottom, { height: gradientHeight }]} />
          <View
            style={styles.abilityOverlay}
            onLayout={handleOverlayLayout}
          >
            <View style={styles.abilityHeader}>
              <Image 
                source={{ uri: ability.icon }} 
                style={styles.abilityIconSmall}
                resizeMode="contain"
              />
              <Text style={[themedStyles.text, styles.abilityName, styles.abilityTextWhite]}>
                {ability.name}
              </Text>
            </View>
            <Text style={[themedStyles.text, styles.abilityDescription, styles.abilityTextWhite]}>
              {ability.description}
            </Text>
          </View>
        </>
      )}
    </View>
  );
});

AbilityCard.displayName = 'AbilityCard';

const styles = StyleSheet.create({
  abilityCardEnhanced: {
    borderRadius: BORDER_RADIUS.MD,
    overflow: 'hidden',
    position: 'relative',
  },
  abilityVideo: {
    width: '100%',
    height: 180,
  },
  abilityOverlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    padding: SPACING.MD,
  },
  abilityGradientBottom: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  abilityIconSmall: {
    width: 32,
    height: 32,
    marginRight: SPACING.SM,
  },
  abilityHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.SM,
  },
  abilityName: {
    fontSize: TYPOGRAPHY.SIZES.LG,
    fontWeight: TYPOGRAPHY.WEIGHTS.BOLD,
    marginBottom: 0,
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
    flex: 1,
  },
  abilityDescription: {
    fontSize: TYPOGRAPHY.SIZES.SM,
    lineHeight: 20,
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
    opacity: 0.95,
  },
  abilityTextWhite: {
    color: COLORS.WHITE,
  },
});
