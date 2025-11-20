import React, { useEffect, useState } from 'react';
import { dataService } from './data';
import { Earth, Joystick, Monitor } from 'lucide-react-native';
import { Hero } from '../interfaces/Hero.model';
import {
  CalcHeroTimesReturn,
  OverwatchProfileFullStats,
} from '../interfaces/Summary.model';

export default function useHeroesData(
  User: { name?: string } | undefined | null,
) {
  const { getHeroes } = dataService();
  const [heroes, setHeroes] = useState<Hero[]>([]);
  const [stats, setStats] = useState<OverwatchProfileFullStats | undefined>(undefined);
  const [isSortedAsc, setIsSortedAsc] = useState(true);
  const [selectedPlatform, setSelectedPlatform] = useState<'all' | 'pc' | 'console'>('all');

  useEffect(() => {
    dataService()
      .getProfileFull(User?.name)
      .then(s => setStats(s.stats));
    dataService()
      .getHeroes()
      .then(setHeroes);
  }, [User?.name]);

  const updateHeroes = () => {
    setHeroes([]);
    getHeroes().then(setHeroes);
    dataService()
      .getProfileFull(User?.name)
      .then(s => setStats(s.stats));
  };

  const { combinedTimes, sortedHeroes } = calcHeroTimes(stats, heroes, selectedPlatform);
  const maxSize = combinedTimes[0]?.totalTime;
  const findHeroTime = (heroKey: string) =>
    stats ? combinedTimes.find(ct => ct.hero === heroKey) : undefined;

  return {
    heroes,
    stats,
    isSortedAsc,
    setIsSortedAsc,
    updateHeroes,
    combinedTimes,
    sortedHeroes,
    maxSize,
    findHeroTime,
    selectedPlatform,
    setSelectedPlatform,
  };
}

function calcHeroTimes(
  stats: OverwatchProfileFullStats | undefined,
  heroes: Hero[],
  platformFilter: 'all' | 'pc' | 'console' = 'all',
): CalcHeroTimesReturn {
  if (!stats || !heroes.length) return { combinedTimes: [], sortedHeroes: [] };

  const platforms = ['pc', 'console'] as const;
  const modes = ['quickplay', 'competitive'] as const;

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

  heroes.forEach(hero => {
    heroTimeMap.set(hero.key, {
      totalTime: 0,
      pcTime: 0,
      consoleTime: 0,
      pcQuickplayTime: 0,
      pcCompetitiveTime: 0,
      consoleQuickplayTime: 0,
      consoleCompetitiveTime: 0,
    });
  });

  platforms.forEach(platform => {
    modes.forEach(mode => {
      const values =
        stats[platform]?.[mode]?.heroes_comparisons?.time_played?.values || [];
      values.forEach(({ hero, value }) => {
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

  if (platformFilter === 'all') {
    heroTimeMap.forEach(heroData => {
      heroData.totalTime = heroData.pcTime + heroData.consoleTime;
    });
  } else {
    heroTimeMap.forEach(heroData => {
      heroData.totalTime =
        platformFilter === 'pc' ? heroData.pcTime : heroData.consoleTime;
    });
  }

  const combinedTimes = Array.from(heroTimeMap.entries()).map(
    ([hero, times]) => ({
      hero,
      ...times,
    }),
  );

  combinedTimes.sort((a, b) => b.totalTime - a.totalTime);

  const sortedHeroes = [...heroes].sort((a, b) => {
    const aTime = combinedTimes.find(ct => ct.hero === a.key)?.totalTime || 0;
    const bTime = combinedTimes.find(ct => ct.hero === b.key)?.totalTime || 0;
    return bTime - aTime;
  });

  return { combinedTimes, sortedHeroes };
}

export function selectedPlatformIcon(p: 'all' | 'pc' | 'console') {
  if (p === 'all') return <Earth size={20} color="white" />;
  if (p === 'pc') return <Monitor size={20} color="white" />;
  return <Joystick size={20} color="white" />;
}

export function cyclePlatform(
  current: 'all' | 'pc' | 'console',
  set: (p: 'all' | 'pc' | 'console') => void,
) {
  if (current === 'all') set('pc');
  else if (current === 'pc') set('console');
  else set('all');
}