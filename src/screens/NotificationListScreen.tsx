import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  RefreshControl,
  StyleSheet,
} from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import Header from '../components/Header';
import { notificationApi } from '../services/api';

// ---------------------------------------------------------------------------
// 类型定义
// ---------------------------------------------------------------------------

/** 通知类型 */
type NotificationType = 'warning' | 'followup' | 'system' | 'diagnosis' | 'ticket';

/** 通知列表项 */
interface NotificationItem {
  _id: string;
  title: string;
  message: string;
  type: NotificationType;
  isRead: boolean;
  createdAt: string;
  relatedId?: string;
}

// ---------------------------------------------------------------------------
// 常量配置
// ---------------------------------------------------------------------------

const TYPE_CONFIG: Record<NotificationType, { label: string; color: string; icon: string; bg: string }> = {
  warning: { label: '预警', color: '#EF4444', icon: 'warning', bg: '#FEF2F2' },
  followup: { label: '随访', color: '#3B82F6', icon: 'clipboard-outline', bg: '#EFF6FF' },
  system: { label: '系统', color: '#6B7280', icon: 'settings-outline', bg: '#F3F4F6' },
  diagnosis: { label: '诊断', color: '#22C55E', icon: 'medkit-outline', bg: '#F0FFF4' },
  ticket: { label: '工单', color: '#F97316', icon: 'document-text-outline', bg: '#FFF7ED' },
};

const COLORS = {
  primary: '#2DBBA1',
  primaryDark: '#1F5E52',
  bgLight: '#E6F7F3',
  text: '#1F2937',
  textSecondary: '#6B7280',
  border: '#E5E7EB',
  white: '#FFFFFF',
  red: '#EF4444',
};

// ---------------------------------------------------------------------------
// 工具函数
// ---------------------------------------------------------------------------

