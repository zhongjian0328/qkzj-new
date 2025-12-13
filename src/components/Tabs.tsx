import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';

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
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  top: {
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  bottom: {
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  left: {
    flexDirection: 'column',
    borderRightWidth: 1,
    borderRightColor: '#E5E7EB',
    width: 120,
  },
  right: {
    flexDirection: 'column',
    borderLeftWidth: 1,
    borderLeftColor: '#E5E7EB',
    width: 120,
  },
  boxed: {
    borderRadius: 8,
    overflow: 'hidden',
  },
  pills: {
    paddingHorizontal: 8,
    paddingVertical: 8,
    gap: 8,
  },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#2DBBA1',
  },
  disabledTab: {
    opacity: 0.5,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
  },
  activeTabText: {
    color: '#2DBBA1',
    fontWeight: '600',
  },
  disabledTabText: {
    color: '#9CA3AF',
  },
  icon: {
    marginRight: 8,
  },
  content: {
    flex: 1,
  },
});

export { Tab, TabView };