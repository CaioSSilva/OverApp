import React, { useCallback, useEffect, useState } from 'react';
import { FlatList, Text, useColorScheme, View } from 'react-native';
import { dataService } from '../hooks/data';
import { Hero } from '../interfaces/Hero.model';
import HeroCard from '../components/HeroCard/HeroCard';
import { useTranslation } from 'react-i18next';
import Button from '../components/Button';
import {
  CalcHeroTimesReturn,
  OverwatchProfileFullStats,
} from '../interfaces/Summary.model';
import { COLORS, getThemedStyles } from '../styles/theme';
import Skeleton from '../components/Skeleton';
import { IterationCw } from 'lucide-react-native';

export default function Characters() {
  const isDarkMode = useColorScheme() === 'dark';
  const { getHeroes } = dataService();
  const [heroes, setHeroes] = useState<Hero[]>([]);
  const [stats, setStats] = useState<OverwatchProfileFullStats | undefined>(
    undefined,
  );
  const { t } = useTranslation();

  const getHeroList = useCallback(() => dataService().getHeroes(), []);
  const getTimePlayed = useCallback(() => dataService().getProfileFull(), []);

  useEffect(() => {
    getTimePlayed().then(s => setStats(s.stats));
    getHeroList().then(setHeroes);
  }, [getHeroList, getTimePlayed]);

  function updateHeroes() {
    setHeroes([]);
    getHeroes().then(setHeroes);
    getTimePlayed().then(s => setStats(s.stats));
  }
  function calcHeroTimes(): CalcHeroTimesReturn {
    if (!stats) return { combinedTimes: [], sortedHeroes: [] };

    const platforms = ['pc', 'console'] as const;
    const modes = ['quickplay', 'competitive'] as const;

    const allTimeValues = platforms.flatMap(platform =>
      modes.flatMap(
        mode =>
          stats[platform]?.[mode]?.heroes_comparisons?.time_played?.values ||
          [],
      ),
    );

    const heroTimeMap = new Map<
      string,
      {
        totalTime: number;
        pcTime: number;
        consoleTime: number;
        pcQuickplayTime: number;
        pcCompetitiveTime: number;
        consoleQuickplayTime: number;
        consoleCompetitiveTime: number;
      }
    >();

    allTimeValues.forEach(({ hero, value }) => {
      if (!heroTimeMap.has(hero)) {
        heroTimeMap.set(hero, {
          totalTime: 0,
          pcTime: 0,
          consoleTime: 0,
          pcQuickplayTime: 0,
          pcCompetitiveTime: 0,
          consoleQuickplayTime: 0,
          consoleCompetitiveTime: 0,
        });
      }
      heroTimeMap.get(hero)!.totalTime += value;
    });

    platforms.forEach(platform => {
      modes.forEach(mode => {
        const values =
          stats[platform]?.[mode]?.heroes_comparisons?.time_played?.values ||
          [];
        values.forEach(({ hero, value }) => {
          const heroData = heroTimeMap.get(hero)!;
          const timeKey = `${platform}${
            mode === 'quickplay' ? 'Quickplay' : 'Competitive'
          }Time` as keyof typeof heroData;
          const platformKey = `${platform}Time` as keyof typeof heroData;

          (heroData[timeKey] as number) += value;
          (heroData[platformKey] as number) += value;
        });
      });
    });

    const combinedTimes = Array.from(heroTimeMap.entries()).map(
      ([hero, times]) => ({
        hero,
        ...times,
      }),
    );

    combinedTimes.sort((a, b) => b.totalTime - a.totalTime);

    const sortedHeroes = heroes.sort((a, b) => {
      const aTime = combinedTimes.find(ct => ct.hero === a.key)?.totalTime || 0;
      const bTime = combinedTimes.find(ct => ct.hero === b.key)?.totalTime || 0;
      return bTime - aTime;
    });

    return { combinedTimes, sortedHeroes };
  }

  const maxSize = calcHeroTimes().combinedTimes[0]?.totalTime;

  const findHeroTime = (heroKey: string) => {
    return stats
      ? calcHeroTimes().combinedTimes.find(ct => ct.hero === heroKey)
      : undefined;
  };

  return (
    <View style={getThemedStyles(isDarkMode).container}>
      <View style={getThemedStyles(isDarkMode).header}>
        <View>
          <Text
            style={[
              getThemedStyles(isDarkMode).text,
              getThemedStyles(isDarkMode).headerTitle,
            ]}
          >
            {t('characters.title')}
          </Text>
          <Text
            style={[
              getThemedStyles(isDarkMode).text,
              getThemedStyles(isDarkMode).headerSubtitle,
            ]}
          >
            {t('stats.gameTimeAll')}
          </Text>
        </View>

        <Button
          onPress={() => updateHeroes()}
          icon={<IterationCw size={20} color={COLORS.WHITE} />}
        />
      </View>
      {calcHeroTimes().sortedHeroes.length > 0 ? (
        <FlatList
          data={calcHeroTimes().sortedHeroes}
          keyExtractor={item => item.key || item.name}
          renderItem={({ item }) => (
            <HeroCard
              hero={item}
              time={findHeroTime(item.key)}
              maxSize={maxSize}
            />
          )}
          initialNumToRender={10}
          maxToRenderPerBatch={10}
          windowSize={5}
        />
      ) : (
        <Skeleton height={90} count={10} />
      )}
    </View>
  );
}
