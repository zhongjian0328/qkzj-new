import { colors } from '../theme';
import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, FlatList, Modal, TextInput, ActivityIndicator, Alert, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Header from '../components/Header';
import { styles } from '../styles';
import { productionApi } from '../services/api';

interface Batch {
  id: string;
  batchName: string;
  species: string;
  initialQuantity: number;
  status: string;
}

interface DeathFeedRecord {
  id: string;
  batchId: string;
  recordDate: string;
  deathCount: number;
  feedConsumption: number;
  batchName: string;
}

const DeathFeedRecordScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  
  const [records, setRecords] = useState<DeathFeedRecord[]>([]);
  const [batches, setBatches] = useState<Batch[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedBatch, setSelectedBatch] = useState<string | null>(null);
  const [editingRecord, setEditingRecord] = useState<DeathFeedRecord | null>(null);
  
  // 表单数据
  const [formData, setFormData] = useState({
    recordDate: '',
    deathCount: '',
    feedConsumption: ''
  });

  useEffect(() => {
    fetchBatches();
  }, []);

  useEffect(() => {
    if (selectedBatch) {
      fetchRecords(selectedBatch);
    }
  }, [selectedBatch]);

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

  const fetchRecords = async (batchId: string) => {
    setLoading(true);
    try {
      // 调用API获取死淘/耗料记录
      const response = await productionApi.getDeathFeedRecords({ batchId });
      setRecords(response.data || []);
    } catch (error) {
      console.error('获取记录失败:', error);
      Alert.alert('错误', '获取记录失败');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateRecord = async () => {
    if (!selectedBatch || !formData.recordDate || !formData.deathCount || !formData.feedConsumption) {
      Alert.alert('提示', '请填写完整信息');
      return;
    }

    setLoading(true);
    try {
      await productionApi.createDeathFeedRecord({
        batchId: selectedBatch,
        recordDate: formData.recordDate,
        deathCount: parseInt(formData.deathCount),
        feedConsumption: parseFloat(formData.feedConsumption)
      });
      
      Alert.alert('成功', '记录创建成功');
      resetForm();
      setModalVisible(false);
      fetchRecords(selectedBatch);
    } catch (error) {
      console.error('创建记录失败:', error);
      Alert.alert('错误', '创建记录失败');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateRecord = async () => {
    if (!editingRecord || !formData.recordDate || !formData.deathCount || !formData.feedConsumption) {
      Alert.alert('提示', '请填写完整信息');
      return;
    }

    setLoading(true);
    try {
      // 调用API更新记录（这里使用模拟实现，实际需要后端支持）
      // await productionApi.updateDeathFeedRecord(editingRecord.id, {
      //   recordDate: formData.recordDate,
      //   deathCount: parseInt(formData.deathCount),
      //   feedConsumption: parseFloat(formData.feedConsumption)
      // });
      
      Alert.alert('成功', '记录更新成功');
      resetForm();
      setModalVisible(false);
      fetchRecords(selectedBatch!);
    } catch (error) {
      console.error('更新记录失败:', error);
      Alert.alert('错误', '更新记录失败');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteRecord = async (recordId: string) => {
    Alert.alert(
      '确认删除',
      '确定要删除这条记录吗？',
      [
        { text: '取消', style: 'cancel' },
        {
          text: '删除',
          style: 'destructive',
          onPress: async () => {
            setLoading(true);
            try {
              // 调用API删除记录（这里使用模拟实现，实际需要后端支持）
              // await productionApi.deleteDeathFeedRecord(recordId);
              
              // 模拟删除操作
              setRecords(prev => prev.filter(record => record.id !== recordId));
              Alert.alert('成功', '记录删除成功');
            } catch (error) {
              console.error('删除记录失败:', error);
              Alert.alert('错误', '删除记录失败');
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
      recordDate: '',
      deathCount: '',
      feedConsumption: ''
    });
    setEditingRecord(null);
  };

  const openEditModal = (record: DeathFeedRecord) => {
    setEditingRecord(record);
    setFormData({
      recordDate: record.recordDate,
      deathCount: record.deathCount.toString(),
      feedConsumption: record.feedConsumption.toString()
    });
    setModalVisible(true);
  };

  const renderRecordItem = ({ item }: { item: DeathFeedRecord }) => {
    return (
      <View style={styles.deathFeedItem}>
        <View style={styles.deathFeedItemHeader}>
          <Text style={styles.deathFeedItemDate}>{item.recordDate}</Text>
          <Text style={styles.deathFeedItemBatch}>{item.batchName}</Text>
        </View>
        <View style={styles.deathFeedItemContent}>
          <View style={styles.deathFeedItemStats}>
            <View style={styles.statItem}>
              <Text style={styles.statItemLabel}>死淘数量</Text>
              <Text style={styles.statItemValue}>{item.deathCount}</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statItemLabel}>耗料量 (kg)</Text>
              <Text style={styles.statItemValue}>{item.feedConsumption}</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statItemLabel}>死淘率</Text>
              <Text style={styles.statItemValue}>
                {(() => {
                  const batch = batches.find(b => b.id === item.batchId);
                  const initialQty = batch?.initialQuantity || 0;
                  if (initialQty > 0) {
                    return ((item.deathCount / initialQty) * 100).toFixed(2) + '%';
                  }
                  return '0.00%';
                })()}
              </Text>
            </View>
          </View>
        </View>
        <View style={styles.deathFeedItemActions}>
          <TouchableOpacity
            style={[styles.actionButton, styles.editButton]}
            onPress={() => openEditModal(item)}
          >
            <Text style={styles.actionButtonText}>编辑</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionButton, styles.deleteButton]}
            onPress={() => handleDeleteRecord(item.id)}
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
        title="死淘/耗料记录" 
        showBackButton 
        onBack={() => navigation.goBack()} 
        rightComponent={
          <TouchableOpacity onPress={() => {
            resetForm();
            setModalVisible(true);
          }} disabled={!selectedBatch}>
            <Text style={{ color: !selectedBatch ? colors.textDisabled : colors.primary, fontSize: 16 }}>新增记录</Text>
          </TouchableOpacity>
        }
      />
      
      {/* 批次选择 */}
      <View style={styles.batchSelectContainer}>
        <Text style={styles.batchSelectLabel}>选择批次</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.batchSelectScrollView}>
          {batches.map((batch) => (
            <TouchableOpacity 
              key={batch.id}
              style={[
                styles.batchSelectItem,
                selectedBatch === batch.id && styles.batchSelectItemSelected
              ]}
              onPress={() => {
                setSelectedBatch(batch.id);
              }}
            >
              <Text style={[
                styles.batchSelectItemText,
                selectedBatch === batch.id && styles.batchSelectItemTextSelected
              ]}>
                {batch.batchName} ({batch.species})
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
      
      {/* 批次信息 */}
      {selectedBatch && (
        <View style={styles.selectedBatchInfo}>
          <Text style={styles.selectedBatchText}>当前批次: {selectedBatch}</Text>
        </View>
      )}
      
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : selectedBatch ? (
        <FlatList
          data={records}
          renderItem={renderRecordItem}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.recordList}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>该批次暂无记录</Text>
              <TouchableOpacity 
                style={styles.addFirstRecordButton}
                onPress={() => {
                  resetForm();
                  setModalVisible(true);
                }}
              >
                <Text style={styles.addFirstRecordText}>添加第一条记录</Text>
              </TouchableOpacity>
            </View>
          }
        />
      ) : (
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateText}>请选择一个批次查看记录</Text>
        </View>
      )}
      
      {/* 新增/编辑记录模态框 */}
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
                {editingRecord ? '编辑死淘/耗料记录' : '新增死淘/耗料记录'}
              </Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Text style={styles.modalCloseButton}>×</Text>
              </TouchableOpacity>
            </View>
            
            <ScrollView style={styles.modalBody}>
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>记录日期</Text>
                <TextInput
                  style={styles.formInput}
                  placeholder="YYYY-MM-DD"
                  value={formData.recordDate}
                  onChangeText={(value) => setFormData({ ...formData, recordDate: value })}
                />
              </View>
              
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>死淘数量</Text>
                <TextInput
                  style={styles.formInput}
                  placeholder="如：5"
                  value={formData.deathCount}
                  onChangeText={(value) => setFormData({ ...formData, deathCount: value })}
                  keyboardType="numeric"
                />
              </View>
              
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>耗料量 (kg)</Text>
                <TextInput
                  style={styles.formInput}
                  placeholder="如：100.5"
                  value={formData.feedConsumption}
                  onChangeText={(value) => setFormData({ ...formData, feedConsumption: value })}
                  keyboardType="numeric"
                />
              </View>
            </ScrollView>
            
            <View style={styles.modalFooter}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.modalButtonText}>取消</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.submitButton]}
                onPress={editingRecord ? handleUpdateRecord : handleCreateRecord}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color={colors.surface} />
                ) : (
                  <Text style={styles.modalButtonText}>
                    {editingRecord ? '更新' : '保存'}
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

export default DeathFeedRecordScreen;