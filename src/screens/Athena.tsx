import React, { useState } from 'react';
import {
  Text,
  useColorScheme,
  View,
  StyleSheet,
  TouchableWithoutFeedback,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { getThemedStyles, SPACING, TYPOGRAPHY } from '../styles/theme';
import Input from '../components/AthenaInput';

export default function Athena() {
  const isDarkMode = useColorScheme() === 'dark';
  const themedStyles = getThemedStyles(isDarkMode);
  const [message, setMessage] = useState('');
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();

  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };

  const handleSend = () => {
    if (message.trim()) {
      console.log('Sending message:', message);
      setMessage('');
    }
  };
  const keyboardOffset = Platform.OS === 'ios' ? 40 : 40;

  return (
    <View style={styles.container}>
      <KeyboardAvoidingView
        style={styles.keyboardContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={keyboardOffset}
      >
        <TouchableWithoutFeedback onPress={dismissKeyboard}>
          <View style={[themedStyles.container, styles.wrapper]}>
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
            </View>

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
    marginBottom: SPACING.LG,
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
});
