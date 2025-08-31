import React, { useState } from 'react';
import {
  useColorScheme,
  View,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
} from 'react-native';
import { getThemedStyles, SPACING } from '../styles/theme';
import AthenaMenu from '../components/Athena/AthenaMenu';
import AthenaInput from '../components/Athena/AthenaInput';
import { AthenaGrettings } from '../components/Athena/AthenaGrettings';
import { useTranslation } from 'react-i18next';

export default function Athena() {
  const isDarkMode = useColorScheme() === 'dark';
  const { t } = useTranslation();
  const [message, setMessage] = useState('');
  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };

  return (
    <View
      onTouchStart={dismissKeyboard}
      style={[getThemedStyles(isDarkMode).container]}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={60}
        style={styles.avoidContainer}
      >
        <AthenaMenu />
        <AthenaGrettings />

        <View style={styles.inputContainer}>
          <AthenaInput
            placeholder={t('athena.inputPlaceholder')}
            value={message}
            onChangeText={setMessage}
            onSend={() => {
              setMessage('');
            }}
            multiline={false}
            onMic={() => {}}
          />
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  avoidContainer: {
    flex: 1,
  },
  inputContainer: {
    paddingHorizontal: SPACING.LG,
    paddingVertical: SPACING.SM,
  },
});
