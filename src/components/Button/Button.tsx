import { useColorScheme, TouchableOpacity, Text } from 'react-native';
import { getThemedStyles } from '../../../styles';
import { ReactElement } from 'react';

interface ButtonProps {
  title?: string;
  icon?: ReactElement;
  onPress: () => void;
  disabled?: boolean;
}

export default function Button({
  title,
  icon,
  onPress,
  disabled = false,
}: ButtonProps) {
  const isDarkMode = useColorScheme() === 'dark';
  const styles = getThemedStyles(isDarkMode);

  return (
    <TouchableOpacity
      style={[styles.button, disabled && styles.disabledButton]}
      onPress={onPress}
      disabled={disabled}
    >
      {title && <Text style={styles.buttonText}>{title}</Text>}
      {icon && <>{icon}</>}
    </TouchableOpacity>
  );
}
