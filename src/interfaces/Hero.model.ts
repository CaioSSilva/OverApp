export interface Hero {
  [x: string]: any;
  key: string;
  name: string;
  portrait: string;
  role: Role;
}

export enum Role {
    TANK = 'tank',
    DAMAGE = 'damage',
    SUPPORT = 'support',
}