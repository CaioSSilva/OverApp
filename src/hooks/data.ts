import axios from 'axios';
import { Hero } from '../interfaces/Hero.model';
import {
  OverwatchProfile,
  OverwatchProfileFull,
} from '../interfaces/Summary.model';
import { HeroStatsResponse } from '../interfaces/Status.model';
import { locale } from '../../i18n';
import { Map } from '../interfaces/Map.model';

const API_BASE = 'https://overfast-api.tekrop.fr';
const LOCALE = locale === 'pt' ? 'pt-br' : 'en-us';

const buildPlayerUrl = (user: string) => `${API_BASE}/players/${user}`;
const buildPlayerSummaryUrl = (user: string) => `${buildPlayerUrl(user)}/summary`;
const buildPlayerStatsUrl = (user: string, gamemode: string, platform: string, heroId?: string) => {
  const baseStats = `${buildPlayerUrl(user)}/stats?gamemode=${gamemode}&platform=${platform}`;
  return heroId ? `${baseStats}&hero=${heroId}` : baseStats;
};
const buildHeroUrl = (heroId: string) => `${API_BASE}/heroes/${heroId}?locale=${LOCALE}`;

const checkUserExists = (user: string) =>
  axios.get(buildPlayerSummaryUrl(user)).catch(() => null);

const getHeroes = async (): Promise<Hero[]> => {
  const { data } = await axios.get<Hero[]>(`${API_BASE}/heroes`);
  return data;
};

const getProfileById = async (user?: string): Promise<OverwatchProfile> => {
  const { data } = await axios.get(buildPlayerSummaryUrl(user!));
  return data;
};

const getProfileFull = async (user?: string): Promise<OverwatchProfileFull> => {
  const { data } = await axios.get(buildPlayerUrl(user!));
  return data;
};

const getStatusByHero = async (
  gamemode: string,
  platform: string,
  heroId: string,
  user?: string,
): Promise<HeroStatsResponse> => {
  const { data } = await axios.get(
    buildPlayerStatsUrl(user!, gamemode, platform, heroId || undefined),
  );
  return data;
};

const getHeroDetails = async (heroId: string) => {
  const { data } = await axios.get(buildHeroUrl(heroId));
  return data;
};

const getMaps = async (): Promise<Map[]> => {
  const { data } = await axios.get<Map[]>(`${API_BASE}/maps`);
  return data;
};

export function dataService() {
  return {
    checkUserExists,
    getHeroes,
    getStatusByHero,
    getProfileById,
    getProfileFull,
    getHeroDetails,
    getMaps,
  };
}
