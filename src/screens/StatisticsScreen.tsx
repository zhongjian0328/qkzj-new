import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Header from '../components/Header';
import { CustomLineChart, CustomBarChart, CustomPieChart, DataCard } from '../components/Charts';
import { 
  getProductionStatistics, 
  getDiagnosisStatistics, 
  getEpidemicStatistics,
  ProductionStatistics,
  DiagnosisStatistics,
  EpidemicStatistics
} from '../services/statisticsService';
import { styles } from '../styles';

const StatisticsScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  
  // 状态管理
  const [activeTab, setActiveTab] = useState<'production' | 'diagnosis' | 'epidemic'>('production');
  const [loading, setLoading] = useState(true);
  const [productionData, setProductionData] = useState<ProductionStatistics | null>(null);
  const [diagnosisData, setDiagnosisData] = useState<DiagnosisStatistics | null>(null);
  const [epidemicData, setEpidemicData] = useState<EpidemicStatistics | null>(null);

  // 加载数据
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        // 并行加载所有数据
        const [production, diagnosis, epidemic] = await Promise.all([
          getProductionStatistics(),
          getDiagnosisStatistics(),
          getEpidemicStatistics()
        ]);
        
        setProductionData(production);
        setDiagnosisData(diagnosis);
        setEpidemicData(epidemic);
      } catch (error) {
        console.error('加载统计数据失败:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, []);

  // 渲染生产数据统计
  const renderProductionStatistics = () => {
    if (!productionData) return null;
    
    return (
      <ScrollView contentContainerStyle={styles.statisticsScrollContent}>
        {/* 生产数据卡片 */}
        <View style={styles.dataCardsContainer}>
          <DataCard 
            title="总批次" 
            value={productionData.totalBatches} 
            unit="个"
            icon="📋"
          />
          <DataCard 
            title="总存栏" 
            value={productionData.totalBirds} 
            unit="羽"
            icon="🐔"
          />
          <DataCard 
            title="死淘率" 
            value={productionData.mortalityRate} 
            unit="%"
            icon="📉"
          />
          <DataCard 
            title="料肉比" 
            value={productionData.feedConversionRate} 
            icon="⚖️"
          />
        </View>
        
        {/* 生产趋势图 */}
        <CustomLineChart
          title="月度生产趋势"
          data={{
            labels: productionData.monthlyProductionTrend.map(item => item.month),
            datasets: [
              {
                data: productionData.monthlyProductionTrend.map(item => item.birds),
                color: (opacity = 1) => `rgba(45, 187, 161, ${opacity})`,
                strokeWidth: 2
              }
            ],
            legend: ['存栏数量']
          }}
          yAxisSuffix="羽"
        />
        
        {/* 饲料消耗图 */}
        <CustomBarChart
          title="月度饲料消耗"
          data={{
            labels: productionData.monthlyProductionTrend.map(item => item.month),
            datasets: [
              {
                data: productionData.monthlyProductionTrend.map(item => item.feedConsumption),
                color: (opacity = 1) => `rgba(45, 187, 161, ${opacity})`
              }
            ]
          }}
          yAxisSuffix="kg"
        />
      </ScrollView>
    );
  };

  // 渲染诊断数据统计
  const renderDiagnosisStatistics = () => {
    if (!diagnosisData) return null;
    
    // 转换饼图数据
    const pieData = diagnosisData.diseaseDistribution.map(item => ({
      name: item.disease,
      population: item.count,
      color: '#2DBBA1',
      legendFontColor: '#6B7280',
      legendFontSize: 12
    }));
    
    return (
      <ScrollView contentContainerStyle={styles.statisticsScrollContent}>
        {/* 诊断数据卡片 */}
        <View style={styles.dataCardsContainer}>
          <DataCard 
            title="总诊断次数" 
            value={diagnosisData.totalDiagnoses} 
            unit="次"
            icon="🏥"
          />
          <DataCard 
            title="诊断准确率" 
            value={diagnosisData.correctRate} 
            unit="%"
            icon="✅"
          />
        </View>
        
        {/* 疾病分布饼图 */}
        <CustomPieChart
          title="疾病分布"
          data={pieData}
        />
        
        {/* 诊断趋势图 */}
        <CustomLineChart
          title="月度诊断趋势"
          data={{
            labels: diagnosisData.monthlyDiagnosisTrend.map(item => item.month),
            datasets: [
              {
                data: diagnosisData.monthlyDiagnosisTrend.map(item => item.count),
                color: (opacity = 1) => `rgba(45, 187, 161, ${opacity})`,
                strokeWidth: 2
              }
            ],
            legend: ['诊断次数']
          }}
          yAxisSuffix="次"
        />
      </ScrollView>
    );
  };

  // 渲染疫情数据统计
  const renderEpidemicStatistics = () => {
    if (!epidemicData) return null;
    
    return (
      <ScrollView contentContainerStyle={styles.statisticsScrollContent}>
        {/* 疫情数据卡片 */}
        <View style={styles.dataCardsContainer}>
          <DataCard 
            title="累计病例" 
            value={epidemicData.totalCases} 
            unit="例"
            icon="⚠️"
          />
          <DataCard 
            title="高风险区域" 
            value={epidemicData.highRiskRegions} 
            unit="个"
            icon="🔴"
          />
          <DataCard 
            title="中风险区域" 
            value={epidemicData.mediumRiskRegions} 
            unit="个"
            icon="🟡"
          />
          <DataCard 
            title="今日新增" 
            value={epidemicData.newCasesToday} 
            unit="例"
            icon="📈"
          />
        </View>
        
        {/* 疫情趋势图 */}
        <CustomLineChart
          title="月度疫情趋势"
          data={{
            labels: epidemicData.monthlyEpidemicTrend.map(item => item.month),
            datasets: [
              {
                data: epidemicData.monthlyEpidemicTrend.map(item => item.cases),
                color: (opacity = 1) => `rgba(239, 68, 68, ${opacity})`,
                strokeWidth: 2
              }
            ],
            legend: ['病例数量']
          }}
          yAxisSuffix="例"
        />
      </ScrollView>
    );
  };

  // 渲染选项卡
  const renderTabs = () => {
    const tabs = [
      { id: 'production', label: '生产数据' },
      { id: 'diagnosis', label: '诊断数据' },
      { id: 'epidemic', label: '疫情数据' }
    ] as const;
    
    return (
      <View style={styles.tabContainer}>
        {tabs.map(tab => (
          <TouchableOpacity
            key={tab.id}
            style={[
              { flex: 1, paddingVertical: 12, alignItems: 'center', borderRadius: 8, marginHorizontal: 4 },
              activeTab === tab.id && { backgroundColor: '#E6F7F3' }
            ]}
            onPress={() => setActiveTab(tab.id)}
          >
            <Text 
              style={[
                { fontSize: 16, color: '#6B7280', fontWeight: '500' },
                activeTab === tab.id && { color: '#1F5E52' }
              ]}
            >
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  if (loading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: '#F8FFF7' }]}>
        <ActivityIndicator size="large" color="#2DBBA1" />
        <Text style={styles.loadingText}>加载统计数据中...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header 
        title="数据统计" 
        showBackButton={false} 
      />
      
      {renderTabs()}
      
      {/* 内容区域 */}
      <View style={{ flex: 1 }}>
        {activeTab === 'production' && renderProductionStatistics()}
        {activeTab === 'diagnosis' && renderDiagnosisStatistics()}
        {activeTab === 'epidemic' && renderEpidemicStatistics()}
      </View>
    </View>
  );
};

// 添加统计相关样式
export const statisticsStyles = StyleSheet.create({
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  tabItem: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 8,
    marginHorizontal: 4,
  },
  tabItemActive: {
    backgroundColor: '#E6F7F3',
  },
  tabText: {
    fontSize: 16,
    color: '#6B7280',
    fontWeight: '500',
  },
  tabTextActive: {
    color: '#1F5E52',
  },
  contentContainer: {
    flex: 1,
  },
  statisticsScrollContent: {
    padding: 16,
    paddingBottom: 100,
  },
  dataCardsContainer: {
    marginBottom: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8FFF7',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#6B7280',
  },
});

export default StatisticsScreen;
