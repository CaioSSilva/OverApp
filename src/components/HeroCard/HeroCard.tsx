import { Image, Text, View, StyleSheet, useColorScheme } from 'react-native';
import { HeroCardProps, roleColors } from '../../interfaces/HeroCard.model';
import { useTranslation } from 'react-i18next';
import { HeroStatsResponse } from '../../interfaces/Status.model';
import { Info } from 'lucide-react-native';
import { getThemedStyles } from '../../../styles';
import Button from '../Button/Button';
import { RefObject, useRef } from 'react';
import ActionSheet, { ActionSheetRef } from 'react-native-actions-sheet';
import ActionSheetHeroStats from '../ActionSheetHeroStats';

const getCardBg = (isDarkMode: boolean) =>
  isDarkMode ? styles.cardDark : styles.cardLight;
const getTextColor = (isDarkMode: boolean) =>
  isDarkMode ? styles.textDark : styles.textLight;

const getSheetStyles = (isDarkMode : boolean) => isDarkMode ? styles.actionSheetContainerBlack : styles.actionSheetContainerwhite

export default function HeroCard({ hero, status }: HeroCardProps) {
  const isDarkMode = useColorScheme() === 'dark';
  const { t } = useTranslation();
  const detailSheet = useRef<ActionSheetRef>(null);

  return (
    <>
      <View
        style={[
          styles.card,
          getCardBg(isDarkMode),
          { borderLeftColor: roleColors[hero.role] },
        ]}
      >
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
                <Button
                  title={t('details')}
                  onPress={() => openHeroStatus(detailSheet)}
                />
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
          </View>
        </View>
      </View>
      <ActionSheet containerStyle={
          getSheetStyles(isDarkMode)} ref={detailSheet} gestureEnabled={false} headerAlwaysVisible>
        <ActionSheetHeroStats 
          statsData={findCardStatus(status!, hero.key)!} 
          heroName={hero.name}
          isDarkMode={isDarkMode}
        />
      </ActionSheet>
    </>
  );
}
const findCardStatus = (status: HeroStatsResponse, heroName: string) => {
  return status ?  status[heroName] || undefined : undefined;
};

const openHeroStatus = (ref: RefObject<ActionSheetRef | null>) => {
  ref.current?.show();
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 18,
    marginVertical: 10,
    marginHorizontal: 10,
    padding: 12,
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
  actionSheetContainerBlack: {
    height: 400,
    display:'flex',
    backgroundColor: '#2d2d2d',
  },

  actionSheetContainerwhite:{
    height: 400,
    display: 'flex',
    backgroundColor: '#e2e2e2'
  }
});
