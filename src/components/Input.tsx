import React, { useState } from 'react';
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  TextInputProps,
  TouchableOpacity,
} from 'react-native';
import { colors, radii, typography, spacing, component } from '../theme';

export type InputVariant = 'primary' | 'outline';
export type InputSize = 'small' | 'medium' | 'large';
export type InputType = 'text' | 'password' | 'number' | 'email' | 'phone';

interface InputProps extends TextInputProps {
  label?: string;
  placeholder?: string;
  variant?: InputVariant;
  size?: InputSize;
  type?: InputType;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  containerStyle?: any;
  inputStyle?: any;
  labelStyle?: any;
}

const Input: React.FC<InputProps> = ({
  label,
  placeholder,
  variant = 'outline',
  size = 'medium',
  type = 'text',
  error,
  helperText,
  leftIcon,
  rightIcon,
  containerStyle,
  inputStyle,
  labelStyle,
  secureTextEntry,
  ...props
}) => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [focused, setFocused] = useState(false);

  const isPassword = type === 'password';

  const inputContainerStyles = [
    styles.inputContainer,
    styles[variant],
    styles[`${size}Size`],
    focused && styles.focused,
    error && styles.inputError,
  ];

  const labelStyles = [styles.label, error && styles.labelError, labelStyle];

  return (
    <View style={[styles.container, containerStyle]}>
      {label && <Text style={labelStyles}>{label}</Text>}
      <View style={inputContainerStyles}>
        {leftIcon && <View style={styles.leftIcon}>{leftIcon}</View>}
        <TextInput
          style={[styles.input, styles[`${size}Input`], inputStyle]}
          placeholder={placeholder}
          placeholderTextColor={colors.textDisabled}
          secureTextEntry={isPassword ? !isPasswordVisible : secureTextEntry}
          keyboardType={
            type === 'number'
              ? 'numeric'
              : type === 'email'
              ? 'email-address'
              : type === 'phone'
              ? 'phone-pad'
              : 'default'
          }
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          {...props}
        />
        {isPassword && (
          <TouchableOpacity
            onPress={() => setIsPasswordVisible(!isPasswordVisible)}
            style={styles.passwordToggle}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Text style={styles.passwordToggleText}>
              {isPasswordVisible ? '隐藏' : '显示'}
            </Text>
          </TouchableOpacity>
        )}
        {rightIcon && !isPassword && <View style={styles.rightIcon}>{rightIcon}</View>}
      </View>
      {error ? (
        <Text style={styles.errorText}>{error}</Text>
      ) : helperText ? (
        <Text style={styles.helperText}>{helperText}</Text>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.lg,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
  },
  input: {
    flex: 1,
    color: colors.textPrimary,
    fontSize: typography.size.bodyLarge,
    paddingVertical: 0,
  },
  primary: {
    backgroundColor: colors.surfaceMuted,
    borderWidth: 1,
    borderColor: colors.surfaceMuted,
  },
  outline: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  focused: {
    borderColor: colors.primary,
  },
  smallSize: {
    height: component.inputHeight.small,
    borderRadius: radii.xs,
    paddingHorizontal: spacing.md,
  },
  mediumSize: {
    height: component.inputHeight.medium,
    borderRadius: radii.sm,
    paddingHorizontal: spacing.lg,
  },
  largeSize: {
    height: component.inputHeight.large,
    borderRadius: radii.md,
    paddingHorizontal: spacing.xl,
  },
  smallInput: { fontSize: typography.size.body },
  mediumInput: { fontSize: typography.size.bodyLarge },
  largeInput: { fontSize: typography.size.subtitle },
  leftIcon: { marginRight: spacing.md },
  rightIcon: { marginLeft: spacing.md },
  passwordToggle: { padding: spacing.xs },
  passwordToggleText: {
    fontSize: typography.size.body,
    color: colors.primary,
    fontWeight: typography.weight.medium,
  },
  label: {
    fontSize: typography.size.body,
    fontWeight: typography.weight.medium,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  inputError: {
    borderColor: colors.error,
    backgroundColor: colors.errorLight,
  },
  labelError: { color: colors.error },
  errorText: {
    fontSize: typography.size.caption,
    color: colors.error,
    marginTop: spacing.xs,
  },
  helperText: {
    fontSize: typography.size.caption,
    color: colors.textTertiary,
    marginTop: spacing.xs,
  },
});

export default Input;
