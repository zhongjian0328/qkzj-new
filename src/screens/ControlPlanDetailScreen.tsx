import { colors } from '../theme';
import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import Header from '../components/Header';
import { controlPlanApi } from '../services/api';
import { styles } from '../styles';

const SEVERITY_COLORS: Record<string, string> = { low: colors.success, medium: colors.warning, high: colors.error, critical: colors.errorText };
const SEVERITY_LABELS: Record<string, string> = { low: '低风险', medium: '中风险', high: '高风险', critical: '极高风险' };
const STATUS_LABELS: Record<string, string> = { draft: '草稿', active: '进行中', completed: '已完成', archived: '已归档' };

function SectionCard({ title, iconName, children, defaultOpen = true }: any) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <View style={styles.card}>
      <TouchableOpacity style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }} onPress={() => setOpen(!open)}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <Ionicons name={iconName} size={20} color={colors.primary} />
          <Text style={{ fontSize: 16, fontWeight: '600', color: colors.textPrimary }}>{title}</Text>
        </View>
        <Ionicons name={open ? 'chevron-up' : 'chevron-down'} size={20} color={colors.textTertiary} />
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

  if (loading) return <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}><ActivityIndicator size="large" color={colors.primary} /></View>;
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
          <Text style={{ fontSize: 18, fontWeight: '600', color: colors.textPrimary, marginBottom: 8 }}>{plan.planName}</Text>
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
              backgroundColor: colors.primaryLight,
            }}>
              <Text style={{ fontSize: 12, color: colors.primaryDark }}>{STATUS_LABELS[plan.status]}</Text>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', alignSelf: 'center', gap: 4 }}>
              {plan.generatedBy === 'ai' ? (
                <><Ionicons name="hardware-chip" size={12} color={colors.primary} /><Text style={{ fontSize: 12, color: colors.primary }}>AI生成</Text></>
              ) : (
                <><Ionicons name="create" size={12} color={colors.textTertiary} /><Text style={{ fontSize: 12, color: colors.textTertiary }}>手动创建</Text></>
              )}
            </View>
          </View>
          <Text style={{ fontSize: 12, color: colors.textDisabled, marginTop: 8 }}>
            创建时间：{new Date(plan.createdAt).toLocaleString('zh-CN')}
          </Text>
        </View>

        {/* 8 章节折叠面板 */}
        <SectionCard title="疫情概述" iconName="stats-chart">{content.overview ? <Text style={{ fontSize: 14, color: colors.textSecondary, lineHeight: 22 }}>{content.overview}</Text> : <Text style={{ color: colors.textDisabled }}>暂无</Text>}</SectionCard>
        <SectionCard title="隔离措施" iconName="construct">{content.isolation ? <Text style={{ fontSize: 14, color: colors.textSecondary, lineHeight: 22 }}>{content.isolation}</Text> : <Text style={{ color: colors.textDisabled }}>暂无</Text>}</SectionCard>
        <SectionCard title="消毒方案" iconName="sparkles">{content.disinfection ? <Text style={{ fontSize: 14, color: colors.textSecondary, lineHeight: 22 }}>{content.disinfection}</Text> : <Text style={{ color: colors.textDisabled }}>暂无</Text>}</SectionCard>

        {/* 用药推荐（绿色高亮） */}
        <SectionCard title="用药推荐" iconName="medkit">
          {medications.length > 0 ? medications.map((med: any, i: number) => (
            <View key={i} style={{ backgroundColor: colors.surfaceSoft, borderRadius: 8, padding: 12 }}>
              <Text style={{ fontSize: 14, fontWeight: '600', color: colors.textPrimary }}>{med.drugName}</Text>
              <Text style={{ fontSize: 13, color: colors.textSecondary, marginTop: 4 }}>剂量：{med.dosage}</Text>
              <Text style={{ fontSize: 13, color: colors.textSecondary }}>疗程：{med.duration}</Text>
              {med.note && <Text style={{ fontSize: 13, color: colors.textTertiary, marginTop: 4 }}>备注：{med.note}</Text>}
            </View>
          )) : <Text style={{ color: colors.textDisabled }}>暂无用药推荐</Text>}
          {greenDrugs.length > 0 && (
            <View style={{ marginTop: 8, backgroundColor: colors.successLight, borderRadius: 8, padding: 12, borderWidth: 1, borderColor: colors.successLight }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 4 }}>
                <Ionicons name="leaf" size={16} color={colors.successText} />
                <Text style={{ fontSize: 14, fontWeight: '600', color: colors.successText }}>绿色用药推荐</Text>
              </View>
              {greenDrugs.map((drug: string, i: number) => (
                <Text key={i} style={{ fontSize: 13, color: colors.successText, lineHeight: 20 }}>• {drug}</Text>
              ))}
            </View>
          )}
        </SectionCard>

        <SectionCard title="疫苗接种" iconName="fitness">{content.vaccination ? <Text style={{ fontSize: 14, color: colors.textSecondary, lineHeight: 22 }}>{content.vaccination}</Text> : <Text style={{ color: colors.textDisabled }}>暂无</Text>}</SectionCard>
        <SectionCard title="监测计划" iconName="trending-up">{content.monitoring ? <Text style={{ fontSize: 14, color: colors.textSecondary, lineHeight: 22 }}>{content.monitoring}</Text> : <Text style={{ color: colors.textDisabled }}>暂无</Text>}</SectionCard>
        <SectionCard title="应急处理" iconName="warning">{content.emergency ? <Text style={{ fontSize: 14, color: colors.textSecondary, lineHeight: 22 }}>{content.emergency}</Text> : <Text style={{ color: colors.textDisabled }}>暂无</Text>}</SectionCard>

        {/* 时间轴 */}
        {timeline.length > 0 && (
          <SectionCard title="执行时间轴" iconName="calendar">
            {timeline.map((item: any, i: number) => (
              <View key={i} style={{ flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 4 }}>
                <View style={{ width: 48, height: 48, borderRadius: 24, backgroundColor: colors.primaryLight, justifyContent: 'center', alignItems: 'center' }}>
                  <Text style={{ fontSize: 14, fontWeight: '600', color: colors.primaryDark }}>D{item.day}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 14, fontWeight: '500', color: colors.textPrimary }}>{item.action}</Text>
                  {item.responsible && <Text style={{ fontSize: 12, color: colors.textDisabled }}>责任人：{item.responsible}</Text>}
                </View>
              </View>
            ))}
          </SectionCard>
        )}

        {plan.completionNotes && (
          <View style={styles.card}>
            <Text style={{ fontSize: 14, fontWeight: '600', color: colors.textPrimary, marginBottom: 4 }}>完成备注</Text>
            <Text style={{ fontSize: 14, color: colors.textSecondary, lineHeight: 22 }}>{plan.completionNotes}</Text>
          </View>
        )}
      </ScrollView>

      {/* 底部操作 */}
      {plan.status === 'active' && (
        <View style={{ padding: 16, backgroundColor: colors.surface, borderTopWidth: 1, borderTopColor: colors.border }}>
          <View style={{ flexDirection: 'row', gap: 12 }}>
            <TouchableOpacity style={{ flex: 1, ...styles.secondaryButton }} onPress={() => handleAction('complete', '确认已完成该防控预案？')}>
              <Text style={styles.secondaryButtonText}>标记完成</Text>
            </TouchableOpacity>
            <TouchableOpacity style={{ flex: 1, ...styles.secondaryButton, borderColor: colors.textDisabled }} onPress={() => handleAction('archive', '确认归档该预案？')}>
              <Text style={{ ...styles.secondaryButtonText, color: colors.textTertiary }}>归档</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
}
