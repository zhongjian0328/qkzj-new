import React, { useState, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator, RefreshControl } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import Header from '../components/Header';
import { followUpApi } from '../services/api';
import { styles } from '../styles';

const TYPE_LABELS: Record<string, string> = { day3: '第3日回访', day7: '第7日回访', custom: '自定义回访' };
const STATUS_COLORS: Record<string, string> = { pending: '#F59E0B', completed: '#22C55E', overdue: '#EF4444', cancelled: '#9CA3AF' };
const STATUS_LABELS: Record<string, string> = { pending: '待回访', completed: '已完成', overdue: '逾期', cancelled: '已取消' };

export default function FollowUpListScreen() {
  const navigation = useNavigation<any>();
  const [followUps, setFollowUps] = useState<any[]>([]);
  const [stats, setStats] = useState({ pending: 0, completed: 0, overdue: 0, total: 0 });
  const [activeTab, setActiveTab] = useState<string>('all');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      const [listRes, statsRes] = await Promise.all([
        followUpApi.getFollowUps(activeTab !== 'all' ? { status: activeTab } : {}),
        followUpApi.getFollowUpStats(),
      ]);
      setFollowUps(listRes?.data || []);
      setStats(statsRes?.data || stats);
    } catch (e: any) {
      console.error('获取回访数据失败:', e.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [activeTab]);

  useFocusEffect(useCallback(() => { fetchData(); }, [fetchData]));

  const onRefresh = () => { setRefreshing(true); fetchData(); };

  const renderFollowUp = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate('FollowUpDetail', { followUpId: item._id })}
    >
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
        <Text style={{ fontSize: 15, fontWeight: '600', color: '#111827' }}>
          {TYPE_LABELS[item.followUpType] || item.followUpType}
        </Text>
        <View style={{
          paddingHorizontal: 8, paddingVertical: 2, borderRadius: 12,
          backgroundColor: STATUS_COLORS[item.status] + '20',
        }}>
          <Text style={{ fontSize: 12, fontWeight: '500', color: STATUS_COLORS[item.status] }}>
            {STATUS_LABELS[item.status]}
          </Text>
        </View>
      </View>
      {item.planId && (
        <Text style={{ fontSize: 13, color: '#4B5563', marginBottom: 4 }}>
          关联预案：{item.planId.planName || item.planId.diseaseName}
        </Text>
      )}
      <Text style={{ fontSize: 12, color: '#9CA3AF' }}>
        计划日期：{new Date(item.scheduledDate).toLocaleDateString('zh-CN')}
      </Text>
    </TouchableOpacity>
  );

  if (loading) return <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}><ActivityIndicator size="large" color="#2DBBA1" /></View>;

  return (
    <View style={styles.container}>
      <Header title="回访管理" showBackButton onBack={() => navigation.goBack()} />
      {/* 统计卡片 */}
      <View style={{ flexDirection: 'row', padding: 12, gap: 8 }}>
        {[
          { label: '待回访', value: stats.pending, color: '#F59E0B' },
          { label: '已完成', value: stats.completed, color: '#22C55E' },
          { label: '逾期', value: stats.overdue, color: '#EF4444' },
        ].map(s => (
          <View key={s.label} style={{ flex: 1, backgroundColor: '#FFFFFF', borderRadius: 12, padding: 12, alignItems: 'center' }}>
            <Text style={{ fontSize: 24, fontWeight: '700', color: s.color }}>{s.value}</Text>
            <Text style={{ fontSize: 12, color: '#6B7280', marginTop: 4 }}>{s.label}</Text>
          </View>
        ))}
      </View>
      {/* Tab 切换 */}
      <View style={{ flexDirection: 'row', backgroundColor: '#F3F4F6', padding: 4, marginHorizontal: 12, borderRadius: 8 }}>
        {[
          { key: 'all', label: '全部' },
          { key: 'pending', label: '待回访' },
          { key: 'completed', label: '已完成' },
          { key: 'overdue', label: '逾期' },
        ].map(tab => (
          <TouchableOpacity
            key={tab.key}
            style={{
              flex: 1, paddingVertical: 8, borderRadius: 6, alignItems: 'center',
              backgroundColor: activeTab === tab.key ? '#FFFFFF' : 'transparent',
              elevation: activeTab === tab.key ? 1 : 0,
            }}
            onPress={() => setActiveTab(tab.key)}
          >
            <Text style={{
              fontSize: 13, fontWeight: activeTab === tab.key ? '600' : '500',
              color: activeTab === tab.key ? '#2DBBA1' : '#6B7280',
            }}>{tab.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <FlatList
        data={followUps}
        renderItem={renderFollowUp}
        keyExtractor={(item) => item._id}
        contentContainerStyle={{ padding: 12, gap: 8 }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#2DBBA1']} />}
        ListEmptyComponent={
          <View style={{ alignItems: 'center', paddingVertical: 64 }}>
            <Ionicons name="call-outline" size={48} color="#9CA3AF" />
            <Text style={{ fontSize: 16, fontWeight: '600', color: '#111827', marginBottom: 8 }}>暂无回访</Text>
            <Text style={{ fontSize: 14, color: '#6B7280', textAlign: 'center', paddingHorizontal: 32 }}>
              完成防控预案后会自动创建回访任务
            </Text>
          </View>
        }
      />
    </View>
  );
}
