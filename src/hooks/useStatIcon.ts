import { useCallback } from 'react';

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
