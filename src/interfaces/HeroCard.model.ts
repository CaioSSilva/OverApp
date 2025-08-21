import { Hero, Role } from "./Hero.model";

export type HeroCardProps = {
  hero: Hero;
};

export const roleColors: Record<Role, string> = {
  [Role.TANK]: '#5192c3',
  [Role.DAMAGE]: '#df6363',
  [Role.SUPPORT]: '#77c36b',
};