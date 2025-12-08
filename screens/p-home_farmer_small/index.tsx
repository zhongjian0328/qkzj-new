

import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { FontAwesome6 } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import styles from './styles';

const HomeFarmerSmallScreen = () => {
  const router = useRouter();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      // 模拟刷新数据
      await new Promise(resolve => setTimeout(resolve, 1000));
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleNotificationPress = () => {
    console.log('显示通知列表');
  };

  const handleProfilePress = () => {
    router.push('/p-user_profile');
  };

  const handleAiDiagnosisPress = () => {
    router.push('/p-ai_diagnosis');
  };

  const handleTreatmentPlanPress = () => {
    router.push('/p-treatment_plan');
  };

  const handleVeterinaryMallPress = () => {
    router.push('/p-veterinary_mall');
  };

  const handleNearbyStoresPress = () => {
    console.log('需要调用第三方接口实现地图导航功能');
  };

  const handleKnowledgeBasePress = () => {
    router.push('/p-knowledge_graph');
  };

  const handleViewAllDiagnosisPress = () => {
    console.log('跳转到诊断历史页面');
  };

  const handleWeatherServicePress = () => {
    console.log('显示天气预警信息');
  };

  const handleEpidemicServicePress = () => {
    console.log('跳转到疫情监测页面');
  };

  const handleConsultServicePress = () => {
    console.log('跳转到在线咨询页面');
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* 顶部导航栏 */}
      <View style={styles.header}>
        <View style={styles.userInfo}>
          <Image
            source={{ uri: 'https://s.coze.cn/image/ihIaKd4Ndl0/' }}
            style={styles.userAvatar}
          />
          <View>
            <Text style={styles.userGreeting}>早上好，王养殖户</Text>
            <Text style={styles.userRole}>小散户</Text>
          </View>
        </View>
        <View style={styles.headerActions}>
          <TouchableOpacity
            style={styles.notificationButton}
            onPress={handleNotificationPress}
            activeOpacity={0.7}
          >
            <FontAwesome6 name="bell" size={20} color="#6B7280" />
            <View style={styles.notificationBadge} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.profileButton}
            onPress={handleProfilePress}
            activeOpacity={0.7}
          >
            <FontAwesome6 name="circle-user" size={20} color="#6B7280" />
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
        showsVerticalScrollIndicator={false}
      >
        {/* 核心功能区 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>核心功能</Text>
          
          {/* AI诊断主按钮 */}
          <TouchableOpacity
            style={styles.aiDiagnosisMain}
            onPress={handleAiDiagnosisPress}
            activeOpacity={0.9}
          >
            <LinearGradient
              colors={['#D3F8EE', '#3BCCA5']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.gradientBackground}
            >
              <View style={styles.aiDiagnosisContent}>
                <View>
                  <Text style={styles.aiDiagnosisTitle}>AI智能诊断</Text>
                  <Text style={styles.aiDiagnosisDesc}>拍照上传，快速诊断禽病</Text>
                </View>
                <View style={styles.aiDiagnosisIcon}>
                  <FontAwesome6 name="stethoscope" size={24} color="#2B6A5A" />
                </View>
              </View>
            </LinearGradient>
          </TouchableOpacity>

          {/* 其他功能入口 */}
          <View style={styles.otherFunctionsGrid}>
            <TouchableOpacity
              style={styles.functionCard}
              onPress={handleTreatmentPlanPress}
              activeOpacity={0.8}
            >
              <View style={styles.functionCardContent}>
                <View style={styles.functionIcon}>
                  <FontAwesome6 name="prescription-bottle" size={20} color="#3BCCA5" />
                </View>
                <View>
                  <Text style={styles.functionTitle}>治疗方案</Text>
                  <Text style={styles.functionDesc}>查看推荐方案</Text>
                </View>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.functionCard}
              onPress={handleVeterinaryMallPress}
              activeOpacity={0.8}
            >
              <View style={styles.functionCardContent}>
                <View style={styles.functionIcon}>
                  <FontAwesome6 name="cart-shopping" size={20} color="#3BCCA5" />
                </View>
                <View>
                  <Text style={styles.functionTitle}>兽药商城</Text>
                  <Text style={styles.functionDesc}>在线购买药品</Text>
                </View>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.functionCard}
              onPress={handleNearbyStoresPress}
              activeOpacity={0.8}
            >
              <View style={styles.functionCardContent}>
                <View style={styles.functionIcon}>
                  <FontAwesome6 name="location-dot" size={20} color="#3BCCA5" />
                </View>
                <View>
                  <Text style={styles.functionTitle}>周边兽药店</Text>
                  <Text style={styles.functionDesc}>查找附近药店</Text>
                </View>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.functionCard}
              onPress={handleKnowledgeBasePress}
              activeOpacity={0.8}
            >
              <View style={styles.functionCardContent}>
                <View style={styles.functionIcon}>
                  <FontAwesome6 name="book" size={20} color="#3BCCA5" />
                </View>
                <View>
                  <Text style={styles.functionTitle}>知识百科</Text>
                  <Text style={styles.functionDesc}>学习养殖知识</Text>
                </View>
              </View>
            </TouchableOpacity>
          </View>
        </View>

        {/* 近期诊断历史 */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>近期诊断</Text>
            <TouchableOpacity onPress={handleViewAllDiagnosisPress} activeOpacity={0.7}>
              <Text style={styles.viewAllButton}>查看全部</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.diagnosisList}>
            <View style={styles.diagnosisItem}>
              <View style={styles.diagnosisItemContent}>
                <Image
                  source={{ uri: 'https://s.coze.cn/image/btzOrcc1jDk/' }}
                  style={styles.diagnosisImage}
                />
                <View style={styles.diagnosisInfo}>
                  <Text style={styles.diagnosisDisease}>新城疫</Text>
                  <Text style={styles.diagnosisConfidence}>置信度：95%</Text>
                  <Text style={styles.diagnosisTime}>2024-01-15 14:30</Text>
                </View>
              </View>
              <View style={styles.diagnosisStatusResolved}>
                <Text style={styles.diagnosisStatusTextResolved}>已处理</Text>
              </View>
            </View>

            <View style={styles.diagnosisItem}>
              <View style={styles.diagnosisItemContent}>
                <Image
                  source={{ uri: 'https://s.coze.cn/image/1pdLBZ5SVyg/' }}
                  style={styles.diagnosisImage}
                />
                <View style={styles.diagnosisInfo}>
                  <Text style={styles.diagnosisDisease}>禽流感</Text>
                  <Text style={styles.diagnosisConfidence}>置信度：88%</Text>
                  <Text style={styles.diagnosisTime}>2024-01-14 09:15</Text>
                </View>
              </View>
              <View style={styles.diagnosisStatusTreating}>
                <Text style={styles.diagnosisStatusTextTreating}>治疗中</Text>
              </View>
            </View>
          </View>
        </View>

        {/* 养殖小贴士 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>养殖小贴士</Text>
          
          <View style={styles.tipsCard}>
            <View style={styles.tipsContent}>
              <View style={styles.tipsIcon}>
                <FontAwesome6 name="lightbulb" size={16} color="#3BCCA5" />
              </View>
              <View style={styles.tipsTextContent}>
                <Text style={styles.tipsTitle}>冬季禽流感预防</Text>
                <Text style={styles.tipsContentText}>
                  冬季是禽流感高发期，建议加强鸡舍通风，定期消毒，及时接种疫苗。发现异常症状应立即隔离病禽并进行诊断。
                </Text>
                <View style={styles.tipsSource}>
                  <FontAwesome6 name="calendar-days" size={10} color="#6B7280" />
                  <Text style={styles.tipsSourceText}>2024-01-15</Text>
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* 快捷服务 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>快捷服务</Text>
          
          <View style={styles.servicesGrid}>
            <TouchableOpacity
              style={styles.serviceCard}
              onPress={handleWeatherServicePress}
              activeOpacity={0.8}
            >
              <View style={styles.serviceIconWeather}>
                <FontAwesome6 name="cloud-sun" size={20} color="#2563EB" />
              </View>
              <Text style={styles.serviceTitle}>天气预警</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.serviceCard}
              onPress={handleEpidemicServicePress}
              activeOpacity={0.8}
            >
              <View style={styles.serviceIconEpidemic}>
                <FontAwesome6 name="triangle-exclamation" size={20} color="#EA580C" />
              </View>
              <Text style={styles.serviceTitle}>疫情监测</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.serviceCard}
              onPress={handleConsultServicePress}
              activeOpacity={0.8}
            >
              <View style={styles.serviceIconConsult}>
                <FontAwesome6 name="comments" size={20} color="#9333EA" />
              </View>
              <Text style={styles.serviceTitle}>在线咨询</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default HomeFarmerSmallScreen;

