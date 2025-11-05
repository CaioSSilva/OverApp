import { StyleSheet } from 'react-native';

export const COLORS = {
  PRIMARY: '#FF7F00',
  WHITE: '#FFFFFF',

  LIGHT: {
    BACKGROUND: '#F0F0F0',
    TEXT: '#0A1C2E',
    BORDER: '#D3D3D3',
    CARD: '#FFFFFF',
  },

  DARK: {
    BACKGROUND: '#1E212B',
    TEXT: '#E5EFFF',
    BORDER: '#3D465C',
    CARD: '#2A3040',
  },

  SUCCESS: '#00D8FF',
  WARNING: '#F0B41E',
  ERROR: '#FF4040',
  INFO: '#0078FF',
};

export const ROLE_COLORS = {
  TANK: '#38B6FF',
  DAMAGE: '#FF5050',
  SUPPORT: '#50D040',
};

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
};

export const SPACING = {
  XXS: 4,
  XS: 6,
  SM: 8,
  MD: 16,
  LG: 24,
  XL: 32,
  XXL: 48,
};

export const BORDER_RADIUS = {
  SM: 4,
  MD: 8,
  LG: 12,
  XL: 16,
  ROUND: 50,
};

export const ANIMATIONS = {
  FAST: 150,
  NORMAL: 300,
  SLOW: 500,
};

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

export const GLASS_COLORS = {
  PRIMARY_BACKGROUND: 'rgba(250, 156, 30, 0.15)',
  PRIMARY_BORDER: 'rgba(250, 156, 30, 0.3)',
  DARK_BACKGROUND: 'rgba(250, 156, 30, 0.2)',
  DARK_BORDER: 'rgba(250, 156, 30, 0.4)',
  WHITE_BACKGROUND: 'rgba(255, 255, 255, 0.2)',
  WHITE_BORDER: 'rgba(255, 255, 255, 0.3)',
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

    header: {
      paddingHorizontal: 16,
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },

    headerTitle: {
      fontSize: 20,
      textAlign: 'left',
      fontWeight: 'bold',
      marginTop: 16,
    },

    headerSubtitle: {
      fontSize: 14,
      textAlign: 'left',
      marginBottom: 16,
    },

    text: {
      color: theme.text,
      fontSize: TYPOGRAPHY.SIZES.MD,
      textAlign: 'center',
    },

    boldText: {
      fontWeight: TYPOGRAPHY.WEIGHTS.BOLD,
    },

    title: {
      fontWeight: TYPOGRAPHY.WEIGHTS.BOLD,
      fontSize: TYPOGRAPHY.SIZES.XXL,
      marginVertical: SPACING.SM,
    },

    button: {
      backgroundColor: COLORS.PRIMARY,
      padding: SPACING.SM,
      borderRadius: BORDER_RADIUS.SM,
      alignItems: 'center',
      justifyContent: 'space-between',
      flexDirection: 'row',
    },

    disabledButton: {
      backgroundColor: '#ccc',
    },

    buttonText: {
      color: COLORS.WHITE,
      fontSize: TYPOGRAPHY.SIZES.MD,
      fontWeight: TYPOGRAPHY.WEIGHTS.BOLD,
    },

    card: {
      backgroundColor: theme.card,
      borderRadius: BORDER_RADIUS.MD,
      padding: SPACING.MD,
      marginVertical: SPACING.XS,
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
