import axios from 'axios';
import { Hero } from '../interfaces/Hero.model';
import {
  OverwatchProfile,
  OverwatchProfileFull,
} from '../interfaces/Summary.model';
import { HeroStatsResponse } from '../interfaces/Status.model';
import { locale } from '../../i18n';
import { Map } from '../interfaces/Map.model';
import { useContext } from 'react';
import { AppContext } from '../contexts/AppContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

const baseUrl = 'https://overfast-api.tekrop.fr';

const { User, setUser } = useContext(AppContext)

const player = User?.name


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
  platform: string,
  heroId: string,
): Promise<HeroStatsResponse> => {
  const response = await axios.get(
    heroId !== ''
      ? `${baseUrl}/players/${player}/stats?gamemode=${gamemode}&platform=${platform}&hero=${heroId}`
      : `${baseUrl}/players/${player}/stats?gamemode=${gamemode}&platform=${platform}`,
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

const logOut = () => {
  AsyncStorage.clear()
  setUser(null)
};

export function dataService() {
  return {
    getHeroes,
    getStatusByHero,
    getProfileById,
    getProfileFull,
    getHeroDetails,
    getMaps,
    logOut,
  };
}
