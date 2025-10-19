import React, { useMemo } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { BarChart } from 'react-native-chart-kit';

const { width: screenWidth } = Dimensions.get('window');
const chartWidth = screenWidth - 40;

interface CombatChartSectionProps {
  chartData: any;
  chartConfig: any;
  sectionTitle: string;
  isDarkMode: boolean;
}

const CombatChartSection = React.memo<CombatChartSectionProps>(
  ({ chartData, chartConfig, sectionTitle, isDarkMode }) => {
    const hasData = chartData.datasets[0].data.some((val: number) => val > 0);
    const titleStyle = useMemo(
      () => ({
        ...styles.sectionTitle,
        color: isDarkMode ? '#ffffff' : '#1f2937',
      }),
      [isDarkMode],
    );

    if (!hasData) return null;

    return (
      <View style={styles.section}>
        <Text style={titleStyle}>{sectionTitle}</Text>
        <View style={styles.chartContainer}>
          <BarChart
            data={chartData}
            width={chartWidth}
            height={200}
            chartConfig={chartConfig}
            style={styles.chart}
            withCustomBarColorFromData={true}
            flatColor={true}
            showBarTops={false}
            yAxisLabel=""
            yAxisSuffix=""
            withInnerLines={false}
            showValuesOnTopOfBars={true}
            
            fromZero={true}
            horizontalLabelRotation={0}
            verticalLabelRotation={0}
          />
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
});

export default CombatChartSection;
