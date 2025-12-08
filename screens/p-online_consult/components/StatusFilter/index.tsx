

import React from 'react';
import { View, Text, TouchableOpacity, Modal, FlatList } from 'react-native';
import { FontAwesome6 } from '@expo/vector-icons';
import { StatusFilterProps, ConsultationStatus } from '../../types';
import styles from './styles';

interface FilterOption {
  value: ConsultationStatus;
  label: string;
}

const filterOptions: FilterOption[] = [
  { value: 'all', label: '全部' },
  { value: 'pending', label: '待处理' },
  { value: 'processing', label: '处理中' },
  { value: 'completed', label: '已完成' },
  { value: 'cancelled', label: '已取消' },
];

const StatusFilter: React.FC<StatusFilterProps> = ({
  visible,
  selectedStatus,
  onStatusChange,
  onClose,
}) => {
  const renderFilterOption = ({ item }: { item: FilterOption }) => (
    <TouchableOpacity
      style={[
        styles.optionItem,
        selectedStatus === item.value && styles.selectedOptionItem,
      ]}
      onPress={() => onStatusChange(item.value)}
    >
      <Text
        style={[
          styles.optionText,
          selectedStatus === item.value && styles.selectedOptionText,
        ]}
      >
        {item.label}
      </Text>
      {selectedStatus === item.value && (
        <FontAwesome6 name="check" size={16} color="#3BCCA5" />
      )}
    </TouchableOpacity>
  );

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <TouchableOpacity
          style={styles.overlayTouchable}
          activeOpacity={1}
          onPress={onClose}
        />
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.title}>筛选状态</Text>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <FontAwesome6 name="xmark" size={20} color="#6B7280" />
            </TouchableOpacity>
          </View>

          <FlatList
            data={filterOptions}
            renderItem={renderFilterOption}
            keyExtractor={(item) => item.value}
            style={styles.optionsList}
            showsVerticalScrollIndicator={false}
          />
        </View>
      </View>
    </Modal>
  );
};

export default StatusFilter;

