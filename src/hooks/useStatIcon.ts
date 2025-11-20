const STAT_ICONS: Record<string, string> = {
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
};

export const useStatIcon = () => {
  return (key: string): string => {
    for (const [keyword, icon] of Object.entries(STAT_ICONS)) {
      if (key.includes(keyword)) {
        return icon;
      }
    }
    return '📊';
  };
};
