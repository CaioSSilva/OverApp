import { useColorScheme, TouchableOpacity, Text, ViewStyle } from 'react-native';
import { getThemedStyles } from '../styles/theme';
import { ReactElement } from 'react';

interface ButtonProps {
  title?: string;
  icon?: ReactElement;
  onPress: () => void;
  disabled?: boolean;
  width?: ViewStyle['width'];
}

export default function Button({
  title,
  icon,
  onPress,
  disabled = false,
  width = 'auto',
}: ButtonProps) {
  const isDarkMode = useColorScheme() === 'dark';
  const styles = getThemedStyles(isDarkMode);

  return (
    <TouchableOpacity
      style={[styles.button, disabled && styles.disabledButton, { width: width}]}
      onPress={onPress}
      disabled={disabled}
    >
      {title && <Text style={styles.buttonText}>{title}</Text>}
      {icon && <>{icon}</>}
    </TouchableOpacity>
  );
}
