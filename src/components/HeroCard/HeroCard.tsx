import { Image, Text, View, StyleSheet, useColorScheme } from 'react-native';
import { HeroCardProps, roleColors } from '../../interfaces/HeroCard.model';
import { useTranslation } from 'react-i18next';
import { HeroStatsResponse } from '../../interfaces/Status.model';
import { Info } from 'lucide-react-native';
import Button from '../Button/Button';
import LinearGradient from 'react-native-linear-gradient';
import { ViewStyle } from 'react-native';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { getThemedStyles } from '../../../theme';

const getCardBg = (isDarkMode: boolean) =>
  isDarkMode ? styles.cardDark : styles.cardLight;
const getTextColor = (isDarkMode: boolean) =>
  isDarkMode ? styles.textDark : styles.textLight;

export default function HeroCard({
  hero,
  status,
  time,
  maxSize,
}: HeroCardProps) {
  const isDarkMode = useColorScheme() === 'dark';
  const { t } = useTranslation();
  const navigation = useNavigation<NavigationProp<any>>();

  const calcFillWidth = () => {
    if (!time || !maxSize) return '0%';
    const width = (time.totalTime / maxSize) * 100;
    return `${width}%`;
  };

  const calcFillOpacity = () => {
    if (!time || !maxSize) return 0;
    const opacity = (time.totalTime / maxSize) * 100;
    return opacity < 5 ? 0 : 1;
  };

  const calcFilterColors = () => {
    if (!time || !maxSize) return ['#353535', '#353535'];
    const opacity = (time.totalTime / maxSize) * 100;
    return opacity < 1
      ? ['#353535', '#353535']
      : [roleColors[hero.role], isDarkMode ? '#353535' : '#F7FAFC'];
  };

  const showTimePlayed = () => {
    if (!time) return undefined;
    const hours = Math.floor(time.totalTime / 3600);
    const minutes = Math.floor((time.totalTime % 3600) / 60);
    if (hours === 0 && minutes === 0) return undefined;
    return `${hours}h ${minutes}m`;
  };

  const openHeroStatus = () => {
    const findStatus = findCardStatus(status!, hero.key);
    console.log('Navigating to Details with:', { findStatus, hero });
    navigation.navigate('Stack', {
      screen: 'Details',
      params: {
        status: findStatus,
        hero: hero,
      },
    });
  };

  return (
    <>
      <View
        style={[
          styles.card,
          getCardBg(isDarkMode),
          { borderLeftColor: roleColors[hero.role] },
        ]}
      >
        <LinearGradient
          colors={calcFilterColors()}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={
            {
              opacity: calcFillOpacity(),
              position: 'absolute',
              top: 0,
              left: 0,
              width: calcFillWidth(),
              height: '170%',
              borderRadius: 12,
            } as ViewStyle
          }
        />
        <Image
          source={{ uri: hero.portrait }}
          style={styles.image}
          resizeMode="cover"
        />
        <View style={styles.infoBox}>
          <View>
            <Text style={[styles.name, getTextColor(isDarkMode)]}>
              {hero.name}
            </Text>
            <View
              style={[
                styles.roleBox,
                {
                  backgroundColor: roleColors[hero.role],
                  shadowColor: roleColors[hero.role],
                },
              ]}
            >
              <Text style={styles.roleText}>{t(hero.role).toUpperCase()}</Text>
            </View>
          </View>
          <View style={styles.statsContainer}>
            {status &&
              (findCardStatus(status, hero.key) ? (
                <Button title={t('details')} onPress={() => openHeroStatus()} />
              ) : (
                <>
                  <View style={styles.noStatsContainer}>
                    <Text style={getThemedStyles(isDarkMode).text}>
                      {t('noData')}
                    </Text>
                    <Info color={'#fff'} style={styles.info} size={20} />
                  </View>
                </>
              ))}
            {showTimePlayed() && (
              <View style={styles.timeContainer}>
                <Text
                  style={[
                    getThemedStyles(isDarkMode).text,
                    getThemedStyles(isDarkMode).boldText,
                    styles.timeText,
                  ]}
                >
                  {showTimePlayed()}
                </Text>
              </View>
            )}
          </View>
        </View>
      </View>
    </>
  );
}
const findCardStatus = (status: HeroStatsResponse, heroName: string) => {
  return status ? status[heroName] || undefined : undefined;
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 18,
    marginVertical: 10,
    marginHorizontal: 10,
    padding: 12,
    overflow: 'hidden',
    borderLeftWidth: 6,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.18,
    shadowRadius: 2,
  },
  cardLight: {
    backgroundColor: '#F7FAFC',
  },
  cardDark: {
    backgroundColor: '#353535',
  },
  image: {
    width: 60,
    height: 60,
    borderRadius: 12,
    backgroundColor: '#bbb',
  },
  infoBox: {
    marginLeft: 16,
    flexDirection: 'row',
    flex: 1,
  },
  name: {
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 8,
  },
  textLight: {
    color: '#222',
  },
  textDark: {
    color: '#fff',
  },
  roleBox: {
    alignSelf: 'flex-start',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 8,
    marginTop: 2,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.14,
    shadowRadius: 2,
  },
  roleText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    letterSpacing: 1,
  },
  statsContainer: {
    display: 'flex',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  noStatsContainer: {
    flexDirection: 'row',
    gap: 6,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  info: {
    backgroundColor: '#df6363',
    borderRadius: '100%',
  },
  timeText: {
    fontSize: 20,
  },
  timeContainer: {
    alignItems: 'flex-end',
  },
});
