import React, { useMemo, useCallback } from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import {
  ActionSheetHeroStatsProps,
  Category,
  Metric,
  Stat,
} from '../../interfaces/Details.model';

import HeroHeader from './HeroHeader';
import MainSummarySection from './MainSummarySection';
import CombatChartSection from './CombatChartSection';
import PerformanceChartSection from './PerformanceChartSection';
import CategoryStatsSection from './CategoryStatsSection';
import SessionSummarySection from './SessionSummarySection';
import { COLORS } from '../../styles/theme';
import { useStatIcon } from '../../hooks/useStatIcon';
import { useStatsData } from '../../hooks/useStatsData';
import { useFormatters } from '../../hooks/useFormatters';

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
    (
      category: string,
      key: string,
      defaultValue: number | string = 0,
    ): number | string => {
      const categoryData = processedData?.find(
        (cat: Category) => cat.category === category,
      );
      const stat = categoryData?.stats?.find((s: Stat) => s.key === key);
      return stat?.value || defaultValue;
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

  const categoryStats = useMemo(
    () => ({
      combat: getCategoryStats('combat'),
      game: getCategoryStats('game'),
      assists: getCategoryStats('assists'),
    }),
    [getCategoryStats],
  );

  const mainMetrics = useMemo((): Metric[] => {
    const metrics: Metric[] = [];
    const { combat, game, assists } = categoryStats;

    const eliminations = combat.find((s: Stat) => s.key === 'eliminations');
    if (eliminations) {
      metrics.push({
        title: t('stats.eliminations'),
        value: formatters.number(eliminations.value),
        color: COLORS.SUCCESS,
        icon: getStatIcon('eliminations'),
      });
    }

    const damage = combat.find(
      (s: Stat) =>
        s.key === 'all_damage_done' ||
        s.key === 'damage_done' ||
        s.key === 'hero_damage_done',
    );
    if (damage) {
      metrics.push({
        title: t('characters.damage'),
        value: formatters.number(damage.value),
        color: COLORS.ERROR,
        icon: getStatIcon('damage'),
      });
    }

    const accuracy = combat.find((s: Stat) => s.key === 'weapon_accuracy');
    const healing = assists.find((s: Stat) => s.key === 'healing_done');

    if (accuracy) {
      metrics.push({
        title: t('stats.accuracy'),
        value: formatters.percentage(accuracy.value),
        color: COLORS.INFO,
        icon: getStatIcon('weapon_accuracy'),
      });
    } else if (healing) {
      metrics.push({
        title: t('stats.healing'),
        value: formatters.number(healing.value),
        color: COLORS.SUCCESS,
        icon: getStatIcon('healing_done'),
      });
    }

    const timePlayed = game.find((s: Stat) => s.key === 'time_played');
    if (timePlayed) {
      metrics.push({
        title: t('common.time'),
        value: formatters.time(timePlayed.value),
        color: '#8B5CF6',
        icon: getStatIcon('time_played'),
      });
    }

    return metrics;
  }, [categoryStats, formatters, getStatIcon, t]);

  const summaryData = useMemo(() => {
    const gamesPlayed = formatters.toNumber(
      getStatValue('game', 'games_played'),
    );
    const gamesWon =
      formatters.toNumber(getStatValue('game', 'games_won')) ||
      formatters.toNumber(getStatValue('game', 'hero_wins', 0));
    const winRate = gamesPlayed > 0 ? (gamesWon / gamesPlayed) * 100 : 0;

    const eliminations = formatters.toNumber(
      getStatValue('combat', 'eliminations'),
    );
    const deaths = Math.max(
      formatters.toNumber(getStatValue('combat', 'deaths')),
      1,
    );
    const kdRatio = (eliminations / deaths).toFixed(2);

    return {
      gamesPlayed,
      winRate,
      kdRatio,
      winRateColor: winRate >= 50 ? COLORS.SUCCESS : COLORS.ERROR,
      kdRatioColor: parseFloat(kdRatio) >= 1 ? COLORS.SUCCESS : COLORS.ERROR,
    };
  }, [getStatValue, formatters]);

  const chartConfig = useMemo(
    () => ({
      backgroundColor: isDarkMode ? COLORS.DARK.BACKGROUND : COLORS.WHITE,
      backgroundGradientFrom: isDarkMode
        ? COLORS.DARK.BACKGROUND
        : COLORS.WHITE,
      backgroundGradientTo: isDarkMode
        ? COLORS.DARK.CARD
        : COLORS.LIGHT.BACKGROUND,
      decimalPlaces: 0,
      color: (opacity = 1) =>
        isDarkMode
          ? `rgba(226, 226, 226, ${opacity})`
          : `rgba(33, 150, 243, ${opacity})`,
      labelColor: (opacity = 1) =>
        isDarkMode
          ? `rgba(226, 226, 226, ${opacity})`
          : `rgba(21, 21, 21, ${opacity})`,
      style: { borderRadius: 16 },
      propsForLabels: { fontSize: 10, fontWeight: '400' },
      propsForBackgroundLines: {
        strokeWidth: 1,
        stroke: isDarkMode ? COLORS.DARK.BORDER : COLORS.LIGHT.BORDER,
      },
      barPercentage: 0.8,
      fillShadowGradient: isDarkMode ? COLORS.DARK.BORDER : COLORS.LIGHT.BORDER,
      fillShadowGradientOpacity: 0.2,
      formatYLabel: (yValue: string) => formatters.number(yValue),
      formatXLabel: (xValue: string) => xValue,
      formatTopBarValue: (value: number) => formatters.number(value),
    }),
    [isDarkMode, formatters],
  );

  const combatChartData = useMemo(() => {
    const eliminations = formatters.toNumber(
      getStatValue('combat', 'eliminations'),
    );
    const deaths = formatters.toNumber(getStatValue('combat', 'deaths'));
    const finalBlows = formatters.toNumber(
      getStatValue('combat', 'final_blows'),
    );
    const assists =
      formatters.toNumber(getStatValue('assists', 'assists')) ||
      formatters.toNumber(getStatValue('combat', 'assists', 0));

    return {
      labels: [
        t('stats.eliminations_short'),
        t('stats.deaths'),
        t('stats.final_blows'),
        t('stats.assists'),
      ],
      datasets: [
        {
          data: [eliminations, deaths, finalBlows, assists],
          colors: [
            () => COLORS.SUCCESS,
            () => COLORS.ERROR,
            () => COLORS.WARNING,
            () => '#8B5CF6',
          ],
        },
      ],
    };
  }, [getStatValue, formatters, t]);

  const performanceData = useMemo(() => {
    const accuracy = formatters.toNumber(
      getStatValue('combat', 'weapon_accuracy'),
    );
    const eliminations = formatters.toNumber(
      getStatValue('combat', 'eliminations'),
    );
    const deaths = Math.max(
      formatters.toNumber(getStatValue('combat', 'deaths')),
      1,
    );
    const objectiveTime = formatters.toNumber(
      getStatValue('combat', 'objective_time'),
    );
    const kdRatio = eliminations / deaths;

    return {
      labels: [t('stats.accuracy'), t('stats.kd'), t('stats.objective')],
      data: [
        Math.min(Math.max(accuracy / 100, 0.01), 1),
        Math.min(Math.max(kdRatio / 3, 0.01), 1),
        Math.min(Math.max(objectiveTime / 120, 0.01), 1),
      ],
      colors: [COLORS.ERROR, COLORS.SUCCESS, COLORS.INFO],
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
        sectionTitle={t('stats.mainSummary')}
      />

      <CombatChartSection
        chartData={combatChartData}
        chartConfig={chartConfig}
        sectionTitle={t('stats.combatStats')}
        isDarkMode={isDarkMode}
      />

      <PerformanceChartSection
        performanceData={performanceData}
        chartConfig={chartConfig}
        sectionTitle={t('stats.generalPerformance')}
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
        sectionTitle={t('stats.sessionSummary')}
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
