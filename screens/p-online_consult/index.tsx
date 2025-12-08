

import React, { useState, useCallback } from 'react';
import { View, Text, ScrollView, TouchableOpacity, RefreshControl, Alert, } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { FontAwesome6 } from '@expo/vector-icons';
import styles from './styles';
import StatsCard from './components/StatsCard';
import ConsultationItem from './components/ConsultationItem';
import ConsultationModal from './components/ConsultationModal';
import ChatModal from './components/ChatModal';
import StatusFilter from './components/StatusFilter';
import { ConsultationRequest, ConsultationStatus } from './types';

const OnlineConsultScreen = () => {
  const router = useRouter();
  
  // 状态管理
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isConsultationModalVisible, setIsConsultationModalVisible] = useState(false);
  const [isChatModalVisible, setIsChatModalVisible] = useState(false);
  const [isStatusFilterVisible, setIsStatusFilterVisible] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<ConsultationStatus>('all');
  const [selectedConsultation, setSelectedConsultation] = useState<ConsultationRequest | null>(null);

  // 模拟数据
  const [consultationRequests, setConsultationRequests] = useState<ConsultationRequest[]>([
    {
      id: 'req_001',
      user: {
        name: '王养殖户',
        phone: '138****5678',
        avatar: 'https://s.coze.cn/image/wH5JvzoFE1o/',
        location: '山东省青岛市',
      },
      symptoms: '鸡群出现咳嗽、流涕症状，部分鸡只精神不振，采食量下降，已有2天时间。',
      submitTime: '2024-01-15 14:30',
      status: 'pending',
      completionTime: null,
    },
    {
      id: 'req_002',
      user: {
        name: '李合作社',
        phone: '139****9876',
        avatar: 'https://s.coze.cn/image/XtBhL8S6baE/',
        location: '河南省郑州市',
      },
      symptoms: '鸭群出现腹泻症状，粪便呈绿色，部分鸭只呼吸困难，已隔离观察。',
      submitTime: '2024-01-15 10:15',
      status: 'processing',
      completionTime: null,
    },
    {
      id: 'req_003',
      user: {
        name: '张养殖企业',
        phone: '136****1234',
        avatar: 'https://s.coze.cn/image/LXeFp5FWOQE/',
        location: '江苏省南京市',
      },
      symptoms: '蛋鸡产蛋率下降，蛋壳质量变差，部分鸡只有呼吸道症状。',
      submitTime: '2024-01-14 16:45',
      status: 'completed',
      completionTime: '1小时前完成',
    },
    {
      id: 'req_004',
      user: {
        name: '刘散户',
        phone: '137****4567',
        avatar: 'https://s.coze.cn/image/uSCqVfeGLPk/',
        location: '河北省石家庄市',
      },
      symptoms: '肉鸡出现羽毛蓬松，食欲减退，部分鸡只死亡，死亡率约5%。',
      submitTime: '2024-01-15 16:20',
      status: 'pending',
      completionTime: null,
    },
  ]);

  // 统计数据
  const statsData = {
    pending: consultationRequests.filter(req => req.status === 'pending').length,
    processing: consultationRequests.filter(req => req.status === 'processing').length,
    completed: consultationRequests.filter(req => req.status === 'completed').length,
  };

  // 筛选后的请求列表
  const filteredRequests = consultationRequests.filter(request => 
    selectedStatus === 'all' || request.status === selectedStatus
  );

  // 事件处理函数
  const handleBackPress = useCallback(() => {
    if (router.canGoBack()) {
      router.back();
    }
  }, [router]);

  const handleNotificationPress = useCallback(() => {
    Alert.alert('通知', '暂无新通知');
  }, []);

  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    try {
      // 模拟刷新数据
      await new Promise(resolve => setTimeout(resolve, 1000));
    } catch (error) {
      console.error('刷新失败:', error);
    } finally {
      setIsRefreshing(false);
    }
  }, []);

  const handleStatusFilterChange = useCallback((status: ConsultationStatus) => {
    setSelectedStatus(status);
    setIsStatusFilterVisible(false);
  }, []);

  const handleAcceptConsultation = useCallback((consultationId: string) => {
    setConsultationRequests(prevRequests =>
      prevRequests.map(request =>
        request.id === consultationId
          ? { ...request, status: 'processing' as const }
          : request
      )
    );
    Alert.alert('成功', '已接受诊疗请求');
  }, []);

  const handleViewDetail = useCallback((consultation: ConsultationRequest) => {
    setSelectedConsultation(consultation);
    setIsConsultationModalVisible(true);
  }, []);

  const handleChatPress = useCallback((consultation: ConsultationRequest) => {
    setSelectedConsultation(consultation);
    setIsChatModalVisible(true);
  }, []);

  const handleVideoPress = useCallback((consultationId: string) => {
    Alert.alert('视频通话', '正在连接视频通话...');
  }, []);

  const handleCloseConsultationModal = useCallback(() => {
    setIsConsultationModalVisible(false);
    setSelectedConsultation(null);
  }, []);

  const handleCloseChatModal = useCallback(() => {
    setIsChatModalVisible(false);
    setSelectedConsultation(null);
  }, []);

  const handleModalAccept = useCallback(() => {
    if (selectedConsultation) {
      handleAcceptConsultation(selectedConsultation.id);
      handleCloseConsultationModal();
    }
  }, [selectedConsultation, handleAcceptConsultation, handleCloseConsultationModal]);

  return (
    <SafeAreaView style={styles.container}>
      {/* 顶部导航栏 */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleBackPress}>
          <FontAwesome6 name="arrow-left" size={20} color="#6B7280" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>在线诊疗</Text>
        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.notificationButton} onPress={handleNotificationPress}>
            <FontAwesome6 name="bell" size={20} color="#6B7280" />
            <View style={styles.notificationBadge} />
          </TouchableOpacity>
        </View>
      </View>

      {/* 主要内容区域 */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} />
        }
      >
        {/* 统计概览 */}
        <View style={styles.statsSection}>
          <View style={styles.statsGrid}>
            <StatsCard
              count={statsData.pending}
              label="待处理"
              color="#F97316"
            />
            <StatsCard
              count={statsData.processing}
              label="处理中"
              color="#3B82F6"
            />
            <StatsCard
              count={statsData.completed}
              label="已完成"
              color="#10B981"
            />
          </View>
        </View>

        {/* 诊疗请求列表 */}
        <View style={styles.consultationSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>诊疗请求</Text>
            <TouchableOpacity
              style={styles.filterButton}
              onPress={() => setIsStatusFilterVisible(true)}
            >
              <Text style={styles.filterButtonText}>筛选</Text>
              <FontAwesome6 name="filter" size={14} color="#6B7280" />
            </TouchableOpacity>
          </View>

          <View style={styles.consultationList}>
            {filteredRequests.map((consultation) => (
              <ConsultationItem
                key={consultation.id}
                consultation={consultation}
                onAccept={handleAcceptConsultation}
                onViewDetail={handleViewDetail}
                onChat={handleChatPress}
                onVideo={handleVideoPress}
              />
            ))}
          </View>
        </View>
      </ScrollView>

      {/* 状态筛选器 */}
      <StatusFilter
        visible={isStatusFilterVisible}
        selectedStatus={selectedStatus}
        onStatusChange={handleStatusFilterChange}
        onClose={() => setIsStatusFilterVisible(false)}
      />

      {/* 诊疗请求详情模态框 */}
      <ConsultationModal
        visible={isConsultationModalVisible}
        consultation={selectedConsultation}
        onClose={handleCloseConsultationModal}
        onAccept={handleModalAccept}
      />

      {/* 聊天模态框 */}
      <ChatModal
        visible={isChatModalVisible}
        consultation={selectedConsultation}
        onClose={handleCloseChatModal}
      />
    </SafeAreaView>
  );
};

export default OnlineConsultScreen;

