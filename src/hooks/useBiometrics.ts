import { useContext, useState } from 'react';
import { isSensorAvailable, simplePrompt } from '@sbaiahmed1/react-native-biometrics';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';
import { useTranslation } from 'react-i18next';
import { AppContext } from '../contexts/AppContext';

export const useBiometrics = () => {
  const { Authenticated, setAuthenticated } = useContext(AppContext);
  const [biometryActive, setBiometryActive] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { t } = useTranslation();

  const checkBiometricSupport = async () => {
    try {
      const sensorInfo = await isSensorAvailable();
      return sensorInfo.available;
    } catch (error) {
      return false;
    }
  };

  const authenticate = async () => {
    setIsLoading(true);
    try {
      const sensorInfo = await isSensorAvailable();

      if (!sensorInfo.available) {
        return { success: false, error: 'Biometric authentication not available' };
      }

      const result = await simplePrompt(t('biometrics.authenticate'));

      if (result) {
        await AsyncStorage.setItem('authenticated', 'true');
        await AsyncStorage.setItem('biometryActive', 'true');
        setAuthenticated(true);
        return { success: true };
      }

      Toast.show({
        type: 'error',
        text1: t('biometrics.error'),
        text2: t('biometrics.cancelled'),
      });
      return { success: false, error: t('biometrics.cancelled') };
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: t('biometrics.error'),
        text2: t('biometrics.failed'),
      });
      return { success: false, error: t('biometrics.failed') };
    } finally {
      setIsLoading(false);
    }
  };

  return {
    Authenticated,
    isLoading,
    authenticate,
    checkBiometricSupport,
    biometryActive,
    setBiometryActive,
  };
};
