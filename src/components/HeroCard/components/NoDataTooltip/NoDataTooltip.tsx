import { StyleSheet, Text, useColorScheme, View } from 'react-native';
import { COLORS, getThemedStyles } from '../../../../styles/theme';
import { Info } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import Tooltip from 'rn-tooltip';

export default function NoDataTooltip() {
  const { t } = useTranslation();
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <View style={styles.noStatsContainer}>
      <Text style={getThemedStyles(isDarkMode).text}>{t('common.noData')}</Text>
      <Tooltip
        actionType="press"
        popover={<Text style={[getThemedStyles(isDarkMode).text, {color: COLORS.WHITE}]}>{t('stats.noStats')}</Text>}
        backgroundColor={COLORS.PRIMARY}
        width={200}
        height={100}
        withOverlay={false}
      >
        <Info color={'#fff'} style={styles.info} size={20} />
      </Tooltip>
    </View>
  );
}

export const styles = StyleSheet.create({
  noStatsContainer: {
    flexDirection: 'row',
    gap: 6,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  info: {
    backgroundColor: '#df6363',
    borderRadius: 10,
  },
});
