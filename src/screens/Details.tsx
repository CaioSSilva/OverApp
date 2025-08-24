import { useColorScheme, View } from 'react-native';
import ActionSheetHeroStats from '../components/HeroDetailStats/HeroDetailStats';
import { DetailsProps } from '../interfaces/Details.model';
import { getThemedStyles } from '../../theme';

export default function Details({ status, hero }: DetailsProps) {
    console.log('Details Props:', { status, hero }); // Debugging line
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
