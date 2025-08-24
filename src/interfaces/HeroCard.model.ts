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
  [Role.TANK]: '#5192c3',
  [Role.DAMAGE]: '#df6363',
  [Role.SUPPORT]: '#77c36b',
};
