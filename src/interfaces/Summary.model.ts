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