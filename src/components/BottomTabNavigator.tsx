import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { colors, spacing, typography, component } from '../theme';

interface TabItem {
  label: string;
  icon: string;
  route: string;
}

interface BottomTabNavigatorProps {
  tabs: TabItem[];
  activeTab: string;
  onTabPress: (route: string) => void;
  backgroundColor?: string;
  activeColor?: string;
  inactiveColor?: string;
  height?: number;
}

const BottomTabNavigator: React.FC<BottomTabNavigatorProps> = ({
  tabs,
  activeTab,
  onTabPress,
  backgroundColor = colors.surface,
  activeColor = colors.primary,
  inactiveColor = colors.textDisabled,
  height = component.tabBarHeight,
}) => {
  return (
    <View style={[styles.container, { backgroundColor, height }]}>
      {tabs.map((tab) => {
        const isActive = activeTab === tab.route;
        return (
          <TouchableOpacity
            key={tab.route}
            style={styles.tab}
            onPress={() => onTabPress(tab.route)}
            activeOpacity={0.7}
          >
            <Text
              style={[
                styles.icon,
                { color: isActive ? activeColor : inactiveColor },
              ]}
            >
              {tab.icon}
            </Text>
            <Text
              style={[
                styles.label,
                { color: isActive ? activeColor : inactiveColor },
                isActive && styles.activeLabel,
              ]}
            >
              {tab.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingBottom: spacing.sm,
    paddingTop: spacing.sm,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 4,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    fontSize: 24,
    marginBottom: spacing.xs,
  },
  label: {
    fontSize: typography.size.caption,
    fontWeight: typography.weight.medium,
  },
  activeLabel: {
    fontWeight: typography.weight.semibold,
  },
});

export default BottomTabNavigator;
