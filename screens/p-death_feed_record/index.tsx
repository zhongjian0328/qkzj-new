

import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity, Modal, Alert, Platform, ActivityIndicator, } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { FontAwesome6 } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import styles from './styles';
import { getBatchInfoApi, saveDeathFeedRecordApi, getHistoryRecordsApi, BatchInfo, RecordData, HistoryRecord } from '../../src/services/api';

const DeathFeedRecordScreen: React.FC = () => {
  const router = useRouter();
  const { batchId } = useLocalSearchParams<{ batchId: string }>();

  // 批次信息状态
  const [batchInfo, setBatchInfo] = useState<BatchInfo>({
    name: '白羽肉鸡第3批',
    species: '白羽肉鸡',
    currentQuantity: 1250,
    entryDate: '2024-01-01',
  });

  // 表单状态
  const [recordDate, setRecordDate] = useState(new Date());
  const [deathCount, setDeathCount] = useState('');
  const [feedConsumption, setFeedConsumption] = useState('');
  const [remark, setRemark] = useState('');
  const [isDatePickerVisible, setIsDatePickerVisible] = useState(false);

  // 模态框状态
  const [isSuccessModalVisible, setIsSuccessModalVisible] = useState(false);
  const [isErrorModalVisible, setIsErrorModalVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState('请检查输入的数据是否正确');

  // 加载状态
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(true);

  // 历史记录状态
  const [historyRecords, setHistoryRecords] = useState<HistoryRecord[]>([]);

  useEffect(() => {
    fetchData();
  }, [batchId]);

  // 获取批次信息和历史记录
  const fetchData = async () => {
    setIsInitialLoading(true);
    try {
      // 获取批次信息
      const batchResponse = await getBatchInfoApi(batchId || 'batch1');
      if (batchResponse.success && batchResponse.data) {
        setBatchInfo(batchResponse.data);
      }

      // 获取历史记录
      const historyResponse = await getHistoryRecordsApi(batchId || 'batch1');
      if (historyResponse.success && historyResponse.data) {
        setHistoryRecords(historyResponse.data);
      }
    } catch (error) {
      Alert.alert('网络错误', '获取数据失败，请检查网络连接');
    } finally {
      setIsInitialLoading(false);
    }
  };

  const handleBackPress = () => {
    if (router.canGoBack()) {
      router.back();
    }
  };

  const handleDateChange = (event: any, selectedDate?: Date) => {
    setIsDatePickerVisible(Platform.OS === 'ios');
    if (selectedDate) {
      setRecordDate(selectedDate);
    }
  };

  const handleSaveRecord = async () => {
    // 数据验证
    if (!deathCount.trim() || !feedConsumption.trim()) {
      showErrorModal('请填写必填项');
      return;
    }

    const deathCountNum = parseInt(deathCount);
    const feedConsumptionNum = parseFloat(feedConsumption);

    if (isNaN(deathCountNum) || deathCountNum < 0) {
      showErrorModal('请输入有效的死淘数量');
      return;
    }

    if (isNaN(feedConsumptionNum) || feedConsumptionNum < 0) {
      showErrorModal('请输入有效的耗料量');
      return;
    }

    setIsLoading(true);

    try {
      // 构建记录数据
      const recordData: RecordData = {
        date: recordDate.toISOString().split('T')[0],
        deathCount: deathCountNum,
        feedConsumption: feedConsumptionNum,
        remark: remark.trim(),
      };

      // 调用保存记录API
      const response = await saveDeathFeedRecordApi(batchId || 'batch1', recordData);
      
      if (response.success) {
        // 刷新历史记录
        const historyResponse = await getHistoryRecordsApi(batchId || 'batch1');
        if (historyResponse.success && historyResponse.data) {
          setHistoryRecords(historyResponse.data);
        }

        // 清空表单
        setDeathCount('');
        setFeedConsumption('');
        setRemark('');

        showSuccessModal();
      } else {
        showErrorModal(response.message || '保存失败，请重试');
      }
    } catch (error) {
      showErrorModal('网络错误，保存失败，请检查网络连接');
    } finally {
      setIsLoading(false);
    }
  };

  const showSuccessModal = () => {
    setIsSuccessModalVisible(true);
  };

  const showErrorModal = (message: string) => {
    setErrorMessage(message);
    setIsErrorModalVisible(true);
  };

  const handleSuccessModalClose = () => {
    setIsSuccessModalVisible(false);
  };

  const handleErrorModalClose = () => {
    setIsErrorModalVisible(false);
  };

  const handleViewAllHistory = () => {
    // 这里可以跳转到历史记录详情页
    Alert.alert('提示', '查看全部历史记录功能');
  };

  const formatDate = (date: Date) => {
    return date.toISOString().split('T')[0];
  };

  const renderBatchInfo = () => (
    <View style={styles.batchInfoCard}>
      <Text style={styles.batchInfoTitle}>批次信息</Text>
      <View style={styles.batchInfoContent}>
        <View style={styles.batchInfoRow}>
          <Text style={styles.batchInfoLabel}>批次名称：</Text>
          <Text style={styles.batchInfoValue}>{batchInfo.name}</Text>
        </View>
        <View style={styles.batchInfoRow}>
          <Text style={styles.batchInfoLabel}>品种：</Text>
          <Text style={styles.batchInfoValue}>{batchInfo.species}</Text>
        </View>
        <View style={styles.batchInfoRow}>
          <Text style={styles.batchInfoLabel}>当前存栏：</Text>
          <Text style={styles.batchInfoValue}>{batchInfo.currentQuantity}只</Text>
        </View>
        <View style={styles.batchInfoRow}>
          <Text style={styles.batchInfoLabel}>入栏日期：</Text>
          <Text style={styles.batchInfoValue}>{batchInfo.entryDate}</Text>
        </View>
      </View>
    </View>
  );

  const renderForm = () => (
    <View style={styles.formCard}>
      <Text style={styles.formTitle}>数据录入</Text>
      
      <View style={styles.formSection}>
        <Text style={styles.formLabel}>记录日期</Text>
        <TouchableOpacity
          style={styles.dateInput}
          onPress={() => setIsDatePickerVisible(true)}
        >
          <Text style={styles.dateInputText}>{formatDate(recordDate)}</Text>
          <FontAwesome6 name="calendar" size={16} color="#6B7280" />
        </TouchableOpacity>
      </View>

      <View style={styles.formSection}>
        <Text style={styles.formLabel}>
          死淘数量 <Text style={styles.required}>*</Text>
        </Text>
        <View style={styles.inputWrapper}>
          <TextInput
            style={styles.textInput}
            placeholder="请输入死淘数量"
            value={deathCount}
            onChangeText={setDeathCount}
            keyboardType="numeric"
            placeholderTextColor="#9CA3AF"
          />
          <Text style={styles.inputUnit}>只</Text>
        </View>
        <Text style={styles.formHint}>包括死亡和淘汰的禽只总数</Text>
      </View>

      <View style={styles.formSection}>
        <Text style={styles.formLabel}>
          耗料量 <Text style={styles.required}>*</Text>
        </Text>
        <View style={styles.inputWrapper}>
          <TextInput
            style={styles.textInput}
            placeholder="请输入耗料量"
            value={feedConsumption}
            onChangeText={setFeedConsumption}
            keyboardType="numeric"
            placeholderTextColor="#9CA3AF"
          />
          <Text style={styles.inputUnit}>kg</Text>
        </View>
        <Text style={styles.formHint}>当日饲料消耗量</Text>
      </View>

      <View style={styles.formSection}>
        <Text style={styles.formLabel}>备注</Text>
        <TextInput
          style={styles.textArea}
          placeholder="选填，可以记录特殊情况或备注信息"
          value={remark}
          onChangeText={setRemark}
          multiline
          numberOfLines={3}
          textAlignVertical="top"
          placeholderTextColor="#9CA3AF"
        />
      </View>

      <TouchableOpacity
        style={[styles.saveButton, isLoading && styles.saveButtonDisabled]}
        onPress={handleSaveRecord}
        disabled={isLoading}
      >
        <FontAwesome6 name="floppy-disk" size={16} color="#FFFFFF" />
        <Text style={styles.saveButtonText}>
          {isLoading ? '保存中...' : '保存记录'}
        </Text>
      </TouchableOpacity>
    </View>
  );

  const renderHistoryItem = (item: HistoryRecord) => (
    <View key={item.id} style={styles.historyItem}>
      <View style={styles.historyHeader}>
        <Text style={styles.historyDate}>{item.date}</Text>
        <View style={styles.historyStatus}>
          <Text style={styles.historyStatusText}>{item.status}</Text>
        </View>
      </View>
      <View style={styles.historyContent}>
        <View style={styles.historyRow}>
          <Text style={styles.historyLabel}>死淘数量：</Text>
          <Text style={styles.historyValue}>{item.deathCount}只</Text>
        </View>
        <View style={styles.historyRow}>
          <Text style={styles.historyLabel}>耗料量：</Text>
          <Text style={styles.historyValue}>{item.feedConsumption}kg</Text>
        </View>
      </View>
      <Text style={styles.historyRemark}>{item.remark || '无备注'}</Text>
    </View>
  );

  const renderHistory = () => (
    <View style={styles.historySection}>
      <View style={styles.historyHeader}>
        <Text style={styles.historyTitle}>近期记录</Text>
        <TouchableOpacity onPress={handleViewAllHistory}>
          <Text style={styles.viewAllButton}>查看全部</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.historyList}>
        {historyRecords.map(renderHistoryItem)}
      </View>
    </View>
  );

  const renderSuccessModal = () => (
    <Modal
      visible={isSuccessModalVisible}
      transparent
      animationType="fade"
      onRequestClose={handleSuccessModalClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.successIcon}>
            <FontAwesome6 name="check" size={24} color="#10B981" />
          </View>
          <Text style={styles.modalTitle}>保存成功</Text>
          <Text style={styles.modalMessage}>数据已成功保存到系统中</Text>
          <TouchableOpacity
            style={styles.modalButton}
            onPress={handleSuccessModalClose}
          >
            <Text style={styles.modalButtonText}>确定</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );

  const renderErrorModal = () => (
    <Modal
      visible={isErrorModalVisible}
      transparent
      animationType="fade"
      onRequestClose={handleErrorModalClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.errorIcon}>
            <FontAwesome6 name="triangle-exclamation" size={24} color="#EF4444" />
          </View>
          <Text style={styles.modalTitle}>保存失败</Text>
          <Text style={styles.modalMessage}>{errorMessage}</Text>
          <TouchableOpacity
            style={styles.errorModalButton}
            onPress={handleErrorModalClose}
          >
            <Text style={styles.modalButtonText}>重新输入</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* 顶部导航栏 */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleBackPress}>
          <FontAwesome6 name="arrow-left" size={20} color="#6B7280" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>死淘/耗料记录</Text>
      </View>

      {isInitialLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#3BCCA5" />
          <Text style={styles.loadingText}>加载中...</Text>
        </View>
      ) : (
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          <View style={styles.content}>
            {renderBatchInfo()}
            {renderForm()}
            {renderHistory()}
          </View>
        </ScrollView>
      )}

      {/* 日期选择器 */}
      {isDatePickerVisible && (
        <DateTimePicker
          value={recordDate}
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={handleDateChange}
        />
      )}

      {renderSuccessModal()}
      {renderErrorModal()}
    </SafeAreaView>
  );
};

export default DeathFeedRecordScreen;

