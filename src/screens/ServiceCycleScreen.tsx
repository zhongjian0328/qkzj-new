import { colors } from '../theme';
import React, { useState, useCallback } from 'react';
import { View, Text, TouchableOpacity, ScrollView, ActivityIndicator, RefreshControl } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import Header from '../components/Header';
import { useAuth } from '../context/UserContext';
import { styles } from '../styles';
import { aiDiagnosisApi, controlPlanApi, followUpApi } from '../services/api';

/** 闭环状态枚举（对齐开发文档5.8.2） */
type CycleStatus = 'alerting' | 'responding' | 'diagnosing' | 'pending_action' | 'executing' | 'following_up' | 'closed' | 'dismissed';

interface CycleItem {
  id: string;
  status: CycleStatus;
  title: string;
  createdAt: string;
  updatedAt: string;
  /** 关联资源ID */
  alertId?: string;
  diagnosisId?: string;
  planId?: string;
  followUpId?: string;
}

const STATUS_CONFIG: Record<CycleStatus, { label: string; color: string; bg: string; icon: string }> = {
  alerting: { label: '预警中', color: colors.error, bg: colors.errorLight, icon: 'alert-circle-outline' },
  responding: { label: '响应中', color: colors.warning, bg: colors.warningLight, icon: 'flash-outline' },
  diagnosing: { label: '诊断中', color: colors.info, bg: colors.infoLight, icon: 'search-outline' },
  pending_action: { label: '待处置', color: colors.accent.purple, bg: colors.accent.indigoLight, icon: 'document-text-outline' },
  executing: { label: '处置中', color: colors.primary, bg: colors.successLight, icon: 'construct-outline' },
  following_up: { label: '回访中', color: colors.accent.cyan, bg: colors.accent.cyanLight, icon: 'chatbubbles-outline' },
  closed: { label: '已结案', color: colors.success, bg: colors.successLight, icon: 'checkmark-circle-outline' },
  dismissed: { label: '已关闭', color: colors.textTertiary, bg: colors.surfaceMuted, icon: 'close-circle-outline' },
};

const ServiceCycleScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const { state } = useAuth();

  const [cycles, setCycles] = useState<CycleItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeFilter, setActiveFilter] = useState<CycleStatus | 'all'>('all');

  /** 聚合闭环数据：从预案+诊断+回访+通知组合闭环视图 */
  const fetchCycles = useCallback(async () => {
    try {
      setLoading(true);
      // 并行获取各环节数据
      const [plansRes, diagnosesRes, followUpsRes] = await Promise.all([
        controlPlanApi.getPlans({ page: 1, limit: 50 }).catch(() => ({ data: { plans: [] } })),
        aiDiagnosisApi.getDiagnosisHistory({ page: 1, limit: 10 }).catch(() => ({ data: { diagnosisRecords: [] } })),
        followUpApi.getFollowUps({ page: 1, limit: 50 }).catch(() => ({ data: { followUps: [] } })),
      ]);

      const plans = (plansRes as any)?.data?.plans || (plansRes as any)?.data || [];
      const diagnoses = (diagnosesRes as any)?.data?.diagnosisRecords || (diagnosesRes as any)?.data || [];
      const followUps = (followUpsRes as any)?.data?.followUps || (followUpsRes as any)?.data || [];

      // 以预案为核心构建闭环条目
      const items: CycleItem[] = plans.map((plan: any) => {
        const followUp = followUps.find((f: any) => f.planId === (plan._id || plan.id));
        let status: CycleStatus = 'pending_action';

        if (plan.status === 'completed' || plan.status === 'archived') {
          status = followUp ? 'closed' : 'executing';
        } else if (plan.status === 'executing') {
          status = followUp ? 'following_up' : 'executing';
        } else if (plan.status === 'generating' || plan.status === 'generated') {
          status = 'pending_action';
        }

        if (followUp && (followUp.status === 'completed')) {
          status = 'closed';
        } else if (followUp && followUp.status === 'pending') {
          status = 'following_up';
        }

        return {
          id: plan._id || plan.id,
          status,
          title: plan.planName || plan.planContent?.conclusion?.disease || '防控预案',
          createdAt: plan.createdAt || new Date().toISOString(),
          updatedAt: plan.updatedAt || plan.completedAt || plan.createdAt,
          planId: plan._id || plan.id,
          diagnosisId: plan.triggerDiagnosisId || plan.diagnosisId,
          followUpId: followUp?._id || followUp?.id,
        };
      });

      // 补充仅有诊断但无预案的条目（诊断中/响应中）
      diagnoses.forEach((d: any) => {
        const hasPlan = plans.some((p: any) => p.triggerDiagnosisId === (d._id || d.id) || p.diagnosisId === (d._id || d.id));
        if (!hasPlan) {
          items.unshift({
            id: `diag-${d._id || d.id}`,
            status: d.status === 'completed' ? 'diagnosing' : 'responding',
            title: d.diseaseName || d.diagnosisResult || '诊断记录',
            createdAt: d.createdAt || new Date().toISOString(),
            updatedAt: d.completedAt || d.createdAt,
            diagnosisId: d._id || d.id,
          });
        }
      });

      // 按更新时间倒序
      items.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
      setCycles(items);
    } catch (e) {
      console.error('获取闭环数据失败:', e);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useFocusEffect(useCallback(() => {
    fetchCycles();
  }, [fetchCycles]));

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchCycles();
  }, [fetchCycles]);

  const filteredCycles = activeFilter === 'all'
    ? cycles
    : cycles.filter(c => c.status === activeFilter);

  const navigateToDetail = (item: CycleItem) => {
    if (item.planId) {
      navigation.navigate('ControlPlanDetail', { planId: item.planId });
    } else if (item.diagnosisId) {
      navigation.navigate('DiagnosisReport', { diagnosisId: item.diagnosisId });
    }
  };

  /** 渲染闭环时间轴小图标 */
  const renderTimelineIcons = (item: CycleItem) => {
    const steps = [
      { key: 'alert', done: !!item.alertId || item.status !== 'responding', icon: 'alert-circle-outline', label: '预警' },
      { key: 'diagnosis', done: !!item.diagnosisId, icon: 'search-outline', label: '诊断' },
      { key: 'plan', done: !!item.planId, icon: 'document-text-outline', label: '预案' },
      { key: 'followup', done: !!item.followUpId, icon: 'chatbubbles-outline', label: '回访' },
    ];

    return (
      <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 8 }}>
        {steps.map((step, i) => (
          <View key={step.key} style={{ flexDirection: 'row', alignItems: 'center' }}>
            <View style={{
              width: 28, height: 28, borderRadius: 14,
              backgroundColor: step.done ? colors.primary : colors.border,
              justifyContent: 'center', alignItems: 'center',
            }}>
              <Ionicons name={step.icon as any} size={14} color={step.done ? colors.surface : colors.textDisabled} />
            </View>
            <Text style={{ fontSize: 10, color: step.done ? colors.primary : colors.textDisabled, marginLeft: 4 }}>{step.label}</Text>
            {i < steps.length - 1 && (
              <View style={{ width: 16, height: 2, backgroundColor: steps[i + 1]?.done ? colors.primary : colors.border, marginHorizontal: 4 }} />
            )}
          </View>
        ))}
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Header title="服务闭环" showBackButton onBack={() => navigation.goBack()} />
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={{ marginTop: 12, color: colors.textTertiary }}>加载中...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header title="服务闭环" showBackButton onBack={() => navigation.goBack()} />
      <ScrollView
        contentContainerStyle={[styles.scrollContent, { paddingBottom: 100 }]}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[colors.primary]} />}
      >
        {/* 闭环说明 */}
        <View style={{ backgroundColor: colors.primaryLight, borderRadius: 12, padding: 16, marginBottom: 16 }}>
          <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
            <Ionicons name="information-circle-outline" size={20} color={colors.primaryDark} style={{ marginRight: 10, marginTop: 2 }} />
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 15, fontWeight: '600', color: colors.primaryDark, marginBottom: 4 }}>全流程服务闭环</Text>
              <Text style={{ fontSize: 13, color: colors.textSecondary, lineHeight: 20 }}>从预警到结案的完整服务链路管理，实现自动预警→极速响应→精准诊断→追踪反馈的全流程可追溯。</Text>
            </View>
          </View>
        </View>

        {/* 状态筛选 */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 16 }}>
          <TouchableOpacity
            style={{ paddingHorizontal: 12, paddingVertical: 6, borderRadius: 16, marginRight: 8, backgroundColor: activeFilter === 'all' ? colors.primary : colors.surfaceMuted }}
            onPress={() => setActiveFilter('all')}
          >
            <Text style={{ fontSize: 13, fontWeight: '500', color: activeFilter === 'all' ? colors.surface : colors.textTertiary }}>全部 ({cycles.length})</Text>
          </TouchableOpacity>
          {Object.entries(STATUS_CONFIG).map(([key, cfg]) => {
            const count = cycles.filter(c => c.status === key).length;
            if (count === 0) return null;
            return (
              <TouchableOpacity
                key={key}
                style={{ paddingHorizontal: 12, paddingVertical: 6, borderRadius: 16, marginRight: 8, backgroundColor: activeFilter === key ? cfg.color : cfg.bg }}
                onPress={() => setActiveFilter(key as CycleStatus)}
              >
                <Text style={{ fontSize: 13, fontWeight: '500', color: activeFilter === key ? colors.surface : cfg.color }}>{cfg.label} ({count})</Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* 闭环列表 */}
        {filteredCycles.length === 0 ? (
          <View style={{ alignItems: 'center', paddingVertical: 64 }}>
            <Ionicons name="checkmark-done-outline" size={48} color={colors.borderStrong} />
            <Text style={{ fontSize: 16, fontWeight: '600', color: colors.textPrimary, marginTop: 12, marginBottom: 8 }}>暂无服务闭环记录</Text>
            <Text style={{ fontSize: 14, color: colors.textTertiary, textAlign: 'center', paddingHorizontal: 32 }}>诊断和防控预案数据将自动汇入服务闭环</Text>
          </View>
        ) : (
          filteredCycles.map((item) => {
            const cfg = STATUS_CONFIG[item.status];
            return (
              <TouchableOpacity
                key={item.id}
                style={{ backgroundColor: colors.surface, borderRadius: 12, padding: 16, marginBottom: 12, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 8, elevation: 3, borderLeftWidth: 4, borderLeftColor: cfg.color }}
                onPress={() => navigateToDetail(item)}
                activeOpacity={0.7}
              >
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                  <Text style={{ fontSize: 16, fontWeight: '600', color: colors.primaryDark, flex: 1 }}>{item.title}</Text>
                  <View style={{ backgroundColor: cfg.bg, paddingHorizontal: 8, paddingVertical: 3, borderRadius: 12 }}>
                    <Text style={{ fontSize: 12, color: cfg.color, fontWeight: '600' }}>{cfg.label}</Text>
                  </View>
                </View>
                <Text style={{ fontSize: 12, color: colors.textDisabled }}>
                  {new Date(item.updatedAt).toLocaleDateString('zh-CN', { month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' })}
                </Text>
                {renderTimelineIcons(item)}
              </TouchableOpacity>
            );
          })
        )}
      </ScrollView>
    </View>
  );
};

export default ServiceCycleScreen;
