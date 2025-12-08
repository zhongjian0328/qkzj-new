

import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { FontAwesome6 } from '@expo/vector-icons';
import styles from './styles';

interface CaseData {
  id: string;
  title: string;
  diagnosis: string;
  status: 'annotated' | 'pending' | 'in-progress';
  date: string;
  image: string;
}

interface CaseItemProps {
  caseData: CaseData;
  onPress: () => void;
}

const CaseItem: React.FC<CaseItemProps> = ({ caseData, onPress }) => {
  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'annotated':
        return styles.statusAnnotated;
      case 'pending':
        return styles.statusPending;
      case 'in-progress':
        return styles.statusInProgress;
      default:
        return styles.statusPending;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'annotated':
        return '已标注';
      case 'pending':
        return '待标注';
      case 'in-progress':
        return '标注中';
      default:
        return '待标注';
    }
  };

  return (
    <TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.content}>
        <Image source={{ uri: caseData.image }} style={styles.image} />
        <View style={styles.info}>
          <Text style={styles.title}>{caseData.title}</Text>
          <Text style={styles.diagnosis}>{caseData.diagnosis}</Text>
          <View style={styles.meta}>
            <View style={[styles.statusBadge, getStatusStyle(caseData.status)]}>
              <Text style={styles.statusText}>{getStatusText(caseData.status)}</Text>
            </View>
            <Text style={styles.date}>{caseData.date}</Text>
          </View>
        </View>
        <FontAwesome6 name="chevron-right" size={16} color="#6B7280" />
      </View>
    </TouchableOpacity>
  );
};

export default CaseItem;

