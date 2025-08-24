import { useMemo } from 'react';
import { Category } from '../interfaces/Details.model';

export const useStatsData = (statsData: any, heroName: string) => {
  return useMemo(() => {
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
    return data as Category[];
  }, [statsData, heroName]);
};
