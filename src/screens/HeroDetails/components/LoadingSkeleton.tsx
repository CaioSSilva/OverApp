import React from 'react';
import { ScrollView } from 'react-native';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import { getThemedStyles, SPACING, BORDER_RADIUS } from '../../../styles/theme';

interface LoadingSkeletonProps {
  isDarkMode: boolean;
}

export function LoadingSkeleton({ isDarkMode }: LoadingSkeletonProps) {
  const themedStyles = getThemedStyles(isDarkMode);

  return (
    <ScrollView style={themedStyles.container} showsVerticalScrollIndicator={false}>
      <SkeletonPlaceholder
        backgroundColor={isDarkMode ? '#222222ff' : '#9f9e9cff'}
        highlightColor="#777"
      >
        <SkeletonPlaceholder.Item
          flexDirection="row"
          alignItems="center"
          padding={SPACING.MD}
        >
          <SkeletonPlaceholder.Item
            width={120}
            height={120}
            borderRadius={BORDER_RADIUS.XL}
            marginRight={SPACING.MD}
          />
          <SkeletonPlaceholder.Item flex={1}>
            <SkeletonPlaceholder.Item width="80%" height={24} marginBottom={8} />
            <SkeletonPlaceholder.Item width="40%" height={20} marginBottom={8} />
            <SkeletonPlaceholder.Item width="60%" height={16} marginBottom={4} />
            <SkeletonPlaceholder.Item width="50%" height={16} />
          </SkeletonPlaceholder.Item>
        </SkeletonPlaceholder.Item>

        <SkeletonPlaceholder.Item
          margin={SPACING.MD}
          padding={SPACING.MD}
          borderRadius={BORDER_RADIUS.MD}
        >
          <SkeletonPlaceholder.Item width="100%" height={16} marginBottom={8} />
          <SkeletonPlaceholder.Item width="90%" height={16} marginBottom={8} />
          <SkeletonPlaceholder.Item width="95%" height={16} />
        </SkeletonPlaceholder.Item>

        <SkeletonPlaceholder.Item
          margin={SPACING.MD}
          padding={SPACING.MD}
          borderRadius={BORDER_RADIUS.MD}
        >
          <SkeletonPlaceholder.Item width="40%" height={20} marginBottom={SPACING.MD} />
          <SkeletonPlaceholder.Item
            flexDirection="row"
            justifyContent="space-between"
          >
            <SkeletonPlaceholder.Item alignItems="center" width="20%">
              <SkeletonPlaceholder.Item width="100%" height={16} marginBottom={4} />
              <SkeletonPlaceholder.Item width="60%" height={20} />
            </SkeletonPlaceholder.Item>
            <SkeletonPlaceholder.Item alignItems="center" width="20%">
              <SkeletonPlaceholder.Item width="100%" height={16} marginBottom={4} />
              <SkeletonPlaceholder.Item width="60%" height={20} />
            </SkeletonPlaceholder.Item>
            <SkeletonPlaceholder.Item alignItems="center" width="20%">
              <SkeletonPlaceholder.Item width="100%" height={16} marginBottom={4} />
              <SkeletonPlaceholder.Item width="60%" height={20} />
            </SkeletonPlaceholder.Item>
            <SkeletonPlaceholder.Item alignItems="center" width="20%">
              <SkeletonPlaceholder.Item width="100%" height={16} marginBottom={4} />
              <SkeletonPlaceholder.Item width="60%" height={20} />
            </SkeletonPlaceholder.Item>
          </SkeletonPlaceholder.Item>
        </SkeletonPlaceholder.Item>

        <SkeletonPlaceholder.Item
          margin={SPACING.MD}
          padding={SPACING.MD}
          borderRadius={BORDER_RADIUS.MD}
        >
          <SkeletonPlaceholder.Item width="40%" height={20} marginBottom={SPACING.MD} />
          {[1, 2, 3, 4].map((index) => (
            <SkeletonPlaceholder.Item
              key={index}
              flexDirection="row"
              marginBottom={SPACING.MD}
              padding={SPACING.SM}
              borderRadius={BORDER_RADIUS.SM}
            >
              <SkeletonPlaceholder.Item
                width={40}
                height={40}
                marginRight={SPACING.MD}
              />
              <SkeletonPlaceholder.Item flex={1}>
                <SkeletonPlaceholder.Item width="60%" height={18} marginBottom={4} />
                <SkeletonPlaceholder.Item width="100%" height={14} marginBottom={2} />
                <SkeletonPlaceholder.Item width="80%" height={14} />
              </SkeletonPlaceholder.Item>
            </SkeletonPlaceholder.Item>
          ))}
        </SkeletonPlaceholder.Item>

        <SkeletonPlaceholder.Item
          margin={SPACING.MD}
          padding={SPACING.MD}
          borderRadius={BORDER_RADIUS.MD}
        >
          <SkeletonPlaceholder.Item width="30%" height={20} marginBottom={SPACING.MD} />
          <SkeletonPlaceholder.Item width="100%" height={16} marginBottom={8} />
          <SkeletonPlaceholder.Item width="95%" height={16} marginBottom={8} />
          <SkeletonPlaceholder.Item width="90%" height={16} marginBottom={SPACING.MD} />
          <SkeletonPlaceholder.Item
            width="50%"
            height={40}
            borderRadius={BORDER_RADIUS.SM}
            marginBottom={SPACING.LG}
          />
          
          <SkeletonPlaceholder.Item marginTop={SPACING.LG}>
            <SkeletonPlaceholder.Item width="40%" height={18} marginBottom={SPACING.MD} />
            <SkeletonPlaceholder.Item
              width="100%"
              height={200}
              borderRadius={BORDER_RADIUS.MD}
              marginBottom={SPACING.MD}
            />
            <SkeletonPlaceholder.Item width="100%" height={16} marginBottom={6} />
            <SkeletonPlaceholder.Item width="98%" height={16} marginBottom={6} />
            <SkeletonPlaceholder.Item width="95%" height={16} marginBottom={6} />
            <SkeletonPlaceholder.Item width="90%" height={16} />
          </SkeletonPlaceholder.Item>
        </SkeletonPlaceholder.Item>
      </SkeletonPlaceholder>
    </ScrollView>
  );
}
