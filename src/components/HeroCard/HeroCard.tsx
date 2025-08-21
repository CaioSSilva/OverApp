import { Image, Text, View, StyleSheet, useColorScheme } from 'react-native';
import { HeroCardProps, roleColors } from '../../interfaces/HeroCard.model';
import { useTranslation } from 'react-i18next';

const getCardBg = (isDarkMode: boolean) => (isDarkMode ? styles.cardDark : styles.cardLight);
const getTextColor = (isDarkMode: boolean) => (isDarkMode ? styles.textDark : styles.textLight);

export default function HeroCard({ hero }: HeroCardProps) {
  const isDarkMode = useColorScheme() === 'dark';
  const { t } = useTranslation();
  
  return (
    <View style={[
      styles.card,
      getCardBg(isDarkMode),
      { borderLeftColor: roleColors[hero.role] }
    ]}>
      <Image
        source={{ uri: hero.portrait }}
        style={styles.image}
        resizeMode="cover"
      />
      <View style={styles.infoBox}>
        <Text style={[styles.name, getTextColor(isDarkMode)]}>
          {hero.name}
        </Text>
        <View style={[styles.roleBox, { backgroundColor: roleColors[hero.role], shadowColor: roleColors[hero.role] }]}>
          <Text style={styles.roleText}>
            {t(hero.role).toUpperCase()}
          </Text>
        </View>
      </View>
    </View>
  );
}

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
    flex: 1,
    justifyContent: 'center',
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
});