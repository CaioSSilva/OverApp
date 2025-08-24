import React, { useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Metric } from '../../interfaces/Details.model';
import StatCard from './StatCard';

interface MainSummarySectionProps {
  metrics: Metric[];
  isDarkMode: boolean;
  sectionTitle: string;
}

const MainSummarySection = React.memo<MainSummarySectionProps>(
  ({ metrics, isDarkMode, sectionTitle }) => {
    const titleStyle = useMemo(
      () => ({
        ...styles.sectionTitle,
        color: isDarkMode ? '#ffffff' : '#1f2937',
      }),
      [isDarkMode],
    );

    return (
      <View style={styles.section}>
        <Text style={titleStyle}>{sectionTitle}</Text>
        <View style={styles.cardsRow}>
          {metrics.slice(0, 2).map((metric, index) => (
            <StatCard
              key={`metric-${index}`}
              title={metric.title}
              value={metric.value}
              color={metric.color}
              icon={metric.icon}
              isDarkMode={isDarkMode}
            />
          ))}
        </View>
        {metrics.length > 2 && (
          <View style={styles.cardsRow}>
            {metrics.slice(2, 4).map((metric, index) => (
              <StatCard
                key={`metric-${index + 2}`}
                title={metric.title}
                value={metric.value}
                color={metric.color}
                icon={metric.icon}
                isDarkMode={isDarkMode}
              />
            ))}
          </View>
        )}
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
  cardsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
    paddingHorizontal: 6,
  },
});

export default MainSummarySection;
