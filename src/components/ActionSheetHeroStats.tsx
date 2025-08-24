import React, { useMemo, useCallback } from 'react';
import { View, Text, ScrollView, Dimensions, StyleSheet } from 'react-native';
import { BarChart, ProgressChart } from 'react-native-chart-kit';
import { useTranslation } from 'react-i18next';
import { ActionSheetHeroStatsProps, Category, Metric, Stat, StatCardProps } from '../interfaces/Details.model';

const { width: screenWidth } = Dimensions.get('window');
const chartWidth = screenWidth - 40;

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  color = '#3B82F6',
  icon,
  isDarkMode = false,
}) => {
  const cardBackgroundColor = isDarkMode ? '#1e1e1e' : '#ffffff';
  const titleColor = isDarkMode ? '#9ca3af' : '#6b7280';
  const subtitleColor = isDarkMode ? '#6b7280' : '#9ca3af';

  return (
    <View
      style={[
        styles.card,
        {
          borderLeftColor: color,
          backgroundColor: cardBackgroundColor,
        },
      ]}
    >
      <View style={styles.cardHeader}>
        <Text style={[styles.cardTitle, { color: titleColor }]}>{title}</Text>
        {icon && <Text style={styles.cardIcon}>{icon}</Text>}
      </View>
      <Text style={[styles.cardValue, { color }]}>{value}</Text>
      {subtitle && (
        <Text style={[styles.cardSubtitle, { color: subtitleColor }]}>
          {subtitle}
        </Text>
      )}
    </View>
  );
};

