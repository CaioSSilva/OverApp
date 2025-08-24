import { StyleSheet } from 'react-native';

export const COLORS = {
  PRIMARY: '#FA9C1E',
  WHITE: '#FFFFFF',
  
  LIGHT: {
    BACKGROUND: '#E2E2E2',
    TEXT: '#151515',
    BORDER: '#D3D3D3',
    CARD: '#FFFFFF',
  },
  
  DARK: {
    BACKGROUND: '#121212',
    TEXT: '#E2E2E2', 
    BORDER: '#1F1F1F',
    CARD: '#1F1F1F',
  },
  
  SUCCESS: '#4CAF50',
  WARNING: '#FF9800', 
  ERROR: '#F44336',
  INFO: '#2196F3',
} as const;

export const TYPOGRAPHY = {
  SIZES: {
    XS: 10,
    SM: 12,
    MD: 14,
    LG: 16,
    XL: 18,
    XXL: 24,
  },
  WEIGHTS: {
    LIGHT: '300' as const,
    NORMAL: '400' as const,
    MEDIUM: '500' as const,
    BOLD: '700' as const,
  },
} as const;

export const SPACING = {
  XS: 4,
  SM: 8,
  MD: 16,
  LG: 24,
  XL: 32,
  XXL: 48,
} as const;

export const BORDER_RADIUS = {
  SM: 4,
  MD: 8,
  LG: 12,
  XL: 16,
  ROUND: 50,
} as const;

export const ANIMATIONS = {
  FAST: 150,
  NORMAL: 300,
  SLOW: 500,
} as const;

export interface Theme {
  background: string;
  text: string;
  activityIndicator: string;
  iconColor: string;
  border: string;
  card: string;
}

export const lightTheme: Theme = {
  background: COLORS.LIGHT.BACKGROUND,
  text: COLORS.LIGHT.TEXT,
  activityIndicator: COLORS.PRIMARY,
  iconColor: COLORS.PRIMARY,
  border: COLORS.LIGHT.BORDER,
  card: COLORS.LIGHT.CARD,
};

export const darkTheme: Theme = {
  background: COLORS.DARK.BACKGROUND,
  text: COLORS.DARK.TEXT,
  activityIndicator: COLORS.DARK.TEXT,
  iconColor: COLORS.DARK.TEXT,
  border: COLORS.DARK.BORDER,
  card: COLORS.DARK.CARD,
};

export const getTheme = (isDarkMode: boolean): Theme => 
  isDarkMode ? darkTheme : lightTheme;

export const getThemedStyles = (isDarkMode: boolean) => {
  const theme = getTheme(isDarkMode);

  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },

    text: {
      color: theme.text,
      fontSize: TYPOGRAPHY.SIZES.MD,
      textAlign: 'center',
    },

    boldText: {
      fontWeight: TYPOGRAPHY.WEIGHTS.BOLD,
    },

    title:{
fontWeight: TYPOGRAPHY.WEIGHTS.BOLD,
      fontSize: TYPOGRAPHY.SIZES.XXL,
    },

    button: {
      backgroundColor: COLORS.PRIMARY,
      padding: SPACING.SM,
      borderRadius: BORDER_RADIUS.SM,
      alignItems: 'center',
    },

    disabledButton: {
      backgroundColor: '#ccc',
    },

    buttonText: {
      color: COLORS.WHITE,
      fontSize: TYPOGRAPHY.SIZES.SM,
      fontWeight: TYPOGRAPHY.WEIGHTS.BOLD,
    },

    card: {
      backgroundColor: theme.card,
      borderRadius: BORDER_RADIUS.MD,
      padding: SPACING.MD,
      marginVertical: SPACING.XS,
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.1,
      shadowRadius: 3.84,
      elevation: 5,
    },

    row: {
      flexDirection: 'row',
      alignItems: 'center',
    },

    column: {
      flexDirection: 'column',
    },

    centered: {
      alignItems: 'center',
      justifyContent: 'center',
    },

    spaceBetween: {
      justifyContent: 'space-between',
    },

    paddingXS: { padding: SPACING.XS },
    paddingSM: { padding: SPACING.SM },
    paddingMD: { padding: SPACING.MD },
    paddingLG: { padding: SPACING.LG },

    marginXS: { margin: SPACING.XS },
    marginSM: { margin: SPACING.SM },
    marginMD: { margin: SPACING.MD },
    marginLG: { margin: SPACING.LG },
  });
};
