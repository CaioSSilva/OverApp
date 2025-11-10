import React, { useRef } from 'react';
import {
  useColorScheme,
  View,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
} from 'react-native';

import AthenaMenu from './Menu';
import AthenaInput from './Input';
import { AthenaGrettings } from './Greetings';
import { AthenaMessages } from './Messages';
import { useTranslation } from 'react-i18next';
import { getThemedStyles, SPACING } from '../../styles/theme';
import { useAthenaChat } from '../../hooks/athena';

export default function Athena() {
  const isDarkMode = useColorScheme() === 'dark';
  const { t } = useTranslation();
  const inputRef = useRef<any>(null);

  const {
    message,
    setMessage,
    isLoading,
    currentChat,
    hasMessages,
    createChat,
    selectChat,
    deleteChat,
    sendMessage,
  } = useAthenaChat();

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
        <AthenaMenu
          onCreateChat={createChat}
          onSelectChat={selectChat}
          onDeleteChat={deleteChat}
        />

        {!hasMessages ? (
          <AthenaGrettings />
        ) : (
          <AthenaMessages
            messages={currentChat?.messages || []}
            isLoading={isLoading}
          />
        )}

        <View style={styles.inputContainer}>
          <AthenaInput
            ref={inputRef}
            placeholder={t('athena.inputPlaceholder')}
            value={message}
            onChangeText={setMessage}
            onSend={() => sendMessage(message)}
            multiline={false}
            onMic={() => {}}
            editable={!isLoading}
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
