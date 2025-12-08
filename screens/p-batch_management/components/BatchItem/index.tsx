

import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { FontAwesome6 } from '@expo/vector-icons';
import styles from './styles';

interface BatchData {
  id: string;
  name: string;
  species: string;
  initialQuantity: number;
  currentQuantity: number;
  daysOld: number;
  entryDate: string;
  status: 'active' | 'completed';
  icon: string;
}

interface BatchItemProps {
  batch: BatchData;
  onPress: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

const BatchItem: React.FC<BatchItemProps> = ({ batch, onPress, onEdit, onDelete }) => {
  const formatNumber = (num: number): string => {
    return num.toLocaleString();
  };

  const getStatusText = (status: string): string => {
    return status === 'active' ? '养殖中' : '已出栏';
  };

  const getStatusStyle = (status: string) => {
    return status === 'active' ? styles.statusActive : styles.statusCompleted;
  };

  const getStatusTextStyle = (status: string) => {
    return status === 'active' ? styles.statusTextActive : styles.statusTextCompleted;
  };

  const getQuantityLabel = (status: string): string => {
    return status === 'active' ? '当前存栏' : '出栏数量';
  };

  const getDaysLabel = (status: string): string => {
    return status === 'active' ? '养殖天数' : '养殖周期';
  };

  const getDateLabel = (status: string): string => {
    return status === 'active' ? '入栏日期：' : '出栏日期：';
  };

  const handleEditPress = (event: any) => {
    event.stopPropagation();
    onEdit();
  };

  const handleDeletePress = (event: any) => {
    event.stopPropagation();
    onDelete();
  };

  const handleViewPress = (event: any) => {
    event.stopPropagation();
    onPress();
  };

  return (
    <TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={0.7}>
      {/* 批次基本信息 */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={styles.iconContainer}>
            <FontAwesome6 name={batch.icon as any} size={20} color="#3BCCA5" />
          </View>
          <View style={styles.batchInfo}>
            <Text style={styles.batchName}>{batch.name}</Text>
            <Text style={styles.batchSpecies}>{batch.species}</Text>
          </View>
        </View>
        <View style={[styles.statusBadge, getStatusStyle(batch.status)]}>
          <Text style={[styles.statusText, getStatusTextStyle(batch.status)]}>
            {getStatusText(batch.status)}
          </Text>
        </View>
      </View>

      {/* 批次数据 */}
      <View style={styles.dataGrid}>
        <View style={styles.dataItem}>
          <Text style={styles.dataValue}>{formatNumber(batch.initialQuantity)}</Text>
          <Text style={styles.dataLabel}>初始数量</Text>
        </View>
        <View style={styles.dataItem}>
          <Text style={styles.dataValue}>{formatNumber(batch.currentQuantity)}</Text>
          <Text style={styles.dataLabel}>{getQuantityLabel(batch.status)}</Text>
        </View>
        <View style={styles.dataItem}>
          <Text style={styles.dataValue}>{batch.daysOld}天</Text>
          <Text style={styles.dataLabel}>{getDaysLabel(batch.status)}</Text>
        </View>
      </View>

      {/* 底部信息和操作 */}
      <View style={styles.footer}>
        <Text style={styles.dateText}>{getDateLabel(batch.status)}{batch.entryDate}</Text>
        <View style={styles.actionButtons}>
          {batch.status === 'active' ? (
            <>
              <TouchableOpacity style={styles.editButton} onPress={handleEditPress}>
                <FontAwesome6 name="pen" size={12} color="#6B7280" />
                <Text style={styles.editButtonText}>编辑</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.deleteButton} onPress={handleDeletePress}>
                <FontAwesome6 name="trash" size={12} color="#DC2626" />
                <Text style={styles.deleteButtonText}>删除</Text>
              </TouchableOpacity>
            </>
          ) : (
            <TouchableOpacity style={styles.viewButton} onPress={handleViewPress}>
              <FontAwesome6 name="eye" size={12} color="#6B7280" />
              <Text style={styles.viewButtonText}>查看详情</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default BatchItem;

