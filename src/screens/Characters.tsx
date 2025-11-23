import React, { useContext } from 'react';
import { FlatList, StyleSheet, Text, useColorScheme, View } from 'react-native';
import useHeroesData, {
  cyclePlatform,
  selectedPlatformIcon,
} from '../hooks/useHeroesData';
import HeroCard from '../components/HeroCard/HeroCard';
import { useTranslation } from 'react-i18next';
import Button from '../components/Button';
import { BandBubble } from '../components/BandBubble';

import { COLORS, getThemedStyles } from '../styles/theme';
import Skeleton from '../components/Skeleton';
import {
  ArrowDownWideNarrow,
  ArrowUpNarrowWide,
  IterationCw,
} from 'lucide-react-native';
import { AppContext } from '../contexts/AppContext';
import BandContext from '../contexts/BandContext';

export default function Characters() {
  const isDarkMode = useColorScheme() === 'dark';
  const { User } = useContext(AppContext);
  const { isConnected } = useContext(BandContext);
  const { t } = useTranslation();

  const {
    isSortedAsc,
    setIsSortedAsc,
    updateHeroes,
    sortedHeroes,
    maxSize,
    findHeroTime,
    selectedPlatform,
    setSelectedPlatform,
  } = useHeroesData(User);

  return (
    <View style={getThemedStyles(isDarkMode).container}>
      <View style={getThemedStyles(isDarkMode).header}>
        <View>
          <Text
            style={[
              getThemedStyles(isDarkMode).text,
              getThemedStyles(isDarkMode).headerTitle,
            ]}
          >
            {t('characters.title')}
          </Text>
          <Text
            style={[
              getThemedStyles(isDarkMode).text,
              getThemedStyles(isDarkMode).headerSubtitle,
            ]}
          >
            {t(
              selectedPlatform === 'all'
                ? 'stats.gameTimeAll'
                : selectedPlatform === 'pc'
                ? 'stats.gameTimePC'
                : 'stats.gameTimeConsole',
            )}
          </Text>
        </View>

        <View style={styles.buttonsContainer}>
          <Button
            icon={
              isSortedAsc ? (
                <ArrowDownWideNarrow size={20} color={COLORS.WHITE} />
              ) : (
                <ArrowUpNarrowWide size={20} color={COLORS.WHITE} />
              )
            }
            customStyles={{ backgroundColor: COLORS.INFO }}
            onPress={() => setIsSortedAsc(!isSortedAsc)}
          />
          <Button
            icon={selectedPlatformIcon(selectedPlatform)}
            customStyles={{ backgroundColor: COLORS.INFO }}
            onPress={() => cyclePlatform(selectedPlatform, setSelectedPlatform)}
          />
          <Button
            onPress={() => updateHeroes()}
            icon={<IterationCw size={20} color={COLORS.WHITE} />}
          />
        </View>
      </View>
      {sortedHeroes.length > 0 ? (
        <FlatList
          data={isSortedAsc ? sortedHeroes : [...sortedHeroes].reverse()}
          keyExtractor={item => item.key || item.name}
          renderItem={({ item }) => (
            <HeroCard
              hero={item}
              time={findHeroTime(item.key)}
              maxSize={maxSize}
            />
          )}
          initialNumToRender={10}
          maxToRenderPerBatch={10}
          windowSize={5}
        />
      ) : (
        <Skeleton height={90} count={10} />
      )}
      {isConnected && <BandBubble />}
    </View>
  );
}
const styles = StyleSheet.create({
  buttonsContainer: {
    flexDirection: 'row',
    gap: 10,
  },
});
