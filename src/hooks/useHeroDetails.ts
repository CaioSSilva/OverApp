import { useState, useEffect, useCallback } from 'react';
import { HeroDetails as HeroDetailsInterface } from '../interfaces/HeroStory.model';
import { Hero } from '../interfaces/Hero.model';
import { dataService } from './data';

export const useHeroDetails = (hero: Hero) => {
  const [heroDetails, setHeroDetails] = useState<HeroDetailsInterface | null>(null);
  const [loading, setLoading] = useState(true);
  const { getHeroDetails } = dataService();

  const fetchHeroDetails = useCallback(() => getHeroDetails(hero.key), [getHeroDetails, hero.key]);

  useEffect(() => {
    setLoading(true);
    fetchHeroDetails()
      .then(setHeroDetails)
      .finally(() => setLoading(false));
  }, [fetchHeroDetails, hero.key]);

  return {
    heroDetails,
    loading,
    refetch: fetchHeroDetails,
  };
};
