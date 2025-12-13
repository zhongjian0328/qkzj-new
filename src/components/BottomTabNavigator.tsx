import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

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
  backgroundColor = '#FFFFFF',
  activeColor = '#2DBBA1',
  inactiveColor = '#9CA3AF',
  height = 64,
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
    borderTopColor: '#E5E7EB',
    paddingBottom: 8,
    paddingTop: 8,
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
    marginBottom: 4,
  },
  label: {
    fontSize: 12,
    fontWeight: '500',
  },
  activeLabel: {
    fontWeight: '600',
  },
});

export default BottomTabNavigator;