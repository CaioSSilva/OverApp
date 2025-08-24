import React, { useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';

interface SessionSummarySectionProps {
  summaryData: any;
  sectionTitle: string;
  isDarkMode: boolean;
}

const SessionSummarySection = React.memo<SessionSummarySectionProps>(
  ({ summaryData, sectionTitle, isDarkMode }) => {
    const { t } = useTranslation();
    const themeColors = useMemo(
      () => ({
        sectionTitle: isDarkMode ? '#ffffff' : '#1f2937',
        cardBg: isDarkMode ? '#1e1e1e' : '#f8f9fa',
        subtitle: isDarkMode ? '#9ca3af' : '#6b7280',
      }),
      [isDarkMode],
    );

    const titleStyle = useMemo(
      () => ({
        ...styles.sectionTitle,
        color: themeColors.sectionTitle,
      }),
      [themeColors.sectionTitle],
    );

    const cardStyle = useMemo(
      () => ({
        ...styles.summaryGrid,
        backgroundColor: themeColors.cardBg,
      }),
      [themeColors.cardBg],
    );

    const labelStyle = useMemo(
      () => ({
        ...styles.summaryLabel,
        color: themeColors.subtitle,
      }),
      [themeColors.subtitle],
    );

    return (
      <View style={styles.section}>
        <Text style={titleStyle}>{sectionTitle}</Text>
        <View style={cardStyle}>
          <View style={styles.summaryItem}>
            <Text style={labelStyle}>{t('winRate')}</Text>
            <Text
              style={[styles.summaryValue, { color: summaryData.winRateColor }]}
            >
              {summaryData.winRate.toFixed(1)}%
            </Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={labelStyle}>{t('kdRatio')}</Text>
            <Text
              style={[styles.summaryValue, { color: summaryData.kdRatioColor }]}
            >
              {summaryData.kdRatio}
            </Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={labelStyle}>{t('games')}</Text>
            <Text
              style={[styles.summaryValue, { color: themeColors.sectionTitle }]}
            >
              {summaryData.gamesPlayed}
            </Text>
          </View>
        </View>
      </View>
    );
  },
);

const styles = StyleSheet.create({
  section: {
    marginVertical: 4,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 10,
    paddingHorizontal: 4,
  },
  summaryGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderRadius: 8,
    padding: 15,
  },
  summaryItem: {
    alignItems: 'center',
  },
  summaryLabel: {
    fontSize: 12,
    marginBottom: 6,
    textAlign: 'center',
  },
  summaryValue: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default SessionSummarySection;
