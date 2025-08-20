import { StyleSheet } from 'react-native';

export const lightTheme = {
  background: '#e2e2e2',
  text: '#151515',
  activityIndicator: '#FA9C1E',
  iconColor: '#FA9C1E',
};

export const darkTheme = {
  background: '#121212',
  text: '#e2e2e2',
  activityIndicator: '#e2e2e2',
  iconColor: '#e2e2e2',
};

export const getThemedStyles = (isDarkMode: boolean) => {
  const theme = isDarkMode ? darkTheme : lightTheme;

  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },

    text:{
      color: theme.text,
      fontSize: 14,
      textAlign: 'center',
    },

    boldText: {
      fontWeight: 'bold',
    },
  });
};

export const getTheme = (isDarkMode: boolean) => {
  return isDarkMode ? darkTheme : lightTheme;
}
 