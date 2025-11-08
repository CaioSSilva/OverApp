import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';
import ActionSheet, { ActionSheetRef } from 'react-native-actions-sheet';
import { COLORS, getThemedStyles, SPACING } from '../../styles/theme';
import BandContext from '../../contexts/BandContext';
import { locale } from '../../../i18n';
import Button from '../Button';
import { Share } from 'lucide-react-native';
import RNFS from 'react-native-fs';
import RNShare from 'react-native-share';
import Toast from 'react-native-toast-message';

interface HistorySheetProps {
  ref: React.RefObject<ActionSheetRef | null>;
}

enum BPMStatus {
  NORMAL = 'normal',
  ATTENTION = 'attention',
  CRITICAL = 'critical',
}

export default function HearthGraph({ ref }: HistorySheetProps) {
  const isDarkMode = useColorScheme() === 'dark';

  const { t } = useTranslation();

  const { bpmHistory } = useContext(BandContext);

  const formatNumberToLocaleDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleString(locale, {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const createSafeFileName = (baseName: string) => {
    return baseName
      .replace(/, /g, '-')
      .replace(/[^a-z0-9-]/gi, '_')
      .toLowerCase();
  };

  const handleHistoryFile = async (
    history: { value: number; timestamp: number }[],
  ) => {
    const fileName = `${t('pulseBand.history')} BPM - ${createSafeFileName(
      formatNumberToLocaleDate(Date.now()),
    )}.txt`;
    const path = `${RNFS.CachesDirectoryPath}/${fileName}`;

    let fileContent = `${t('pulseBand.history')}:\n\n`;

    history.forEach(entry => {
      fileContent += `${formatNumberToLocaleDate(entry.timestamp)} - ${
        entry.value
      } ${t('pulseBand.bpm').toUpperCase()}\n`;
    });

    try {
      await RNFS.writeFile(path, fileContent, 'utf8');
    } catch (e) {
      Toast.show({
        type: 'error',
        text1: t('pulseBand.unableToSaveFile'),
        text2: path,
      });
    }

    await RNShare.open({
      title: t('pulseBand.historyReady'),
      url: `file://${path}`,
      type: 'text/plain',
      subject: fileName,
    });
  };

  return (
    <ActionSheet
      containerStyle={getThemedStyles(isDarkMode).sheet}
      ref={ref}
      gestureEnabled={false}
    >
      <View style={styles(isDarkMode).sheetHeader}>
        <Text
          style={[
            getThemedStyles(isDarkMode).titleText,
            styles(isDarkMode).removeMv,
          ]}
        >
          {t('pulseBand.history')}
        </Text>

        <Button
          customStyles={styles(isDarkMode).shareIcon}
          onPress={async () => handleHistoryFile(bpmHistory)}
          icon={<Share size={20} color={COLORS.WHITE} />}
        />
      </View>
      <View style={styles(isDarkMode).historyContainer}>
        <ScrollView
          style={styles(isDarkMode).scrollView}
          contentContainerStyle={styles(isDarkMode).scrollViewContent}
          nestedScrollEnabled={true}
          showsVerticalScrollIndicator={false}
        >
          {bpmHistory.map((entry, index) => {
            return (
              <View key={index} style={styles(isDarkMode).historyItem}>
                <Text style={styles(isDarkMode).historyText}>
                  {formatNumberToLocaleDate(entry.timestamp)}
                </Text>
                <Text
                  style={[
                    styles(isDarkMode).historyText,
                    {
                      color:
                        validateBpmValue(entry.value) === BPMStatus.NORMAL
                          ? COLORS.SUCCESS
                          : validateBpmValue(entry.value) ===
                            BPMStatus.ATTENTION
                          ? COLORS.WARNING
                          : COLORS.ERROR,
                    },
                  ]}
                >
                  {entry.value} {t('pulseBand.bpm').toUpperCase()}
                </Text>
              </View>
            );
          })}
        </ScrollView>
      </View>
    </ActionSheet>
  );
}

const styles = (isDarkMode: boolean) =>
  StyleSheet.create({
    historyContainer: {
      paddingTop: 10,
      height: 300,
    },
    scrollView: {
      flex: 1,
    },
    scrollViewContent: {
      flexGrow: 1,
    },
    historyItem: {
      width: '100%',
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingVertical: 8,
      borderBottomWidth: 1,
      borderBottomColor: isDarkMode ? COLORS.DARK.BORDER : COLORS.LIGHT.BORDER,
    },
    historyText: {
      fontSize: 16,
      color: isDarkMode ? COLORS.DARK.TEXT : COLORS.LIGHT.TEXT,
    },
    sheetHeader: {
      paddingTop: SPACING.SM,
      width: Dimensions.get('screen').width - 20,
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
    },
    shareIcon: {
      top: 10,
      position: 'absolute',
      right: 0,
    },
    removeMv: {
      marginVertical: 0,
    },
  });

const validateBpmValue = (bpmValue: number): BPMStatus => {
  const isBpmNormal = bpmValue >= 40 && bpmValue <= 180;
  const isBpmOnAttention = bpmValue > 180 && bpmValue <= 200;
  const isBpmCritical = bpmValue > 200;

  if (isBpmNormal) {
    return BPMStatus.NORMAL;
  } else if (isBpmOnAttention) {
    return BPMStatus.ATTENTION;
  } else if (isBpmCritical) {
    return BPMStatus.CRITICAL;
  } else {
    return BPMStatus.NORMAL;
  }
};
