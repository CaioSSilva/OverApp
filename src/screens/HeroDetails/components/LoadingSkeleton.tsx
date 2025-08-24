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
          margin={SPACING.MD}
          marginBottom={10}
          padding={12}
          borderRadius={18}
          minHeight={110}
        >
          <SkeletonPlaceholder.Item
            flexDirection="row"
            alignItems="center"
            width="100%"
          >
            <SkeletonPlaceholder.Item
              width={80}
              height={80}
              borderRadius={16}
              marginRight={18}
            />
            <SkeletonPlaceholder.Item flex={1}>
              <SkeletonPlaceholder.Item width="60%" height={24} marginBottom={8} />
              <SkeletonPlaceholder.Item width="30%" height={18} marginBottom={8} />
              <SkeletonPlaceholder.Item width="80%" height={16} marginBottom={4} />
              <SkeletonPlaceholder.Item width="70%" height={16} />
            </SkeletonPlaceholder.Item>
          </SkeletonPlaceholder.Item>
        </SkeletonPlaceholder.Item>

        <SkeletonPlaceholder.Item
          margin={SPACING.MD}
          padding={SPACING.MD}
          borderRadius={BORDER_RADIUS.MD}
        >
          <SkeletonPlaceholder.Item width="100%" height={16} marginBottom={8} />
          <SkeletonPlaceholder.Item width="95%" height={16} marginBottom={8} />
          <SkeletonPlaceholder.Item width="90%" height={16} />
        </SkeletonPlaceholder.Item>

        <SkeletonPlaceholder.Item
          margin={SPACING.MD}
          padding={SPACING.MD}
          borderRadius={BORDER_RADIUS.MD}
        >
          <SkeletonPlaceholder.Item width="50%" height={20} marginBottom={SPACING.MD} alignSelf="center" />
          
          <SkeletonPlaceholder.Item marginBottom={SPACING.MD}>
            <SkeletonPlaceholder.Item width="20%" height={16} marginBottom={8} alignSelf="center" />
            <SkeletonPlaceholder.Item width="100%" height={8} borderRadius={4} marginBottom={4} />
            <SkeletonPlaceholder.Item width="30%" height={20} alignSelf="flex-end" />
          </SkeletonPlaceholder.Item>
          
          <SkeletonPlaceholder.Item>
            <SkeletonPlaceholder.Item width="20%" height={16} marginBottom={8} alignSelf="center" />
            <SkeletonPlaceholder.Item width="100%" height={8} borderRadius={4} marginBottom={4} />
            <SkeletonPlaceholder.Item width="30%" height={20} alignSelf="flex-end" />
          </SkeletonPlaceholder.Item>
        </SkeletonPlaceholder.Item>

        <SkeletonPlaceholder.Item
          margin={SPACING.MD}
        >
          <SkeletonPlaceholder.Item width="40%" height={24} marginBottom={SPACING.MD} />
          {[1, 2].map((index) => (
            <SkeletonPlaceholder.Item
              key={index}
              marginBottom={SPACING.MD}
              borderRadius={BORDER_RADIUS.MD}
              overflow="hidden"
              position="relative"
            >
              <SkeletonPlaceholder.Item
                width="100%"
                height={180}
              />
              <SkeletonPlaceholder.Item
                position="absolute"
                bottom={0}
                left={0}
                right={0}
                padding={SPACING.MD}
                backgroundColor="rgba(0, 0, 0, 0.7)"
              >
                <SkeletonPlaceholder.Item
                  flexDirection="row"
                  alignItems="center"
                  marginBottom={SPACING.SM}
                >
                  <SkeletonPlaceholder.Item
                    width={32}
                    height={32}
                    marginRight={SPACING.SM}
                  />
                  <SkeletonPlaceholder.Item width="60%" height={18} />
                </SkeletonPlaceholder.Item>
                <SkeletonPlaceholder.Item width="100%" height={14} marginBottom={2} />
                <SkeletonPlaceholder.Item width="80%" height={14} />
              </SkeletonPlaceholder.Item>
            </SkeletonPlaceholder.Item>
          ))}
        </SkeletonPlaceholder.Item>

        <SkeletonPlaceholder.Item
          margin={SPACING.MD}
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
          
          <SkeletonPlaceholder.Item marginTop={SPACING.MD}>
            <SkeletonPlaceholder.Item
              width="100%"
              height={300}
              borderRadius={BORDER_RADIUS.MD}
              marginBottom={SPACING.MD}
            >
              <SkeletonPlaceholder.Item
                width="100%"
                height={150}
              />
              <SkeletonPlaceholder.Item
                padding={SPACING.MD}
                flex={1}
              >
                <SkeletonPlaceholder.Item width="70%" height={18} marginBottom={SPACING.SM} />
                <SkeletonPlaceholder.Item width="100%" height={14} marginBottom={6} />
                <SkeletonPlaceholder.Item width="98%" height={14} marginBottom={6} />
                <SkeletonPlaceholder.Item width="95%" height={14} marginBottom={6} />
                <SkeletonPlaceholder.Item width="90%" height={14} />
              </SkeletonPlaceholder.Item>
            </SkeletonPlaceholder.Item>
          </SkeletonPlaceholder.Item>
        </SkeletonPlaceholder.Item>
      </SkeletonPlaceholder>
    </ScrollView>
  );
}
