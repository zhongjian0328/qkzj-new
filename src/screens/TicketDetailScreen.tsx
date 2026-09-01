import React, { useState, useCallback, useEffect } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, TextInput,
  ActivityIndicator, Modal, Alert, KeyboardAvoidingView, Platform,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
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

type RootStackParamList = {
  TicketDetail: { ticketId: string };
};

export default function TicketDetailScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<RouteProp<RootStackParamList, 'TicketDetail'>>();
  const { ticketId } = route.params;

  const [ticket, setTicket] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [messageText, setMessageText] = useState('');
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [ratingScore, setRatingScore] = useState(5);
  const [ratingComment, setRatingComment] = useState('');

  const fetchTicket = useCallback(async () => {
    try {
      const res = await serviceTicketApi.getTicketById(ticketId);
      setTicket(res?.data || res);
    } catch (e: any) {
      console.error('获取工单详情失败:', e.message);
      Alert.alert('错误', '获取工单详情失败');
    } finally {
      setLoading(false);
    }
  }, [ticketId]);

  useEffect(() => { fetchTicket(); }, [fetchTicket]);

  const handleAccept = async () => {
    try {
      await serviceTicketApi.acceptTicket(ticketId);
      Alert.alert('成功', '工单已接受');
      fetchTicket();
    } catch (e: any) {
      Alert.alert('错误', e.message || '接受工单失败');
    }
  };

  const handleAddMessage = async () => {
    if (!messageText.trim()) return;
    try {
      await serviceTicketApi.addMessage(ticketId, { content: messageText.trim() });
      setMessageText('');
      fetchTicket();
    } catch (e: any) {
      Alert.alert('错误', e.message || '发送消息失败');
    }
  };

  const handleComplete = async () => {
    Alert.alert('确认完成', '确定要完成此工单吗？', [
      { text: '取消', style: 'cancel' },
      {
        text: '完成',
        onPress: async () => {
          try {
            await serviceTicketApi.completeTicket(ticketId);
            Alert.alert('成功', '工单已完成');
            fetchTicket();
          } catch (e: any) {
            Alert.alert('错误', e.message || '完成工单失败');
          }
        },
      },
    ]);
  };

  const handleCancel = async () => {
    Alert.alert('确认取消', '确定要取消此工单吗？', [
      { text: '取消', style: 'cancel' },
      {
        text: '确认取消',
        style: 'destructive',
        onPress: async () => {
          try {
            await serviceTicketApi.cancelTicket(ticketId);
            Alert.alert('成功', '工单已取消');
            fetchTicket();
          } catch (e: any) {
            Alert.alert('错误', e.message || '取消工单失败');
          }
        },
      },
    ]);
  };

  const handleRate = async () => {
    try {
      await serviceTicketApi.rateTicket(ticketId, {
        score: ratingScore,
        comment: ratingComment.trim() || undefined,
      });
      setShowRatingModal(false);
      Alert.alert('成功', '评价已提交');
      fetchTicket();
    } catch (e: any) {
      Alert.alert('错误', e.message || '评价提交失败');
    }
  };

  const priority = ticket ? (PRIORITY_CONFIG[ticket.priority] || PRIORITY_CONFIG.medium) : null;
  const status = ticket ? (STATUS_CONFIG[ticket.status] || STATUS_CONFIG.open) : null;

  if (loading) {
    return (
      <View style={styles.container}>
        <Header title="工单详情" showBackButton onBack={() => navigation.goBack()} />
        <View style={{ justifyContent: 'center', alignItems: 'center', flex: 1 }}>
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      </View>
    );
  }

  if (!ticket) {
    return (
      <View style={styles.container}>
        <Header title="工单详情" showBackButton onBack={() => navigation.goBack()} />
        <View style={{ justifyContent: 'center', alignItems: 'center', flex: 1 }}>
          <Text style={{ fontSize: 16, color: COLORS.textSecondary }}>工单不存在</Text>
        </View>
      </View>
    );
  }

  const messages = ticket.messages || [];

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <Header
        title="工单详情"
        showBackButton
        onBack={() => navigation.goBack()}
      />

      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
        {/* 工单基本信息 */}
        <View style={styles.section}>
          <View style={styles.infoRow}>
            <Text style={styles.ticketNo}>{ticket.ticketNo || ticket._id?.slice(-8)}</Text>
            {priority && (
              <View style={[styles.priorityBadge, { backgroundColor: priority.color }]}>
                <Text style={styles.priorityBadgeText}>{priority.label}</Text>
              </View>
            )}
          </View>
          <Text style={styles.title}>{ticket.title}</Text>

          <View style={styles.metaRow}>
            <View style={[styles.tag, { backgroundColor: COLORS.bgLight }]}>
              <Text style={[styles.tagText, { color: COLORS.primaryDark }]}>
                {CATEGORY_LABELS[ticket.category] || ticket.category}
              </Text>
            </View>
            {status && (
              <View style={[styles.tag, { backgroundColor: status.color + '20' }]}>
                <Text style={[styles.tagText, { color: status.color }]}>{status.label}</Text>
              </View>
            )}
          </View>

          {ticket.location && (
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>服务地点：</Text>
              <Text style={styles.detailValue}>{ticket.location}</Text>
            </View>
          )}
          {ticket.scheduledDate && (
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>预约时间：</Text>
              <Text style={styles.detailValue}>{new Date(ticket.scheduledDate).toLocaleString('zh-CN')}</Text>
            </View>
          )}
        </View>

        {/* 详细描述 */}
        {ticket.description && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>详细描述</Text>
            <Text style={styles.description}>{ticket.description}</Text>
          </View>
        )}

        {/* 沟通消息 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>沟通记录</Text>
          {messages.length === 0 ? (
            <Text style={styles.emptyMessages}>暂无沟通记录</Text>
          ) : (
            messages.map((msg: any, idx: number) => (
              <View key={msg._id || idx} style={styles.messageItem}>
                <View style={styles.avatar}>
                  <Text style={styles.avatarText}>
                    {msg.senderName ? msg.senderName.charAt(0) : 'U'}
                  </Text>
                </View>
                <View style={styles.messageBubble}>
                  <View style={styles.messageHeader}>
                    <Text style={styles.senderName}>{msg.senderName || '用户'}</Text>
                    <Text style={styles.messageTime}>
                      {msg.createdAt ? new Date(msg.createdAt).toLocaleString('zh-CN', {
                        month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit',
                      }) : ''}
                    </Text>
                  </View>
                  <Text style={styles.messageContent}>{msg.content}</Text>
                </View>
              </View>
            ))
          )}
        </View>
      </ScrollView>

      {/* 底部操作栏 */}
      <View style={styles.actionBar}>
        {ticket.status === 'open' && (
          <TouchableOpacity style={[styles.actionButton, { backgroundColor: COLORS.primary }]} onPress={handleAccept}>
            <Text style={styles.actionButtonText}>接受工单</Text>
          </TouchableOpacity>
        )}

        {ticket.status === 'in_progress' && (
          <>
            <View style={{ flex: 1, flexDirection: 'row', gap: 8 }}>
              <TextInput
                style={styles.messageInput}
                placeholder="输入消息..."
                value={messageText}
                onChangeText={setMessageText}
                multiline
              />
              <TouchableOpacity style={[styles.actionButton, { backgroundColor: COLORS.primary }]} onPress={handleAddMessage}>
                <Text style={styles.actionButtonText}>发送</Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity style={[styles.actionButton, { backgroundColor: '#22C55E', marginTop: 8 }]} onPress={handleComplete}>
              <Text style={styles.actionButtonText}>完成工单</Text>
            </TouchableOpacity>
          </>
        )}

        {(ticket.status === 'open' || ticket.status === 'in_progress') && (
          <TouchableOpacity style={[styles.actionButton, { backgroundColor: COLORS.danger }]} onPress={handleCancel}>
            <Text style={styles.actionButtonText}>取消工单</Text>
          </TouchableOpacity>
        )}

        {ticket.status === 'completed' && (
          <TouchableOpacity style={[styles.actionButton, { backgroundColor: COLORS.primary }]} onPress={() => setShowRatingModal(true)}>
            <Text style={styles.actionButtonText}>评价工单</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* 评价弹窗 */}
      <Modal visible={showRatingModal} transparent animationType="fade" onRequestClose={() => setShowRatingModal(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>评价工单</Text>
            <Text style={styles.modalSubtitle}>满意度评分</Text>
            <View style={styles.starsRow}>
              {[1, 2, 3, 4, 5].map(star => (
                <TouchableOpacity key={star} onPress={() => setRatingScore(star)}>
                  <Text style={[styles.star, star <= ratingScore && styles.starActive]}>
                    {star <= ratingScore ? '★' : '☆'}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            <TextInput
              style={styles.ratingInput}
              placeholder="补充评语（可选）"
              value={ratingComment}
              onChangeText={setRatingComment}
              multiline
              maxLength={200}
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity style={[styles.modalButton, styles.modalButtonCancel]} onPress={() => setShowRatingModal(false)}>
                <Text style={styles.modalButtonTextCancel}>取消</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.modalButton, { backgroundColor: COLORS.primary }]} onPress={handleRate}>
                <Text style={styles.modalButtonText}>提交评价</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB' },
  scroll: { flex: 1 },
  scrollContent: { paddingBottom: 120 },
  section: { backgroundColor: '#FFFFFF', margin: 12, borderRadius: 12, padding: 16, borderWidth: 1, borderColor: COLORS.border },
  infoRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  ticketNo: { fontSize: 13, color: COLORS.textSecondary },
  priorityBadge: { paddingHorizontal: 10, paddingVertical: 3, borderRadius: 12 },
  priorityBadgeText: { fontSize: 12, color: '#FFFFFF', fontWeight: '600' },
  title: { fontSize: 18, fontWeight: '700', color: COLORS.text, marginBottom: 12 },
  metaRow: { flexDirection: 'row', gap: 8, marginBottom: 8 },
  tag: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  tagText: { fontSize: 13, fontWeight: '500' },
  detailRow: { flexDirection: 'row', marginTop: 6 },
  detailLabel: { fontSize: 13, color: COLORS.textSecondary },
  detailValue: { fontSize: 13, color: COLORS.text, flex: 1 },
  sectionTitle: { fontSize: 15, fontWeight: '600', color: COLORS.text, marginBottom: 10 },
  description: { fontSize: 14, color: COLORS.textSecondary, lineHeight: 22 },
  emptyMessages: { fontSize: 14, color: COLORS.textSecondary, textAlign: 'center', paddingVertical: 24 },
  messageItem: { flexDirection: 'row', gap: 10, marginBottom: 14 },
  avatar: { width: 36, height: 36, borderRadius: 18, backgroundColor: COLORS.bgLight, justifyContent: 'center', alignItems: 'center' },
  avatarText: { fontSize: 14, fontWeight: '600', color: COLORS.primaryDark },
  messageBubble: { flex: 1, backgroundColor: '#F3F4F6', borderRadius: 12, padding: 10 },
  messageHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
  senderName: { fontSize: 13, fontWeight: '600', color: COLORS.text },
  messageTime: { fontSize: 11, color: '#9CA3AF' },
  messageContent: { fontSize: 14, color: COLORS.textSecondary, lineHeight: 20 },
  actionBar: { padding: 12, backgroundColor: '#FFFFFF', borderTopWidth: 1, borderTopColor: COLORS.border },
  actionButton: { paddingVertical: 12, borderRadius: 8, alignItems: 'center' },
  actionButtonText: { fontSize: 15, fontWeight: '600', color: '#FFFFFF' },
  messageInput: { flex: 1, borderWidth: 1, borderColor: COLORS.border, borderRadius: 8, paddingHorizontal: 12, paddingVertical: 8, fontSize: 14, maxHeight: 80 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
  modalContent: { backgroundColor: '#FFFFFF', borderRadius: 16, padding: 24, width: '80%', maxWidth: 340 },
  modalTitle: { fontSize: 18, fontWeight: '700', color: COLORS.text, textAlign: 'center', marginBottom: 4 },
  modalSubtitle: { fontSize: 14, color: COLORS.textSecondary, textAlign: 'center', marginBottom: 16 },
  starsRow: { flexDirection: 'row', justifyContent: 'center', gap: 8, marginBottom: 16 },
  star: { fontSize: 32, color: '#D1D5DB' },
  starActive: { color: '#F59E0B' },
  ratingInput: { borderWidth: 1, borderColor: COLORS.border, borderRadius: 8, padding: 10, fontSize: 14, minHeight: 60, textAlignVertical: 'top', marginBottom: 16 },
  modalButtons: { flexDirection: 'row', gap: 12 },
  modalButton: { flex: 1, paddingVertical: 12, borderRadius: 8, alignItems: 'center' },
  modalButtonCancel: { backgroundColor: '#F3F4F6' },
  modalButtonText: { fontSize: 15, fontWeight: '600', color: '#FFFFFF' },
  modalButtonTextCancel: { fontSize: 15, fontWeight: '600', color: COLORS.textSecondary },
});
