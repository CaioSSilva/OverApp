import { useMemo, useCallback } from 'react';
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

export const useFormatters = () => {
  const toNumber = useCallback((value: string | number): number => {
    if (typeof value === 'number') return value;
    const parsed = parseFloat(value as string);
    return isNaN(parsed) ? 0 : parsed;
  }, []);

  return useMemo(
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
        const hours = Math.floor(numSeconds / 3600);
        const minutes = Math.floor((numSeconds % 3600) / 60);
        if (hours === 0 && minutes === 0) return '0:00';
        return `${hours}h ${minutes}m`;
      },
      percentage: (value: string | number): string => {
        return typeof value === 'number' ? `${value}%` : `${value}`;
      },
      toNumber,
    }),
    [toNumber],
  );
};