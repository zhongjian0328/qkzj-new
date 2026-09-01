import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import Header from '../components/Header';
import { controlPlanApi } from '../services/api';
import { styles } from '../styles';

const SEVERITY_COLORS = { low: '#22C55E', medium: '#F59E0B', high: '#EF4444', critical: '#991B1B' };
const SEVERITY_LABELS = { low: '低风险', medium: '中风险', high: '高风险', critical: '极高风险' };
const STATUS_LABELS = { draft: '草稿', active: '进行中', completed: '已完成', archived: '已归档' };

function SectionCard({ title, icon, children, defaultOpen = true }: any) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <View style={styles.card}>
      <TouchableOpacity style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }} onPress={() => setOpen(!open)}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <Text style={{ fontSize: 20 }}>{icon}</Text>
          <Text style={{ fontSize: 16, fontWeight: '600', color: '#111827' }}>{title}</Text>
        </View>
        <Ionicons name={open ? 'chevron-up' : 'chevron-down'} size={20} color="#6B7280" />
      </TouchableOpacity>
      {open && <View style={{ marginTop: 12, gap: 8 }}>{children}</View>}
    </View>
  );
}

export default function ControlPlanDetailScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { planId } = route.params;
  const [plan, setPlan] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await controlPlanApi.getPlanById(planId);
        setPlan(res?.data);
      } catch (e: any) {
        Alert.alert('错误', '获取预案详情失败');
      } finally {
        setLoading(false);
      }
    })();
  }, [planId]);

  const handleAction = async (action: string, confirmMsg: string) => {
    Alert.alert('确认操作', confirmMsg, [
      { text: '取消', style: 'cancel' },
      { text: '确认', onPress: async () => {
        try {
          const res = action === 'complete'
            ? await controlPlanApi.completePlan(planId, {})
            : action === 'archive'
            ? await controlPlanApi.archivePlan(planId)
            : null;
          if (res?.data) setPlan(res.data);
          Alert.alert('成功', `预案已${action === 'complete' ? '完成' : '归档'}`);
        } catch (e: any) {
          Alert.alert('错误', '操作失败');
        }
      }}
    ]);
  };

  if (loading) return <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}><ActivityIndicator size="large" color="#2DBBA1" /></View>;
  if (!plan) return <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}><Text>预案不存在</Text></View>;

  const content = plan.planContent || {};
  const medications = content.medication?.recommendations || [];
  const greenDrugs = content.medication?.greenDrugs || [];
  const timeline = content.timeline || [];

  return (
    <View style={styles.container}>
      <Header title="预案详情" showBackButton onBack={() => navigation.goBack()} />
      <ScrollView style={{ padding: 12, gap: 12 }}>
        {/* 基本信息 */}
        <View style={styles.card}>
          <Text style={{ fontSize: 18, fontWeight: '600', color: '#111827', marginBottom: 8 }}>{plan.planName}</Text>
          <View style={{ flexDirection: 'row', gap: 8, flexWrap: 'wrap' }}>
            <View style={{
              paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12,
              backgroundColor: SEVERITY_COLORS[plan.severity] + '20',
            }}>
              <Text style={{ fontSize: 12, fontWeight: '500', color: SEVERITY_COLORS[plan.severity] }}>
                {SEVERITY_LABELS[plan.severity]}
              </Text>
            </View>
            <View style={{
              paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12,
              backgroundColor: '#E6F7F3',
            }}>
              <Text style={{ fontSize: 12, color: '#1F5E52' }}>{STATUS_LABELS[plan.status]}</Text>
            </View>
            <Text style={{ fontSize: 12, color: '#9CA3AF', alignSelf: 'center' }}>
              {plan.generatedBy === 'ai' ? '🤖 AI生成' : '✍️ 手动创建'}
            </Text>
          </View>
          <Text style={{ fontSize: 12, color: '#9CA3AF', marginTop: 8 }}>
            创建时间：{new Date(plan.createdAt).toLocaleString('zh-CN')}
          </Text>
        </View>

        {/* 8 章节折叠面板 */}
        <SectionCard title="疫情概述" icon="📊">{content.overview ? <Text style={{ fontSize: 14, color: '#4B5563', lineHeight: 22 }}>{content.overview}</Text> : <Text style={{ color: '#9CA3AF' }}>暂无</Text>}</SectionCard>
        <SectionCard title="隔离措施" icon="🚧">{content.isolation ? <Text style={{ fontSize: 14, color: '#4B5563', lineHeight: 22 }}>{content.isolation}</Text> : <Text style={{ color: '#9CA3AF' }}>暂无</Text>}</SectionCard>
        <SectionCard title="消毒方案" icon="🧹">{content.disinfection ? <Text style={{ fontSize: 14, color: '#4B5563', lineHeight: 22 }}>{content.disinfection}</Text> : <Text style={{ color: '#9CA3AF' }}>暂无</Text>}</SectionCard>

        {/* 用药推荐（绿色高亮） */}
        <SectionCard title="用药推荐" icon="💊">
          {medications.length > 0 ? medications.map((med: any, i: number) => (
            <View key={i} style={{ backgroundColor: '#F9FAFB', borderRadius: 8, padding: 12 }}>
              <Text style={{ fontSize: 14, fontWeight: '600', color: '#111827' }}>{med.drugName}</Text>
              <Text style={{ fontSize: 13, color: '#4B5563', marginTop: 4 }}>剂量：{med.dosage}</Text>
              <Text style={{ fontSize: 13, color: '#4B5563' }}>疗程：{med.duration}</Text>
              {med.note && <Text style={{ fontSize: 13, color: '#6B7280', marginTop: 4 }}>备注：{med.note}</Text>}
            </View>
          )) : <Text style={{ color: '#9CA3AF' }}>暂无用药推荐</Text>}
          {greenDrugs.length > 0 && (
            <View style={{ marginTop: 8, backgroundColor: '#F0FFF4', borderRadius: 8, padding: 12, borderWidth: 1, borderColor: '#C6F6D5' }}>
              <Text style={{ fontSize: 14, fontWeight: '600', color: '#22543D', marginBottom: 4 }}>🌿 绿色用药推荐</Text>
              {greenDrugs.map((drug: string, i: number) => (
                <Text key={i} style={{ fontSize: 13, color: '#22543D', lineHeight: 20 }}>• {drug}</Text>
              ))}
            </View>
          )}
        </SectionCard>

        <SectionCard title="疫苗接种" icon="💉">{content.vaccination ? <Text style={{ fontSize: 14, color: '#4B5563', lineHeight: 22 }}>{content.vaccination}</Text> : <Text style={{ color: '#9CA3AF' }}>暂无</Text>}</SectionCard>
        <SectionCard title="监测计划" icon="📈">{content.monitoring ? <Text style={{ fontSize: 14, color: '#4B5563', lineHeight: 22 }}>{content.monitoring}</Text> : <Text style={{ color: '#9CA3AF' }}>暂无</Text>}</SectionCard>
        <SectionCard title="应急处理" icon="🚨">{content.emergency ? <Text style={{ fontSize: 14, color: '#4B5563', lineHeight: 22 }}>{content.emergency}</Text> : <Text style={{ color: '#9CA3AF' }}>暂无</Text>}</SectionCard>

        {/* 时间轴 */}
        {timeline.length > 0 && (
          <SectionCard title="执行时间轴" icon="📅">
            {timeline.map((item: any, i: number) => (
              <View key={i} style={{ flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 4 }}>
                <View style={{ width: 48, height: 48, borderRadius: 24, backgroundColor: '#E6F7F3', justifyContent: 'center', alignItems: 'center' }}>
                  <Text style={{ fontSize: 14, fontWeight: '600', color: '#1F5E52' }}>D{item.day}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 14, fontWeight: '500', color: '#111827' }}>{item.action}</Text>
                  {item.responsible && <Text style={{ fontSize: 12, color: '#9CA3AF' }}>责任人：{item.responsible}</Text>}
                </View>
              </View>
            ))}
          </SectionCard>
        )}

        {plan.completionNotes && (
          <View style={styles.card}>
            <Text style={{ fontSize: 14, fontWeight: '600', color: '#111827', marginBottom: 4 }}>完成备注</Text>
            <Text style={{ fontSize: 14, color: '#4B5563', lineHeight: 22 }}>{plan.completionNotes}</Text>
          </View>
        )}
      </ScrollView>

      {/* 底部操作 */}
      {plan.status === 'active' && (
        <View style={{ padding: 16, backgroundColor: '#FFFFFF', borderTopWidth: 1, borderTopColor: '#E5E7EB' }}>
          <View style={{ flexDirection: 'row', gap: 12 }}>
            <TouchableOpacity style={{ flex: 1, ...styles.secondaryButton }} onPress={() => handleAction('complete', '确认已完成该防控预案？')}>
              <Text style={styles.secondaryButtonText}>标记完成</Text>
            </TouchableOpacity>
            <TouchableOpacity style={{ flex: 1, ...styles.secondaryButton, borderColor: '#9CA3AF' }} onPress={() => handleAction('archive', '确认归档该预案？')}>
              <Text style={{ ...styles.secondaryButtonText, color: '#6B7280' }}>归档</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
}
