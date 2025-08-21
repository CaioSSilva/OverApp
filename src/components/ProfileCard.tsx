import React, { useEffect, useState } from 'react';
import {
  Image,
  Text,
  View,
  StyleSheet,
  useColorScheme,
  ImageBackground,
} from 'react-native';
import { OverwatchProfile } from '../interfaces/Summary.model';
import { SvgUri } from 'react-native-svg';
import { useTranslation } from 'react-i18next';
import { locale } from '../../i18n';

const endorsementColors = [
  '#A0A0A0',
  '#9ECA6B',
  '#68B3C8',
  '#FFCE47',
  '#DF6363',
];

const getCardBg = (isDarkMode: boolean) =>
  isDarkMode ? styles.cardDark : styles.cardLight;
const getTextColor = (isDarkMode: boolean) =>
  isDarkMode ? styles.textDark : styles.textLight;

export default function ProfileCard({
  profile,
}: {
  profile: OverwatchProfile;
}) {
  const isDarkMode = useColorScheme() === 'dark';
  const { t } = useTranslation();
  const endorsementColor =
    endorsementColors[profile.endorsement.level] || endorsementColors[0];
  const [currentDateTime, setCurrentDateTime] = useState<string>('');

  useEffect(() => {
    const now = new Date();
    const formatted = now.toLocaleString(locale === 'pt' ? 'pt-BR' : 'en-US', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
    setCurrentDateTime(formatted);
  }, []);

  return (
    <View style={[styles.card, getCardBg(isDarkMode)]}>
      <ImageBackground
        source={{ uri: profile.namecard }}
        style={styles.bgImage}
        imageStyle={styles.bgImageStyle}
        resizeMode="cover"
      >
        <View style={styles.rowContent}>
          <View style={styles.avatarBox}>
            <Image source={{ uri: profile.avatar }} style={styles.avatar} />
          </View>
          <View style={styles.infoBox}>
            <Text style={[styles.username]}>{profile.username}</Text>
            {profile.title && (
              <Text style={[styles.title, getTextColor(isDarkMode)]}>
                {profile.title}
              </Text>
            )}
            <View
              style={[
                styles.endorsementBox,
                { backgroundColor: endorsementColor },
              ]}
            >
              <SvgUri width={24} height={24} uri={profile.endorsement.frame} />

              <Text style={styles.endorsementText}>
                Nível {profile.endorsement.level}
              </Text>
            </View>
            <Text style={[styles.updated, getTextColor(isDarkMode)]}>
              {t('updatedAt')}: {currentDateTime}
            </Text>
          </View>
        </View>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 18,
    marginVertical: 10,
    marginHorizontal: 10,
    elevation: 2,
    overflow: 'hidden',
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
  bgImage: {
    width: '100%',
    minHeight: 110,
    justifyContent: 'center',
  },
  bgImageStyle: {
    opacity: 0.5,
    width: '100%',
    height: '100%',
    borderRadius: 18,
  },
  rowContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
  },
  avatarBox: {
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 18,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 16,
    backgroundColor: '#bbb',
    marginBottom: 6,
    borderWidth: 3,
    borderColor: '#fff',
  },
  infoBox: {
    flex: 1,
    justifyContent: 'center',
  },
  username: {
    fontWeight: 'bold',
    fontSize: 20,
    marginBottom: 2,
    color: '#fff',
  },
  title: {
    fontSize: 16,
    opacity: 0.85,
    marginBottom: 8,
  },
  endorsementBox: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 7,
    alignSelf: 'flex-start',
    marginBottom: 8,
    marginTop: 2,
  },
  endorsementText: {
    fontWeight: 'bold',
    color: '#fff',
    marginLeft: 6,
    fontSize: 14,
  },
  updated: {
    fontSize: 13,
    opacity: 0.7,
  },
  textLight: {
    color: '#222',
  },
  textDark: {
    color: '#fff',
  },
});
