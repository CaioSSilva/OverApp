import React, {
  useState,
  useRef,
  forwardRef,
  useImperativeHandle,
} from 'react';
import {
  TextInput,
  View,
  StyleSheet,
  TextInputProps,
  useColorScheme,
  TouchableOpacity,
} from 'react-native';
import { Send } from 'lucide-react-native';
import { COLORS, SPACING, TYPOGRAPHY } from '../styles/theme';

interface InputProps extends TextInputProps {
  placeholder?: string;
  value?: string;
  onChangeText?: (text: string) => void;
  onSend?: () => void;
}

export interface InputRef {
  focus: () => void;
  blur: () => void;
}

const Input = forwardRef<InputRef, InputProps>(
  (
    {
      placeholder,
      value,
      onChangeText,
      style,
      onFocus,
      onBlur,
      onSend,
      ...props
    },
    ref,
  ) => {
    const isDarkMode = useColorScheme() === 'dark';
    const [isFocused, setIsFocused] = useState(false);
    const inputRef = useRef<TextInput>(null);

    useImperativeHandle(ref, () => ({
      focus: () => inputRef.current?.focus(),
      blur: () => inputRef.current?.blur(),
    }));

    const handleFocus = (e: any) => {
      setIsFocused(true);
      onFocus?.(e);
    };

    const handleBlur = (e: any) => {
      setIsFocused(false);
      onBlur?.(e);
    };

    const handleSend = () => {
      if (value?.trim() && onSend) {
        onSend();
      }
    };

    const containerStyles = [
      styles.container,
      isDarkMode && styles.containerDark,
      isFocused && styles.containerFocused,
      isFocused && isDarkMode && styles.containerFocusedDark,
    ];

    const inputStyles = [
      styles.input,
      isDarkMode ? styles.inputDark : styles.inputLight,
      style,
    ];

    return (
      <View style={containerStyles}>
        <TextInput
          ref={inputRef}
          style={inputStyles}
          placeholder={placeholder}
          cursorColor={COLORS.WHITE}
          placeholderTextColor={isDarkMode ? '#AAA' : '#666'}
          value={value}
          onChangeText={onChangeText}
          onFocus={handleFocus}
          onBlur={handleBlur}
          {...props}
        />
        {value?.trim() && (
          <TouchableOpacity
            style={styles.sendButton}
            onPress={handleSend}
            activeOpacity={0.7}
          >
            <Send size={20} color={COLORS.PRIMARY} />
          </TouchableOpacity>
        )}
      </View>
    );
  },
);

Input.displayName = 'Input';

export default Input;

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(250, 156, 30, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(250, 156, 30, 0.3)',
    borderRadius: 50,
    marginVertical: SPACING.MD,
    shadowColor: COLORS.PRIMARY,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 5,
    flexDirection: 'row',
    alignItems: 'center',
  },
  containerDark: {
    backgroundColor: 'rgba(250, 156, 30, 0.2)',
    borderColor: 'rgba(250, 156, 30, 0.4)',
  },
  containerFocused: {
    borderColor: COLORS.PRIMARY,
    borderWidth: 2,
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 8,
  },
  containerFocusedDark: {
    borderColor: COLORS.PRIMARY,
    borderWidth: 2,
  },
  input: {
    flex: 1,
    paddingHorizontal: SPACING.LG,
    paddingVertical: SPACING.MD,
    fontSize: TYPOGRAPHY.SIZES.LG,
    fontWeight: TYPOGRAPHY.WEIGHTS.NORMAL,
    color: '#333',
    borderRadius: 50,
    backgroundColor: 'transparent',
  },
  inputLight: {
    color: '#333',
  },
  inputDark: {
    color: '#FFF',
  },
  sendButton: {
    marginRight: SPACING.SM,
    padding: SPACING.SM,
    borderRadius: 20,
    backgroundColor: 'rgba(250, 156, 30, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(250, 156, 30, 0.3)',
  },
});
