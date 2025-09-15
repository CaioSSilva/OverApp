import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 18,
    marginVertical: 10,
    marginHorizontal: 10,
    padding: 12,
    overflow: 'hidden',
    borderLeftWidth: 6,
    boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
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
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  timeContainer: {
    alignItems: 'flex-end',
  },
  timeText: {
    fontSize: 20,
  },
});

export const getCardBg = (isDarkMode: boolean) =>
  isDarkMode ? styles.cardDark : styles.cardLight;

export const getTextColor = (isDarkMode: boolean) =>
  isDarkMode ? styles.textDark : styles.textLight;
