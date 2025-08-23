import axios from 'axios';
import { Hero } from '../interfaces/Hero.model';
import { OverwatchProfile } from '../interfaces/Summary.model';
import { HeroStatsResponse } from '../interfaces/Status.model';

const baseUrl = 'https://overfast-api.tekrop.fr';

const getHeroes = async (): Promise<Hero[]> => {
  const response = await axios.get<Hero[]>(`${baseUrl}/heroes`);
  return response.data;
};

const getProfileById = async (id: string): Promise<OverwatchProfile> => {
  const response = await axios.get(`${baseUrl}/players/${id}/summary`);
  return response.data;
};

const getStatusByHero = async (
  id: string,
  gamemode: string,
  heroId: string,
): Promise<HeroStatsResponse> => {
  const response = await axios.get(
    heroId !== ''
      ? `${baseUrl}/players/${id}/stats?gamemode=${gamemode}&hero=${heroId}`
      : `${baseUrl}/players/${id}/stats?gamemode=${gamemode}`,
  );
  return response.data;
};

export function dataService() {
  return {
    getHeroes,
    getStatusByHero,
    getProfileById,
  };
}
