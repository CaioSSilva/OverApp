import axios from 'axios';
import { Hero } from '../interfaces/Hero.model';
import {
  OverwatchProfile,
  OverwatchProfileFull,
} from '../interfaces/Summary.model';
import { HeroStatsResponse } from '../interfaces/Status.model';
import { locale } from '../../i18n';
import { Map } from '../interfaces/Map.model';

const baseUrl = 'https://overfast-api.tekrop.fr';

const checkUserExists = (user: string) => {
  const response = axios.get(`${baseUrl}/players/${user}/summary`).catch(() => {
    return null;
  });
  return response;
};

const getHeroes = async (): Promise<Hero[]> => {
  const response = await axios.get<Hero[]>(`${baseUrl}/heroes`);
  return response.data;
};

const getProfileById = async (user?: string): Promise<OverwatchProfile> => {
  const response = await axios.get(`${baseUrl}/players/${user}/summary`);
  return response.data;
};

const getProfileFull = async (user?: string): Promise<OverwatchProfileFull> => {
  const response = await axios.get(`${baseUrl}/players/${user}`);
  return response.data;
};

const getStatusByHero = async (
  gamemode: string,
  platform: string,
  heroId: string,
  user?: string,
): Promise<HeroStatsResponse> => {
  const response = await axios.get(
    heroId !== ''
      ? `${baseUrl}/players/${user}/stats?gamemode=${gamemode}&platform=${platform}&hero=${heroId}`
      : `${baseUrl}/players/${user}/stats?gamemode=${gamemode}&platform=${platform}`,
  );
  return response.data;
};

const getHeroDetails = async (heroId: string) => {
  const response = await axios.get(
    `${baseUrl}/heroes/${heroId}?locale=${locale === 'pt' ? 'pt-br' : 'en-us'}`,
  );
  return response.data;
};

const getMaps = async (): Promise<Map[]> => {
  const response = await axios.get(`${baseUrl}/maps`);
  return response.data;
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
