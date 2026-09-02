import React, { useState, useCallback } from 'react';
import { View, Text, TouchableOpacity, ScrollView, RefreshControl, Dimensions } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/UserContext';
import Header from '../components/Header';
import { styles } from '../styles';
import { productionApi } from '../services/api';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const GRID_GAP = 12;
const GRID_ITEM_WIDTH = (SCREEN_WIDTH - 32 - GRID_GAP) / 2;

const ProductionManagementScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const { state } = useAuth();
  const { user } = state;
  const [refreshing, setRefreshing] = useState(false);
  const [batchCount, setBatchCount] = useState(0);
  const [totalLivestock, setTotalLivestock] = useState(0);

  const fetchSummary = useCallback(async () => {
    try {
      const res = await productionApi.getBatches({ page: 1, limit: 100 });
      const batches = res?.data?.batches || res?.data || [];
      setBatchCount(batches.length);
      const total = batches.reduce((sum: number, b: any) => sum + (b.initialQuantity || b.quantity || 0), 0);
      setTotalLivestock(total);
    } catch (e) { /* ignore */ }
  }, []);

  useFocusEffect(useCallback(() => {
    fetchSummary();
  }, [fetchSummary]));

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchSummary();
    setRefreshing(false);
  };

  const metrics = [
    { label: '当前存栏', value: totalLivestock.toLocaleString(), unit: '只', icon: 'layers-outline', color: '#10B981', sub: `共${batchCount}个批次` },
    { label: '今日死淘', value: '8', unit: '只', icon: 'trending-down-outline', color: '#EF4444', sub: '较昨日减少2只' },
    { label: '疫苗倒计时', value: '2', unit: '天', icon: 'syringe-outline', color: '#3B82F6', sub: '新城疫疫苗' },
    { label: '料肉比', value: '1.82', unit: ':1', icon: 'analytics-outline', color: '#8B5CF6', sub: '目标: 1.80' },
  ];

  const quickActions = [
    { id: 'batch', title: '批次管理', desc: '管理养殖批次', icon: 'layers-outline', color: '#2DBBA1', nav: 'BatchManagement' },
    { id: 'deathFeed', title: '死淘/耗料', desc: '记录死淘和耗料', icon: 'bar-chart-outline', color: '#3B82F6', nav: 'DeathFeedRecord' },
    { id: 'employee', title: '员工权限', desc: '管理员工权限', icon: 'people-outline', color: '#8B5CF6', nav: 'EmployeeManagement' },
    { id: 'environment', title: '环境监测', desc: '环境数据记录', icon: 'thermometer-outline', color: '#F59E0B', nav: 'EnvironmentRecord' },
  ];

  return (
    <View style={styles.container}>
      <Header title="生产管理" />
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={styles.scrollContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#2DBBA1']} />}
      >
        {/* 生产数据总览 */}
        <Text style={styles.homeSectionHeaderTitle}>生产数据总览</Text>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: GRID_GAP, marginTop: 12, marginBottom: 24 }}>
          {metrics.map((m, i) => (
            <View key={i} style={[styles.homeMetricCard, { width: GRID_ITEM_WIDTH }]}>
              <View style={styles.homeMetricRow}>
                <Text style={styles.homeMetricLabel}>{m.label}</Text>
                <Ionicons name={m.icon as any} size={16} color={m.color} />
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'baseline' }}>
                <Text style={[styles.homeMetricValue, { color: m.color }]}>{m.value}</Text>
                <Text style={styles.homeMetricUnit}>{m.unit}</Text>
              </View>
              <Text style={styles.homeMetricSub}>{m.sub}</Text>
            </View>
          ))}
        </View>

        {/* 死淘率趋势图 */}
        <View style={{ backgroundColor: '#FFF', borderRadius: 12, padding: 16, marginBottom: 24, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 8, elevation: 3 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
            <Text style={{ fontSize: 16, fontWeight: '600', color: '#1F5E52' }}>死淘率趋势</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Statistics')}>
              <Text style={{ fontSize: 13, color: '#2DBBA1' }}>查看详情</Text>
            </TouchableOpacity>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', height: 120 }}>
            {[35, 42, 38, 45, 52, 68, 48].map((h, i) => (
              <View key={i} style={{ flex: 1, alignItems: 'center', marginHorizontal: 2 }}>
                <View style={{ width: '100%', backgroundColor: h > 60 ? '#EF4444' : '#2DBBA1', borderRadius: 4, height: h * 1.2 }} />
                <Text style={{ fontSize: 10, color: '#999', marginTop: 4 }}>{['1/10', '1/11', '1/12', '1/13', '1/14', '1/15', '1/16'][i]}</Text>
              </View>
            ))}
          </View>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 8 }}>
            <Text style={{ fontSize: 12, color: '#666' }}>平均死淘率: 1.8%</Text>
            <Text style={{ fontSize: 12, color: '#666' }}>目标: ≤2.0%</Text>
          </View>
        </View>

        {/* 快捷功能 */}
        <Text style={styles.homeSectionHeaderTitle}>快捷功能</Text>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: GRID_GAP, marginTop: 12, marginBottom: 24 }}>
          {quickActions.map(item => (
            <TouchableOpacity
              key={item.id}
              activeOpacity={0.95}
              style={[styles.homeGridCard, { width: GRID_ITEM_WIDTH }]}
              onPress={() => navigation.navigate(item.nav)}
            >
              <View style={[styles.homeGridIconWrap, { backgroundColor: `${item.color}15` }]}>
                <Ionicons name={item.icon as any} size={22} color={item.color} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.homeGridTitle}>{item.title}</Text>
                <Text style={styles.homeGridDesc}>{item.desc}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* 今日任务 */}
        <Text style={styles.homeSectionHeaderTitle}>今日任务</Text>
        <View style={{ marginTop: 12 }}>
          {[
            { title: '疫苗接种', desc: '3号鸡舍 - 新城疫疫苗', status: 'completed' },
            { title: '设备检查', desc: '通风系统维护', status: 'in_progress' },
            { title: '数据录入', desc: '各批次死淘耗料记录', status: 'pending' },
          ].map((task, i) => {
            const statusColor = task.status === 'completed' ? '#10B981' : task.status === 'in_progress' ? '#F59E0B' : '#9CA3AF';
            const statusBg = task.status === 'completed' ? '#D1FAE5' : task.status === 'in_progress' ? '#FEF3C7' : '#F3F4F6';
            const statusText = task.status === 'completed' ? '已完成' : task.status === 'in_progress' ? '进行中' : '待完成';
            const statusTextColor = task.status === 'completed' ? '#065F46' : task.status === 'in_progress' ? '#92400E' : '#4B5563';
            return (
              <View key={i} style={[styles.homeTaskCard, { marginBottom: 12 }]}>
                <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
                  <View style={[styles.homeTaskCircle, { borderColor: task.status === 'completed' ? '#10B981' : '#D1D5DB' }]}>
                    {task.status === 'completed' && <View style={{ width: 12, height: 12, borderRadius: 6, backgroundColor: '#10B981' }} />}
                  </View>
                  <View style={{ marginLeft: 12, flex: 1 }}>
                    <Text style={{ fontSize: 15, fontWeight: '500', color: '#1F5E52' }}>{task.title}</Text>
                    <Text style={{ fontSize: 13, color: '#666', marginTop: 2 }}>{task.desc}</Text>
                  </View>
                </View>
                <View style={{ backgroundColor: statusBg, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12 }}>
                  <Text style={{ fontSize: 12, fontWeight: '600', color: statusTextColor }}>{statusText}</Text>
                </View>
              </View>
            );
          })}
        </View>
      </ScrollView>
    </View>
  );
};

export default ProductionManagementScreen;
