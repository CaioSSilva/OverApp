import React, { useMemo } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { ProgressChart } from 'react-native-chart-kit';

const { width: screenWidth } = Dimensions.get('window');
const chartWidth = screenWidth - 40;

interface PerformanceChartSectionProps {
  performanceData: any;
  chartConfig: any;
  sectionTitle: string;
  isDarkMode: boolean;
}

const PerformanceChartSection = React.memo<PerformanceChartSectionProps>(({ 
  performanceData, 
  chartConfig, 
  sectionTitle, 
  isDarkMode 
}) => {
  const hasData = performanceData.data.some((val: number) => val > 0.01);
  const titleStyle = useMemo(() => ({
    ...styles.sectionTitle,
    color: isDarkMode ? '#ffffff' : '#1f2937'
  }), [isDarkMode]);
  
  if (!hasData) return null;

  return (
    <View style={styles.section}>
      <Text style={titleStyle}>{sectionTitle}</Text>
      <View style={styles.chartContainer}>
        <View style={styles.progressChartWrapper}>
          <ProgressChart
            data={performanceData}
            width={chartWidth}
            height={180}
            strokeWidth={12}
            radius={28}
            chartConfig={chartConfig}
            hideLegend={false}
            style={styles.chart}
            withCustomBarColorFromData={false}
          />
        </View>
      </View>
    </View>
  );
});

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
    alignItems: 'stretch',
    justifyContent: 'center',
    width: '97%',
  },
});

export default PerformanceChartSection;
