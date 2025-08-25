import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  FlatList,
  Linking,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { Story as StoryInterface } from '../../../interfaces/HeroStory.model';
import {
  getThemedStyles,
  COLORS,
  TYPOGRAPHY,
  SPACING,
  BORDER_RADIUS,
} from '../../../styles/theme';

interface StoryProps {
  story: StoryInterface;
  isDarkMode: boolean;
}

export const Story = React.memo(({ story, isDarkMode }: StoryProps) => {
  const themedStyles = getThemedStyles(isDarkMode);
  const { t } = useTranslation();
  const screenWidth = Dimensions.get('window').width;
  const cardWidth = screenWidth - SPACING.MD * 4;
  const [activeIndex, setActiveIndex] = useState(0);

  const handleMediaPress = useCallback(async (link: string) => {
    await Linking.openURL(link);
  }, []);

  const onScroll = useCallback((event: any) => {
    const slideSize = cardWidth + SPACING.MD;
    const index = Math.round(event.nativeEvent.contentOffset.x / slideSize);
    setActiveIndex(index);
  }, [cardWidth]);

  const renderChapterCard = useCallback(({ item: chapter, index }: { item: any, index: number }) => (
    <View key={index} style={[styles.chapterCard, { width: cardWidth }]}>
      <Image
        source={{ uri: chapter.picture }}
        style={styles.chapterCardImage}
      />
      <View style={styles.chapterCardContent}>
        <Text
          style={[
            themedStyles.text,
            styles.chapterCardTitle,
            { color: COLORS.PRIMARY },
          ]}
        >
          {chapter.title}
        </Text>
        <ScrollView
          style={styles.textScrollView}
          showsVerticalScrollIndicator={false}
          nestedScrollEnabled={true}
          bounces={true}
        >
          <Text style={[themedStyles.text, styles.chapterCardPreview]}>
            {chapter.content}
          </Text>
        </ScrollView>
      </View>
    </View>
  ), [cardWidth, themedStyles.text]);

  return (
    <View style={styles.section}>
      <Text
        style={[themedStyles.title, themedStyles.text, styles.sectionTitle]}
      >
        {t('heroDetails.story')}
      </Text>

      <Text style={[themedStyles.text, styles.storySummary]}>
        {story.summary}
      </Text>

      {story.media && (
        <TouchableOpacity
          style={styles.mediaButton}
          onPress={() => handleMediaPress(story.media.link)}
        >
          <Text style={styles.mediaButtonText}>
            {story.media.type === 'video'
              ? t('heroDetails.watchVideo')
              : t('heroDetails.readStory')}
          </Text>
        </TouchableOpacity>
      )}

      <View style={styles.chaptersContainer}>
        <FlatList
          data={story.chapters}
          horizontal={story.chapters.length > 1}
          showsHorizontalScrollIndicator={false}
          snapToInterval={story.chapters.length > 1 ? cardWidth + SPACING.MD : undefined}
          decelerationRate={story.chapters.length > 1 ? "fast" : "normal"}
          onScroll={story.chapters.length > 1 ? onScroll : undefined}
          scrollEventThrottle={story.chapters.length > 1 ? 16 : undefined}
          contentContainerStyle={
            story.chapters.length > 1 
              ? { paddingLeft: SPACING.MD }
              : { paddingHorizontal: SPACING.MD }
          }
          renderItem={renderChapterCard}
          keyExtractor={(item, index) => index.toString()}
        />
        
        {story.chapters.length > 1 && (
          <View style={styles.indicatorContainer}>
            {story.chapters.map((_, index) => (
              <View
                key={index}
                style={[
                  styles.indicator,
                  index === activeIndex ? styles.activeIndicator : styles.inactiveIndicator
                ]}
              />
            ))}
          </View>
        )}
      </View>
      
      
    </View>
  );
});

Story.displayName = 'Story';

const styles = StyleSheet.create({
  section: {
    margin: SPACING.MD,
    paddingBottom: SPACING.XL,
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
    marginRight: SPACING.MD,
    borderRadius: BORDER_RADIUS.MD,
    backgroundColor: 'rgba(250, 156, 30, 0.1)',
    overflow: 'hidden',
    height: 480,
  },
  chapterCardImage: {
    width: '100%',
    height: 180,
    resizeMode: 'cover',
  },
  chapterCardContent: {
    padding: SPACING.MD,
    flex: 1,
  },
  chapterCardTitle: {
    fontSize: TYPOGRAPHY.SIZES.LG,
    fontWeight: TYPOGRAPHY.WEIGHTS.BOLD,
    marginBottom: SPACING.SM,
    lineHeight: 24,
  },
  textScrollView: {
    flex: 1,
    minHeight: 200,
    maxHeight: 240,
    paddingRight: SPACING.XS,
  },
  chapterCardPreview: {
    fontSize: TYPOGRAPHY.SIZES.MD,
    lineHeight: 22,
    opacity: 0.9,
  },
  indicatorContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: SPACING.MD,
    paddingHorizontal: SPACING.MD,
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  activeIndicator: {
    backgroundColor: COLORS.PRIMARY,
  },
  inactiveIndicator: {
    backgroundColor: 'rgba(250, 156, 30, 0.3)',
  },
});
