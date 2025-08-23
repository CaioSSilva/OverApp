import axios from 'axios';
import { Hero } from '../interfaces/Hero.model';
import { OverwatchProfile, OverwatchProfileFull } from '../interfaces/Summary.model';
import { HeroStatsResponse } from '../interfaces/Status.model';

const baseUrl = 'https://overfast-api.tekrop.fr';

const player = 'Kento-12528';

//Kento-12528

// Coruja-11482

const getHeroes = async (): Promise<Hero[]> => {
  const response = await axios.get<Hero[]>(`${baseUrl}/heroes`);
  return response.data;
};

const getProfileById = async (): Promise<OverwatchProfile> => {
  const response = await axios.get(`${baseUrl}/players/${player}/summary`);
  return response.data;
};

const getProfileFull = async (): Promise<OverwatchProfileFull> => {
  const response = await axios.get(`${baseUrl}/players/${player}`);
  return response.data;
}; 

const getStatusByHero = async (
  gamemode: string,
  heroId: string,
): Promise<HeroStatsResponse> => {
  const response = await axios.get(
    heroId !== ''
      ? `${baseUrl}/players/${player}/stats?gamemode=${gamemode}&hero=${heroId}`
      : `${baseUrl}/players/${player}/stats?gamemode=${gamemode}`,
  );
  return response.data;
};

const logOut = () => {
  // Placeholder for logout functionality
  console.log('User logged out');
};

export function dataService() {
  return {
    getHeroes,
    getStatusByHero,
    getProfileById,
    getProfileFull,
    logOut
  };
}
