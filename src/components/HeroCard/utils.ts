import { HeroStatsResponse } from '../../interfaces/Status.model';
import { HeroTime } from '../../interfaces/Summary.model';
import { Role } from '../../interfaces/Hero.model';
import { roleColors } from '../../interfaces/HeroCard.model';

export const findCardStatus = (status: HeroStatsResponse, heroKey: string) => {
  return status?.[heroKey] || undefined;
};

export const calculateFillWidth = (time?: HeroTime, maxSize?: number): string => {
  if (!time || !maxSize) return '0%';
  return `${(time.totalTime / maxSize) * 100}%`;
};

export const calculateFillOpacity = (time?: HeroTime, maxSize?: number): number => {
  if (!time || !maxSize) return 0;
  const opacity = (time.totalTime / maxSize) * 100;
  return opacity < 5 ? 0 : 1;
};

export const calculateGradientColors = (
  time?: HeroTime, 
  maxSize?: number, 
  role?: Role, 
  isDarkMode?: boolean
): string[] => {
  if (!time || !maxSize || !role) return ['#353535', '#353535'];
  const opacity = (time.totalTime / maxSize) * 100;
  return opacity < 1
    ? ['#353535', '#353535']
    : [roleColors[role], isDarkMode ? '#353535' : '#F7FAFC'];
};

export const formatTimeDisplay = (time?: HeroTime): string | undefined => {
  if (!time) return undefined;
  const hours = Math.floor(time.totalTime / 3600);
  const minutes = Math.floor((time.totalTime % 3600) / 60);
  if (hours === 0 && minutes === 0) return undefined;
  return `${hours}h ${minutes}m`;
};
