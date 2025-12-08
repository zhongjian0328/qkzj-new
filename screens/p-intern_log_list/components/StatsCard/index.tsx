

import React from 'react';
import { View, Text } from 'react-native';
import styles from './styles';

interface StatsCardProps {
  value: number;
  label: string;
  color: string;
}

const StatsCard: React.FC<StatsCardProps> = ({ value, label, color }) => {
  return (
    <View style={styles.container}>
      <Text style={[styles.value, { color }]}>{value}</Text>
      <Text style={styles.label}>{label}</Text>
    </View>
  );
};

export default StatsCard;

