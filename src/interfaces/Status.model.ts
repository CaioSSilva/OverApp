export interface StatItem {
  key: string;
  label: string;
  value: number;
}

export interface StatCategory {
  category: string;
  label: string;
  stats: StatItem[];
}

export interface HeroStats {
  [heroName: string]: StatCategory[];
}

export interface OverwatchPlayerStats {
  'all-heroes': StatCategory[];
  ana: StatCategory[];
  cassidy: StatCategory[];
  orisa: StatCategory[];
  reaper: StatCategory[];
  reinhardt: StatCategory[];
  tracer: StatCategory[];
}

export interface FlexibleOverwatchStats {
  'all-heroes': StatCategory[];
  [heroName: string]: StatCategory[];
}

export enum StatCategoryType {
  BEST = 'best',
  AVERAGE = 'average',
  GAME = 'game',
  COMBAT = 'combat',
  ASSISTS = 'assists',
  HERO_SPECIFIC = 'hero_specific',
}

export interface TypedStatCategory {
  category: StatCategoryType;
  label: string;
  stats: StatItem[];
}

export interface TypedOverwatchStats {
  'all-heroes': TypedStatCategory[];
  [heroName: string]: TypedStatCategory[];
}

export interface HeroStatsResponse {
  [heroName: string]: StatCategory[];
}
