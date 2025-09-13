import {
  useColorScheme,
  TouchableOpacity,
  Text,
  DimensionValue,
} from 'react-native';
import { getThemedStyles } from '../styles/theme';
import { ReactElement } from 'react';

interface ButtonProps {
  title?: string;
  width?: DimensionValue;
  icon?: ReactElement;
  onPress: () => void;
  disabled?: boolean;
}

export default function Button({
  title,
  icon,
  onPress,
  width = 'auto',
  disabled = false,
}: ButtonProps) {
  const isDarkMode = useColorScheme() === 'dark';
  const styles = getThemedStyles(isDarkMode);

  return (
    <TouchableOpacity
      style={[
        styles.button,
        disabled && styles.disabledButton,
        { width: width },
      ]}
      onPress={onPress}
      disabled={disabled}
    >
      {title && <Text style={styles.buttonText}>{title}</Text>}
      {icon && <>{icon}</>}
    </TouchableOpacity>
  );
}
