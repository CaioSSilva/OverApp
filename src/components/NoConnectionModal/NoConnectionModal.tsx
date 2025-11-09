import React, { useEffect, useRef } from 'react';
import {
  Text,
  View,
  StyleSheet,
  Dimensions,
  useColorScheme,
} from 'react-native';
import NetInfo from '@react-native-community/netinfo';
import ActionSheet, { ActionSheetRef } from 'react-native-actions-sheet';
import { COLORS, getThemedStyles } from '../../styles/theme';
import { useTranslation } from 'react-i18next';
import { Linking, Platform } from 'react-native';
import Button from '../Button';

const { width } = Dimensions.get('screen');

const NoConnectionModal = () => {
  const modalRef = useRef<ActionSheetRef>(null);
  const isDarkMode = useColorScheme() === 'dark';
  const styles = noConnectionStyles(isDarkMode);
  const { t } = useTranslation();

  useEffect(() => {
    const checkInitialConnection = async () => {
      const state = await NetInfo.fetch();
      const connected =
        state.isConnected && (state.isInternetReachable ?? true);
      if (!connected) {
        modalRef.current?.show();
      }
    };

    checkInitialConnection();

    const unsubscribe = NetInfo.addEventListener(state => {
      const connected =
        state.isConnected && (state.isInternetReachable ?? true);
      if (!connected) {
        modalRef.current?.show();
      } else {
        modalRef.current?.hide();
      }
    });

    return () => unsubscribe();
  }, []);

  const openConnectionConfig = async () => {
    if (Platform.OS === 'ios') {
      await Linking.openSettings();
    } else {
      await Linking.sendIntent('android.settings.WIFI_SETTINGS');
    }
  };

  return (
    <ActionSheet
      gestureEnabled={false}
      closeOnPressBack={false}
      closeOnTouchBackdrop={false}
      closable={false}
      ref={modalRef}
      containerStyle={getThemedStyles(isDarkMode).sheet}
    >
      <View style={styles.sheetContent}>
        <Text style={getThemedStyles(isDarkMode).titleText}>{t('common.disconected')}</Text>
        <Text style={styles.messageText}>
          {t('errors.noInternet')}
          {'\n'}
          {t('errors.checkNetwork')}
        </Text>
        <Button
          title={t('errors.checkConnection')}
          scale={1.1}
          onPress={() => openConnectionConfig()}
        />
      </View>
    </ActionSheet>
  );
};

const noConnectionStyles = (isDarkMode: boolean) =>
  StyleSheet.create({
    sheetContent: {
      alignItems: 'center',
    },
    messageText: {
      fontSize: 16,
      color: isDarkMode ? COLORS.DARK.TEXT : COLORS.LIGHT.TEXT,
      textAlign: 'center',
      marginBottom: 20,
      lineHeight: 24,
      maxWidth: width * 0.85,
    },
  });

export default NoConnectionModal;
