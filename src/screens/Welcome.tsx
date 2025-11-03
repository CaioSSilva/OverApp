import {
  Animated,
  Dimensions,
  ImageBackground,
  StyleSheet,
  Text,
  TextInput,
  useColorScheme,
  View,
  ViewStyle,
} from 'react-native';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { COLORS, getThemedStyles } from '../styles/theme';
import Button from '../components/Button';
import ActionSheet, { ActionSheetRef } from 'react-native-actions-sheet';
import { useTranslation } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AppContext } from '../contexts/AppContext';
import { dataService } from '../hooks/data';
import Toast from 'react-native-toast-message';

export default function Welcome() {
  const isDarkMode = useColorScheme() === 'dark';
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const imageAnim = useRef(new Animated.Value(0)).current;
  const titleAnim = useRef(new Animated.Value(0)).current;
  const { checkUserExists } = dataService();
  const [input, setInput] = useState('');
  const { t } = useTranslation();

  const { setUser } = useContext(AppContext);

  const battleNetBtnColor = '#009AE4';

  const styles = getThemedStyles(isDarkMode);
  const splashStyle: ViewStyle = {
    justifyContent: 'center',
    alignItems: 'center',
  };

  const loginSheet = useRef<ActionSheetRef>(null);

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();

    Animated.timing(imageAnim, {
      toValue: -Dimensions.get('screen').height * 0.1,
      duration: 2000,
      useNativeDriver: true,
    }).start();

    Animated.timing(titleAnim, {
      toValue: -Dimensions.get('screen').height * 0.05,
      duration: 2000,
      useNativeDriver: true,
    }).start();
  });

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
    const profile = await checkUserExists(input);

    if (profile) {
      const userObj = { name: input };
      await AsyncStorage.setItem('user', JSON.stringify(userObj));
      loginSheet.current?.hide();
      setUser(userObj);
    } else {
      Toast.show({
        type: 'error',
        text1: t('errors.unexpectedError'),
        text2: t('errors.userNotFound'),
        position: 'top',
        visibilityTime: 4000,
        autoHide: true,
        topOffset: 50,
      });
    }
  };

  const onEnterPress = () => {
    if (loginSheet.current) {
      loginSheet.current.show();
      resetForm();
    }
  };

  return (
    <Animated.View
      style={[styles.container, { opacity: fadeAnim }, splashStyle]}
    >
      <Animated.View
        style={[
          {
            transform: [
              {
                translateY: imageAnim,
              },
            ],
          },
        ]}
      >
        <ImageBackground
          style={welcomeStyles(isDarkMode).imageBackground}
          source={require('../assets/logo.png')}
        />
      </Animated.View>

      <Animated.View
        style={[
          {
            transform: [
              {
                translateY: titleAnim,
              },
            ],
          },
        ]}
      >
        <Text style={welcomeStyles(isDarkMode).title}>OverApp</Text>
      </Animated.View>

      <Button
        title={t('common.enter')}
        scale={1.3}
        onPress={() => onEnterPress()}
      />

      <ActionSheet
        gestureEnabled={false}
        defaultOverlayOpacity={0.1}
        headerAlwaysVisible
        ref={loginSheet}
        containerStyle={[
          welcomeStyles(isDarkMode).actionSheetContainer,
          welcomeStyles(isDarkMode).loginSheet,
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
          onChangeText={handleLoginInput}
          cursorColor={COLORS.PRIMARY}
          selectionHandleColor={COLORS.PRIMARY}
          selectionColor={COLORS.PRIMARY}
          placeholderTextColor={COLORS.PRIMARY}
          placeholder={t('common.battleNet')}
          style={welcomeStyles(isDarkMode).input}
        />
        <View style={welcomeStyles(isDarkMode).reqContainer}>
          {requirements.map((req, index) => (
            <Text
              key={index}
              style={{ color: !req.meet ? COLORS.ERROR : COLORS.SUCCESS }}
            >
              {req.text}
            </Text>
          ))}
        </View>

        <Button
          customStyles={welcomeStyles(isDarkMode).customButton}
          disabled={!requirements.every(r => r.meet)}
          width={'90%'}
          title={t('common.enter')}
          onPress={() => handleLogin()}
        />
        <View style={welcomeStyles(isDarkMode).orContainer}>
          <Text style={welcomeStyles(isDarkMode).orText}>{t('common.or')}</Text>
        </View>
        <Button
          customStyles={[
            welcomeStyles(isDarkMode).customButton,
            {
              backgroundColor: battleNetBtnColor,
            },
          ]}
          width={'90%'}
          title={t('common.loginBN')}
          onPress={() => {}}
        />
      </ActionSheet>
    </Animated.View>
  );
}
const welcomeStyles = (isDarkMode: boolean) =>
  StyleSheet.create({
    imageBackground: {
      width: 200,
      height: 200,
    },
    title: {
      color: isDarkMode ? COLORS.WHITE : COLORS.PRIMARY,
      fontWeight: '700',
      fontSize: 32,
    },
    actionSheetContainer: {
      display: 'flex',
      backgroundColor: isDarkMode ? '#2d2d2d' : '#e2e2e2',
    },
    input: {
      width: '90%',
      padding: 10,
      margin: 10,
      backgroundColor: COLORS.WHITE,
      alignSelf: 'center',
      borderRadius: 6,
      borderWidth: 1,
      borderColor: COLORS.DARK.BACKGROUND,
    },
    reqContainer: {
      paddingLeft: 25,
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
      borderBottomColor: isDarkMode ? COLORS.WHITE : COLORS.DARK.BACKGROUND,
      position: 'relative',
    },
    orText: {
      color: isDarkMode ? COLORS.WHITE : COLORS.DARK.BACKGROUND,
      backgroundColor: isDarkMode ? '#2d2d2d' : '#e2e2e2',
      paddingHorizontal: 10,
      position: 'absolute',
      top: -10,
    },
  });
