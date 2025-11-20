import React, { useState, forwardRef } from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  useColorScheme,
  Dimensions,
} from 'react-native';
import ActionSheet, { ActionSheetRef } from 'react-native-actions-sheet';
import { useTranslation } from 'react-i18next';
import { COLORS, getThemedStyles } from '../../styles/theme';
import Button from '../Button';
import { StyledToggle } from '../Toggle';

interface LoginSheetProps {
  onLogin: (battleNetId: string, enableBiometrics: boolean) => Promise<void>;
  onBattleNetLogin?: () => void;
}

export const LoginSheet = forwardRef<ActionSheetRef, LoginSheetProps>(
  ({ onLogin, onBattleNetLogin }, ref) => {
    const isDarkMode = useColorScheme() === 'dark';
    const { t } = useTranslation();
    const [input, setInput] = useState('');
    const [enableBiometrics, setEnableBiometrics] = useState(false);
    const battleNetBtnColor = '#009AE4';

    const [requirements, setRequirements] = useState<
      { text: string; meet: boolean }[]
    >([
      {
        text: t('requirements.length'),
        meet: false,
      },
      {
        text: t('requirements.separator'),
        meet: false,
      },
      {
        text: t('requirements.id'),
        meet: false,
      },
    ]);

    const handleLoginInput = (text: string) => {
      setInput(text);
      const lengthReq = /^.{3,30}$/.test(text);
      const separatorReq = /-/.test(text);
      const idReq = /-\d+$/.test(text);

      setRequirements([
        {
          text: t('requirements.length'),
          meet: lengthReq,
        },
        {
          text: t('requirements.separator'),
          meet: separatorReq,
        },
        {
          text: t('requirements.id'),
          meet: idReq,
        },
      ]);
    };

    const resetForm = () => {
      setInput('');
      setEnableBiometrics(false);
      setRequirements([
        {
          text: t('requirements.length'),
          meet: false,
        },
        {
          text: t('requirements.separator'),
          meet: false,
        },
        {
          text: t('requirements.id'),
          meet: false,
        },
      ]);
    };

    const handleLogin = async () => {
      await onLogin(input, enableBiometrics);
      resetForm();
    };

    return (
      <ActionSheet
        gestureEnabled={false}
        defaultOverlayOpacity={0.1}
        headerAlwaysVisible
        ref={ref}
        onBeforeShow={resetForm}
        containerStyle={[
          styles(isDarkMode).actionSheetContainer,
          styles(isDarkMode).loginSheet,
        ]}
      >
        <Text
          style={[
            getThemedStyles(isDarkMode).text,
            getThemedStyles(isDarkMode).title,
          ]}
        >
          {t('common.enter')}
        </Text>

        <TextInput
          value={input}
          onChangeText={handleLoginInput}
          cursorColor={COLORS.PRIMARY}
          selectionHandleColor={COLORS.PRIMARY}
          selectionColor={COLORS.PRIMARY}
          placeholderTextColor={COLORS.PRIMARY}
          placeholder={t('common.battleNet')}
          style={styles(isDarkMode).input}
        />

        <View style={styles(isDarkMode).reqContainer}>
          {requirements.map((req, index) => (
            <Text
              key={index}
              style={{ color: !req.meet ? COLORS.ERROR : COLORS.SUCCESS }}
            >
              {req.text}
            </Text>
          ))}

          <StyledToggle
            label={t('biometrics.enableMessage')}
            value={enableBiometrics}
            onPress={() => setEnableBiometrics(!enableBiometrics)}
            isDarkMode={isDarkMode}
          />
        </View>

        <Button
          customStyles={styles(isDarkMode).customButton}
          disabled={!requirements.every((r) => r.meet)}
          width={'90%'}
          title={t('common.enter')}
          onPress={handleLogin}
        />

        <View style={styles(isDarkMode).orContainer}>
          <Text style={styles(isDarkMode).orText}>{t('common.or')}</Text>
        </View>

        <Button
          customStyles={[
            styles(isDarkMode).customButton,
            {
              backgroundColor: battleNetBtnColor,
            },
          ]}
          width={'90%'}
          title={t('common.loginBN')}
          onPress={onBattleNetLogin || (() => {})}
        />
      </ActionSheet>
    );
  },
);

LoginSheet.displayName = 'LoginSheet';

const styles = (isDarkMode: boolean) =>
  StyleSheet.create({
    actionSheetContainer: {
      display: 'flex',
      backgroundColor: isDarkMode ? COLORS.DARK.CARD : COLORS.LIGHT.CARD,
    },
    input: {
      width: '90%',
      padding: 10,
      margin: 10,
      backgroundColor: COLORS.WHITE,
      color: COLORS.DARK.BACKGROUND,
      alignSelf: 'center',
      borderRadius: 6,
      borderWidth: 1,
      borderColor: isDarkMode ? COLORS.DARK.BORDER : COLORS.LIGHT.BORDER,
    },
    reqContainer: {
      paddingLeft: 18,
    },
    customButton: {
      alignSelf: 'center',
      justifyContent: 'center',
      padding: 10,
      margin: 10,
    },
    loginSheet: {
      borderWidth: 1,
      borderColor: isDarkMode ? COLORS.DARK.BORDER : COLORS.LIGHT.BORDER,
      paddingBottom: Dimensions.get('screen').height * 0.02,
    },
    orContainer: {
      width: '90%',
      alignSelf: 'center',
      alignItems: 'center',
      marginVertical: 10,
      borderBottomWidth: 1,
      borderBottomColor: isDarkMode ? COLORS.DARK.BORDER : COLORS.LIGHT.BORDER,
      position: 'relative',
    },
    orText: {
      color: isDarkMode ? COLORS.DARK.TEXT : COLORS.LIGHT.TEXT,
      backgroundColor: isDarkMode ? COLORS.DARK.CARD : COLORS.LIGHT.CARD,
      paddingHorizontal: 10,
      position: 'absolute',
      top: -10,
    },
  });
