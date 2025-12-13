import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Header from '../components/Header';
import { styles } from '../styles';

const EpidemicHeatmapScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  
  // 模拟疫情热力图数据
  const [selectedDate, setSelectedDate] = useState('2024-06-01');
  const [diseaseType, setDiseaseType] = useState('all');
  const [region, setRegion] = useState('all');
  
  const diseaseTypes = [
    { id: 'all', name: '全部疾病' },
    { id: 'aiv', name: '禽流感' },
    { id: 'ndv', name: '新城疫' },
    { id: 'ibv', name: '传染性支气管炎' },
    { id: 'ibdv', name: '传染性法氏囊病' },
    { id: 'colibacillosis', name: '大肠杆菌病' }
  ];
  
  const regions = [
    { id: 'all', name: '全国' },
    { id: 'beijing', name: '北京' },
    { id: 'shanghai', name: '上海' },
    { id: 'guangdong', name: '广东' },
    { id: 'jiangsu', name: '江苏' },
    { id: 'zhejiang', name: '浙江' },
    { id: 'shandong', name: '山东' }
  ];
  
  // 模拟疫情数据
  const epidemicData = [
    {
      id: '1',
      location: '北京市昌平区',
      disease: '禽流感',
      cases: 125,
      riskLevel: 'high',
      date: '2024-06-01'
    },
    {
      id: '2',
      location: '上海市浦东新区',
      disease: '新城疫',
      cases: 87,
      riskLevel: 'medium',
      date: '2024-06-01'
    },
    {
      id: '3',
      location: '广东省广州市',
      disease: '大肠杆菌病',
      cases: 45,
      riskLevel: 'low',
      date: '2024-06-01'
    },
    {
      id: '4',
      location: '江苏省南京市',
      disease: '禽流感',
      cases: 63,
      riskLevel: 'medium',
      date: '2024-06-01'
    },
    {
      id: '5',
      location: '浙江省杭州市',
      disease: '传染性支气管炎',
      cases: 28,
      riskLevel: 'low',
      date: '2024-06-01'
    },
    {
      id: '6',
      location: '山东省济南市',
      disease: '新城疫',
      cases: 92,
      riskLevel: 'high',
      date: '2024-06-01'
    },
    {
      id: '7',
      location: '山东省青岛市',
      disease: '禽流感',
      cases: 51,
      riskLevel: 'medium',
      date: '2024-06-01'
    },
    {
      id: '8',
      location: '江苏省苏州市',
      disease: '大肠杆菌病',
      cases: 33,
      riskLevel: 'low',
      date: '2024-06-01'
    }
  ];
  
  const getRiskColor = (riskLevel: string) => {
    switch (riskLevel) {
      case 'high':
        return '#EF4444';
      case 'medium':
        return '#F59E0B';
      case 'low':
        return '#10B981';
      default:
        return '#6B7280';
    }
  };
  
  return (
    <View style={styles.container}>
      <Header 
        title="疫情热力图" 
        showBackButton 
        onBack={() => navigation.goBack()} 
      />
      
      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 100 }}>
        {/* 筛选条件 */}
        <View style={styles.epidemicHeatmapFilters}>
          {/* 日期选择 */}
          <View style={styles.filterItem}>
            <Text style={styles.filterLabel}>日期</Text>
            <TouchableOpacity 
              style={styles.filterValue} 
              onPress={() => {}}
            >
              <Text style={styles.filterValueText}>{selectedDate}</Text>
              <Text style={styles.filterValueIcon}>📅</Text>
            </TouchableOpacity>
          </View>
          
          {/* 疾病类型选择 */}
          <View style={styles.filterItem}>
            <Text style={styles.filterLabel}>疾病类型</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterOptions}>
              {diseaseTypes.map(item => (
                <TouchableOpacity 
                  key={item.id} 
                  style={[
                    styles.filterOption,
                    diseaseType === item.id && styles.filterOptionActive
                  ]}
                  onPress={() => setDiseaseType(item.id)}
                >
                  <Text 
                    style={[
                      styles.filterOptionText,
                      diseaseType === item.id && styles.filterOptionTextActive
                    ]}
                  >
                    {item.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
          
          {/* 地区选择 */}
          <View style={styles.filterItem}>
            <Text style={styles.filterLabel}>地区</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterOptions}>
              {regions.map(item => (
                <TouchableOpacity 
                  key={item.id} 
                  style={[
                    styles.filterOption,
                    region === item.id && styles.filterOptionActive
                  ]}
                  onPress={() => setRegion(item.id)}
                >
                  <Text 
                    style={[
                      styles.filterOptionText,
                      region === item.id && styles.filterOptionTextActive
                    ]}
                  >
                    {item.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
        
        {/* 热力图展示区域 */}
        <View style={styles.heatmapContainer}>
          <View style={styles.heatmapPlaceholder}>
            <Text style={styles.heatmapPlaceholderIcon}>🗺️</Text>
            <Text style={styles.heatmapPlaceholderText}>疫情热力图</Text>
            <Text style={styles.heatmapPlaceholderSubtext}>点击查看详细疫情分布</Text>
          </View>
          
          {/* 图例 */}
          <View style={styles.heatmapLegend}>
            <Text style={styles.heatmapLegendTitle}>疫情风险等级</Text>
            <View style={styles.heatmapLegendItems}>
              <View style={styles.heatmapLegendItem}>
                <View style={[styles.heatmapLegendColor, { backgroundColor: '#EF4444' }]}></View>
                <Text style={styles.heatmapLegendText}>高风险</Text>
              </View>
              <View style={styles.heatmapLegendItem}>
                <View style={[styles.heatmapLegendColor, { backgroundColor: '#F59E0B' }]}></View>
                <Text style={styles.heatmapLegendText}>中风险</Text>
              </View>
              <View style={styles.heatmapLegendItem}>
                <View style={[styles.heatmapLegendColor, { backgroundColor: '#10B981' }]}></View>
                <Text style={styles.heatmapLegendText}>低风险</Text>
              </View>
            </View>
          </View>
        </View>
        
        {/* 疫情数据列表 */}
        <View style={styles.epidemicDataSection}>
          <Text style={styles.sectionTitle}>
            <Text style={styles.sectionIcon}>📊</Text>
            疫情数据统计
          </Text>
          
          <View style={styles.epidemicStats}>
            <View style={styles.epidemicStatItem}>
              <Text style={styles.epidemicStatValue}>246</Text>
              <Text style={styles.epidemicStatLabel}>累计病例</Text>
            </View>
            <View style={styles.epidemicStatItem}>
              <Text style={styles.epidemicStatValue}>32</Text>
              <Text style={styles.epidemicStatLabel}>新增病例</Text>
            </View>
            <View style={styles.epidemicStatItem}>
              <Text style={styles.epidemicStatValue}>8</Text>
              <Text style={styles.epidemicStatLabel}>高风险区域</Text>
            </View>
            <View style={styles.epidemicStatItem}>
              <Text style={styles.epidemicStatValue}>15</Text>
              <Text style={styles.epidemicStatLabel}>中风险区域</Text>
            </View>
          </View>
        </View>
        
        {/* 疫情详情列表 */}
        <View style={styles.epidemicDetailSection}>
          <Text style={styles.sectionTitle}>
            <Text style={styles.sectionIcon}>📍</Text>
            地区疫情详情
          </Text>
          
          <View style={styles.epidemicDetailList}>
            {epidemicData.map((item, index) => (
              <View key={index} style={styles.epidemicDetailItem}>
                <View style={styles.epidemicDetailHeader}>
                  <Text style={styles.epidemicDetailLocation}>{item.location}</Text>
                  <View style={[
                    styles.epidemicDetailRiskLevel,
                    { backgroundColor: getRiskColor(item.riskLevel) + '20', borderColor: getRiskColor(item.riskLevel) }
                  ]}>
                    <Text style={[
                      styles.epidemicDetailRiskText,
                      { color: getRiskColor(item.riskLevel) }
                    ]}>
                      {item.riskLevel === 'high' ? '高风险' : 
                       item.riskLevel === 'medium' ? '中风险' : '低风险'}
                    </Text>
                  </View>
                </View>
                
                <View style={styles.epidemicDetailInfo}>
                  <Text style={styles.epidemicDetailDisease}>{item.disease}</Text>
                  <Text style={styles.epidemicDetailCases}>{item.cases}例</Text>
                </View>
                
                <View style={styles.epidemicDetailActions}>
                  <TouchableOpacity 
                    style={styles.epidemicDetailActionButton}
                    onPress={() => {}}
                  >
                    <Text style={styles.epidemicDetailActionText}>查看详情</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        </View>
        
        {/* 异常高发报警 */}
        <View style={styles.epidemicAlertsSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>
              <Text style={styles.sectionIcon}>🚨</Text>
              异常高发报警
            </Text>
            <TouchableOpacity onPress={() => {}}>
              <Text style={styles.sectionMoreText}>查看全部</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.epidemicAlertItem}>
            <View style={styles.epidemicAlertContent}>
              <View style={styles.epidemicAlertIconContainer}>
                <Text style={styles.epidemicAlertIcon}>⚠️</Text>
              </View>
              <View style={styles.epidemicAlertInfo}>
                <Text style={styles.epidemicAlertTitle}>北京市昌平区禽流感病例异常增多</Text>
                <Text style={styles.epidemicAlertTime}>2024-06-01 14:30</Text>
                <Text style={styles.epidemicAlertDescription}>近3天内，北京市昌平区禽流感病例从25例上升至125例，需加强防控措施。</Text>
              </View>
            </View>
            <TouchableOpacity style={styles.epidemicAlertAction} onPress={() => {}}>
              <Text style={styles.epidemicAlertActionText}>处理</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.epidemicAlertItem}>
            <View style={styles.epidemicAlertContent}>
              <View style={styles.epidemicAlertIconContainer}>
                <Text style={styles.epidemicAlertIcon}>⚠️</Text>
              </View>
              <View style={styles.epidemicAlertInfo}>
                <Text style={styles.epidemicAlertTitle}>山东省济南市新城疫疫情扩散</Text>
                <Text style={styles.epidemicAlertTime}>2024-06-01 09:15</Text>
                <Text style={styles.epidemicAlertDescription}>山东省济南市新城疫疫情已扩散至周边3个区县，建议启动应急响应。</Text>
              </View>
            </View>
            <TouchableOpacity style={styles.epidemicAlertAction} onPress={() => {}}>
              <Text style={styles.epidemicAlertActionText}>处理</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default EpidemicHeatmapScreen;
