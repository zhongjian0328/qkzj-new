import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Dimensions, ActivityIndicator, RefreshControl } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import Header from '../components/Header';
import { styles } from '../styles';
import { epidemicApi } from '../services/api';

const EpidemicHeatmapScreen: React.FC = () => {
  const navigation = useNavigation<any>();

  const [selectedDate, setSelectedDate] = useState('2024-06-01');
  const [diseaseType, setDiseaseType] = useState('all');
  const [region, setRegion] = useState('all');
  const [epidemicData, setEpidemicData] = useState<any[]>([]);
  const [alerts, setAlerts] = useState<any[]>([]);
  const [alertsPagination, setAlertsPagination] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchHeatmap = useCallback(async (isRefresh = false) => {
    try {
      if (isRefresh) setRefreshing(true); else setLoading(true);
      setError(null);
      const params: any = {};
      if (selectedDate) params.date = selectedDate;
      if (diseaseType !== 'all') params.diseaseType = diseaseType;
      if (region !== 'all') params.region = region;

      // 并行获取热力图和报警数据
      const [heatmapResp, alertsResp] = await Promise.all([
        epidemicApi.getEpidemicHeatmap(params),
        epidemicApi.getAbnormalAlerts({ page: 1, limit: 10 }),
      ]);

      setEpidemicData(heatmapResp.data?.heatmap || heatmapResp.data || []);
      setAlerts(alertsResp.data?.alerts || []);
      setAlertsPagination(alertsResp.data?.pagination || null);
    } catch (err) {
      setError('获取疫情数据失败');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [selectedDate, diseaseType, region]);

  useEffect(() => { fetchHeatmap(); }, [fetchHeatmap]);

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
      
      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 100 }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => fetchHeatmap(true)} colors={['#2DBBA1']} />}
      >
        {loading && epidemicData.length === 0 && (
          <View style={{ paddingVertical: 40, alignItems: 'center' }}>
            <ActivityIndicator size="large" color="#2DBBA1" />
            <Text style={{ marginTop: 8, color: '#6B7280' }}>加载疫情数据...</Text>
          </View>
        )}
        {error && (
          <View style={{ padding: 16, backgroundColor: '#FEF2F2', borderRadius: 8, marginBottom: 12 }}>
            <Text style={{ color: '#DC2626', textAlign: 'center' }}>{error}</Text>
          </View>
        )}
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
              <Ionicons name="calendar-outline" size={18} color="#6B7280" />
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
            <Ionicons name="map-outline" size={48} color="#9CA3AF" />
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
            <Ionicons name="stats-chart" size={16} color="#2DBBA1" style={{ marginRight: 4 }} />
            疫情数据统计
          </Text>

          <View style={styles.epidemicStats}>
            <View style={styles.epidemicStatItem}>
              <Text style={styles.epidemicStatValue}>{epidemicData.reduce((s, h) => s + (h.count || 0), 0)}</Text>
              <Text style={styles.epidemicStatLabel}>累计诊断</Text>
            </View>
            <View style={styles.epidemicStatItem}>
              <Text style={styles.epidemicStatValue}>{epidemicData.filter(h => h.riskLevel === 'HIGH' || h.riskLevel === 'MEDIUM').reduce((s, h) => s + (h.count || 0), 0)}</Text>
              <Text style={styles.epidemicStatLabel}>风险病例</Text>
            </View>
            <View style={styles.epidemicStatItem}>
              <Text style={styles.epidemicStatValue}>{epidemicData.filter(h => h.riskLevel === 'HIGH' || h.highRiskCount > 0).length}</Text>
              <Text style={styles.epidemicStatLabel}>高风险区域</Text>
            </View>
            <View style={styles.epidemicStatItem}>
              <Text style={styles.epidemicStatValue}>{epidemicData.filter(h => h.riskLevel === 'MEDIUM').length}</Text>
              <Text style={styles.epidemicStatLabel}>中风险区域</Text>
            </View>
          </View>
        </View>
        
        {/* 疫情详情列表 */}
        <View style={styles.epidemicDetailSection}>
          <Text style={styles.sectionTitle}>
            <Ionicons name="location" size={16} color="#2DBBA1" style={{ marginRight: 4 }} />
            地区疫情详情
          </Text>

          {epidemicData.length === 0 && !loading && (
            <View style={{ paddingVertical: 24, alignItems: 'center' }}>
              <Ionicons name="checkmark-circle-outline" size={40} color="#10B981" />
              <Text style={{ marginTop: 8, fontSize: 14, color: '#6B7280' }}>暂无疫情数据</Text>
              <Text style={{ fontSize: 12, color: '#9CA3AF', marginTop: 4 }}>当前筛选条件下无诊断记录</Text>
            </View>
          )}

          <View style={styles.epidemicDetailList}>
            {epidemicData.map((item, index) => {
              const riskLevel = (item.riskLevel || 'LOW').toLowerCase();
              const riskLabel = riskLevel === 'high' ? '高风险' : riskLevel === 'medium' ? '中风险' : '低风险';
              return (
                <View key={index} style={styles.epidemicDetailItem}>
                  <View style={styles.epidemicDetailHeader}>
                    <Text style={styles.epidemicDetailLocation}>
                      区域 {index + 1}
                      {item.coordinates && item.coordinates.length === 2
                        ? ` (${item.coordinates[1]?.toFixed?.(1) || '?'}°, ${item.coordinates[0]?.toFixed?.(1) || '?'}°)`
                        : ''}
                    </Text>
                    <View style={[
                      styles.epidemicDetailRiskLevel,
                      { backgroundColor: getRiskColor(riskLevel) + '20', borderColor: getRiskColor(riskLevel) }
                    ]}>
                      <Text style={[
                        styles.epidemicDetailRiskText,
                        { color: getRiskColor(riskLevel) }
                      ]}>
                        {riskLabel}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.epidemicDetailInfo}>
                    <Text style={styles.epidemicDetailDisease}>
                      {item.diseases && item.diseases.length > 0
                        ? item.diseases.filter(Boolean).join('、')
                        : '未分类'}
                    </Text>
                    <Text style={styles.epidemicDetailCases}>{item.count || 0}例</Text>
                  </View>

                  {item.highRiskCount > 0 && (
                    <Text style={{ fontSize: 12, color: '#EF4444', marginTop: 4 }}>
                      含 {item.highRiskCount} 例高风险混合感染
                    </Text>
                  )}
                </View>
              );
            })}
          </View>
        </View>
        
        {/* 异常高发报警 */}
        <View style={styles.epidemicAlertsSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>
              <Ionicons name="alert-circle-outline" size={16} color="#EF4444" style={{ marginRight: 4 }} />
              异常高发报警
            </Text>
            {alertsPagination && alertsPagination.total > 0 && (
              <Text style={styles.sectionMoreText}>共 {alertsPagination.total} 条</Text>
            )}
          </View>

          {alerts.length === 0 && !loading && (
            <View style={{ paddingVertical: 20, alignItems: 'center' }}>
              <Ionicons name="shield-checkmark-outline" size={36} color="#10B981" />
              <Text style={{ marginTop: 8, fontSize: 14, color: '#6B7280' }}>暂无异常报警</Text>
              <Text style={{ fontSize: 12, color: '#9CA3AF', marginTop: 4 }}>当前无高风险诊断记录</Text>
            </View>
          )}

          {alerts.map((alert, index) => {
            const riskInfo = alert.mixedInfectionRisk || {};
            const riskLevel = (riskInfo.riskLevel || 'LOW').toLowerCase();
            const pathogenName = alert.singleDiagnosis?.pathogenName || '未知疾病';
            const basicInfo = alert.basicInfo || {};
            const userName = alert.userId?.nickname || '未知用户';
            const time = alert.diagnosisTime ? new Date(alert.diagnosisTime).toLocaleString('zh-CN') : '';
            return (
              <View key={index} style={styles.epidemicAlertItem}>
                <View style={styles.epidemicAlertContent}>
                  <View style={styles.epidemicAlertIconContainer}>
                    <Ionicons name="alert-circle-outline" size={20} color={getRiskColor(riskLevel)} />
                  </View>
                  <View style={styles.epidemicAlertInfo}>
                    <Text style={styles.epidemicAlertTitle}>
                      {pathogenName} - {basicInfo.breed || '未知品种'} ({userName})
                    </Text>
                    <Text style={styles.epidemicAlertTime}>{time}</Text>
                    <Text style={styles.epidemicAlertDescription}>
                      混合感染风险: {riskLevel === 'high' ? '极高' : riskLevel === 'extreme' ? '极端' : '高'}，
                      置信度: {alert.singleDiagnosis?.confidence || '--'}%
                    </Text>
                  </View>
                </View>
                <TouchableOpacity style={styles.epidemicAlertAction} onPress={() => navigation.navigate('DiagnosisHistory')}>
                  <Text style={styles.epidemicAlertActionText}>查看</Text>
                </TouchableOpacity>
              </View>
            );
          })}
        </View>
      </ScrollView>
    </View>
  );
};

export default EpidemicHeatmapScreen;
