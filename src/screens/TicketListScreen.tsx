import React, { useState, useCallback } from 'react';
import { View, Text, TouchableOpacity, FlatList, ActivityIndicator, RefreshControl } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import Header from '../components/Header';
import { serviceTicketApi } from '../services/api';
import { StyleSheet } from 'react-native';

const COLORS = {
  primary: '#2DBBA1',
  primaryDark: '#1F5E52',
  bgLight: '#E6F7F3',
  text: '#1F2937',
  textSecondary: '#6B7280',
  border: '#E5E7EB',
  danger: '#EF4444',
  warning: '#F59E0B',
};

const PRIORITY_CONFIG: Record<string, { color: string; label: string }> = {
  urgent: { color: COLORS.danger, label: '紧急' },
  high: { color: COLORS.warning, label: '高' },
  medium: { color: '#3B82F6', label: '中' },
  low: { color: '#9CA3AF', label: '低' },
};

const STATUS_CONFIG: Record<string, { color: string; label: string }> = {
  open: { color: '#3B82F6', label: '待处理' },
  in_progress: { color: COLORS.warning, label: '进行中' },
  completed: { color: '#22C55E', label: '已完成' },
  cancelled: { color: '#9CA3AF', label: '已取消' },
};

const CATEGORY_LABELS: Record<string, string> = {
  equipment: '设备维修',
  environment: '环境调控',
  disease: '疾病排查',
  nutrition: '营养饲喂',
  other: '其他',
};

