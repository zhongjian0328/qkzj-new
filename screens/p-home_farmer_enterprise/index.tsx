

import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, Alert, } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { FontAwesome5, FontAwesome6 } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Path, Circle, Defs, LinearGradient as SvgLinearGradient, Stop } from 'react-native-svg';
import styles from './styles';

const FarmerEnterpriseHomePage = () => {
  const router = useRouter();
  const [selectedBatch, setSelectedBatch] = useState('batch1');
  const [isBatchSelectorVisible, setIsBatchSelectorVisible] = useState(false);

  const batchOptions = [
    { value: 'batch1', label: '批次A' },
    { value: 'batch2', label: '批次B' },
    { value: 'batch3', label: '批次C' },
  ];

  const handleNotificationPress = () => {
    Alert.alert('通知', '暂无新通知');
  };

  const handleProfilePress = () => {
    router.push('/p-user_profile');
  };

  const handleBatchManagementPress = () => {
    router.push('/p-batch_management');
  };

  const handleEmployeePermissionPress = () => {
    router.push('/p-employee_permission');
  };

  const handleDataExportPress = () => {
    router.push('/p-data_export');
  };

  const handleBulkPurchasePress = () => {
    router.push('/p-bulk_purchase');
  };

  const handleBatchSelectorPress = () => {
    setIsBatchSelectorVisible(true);
  };

  const handleBatchSelect = (batchValue: string) => {
    setSelectedBatch(batchValue);
    setIsBatchSelectorVisible(false);
  };

  const getSelectedBatchLabel = () => {
    const selected = batchOptions.find(option => option.value === selectedBatch);
    return selected?.label || '批次A';
  };

  const renderBatchSelectorModal = () => {
    if (!isBatchSelectorVisible) return null;

    return (
      <View style={styles.modalOverlay}>
        <TouchableOpacity 
          style={styles.modalBackground}
          onPress={() => setIsBatchSelectorVisible(false)}
          activeOpacity={1}
        />
        <View style={styles.batchSelectorModal}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>选择批次</Text>
            <TouchableOpacity onPress={() => setIsBatchSelectorVisible(false)}>
              <FontAwesome6 name="xmark" size={20} color="#6B7280" />
            </TouchableOpacity>
          </View>
          {batchOptions.map((option) => (
            <TouchableOpacity
              key={option.value}
              style={[
                styles.batchOption,
                selectedBatch === option.value && styles.batchOptionSelected
              ]}
              onPress={() => handleBatchSelect(option.value)}
            >
              <Text style={[
                styles.batchOptionText,
                selectedBatch === option.value && styles.batchOptionTextSelected
              ]}>
                {option.label}
              </Text>
              {selectedBatch === option.value && (
                <FontAwesome6 name="check" size={16} color="#3BCCA5" />
              )}
            </TouchableOpacity>
          ))}
        </View>
      </View>
    );
  };

  const renderDeathRateChart = () => {
    return (
      <View style={styles.chartContainer}>
        <Svg width="100%" height="120" viewBox="0 0 300 120">
          <Defs>
            <SvgLinearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <Stop offset="0%" stopColor="rgba(43, 106, 90, 0.1)" stopOpacity="1" />
              <Stop offset="100%" stopColor="rgba(43, 106, 90, 0.02)" stopOpacity="1" />
            </SvgLinearGradient>
          </Defs>
          <Path
            d="M20,80 Q70,60 120,40 T220,30 L280,25"
            stroke="#2B6A5A"
            strokeWidth="2"
            fill="none"
          />
          <Path
            d="M20,80 Q70,60 120,40 T220,30 L280,25 L280,100 L20,100 Z"
            fill="url(#areaGradient)"
          />
          <Circle cx="20" cy="80" r="3" fill="#2B6A5A" />
          <Circle cx="70" cy="60" r="3" fill="#2B6A5A" />
          <Circle cx="120" cy="40" r="3" fill="#2B6A5A" />
          <Circle cx="170" cy="45" r="3" fill="#2B6A5A" />
          <Circle cx="220" cy="30" r="3" fill="#2B6A5A" />
          <Circle cx="280" cy="25" r="3" fill="#2B6A5A" />
        </Svg>
      </View>
    );
  };

  const renderBarChart = () => {
    const barData = [
      { day: '周一', value: '2.1T', height: 60 },
      { day: '周二', value: '2.4T', height: 75 },
      { day: '周三', value: '2.2T', height: 65 },
      { day: '周四', value: '2.6T', height: 80 },
      { day: '周五', value: '2.3T', height: 70 },
      { day: '周六', value: '2.0T', height: 55 },
      { day: '周日', value: '1.8T', height: 45 },
    ];

    return (
      <View style={styles.barChartContainer}>
        {barData.map((item, index) => (
          <View key={index} style={styles.barWrapper}>
            <LinearGradient
              colors={['#3BCCA5', '#D3F8EE']}
              start={{ x: 0, y: 1 }}
              end={{ x: 0, y: 0 }}
              style={[styles.bar, { height: `${item.height}%` }]}
            />
            <Text style={styles.barDay}>{item.day}</Text>
            <Text style={styles.barValue}>{item.value}</Text>
          </View>
        ))}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* 顶部导航栏 */}
      <View style={styles.header}>
        <View style={styles.userInfo}>
          <Image
            source={{ uri: 'https://s.coze.cn/image/0rTt8D4a-LQ/' }}
            style={styles.userAvatar}
          />
          <View>
            <Text style={styles.userGreeting}>早上好，李经理</Text>
            <Text style={styles.userRole}>养殖企业</Text>
          </View>
        </View>
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.notificationButton} onPress={handleNotificationPress}>
            <FontAwesome6 name="bell" size={20} color="#6B7280" />
            <View style={styles.notificationBadge} />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleProfilePress}>
            <FontAwesome6 name="circle-user" size={20} color="#6B7280" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* 核心数据看板 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>生产数据总览</Text>
          
          {/* 数据卡片 */}
          <View style={styles.dataCardsGrid}>
            <View style={styles.dataCard}>
              <View style={styles.dataCardHeader}>
                <Text style={styles.dataCardLabel}>今日死淘数</Text>
                <FontAwesome6 name="triangle-exclamation" size={16} color="#F97316" />
              </View>
              <View style={styles.dataCardValueRow}>
                <Text style={styles.dataCardValue}>12</Text>
                <Text style={styles.dataCardUnit}>只</Text>
              </View>
              <Text style={styles.dataCardSubtext}>较昨日 +3</Text>
            </View>

            <View style={styles.dataCard}>
              <View style={styles.dataCardHeader}>
                <Text style={styles.dataCardLabel}>疫苗倒计时</Text>
                <FontAwesome6 name="syringe" size={16} color="#3B82F6" />
              </View>
              <View style={styles.dataCardValueRow}>
                <Text style={[styles.dataCardValue, { color: '#3B82F6' }]}>5</Text>
                <Text style={styles.dataCardUnit}>天</Text>
              </View>
              <Text style={styles.dataCardSubtext}>新城疫疫苗</Text>
            </View>

            <View style={styles.dataCard}>
              <View style={styles.dataCardHeader}>
                <Text style={styles.dataCardLabel}>当前存栏</Text>
                <FontAwesome6 name="layer-group" size={16} color="#10B981" />
              </View>
              <View style={styles.dataCardValueRow}>
                <Text style={[styles.dataCardValue, { color: '#10B981' }]}>15,680</Text>
                <Text style={styles.dataCardUnit}>只</Text>
              </View>
              <Text style={styles.dataCardSubtext}>3个批次</Text>
            </View>

            <View style={styles.dataCard}>
              <View style={styles.dataCardHeader}>
                <Text style={styles.dataCardLabel}>料肉比</Text>
                <FontAwesome6 name="chart-line" size={16} color="#8B5CF6" />
              </View>
              <View style={styles.dataCardValueRow}>
                <Text style={[styles.dataCardValue, { color: '#8B5CF6' }]}>1.85</Text>
                <Text style={styles.dataCardUnit}>:1</Text>
              </View>
              <Text style={styles.dataCardSubtext}>目标: 1.80</Text>
            </View>
          </View>

          {/* 死淘率曲线图 */}
          <View style={styles.chartCard}>
            <View style={styles.chartHeader}>
              <Text style={styles.chartTitle}>7天死淘率趋势</Text>
              <TouchableOpacity style={styles.batchSelector} onPress={handleBatchSelectorPress}>
                <Text style={styles.batchSelectorText}>{getSelectedBatchLabel()}</Text>
                <FontAwesome6 name="chevron-down" size={12} color="#6B7280" />
              </TouchableOpacity>
            </View>
            {renderDeathRateChart()}
            <View style={styles.chartLabels}>
              <Text style={styles.chartLabel}>1/10</Text>
              <Text style={styles.chartLabel}>1/11</Text>
              <Text style={styles.chartLabel}>1/12</Text>
              <Text style={styles.chartLabel}>1/13</Text>
              <Text style={styles.chartLabel}>1/14</Text>
              <Text style={styles.chartLabel}>1/15</Text>
            </View>
          </View>

          {/* 耗料分析柱状图 */}
          <View style={styles.chartCard}>
            <Text style={styles.chartTitle}>本周耗料分析</Text>
            {renderBarChart()}
          </View>
        </View>

        {/* 快捷功能区 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>快捷功能</Text>
          
          <View style={styles.functionsGrid}>
            <TouchableOpacity style={styles.functionCard} onPress={handleBatchManagementPress}>
              <View style={styles.functionIconContainer}>
                <FontAwesome6 name="layer-group" size={20} color="#3BCCA5" />
              </View>
              <View style={styles.functionInfo}>
                <Text style={styles.functionTitle}>批次管理</Text>
                <Text style={styles.functionSubtitle}>管理养殖批次</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity style={styles.functionCard} onPress={handleEmployeePermissionPress}>
              <View style={styles.functionIconContainer}>
                <FontAwesome6 name="users" size={20} color="#3BCCA5" />
              </View>
              <View style={styles.functionInfo}>
                <Text style={styles.functionTitle}>员工权限</Text>
                <Text style={styles.functionSubtitle}>管理员工权限</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity style={styles.functionCard} onPress={handleDataExportPress}>
              <View style={styles.functionIconContainer}>
                <FontAwesome6 name="download" size={20} color="#3BCCA5" />
              </View>
              <View style={styles.functionInfo}>
                <Text style={styles.functionTitle}>数据导出</Text>
                <Text style={styles.functionSubtitle}>导出生产数据</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity style={styles.functionCard} onPress={handleBulkPurchasePress}>
              <View style={styles.functionIconContainer}>
                <FontAwesome6 name="cart-shopping" size={20} color="#3BCCA5" />
              </View>
              <View style={styles.functionInfo}>
                <Text style={styles.functionTitle}>大宗采购</Text>
                <Text style={styles.functionSubtitle}>批量采购物资</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>

        {/* 生产提醒 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>生产提醒</Text>
          
          <View style={styles.alertsList}>
            <View style={[styles.alertCard, styles.alertCardBlue]}>
              <FontAwesome6 name="syringe" size={16} color="#3B82F6" style={styles.alertIcon} />
              <View style={styles.alertContent}>
                <Text style={styles.alertTitle}>疫苗接种提醒</Text>
                <Text style={styles.alertDescription}>批次A鸡群需在5天后进行新城疫疫苗接种</Text>
                <Text style={styles.alertSubtext}>预计用量: 1,200羽份</Text>
              </View>
            </View>

            <View style={[styles.alertCard, styles.alertCardYellow]}>
              <FontAwesome6 name="wheat-awn" size={16} color="#F59E0B" style={styles.alertIcon} />
              <View style={styles.alertContent}>
                <Text style={styles.alertTitleYellow}>饲料库存预警</Text>
                <Text style={styles.alertDescriptionYellow}>当前饲料库存仅能维持3天，请及时采购</Text>
                <Text style={styles.alertSubtextYellow}>建议采购量: 8-10吨</Text>
              </View>
            </View>

            <View style={[styles.alertCard, styles.alertCardGreen]}>
              <FontAwesome5 name="heartbeat" size={16} color="#10B981" style={styles.alertIcon} />
              <View style={styles.alertContent}>
                <Text style={styles.alertTitleGreen}>健康状况良好</Text>
                <Text style={styles.alertDescriptionGreen}>本周死淘率持续下降，鸡群健康状况稳定</Text>
                <Text style={styles.alertSubtextGreen}>当前死淘率: 0.08%</Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>

      {renderBatchSelectorModal()}
    </SafeAreaView>
  );
};

export default FarmerEnterpriseHomePage;