/** 格式化时间显示 */
function formatTime(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMin = Math.floor(diffMs / 60000);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);

  if (diffMin < 1) return '刚刚';
  if (diffMin < 60) return `${diffMin}分钟前`;
  if (diffHour < 24) return `${diffHour}小时前`;
  if (diffDay < 7) return `${diffDay}天前`;

  return date.toLocaleDateString('zh-CN', {
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
}

// ---------------------------------------------------------------------------
// 组件
// ---------------------------------------------------------------------------

export default function NotificationListScreen() {
  const navigation = useNavigation<any>();
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [error, setError] = useState<string | null>(null);

  // -----------------------------------------------------------------------
  // 数据获取
  // -----------------------------------------------------------------------

  const fetchNotifications = useCallback(async () => {
    try {
      setError(null);
      const [notifRes, countRes] = await Promise.all([
        notificationApi.getUserNotifications({ page: 1, limit: 50 }),
        notificationApi.getUnreadCount(),
      ]);
      setNotifications(notifRes?.data || []);
      setUnreadCount(countRes?.data?.count ?? 0);
    } catch (e: any) {
      console.error('获取通知列表失败:', e.message);
      setError(e.message || '获取通知失败');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useFocusEffect(useCallback(() => {
    fetchNotifications();
  }, [fetchNotifications]));

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchNotifications();
  }, [fetchNotifications]);

  // -----------------------------------------------------------------------
  // 操作处理
  // -----------------------------------------------------------------------

  /** 点击通知：标记已读并跳转详情 */
  const handleNotificationPress = useCallback(
    async (item: NotificationItem) => {
      if (!item.isRead) {
        try {
          await notificationApi.markAsRead(item._id);
          // 乐观更新列表
          setNotifications((prev) =>
            prev.map((n) => (n._id === item._id ? { ...n, isRead: true } : n))
          );
          setUnreadCount((prev) => Math.max(0, prev - 1));
        } catch (e: any) {
          console.error('标记已读失败:', e.message);
        }
      }

      // 根据通知类型跳转到对应页面
      if (item.relatedId) {
        switch (item.type) {
          case 'diagnosis':
            navigation.navigate('DiagnosisHistory');
            break;
          case 'followup':
            navigation.navigate('FollowUpDetail', { followUpId: item.relatedId });
            break;
          case 'ticket':
            navigation.navigate('TicketDetail', { ticketId: item.relatedId });
            break;
          case 'warning':
            navigation.navigate('EnvironmentAlert');
            break;
          default:
            break;
        }
      }
    },
    [navigation]
  );

  /** 全部标记为已读 */
  const handleMarkAllRead = useCallback(async () => {
    try {
      await notificationApi.markAllAsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      setUnreadCount(0);
    } catch (e: any) {
      console.error('全部标记已读失败:', e.message);
    }
  }, []);

  /** 删除通知 */
  const handleDelete = useCallback(
    async (id: string) => {
      try {
        await notificationApi.deleteNotification(id);
        setNotifications((prev) => prev.filter((n) => n._id !== id));
      } catch (e: any) {
        console.error('删除通知失败:', e.message);
      }
    },
    []
  );

  // -----------------------------------------------------------------------
  // 渲染
  // -----------------------------------------------------------------------

  const renderItem = useCallback(
    ({ item }: { item: NotificationItem }) => {
      const config = TYPE_CONFIG[item.type] || TYPE_CONFIG.system;
      return (
        <TouchableOpacity
          style={[styles.card, !item.isRead && styles.cardUnread]}
          onPress={() => handleNotificationPress(item)}
          activeOpacity={0.7}
        >
          {/* 类型色标 */}
          <View style={[styles.typeBar, { backgroundColor: config.color }]} />

          <View style={styles.cardContent}>
            <View style={styles.cardHeader}>
              <View style={[styles.typeBadge, { backgroundColor: config.bg }]}>
                <Ionicons name={config.icon as any} size={14} color={config.color} />
                <Text style={[styles.typeBadgeText, { color: config.color }]}>
                  {config.label}
                </Text>
              </View>
              {!item.isRead && <View style={styles.unreadDot} />}
            </View>

            <Text style={styles.title} numberOfLines={1}>
              {item.title}
            </Text>
            <Text style={styles.message} numberOfLines={2}>
              {item.message}
            </Text>

            <View style={styles.cardFooter}>
              <Text style={styles.time}>{formatTime(item.createdAt)}</Text>
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => handleDelete(item._id)}
                activeOpacity={0.6}
              >
                <Ionicons name="trash-outline" size={16} color="#9CA3AF" />
              </TouchableOpacity>
            </View>
          </View>
        </TouchableOpacity>
      );
    },
    [handleNotificationPress, handleDelete]
  );

  // 加载状态
  if (loading) {
    return (
      <View style={styles.container}>
        <Header
          title="通知中心"
          showBackButton
          onBack={() => navigation.goBack()}
        />
        <View style={styles.loadingCenter}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={styles.loadingText}>加载通知...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header
        title="通知中心"
        showBackButton
        onBack={() => navigation.goBack()}
        rightComponent={
          unreadCount > 0 ? (
            <View style={styles.badgeContainer}>
              <Ionicons name="notifications-outline" size={22} color={COLORS.primary} />
              <View style={styles.badge}>
                <Text style={styles.badgeText}>
                  {unreadCount > 99 ? '99+' : unreadCount}
                </Text>
              </View>
            </View>
          ) : null
        }
      />

      {/* 未读统计条 */}
      {unreadCount > 0 && (
        <View style={styles.unreadSummary}>
          <View style={styles.unreadSummaryLeft}>
            <Ionicons name="mail-unread-outline" size={18} color={COLORS.primary} />
            <Text style={styles.unreadSummaryText}>
              您有 <Text style={styles.unreadCount}>{unreadCount}</Text> 条未读通知
            </Text>
          </View>
          <TouchableOpacity
            style={styles.markAllButton}
            onPress={handleMarkAllRead}
            activeOpacity={0.7}
          >
            <Text style={styles.markAllButtonText}>全部已读</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* 错误提示 */}
      {error && (
        <View style={styles.errorBar}>
          <Ionicons name="alert-circle-outline" size={16} color={COLORS.red} />
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity onPress={fetchNotifications} style={styles.retryButton}>
            <Text style={styles.retryButtonText}>重试</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* 通知列表 */}
      <FlatList
        data={notifications}
        renderItem={renderItem}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[COLORS.primary]}
          />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>🔔</Text>
            <Text style={styles.emptyTitle}>暂无通知</Text>
            <Text style={styles.emptyDesc}>
              新的预警、随访、系统消息将在这里显示
            </Text>
          </View>
        }
      />
    </View>
  );
}

// ---------------------------------------------------------------------------
// 样式
// ---------------------------------------------------------------------------

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB' },

  // 加载中
  loadingCenter: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: COLORS.textSecondary,
  },

  // 顶部 Header Badge
  badgeContainer: { position: 'relative', padding: 8 },
  badge: {
    position: 'absolute',
    top: 2,
    right: 2,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: COLORS.red,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#FFFFFF',
  },

  // 未读统计条
  unreadSummary: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: 12,
    marginTop: 8,
    marginBottom: 8,
    padding: 12,
    backgroundColor: COLORS.bgLight,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#C6F6D5',
  },
  unreadSummaryLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  unreadSummaryText: {
    fontSize: 13,
    color: COLORS.primaryDark,
  },
  unreadCount: {
    fontWeight: '700',
    color: COLORS.primary,
  },
  markAllButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    backgroundColor: COLORS.primary,
  },
  markAllButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#FFFFFF',
  },

  // 错误条
  errorBar: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 12,
    marginBottom: 8,
    padding: 10,
    backgroundColor: '#FEF2F2',
    borderRadius: 8,
    gap: 6,
  },
  errorText: {
    flex: 1,
    fontSize: 13,
    color: COLORS.red,
  },
  retryButton: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 4,
    backgroundColor: '#FEE2E2',
  },
  retryButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.red,
  },

  // 列表
  listContent: { padding: 12, gap: 10 },

  // 通知卡片
  card: {
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  cardUnread: {
    borderColor: COLORS.primary,
    borderWidth: 1,
    backgroundColor: '#F0FFFD',
  },
  typeBar: { width: 4 },
  cardContent: { flex: 1, padding: 12 },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  typeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  typeBadgeText: { fontSize: 12, fontWeight: '600' },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.primary,
  },
  title: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 4,
  },
  message: {
    fontSize: 13,
    color: COLORS.textSecondary,
    lineHeight: 18,
    marginBottom: 6,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  time: {
    fontSize: 11,
    color: '#9CA3AF',
  },
  deleteButton: {
    padding: 4,
  },

  // 空状态
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 64,
  },
  emptyIcon: { fontSize: 48, marginBottom: 16 },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 8,
  },
  emptyDesc: {
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: 'center',
    paddingHorizontal: 32,
  },
});