export default function TicketListScreen() {
  const navigation = useNavigation<any>();
  const [activeTab, setActiveTab] = useState<'my' | 'assigned'>('my');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [tickets, setTickets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const fetchTickets = useCallback(async () => {
    try {
      setError(null);
      const params: any = { page: 1, limit: 50 };
      if (statusFilter !== 'all') params.status = statusFilter;

      const res = activeTab === 'my'
        ? await serviceTicketApi.getMyTickets(params)
        : await serviceTicketApi.getAssignedTickets(params);
      setTickets(res?.data || []);
    } catch (e: any) {
      console.error('获取工单列表失败:', e.message);
      setError('加载工单列表失败，请稍后重试');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [activeTab, statusFilter]);

  useFocusEffect(useCallback(() => { fetchTickets(); }, [fetchTickets]));

  const onRefresh = () => { setRefreshing(true); fetchTickets(); };

  const renderTicket = ({ item }: { item: any }) => {
    const priority = PRIORITY_CONFIG[item.priority] || PRIORITY_CONFIG.medium;
    const status = STATUS_CONFIG[item.status] || STATUS_CONFIG.open;

    return (
      <TouchableOpacity
        style={cardStyles.card}
        onPress={() => navigation.navigate('TicketDetail', { ticketId: item._id })}
      >
        {/* 优先级色标 */}
        <View style={[cardStyles.priorityBar, { backgroundColor: priority.color }]} />
        <View style={cardStyles.cardContent}>
          <View style={cardStyles.cardHeader}>
            <Text style={cardStyles.ticketNo}>{item.ticketNo || item._id?.slice(-6)}</Text>
            <View style={[cardStyles.statusBadge, { backgroundColor: status.color + '20' }]}>
              <Text style={[cardStyles.statusText, { color: status.color }]}>{status.label}</Text>
            </View>
          </View>
          <Text style={cardStyles.title} numberOfLines={1}>{item.title}</Text>
          <View style={cardStyles.cardFooter}>
            <View style={[cardStyles.categoryTag, { backgroundColor: COLORS.bgLight }]}>
              <Text style={[cardStyles.categoryText, { color: COLORS.primaryDark }]}>
                {CATEGORY_LABELS[item.category] || item.category}
              </Text>
            </View>
            <View style={cardStyles.priorityDot}>
              <View style={[cardStyles.priorityDotInner, { backgroundColor: priority.color }]} />
              <Text style={[cardStyles.priorityText, { color: priority.color }]}>{priority.label}</Text>
            </View>
          </View>
          <Text style={cardStyles.time}>
            {item.createdAt ? new Date(item.createdAt).toLocaleString('zh-CN', {
              month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit',
            }) : ''}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  const emptyText = activeTab === 'my' ? '暂无我发起的工单' : '暂无我负责的工单';

  if (loading) {
    return (
      <View style={styles.container}>
        <Header title="服务工单" showBackButton onBack={() => navigation.goBack()} />
        <View style={{ justifyContent: 'center', alignItems: 'center', flex: 1 }}>
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header
        title="服务工单"
        showBackButton
        onBack={() => navigation.goBack()}
        rightComponent={
          <TouchableOpacity
            style={{ padding: 8 }}
            onPress={() => navigation.navigate('CreateTicket')}
          >
            <Ionicons name="add-circle" size={24} color={COLORS.primary} />
          </TouchableOpacity>
        }
      />

      {/* 一级 Tab：我的工单 / 承接工单 */}
      <View style={styles.tabContainer}>
        {[
          { key: 'my' as const, label: '我的工单' },
          { key: 'assigned' as const, label: '承接工单' },
        ].map(tab => (
          <TouchableOpacity
            key={tab.key}
            style={[styles.tab, activeTab === tab.key && styles.tabActive]}
            onPress={() => { setActiveTab(tab.key); setStatusFilter('all'); }}
          >
            <Text style={[styles.tabText, activeTab === tab.key && styles.tabTextActive]}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* 二级状态筛选 */}
      <View style={styles.filterContainer}>
        {['全部', '待处理', '进行中', '已完成'].map(label => {
          const keyMap: Record<string, string> = { '全部': 'all', '待处理': 'open', '进行中': 'in_progress', '已完成': 'completed' };
          const key = keyMap[label];
          return (
            <TouchableOpacity
              key={key}
              style={[styles.filterChip, statusFilter === key && styles.filterChipActive]}
              onPress={() => setStatusFilter(key)}
            >
              <Text style={[styles.filterChipText, statusFilter === key && styles.filterChipTextActive]}>
                {label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {loading ? (
        <View style={styles.emptyContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={styles.emptyDesc}>正在加载工单...</Text>
        </View>
      ) : error ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyIcon}>⚠️</Text>
          <Text style={styles.emptyTitle}>{error}</Text>
          <TouchableOpacity style={{ marginTop: 12, backgroundColor: COLORS.primary, borderRadius: 8, paddingHorizontal: 24, paddingVertical: 10 }} onPress={() => fetchTickets()}>
            <Text style={{ color: '#FFFFFF', fontSize: 16, fontWeight: '600' }}>重试</Text>
          </TouchableOpacity>
        </View>
      ) : (
      <FlatList
        data={tickets}
        renderItem={renderTicket}
        keyExtractor={(item) => item._id}
        contentContainerStyle={cardStyles.listContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[COLORS.primary]} />}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>📋</Text>
            <Text style={styles.emptyTitle}>{emptyText}</Text>
            <Text style={styles.emptyDesc}>
              {activeTab === 'my' ? '发起工单请求技术支持' : '承接工单后开始处理'}
            </Text>
          </View>
        }
      />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB' },
  tabContainer: {
    flexDirection: 'row', backgroundColor: '#F3F4F6',
    padding: 4, marginHorizontal: 12, marginTop: 8, borderRadius: 8,
  },
  tab: { flex: 1, paddingVertical: 8, borderRadius: 6, alignItems: 'center' },
  tabActive: { backgroundColor: '#FFFFFF', shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 1, elevation: 1 },
  tabText: { fontSize: 14, fontWeight: '500', color: '#6B7280' },
  tabTextActive: { fontSize: 14, fontWeight: '600', color: COLORS.primary },
  filterContainer: { flexDirection: 'row', paddingHorizontal: 12, paddingVertical: 8, gap: 8 },
  filterChip: { paddingHorizontal: 12, paddingVertical: 4, borderRadius: 12, borderWidth: 1, borderColor: COLORS.border, backgroundColor: '#FFFFFF' },
  filterChipActive: { backgroundColor: COLORS.bgLight, borderColor: COLORS.primary, borderWidth: 1 },
  filterChipText: { fontSize: 12, color: COLORS.textSecondary },
  filterChipTextActive: { fontSize: 12, color: COLORS.primaryDark, fontWeight: '600' },
  emptyContainer: { alignItems: 'center', paddingVertical: 64 },
  emptyIcon: { fontSize: 48, marginBottom: 16 },
  emptyTitle: { fontSize: 16, fontWeight: '600', color: COLORS.text, marginBottom: 8 },
  emptyDesc: { fontSize: 14, color: COLORS.textSecondary, textAlign: 'center', paddingHorizontal: 32 },
});

const cardStyles = StyleSheet.create({
  listContent: { padding: 12, gap: 12 },
  card: { flexDirection: 'row', backgroundColor: '#FFFFFF', borderRadius: 12, overflow: 'hidden', borderWidth: 1, borderColor: COLORS.border },
  priorityBar: { width: 4 },
  cardContent: { flex: 1, padding: 12 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
  ticketNo: { fontSize: 12, color: COLORS.textSecondary },
  statusBadge: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 12 },
  statusText: { fontSize: 12, fontWeight: '500' },
  title: { fontSize: 15, fontWeight: '600', color: COLORS.text, marginBottom: 8 },
  cardFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
  categoryTag: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 8 },
  categoryText: { fontSize: 12, fontWeight: '500' },
  priorityDot: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  priorityDotInner: { width: 8, height: 8, borderRadius: 4 },
  priorityText: { fontSize: 12, fontWeight: '500' },
  time: { fontSize: 11, color: '#9CA3AF' },
});
