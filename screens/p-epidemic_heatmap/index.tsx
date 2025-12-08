

import React, { useState, useCallback, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Modal, FlatList, Alert, } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { FontAwesome6 } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Path } from 'react-native-svg';
import styles from './styles';
import { getEpidemicHeatmapApi } from '../../src/services/api';

interface HeatPoint {
  id: string;
  level: 'low' | 'medium' | 'high' | 'alert';
  disease: string;
  count: number;
  top: string;
  left: string;
  size: number;
}

interface AlertItem {
  id: string;
  title: string;
  level: 'high' | 'medium' | 'low';
  description: string;
  location: string;
  time: string;
  count: number;
}

interface FilterOption {
  value: string;
  label: string;
}

const EpidemicHeatmapScreen: React.FC = () => {
  const router = useRouter();
  
  // 筛选状态
  const [isTimeFilterVisible, setIsTimeFilterVisible] = useState(false);
  const [isDiseaseFilterVisible, setIsDiseaseFilterVisible] = useState(false);
  const [selectedTimeFilter, setSelectedTimeFilter] = useState('最近7天');
  const [selectedDiseaseFilter, setSelectedDiseaseFilter] = useState('全部疾病');
  
  // 弹窗状态
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalData, setModalData] = useState<{
    disease: string;
    level: string;
    count: number;
  } | null>(null);
  
  // 数据状态
  const [isLoading, setIsLoading] = useState(false);
  const [heatPoints, setHeatPoints] = useState<HeatPoint[]>([]);
  const [alertItems, setAlertItems] = useState<AlertItem[]>([]);
  const [totalCases, setTotalCases] = useState(0);
  const [alertCount, setAlertCount] = useState(0);
  
  // 筛选选项
  const timeFilterOptions: FilterOption[] = [
    { value: '1', label: '最近1天' },
    { value: '7', label: '最近7天' },
    { value: '30', label: '最近30天' },
    { value: '90', label: '最近3个月' },
  ];
  
  const diseaseFilterOptions: FilterOption[] = [
    { value: 'all', label: '全部疾病' },
    { value: 'avian-flu', label: '禽流感' },
    { value: 'newcastle', label: '新城疫' },
    { value: 'infectious-bronchitis', label: '传染性支气管炎' },
    { value: 'infectious-bursal', label: '传染性法氏囊病' },
  ];
  
  // 获取疫情数据
  const fetchEpidemicData = async () => {
    setIsLoading(true);
    try {
      // 根据选择的筛选条件转换为API需要的参数
      const timeRange = selectedTimeFilter.replace('最近', '').replace('天', '').replace('个月', 'M');
      const diseaseType = selectedDiseaseFilter === '全部疾病' ? 'all' : 
                        selectedDiseaseFilter === '禽流感' ? 'avian-flu' :
                        selectedDiseaseFilter === '新城疫' ? 'newcastle' :
                        selectedDiseaseFilter === '传染性支气管炎' ? 'infectious-bronchitis' :
                        'infectious-bursal';
      
      const response = await getEpidemicHeatmapApi({ timeRange, diseaseType });
      if (response.success && response.data) {
        setHeatPoints(response.data.heatPoints);
        setAlertItems(response.data.alerts);
        setTotalCases(response.data.stats.totalCases);
        setAlertCount(response.data.stats.alertCount);
      } else {
        Alert.alert('获取失败', response.message || '获取疫情数据失败，请重试');
      }
    } catch (error) {
      Alert.alert('获取失败', '网络异常，请检查网络连接后重试');
    } finally {
      setIsLoading(false);
    }
  };
  
  // 组件挂载时获取数据
  useEffect(() => {
    fetchEpidemicData();
  }, []);
  
  // 筛选条件变化时获取数据
  useEffect(() => {
    fetchEpidemicData();
  }, [selectedTimeFilter, selectedDiseaseFilter]);
  
  // 处理返回
  const handleGoBack = useCallback(() => {
    if (router.canGoBack()) {
      router.back();
    }
  }, [router]);
  
  // 处理筛选选择
  const handleTimeFilterSelect = useCallback((option: FilterOption) => {
    setSelectedTimeFilter(option.label);
    setIsTimeFilterVisible(false);
    console.log('时间筛选变更为:', option.value);
  }, []);
  
  const handleDiseaseFilterSelect = useCallback((option: FilterOption) => {
    setSelectedDiseaseFilter(option.label);
    setIsDiseaseFilterVisible(false);
    console.log('疾病筛选变更为:', option.value);
  }, []);
  
  // 处理刷新
  const handleRefresh = useCallback(() => {
    fetchEpidemicData();
  }, []);
  
  // 处理地图控制
  const handleZoomIn = useCallback(() => {
    console.log('地图放大');
  }, []);
  
  const handleZoomOut = useCallback(() => {
    console.log('地图缩小');
  }, []);
  
  const handleLocation = useCallback(() => {
    console.log('定位到我的位置');
  }, []);
  
  const handleFullscreen = useCallback(() => {
    console.log('地图全屏');
  }, []);
  
  // 处理热点点击
  const handleHeatPointPress = useCallback((point: HeatPoint) => {
    const levelNames = {
      low: '低风险',
      medium: '中风险',
      high: '高风险',
      alert: '高风险',
    };
    
    setModalData({
      disease: point.disease,
      level: levelNames[point.level],
      count: point.count,
    });
    setIsModalVisible(true);
  }, []);
  
  // 处理报警详情点击
  const handleAlertDetailPress = useCallback((alertId: string) => {
    console.log('查看报警详情:', alertId);
    // 这里可以添加跳转到详细页面的逻辑
  }, []);
  
  // 处理通知点击
  const handleNotificationPress = useCallback(() => {
    console.log('查看通知');
  }, []);
  
  // 处理个人资料点击
  const handleProfilePress = useCallback(() => {
    router.push('/p-user_profile');
  }, [router]);
  
  // 处理查看全部报警
  const handleViewAllAlerts = useCallback(() => {
    console.log('查看全部报警');
  }, []);
  
  // 获取热点样式
  const getHeatPointStyle = useCallback((point: HeatPoint) => {
    const baseStyle = {
      position: 'absolute' as const,
      width: point.size,
      height: point.size,
      borderRadius: point.size / 2,
      top: typeof point.top === 'string' ? parseInt(point.top, 10) : point.top,
      left: typeof point.left === 'string' ? parseInt(point.left, 10) : point.left,
    };
    
    switch (point.level) {
      case 'low':
        return {
          ...baseStyle,
          backgroundColor: 'rgba(59, 204, 165, 0.6)',
          shadowColor: 'rgba(59, 204, 165, 0.4)',
          shadowOffset: { width: 0, height: 0 },
          shadowOpacity: 1,
          shadowRadius: 10,
          elevation: 8,
        };
      case 'medium':
        return {
          ...baseStyle,
          backgroundColor: 'rgba(255, 193, 7, 0.6)',
          shadowColor: 'rgba(255, 193, 7, 0.4)',
          shadowOffset: { width: 0, height: 0 },
          shadowOpacity: 1,
          shadowRadius: 10,
          elevation: 8,
        };
      case 'high':
        return {
          ...baseStyle,
          backgroundColor: 'rgba(220, 38, 38, 0.6)',
          shadowColor: 'rgba(220, 38, 38, 0.4)',
          shadowOffset: { width: 0, height: 0 },
          shadowOpacity: 1,
          shadowRadius: 10,
          elevation: 8,
        };
      case 'alert':
        return {
          ...baseStyle,
          backgroundColor: 'rgba(153, 27, 27, 0.8)',
          shadowColor: 'rgba(153, 27, 27, 0.6)',
          shadowOffset: { width: 0, height: 0 },
          shadowOpacity: 1,
          shadowRadius: 15,
          elevation: 12,
          borderWidth: 2,
          borderColor: '#DC2626',
        };
      default:
        return baseStyle;
    }
  }, []);
  
  // 获取报警级别样式
  const getAlertLevelStyle = useCallback((level: string) => {
    switch (level) {
      case 'high':
        return styles.alertHigh;
      case 'medium':
        return styles.alertMedium;
      case 'low':
        return styles.alertLow;
      default:
        return styles.alertLow;
    }
  }, []);
  
  // 获取报警图标
  const getAlertIcon = useCallback((level: string) => {
    switch (level) {
      case 'high':
        return 'triangle-exclamation';
      case 'medium':
        return 'circle-exclamation';
      case 'low':
        return 'circle-info';
      default:
        return 'circle-info';
    }
  }, []);
  
  // 渲染筛选选项
  const renderFilterOption = useCallback(({ item }: { item: FilterOption }) => (
    <TouchableOpacity
      style={styles.filterOption}
      onPress={() => {
        if (isTimeFilterVisible) {
          handleTimeFilterSelect(item);
        } else {
          handleDiseaseFilterSelect(item);
        }
      }}
    >
      <Text style={styles.filterOptionText}>{item.label}</Text>
    </TouchableOpacity>
  ), [isTimeFilterVisible, isDiseaseFilterVisible, handleTimeFilterSelect, handleDiseaseFilterSelect]);
  
  // 渲染报警项
  const renderAlertItem = useCallback(({ item }: { item: AlertItem }) => (
    <View style={[styles.alertItem, getAlertLevelStyle(item.level)]}>
      <View style={styles.alertContent}>
        <View style={styles.alertHeader}>
          <FontAwesome6 
            name={getAlertIcon(item.level)} 
            style={[styles.alertIcon, getAlertLevelStyle(item.level)]} 
          />
          <Text style={styles.alertTitle}>{item.title}</Text>
          <View style={[styles.alertLevelBadge, getAlertLevelStyle(item.level)]}>
            <Text style={[styles.alertLevelText, getAlertLevelStyle(item.level)]}>
              {item.level === 'high' ? '高风险' : item.level === 'medium' ? '中风险' : '低风险'}
            </Text>
          </View>
        </View>
        <Text style={styles.alertDescription}>{item.description}</Text>
        <View style={styles.alertMeta}>
          <View style={styles.alertMetaItem}>
            <FontAwesome6 name="location-dot" style={styles.alertMetaIcon} />
            <Text style={styles.alertMetaText}>{item.location}</Text>
          </View>
          <View style={styles.alertMetaItem}>
            <FontAwesome6 name="clock" style={styles.alertMetaIcon} />
            <Text style={styles.alertMetaText}>{item.time}</Text>
          </View>
          <View style={styles.alertMetaItem}>
            <FontAwesome6 name="chart-line" style={styles.alertMetaIcon} />
            <Text style={styles.alertMetaText}>{item.count}例</Text>
          </View>
        </View>
      </View>
      <TouchableOpacity
        style={styles.alertDetailButton}
        onPress={() => handleAlertDetailPress(item.id)}
      >
        <FontAwesome6 name="chevron-right" style={styles.alertDetailIcon} />
      </TouchableOpacity>
    </View>
  ), [getAlertLevelStyle, getAlertIcon, handleAlertDetailPress]);
  
  return (
    <SafeAreaView style={styles.container}>
      {/* 顶部导航栏 */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity style={styles.backButton} onPress={handleGoBack}>
            <FontAwesome6 name="arrow-left" style={styles.backIcon} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>疫情热力图</Text>
        </View>
        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.notificationButton} onPress={handleNotificationPress}>
            <FontAwesome6 name="bell" style={styles.notificationIcon} />
            <View style={styles.notificationBadge} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.profileButton} onPress={handleProfilePress}>
            <FontAwesome6 name="circle-user" style={styles.profileIcon} />
          </TouchableOpacity>
        </View>
      </View>
      
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* 筛选工具栏 */}
        <View style={styles.filterToolbar}>
          <View style={styles.filterButtons}>
            <TouchableOpacity
              style={styles.filterButton}
              onPress={() => {
                setIsDiseaseFilterVisible(false);
                setIsTimeFilterVisible(!isTimeFilterVisible);
              }}
            >
              <Text style={styles.filterButtonText}>{selectedTimeFilter}</Text>
              <FontAwesome6 name="chevron-down" style={styles.filterButtonIcon} />
            </TouchableOpacity>
            
            <TouchableOpacity
              style={styles.filterButton}
              onPress={() => {
                setIsTimeFilterVisible(false);
                setIsDiseaseFilterVisible(!isDiseaseFilterVisible);
              }}
            >
              <Text style={styles.filterButtonText}>{selectedDiseaseFilter}</Text>
              <FontAwesome6 name="chevron-down" style={styles.filterButtonIcon} />
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.refreshButton} onPress={handleRefresh}>
              <FontAwesome6 name="arrows-rotate" style={styles.refreshIcon} />
            </TouchableOpacity>
          </View>
          
          {/* 时间筛选下拉菜单 */}
          {isTimeFilterVisible && (
            <View style={styles.filterDropdown}>
              <FlatList
                data={timeFilterOptions}
                renderItem={renderFilterOption}
                keyExtractor={(item) => item.value}
                scrollEnabled={false}
              />
            </View>
          )}
          
          {/* 疾病筛选下拉菜单 */}
          {isDiseaseFilterVisible && (
            <View style={styles.filterDropdown}>
              <FlatList
                data={diseaseFilterOptions}
                renderItem={renderFilterOption}
                keyExtractor={(item) => item.value}
                scrollEnabled={false}
              />
            </View>
          )}
        </View>
        
        {/* 主要内容区域 */}
        <View style={styles.mainContent}>
          {/* 疫情统计卡片 */}
          <View style={styles.statsSection}>
            <View style={styles.statsGrid}>
              <View style={styles.statCard}>
                <View style={styles.statContent}>
                  <View style={styles.statInfo}>
                    <Text style={styles.statLabel}>今日新增</Text>
                    <Text style={styles.statValue}>{totalCases}</Text>
                  </View>
                  <View style={styles.statIconContainer}>
                    <FontAwesome6 name="triangle-exclamation" style={styles.statIcon} />
                  </View>
                </View>
              </View>
              
              <View style={styles.statCard}>
                <View style={styles.statContent}>
                  <View style={styles.statInfo}>
                    <Text style={styles.statLabel}>高风险区域</Text>
                    <Text style={styles.statValueOrange}>{alertCount}</Text>
                  </View>
                  <View style={styles.statIconContainerOrange}>
                    <FontAwesome6 name="shield-halved" style={styles.statIconOrange} />
                  </View>
                </View>
              </View>
            </View>
          </View>
          
          {/* 疫情热力图 */}
          <View style={styles.heatmapSection}>
            <View style={styles.heatmapHeader}>
              <Text style={styles.heatmapTitle}>疫情分布热力图</Text>
              <View style={styles.mapControls}>
                <TouchableOpacity style={styles.mapControlButton} onPress={handleZoomOut}>
                  <FontAwesome6 name="minus" style={styles.mapControlIcon} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.mapControlButton} onPress={handleZoomIn}>
                  <FontAwesome6 name="plus" style={styles.mapControlIcon} />
                </TouchableOpacity>
              </View>
            </View>
            
            {/* 模拟地图容器 */}
            <View style={styles.mapContainer}>
              <LinearGradient
                colors={['#E3F2FD', '#BBDEFB']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.mapGradient}
              />
              
              {/* 地图网格覆盖层 */}
              <View style={styles.mapOverlay} />
              
              {/* 模拟省份边界 */}
              <Svg style={styles.provinceBoundary} pointerEvents="none">
                <Path
                  d="M50,20 Q80,10 110,25 Q130,40 140,60 Q135,80 120,100 Q100,115 80,110 Q60,105 50,90 Q40,75 50,20"
                  fill="none"
                  stroke="rgba(255,255,255,0.3)"
                  strokeWidth="2"
                />
                <Path
                  d="M150,30 Q180,20 210,35 Q230,50 240,70 Q235,90 220,110 Q200,125 180,120 Q160,115 150,100 Q140,85 150,30"
                  fill="none"
                  stroke="rgba(255,255,255,0.3)"
                  strokeWidth="2"
                />
              </Svg>
              
              {/* 疫情热点 */}
              {heatPoints.map((point) => (
                <TouchableOpacity
                  key={point.id}
                  style={getHeatPointStyle(point)}
                  onPress={() => handleHeatPointPress(point)}
                />
              ))}
              
              {/* 地图控制按钮 */}
              <View style={styles.mapControlContainer}>
                <TouchableOpacity style={styles.mapControlButtonLarge} onPress={handleLocation}>
                  <FontAwesome6 name="location-arrow" style={styles.mapControlIconLarge} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.mapControlButtonLarge} onPress={handleFullscreen}>
                  <FontAwesome6 name="expand" style={styles.mapControlIconLarge} />
                </TouchableOpacity>
              </View>
              
              {/* 图例 */}
              <View style={styles.mapLegend}>
                <Text style={styles.legendTitle}>疫情等级</Text>
                <View style={styles.legendItems}>
                  <View style={styles.legendItem}>
                    <View style={[styles.legendDot, styles.legendDotHigh]} />
                    <Text style={styles.legendText}>高风险 (5+)</Text>
                  </View>
                  <View style={styles.legendItem}>
                    <View style={[styles.legendDot, styles.legendDotMedium]} />
                    <Text style={styles.legendText}>中风险 (3-4)</Text>
                  </View>
                  <View style={styles.legendItem}>
                    <View style={[styles.legendDot, styles.legendDotLow]} />
                    <Text style={styles.legendText}>低风险 (1-2)</Text>
                  </View>
                </View>
              </View>
            </View>
          </View>
          
          {/* 最新报警信息 */}
          <View style={styles.alertSection}>
            <View style={styles.alertSectionHeader}>
              <Text style={styles.alertSectionTitle}>最新报警</Text>
              <TouchableOpacity onPress={handleViewAllAlerts}>
                <Text style={styles.viewAllButton}>查看全部</Text>
              </TouchableOpacity>
            </View>
            
            <FlatList
              data={alertItems}
              renderItem={renderAlertItem}
              keyExtractor={(item) => item.id}
              scrollEnabled={false}
              showsVerticalScrollIndicator={false}
            />
          </View>
        </View>
      </ScrollView>
      
      {/* 疫情详情弹窗 */}
      <Modal
        visible={isModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>疫情详情</Text>
              <TouchableOpacity
                style={styles.modalCloseButton}
                onPress={() => setIsModalVisible(false)}
              >
                <FontAwesome6 name="xmark" style={styles.modalCloseIcon} />
              </TouchableOpacity>
            </View>
            
            {modalData && (
              <View style={styles.modalContent}>
                <View style={styles.modalRow}>
                  <Text style={styles.modalLabel}>疾病类型</Text>
                  <Text style={styles.modalValue}>{modalData.disease}</Text>
                </View>
                <View style={styles.modalRow}>
                  <Text style={styles.modalLabel}>风险等级</Text>
                  <Text style={[
                    styles.modalValue,
                    modalData.level === '高风险' ? styles.modalValueHigh :
                    modalData.level === '中风险' ? styles.modalValueMedium :
                    styles.modalValueLow
                  ]}>
                    {modalData.level}
                  </Text>
                </View>
                <View style={styles.modalRow}>
                  <Text style={styles.modalLabel}>病例数量</Text>
                  <Text style={styles.modalValue}>{modalData.count}例</Text>
                </View>
                <View style={styles.modalRow}>
                  <Text style={styles.modalLabel}>建议措施</Text>
                  <Text style={styles.modalValue}>立即隔离、消毒、报告</Text>
                </View>
              </View>
            )}
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default EpidemicHeatmapScreen;

