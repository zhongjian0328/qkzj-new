import { colors } from '../theme';
import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, FlatList, Modal, TextInput, ActivityIndicator, Alert, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import Header from '../components/Header';
import { styles } from '../styles';
import { productionApi } from '../services/api';

interface Batch {
  id: string;
  batchName: string;
  species: string;
  initialQuantity: number;
  currentQuantity: number;
  entryDate: string;
  status: string;
}

const BatchManagementScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  
  const [batches, setBatches] = useState<Batch[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingBatch, setEditingBatch] = useState<Batch | null>(null);
  
  // 表单数据
  const [formData, setFormData] = useState({
    batchName: '',
    species: '',
    initialQuantity: '',
    entryDate: ''
  });

  useEffect(() => {
    fetchBatches();
  }, []);

  const fetchBatches = async () => {
    setLoading(true);
    try {
      // 调用API获取批次列表
      const response = await productionApi.getBatches();
      setBatches(response.data || []);
    } catch (error) {
      console.error('获取批次列表失败:', error);
      Alert.alert('错误', '获取批次列表失败');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateBatch = async () => {
    if (!formData.batchName || !formData.species || !formData.initialQuantity || !formData.entryDate) {
      Alert.alert('提示', '请填写完整信息');
      return;
    }

    setLoading(true);
    try {
      await productionApi.createBatch({
        batchName: formData.batchName,
        species: formData.species,
        initialQuantity: parseInt(formData.initialQuantity),
        entryDate: formData.entryDate
      });
      
      Alert.alert('成功', '批次创建成功');
      resetForm();
      setModalVisible(false);
      fetchBatches();
    } catch (error) {
      console.error('创建批次失败:', error);
      Alert.alert('错误', '创建批次失败');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateBatch = async () => {
    if (!editingBatch) return;
    
    setLoading(true);
    try {
      await productionApi.updateBatch(editingBatch.id, {
        batchName: formData.batchName,
        species: formData.species,
        currentQuantity: parseInt(formData.initialQuantity)
      });
      
      Alert.alert('成功', '批次更新成功');
      resetForm();
      setModalVisible(false);
      fetchBatches();
    } catch (error) {
      console.error('更新批次失败:', error);
      Alert.alert('错误', '更新批次失败');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteBatch = async (batchId: string) => {
    Alert.alert(
      '确认删除',
      '确定要删除这个批次吗？',
      [
        { text: '取消', style: 'cancel' },
        {
          text: '删除',
          style: 'destructive',
          onPress: async () => {
            setLoading(true);
            try {
              await productionApi.deleteBatch(batchId);
              Alert.alert('成功', '批次删除成功');
              fetchBatches();
            } catch (error) {
              console.error('删除批次失败:', error);
              Alert.alert('错误', '删除批次失败');
            } finally {
              setLoading(false);
            }
          }
        }
      ]
    );
  };

  const resetForm = () => {
    setFormData({
      batchName: '',
      species: '',
      initialQuantity: '',
      entryDate: ''
    });
    setEditingBatch(null);
  };

  const [exporting, setExporting] = useState(false);

  const handleExportData = async () => {
    if (batches.length === 0) {
      Alert.alert('提示', '当前无批次数据可导出');
      return;
    }
    setExporting(true);
    try {
      // 生成CSV数据
      const headers = ['批次名称', '品种', '初始数量', '当前数量', '入场日期', '状态'];
      const rows = batches.map(b => [b.batchName, b.species, b.initialQuantity, b.currentQuantity, b.entryDate, b.status === 'ACTIVE' ? '进行中' : '已结束']);
      const csv = '﻿' + [headers, ...rows].map(r => r.join(',')).join('\n');

      if (Platform.OS === 'web') {
        // Web端：触发浏览器下载
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `生产数据_${new Date().toISOString().slice(0, 10)}.csv`;
        a.click();
        URL.revokeObjectURL(url);
        Alert.alert('成功', '数据已导出');
      } else {
        // 移动端：调用后端API导出
        try {
          const firstBatch = batches[0];
          const response = await productionApi.exportProductionData({ batchId: firstBatch.id });
          Alert.alert('成功', '数据导出请求已提交');
        } catch (err) {
          Alert.alert('错误', '数据导出失败');
        }
      }
    } catch (err) {
      console.error('导出失败:', err);
      Alert.alert('错误', '数据导出失败');
    } finally {
      setExporting(false);
    }
  };

  const renderBatchItem = ({ item }: { item: Batch }) => {
    return (
      <View style={styles.batchItem}>
        <View style={styles.batchItemHeader}>
          <Text style={styles.batchItemTitle}>{item.batchName}</Text>
          <Text style={[styles.batchItemStatus, item.status === 'ACTIVE' ? styles.batchStatusActive : styles.batchStatusInactive]}>
            {item.status === 'ACTIVE' ? '进行中' : '已结束'}
          </Text>
        </View>
        <View style={styles.batchItemContent}>
          <Text style={styles.batchItemInfo}>品种: {item.species}</Text>
          <Text style={styles.batchItemInfo}>初始数量: {item.initialQuantity}</Text>
          <Text style={styles.batchItemInfo}>当前数量: {item.currentQuantity}</Text>
          <Text style={styles.batchItemInfo}>入场日期: {item.entryDate}</Text>
        </View>
        <View style={styles.batchItemActions}>
          <TouchableOpacity
            style={[styles.actionButton, styles.editButton]}
            onPress={() => {
              setEditingBatch(item);
              setFormData({
                batchName: item.batchName,
                species: item.species,
                initialQuantity: item.currentQuantity.toString(),
                entryDate: item.entryDate
              });
              setModalVisible(true);
            }}
          >
            <Text style={styles.actionButtonText}>编辑</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionButton, styles.deleteButton]}
            onPress={() => handleDeleteBatch(item.id)}
          >
            <Text style={styles.actionButtonText}>删除</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Header 
        title="批次管理" 
        showBackButton 
        onBack={() => navigation.goBack()} 
        rightComponent={
          <View style={{ flexDirection: 'row', gap: 16 }}>
            <TouchableOpacity onPress={handleExportData} disabled={exporting} style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
              <Ionicons name="download-outline" size={18} color={colors.primary} />
              <Text style={{ color: colors.primary, fontSize: 14 }}>{exporting ? '导出中...' : '导出'}</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setModalVisible(true)}>
              <Text style={{ color: colors.primary, fontSize: 16 }}>新增</Text>
            </TouchableOpacity>
          </View>
        }
      />
      
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : (
        <FlatList
          data={batches}
          renderItem={renderBatchItem}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.batchList}
          showsVerticalScrollIndicator={false}
        />
      )}
      
      {/* 新增/编辑模态框 */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {editingBatch ? '编辑批次' : '新增批次'}
              </Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Text style={styles.modalCloseButton}>×</Text>
              </TouchableOpacity>
            </View>
            
            <View style={styles.modalBody}>
              <TextInput
                style={styles.modalInput}
                placeholder="批次名称"
                value={formData.batchName}
                onChangeText={(value) => setFormData({ ...formData, batchName: value })}
              />
              <TextInput
                style={styles.modalInput}
                placeholder="品种"
                value={formData.species}
                onChangeText={(value) => setFormData({ ...formData, species: value })}
              />
              <TextInput
                style={styles.modalInput}
                placeholder="初始数量"
                value={formData.initialQuantity}
                onChangeText={(value) => setFormData({ ...formData, initialQuantity: value })}
                keyboardType="numeric"
              />
              <TextInput
                style={styles.modalInput}
                placeholder="入场日期 (YYYY-MM-DD)"
                value={formData.entryDate}
                onChangeText={(value) => setFormData({ ...formData, entryDate: value })}
              />
            </View>
            
            <View style={styles.modalFooter}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.modalButtonText}>取消</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.submitButton]}
                onPress={editingBatch ? handleUpdateBatch : handleCreateBatch}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color={colors.surface} />
                ) : (
                  <Text style={styles.modalButtonText}>
                    {editingBatch ? '更新' : '创建'}
                  </Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default BatchManagementScreen;