import {
  useColorScheme,
  TouchableOpacity,
  Text,
  DimensionValue,
  StyleProp,
  ViewStyle,
} from 'react-native';
import { getThemedStyles } from '../styles/theme';
import { ReactNode } from 'react';
import React from 'react';

interface ButtonProps {
  title?: string;
  width?: DimensionValue;
  icon?: ReactNode;
  scale?: number;
  onPress: () => void;
  disabled?: boolean;
  customStyles?: StyleProp<ViewStyle>;
}

export default function Button({
  title,
  icon,
  onPress,
  customStyles,
  width = 'auto',
  disabled = false,
  scale = 1,
}: ButtonProps) {
  const isDarkMode = useColorScheme() === 'dark';
  const styles = getThemedStyles(isDarkMode);

  return (
    <TouchableOpacity
      style={[
        styles.button,
        disabled && styles.disabledButton,
        {
          width: width,
          transform: [
            {
              scale: scale,
            },
          ],
        },
        customStyles,
      ]}
      onPress={onPress}
      disabled={disabled}
    >
      {title && <Text style={styles.buttonText}>{title}</Text>}
      {icon && <>{icon}</>}
    </TouchableOpacity>
  );
}
