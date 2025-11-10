import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  useColorScheme,
} from 'react-native';
import { ChatMessage } from '../../interfaces/Athena.model';
import {
  COLORS,
  getThemedStyles,
  GLASS_COLORS,
  SPACING,
  TYPOGRAPHY,
} from '../../styles/theme';
import { TypingIndicator } from './TypingIndicator';

interface AthenaMessagesProps {
  messages: ChatMessage[];
  isLoading?: boolean;
}

export function AthenaMessages({ messages, isLoading }: AthenaMessagesProps) {
  const isDarkMode = useColorScheme() === 'dark';
  const themedStyles = getThemedStyles(isDarkMode);
  const scrollViewRef = useRef<ScrollView>(null);

  useEffect(() => {
    if ((messages.length > 0 || isLoading) && scrollViewRef.current) {
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages, isLoading]);

  if (messages.length === 0 && !isLoading) {
    return null;
  }

  return (
    <ScrollView
      ref={scrollViewRef}
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      {messages.map((message, index) => (
        <View
          key={index}
          style={[
            styles.messageContainer,
            message.role === 'user'
              ? styles.userMessage
              : styles.modelMessage,
          ]}
        >
          <View
            style={[
              styles.messageBubble,
              message.role === 'user'
                ? styles.userBubble
                : styles.modelBubble,
            ]}
          >
            <Text
              style={[
                themedStyles.text,
                styles.messageText,
                message.role === 'user' && styles.userText,
              ]}
            >
              {message.content}
            </Text>
          </View>
        </View>
      ))}
      {isLoading && <TypingIndicator />}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: SPACING.LG,
    paddingVertical: SPACING.MD,
  },
  messageContainer: {
    marginVertical: SPACING.XS,
    maxWidth: '80%',
  },
  userMessage: {
    alignSelf: 'flex-end',
  },
  modelMessage: {
    alignSelf: 'flex-start',
  },
  messageBubble: {
    borderRadius: 16,
    paddingHorizontal: SPACING.MD,
    paddingVertical: SPACING.SM,
    borderWidth: 1,
  },
  userBubble: {
    backgroundColor: COLORS.PRIMARY,
    borderColor: COLORS.PRIMARY,
  },
  modelBubble: {
    backgroundColor: GLASS_COLORS.PRIMARY_BACKGROUND,
    borderColor: GLASS_COLORS.PRIMARY_BORDER,
  },
  messageText: {
    fontSize: TYPOGRAPHY.SIZES.MD,
    lineHeight: 20,
    textAlign: 'left',
  },
  userText: {
    color: COLORS.WHITE,
  },
});
