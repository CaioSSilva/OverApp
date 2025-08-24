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

  useEffect(() => {
    return () => overlayTimers.forEach(clearTimeout);
  }, [overlayTimers]);

  return (
    <View style={[themedStyles.card, styles.section]}>
      <Text style={[themedStyles.title, themedStyles.text, styles.sectionTitle]}>
        {t('heroDetails.abilities')}
      </Text>
      {abilities.map((ability, index) => {
        const isOverlayVisible = !hiddenOverlays.has(index);
        
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
                <View style={styles.abilityGradientTop} />
                <View style={styles.abilityGradientBottom} />
                <View style={styles.abilityOverlay}>
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
    marginBottom: SPACING.MD,
    borderRadius: BORDER_RADIUS.MD,
    overflow: 'hidden',
    backgroundColor: 'rgba(250, 156, 30, 0.1)',
    position: 'relative',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  abilityThumbnail: {
    width: '100%',
    height: 180,
    resizeMode: 'cover',
  },
  abilityVideo: {
    width: '100%',
    height: 180,
  },
  abilityOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'flex-end',
    padding: SPACING.MD,
  },
  abilityGradientTop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '20%',
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
  },
  abilityGradientBottom: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '60%',
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
  abilityInfo: {
    flex: 1,
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
