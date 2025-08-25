import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import Video from 'react-native-video';
import { Ability } from '../../../interfaces/HeroStory.model';
import { getThemedStyles, COLORS, TYPOGRAPHY, SPACING, BORDER_RADIUS } from '../../../styles/theme';

interface AbilitiesProps {
  abilities: Ability[];
  isDarkMode: boolean;
}

export const Abilities = React.memo(({ abilities, isDarkMode }: AbilitiesProps) => {
  const themedStyles = getThemedStyles(isDarkMode);
  const { t } = useTranslation();
  const [hiddenOverlays, setHiddenOverlays] = useState<Set<number>>(new Set());
  const [videoDurations, setVideoDurations] = useState<Map<number, number>>(new Map());
  const [overlayTimers, setOverlayTimers] = useState<Map<number, ReturnType<typeof setTimeout>>>(new Map());
  const [overlayHeights, setOverlayHeights] = useState<Map<number, number>>(new Map());

  const handleCardPress = useCallback((index: number) => {
    const existingTimer = overlayTimers.get(index);
    if (existingTimer) clearTimeout(existingTimer);

    setHiddenOverlays(prev => new Set(prev).add(index));

    const duration = videoDurations.get(index) || 5;
    const timer = setTimeout(() => {
      setHiddenOverlays(prev => {
        const newSet = new Set(prev);
        newSet.delete(index);
        return newSet;
      });
      setOverlayTimers(prev => {
        const newMap = new Map(prev);
        newMap.delete(index);
        return newMap;
      });
    }, duration * 1000);

    setOverlayTimers(prev => new Map(prev).set(index, timer));
  }, [overlayTimers, videoDurations]);

  const handleVideoLoad = useCallback((index: number, data: any) => {
    setVideoDurations(prev => new Map(prev).set(index, data.duration));
  }, []);

  const handleOverlayLayout = useCallback((index: number, event: any) => {
    const { height } = event.nativeEvent.layout;
    setOverlayHeights(prev => {
      const newMap = new Map(prev);
      newMap.set(index, height);
      return newMap;
    });
  }, []);

  const calculateGradientHeight = useCallback((ability: Ability, index: number) => {
    const measuredHeight = overlayHeights.get(index);
    
    if (measuredHeight) {
      return Math.min(measuredHeight + 10, 180);
    }
    
    const words = ability.description.split(' ').length;
    const estimatedLines = Math.max(1, Math.ceil(words / 8));
    const totalHeight = 32 + SPACING.SM + (estimatedLines * 20) + (SPACING.MD * 2);
    
    return Math.min(totalHeight + 10, 180);
  }, [overlayHeights]);

  useEffect(() => {
    return () => overlayTimers.forEach(clearTimeout);
  }, [overlayTimers]);

  return (
    <View style={[themedStyles.card, styles.section]}>
      <Text style={[themedStyles.title, themedStyles.text, styles.sectionTitle]}>
        {t('heroDetails.abilities')}
      </Text>
      <View style={{ gap: SPACING.MD }}>
        {abilities.map((ability, index) => {
          const isOverlayVisible = !hiddenOverlays.has(index);
          const gradientHeight = calculateGradientHeight(ability, index);
        
          return (
            <TouchableOpacity
              key={index}
              style={styles.abilityCardEnhanced}
              onPress={() => handleCardPress(index)}
            >
              <Video
                source={{ uri: ability.video.link.mp4 }}
                style={styles.abilityVideo}
                resizeMode="cover"
                repeat={true}
                muted={true}
                onLoad={(data) => handleVideoLoad(index, data)}
                poster={ability.video.thumbnail}
              />
        
              {isOverlayVisible && (
                <>
                  <View style={[styles.abilityGradientBottom, { height: gradientHeight }]} />
                  <View
                    style={styles.abilityOverlay}
                    onLayout={(event) => handleOverlayLayout(index, event)}
                  >
                    <View style={styles.abilityHeader}>
                      <Image source={{ uri: ability.icon }} style={styles.abilityIconSmall} />
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
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
});

Abilities.displayName = 'Abilities';

const styles = StyleSheet.create({
  section: {
    margin: SPACING.MD,
  },
  sectionTitle: {
    fontSize: TYPOGRAPHY.SIZES.XL,
    marginBottom: SPACING.MD,
  },
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
