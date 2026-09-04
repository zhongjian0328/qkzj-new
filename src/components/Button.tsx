import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacityProps,
} from 'react-native';
import { colors, radii, typography, spacing, shadows, component } from '../theme';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'text';
export type ButtonSize = 'small' | 'medium' | 'large';

interface ButtonProps extends TouchableOpacityProps {
  title?: string;
  children?: React.ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: React.ReactNode;
  loading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  title,
  children,
  variant = 'primary',
  size = 'medium',
  icon,
  loading = false,
  disabled = false,
  fullWidth = false,
  style,
  onPress,
  ...props
}) => {
  const isDisabled = disabled || loading;

  const buttonStyles = [
    styles.button,
    styles[variant],
    styles[`${size}Size`],
    fullWidth && styles.fullWidth,
    isDisabled && styles.disabled,
    style,
  ];

  const textStyles = [
    styles.buttonText,
    styles[`${variant}Text`],
    styles[`${size}Text`],
    isDisabled && styles.disabledText,
  ];

  return (
    <TouchableOpacity
      style={buttonStyles}
      onPress={onPress}
      disabled={isDisabled}
      activeOpacity={0.85}
      {...props}
    >
      {loading ? (
        <ActivityIndicator
          size="small"
          color={variant === 'outline' || variant === 'text' ? colors.primary : colors.textOnPrimary}
        />
      ) : (
        <>
          {children ? (
            children
          ) : (
            <>
              {icon && <>{icon}</>}
              {title ? <Text style={textStyles}>{title}</Text> : null}
            </>
          )}
        </>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radii.md,
    gap: spacing.sm,
  },
  fullWidth: {
    width: '100%',
  },
  // 变体
  primary: {
    backgroundColor: colors.primary,
    ...shadows.primary,
  },
  secondary: {
    backgroundColor: colors.primaryDark,
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: colors.primary,
  },
  text: {
    backgroundColor: 'transparent',
    paddingHorizontal: 0,
  },
  // 尺寸（高度取整保证触摸目标）
  smallSize: {
    height: component.buttonHeight.small,
    paddingHorizontal: spacing.md,
  },
  mediumSize: {
    height: component.buttonHeight.medium,
    paddingHorizontal: spacing.lg,
  },
  largeSize: {
    height: component.buttonHeight.large,
    paddingHorizontal: spacing.xl,
  },
  disabled: {
    opacity: 0.45,
  },
  // 文本
  buttonText: {
    fontWeight: typography.weight.semibold,
    textAlign: 'center',
  },
  primaryText: {
    color: colors.textOnPrimary,
  },
  secondaryText: {
    color: colors.textOnDark,
  },
  outlineText: {
    color: colors.primary,
  },
  textText: {
    color: colors.primary,
  },
  smallText: {
    fontSize: typography.size.body,
  },
  mediumText: {
    fontSize: typography.size.bodyLarge,
  },
  largeText: {
    fontSize: typography.size.bodyLarge,
  },
  disabledText: {
    color: colors.textDisabled,
  },
});

export default Button;
