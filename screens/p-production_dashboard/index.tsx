

import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, Alert, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { FontAwesome6 } from '@expo/vector-icons';
import { LineChart, BarChart } from 'react-native-chart-kit';
import styles from './styles';

const screenWidth = Dimensions.get('window').width;

interface CoreDataItem {
  id: string;
  title: string;
  value: string;
  change: string;
  description: string;
  icon: string;
  iconColor: string;
  iconBgColor: string;
  valueColor: string;
  changeColor: string;
}

interface QuickFunctionItem {
  id: string;
  title: string;
  description: string;
  icon: string;
  route: string;
}

const ProductionDashboard: React.FC = () => {
  const router = useRouter();
  
  const [selectedMortalityPeriod, setSelectedMortalityPeriod] = useState('7d');
  const [selectedFeedPeriod, setSelectedFeedPeriod] = useState('7d');
  const [isMortalityPeriodModalVisible, setIsMortalityPeriodModalVisible] = useState(false);
  const [isFeedPeriodModalVisible, setIsFeedPeriodModalVisible] = useState(false);

  const coreDataItems: CoreDataItem[] = [
    {
      id: 'death-count',
      title: '今日死淘数',
      value: '12',
      change: '+3',
      description: '较昨日增加',
      icon: 'triangle-exclamation',
      iconColor: '#DC2626',
      iconBgColor: '#FEE2E2',
      valueColor: '#DC2626',
      changeColor: '#EF4444',
    },
    {
      id: 'vaccine-countdown',
      title: '疫苗倒计时',
      value: '3',
      change: '天',
      description: '下次疫苗接种',
      icon: 'syringe',
      iconColor: '#2563EB',
      iconBgColor: '#DBEAFE',
      valueColor: '#2563EB',
      changeColor: '#6B7280',
    },
    {
      id: 'livestock-count',
      title: '当前存栏',
      value: '15,847',
      change: '+120',
      description: '较昨日增加',
      icon: 'layer-group',
      iconColor: '#059669',
      iconBgColor: '#D1FAE5',
      valueColor: '#059669',
      changeColor: '#10B981',
    },
    {
      id: 'feed-efficiency',
      title: '料肉比',
      value: '1.85',
      change: '-0.02',
      description: '较上周改善',
      icon: 'chart-line',
      iconColor: '#7C3AED',
      iconBgColor: '#EDE9FE',
      valueColor: '#7C3AED',
      changeColor: '#8B5CF6',
    },
  ];

  const quickFunctionItems: QuickFunctionItem[] = [
    {
      id: 'batch-management',
      title: '批次管理',
      description: '管理养殖批次',
      icon: 'layer-group',
      route: '/p-batch_management',
    },
    {
      id: 'employee-permission',
      title: '员工权限',
      description: '管理员工权限',
      icon: 'users-gear',
      route: '/p-employee_permission',
    },
    {
      id: 'data-export',
      title: '数据导出',
      description: '导出生产数据',
      icon: 'download',
      route: '/p-data_export',
    },
    {
      id: 'bulk-purchase',
      title: '大宗采购',
      description: '批量采购物资',
      icon: 'cart-shopping',
      route: '/p-bulk_purchase',
    },
  ];

  const periodOptions = [
    { label: '近7天', value: '7d' },
    { label: '近30天', value: '30d' },
    { label: '近90天', value: '90d' },
  ];



  const handleNotificationPress = () => {
    Alert.alert('通知', '您有新的通知');
  };

  const handleProfilePress = () => {
    router.push('/p-user_profile');
  };

  const handleQuickFunctionPress = (route: string) => {
    router.push(route as any);
  };

  const handleMortalityPeriodSelect = (value: string) => {
    setSelectedMortalityPeriod(value);
    setIsMortalityPeriodModalVisible(false);
  };

  const handleFeedPeriodSelect = (value: string) => {
    setSelectedFeedPeriod(value);
    setIsFeedPeriodModalVisible(false);
  };

  const renderCoreDataCard = (item: CoreDataItem) => (
    <View key={item.id} style={styles.coreDataCard}>
      <View style={styles.coreDataHeader}>
        <Text style={styles.coreDataTitle}>{item.title}</Text>
        <View style={[styles.coreDataIconContainer, { backgroundColor: item.iconBgColor }]}>
          <FontAwesome6 name={item.icon} size={14} color={item.iconColor} />
        </View>
      </View>
      <View style={styles.coreDataValueContainer}>
        <Text style={[styles.coreDataValue, { color: item.valueColor }]}>{item.value}</Text>
        <Text style={[styles.coreDataChange, { color: item.changeColor }]}>{item.change}</Text>
      </View>
      <Text style={styles.coreDataDescription}>{item.description}</Text>
    </View>
  );

  const renderQuickFunctionCard = (item: QuickFunctionItem) => (
    <TouchableOpacity
      key={item.id}
      style={styles.quickFunctionCard}
      onPress={() => handleQuickFunctionPress(item.route)}
      activeOpacity={0.7}
    >
      <View style={styles.quickFunctionIconContainer}>
        <FontAwesome6 name={item.icon} size={20} color="#3BCCA5" />
      </View>
      <View style={styles.quickFunctionTextContainer}>
        <Text style={styles.quickFunctionTitle}>{item.title}</Text>
        <Text style={styles.quickFunctionDescription}>{item.description}</Text>
      </View>
    </TouchableOpacity>
  );

  // 图表配置
  const chartConfig = {
    backgroundGradientFrom: '#FFFFFF',
    backgroundGradientTo: '#FFFFFF',
    decimalPlaces: 2,
    color: (opacity = 1) => `rgba(59, 204, 165, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(107, 114, 128, ${opacity})`,
    style: {
      borderRadius: 16,
    },
    propsForDots: {
      r: '6',
      strokeWidth: '2',
      stroke: '#3BCCA5',
    },
    propsForBackgroundLines: {
      strokeDasharray: '',
      strokeWidth: 1,
      stroke: '#E5E7EB',
    },
  };
  
  // 准备图表数据
  const mortalityChartData = {
    labels: ['1/10', '1/11', '1/12', '1/13', '1/14', '1/15', '今天'],
    datasets: [{
      data: [60, 45, 70, 50, 65, 40, 55],
      color: (opacity = 1) => `rgba(59, 204, 165, ${opacity})`,
      strokeWidth: 2,
      pointColor: '#EF4444',
      pointRadius: 6,
      pointStrokeWidth: 2,
    }],
  };
  
  const feedChartData = {
    labels: ['1/10', '1/11', '1/12', '1/13', '1/14', '1/15', '今天'],
    datasets: [{
      data: [70, 85, 60, 90, 75, 80, 78],
      color: (opacity = 1) => `rgba(59, 130, 246, ${opacity})`,
      backgroundColor: (opacity = 0.2) => `rgba(59, 130, 246, ${opacity})`,
    }],
  };

  const renderPeriodModal = (
    visible: boolean,
    onClose: () => void,
    onSelect: (value: string) => void,
    selectedValue: string
  ) => (
    <View style={[styles.modalOverlay, { opacity: visible ? 1 : 0 }]}>
      {visible && (
        <>
          <TouchableOpacity style={styles.modalBackdrop} onPress={onClose} />
          <View style={styles.modalContent}>
            {periodOptions.map((option) => (
              <TouchableOpacity
                key={option.value}
                style={styles.modalOption}
                onPress={() => onSelect(option.value)}
              >
                <Text style={[
                  styles.modalOptionText,
                  selectedValue === option.value && styles.modalOptionTextSelected
                ]}>
                  {option.label}
                </Text>
                {selectedValue === option.value && (
                  <FontAwesome6 name="check" size={16} color="#3BCCA5" />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </>
      )}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* 顶部导航栏 */}
      <View style={styles.header}>
        <View style={styles.userInfo}>
          <Image
            source={{ uri: 'https://s.coze.cn/image/yJLIkQDKNQk/' }}
            style={styles.userAvatar}
          />
          <View style={styles.userTextContainer}>
            <Text style={styles.userGreeting}>早上好，李经理</Text>
            <Text style={styles.userRole}>养殖企业</Text>
          </View>
        </View>
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.notificationButton} onPress={handleNotificationPress}>
            <FontAwesome6 name="bell" size={20} color="#6B7280" />
            <View style={styles.notificationBadge} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.profileButton} onPress={handleProfilePress}>
            <FontAwesome6 name="circle-user" size={20} color="#6B7280" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* 核心数据卡片 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>核心数据</Text>
          <View style={styles.coreDataGrid}>
            {coreDataItems.map(renderCoreDataCard)}
          </View>
        </View>

        {/* 图表分析区域 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>数据分析</Text>
          
          {/* 死淘率曲线图 */}
              <View style={styles.chartCard}>
                <View style={styles.chartHeader}>
                  <Text style={styles.chartTitle}>死淘率趋势</Text>
                  <TouchableOpacity
                    style={styles.periodSelector}
                    onPress={() => setIsMortalityPeriodModalVisible(true)}
                  >
                    <Text style={styles.periodSelectorText}>
                      {periodOptions.find(opt => opt.value === selectedMortalityPeriod)?.label}
                    </Text>
                    <FontAwesome6 name="chevron-down" size={12} color="#6B7280" />
                  </TouchableOpacity>
                </View>
                <View style={styles.chartContainer}>
                  <LineChart
                    data={mortalityChartData}
                    width={screenWidth - 48}
                    height={220}
                    chartConfig={chartConfig}
                    bezier
                    style={styles.chart}
                    withInnerLines={true}
                    withVerticalLabels={true}
                    withHorizontalLabels={true}
                    withDots={true}
                    fromZero={true}
                    segments={5}
                    yAxisLabel=""
                    yAxisSuffix="%"
                  />
                </View>
                <View style={styles.chartFooter}>
                  <Text style={styles.chartFooterText}>平均死淘率: 2.3%</Text>
                  <Text style={styles.chartFooterTextHighlight}>今日: 2.8%</Text>
                </View>
              </View>

              {/* 耗料分析柱状图 */}
              <View style={styles.chartCard}>
                <View style={styles.chartHeader}>
                  <Text style={styles.chartTitle}>耗料分析</Text>
                  <TouchableOpacity
                    style={styles.periodSelector}
                    onPress={() => setIsFeedPeriodModalVisible(true)}
                  >
                    <Text style={styles.periodSelectorText}>
                      {periodOptions.find(opt => opt.value === selectedFeedPeriod)?.label}
                    </Text>
                    <FontAwesome6 name="chevron-down" size={12} color="#6B7280" />
                  </TouchableOpacity>
                </View>
                <View style={styles.chartContainer}>
                  <BarChart
                    data={feedChartData}
                    width={screenWidth - 48}
                    height={220}
                    chartConfig={chartConfig}
                    style={styles.chart}
                    showValuesOnTopOfBars={true}
                    fromZero={true}
                    segments={5}
                    withInnerLines={true}
                    withVerticalLabels={true}
                    withHorizontalLabels={true}
                    yAxisLabel=""
                    yAxisSuffix="吨"
                  />
                </View>
                <View style={styles.chartFooter}>
                  <Text style={styles.chartFooterText}>平均日耗料: 2.8吨</Text>
                  <Text style={styles.chartFooterTextAccent}>今日: 2.9吨</Text>
                </View>
              </View>
        </View>

        {/* 快捷功能入口 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>快捷功能</Text>
          <View style={styles.quickFunctionsGrid}>
            {quickFunctionItems.map(renderQuickFunctionCard)}
          </View>
        </View>
      </ScrollView>

      {/* 时间范围选择器模态框 */}
      {renderPeriodModal(
        isMortalityPeriodModalVisible,
        () => setIsMortalityPeriodModalVisible(false),
        handleMortalityPeriodSelect,
        selectedMortalityPeriod
      )}
      
      {renderPeriodModal(
        isFeedPeriodModalVisible,
        () => setIsFeedPeriodModalVisible(false),
        handleFeedPeriodSelect,
        selectedFeedPeriod
      )}
    </SafeAreaView>
  );
};

export default ProductionDashboard;

