

import React, { useState, useCallback, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, Modal, Alert, RefreshControl, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { FontAwesome6 } from '@expo/vector-icons';
import styles from './styles';
import BatchItem from './components/BatchItem';
import BatchDetail from './components/BatchDetail';
import BatchModal from './components/BatchModal';
import DeleteModal from './components/DeleteModal';
import { getBatchListApi, createBatchApi, updateBatchApi, deleteBatchApi, BatchData } from '../../src/services/api';

const BatchManagementScreen = () => {
  const router = useRouter();
  
  // 状态管理
  const [searchKeyword, setSearchKeyword] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('全部');
  const [isFilterVisible, setIsFilterVisible] = useState(false);
  const [isBatchModalVisible, setIsBatchModalVisible] = useState(false);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentBatchId, setCurrentBatchId] = useState<string | null>(null);
  const [isDetailView, setIsDetailView] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  // 批次数据
  const [batchList, setBatchList] = useState<BatchData[]>([]);
  
  // 获取批次列表
  const fetchBatchList = async () => {
    try {
      const response = await getBatchListApi();
      if (response.success && response.data) {
        setBatchList(response.data);
      } else {
        Alert.alert('获取失败', response.message || '获取批次列表失败');
      }
    } catch (error) {
      Alert.alert('网络错误', '获取批次列表失败，请检查网络连接');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };
  
  // 组件挂载时获取批次列表
  useEffect(() => {
    fetchBatchList();
  }, []);

  const filterOptions = ['全部', '白羽肉鸡', '黄羽肉鸡', '蛋鸡', '鸭'];

  // 过滤后的批次列表
  const filteredBatchList = batchList.filter(batch => {
    const matchesSearch = batch.name.toLowerCase().includes(searchKeyword.toLowerCase()) ||
                        batch.species.toLowerCase().includes(searchKeyword.toLowerCase());
    const matchesFilter = selectedFilter === '全部' || batch.species.includes(selectedFilter);
    return matchesSearch && matchesFilter;
  });

  // 事件处理函数
  const handleBackPress = useCallback(() => {
    if (router.canGoBack()) {
      router.back();
    }
  }, [router]);

  const handleAddBatchPress = useCallback(() => {
    setIsEditMode(false);
    setCurrentBatchId(null);
    setIsBatchModalVisible(true);
  }, []);

  const handleFilterPress = useCallback(() => {
    setIsFilterVisible(!isFilterVisible);
  }, [isFilterVisible]);

  const handleFilterSelect = useCallback((filter: string) => {
    setSelectedFilter(filter);
    setIsFilterVisible(false);
  }, []);

  const handleBatchItemPress = useCallback((batchId: string) => {
    setCurrentBatchId(batchId);
    setIsDetailView(true);
  }, []);

  const handleEditBatchPress = useCallback((batchId: string) => {
    setIsEditMode(true);
    setCurrentBatchId(batchId);
    setIsBatchModalVisible(true);
  }, []);

  const handleDeleteBatchPress = useCallback((batchId: string) => {
    setCurrentBatchId(batchId);
    setIsDeleteModalVisible(true);
  }, []);

  const handleBackToListPress = useCallback(() => {
    setIsDetailView(false);
    setCurrentBatchId(null);
  }, []);

  const handleRecordDataPress = useCallback(() => {
    if (currentBatchId) {
      router.push(`/p-death_feed_record?batchId=${currentBatchId}`);
    }
  }, [currentBatchId, router]);

  const handleViewHistoryPress = useCallback(() => {
    // 查看历史数据功能
    console.log('查看历史数据');
  }, []);

  const handleBatchModalClose = useCallback(() => {
    setIsBatchModalVisible(false);
    setCurrentBatchId(null);
    setIsEditMode(false);
  }, []);

  const handleBatchModalSave = useCallback(async (batchData: Omit<BatchData, 'id' | 'currentQuantity' | 'daysOld' | 'status' | 'icon'>) => {
    try {
      if (isEditMode && currentBatchId) {
        // 编辑批次
        const response = await updateBatchApi(currentBatchId, batchData);
        if (response.success && response.data) {
          setBatchList(prevList =>
            prevList.map(batch =>
              batch.id === currentBatchId
                ? response.data as BatchData
                : batch
            )
          );
          Alert.alert('成功', response.message || '批次已更新');
        } else {
          Alert.alert('更新失败', response.message || '更新批次失败，请重试');
        }
      } else {
        // 新建批次
        const response = await createBatchApi({
          ...batchData,
          icon: getIconForSpecies(batchData.species),
        });
        if (response.success && response.data) {
          setBatchList(prevList => [...prevList, response.data as BatchData]);
          Alert.alert('成功', response.message || '批次已创建');
        } else {
          Alert.alert('创建失败', response.message || '创建批次失败，请重试');
        }
      }
    } catch (error) {
      Alert.alert('网络错误', '操作失败，请检查网络连接');
    } finally {
      handleBatchModalClose();
    }
  }, [isEditMode, currentBatchId, handleBatchModalClose]);

  const handleDeleteConfirm = useCallback(async () => {
    if (!currentBatchId) return;
    
    try {
      const response = await deleteBatchApi(currentBatchId);
      if (response.success) {
        setBatchList(prevList => prevList.filter(batch => batch.id !== currentBatchId));
        Alert.alert('成功', response.message || '批次已删除');
      } else {
        Alert.alert('删除失败', response.message || '删除批次失败，请重试');
      }
    } catch (error) {
      Alert.alert('网络错误', '删除批次失败，请检查网络连接');
    } finally {
      setIsDeleteModalVisible(false);
      setCurrentBatchId(null);
    }
  }, [currentBatchId]);

  const handleDeleteCancel = useCallback(() => {
    setIsDeleteModalVisible(false);
    setCurrentBatchId(null);
  }, []);

  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    // 调用API刷新数据
    await fetchBatchList();
  }, []);

  const getIconForSpecies = (species: string): string => {
    if (species.includes('蛋鸡')) return 'egg';
    if (species.includes('鸭')) return 'water';
    return 'drumstick-bite';
  };

  const getCurrentBatch = useCallback(() => {
    if (!currentBatchId) return null;
    return batchList.find(batch => batch.id === currentBatchId) || null;
  }, [currentBatchId, batchList]);

  return (
    <SafeAreaView style={styles.container}>
      {/* 顶部导航栏 */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity style={styles.backButton} onPress={handleBackPress}>
            <FontAwesome6 name="arrow-left" size={20} color="#6B7280" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>批次管理</Text>
        </View>
        <TouchableOpacity style={styles.addButton} onPress={handleAddBatchPress}>
          <FontAwesome6 name="plus" size={14} color="#FFFFFF" />
          <Text style={styles.addButtonText}>新建批次</Text>
        </TouchableOpacity>
      </View>

      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#3BCCA5" />
          <Text style={styles.loadingText}>加载中...</Text>
        </View>
      ) : (
        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} />
          }
        >
          {/* 搜索和筛选区域 */}
          <View style={styles.searchFilterSection}>
            <View style={styles.searchFilterCard}>
              <View style={styles.searchRow}>
                <View style={styles.searchInputWrapper}>
                  <FontAwesome6 name="magnifying-glass" size={16} color="#6B7280" style={styles.searchIcon} />
                  <TextInput
                    style={styles.searchInput}
                    placeholder="搜索批次名称或品种"
                    value={searchKeyword}
                    onChangeText={setSearchKeyword}
                  />
                </View>
                <TouchableOpacity style={styles.filterButton} onPress={handleFilterPress}>
                  <FontAwesome6 name="filter" size={16} color="#6B7280" />
                </TouchableOpacity>
              </View>
              
              {isFilterVisible && (
                <View style={styles.filterOptions}>
                  {filterOptions.map(filter => (
                    <TouchableOpacity
                      key={filter}
                      style={[
                        styles.filterTag,
                        selectedFilter === filter && styles.filterTagActive
                      ]}
                      onPress={() => handleFilterSelect(filter)}
                    >
                      <Text style={[
                        styles.filterTagText,
                        selectedFilter === filter && styles.filterTagTextActive
                      ]}>
                        {filter}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>
          </View>

          {/* 批次列表视图 */}
          {!isDetailView && (
            <View style={styles.batchListSection}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>养殖批次</Text>
                <Text style={styles.batchCount}>共{filteredBatchList.length}个批次</Text>
              </View>
              
              <View style={styles.batchList}>
                {filteredBatchList.map(batch => (
                  <BatchItem
                    key={batch.id}
                    batch={batch}
                    onPress={() => handleBatchItemPress(batch.id)}
                    onEdit={() => handleEditBatchPress(batch.id)}
                    onDelete={() => handleDeleteBatchPress(batch.id)}
                  />
                ))}
              </View>
            </View>
          )}

          {/* 批次详情视图 */}
          {isDetailView && (
            <BatchDetail
              batch={getCurrentBatch()}
              onBackToList={handleBackToListPress}
              onRecordData={handleRecordDataPress}
              onViewHistory={handleViewHistoryPress}
            />
          )}
        </ScrollView>
      )}

      {/* 新建/编辑批次弹窗 */}
      <BatchModal
        visible={isBatchModalVisible}
        isEditMode={isEditMode}
        batch={getCurrentBatch()}
        onClose={handleBatchModalClose}
        onSave={handleBatchModalSave}
      />

      {/* 删除确认弹窗 */}
      <DeleteModal
        visible={isDeleteModalVisible}
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
      />
    </SafeAreaView>
  );
};

export default BatchManagementScreen;

