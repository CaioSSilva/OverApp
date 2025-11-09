import { Fingerprint } from 'lucide-react-native';
import React, { useEffect, useRef } from 'react';
import { StyleSheet, useColorScheme, View } from 'react-native';
import { COLORS, getTheme, Theme } from '../styles/theme';
import Button from '../components/Button';
import { useTranslation } from 'react-i18next';
import { useBiometrics } from '../hooks/useBiometrics';

export default function Biometrics() {
const isDarkMode = useColorScheme() === 'dark';
const theme = getTheme(isDarkMode);
const { t } = useTranslation();
const { authenticate } = useBiometrics();
const hasAttempted = useRef(false);

  useEffect(() => {
    if (!hasAttempted.current) {
      hasAttempted.current = true;
      authenticate();
    }
  }, [authenticate]);

  return (
    <View style={styles(theme).container}>
      <View>
        <Fingerprint size={64} color={COLORS.PRIMARY}/>
      </View>

      <Button customStyles={styles(theme).finger} title={t('biometrics.authenticate')} onPress={authenticate} />
    </View>
  );
}

const styles = (theme: Theme) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  finger: {
    position: 'absolute',
    bottom: 100,
  },
});