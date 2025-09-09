import React, {
  useState,
  useRef,
  forwardRef,
  useImperativeHandle,
  useMemo,
  useCallback,
  memo,
} from 'react';
import {
  TextInput,
  View,
  StyleSheet,
  TextInputProps,
  useColorScheme,
  TouchableOpacity,
} from 'react-native';
import { Send, Mic } from 'lucide-react-native';
import { COLORS, GLASS_COLORS, SPACING, TYPOGRAPHY } from '../styles/theme';

interface InputProps extends TextInputProps {
  placeholder?: string;
  value?: string;
  onChangeText?: (text: string) => void;
  onSend?: () => void;
  onMic?: () => void;
}

export interface InputRef {
  focus: () => void;
  blur: () => void;
}

const InputComponent = memo(
  forwardRef<InputRef, InputProps>(
    (
      {
        placeholder,
        value,
        onChangeText,
        style,
        onFocus,
        onBlur,
        onSend,
        onMic,
        ...props
      },
      ref,
    ) => {
      const isDarkMode = useColorScheme() === 'dark';
      const [isFocused, setIsFocused] = useState(false);
      const inputRef = useRef<TextInput>(null);

      useImperativeHandle(
        ref,
        () => ({
          focus: () => inputRef.current?.focus(),
          blur: () => inputRef.current?.blur(),
        }),
        [],
      );

      const handleFocus = useCallback(
        (e: any) => {
          setIsFocused(true);
          onFocus?.(e);
        },
        [onFocus],
      );

      const handleBlur = useCallback(
        (e: any) => {
          setIsFocused(false);
          onBlur?.(e);
        },
        [onBlur],
      );

      const handleSend = useCallback(() => {
        if (value?.trim() && onSend) {
          onSend();
        }
      }, [value, onSend]);

      const handleMic = useCallback(() => {
        onMic?.();
      }, [onMic]);

      const hasText = useMemo(() => Boolean(value?.trim()), [value]);

      const containerStyles = useMemo(
        () => [
          styles.container,
          isDarkMode && styles.containerDark,
          isFocused && styles.containerFocused,
        ],
        [isDarkMode, isFocused],
      );

      const inputStyles = useMemo(
        () => [
          styles.input,
          isDarkMode ? styles.inputDark : styles.inputLight,
          style,
        ],
        [isDarkMode, style],
      );

      const placeholderTextColor = useMemo(
        () => (isDarkMode ? '#AAA' : '#666'),
        [isDarkMode],
      );

      return (
        <View style={containerStyles}>
          <TextInput
            ref={inputRef}
            style={inputStyles}
            placeholder={placeholder}
            cursorColor={COLORS.WHITE}
            placeholderTextColor={placeholderTextColor}
            value={value}
            onChangeText={onChangeText}
            onFocus={handleFocus}
            onBlur={handleBlur}
            {...props}
          />
          {hasText ? (
            <TouchableOpacity
              style={styles.sendButton}
              onPress={handleSend}
              activeOpacity={0.7}
            >
              <Send size={20} color={COLORS.PRIMARY} />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={styles.micButton}
              onPress={handleMic}
              activeOpacity={0.7}
            >
              <Mic size={20} color={COLORS.PRIMARY} />
            </TouchableOpacity>
          )}
        </View>
      );
    },
  ),
);

InputComponent.displayName = 'Input';

const Input = InputComponent;

export default Input;

const styles = StyleSheet.create({
  container: {
    backgroundColor: GLASS_COLORS.PRIMARY_BACKGROUND,
    borderWidth: 1,
    borderColor: GLASS_COLORS.PRIMARY_BORDER,
    borderRadius: 50,
    marginVertical: SPACING.MD,
    flexDirection: 'row',
    alignItems: 'center',
  },
  containerDark: {
    backgroundColor: GLASS_COLORS.DARK_BACKGROUND,
    borderColor: GLASS_COLORS.DARK_BORDER,
  },
  containerFocused: {
    borderColor: COLORS.PRIMARY,
    borderWidth: 2,
  },
  input: {
    flex: 1,
    paddingHorizontal: SPACING.LG,
    paddingVertical: SPACING.MD,
    fontSize: TYPOGRAPHY.SIZES.LG,
    fontWeight: TYPOGRAPHY.WEIGHTS.NORMAL,
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
    borderWidth: 1,
    backgroundColor: GLASS_COLORS.PRIMARY_BACKGROUND,
    borderColor: GLASS_COLORS.PRIMARY_BORDER,
  },
  micButton: {
    marginRight: SPACING.SM,
    padding: SPACING.SM,
    borderRadius: 20,
    borderWidth: 1,
    backgroundColor: GLASS_COLORS.WHITE_BACKGROUND,
    borderColor: GLASS_COLORS.WHITE_BORDER,
  },
});
