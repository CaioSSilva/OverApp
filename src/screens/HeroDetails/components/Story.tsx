import React from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView, Linking, StyleSheet } from 'react-native';
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

  const handleMediaPress = async (link: string) => {
    await Linking.openURL(link);
  };

  return (
    <View style={[themedStyles.card, styles.section]}>
      <Text style={[themedStyles.title, themedStyles.text, styles.sectionTitle]}>
        {t('story')}
      </Text>
      
      <Text style={[themedStyles.text, styles.storySummary]}>{story.summary}</Text>
      
      <TouchableOpacity 
        style={styles.mediaButton}
        onPress={() => handleMediaPress(story.media.link)}
      >
        <Text style={styles.mediaButtonText}>
          {story.media.type === 'video' ? t('watchVideo') : t('readStory')}
        </Text>
      </TouchableOpacity>

      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={styles.chaptersScrollView}
      >
        {story.chapters.map((chapter, index) => (
          <TouchableOpacity key={index} style={styles.chapterCard}>
            <Image source={{ uri: chapter.picture }} style={styles.chapterCardImage} />
            <View style={styles.chapterCardContent}>
              <Text style={[themedStyles.text, styles.chapterCardTitle, { color: COLORS.PRIMARY }]}>
                {chapter.title}
              </Text>
              <Text style={[themedStyles.text, styles.chapterCardPreview]} numberOfLines={3}>
                {chapter.content}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
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
  chaptersScrollView: {
    marginTop: SPACING.MD,
  },
  chapterCard: {
    width: 200,
    marginRight: SPACING.MD,
    borderRadius: BORDER_RADIUS.MD,
    backgroundColor: 'rgba(250, 156, 30, 0.1)',
    overflow: 'hidden',
  },
  chapterCardImage: {
    width: '100%',
    height: 120,
    resizeMode: 'cover',
  },
  chapterCardContent: {
    padding: SPACING.SM,
  },
  chapterCardTitle: {
    fontSize: TYPOGRAPHY.SIZES.MD,
    fontWeight: TYPOGRAPHY.WEIGHTS.BOLD,
    marginBottom: SPACING.XS,
  },
  chapterCardPreview: {
    fontSize: TYPOGRAPHY.SIZES.SM,
    lineHeight: 16,
    opacity: 0.8,
  },
});
