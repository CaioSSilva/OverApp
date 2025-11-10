import React, {
  useRef,
  useEffect,
  useCallback,
  useState,
  useContext,
} from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  useColorScheme,
  Image,
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
import { dataService } from '../../hooks/data';
import { OverwatchProfile } from '../../interfaces/Summary.model';
import { AppContext } from '../../contexts/AppContext';

interface AthenaMessagesProps {
  messages: ChatMessage[];
  isLoading?: boolean;
}

export function AthenaMessages({ messages, isLoading }: AthenaMessagesProps) {
  const isDarkMode = useColorScheme() === 'dark';
  const themedStyles = getThemedStyles(isDarkMode);
  const scrollViewRef = useRef<ScrollView>(null);
  const { User } = useContext(AppContext);
  const [profile, setProfile] = useState<OverwatchProfile | null>(null);
  const { getProfileById } = dataService();

  const fetchProfile = useCallback(
    () => getProfileById(User?.name),
    [User?.name, getProfileById],
  );

  useEffect(() => {
    fetchProfile().then(setProfile);
    if ((messages.length > 0 || isLoading) && scrollViewRef.current) {
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages, isLoading, fetchProfile]);

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
            message.role === 'user' ? styles.userMessage : styles.modelMessage,
          ]}
        >
          <View
            style={[
              styles.messageBubble,
              message.role === 'user' ? styles.userBubble : styles.modelBubble,
            ]}
          >
            {message.role === 'user' ? (
              <Image style={styles.avatar} source={{ uri: profile?.avatar }} />
            ) : (
              <Text style={[styles.avatar, styles.avatarText]}>A</Text>
            )}
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
  avatar: {
    width: 25,
    height: 25,
    borderRadius: 16,
    backgroundColor: COLORS.INFO,
    marginRight: 8,    position: 'absolute',
    right: -18,
    top: -10,
  },
  avatarText: {
    color: COLORS.WHITE,
    fontWeight: 'bold',
    textAlign: 'center',
    lineHeight: 25,
    left: -10,
  },
});
