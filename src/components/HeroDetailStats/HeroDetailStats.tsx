import React, { useMemo, useCallback } from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { ActionSheetHeroStatsProps, Category, Metric, Stat } from '../../interfaces/Details.model';

import HeroHeader from './HeroHeader';
import MainSummarySection from './MainSummarySection';
import CombatChartSection from './CombatChartSection';
import PerformanceChartSection from './PerformanceChartSection';
import CategoryStatsSection from './CategoryStatsSection';
import SessionSummarySection from './SessionSummarySection';

import { useStatsData, useFormatters, useStatIcon } from './hooks';

const ActionSheetHeroStats: React.FC<ActionSheetHeroStatsProps> = ({
  statsData,
  heroName = 'Hero',
  isDarkMode = false,
}) => {
  const { t } = useTranslation();
  const processedData = useStatsData(statsData, heroName);
  const formatters = useFormatters();
  const getStatIcon = useStatIcon();

  const getStatValue = useCallback(
    (category: string, key: string, defaultValue: number | string = 0): number | string => {
      const categoryData = processedData?.find((cat: Category) => cat.category === category);
      const stat = categoryData?.stats?.find((s: Stat) => s.key === key);
      return stat?.value || defaultValue;
    },
    [processedData],
  );

  const getCategoryStats = useCallback(
    (category: string): Stat[] => {
      const categoryData = processedData?.find((cat: Category) => cat.category === category);
      return categoryData?.stats || [];
    },
    [processedData],
  );

  const categoryStats = useMemo(() => ({
    combat: getCategoryStats('combat'),
    game: getCategoryStats('game'),
    assists: getCategoryStats('assists'),
  }), [getCategoryStats]);

  const mainMetrics = useMemo((): Metric[] => {
    const metrics: Metric[] = [];
    const { combat, game, assists } = categoryStats;

    const eliminations = combat.find((s: Stat) => s.key === 'eliminations');
    if (eliminations) {
      metrics.push({
        title: t('eliminations'),
        value: formatters.toNumber(eliminations.value),
        color: '#10B981',
        icon: getStatIcon('eliminations'),
      });
    }

    const damage = combat.find((s: Stat) => 
      s.key === 'all_damage_done' || s.key === 'damage_done' || s.key === 'hero_damage_done'
    );
    if (damage) {
      metrics.push({
        title: t('damage'),
        value: formatters.number(damage.value),
        color: '#EF4444',
        icon: getStatIcon('damage'),
      });
    }

    const accuracy = combat.find((s: Stat) => s.key === 'weapon_accuracy');
    const healing = assists.find((s: Stat) => s.key === 'healing_done');

    if (accuracy) {
      metrics.push({
        title: t('accuracy'),
        value: formatters.percentage(accuracy.value),
        color: '#3B82F6',
        icon: getStatIcon('weapon_accuracy'),
      });
    } else if (healing) {
      metrics.push({
        title: t('healing'),
        value: formatters.number(healing.value),
        color: '#10B981',
        icon: getStatIcon('healing_done'),
      });
    }

    const timePlayed = game.find((s: Stat) => s.key === 'time_played');
    if (timePlayed) {
      metrics.push({
        title: t('time'),
        value: formatters.time(timePlayed.value),
        color: '#8B5CF6',
        icon: getStatIcon('time_played'),
      });
    }

    return metrics;
  }, [categoryStats, formatters, getStatIcon, t]);

  const summaryData = useMemo(() => {
    const gamesPlayed = formatters.toNumber(getStatValue('game', 'games_played'));
    const gamesWon = formatters.toNumber(getStatValue('game', 'games_won')) || 
                     formatters.toNumber(getStatValue('game', 'hero_wins', 0));
    const winRate = gamesPlayed > 0 ? (gamesWon / gamesPlayed) * 100 : 0;

    const eliminations = formatters.toNumber(getStatValue('combat', 'eliminations'));
    const deaths = Math.max(formatters.toNumber(getStatValue('combat', 'deaths')), 1);
    const kdRatio = (eliminations / deaths).toFixed(2);

    return {
      gamesPlayed,
      winRate,
      kdRatio,
      winRateColor: winRate >= 50 ? '#10B981' : '#EF4444',
      kdRatioColor: parseFloat(kdRatio) >= 1 ? '#10B981' : '#EF4444',
    };
  }, [getStatValue, formatters]);

  const chartConfig = useMemo(() => ({
    backgroundColor: isDarkMode ? '#2d2d2d' : '#ffffff',
    backgroundGradientFrom: isDarkMode ? '#2d2d2d' : '#ffffff',
    backgroundGradientTo: isDarkMode ? '#1e1e1e' : '#f8f9fa',
    decimalPlaces: 0,
    color: (opacity = 1) => isDarkMode 
      ? `rgba(156, 163, 175, ${opacity})` 
      : `rgba(59, 130, 246, ${opacity})`,
    labelColor: (opacity = 1) => isDarkMode 
      ? `rgba(255, 255, 255, ${opacity})` 
      : `rgba(51, 51, 51, ${opacity})`,
    style: { borderRadius: 16 },
    propsForLabels: { fontSize: 10, fontWeight: '400' },
    propsForBackgroundLines: {
      strokeWidth: 1,
      stroke: isDarkMode ? '#404040' : '#e5e7eb'
    },
    barPercentage: 0.8,
    fillShadowGradient: isDarkMode ? '#404040' : '#f3f4f6',
    fillShadowGradientOpacity: 0.2,
  }), [isDarkMode]);

  const combatChartData = useMemo(() => {
    const eliminations = formatters.toNumber(getStatValue('combat', 'eliminations'));
    const deaths = formatters.toNumber(getStatValue('combat', 'deaths'));
    const finalBlows = formatters.toNumber(getStatValue('combat', 'final_blows'));
    const assists = formatters.toNumber(getStatValue('assists', 'assists')) || 
                   formatters.toNumber(getStatValue('combat', 'assists', 0));

    return {
      labels: [t('eliminations_short'), t('deaths'), t('final_blows'), t('assists')],
      datasets: [{
        data: [eliminations, deaths, finalBlows, assists],
        colors: [
          () => '#10B981',
          () => '#EF4444', 
          () => '#F59E0B',
          () => '#8B5CF6',
        ],
      }],
    };
  }, [getStatValue, formatters, t]);

  const performanceData = useMemo(() => {
    const accuracy = formatters.toNumber(getStatValue('combat', 'weapon_accuracy'));
    const eliminations = formatters.toNumber(getStatValue('combat', 'eliminations'));
    const deaths = Math.max(formatters.toNumber(getStatValue('combat', 'deaths')), 1);
    const objectiveTime = formatters.toNumber(getStatValue('combat', 'objective_time'));
    const kdRatio = eliminations / deaths;

    return {
      labels: [t('accuracy'), t('kd'), t('objective')],
      data: [
        Math.min(Math.max(accuracy / 100, 0.01), 1),
        Math.min(Math.max(kdRatio / 3, 0.01), 1),
        Math.min(Math.max(objectiveTime / 120, 0.01), 1),
      ],
      colors: ['#FF6B6B', '#4ECDC4', '#45B7D1'],
    };
  }, [getStatValue, formatters, t]);

  return (
    <ScrollView
      style={styles.scrollView}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.scrollContent}
    >
      <HeroHeader heroName={heroName} isDarkMode={isDarkMode} />
      
      <MainSummarySection 
        metrics={mainMetrics} 
        isDarkMode={isDarkMode} 
        sectionTitle={t('mainSummary')} 
      />

      <CombatChartSection
        chartData={combatChartData}
        chartConfig={chartConfig}
        sectionTitle={t('combatStats')}
        isDarkMode={isDarkMode}
      />

      <PerformanceChartSection
        performanceData={performanceData}
        chartConfig={chartConfig}
        sectionTitle={t('generalPerformance')}
        isDarkMode={isDarkMode}
      />

      <CategoryStatsSection
        categories={processedData}
        formatters={formatters}
        getStatIcon={getStatIcon}
        isDarkMode={isDarkMode}
      />

      <SessionSummarySection
        summaryData={summaryData}
        sectionTitle={t('sessionSummary')}
        isDarkMode={isDarkMode}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    paddingHorizontal: 6,
  },
  scrollContent: {
    paddingBottom: 30,
  },
});

export default ActionSheetHeroStats;
