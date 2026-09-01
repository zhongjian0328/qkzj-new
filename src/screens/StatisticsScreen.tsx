import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Header from '../components/Header';
import { CustomLineChart, CustomBarChart, CustomPieChart, DataCard } from '../components/Charts';
import { statisticsApi } from '../services/api';
import { styles } from '../styles';

const StatisticsScreen: React.FC = () => {
  const navigation = useNavigation<any>();

  // 状态管理
  const [activeTab, setActiveTab] = useState<'production' | 'diagnosis' | 'epidemic'>('production');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dashboardData, setDashboardData] = useState<any>(null);

  // 加载看板数据
  const loadDashboard = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await statisticsApi.getDashboard();
      setDashboardData(data);
    } catch (err: any) {
      console.error('加载统计数据失败:', err);
      setError(err.message || '加载统计数据失败，请检查网络连接');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);

  // 渲染生产数据统计
  const renderProductionStatistics = () => {
    const production = dashboardData?.production;
    if (!production) {
      return (
        <View style={local.noDataContainer}>
          <Text style={local.noDataText}>暂无生产数据</Text>
        </View>
      );
    }

    const trendData = production.monthlyProductionTrend || [];

    return (
      <ScrollView contentContainerStyle={styles.statisticsScrollContent}>
        {/* 生产数据卡片 */}
        <View style={styles.dataCardsContainer}>
          <DataCard
            title="总批次"
            value={production.totalBatches ?? 0}
            unit="个"
            icon="📋"
          />
          <DataCard
            title="总存栏"
            value={production.totalBirds ?? 0}
            unit="羽"
            icon="🐔"
          />
          <DataCard
            title="死淘率"
            value={production.mortalityRate ?? 0}
            unit="%"
            icon="📉"
          />
          <DataCard
            title="料肉比"
            value={production.feedConversionRate ?? 0}
            icon="⚖️"
          />
        </View>

        {/* 生产趋势图 */}
        {trendData.length > 0 ? (
          <CustomLineChart
            title="月度生产趋势"
            data={{
              labels: trendData.map((item: any) => item.month),
              datasets: [
                {
                  data: trendData.map((item: any) => item.birds),
                  color: (opacity = 1) => `rgba(45, 187, 161, ${opacity})`,
                  strokeWidth: 2
                }
              ],
              legend: ['存栏数量']
            }}
            yAxisSuffix="羽"
          />
        ) : (
          <View style={local.noDataContainer}>
            <Text style={local.noDataText}>暂无趋势数据</Text>
          </View>
        )}

        {/* 饲料消耗图 */}
        {trendData.length > 0 ? (
          <CustomBarChart
            title="月度饲料消耗"
            data={{
              labels: trendData.map((item: any) => item.month),
              datasets: [
                {
                  data: trendData.map((item: any) => item.feedConsumption),
                  color: (opacity = 1) => `rgba(45, 187, 161, ${opacity})`
                }
              ]
            }}
            yAxisSuffix="kg"
          />
        ) : (
          <View style={local.noDataContainer}>
            <Text style={local.noDataText}>暂无饲料消耗数据</Text>
          </View>
        )}
      </ScrollView>
    );
  };

  // 渲染诊断数据统计
  const renderDiagnosisStatistics = () => {
    const diagnosis = dashboardData?.diagnosis;
    if (!diagnosis) {
      return (
        <View style={local.noDataContainer}>
          <Text style={local.noDataText}>暂无诊断数据</Text>
        </View>
      );
    }

    const diseaseDist = diagnosis.diseaseDistribution || [];
    const trendData = diagnosis.monthlyDiagnosisTrend || [];

    // 转换饼图数据
    const pieData = diseaseDist.map((item: any) => ({
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
            value={diagnosis.totalDiagnoses ?? 0}
            unit="次"
            icon="🏥"
          />
          <DataCard
            title="诊断准确率"
            value={diagnosis.correctRate ?? 0}
            unit="%"
            icon="✅"
          />
        </View>

        {/* 疾病分布饼图 */}
        {diseaseDist.length > 0 ? (
          <CustomPieChart
            title="疾病分布"
            data={pieData}
          />
        ) : (
          <View style={local.noDataContainer}>
            <Text style={local.noDataText}>暂无疾病分布数据</Text>
          </View>
        )}

        {/* 诊断趋势图 */}
        {trendData.length > 0 ? (
          <CustomLineChart
            title="月度诊断趋势"
            data={{
              labels: trendData.map((item: any) => item.month),
              datasets: [
                {
                  data: trendData.map((item: any) => item.count),
                  color: (opacity = 1) => `rgba(45, 187, 161, ${opacity})`,
                  strokeWidth: 2
                }
              ],
              legend: ['诊断次数']
            }}
            yAxisSuffix="次"
          />
        ) : (
          <View style={local.noDataContainer}>
            <Text style={local.noDataText}>暂无诊断趋势数据</Text>
          </View>
        )}
      </ScrollView>
    );
  };

  // 渲染疫情数据统计
  const renderEpidemicStatistics = () => {
    const epidemic = dashboardData?.epidemic;
    if (!epidemic) {
      return (
        <View style={local.noDataContainer}>
          <Text style={local.noDataText}>暂无疫情数据</Text>
        </View>
      );
    }

    const trendData = epidemic.monthlyEpidemicTrend || [];

    return (
      <ScrollView contentContainerStyle={styles.statisticsScrollContent}>
        {/* 疫情数据卡片 */}
        <View style={styles.dataCardsContainer}>
          <DataCard
            title="累计病例"
            value={epidemic.totalCases ?? 0}
            unit="例"
            icon="⚠️"
          />
          <DataCard
            title="高风险区域"
            value={epidemic.highRiskRegions ?? 0}
            unit="个"
            icon="🔴"
          />
          <DataCard
            title="中风险区域"
            value={epidemic.mediumRiskRegions ?? 0}
            unit="个"
            icon="🟡"
          />
          <DataCard
            title="今日新增"
            value={epidemic.newCasesToday ?? 0}
            unit="例"
            icon="📈"
          />
        </View>

        {/* 疫情趋势图 */}
        {trendData.length > 0 ? (
          <CustomLineChart
            title="月度疫情趋势"
            data={{
              labels: trendData.map((item: any) => item.month),
              datasets: [
                {
                  data: trendData.map((item: any) => item.cases),
                  color: (opacity = 1) => `rgba(239, 68, 68, ${opacity})`,
                  strokeWidth: 2
                }
              ],
              legend: ['病例数量']
            }}
            yAxisSuffix="例"
          />
        ) : (
          <View style={local.noDataContainer}>
            <Text style={local.noDataText}>暂无疫情趋势数据</Text>
          </View>
        )}

        {/* 区域热力图入口 */}
        <TouchableOpacity
          style={local.heatmapButton}
          onPress={() => navigation.navigate('EpidemicHeatmap')}
        >
          <Text style={local.heatmapButtonText}>查看区域热力图</Text>
        </TouchableOpacity>
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

  // 加载中
  if (loading) {
    return (
      <View style={[local.loadingContainer, { backgroundColor: '#F8FFF7' }]}>
        <ActivityIndicator size="large" color="#2DBBA1" />
        <Text style={local.loadingText}>加载统计数据中...</Text>
      </View>
    );
  }

  // 错误状态
  if (error) {
    return (
      <View style={[local.errorContainer, { backgroundColor: '#F8FFF7' }]}>
        <Text style={local.errorText}>加载失败: {error}</Text>
        <TouchableOpacity style={local.retryButton} onPress={loadDashboard}>
          <Text style={local.retryButtonText}>重新加载</Text>
        </TouchableOpacity>
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

// 统计相关样式
const local = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#6B7280',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  errorText: {
    fontSize: 16,
    color: '#EF4444',
    textAlign: 'center',
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: '#2DBBA1',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  noDataContainer: {
    padding: 24,
    alignItems: 'center',
  },
  noDataText: {
    fontSize: 14,
    color: '#9CA3AF',
  },
  heatmapButton: {
    marginTop: 16,
    backgroundColor: '#1F5E52',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  heatmapButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

// 保留导出以兼容外部引用
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