const ActionSheetHeroStats: React.FC<ActionSheetHeroStatsProps> = ({
  statsData,
  heroName = 'Hero',
  isDarkMode = false,
}) => {
  const { t } = useTranslation();

  const toNumber = useCallback((value: string | number): number => {
    if (typeof value === 'number') return value;
    const parsed = parseFloat(value as string);
    return isNaN(parsed) ? 0 : parsed;
  }, []);

  const formatters = useMemo(
    () => ({
      number: (num: string | number): string => {
        const numValue = toNumber(num);
        if (numValue >= 1000000) return (numValue / 1000000).toFixed(1) + 'M';
        if (numValue >= 1000) return (numValue / 1000).toFixed(1) + 'K';
        return numValue.toString();
      },
      time: (seconds: string | number): string => {
        const numSeconds = toNumber(seconds);
        if (!numSeconds) return '0:00';
        const mins = Math.floor(numSeconds / 60);
        const secs = numSeconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
      },
      percentage: (value: string | number): string => {
        return typeof value === 'number' ? `${value}%` : `${value}`;
      },
    }),
    [toNumber],
  );

  const getStatIcon = useCallback((key: string): string => {
    const iconMap: Record<string, string> = {
      eliminations: '🎯',
      deaths: '💀',
      final_blows: '⚔️',
      all_damage_done: '💥',
      damage_done: '💥',
      hero_damage_done: '⚡',
      weapon_accuracy: '🏹',
      time_played: '⏰',
      games_played: '🎮',
      games_won: '🏆',
      assists: '🤝',
      healing_done: '💚',
      default: '📊',
    };

    for (const [keyword, icon] of Object.entries(iconMap)) {
      if (key.includes(keyword)) {
        return icon;
      }
    }
    return iconMap.default;
  }, []);

  const processedData = useMemo(() => {
    let data = statsData;
    if (
      statsData &&
      typeof statsData === 'object' &&
      !Array.isArray(statsData)
    ) {
      const heroKeys = Object.keys(statsData);
      if (heroKeys.length > 0) {
        const targetHero = heroKeys.includes(heroName.toLowerCase())
          ? heroName.toLowerCase()
          : heroKeys[0];
        data = statsData[targetHero];
      }
    }
    console.log('Final processed data:', data);
    return data as Category[];
  }, [statsData, heroName]);

  const getStatValue = useCallback(
    (
      category: string,
      key: string,
      defaultValue: number | string = 0,
    ): number | string => {
      const categoryData = processedData?.find(
        (cat: Category) => cat.category === category,
      );
      const stat = categoryData?.stats?.find((s: Stat) => s.key === key);
      const value = stat?.value || defaultValue;
      return value;
    },
    [processedData],
  );

  const getCategoryStats = useCallback(
    (category: string): Stat[] => {
      const categoryData = processedData?.find(
        (cat: Category) => cat.category === category,
      );
      return categoryData?.stats || [];
    },
    [processedData],
  );

  const combatStats = useMemo(
    () => getCategoryStats('combat'),
    [getCategoryStats],
  );
  const gameStats = useMemo(() => getCategoryStats('game'), [getCategoryStats]);
  const assistsStats = useMemo(
    () => getCategoryStats('assists'),
    [getCategoryStats],
  );

  const getMainMetrics = useMemo((): Metric[] => {
    const metrics: Metric[] = [];

    const eliminations = combatStats.find(
      (s: Stat) => s.key === 'eliminations',
    );
    if (eliminations)
      metrics.push({
        title: t('eliminations'),
        value: toNumber(eliminations.value),
        color: '#10B981',
        icon: getStatIcon('eliminations'),
      });

    const damage = combatStats.find(
      (s: Stat) =>
        s.key === 'all_damage_done' ||
        s.key === 'damage_done' ||
        s.key === 'hero_damage_done',
    );
    if (damage)
      metrics.push({
        title: t('damage'),
        value: formatters.number(damage.value),
        color: '#EF4444',
        icon: getStatIcon('damage'),
      });

    const accuracy = combatStats.find((s: Stat) => s.key === 'weapon_accuracy');
    const healing = assistsStats.find((s: Stat) => s.key === 'healing_done');

    if (accuracy)
      metrics.push({
        title: t('accuracy'),
        value: formatters.percentage(accuracy.value),
        color: '#3B82F6',
        icon: getStatIcon('weapon_accuracy'),
      });
    else if (healing)
      metrics.push({
        title: t('healing'),
        value: formatters.number(healing.value),
        color: '#10B981',
        icon: getStatIcon('healing_done'),
      });

    const timePlayed = gameStats.find((s: Stat) => s.key === 'time_played');
    if (timePlayed)
      metrics.push({
        title: t('time'),
        value: formatters.time(timePlayed.value),
        color: '#8B5CF6',
        icon: getStatIcon('time_played'),
      });

    return metrics;
  }, [combatStats, assistsStats, gameStats, toNumber, formatters, getStatIcon, t]);

  const summaryData = useMemo(() => {
    const gamesPlayed = toNumber(getStatValue('game', 'games_played'));
    const gamesWon =
      toNumber(getStatValue('game', 'games_won')) ||
      toNumber(getStatValue('game', 'hero_wins', 0));
    const winRate = gamesPlayed > 0 ? (gamesWon / gamesPlayed) * 100 : 0;

    const eliminations = toNumber(getStatValue('combat', 'eliminations'));
    const deaths = Math.max(toNumber(getStatValue('combat', 'deaths')), 1);
    const kdRatio = (eliminations / deaths).toFixed(2);

    const winRateColor = winRate >= 50 ? '#10B981' : '#EF4444';
    const kdRatioColor = parseFloat(kdRatio) >= 1 ? '#10B981' : '#EF4444';

    return {
      gamesPlayed,
      winRate,
      kdRatio,
      winRateColor,
      kdRatioColor,
    };
  }, [getStatValue, toNumber]);

  const chartConfig = useMemo(
    () => ({
      backgroundColor: isDarkMode ? '#2d2d2d' : '#ffffff',
      backgroundGradientFrom: isDarkMode ? '#2d2d2d' : '#ffffff',
      backgroundGradientTo: isDarkMode ? '#1e1e1e' : '#f8f9fa',
      decimalPlaces: 0,
      color: (opacity = 1) =>
        isDarkMode
          ? `rgba(156, 163, 175, ${opacity})`
          : `rgba(59, 130, 246, ${opacity})`,
      labelColor: (opacity = 1) =>
        isDarkMode
          ? `rgba(255, 255, 255, ${opacity})`
          : `rgba(51, 51, 51, ${opacity})`,
      style: { 
        borderRadius: 16,
      },
      propsForLabels: { 
        fontSize: 10,
        fontWeight: '400',
      },
      propsForBackgroundLines: {
        strokeWidth: 1,
        stroke: isDarkMode ? '#404040' : '#e5e7eb'
      },
      barPercentage: 0.8,
      fillShadowGradient: isDarkMode ? '#404040' : '#f3f4f6',
      fillShadowGradientOpacity: 0.2,
    }),
    [isDarkMode],
  );

  const combatChartData = useMemo(() => {
    const eliminations = toNumber(getStatValue('combat', 'eliminations'));
    const deaths = toNumber(getStatValue('combat', 'deaths'));
    const finalBlows = toNumber(getStatValue('combat', 'final_blows'));
    const assists =
      toNumber(getStatValue('assists', 'assists')) ||
      toNumber(getStatValue('combat', 'assists', 0));

    console.log('Combat chart stats:', {
      eliminations,
      deaths,
      finalBlows,
      assists,
    });

    return {
      labels: [t('eliminations_short'), t('deaths'), t('final_blows'), t('assists')],
      datasets: [
        {
          data: [eliminations, deaths, finalBlows, assists],
          colors: [
            () => '#10B981',
            () => '#EF4444',
            () => '#F59E0B',
            () => '#8B5CF6',
          ],
        },
      ],
    };
  }, [getStatValue, toNumber, t]);

  const performanceData = useMemo(() => {
    const accuracy = toNumber(getStatValue('combat', 'weapon_accuracy'));
    const eliminations = toNumber(getStatValue('combat', 'eliminations'));
    const deaths = Math.max(toNumber(getStatValue('combat', 'deaths')), 1);
    const objectiveTime = toNumber(getStatValue('combat', 'objective_time'));

    const kdRatio = eliminations / deaths;

    return {
      labels: [t('accuracy'), 'K/D', t('objective')],
      data: [
        Math.min(Math.max(accuracy / 100, 0.01), 1),
        Math.min(Math.max(kdRatio / 3, 0.01), 1),
        Math.min(Math.max(objectiveTime / 120, 0.01), 1),
      ],
      colors: ['#FF6B6B', '#4ECDC4', '#45B7D1'],
    };
  }, [getStatValue, toNumber, t]);

  const themeColors = useMemo(
    () => ({
      container: isDarkMode ? '#2d2d2d' : '#ffffff',
      noDataText: isDarkMode ? '#9ca3af' : '#6b7280',
      header: isDarkMode ? '#1e1e1e' : '#667eea',
      sectionTitle: isDarkMode ? '#ffffff' : '#1f2937',
      cardBg: isDarkMode ? '#1e1e1e' : '#f8f9fa',
      borderBottom: isDarkMode ? '#404040' : '#e5e7eb',
      label: isDarkMode ? '#ffffff' : '#374151',
      subtitle: isDarkMode ? '#9ca3af' : '#6b7280',
    }),
    [isDarkMode],
  );

  const mainMetrics = getMainMetrics;

  return (
    <ScrollView
      style={styles.scrollView}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.scrollContent}
    >
      <View
        style={[styles.heroHeader, { backgroundColor: themeColors.header }]}
      >
        <Text style={styles.heroTitle}>{heroName}</Text>
      </View>

      <View style={styles.section}>
        <Text
          style={[styles.sectionTitle, { color: themeColors.sectionTitle }]}
        >
          {t('mainSummary')}
        </Text>
        <View style={styles.cardsRow}>
          {mainMetrics.slice(0, 2).map((metric: Metric, index: number) => (
            <StatCard
              key={index}
              title={metric.title}
              value={metric.value}
              color={metric.color}
              icon={metric.icon}
              isDarkMode={isDarkMode}
            />
          ))}
        </View>
        {mainMetrics.length > 2 && (
          <View style={styles.cardsRow}>
            {mainMetrics.slice(2, 4).map((metric: Metric, index: number) => (
              <StatCard
                key={index + 2}
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

      {combatChartData.datasets[0].data.some((val: number) => val > 0) && (
        <View style={styles.section}>
          <Text
            style={[styles.sectionTitle, { color: themeColors.sectionTitle }]}
          >
            {t('combatStats')}
          </Text>
          <View style={styles.chartContainer}>
            <BarChart
              data={combatChartData}
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
              showValuesOnTopOfBars={false}
              fromZero={true}
              horizontalLabelRotation={0}
              verticalLabelRotation={0}
            />
          </View>
        </View>
      )}

      {performanceData.data.some((val: number) => val > 0.01) && (
        <View style={styles.section}>
          <Text
            style={[styles.sectionTitle, { color: themeColors.sectionTitle }]}
          >
            {t('generalPerformance')}
          </Text>
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
      )}

      {processedData.map((category: Category, categoryIndex: number) => {
        const statsToShow = category.stats.slice(0, 6);
        if (statsToShow.length === 0) return null;

        const sectionTitle =
          category.label === 'Hero Specific'
            ? t('specialSkills')
            : category.label === 'Best'
            ? t('bestPerformances')
            : category.label === 'Average'
            ? t('averages')
            : category.label || category.category;

        return (
          <View key={categoryIndex} style={styles.section}>
            <Text
              style={[styles.sectionTitle, { color: themeColors.sectionTitle }]}
            >
              {sectionTitle}
            </Text>
            <View
              style={[
                styles.specialStats,
                { backgroundColor: themeColors.cardBg },
              ]}
            >
              {statsToShow.map((stat: Stat, statIndex: number) => (
                <View
                  key={statIndex}
                  style={[
                    styles.specialStatRow,
                    { borderBottomColor: themeColors.borderBottom },
                  ]}
                >
                  <Text
                    style={[
                      styles.specialStatLabel,
                      { color: themeColors.label },
                    ]}
                  >
                    {getStatIcon(stat.key)} {stat.label}
                  </Text>
                  <Text style={styles.specialStatValue}>
                    {typeof stat.value === 'number'
                      ? formatters.number(stat.value)
                      : stat.value}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        );
      })}

      <View style={styles.section}>
        <Text
          style={[styles.sectionTitle, { color: themeColors.sectionTitle }]}
        >
          {t('sessionSummary')}
        </Text>
        <View
          style={[styles.summaryGrid, { backgroundColor: themeColors.cardBg }]}
        >
          <View style={styles.summaryItem}>
            <Text
              style={[styles.summaryLabel, { color: themeColors.subtitle }]}
            >
              {t('winRate')}
            </Text>
            <Text
              style={[styles.summaryValue, { color: summaryData.winRateColor }]}
            >
              {summaryData.winRate.toFixed(1)}%
            </Text>
          </View>
          <View style={styles.summaryItem}>
            <Text
              style={[styles.summaryLabel, { color: themeColors.subtitle }]}
            >
              {t('kdRatio')}
            </Text>
            <Text
              style={[styles.summaryValue, { color: summaryData.kdRatioColor }]}
            >
              {summaryData.kdRatio}
            </Text>
          </View>
          <View style={styles.summaryItem}>
            <Text
              style={[styles.summaryLabel, { color: themeColors.subtitle }]}
            >
              {t('games')}
            </Text>
            <Text
              style={[styles.summaryValue, { color: themeColors.sectionTitle }]}
            >
              {summaryData.gamesPlayed}
            </Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  heroHeader: {
    padding: 12,
    alignItems: 'center',
    borderRadius: 8,
    marginHorizontal: 8,
    marginTop: 8,
    marginBottom: 12,
  },
  heroTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
  },
  scrollView: {
    paddingHorizontal: 6,
  },
  scrollContent: {
    paddingBottom: 30,
  },
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
  card: {
    borderRadius: 8,
    padding: 10,
    flex: 0.48,
    borderLeftWidth: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  cardTitle: {
    fontSize: 11,
    fontWeight: '600',
  },
  cardIcon: {
    fontSize: 12,
  },
  cardValue: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  cardSubtitle: {
    fontSize: 9,
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
  specialStats: {
    borderRadius: 8,
    padding: 12,
  },
  specialStatRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
  },
  specialStatLabel: {
    fontSize: 14,
    fontWeight: '500',
    flex: 1,
  },
  specialStatValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#3B82F6',
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

export default ActionSheetHeroStats;
