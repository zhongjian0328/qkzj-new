import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { colors, radii, spacing, typography } from '../theme';

interface TabProps {
  label: string;
  value: string;
  onPress: (value: string) => void;
  active: boolean;
  disabled?: boolean;
  icon?: React.ReactNode;
}

interface TabViewProps {
  tabs: Array<{ label: string; value: string; icon?: React.ReactNode }>;
  activeTab: string;
  onTabChange: (value: string) => void;
  children: React.ReactNode;
  variant?: 'line' | 'boxed' | 'pills';
  position?: 'top' | 'bottom' | 'left' | 'right';
  scrollable?: boolean;
}

const Tab: React.FC<TabProps> = ({
  label,
  value,
  onPress,
  active,
  disabled = false,
  icon,
}) => {
  return (
    <TouchableOpacity
      style={[
        styles.tab,
        active && styles.activeTab,
        disabled && styles.disabledTab,
      ]}
      onPress={() => onPress(value)}
      disabled={disabled}
      activeOpacity={0.7}
    >
      {icon && <View style={styles.icon}>{icon}</View>}
      <Text
        style={[
          styles.tabText,
          active && styles.activeTabText,
          disabled && styles.disabledTabText,
        ]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
};

const TabView: React.FC<TabViewProps> = ({
  tabs,
  activeTab,
  onTabChange,
  children,
  variant = 'line',
  position = 'top',
  scrollable = false,
}) => {
  const TabContainer = scrollable ? ScrollView : View;
  const tabContainerStyles = [
    styles.tabContainer,
    styles[position],
    variant === 'boxed' && styles.boxed,
    variant === 'pills' && styles.pills,
  ];

  return (
    <View style={styles.container}>
      <TabContainer
        horizontal={scrollable}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={tabContainerStyles}
      >
        {tabs.map((tab) => (
          <Tab
            key={tab.value}
            label={tab.label}
            value={tab.value}
            onPress={onTabChange}
            active={activeTab === tab.value}
            icon={tab.icon}
          />
        ))}
      </TabContainer>
      <View style={styles.content}>{children}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  top: {
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  bottom: {
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  left: {
    flexDirection: 'column',
    borderRightWidth: 1,
    borderRightColor: colors.border,
    width: 120,
  },
  right: {
    flexDirection: 'column',
    borderLeftWidth: 1,
    borderLeftColor: colors.border,
    width: 120,
  },
  boxed: {
    borderRadius: radii.sm,
    overflow: 'hidden',
  },
  pills: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.sm,
    gap: spacing.sm,
  },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: colors.primary,
  },
  disabledTab: {
    opacity: 0.5,
  },
  tabText: {
    fontSize: typography.size.body,
    fontWeight: typography.weight.medium,
    color: colors.textTertiary,
  },
  activeTabText: {
    color: colors.primary,
    fontWeight: typography.weight.semibold,
  },
  disabledTabText: {
    color: colors.textDisabled,
  },
  icon: {
    marginRight: spacing.sm,
  },
  content: {
    flex: 1,
  },
});

export { Tab, TabView };
