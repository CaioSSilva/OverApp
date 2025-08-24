import { Hero } from './Hero.model';

export interface Stat {
  key: string;
  label: string;
  value: number | string;
}

export interface Category {
  category: string;
  label: string;
  stats: Stat[];
}

export interface Metric {
  title: string;
  value: string | number;
  color: string;
  icon: string;
}

export interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  color?: string;
  icon?: string;
  isDarkMode?: boolean;
}

export interface ActionSheetHeroStatsProps {
  statsData: Category[] | Record<string, Category[]>;
  heroName?: string;
  isDarkMode?: boolean;
}
export interface DetailsProps {
  status: Category[] | Record<string, Category[]>;
  hero: Hero;
}
