

import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Modal, TextInput, Alert, FlatList, } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { FontAwesome5, FontAwesome6 } from '@expo/vector-icons';
import styles from './styles';

interface AdData {
  id: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  budget: number;
  impressions: number;
  clicks: number;
  ctr: number;
  cpc: number;
  status: 'active' | 'paused' | 'ended';
}

interface OverviewData {
  totalAds: number;
  activeAds: number;
  totalBudget: number;
  totalClicks: number;
}

const AdPrecisionScreen = () => {
  const router = useRouter();
  
  // 状态管理
  const [isNewAdModalVisible, setIsNewAdModalVisible] = useState(false);
  const [isAdDetailModalVisible, setIsAdDetailModalVisible] = useState(false);
  const [selectedAdId, setSelectedAdId] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState('all');
  
  // 表单状态
  const [adName, setAdName] = useState('');
  const [adDescription, setAdDescription] = useState('');
  const [adBudget, setAdBudget] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  
  // 模拟数据
  const overviewData: OverviewData = {
    totalAds: 12,
    activeAds: 8,
    totalBudget: 25600,
    totalClicks: 1247,
  };
  
  const [adList, setAdList] = useState<AdData[]>([
    {
      id: 'ad001',
      title: '高效禽流感疫苗推广',
      description: '针对养殖户的禽流感预防疫苗，安全高效',
      startDate: '2024-01-10',
      endDate: '2024-02-10',
      budget: 2500,
      impressions: 1234,
      clicks: 156,
      ctr: 12.6,
      cpc: 1.56,
      status: 'active',
    },
    {
      id: 'ad002',
      title: '优质蛋鸡饲料促销',
      description: '高蛋白蛋鸡专用饲料，提升产蛋率',
      startDate: '2024-01-05',
      endDate: '2024-01-25',
      budget: 1800,
      impressions: 892,
      clicks: 98,
      ctr: 11.0,
      cpc: 1.84,
      status: 'paused',
    },
    {
      id: 'ad003',
      title: '新城疫快速检测试剂盒',
      description: '快速检测新城疫病毒，准确率99%',
      startDate: '2024-01-01',
      endDate: '2024-01-15',
      budget: 3200,
      impressions: 2156,
      clicks: 289,
      ctr: 13.4,
      cpc: 1.11,
      status: 'ended',
    },
    {
      id: 'ad004',
      title: '鸡舍环境控制器',
      description: '智能控制温湿度，优化养殖环境',
      startDate: '2024-01-12',
      endDate: '2024-02-12',
      budget: 1900,
      impressions: 678,
      clicks: 76,
      ctr: 11.2,
      cpc: 2.50,
      status: 'active',
    },
  ]);
  
  const filteredAdList = adList.filter(ad => {
    if (statusFilter === 'all') return true;
    return ad.status === statusFilter;
  });
  
  // 事件处理函数
  const handleBackPress = () => {
    if (router.canGoBack()) {
      router.back();
    }
  };
  
  const handleNewAdPress = () => {
    setIsNewAdModalVisible(true);
  };
  
  const handleCloseNewAdModal = () => {
    setIsNewAdModalVisible(false);
    // 重置表单
    setAdName('');
    setAdDescription('');
    setAdBudget('');
    setStartDate('');
    setEndDate('');
  };
  
  const handleSubmitNewAd = () => {
    if (!adName.trim() || !adBudget.trim() || !startDate || !endDate) {
      Alert.alert('提示', '请填写必填字段');
      return;
    }
    
    // 模拟创建广告
    const newAd: AdData = {
      id: `ad${Date.now()}`,
      title: adName.trim(),
      description: adDescription.trim(),
      startDate,
      endDate,
      budget: parseFloat(adBudget),
      impressions: 0,
      clicks: 0,
      ctr: 0,
      cpc: 0,
      status: 'active',
    };
    
    setAdList(prev => [...prev, newAd]);
    handleCloseNewAdModal();
    Alert.alert('成功', '广告创建成功！');
  };
  
  const handleAdItemPress = (adId: string) => {
    setSelectedAdId(adId);
    setIsAdDetailModalVisible(true);
  };
  
  const handleCloseAdDetailModal = () => {
    setIsAdDetailModalVisible(false);
    setSelectedAdId('');
  };
  
  const handlePauseAd = () => {
    const selectedAd = adList.find(ad => ad.id === selectedAdId);
    if (!selectedAd) return;
    
    setAdList(prev => 
      prev.map(ad => 
        ad.id === selectedAdId 
          ? { ...ad, status: ad.status === 'active' ? 'paused' : 'active' }
          : ad
      )
    );
  };
  
  const handleEditAd = () => {
    handleCloseAdDetailModal();
    Alert.alert('提示', '跳转到广告编辑页面');
  };
  
  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return '投放中';
      case 'paused': return '已暂停';
      case 'ended': return '已结束';
      default: return '未知';
    }
  };
  
  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'active': return styles.statusActive;
      case 'paused': return styles.statusPaused;
      case 'ended': return styles.statusEnded;
      default: return styles.statusEnded;
    }
  };
  
  const selectedAd = adList.find(ad => ad.id === selectedAdId);
  
  const renderOverviewCard = (
    title: string,
    value: string,
    icon: string,
    iconColor: string,
    iconBgColor: string,
    valueColor?: string
  ) => (
    <View style={styles.overviewCard}>
      <View style={styles.overviewCardContent}>
        <View>
          <Text style={styles.overviewCardTitle}>{title}</Text>
          <Text style={[styles.overviewCardValue, valueColor && { color: valueColor }]}>
            {value}
          </Text>
        </View>
        <View style={[styles.overviewCardIcon, { backgroundColor: iconBgColor }]}>
          <FontAwesome6 name={icon} size={20} color={iconColor} />
        </View>
      </View>
    </View>
  );
  
  const renderAdItem = ({ item }: { item: AdData }) => (
    <TouchableOpacity
      style={styles.adItem}
      onPress={() => handleAdItemPress(item.id)}
      activeOpacity={0.7}
    >
      <View style={styles.adItemHeader}>
        <View style={styles.adItemInfo}>
          <Text style={styles.adItemTitle}>{item.title}</Text>
          <Text style={styles.adItemDescription}>{item.description}</Text>
          <View style={styles.adItemMeta}>
            <Text style={styles.adItemMetaText}>
              <FontAwesome5 name="calendar-alt" size={10} color="#6B7280" />
              {' '}{item.startDate} 至 {item.endDate}
            </Text>
            <Text style={styles.adItemMetaText}>
              <FontAwesome6 name="eye" size={10} color="#6B7280" />
              {' '}曝光: {item.impressions.toLocaleString()}
            </Text>
            <Text style={styles.adItemMetaText}>
              <FontAwesome5 name="mouse-pointer" size={10} color="#6B7280" />
              {' '}点击: {item.clicks.toLocaleString()}
            </Text>
          </View>
        </View>
        <View style={[styles.adItemStatus, getStatusStyle(item.status)]}>
          <Text style={styles.adItemStatusText}>{getStatusText(item.status)}</Text>
        </View>
      </View>
      
      <View style={styles.adItemFooter}>
        <View style={styles.adItemMetrics}>
          <View style={styles.adItemMetric}>
            <Text style={styles.adItemMetricValue}>¥{item.budget.toLocaleString()}</Text>
            <Text style={styles.adItemMetricLabel}>预算</Text>
          </View>
          <View style={styles.adItemMetric}>
            <Text style={[styles.adItemMetricValue, { color: '#3BCCA5' }]}>¥{item.cpc.toFixed(2)}</Text>
            <Text style={styles.adItemMetricLabel}>点击成本</Text>
          </View>
          <View style={styles.adItemMetric}>
            <Text style={[styles.adItemMetricValue, { color: '#10B981' }]}>{item.ctr}%</Text>
            <Text style={styles.adItemMetricLabel}>点击率</Text>
          </View>
        </View>
        <TouchableOpacity onPress={() => handleAdItemPress(item.id)}>
          <Text style={styles.viewDetailText}>
            查看详情 <FontAwesome6 name="chevron-right" size={12} color="#3BCCA5" />
          </Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
  
  return (
    <SafeAreaView style={styles.container}>
      {/* 顶部导航栏 */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity style={styles.backButton} onPress={handleBackPress}>
            <FontAwesome6 name="arrow-left" size={20} color="#6B7280" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>广告投放</Text>
        </View>
        <TouchableOpacity style={styles.newAdButton} onPress={handleNewAdPress}>
          <FontAwesome6 name="plus" size={14} color="#FFFFFF" />
          <Text style={styles.newAdButtonText}>新建广告</Text>
        </TouchableOpacity>
      </View>
      
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* 数据概览 */}
        <View style={styles.overviewSection}>
          <Text style={styles.sectionTitle}>投放概览</Text>
          <View style={styles.overviewGrid}>
            {renderOverviewCard(
              '总广告数',
              overviewData.totalAds.toString(),
              'bullhorn',
              '#3BCCA5',
              'rgba(59, 204, 165, 0.1)'
            )}
            {renderOverviewCard(
              '活跃广告',
              overviewData.activeAds.toString(),
              'play',
              '#10B981',
              'rgba(16, 185, 129, 0.1)',
              '#10B981'
            )}
            {renderOverviewCard(
              '总预算',
              `¥${overviewData.totalBudget.toLocaleString()}`,
              'coins',
              '#3B82F6',
              'rgba(59, 130, 246, 0.1)'
            )}
            {renderOverviewCard(
              '总点击量',
              overviewData.totalClicks.toLocaleString(),
              'mouse-pointer',
              '#F97316',
              'rgba(249, 115, 22, 0.1)',
              '#F97316'
            )}
          </View>
        </View>
        
        {/* 广告列表 */}
        <View style={styles.adListSection}>
          <View style={styles.adListHeader}>
            <Text style={styles.sectionTitle}>广告列表</Text>
            <View style={styles.filterContainer}>
              <TouchableOpacity
                style={styles.filterButton}
                onPress={() => {
                  // 这里可以实现更复杂的筛选逻辑
                  Alert.alert('筛选', '选择广告状态');
                }}
              >
                <Text style={styles.filterButtonText}>全部状态</Text>
                <FontAwesome6 name="chevron-down" size={12} color="#6B7280" />
              </TouchableOpacity>
            </View>
          </View>
          
          <FlatList
            data={filteredAdList}
            renderItem={renderAdItem}
            keyExtractor={(item) => item.id}
            scrollEnabled={false}
            showsVerticalScrollIndicator={false}
            ItemSeparatorComponent={() => <View style={styles.adItemSeparator} />}
          />
        </View>
      </ScrollView>
      
      {/* 新建广告模态框 */}
      <Modal
        visible={isNewAdModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={handleCloseNewAdModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>新建广告</Text>
              <TouchableOpacity onPress={handleCloseNewAdModal}>
                <FontAwesome5 name="times" size={20} color="#6B7280" />
              </TouchableOpacity>
            </View>
            
            <View style={styles.formContainer}>
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>广告名称</Text>
                <TextInput
                  style={styles.formInput}
                  value={adName}
                  onChangeText={setAdName}
                  placeholder="请输入广告名称"
                  placeholderTextColor="#9CA3AF"
                />
              </View>
              
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>广告描述</Text>
                <TextInput
                  style={[styles.formInput, styles.formTextArea]}
                  value={adDescription}
                  onChangeText={setAdDescription}
                  placeholder="请输入广告描述"
                  placeholderTextColor="#9CA3AF"
                  multiline={true}
                  numberOfLines={3}
                  textAlignVertical="top"
                />
              </View>
              
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>广告预算</Text>
                <TextInput
                  style={styles.formInput}
                  value={adBudget}
                  onChangeText={setAdBudget}
                  placeholder="请输入广告预算"
                  placeholderTextColor="#9CA3AF"
                  keyboardType="numeric"
                />
              </View>
              
              <View style={styles.dateRow}>
                <View style={[styles.formGroup, styles.dateGroup]}>
                  <Text style={styles.formLabel}>开始日期</Text>
                  <TextInput
                    style={styles.formInput}
                    value={startDate}
                    onChangeText={setStartDate}
                    placeholder="YYYY-MM-DD"
                    placeholderTextColor="#9CA3AF"
                  />
                </View>
                <View style={[styles.formGroup, styles.dateGroup]}>
                  <Text style={styles.formLabel}>结束日期</Text>
                  <TextInput
                    style={styles.formInput}
                    value={endDate}
                    onChangeText={setEndDate}
                    placeholder="YYYY-MM-DD"
                    placeholderTextColor="#9CA3AF"
                  />
                </View>
              </View>
              
              <View style={styles.modalButtons}>
                <TouchableOpacity
                  style={styles.cancelButton}
                  onPress={handleCloseNewAdModal}
                >
                  <Text style={styles.cancelButtonText}>取消</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.submitButton}
                  onPress={handleSubmitNewAd}
                >
                  <Text style={styles.submitButtonText}>创建广告</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </Modal>
      
      {/* 广告详情模态框 */}
      <Modal
        visible={isAdDetailModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={handleCloseAdDetailModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>广告详情</Text>
              <TouchableOpacity onPress={handleCloseAdDetailModal}>
                <FontAwesome5 name="times" size={20} color="#6B7280" />
              </TouchableOpacity>
            </View>
            
            {selectedAd && (
              <ScrollView style={styles.detailContent} showsVerticalScrollIndicator={false}>
                <View style={styles.detailSection}>
                  <Text style={styles.detailSectionTitle}>广告信息</Text>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>广告名称:</Text>
                    <Text style={styles.detailValue}>{selectedAd.title}</Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>广告描述:</Text>
                    <Text style={styles.detailValue}>{selectedAd.description}</Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>投放时间:</Text>
                    <Text style={styles.detailValue}>
                      {selectedAd.startDate} 至 {selectedAd.endDate}
                    </Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>预算:</Text>
                    <Text style={styles.detailValue}>¥{selectedAd.budget.toLocaleString()}</Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>状态:</Text>
                    <View style={[styles.detailStatus, getStatusStyle(selectedAd.status)]}>
                      <Text style={styles.detailStatusText}>{getStatusText(selectedAd.status)}</Text>
                    </View>
                  </View>
                </View>
                
                <View style={styles.detailSection}>
                  <Text style={styles.detailSectionTitle}>投放效果</Text>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>曝光量:</Text>
                    <Text style={styles.detailValue}>{selectedAd.impressions.toLocaleString()}</Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>点击量:</Text>
                    <Text style={styles.detailValue}>{selectedAd.clicks.toLocaleString()}</Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>点击率:</Text>
                    <Text style={styles.detailValue}>{selectedAd.ctr}%</Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>点击成本:</Text>
                    <Text style={styles.detailValue}>¥{selectedAd.cpc.toFixed(2)}</Text>
                  </View>
                </View>
                
                <View style={styles.modalButtons}>
                  <TouchableOpacity
                    style={styles.cancelButton}
                    onPress={handlePauseAd}
                  >
                    <Text style={styles.cancelButtonText}>
                      {selectedAd.status === 'active' ? '暂停投放' : '继续投放'}
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.submitButton}
                    onPress={handleEditAd}
                  >
                    <Text style={styles.submitButtonText}>编辑广告</Text>
                  </TouchableOpacity>
                </View>
              </ScrollView>
            )}
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default AdPrecisionScreen;

