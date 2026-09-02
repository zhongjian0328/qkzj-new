import React, { useState, useCallback } from 'react';
import { View, Text, TouchableOpacity, FlatList, ActivityIndicator, RefreshControl } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import Header from '../components/Header';
import { controlPlanApi } from '../services/api';
import { styles } from '../styles';

const SEVERITY_COLORS: Record<string, string> = { low: '#22C55E', medium: '#F59E0B', high: '#EF4444', critical: '#991B1B' };
const SEVERITY_LABELS: Record<string, string> = { low: '低', medium: '中', high: '高', critical: '危急' };
const STATUS_COLORS: Record<string, string> = { draft: '#9CA3AF', active: '#2DBBA1', completed: '#22C55E', archived: '#6B7280' };
const STATUS_LABELS: Record<string, string> = { draft: '草稿', active: '进行中', completed: '已完成', archived: '已归档' };

export default function ControlPlanListScreen() {
  const navigation = useNavigation<any>();
  const [plans, setPlans] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<string>('all');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchPlans = useCallback(async () => {
    try {
      const params: any = { page: 1, limit: 50 };
      if (activeTab !== 'all') params.status = activeTab;
      const res = await controlPlanApi.getPlans(params);
      setPlans(res?.data || []);
    } catch (e: any) {
      console.error('获取预案列表失败:', e.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [activeTab]);

  useFocusEffect(useCallback(() => { fetchPlans(); }, [fetchPlans]));

  const onRefresh = () => { setRefreshing(true); fetchPlans(); };

  const renderPlan = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate('ControlPlanDetail', { planId: item._id })}
    >
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
        <Text style={{ fontSize: 16, fontWeight: '600', color: '#111827' }}>{item.planName}</Text>
        <View style={{
          paddingHorizontal: 8, paddingVertical: 2, borderRadius: 12,
          backgroundColor: STATUS_COLORS[item.status] + '20',
        }}>
          <Text style={{ fontSize: 12, fontWeight: '500', color: STATUS_COLORS[item.status] }}>
            {STATUS_LABELS[item.status]}
          </Text>
        </View>
      </View>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <Text style={{ fontSize: 14, color: '#4B5563' }}>{item.diseaseName}</Text>
        <View style={{
          flexDirection: 'row', alignItems: 'center', gap: 4,
          paddingHorizontal: 8, paddingVertical: 2, borderRadius: 12,
          backgroundColor: SEVERITY_COLORS[item.severity] + '15',
        }}>
          <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: SEVERITY_COLORS[item.severity] }} />
          <Text style={{ fontSize: 12, color: SEVERITY_COLORS[item.severity] }}>
            {SEVERITY_LABELS[item.severity]}
          </Text>
        </View>
      </View>
      <Text style={{ fontSize: 12, color: '#9CA3AF', marginTop: 8 }}>
        {new Date(item.createdAt).toLocaleDateString('zh-CN')}
      </Text>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#2DBBA1" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header title="防控预案" showBackButton onBack={() => navigation.goBack()} />
      {/* Tab 切换 */}
      <View style={{ flexDirection: 'row', backgroundColor: '#F3F4F6', padding: 4, margin: 12, borderRadius: 8 }}>
        {[
          { key: 'all', label: '全部' },
          { key: 'active', label: '进行中' },
          { key: 'completed', label: '已完成' },
          { key: 'archived', label: '已归档' },
        ].map(tab => (
          <TouchableOpacity
            key={tab.key}
            style={{
              flex: 1, paddingVertical: 8, borderRadius: 6, alignItems: 'center',
              backgroundColor: activeTab === tab.key ? '#FFFFFF' : 'transparent',
              shadowColor: activeTab === tab.key ? '#000' : 'transparent',
              shadowOpacity: 0.05, shadowRadius: 1, elevation: activeTab === tab.key ? 1 : 0,
            }}
            onPress={() => setActiveTab(tab.key)}
          >
            <Text style={{
              fontSize: 14, fontWeight: activeTab === tab.key ? '600' : '500',
              color: activeTab === tab.key ? '#2DBBA1' : '#6B7280',
            }}>{tab.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <FlatList
        data={plans}
        renderItem={renderPlan}
        keyExtractor={(item) => item._id}
        contentContainerStyle={{ padding: 12, gap: 12 }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#2DBBA1']} />}
        ListEmptyComponent={
          <View style={{ alignItems: 'center', paddingVertical: 64 }}>
            <Ionicons name="clipboard-outline" size={48} color="#9CA3AF" />
            <Text style={{ fontSize: 16, fontWeight: '600', color: '#111827', marginBottom: 8 }}>暂无预案</Text>
            <Text style={{ fontSize: 14, color: '#6B7280', textAlign: 'center', paddingHorizontal: 32 }}>
              完成 AI 诊断后可一键生成防控预案
            </Text>
          </View>
        }
      />
      {/* 生成按钮 */}
      <View style={{ padding: 16, backgroundColor: '#FFFFFF', borderTopWidth: 1, borderTopColor: '#E5E7EB' }}>
        <TouchableOpacity
          style={styles.primaryButton}
          onPress={() => navigation.navigate('GeneratePlan')}
        >
          <Ionicons name="add-circle" size={20} color="#FFFFFF" />
          <Text style={styles.primaryButtonText}>生成新预案</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
