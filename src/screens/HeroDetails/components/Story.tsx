import React from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView, Linking, StyleSheet, Dimensions } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Story as StoryInterface } from '../../../interfaces/HeroStory.model';
import { getThemedStyles, COLORS, TYPOGRAPHY, SPACING, BORDER_RADIUS } from '../../../styles/theme';

interface StoryProps {
  story: StoryInterface;
  isDarkMode: boolean;
}

export function Story({ story, isDarkMode }: StoryProps) {
  const themedStyles = getThemedStyles(isDarkMode);
  const { t } = useTranslation();
  const screenWidth = Dimensions.get('window').width;
  const cardWidth = screenWidth - (SPACING.MD * 4); // Padding nas laterais

  const handleMediaPress = async (link: string) => {
    await Linking.openURL(link);
  };

  return (
    <View style={[themedStyles.card, styles.section]}>
      <Text style={[themedStyles.title, themedStyles.text, styles.sectionTitle]}>
        {t('heroDetails.story')}
      </Text>
      
      <Text style={[themedStyles.text, styles.storySummary]}>{story.summary}</Text>
      
      <TouchableOpacity 
        style={styles.mediaButton}
        onPress={() => handleMediaPress(story.media.link)}
      >
        <Text style={styles.mediaButtonText}>
          {story.media.type === 'video' ? t('heroDetails.watchVideo') : t('heroDetails.readStory')}
        </Text>
      </TouchableOpacity>

      <View style={styles.chaptersContainer}>
        {story.chapters.map((chapter, index) => (
          <View key={index} style={[styles.chapterCard, { width: cardWidth }]}>
            <TouchableOpacity onPress={() => handleMediaPress(chapter.picture)}>
              <Image source={{ uri: chapter.picture }} style={styles.chapterCardImage} />
            </TouchableOpacity>
            <View style={styles.chapterCardContent}>
              <Text style={[themedStyles.text, styles.chapterCardTitle, { color: COLORS.PRIMARY }]}>
                {chapter.title}
              </Text>
              <ScrollView 
                style={styles.textScrollView}
                showsVerticalScrollIndicator={true}
                nestedScrollEnabled={true}
                bounces={true}
              >
                <Text style={[themedStyles.text, styles.chapterCardPreview]}>
                  {chapter.content}
                </Text>
              </ScrollView>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    margin: SPACING.MD,
  },
  sectionTitle: {
    fontSize: TYPOGRAPHY.SIZES.XL,
    marginBottom: SPACING.MD,
  },
  storySummary: {
    fontSize: TYPOGRAPHY.SIZES.MD,
    lineHeight: 22,
    marginBottom: SPACING.MD,
    fontStyle: 'italic',
  },
  mediaButton: {
    backgroundColor: COLORS.PRIMARY,
    paddingVertical: SPACING.SM,
    paddingHorizontal: SPACING.MD,
    borderRadius: BORDER_RADIUS.SM,
    alignItems: 'center',
    marginBottom: SPACING.LG,
  },
  mediaButtonText: {
    color: COLORS.WHITE,
    fontSize: TYPOGRAPHY.SIZES.MD,
    fontWeight: TYPOGRAPHY.WEIGHTS.BOLD,
  },
  chaptersContainer: {
    marginTop: SPACING.MD,
  },
  chapterCard: {
    marginBottom: SPACING.MD,
    borderRadius: BORDER_RADIUS.MD,
    backgroundColor: 'rgba(250, 156, 30, 0.1)',
    overflow: 'hidden',
    alignSelf: 'center',
    height: 220,
  },
  chapterCardImage: {
    width: '100%',
    height: 120,
    resizeMode: 'cover',
  },
  chapterCardContent: {
    padding: SPACING.SM,
    flex: 1,
  },
  chapterCardTitle: {
    fontSize: TYPOGRAPHY.SIZES.MD,
    fontWeight: TYPOGRAPHY.WEIGHTS.BOLD,
    marginBottom: SPACING.XS,
  },
  textScrollView: {
    flex: 1,
    minHeight: 80,
    maxHeight: 120,
  },
  chapterCardPreview: {
    fontSize: TYPOGRAPHY.SIZES.SM,
    lineHeight: 18,
    opacity: 0.8,
  },
});
