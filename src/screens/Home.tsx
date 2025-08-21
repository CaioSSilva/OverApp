import React, { useCallback, useEffect, useState } from 'react';
import { FlatList, StyleSheet, Text, useColorScheme, View } from 'react-native';
import { getThemedStyles } from '../../styles';
import { dataService } from '../hooks/data';
import { Hero } from '../interfaces/Hero.model';
import HeroCardPlaceholder from '../components/HeroCard/PlaceHolder';
import HeroCard from '../components/HeroCard/HeroCard';
import { useTranslation } from 'react-i18next';
import Button from '../components/Button/Button';

export default function Home() {
  const isDarkMode = useColorScheme() === 'dark';
  const { getHeroes } = dataService();
  const [heroes, setHeroes] = useState<Hero[]>([]);
  const { t } = useTranslation();

  const getHeroList = useCallback(() => dataService().getHeroes(), []);

  useEffect(() => {
    getHeroList().then(setHeroes);
  }, [getHeroList]);

  function updateHeroes() {
    setHeroes([]);
    getHeroes().then(setHeroes);
  }

  return (
    <View style={getThemedStyles(isDarkMode).container}>
      <View style={homeStyles.heroTitleContainer}>
        <Text style={[getThemedStyles(isDarkMode).text, homeStyles.heroTitle]}>
          {t('characters')}
        </Text>

        <Button onPress={() => updateHeroes()} title={t('update')} />
      </View>
      {heroes.length > 0 ? (
        <FlatList
          data={heroes}
          keyExtractor={item => item.key || item.name}
          renderItem={({ item }) => <HeroCard hero={item} />}
          initialNumToRender={10}
          maxToRenderPerBatch={10}
          windowSize={5}
        />
      ) : (
        <HeroCardPlaceholder />
      )}
    </View>
  );
}

const homeStyles = StyleSheet.create({
  heroTitleContainer: {
    paddingHorizontal: 16,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  heroTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 16,
  },
});
