

import React from 'react';
import { View, Text } from 'react-native';
import { StatsCardProps } from '../../types';
import styles from './styles';

const StatsCard: React.FC<StatsCardProps> = ({ count, label, color }) => {
  return (
    <View style={styles.container}>
      <Text style={[styles.count, { color }]}>{count}</Text>
      <Text style={styles.label}>{label}</Text>
    </View>
  );
};

export default StatsCard;

