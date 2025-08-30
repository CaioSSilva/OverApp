import { useColorScheme, View } from 'react-native';
import ActionSheetHeroStats from './HeroDetailStats/HeroDetailStats';
import { DetailsProps } from '../interfaces/Details.model';
import { getThemedStyles } from '../styles/theme';

export default function Details({ status, hero }: DetailsProps) {
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <View style={[getThemedStyles(isDarkMode).container]}>
      <ActionSheetHeroStats
        statsData={status}
        heroName={hero?.name}
        isDarkMode={isDarkMode}
      />
    </View>
  );
}
