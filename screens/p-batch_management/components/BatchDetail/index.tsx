

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

interface BatchDetailProps {
  batch: BatchData | null;
  onBackToList: () => void;
  onRecordData: () => void;
  onViewHistory: () => void;
}

const BatchDetail: React.FC<BatchDetailProps> = ({
  batch,
  onBackToList,
  onRecordData,
  onViewHistory,
}) => {
  if (!batch) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>批次信息加载失败</Text>
        <TouchableOpacity style={styles.backButton} onPress={onBackToList}>
          <FontAwesome6 name="arrow-left" size={14} color="#6B7280" />
          <Text style={styles.backButtonText}>返回列表</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const formatNumber = (num: number): string => {
    return num.toLocaleString();
  };

  const calculateDeathRate = (): string => {
    const deathCount = batch.initialQuantity - batch.currentQuantity;
    const deathRate = (deathCount / batch.initialQuantity) * 100;
    return `${deathRate.toFixed(2)}%`;
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

  return (
    <View style={styles.container}>
      {/* 页面头部 */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>批次详情</Text>
        <TouchableOpacity style={styles.backButton} onPress={onBackToList}>
          <FontAwesome6 name="arrow-left" size={14} color="#6B7280" />
          <Text style={styles.backButtonText}>返回列表</Text>
        </TouchableOpacity>
      </View>

      {/* 基本信息 */}
      <View style={styles.infoCard}>
        <Text style={styles.cardTitle}>基本信息</Text>
        <View style={styles.infoList}>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>批次名称：</Text>
            <Text style={styles.infoValue}>{batch.name}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>禽类品种：</Text>
            <Text style={styles.infoValue}>{batch.species}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>初始数量：</Text>
            <Text style={styles.infoValue}>{formatNumber(batch.initialQuantity)}只</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>入栏日期：</Text>
            <Text style={styles.infoValue}>{batch.entryDate}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>当前状态：</Text>
            <View style={[styles.statusBadge, getStatusStyle(batch.status)]}>
              <Text style={[styles.statusText, getStatusTextStyle(batch.status)]}>
                {getStatusText(batch.status)}
              </Text>
            </View>
          </View>
        </View>
      </View>

      {/* 实时数据 */}
      <View style={styles.dataCard}>
        <Text style={styles.cardTitle}>实时数据</Text>
        <View style={styles.dataGrid}>
          <View style={styles.dataItem}>
            <Text style={styles.dataValue}>{formatNumber(batch.currentQuantity)}</Text>
            <Text style={styles.dataLabel}>当前存栏</Text>
          </View>
          <View style={styles.dataItem}>
            <Text style={styles.dataValue}>{calculateDeathRate()}</Text>
            <Text style={styles.dataLabel}>死淘率</Text>
          </View>
          <View style={styles.dataItem}>
            <Text style={styles.dataValue}>2.8吨</Text>
            <Text style={styles.dataLabel}>累计耗料</Text>
          </View>
          <View style={styles.dataItem}>
            <Text style={styles.dataValue}>{batch.daysOld}天</Text>
            <Text style={styles.dataLabel}>养殖天数</Text>
          </View>
        </View>
      </View>

      {/* 操作按钮 */}
      <View style={styles.actionButtons}>
        <TouchableOpacity style={styles.primaryButton} onPress={onRecordData}>
          <FontAwesome6 name="plus" size={16} color="#FFFFFF" />
          <Text style={styles.primaryButtonText}>录入数据</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.secondaryButton} onPress={onViewHistory}>
          <FontAwesome6 name="chart-line" size={16} color="#6B7280" />
          <Text style={styles.secondaryButtonText}>查看历史</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default BatchDetail;

