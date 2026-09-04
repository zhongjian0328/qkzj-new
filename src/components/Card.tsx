import React from 'react';
import { View, Text, StyleSheet, ViewProps } from 'react-native';
import { colors, radii, spacing, typography, shadows } from '../theme';

interface CardProps extends ViewProps {
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  padding?: 'none' | 'small' | 'medium' | 'large';
  shadow?: 'none' | 'small' | 'medium' | 'large';
  borderRadius?: 'small' | 'medium' | 'large' | 'full';
}

const Card: React.FC<CardProps> = ({
  title,
  subtitle,
  children,
  footer,
  padding = 'medium',
  shadow = 'medium',
  borderRadius = 'medium',
  style,
  ...props
}) => {
  const cardStyles = [
    styles.card,
    styles[`${padding}Padding`],
    styles[`${shadow}Shadow`],
    styles[`${borderRadius}Radius`],
    style,
  ];

  return (
    <View style={cardStyles} {...props}>
      {(title || subtitle) && (
        <View style={styles.header}>
          {title && <Text style={styles.title}>{title}</Text>}
          {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
        </View>
      )}
      <View style={styles.content}>{children}</View>
      {footer && <View style={styles.footer}>{footer}</View>}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    overflow: 'hidden',
  },
  nonePadding: { padding: 0 },
  smallPadding: { padding: spacing.md },
  mediumPadding: { padding: spacing.lg },
  largePadding: { padding: spacing.xxl },
  noneShadow: { ...shadows.none },
  smallShadow: { ...shadows.sm },
  mediumShadow: { ...shadows.md },
  largeShadow: { ...shadows.lg },
  smallRadius: { borderRadius: radii.sm },
  mediumRadius: { borderRadius: radii.md },
  largeRadius: { borderRadius: radii.lg },
  fullRadius: { borderRadius: radii.full },
  header: {
    marginBottom: spacing.md,
  },
  title: {
    fontSize: typography.size.subtitle,
    fontWeight: typography.weight.semibold,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  subtitle: {
    fontSize: typography.size.body,
    color: colors.textSecondary,
  },
  content: {
    marginBottom: spacing.md,
  },
  footer: {
    marginTop: spacing.md,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
});

export default Card;
