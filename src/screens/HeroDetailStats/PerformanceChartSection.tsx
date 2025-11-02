import React, { useMemo } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { ProgressChart } from 'react-native-chart-kit';
import Skeleton from '../../components/Skeleton';
import { Info } from 'lucide-react-native';
import { getThemedStyles } from '../../styles/theme';
import Tooltip from 'rn-tooltip';
import { locale } from '../../../i18n';

const { width: screenWidth } = Dimensions.get('window');
const chartWidth = screenWidth - 40;

interface PerformanceChartSectionProps {
  performanceData: {
    labels: string[];
    data: number[];
    colors: string[];
  };
  chartConfig: any;
  sectionTitle: string;
  isDarkMode: boolean;
}

const PerformanceChartSection = React.memo<PerformanceChartSectionProps>(
  ({ performanceData, chartConfig, sectionTitle, isDarkMode }) => {
    const hasData = performanceData.data.some((val: number) => val > 0.01);
    const titleStyle = useMemo(
      () => ({
        ...styles.sectionTitle,
        marginBottom: 0,
        marginRight: 8,
        color: isDarkMode ? '#ffffff' : '#1f2937',
      }),
      [isDarkMode],
    );

    const legendTextStyle = useMemo(
      () => ({
        ...styles.legendText,
        color: '#fff',
      }),
      [isDarkMode],
    );

    const renderLegend = () => (
      <View>
        {performanceData.colors.map((color, idx) => (
          <View key={idx} style={styles.legendItem}>
            <View style={[styles.legendColorBox, { backgroundColor: color }]} />
            <Text style={legendTextStyle}>
              {performanceData.labels[idx]} -{' '}
              {Math.floor(performanceData.data[idx] * 100)}%
            </Text>
          </View>
        ))}
      </View>
    );
    
    if (!hasData) return <Skeleton height={220} />;

    return (
      <View style={styles.section}>
        <View>
          <View style={getThemedStyles(isDarkMode).row}>
            <Text style={titleStyle}>{sectionTitle}</Text>
            <Tooltip
              actionType="press"
              withOverlay={false}
              height={80}
              width={locale === 'pt' ? 200 : 160}
              popover={renderLegend()}
            >
              <Info color={'#fff'} style={styles.info} size={20} />
            </Tooltip>
          </View>
        </View>
        <View style={styles.chartContainer}>
          <View style={styles.progressChartWrapper}>
            <ProgressChart
              data={performanceData}
              width={chartWidth}
              height={200}
              strokeWidth={12}
              radius={28}
              chartConfig={chartConfig}
              hideLegend={true}
              style={styles.chart}
              withCustomBarColorFromData={true}
            />
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
  chartContainer: {
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 4,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 4,
    marginHorizontal: 4,
    overflow: 'hidden',
  },
  chart: {
    borderRadius: 8,
    marginVertical: 4,
  },
  progressChartWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  info: {
    backgroundColor: '#df6363',
    borderRadius: 10,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  legendColorBox: {
    height: 8,
    width: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  legendText: {
    fontSize: 12,
  },
});

export default PerformanceChartSection;
