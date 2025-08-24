import { useColorScheme } from 'react-native';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import { Dimensions } from 'react-native';

type HeroCardPlaceholderProps = {
  numberOfCards: number;
};

export default function HeroCardPlaceholder({
  numberOfCards,
}: HeroCardPlaceholderProps) {
  const isDarkMode = useColorScheme() === 'dark';
  const skeletonCards = Array.from({ length: numberOfCards });
  const opacity = { opacity: isDarkMode ? 0.8 : 0.6 };
  const windowWidth = Dimensions.get('window').width;

  return (
    <SkeletonPlaceholder
      backgroundColor={isDarkMode ? '#222222ff' : '#9f9e9cff'}
      highlightColor="#777"
    >
      {skeletonCards.map((_, idx) => (
        <SkeletonPlaceholder.Item
          key={idx}
          flexDirection="row"
          alignItems="center"
          marginVertical={10}
          marginHorizontal={10}
          padding={0}
          style={opacity}
        >
          <SkeletonPlaceholder.Item
            width={windowWidth - 30}
            height={80}
            borderRadius={12}
            marginLeft={6}
          />
        </SkeletonPlaceholder.Item>
      ))}
    </SkeletonPlaceholder>
  );
}
