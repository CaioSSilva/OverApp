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

    button: {
      backgroundColor: '#FA9C1E',
      padding: 8,
      borderRadius: 5,
      alignItems: 'center',
    },

    disabledButton: {
      backgroundColor: '#ccc',
    },

    buttonText: {
      color: '#fff',
      fontSize: 12,
      fontWeight: 'bold',
    },

    title:{

    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 16,
    marginHorizontal: 'auto'
    }
  });
};

export const getTheme = (isDarkMode: boolean) => {
  return isDarkMode ? darkTheme : lightTheme;
}
 