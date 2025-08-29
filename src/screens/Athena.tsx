import React, { useEffect, useRef, useState } from 'react';
import {
  Text,
  useColorScheme,
  View,
  StyleSheet,
  TouchableWithoutFeedback,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  COLORS,
  getThemedStyles,
  GLASS_COLORS,
  SPACING,
  TYPOGRAPHY,
} from '../styles/theme';
import Input from '../components/AthenaInput';
// import { AthenaService } from '../hooks/athena';
import AthenaMenu from '../components/AthenaMenu';
import { Animated } from 'react-native';
import { MessageInterface } from '../interfaces/Message.model';

export default function Athena() {
  const isDarkMode = useColorScheme() === 'dark';
  const themedStyles = getThemedStyles(isDarkMode);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<MessageInterface[]>(
    Array.from({ length: 50 }, (_, i) => ({
      text: `Mensagem de exemplo número ${i + 1}`,
      actor: i % 2 === 0 ? 'You' : 'Athena',
    }))
  );
  const { t } = useTranslation();
  // const { askAthena } = AthenaService();
  const insets = useSafeAreaInsets();

  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };

  const handleSend = async () => {
    if (message.trim()) {
      setMessages([...messages, { text: message, actor: 'You' }]);
    }
  };
  const keyboardOffset = 30;
  const bounceValue = useBounceAnimation();

  function useBounceAnimation() {
    const val = useRef(new Animated.Value(1)).current;

    useEffect(() => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(bounceValue, {
            toValue: 1.2,
            duration: 400,
            useNativeDriver: true,
          }),
          Animated.timing(bounceValue, {
            toValue: 1,
            duration: 400,
            useNativeDriver: true,
          }),
        ]),
      ).start();
    }, [val]);

    return val;
  }

  return (
    <View style={styles.container}>
      <KeyboardAvoidingView
        style={styles.keyboardContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={keyboardOffset}
      >
        <TouchableWithoutFeedback onPress={dismissKeyboard}>
          <View style={[themedStyles.container, styles.wrapper]}>
            <AthenaMenu />
            {!messages.length ? (
              <View style={styles.content}>
                <Text
                  style={[
                    themedStyles.title,
                    themedStyles.text,
                    styles.welcomeTitle,
                  ]}
                >
                  {t('athena.welcome')}
                </Text>

                <Text style={[themedStyles.text, styles.subtitle]}>
                  {t('athena.subtitle')}
                </Text>

                <Text style={[themedStyles.text, styles.description]}>
                  {t('athena.description')}
                </Text>
                <View style={styles.pill}>
                  <Text style={[themedStyles.text, styles.pillText]}>
                    {t('athena.poweredBy')}
                  </Text>

                  <Animated.Image
                    source={require('../assets/gemini_color.png')}
                    style={[
                      styles.geminiLogo,
                      { transform: [{ scale: bounceValue }] },
                    ]}
                    resizeMode="contain"
                  />
                </View>
              </View>
            ) : (
              <ScrollView scrollEnabled style={{ flex: 1 }} showsVerticalScrollIndicator ba>
                {messages.map((msg, index) => (
                  <View key={index} style={{ padding: SPACING.SM }}>
                    <Text
                      style={[
                        themedStyles.text,
                        { fontWeight: TYPOGRAPHY.WEIGHTS.BOLD },
                      ]}
                    >
                      {msg.actor}:
                    </Text>
                    <Text style={[themedStyles.text]}>{msg.text}</Text>
                  </View>
                ))}
              </ScrollView>
            )}

            <View
              style={[styles.bottomContainer, { paddingBottom: insets.bottom }]}
            >
              <Input
                placeholder={t('athena.inputPlaceholder')}
                value={message}
                onChangeText={setMessage}
                onSend={handleSend}
                multiline={false}
              />
            </View>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardContainer: {
    flex: 1,
    zIndex: 100,
  },
  wrapper: {
    flex: 1,
    justifyContent: 'space-between',
  },
  content: {
    flex: 1,
    paddingHorizontal: SPACING.LG,
    paddingTop: SPACING.XXL,
    justifyContent: 'center',
  },
  welcomeTitle: {
    textAlign: 'center',
    marginBottom: SPACING.SM,
  },
  subtitle: {
    textAlign: 'center',
    fontSize: TYPOGRAPHY.SIZES.LG,
    marginBottom: SPACING.SM,
    opacity: 0.8,
  },
  description: {
    textAlign: 'center',
    fontSize: TYPOGRAPHY.SIZES.SM,
    opacity: 0.7,
    lineHeight: 20,
  },
  bottomContainer: {
    paddingHorizontal: SPACING.LG,
    paddingBottom: SPACING.LG,
  },
  pill: {
    marginHorizontal: 'auto',
    marginTop: SPACING.MD,
    borderRadius: 20,
    backgroundColor: '#656565ad',
    borderColor: GLASS_COLORS.WHITE_BORDER,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    padding: 5,
  },
  pillText: {
    marginHorizontal: 8,
    color: COLORS.WHITE,
  },
  geminiLogo: {
    width: 18,
    height: 18,
  },
});
