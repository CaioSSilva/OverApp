import { ROLE_COLORS } from '../styles/theme';
import { Hero, Role } from './Hero.model';
import { HeroStatsResponse } from './Status.model';
import { HeroTime } from './Summary.model';

export type HeroCardProps = {
  hero: Hero;
  status?: HeroStatsResponse;
  time?: HeroTime | undefined;
  maxSize?: number;
};

export const roleColors: Record<Role, string> = {
  [Role.TANK]: ROLE_COLORS.TANK,
  [Role.DAMAGE]: ROLE_COLORS.DAMAGE,
  [Role.SUPPORT]: ROLE_COLORS.SUPPORT,
};
