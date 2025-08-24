import { useMemo, useCallback } from 'react';
import { Category } from '../../interfaces/Details.model';

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
        const mins = Math.floor(numSeconds / 60);
        const secs = numSeconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
      },
      percentage: (value: string | number): string => {
        return typeof value === 'number' ? `${value}%` : `${value}`;
      },
      toNumber,
    }),
    [toNumber],
  );
};

export const useStatIcon = () => {
  return useCallback((key: string): string => {
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
};
