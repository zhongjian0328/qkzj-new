import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, spacing, component } from '../theme';

interface HeaderProps {
  title: string;
  onBack?: () => void;
  rightComponent?: React.ReactNode;
  showBackButton?: boolean;
  backgroundColor?: string;
  titleColor?: string;
  elevation?: number;
  statusBarStyle?: 'light' | 'dark';
}

const Header: React.FC<HeaderProps> = ({
  title,
  onBack,
  rightComponent,
  showBackButton = false,
  backgroundColor = colors.surface,
  titleColor = colors.textPrimary,
  elevation = 0,
  statusBarStyle = 'dark',
}) => {
  return (
    <>
      <StatusBar
        barStyle={statusBarStyle === 'light' ? 'light-content' : 'dark-content'}
        backgroundColor={backgroundColor}
      />
      <View style={[styles.header, { backgroundColor, elevation }]}>
        <View style={styles.leftContainer}>
          {showBackButton && onBack && (
            <TouchableOpacity
              style={styles.backButton}
              onPress={onBack}
              activeOpacity={0.7}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Ionicons name="chevron-back" size={26} color={colors.primary} />
            </TouchableOpacity>
          )}
        </View>
        <View style={styles.centerContainer}>
          <Text style={[styles.title, { color: titleColor }]} numberOfLines={1}>
            {title}
          </Text>
        </View>
        <View style={styles.rightContainer}>{rightComponent}</View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: component.headerHeight,
    paddingHorizontal: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  leftContainer: {
    width: 48,
    alignItems: 'flex-start',
  },
  centerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rightContainer: {
    width: 48,
    alignItems: 'flex-end',
  },
  backButton: {
    padding: spacing.xs,
  },
  title: {
    fontSize: typography.size.subtitle,
    fontWeight: typography.weight.semibold,
    color: colors.textPrimary,
  },
});

export default Header;
