import { Hero } from "./Hero.model";

export interface OverwatchProfile {
  username: string;
  avatar: string;
  namecard: string;
  title: string;
  endorsement: {
    level: number;
    frame: string;
  };
  competitive: {
    pc: OverwatchCompetitivePlatform;
    console: OverwatchCompetitivePlatform;
  };
  last_updated_at: number;
}

export interface OverwatchCompetitivePlatform {
  season: number;
  tank: OverwatchRoleInfo;
  damage: OverwatchRoleInfo;
  support: OverwatchRoleInfo;
  open: OverwatchRoleInfo;
}

export interface OverwatchRoleInfo {
  division: string;
  tier: number;
  role_icon: string;
  rank_icon: string;
  tier_icon: string;
}

export interface OverwatchProfileFull {
  stats: OverwatchProfileFullStats;
}

export interface OverwatchProfileFullStats {
  pc: PlatformData;
  console: PlatformData;
}

interface PlatformData {
  quickplay: GameModeData;
  competitive: GameModeData;
}

interface GameModeData {
  heroes_comparisons: HeroesComparisons;
}

interface TimePlayedData {
  label: string;
  values: HeroTimeValue[];
}

interface HeroTimeValue {
  hero: string;
  value: number;
}
interface HeroesComparisons {
  time_played: TimePlayedData;
}
export interface HeroCombinedTime {
  hero: string;
  totalTime: number;
  pcTime: number;
  consoleTime: number;
}

export interface HeroTime {
  hero: string;
  totalTime: number;
  pcTime: number;
  consoleTime: number;
  pcQuickplayTime: number;
  pcCompetitiveTime: number;
  consoleQuickplayTime: number;
  consoleCompetitiveTime: number;
}

export interface CalcHeroTimesReturn {
  combinedTimes: HeroTime[];
  sortedHeroes: Hero[];
}
