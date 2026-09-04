import { colors } from '../theme';
import React, { useState, useCallback } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import Header from '../components/Header';
import { useAuth } from '../context/UserContext';
import { styles } from '../styles';
import { notificationApi, aiDiagnosisApi, internshipApi } from '../services/api';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_GAP = 12;
const GRID_ITEM_WIDTH = (SCREEN_WIDTH - 32 - CARD_GAP) / 2;

const HomeScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const { state } = useAuth();
  const user = state.user;
  const [unreadCount, setUnreadCount] = useState(0);
  const [recentDiagnoses, setRecentDiagnoses] = useState<any[]>([]);
  const [recentLogs, setRecentLogs] = useState<any[]>([]);

  const fetchData = useCallback(async () => {
    try {
      const res = await notificationApi.getUnreadCount();
      setUnreadCount(res?.data?.count ?? 0);
    } catch (e) { /* ignore */ }

    if (user?.roleType === 'FARMER') {
      try {
        const res = await aiDiagnosisApi.getDiagnosisHistory({ page: 1, limit: 3 });
        setRecentDiagnoses(res?.data?.diagnosisRecords ?? []);
      } catch (e) { /* ignore */ }
    }

    if (user?.roleType === 'STUDENT' && user?.subRole !== 'LEARNING_STUDENT') {
      try {
        const res = await internshipApi.getInternLogs({ page: 1, limit: 3 });
        setRecentLogs(res?.data?.logs ?? res?.data ?? []);
      } catch (e) { /* ignore */ }
    }
  }, [user?.roleType, user?.subRole]);

  useFocusEffect(useCallback(() => {
    fetchData();
  }, [fetchData]));

  // ==================== 通用组件 ====================
  const renderNotificationIcon = () => (
    <TouchableOpacity style={{ position: 'relative', padding: 8 }} onPress={() => navigation.navigate('Notifications')} activeOpacity={0.7}>
      <Ionicons name="notifications-outline" size={24} color={colors.primaryDark} />
      {unreadCount > 0 && (
        <View style={{ position: 'absolute', top: 2, right: 2, minWidth: 16, height: 16, borderRadius: 8, backgroundColor: colors.error, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 3 }}>
          <Text style={{ fontSize: 9, fontWeight: '700', color: colors.surface }}>{unreadCount > 99 ? '99+' : unreadCount}</Text>
        </View>
      )}
    </TouchableOpacity>
  );

  const renderSectionHeader = (title: string, actionText?: string, actionNav?: string) => (
    <View style={styles.homeSectionHeaderRow}>
      <Text style={styles.homeSectionHeaderTitle}>{title}</Text>
      {actionText && actionNav && (
        <TouchableOpacity onPress={() => navigation.navigate(actionNav)}>
          <Text style={styles.homeSectionHeaderAction}>{actionText}</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  const renderMetricCard = (label: string, value: string, unit: string, icon: React.ReactNode, valueColor: string, sub?: string) => (
    <View style={styles.homeMetricCard}>
      <View style={styles.homeMetricRow}>
        <Text style={styles.homeMetricLabel}>{label}</Text>
        {icon}
      </View>
      <View style={{ flexDirection: 'row', alignItems: 'baseline' }}>
        <Text style={[styles.homeMetricValue, { color: valueColor }]}>{value}</Text>
        <Text style={styles.homeMetricUnit}>{unit}</Text>
      </View>
      {sub ? <Text style={styles.homeMetricSub}>{sub}</Text> : null}
    </View>
  );

  const renderGridCard = (title: string, desc: string, icon: React.ReactNode, onPress: string) => (
    <TouchableOpacity activeOpacity={0.95} style={[styles.homeGridCard, { width: GRID_ITEM_WIDTH }]} onPress={() => navigation.navigate(onPress)}>
      <View style={styles.homeGridIconWrap}>{icon}</View>
      <View style={{ flex: 1 }}>
        <Text style={styles.homeGridTitle}>{title}</Text>
        <Text style={styles.homeGridDesc}>{desc}</Text>
      </View>
    </TouchableOpacity>
  );

  const renderAlertCard = (title: string, desc: string, time: string, level: 'high' | 'medium' | 'low', icon: React.ReactNode) => {
    const borderColor = level === 'high' ? colors.error : level === 'medium' ? colors.warning : colors.info;
    const badgeBg = level === 'high' ? colors.errorLight : level === 'medium' ? colors.warningLight : colors.infoLight;
    const badgeText = level === 'high' ? colors.errorText : level === 'medium' ? colors.warningText : colors.infoText;
    const label = level === 'high' ? '高风险' : level === 'medium' ? '中风险' : '低风险';
    return (
      <View style={[styles.homeAlertCard, { borderLeftColor: borderColor, marginBottom: 12 }]}>
        <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
          <View style={{ marginRight: 12 }}>{icon}</View>
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 15, fontWeight: '600', color: colors.primaryDark, marginBottom: 2 }}>{title}</Text>
            <Text style={{ fontSize: 13, color: colors.textSecondary }}>{desc}</Text>
            <Text style={{ fontSize: 12, color: colors.textTertiary, marginTop: 2 }}>{time}</Text>
          </View>
        </View>
        <View style={{ backgroundColor: badgeBg, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12 }}>
          <Text style={{ fontSize: 12, color: badgeText, fontWeight: '600' }}>{label}</Text>
        </View>
      </View>
    );
  };

  const renderTaskCard = (title: string, desc: string, status: 'completed' | 'in_progress' | 'pending') => {
    const statusBg = status === 'completed' ? colors.successLight : status === 'in_progress' ? colors.warningLight : colors.surfaceMuted;
    const statusText = status === 'completed' ? '已完成' : status === 'in_progress' ? '进行中' : '待完成';
    const statusTextColor = status === 'completed' ? colors.successText : status === 'in_progress' ? colors.warningText : colors.textSecondary;
    return (
      <View style={[styles.homeTaskCard, { marginBottom: 12 }]}>
        <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
          <View style={[styles.homeTaskCircle, { borderColor: status === 'completed' ? colors.success : colors.borderStrong }]}>
            {status === 'completed' && <View style={{ width: 12, height: 12, borderRadius: 6, backgroundColor: colors.success }} />}
          </View>
          <View style={{ marginLeft: 12, flex: 1 }}>
            <Text style={{ fontSize: 15, fontWeight: '500', color: colors.primaryDark }}>{title}</Text>
            <Text style={{ fontSize: 13, color: colors.textSecondary, marginTop: 2 }}>{desc}</Text>
          </View>
        </View>
        <View style={{ backgroundColor: statusBg, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12 }}>
          <Text style={{ fontSize: 12, fontWeight: '600', color: statusTextColor }}>{statusText}</Text>
        </View>
      </View>
    );
  };

  const renderInfoCard = (title: string, sub: string, time: string, badge?: { text: string; bg: string; color: string }, confidenceBadge?: { text: string; bg: string; color: string }) => (
    <View style={[styles.homeInfoCard, { marginBottom: 12 }]}>
      <View style={styles.homeInfoCardRow}>
        <View style={{ flex: 1 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
            <Text style={styles.homeInfoTitle}>{title}</Text>
            <View style={{ flexDirection: 'row', gap: 4 }}>
              {confidenceBadge && (
                <View style={{ backgroundColor: confidenceBadge.bg, paddingHorizontal: 6, paddingVertical: 3, borderRadius: 8 }}>
                  <Text style={{ fontSize: 11, color: confidenceBadge.color, fontWeight: '600' }}>{confidenceBadge.text}</Text>
                </View>
              )}
              {badge && (
                <View style={{ backgroundColor: badge.bg, paddingHorizontal: 8, paddingVertical: 3, borderRadius: 12 }}>
                  <Text style={{ fontSize: 12, color: badge.color, fontWeight: '600' }}>{badge.text}</Text>
                </View>
              )}
            </View>
          </View>
          <Text style={styles.homeInfoSub}>{sub}</Text>
          <Text style={styles.homeInfoTime}>{time}</Text>
        </View>
      </View>
    </View>
  );

  const renderStats3Col = (items: { label: string; value: string; icon: React.ReactNode; color: string }[]) => (
    <View style={styles.homeStats3Col}>
      {items.map((item, i) => (
        <View key={i} style={styles.homeStats3Card}>
          <View style={[styles.homeStats3IconWrap, { backgroundColor: `${item.color}15` }]}>{item.icon}</View>
          <Text style={[styles.homeStats3Value, { color: item.color }]}>{item.value}</Text>
          <Text style={styles.homeStats3Label}>{item.label}</Text>
        </View>
      ))}
    </View>
  );

  // ==================== 8种首页布局 ====================

  const renderFarmerSmall = () => (
    <>
      {/* AI诊断CTA */}
      <TouchableOpacity
        activeOpacity={0.95}
        onPress={() => navigation.navigate('ChatDiagnosis')}
        style={{
          borderRadius: 16, padding: 24, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
          marginBottom: 16, backgroundColor: colors.primary,
          shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 8, elevation: 4,
        }}
      >
        <View style={{ flex: 1 }}>
          <Text style={{ fontSize: 20, fontWeight: 'bold', color: colors.surface, marginBottom: 6 }}>AI智能诊断</Text>
          <Text style={{ fontSize: 14, color: 'rgba(255,255,255,0.85)' }}>拍照上传，快速诊断禽病</Text>
        </View>
        <View style={{ width: 64, height: 64, borderRadius: 32, backgroundColor: 'rgba(255,255,255,0.3)', justifyContent: 'center', alignItems: 'center' }}>
          <Ionicons name="fitness-outline" size={28} color={colors.primaryDark} />
        </View>
      </TouchableOpacity>

      {/* 2x2功能网格 */}
      {renderSectionHeader('核心功能')}
      <View style={styles.homeGrid2x2}>
        {renderGridCard('防控预案', '查看推荐方案', <Ionicons name="shield-outline" size={22} color={colors.primary} />, 'ControlPlanList')}
        {renderGridCard('知识百科', '学习养殖知识', <Ionicons name="book-outline" size={22} color={colors.primary} />, 'KnowledgeList')}
        {renderGridCard('疫情监测', '实时疫情信息', <Ionicons name="map-outline" size={22} color={colors.primary} />, 'EpidemicHeatmap')}
        {renderGridCard('在线咨询', '专业兽医咨询', <Ionicons name="chatbubbles-outline" size={22} color={colors.primary} />, 'ChatDiagnosis')}
        {renderGridCard('服务闭环', '全流程追踪', <Ionicons name="repeat-outline" size={22} color={colors.primary} />, 'ServiceCycle')}
      </View>

      {/* 近期诊断 */}
      {recentDiagnoses.length > 0 && (
        <View style={{ marginTop: 24 }}>
          {renderSectionHeader('近期诊断', '查看全部', 'DiagnosisHistory')}
          {recentDiagnoses.slice(0, 3).map((d: any, _i: number) => {
            const confNum = parseFloat(String(d.confidence || '0').replace('%', ''));
            const confValid = !isNaN(confNum) && confNum > 0;
            const confLevel = confValid ? (confNum >= 70 ? 'high' : confNum >= 40 ? 'medium' : 'low') : null;
            const confColor = confLevel === 'high' ? colors.success : confLevel === 'medium' ? colors.warning : colors.error;
            const confBg = confLevel === 'high' ? colors.successLight : confLevel === 'medium' ? colors.warningLight : colors.errorLight;
            const confLabel = confLevel === 'high' ? '高' : confLevel === 'medium' ? '中' : '低';
            return renderInfoCard(
              d.diseaseName || d.diagnosisResult || '诊断记录',
              confValid ? `${confNum}%` : '--%',
              d.createdAt ? new Date(d.createdAt).toLocaleDateString('zh-CN') : '',
              d.status === 'completed' ? { text: '已处理', bg: colors.successLight, color: colors.successText } : { text: '治疗中', bg: colors.infoLight, color: colors.infoText },
              confValid ? { text: confLabel, bg: confBg, color: confColor } : undefined
            );
          })}
        </View>
      )}

      {/* 养殖小贴士 */}
      <View style={{ marginTop: 24 }}>
        {renderSectionHeader('养殖小贴士')}
        <View style={styles.homeInfoCard}>
          <View style={{ flexDirection: 'row' }}>
            <View style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: colors.primaryLight, justifyContent: 'center', alignItems: 'center', marginRight: 12, marginTop: 2 }}>
              <Ionicons name="bulb-outline" size={20} color={colors.primary} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 15, fontWeight: '600', color: colors.primaryDark, marginBottom: 6 }}>冬季禽流感预防</Text>
              <Text style={{ fontSize: 13, color: colors.textSecondary, lineHeight: 20 }}>冬季是禽流感高发期，建议加强鸡舍通风，定期消毒，及时接种疫苗。发现异常症状应立即隔离病禽并进行诊断。</Text>
              <Text style={{ fontSize: 12, color: colors.textTertiary, marginTop: 8 }}>来源：禽康智检知识库</Text>
            </View>
          </View>
        </View>
      </View>

      {/* 快捷服务 */}
      <View style={{ marginTop: 24 }}>
        {renderSectionHeader('快捷服务')}
        <View style={{ flexDirection: 'row', gap: 12 }}>
          {[
            { label: '天气预警', icon: 'cloudy-outline', color: colors.info, nav: 'EnvironmentRecord' },
            { label: '疫情监测', icon: 'alert-circle-outline', color: colors.warning, nav: 'EpidemicHeatmap' },
            { label: '服务工单', icon: 'create-outline', color: colors.accent.purple, nav: 'TicketList' },
          ].map((s, _i) => (
            <TouchableOpacity key={_i} activeOpacity={0.7} style={{ flex: 1, backgroundColor: colors.surface, borderRadius: 12, padding: 16, alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 8, elevation: 3 }} onPress={() => navigation.navigate(s.nav)}>
              <View style={{ width: 48, height: 48, borderRadius: 24, backgroundColor: `${s.color}15`, justifyContent: 'center', alignItems: 'center', marginBottom: 8 }}>
                <Ionicons name={s.icon as any} size={22} color={s.color} />
              </View>
              <Text style={{ fontSize: 13, fontWeight: '500', color: colors.primaryDark }}>{s.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </>
  );

  const renderFarmerEnterprise = () => (
    <>
      {renderSectionHeader('生产数据总览')}
      {/* 4指标卡 */}
      <View style={{ flexDirection: 'row', gap: 12, marginBottom: 16 }}>
        {renderMetricCard('今日死淘', '8', '只', <Ionicons name="trending-down-outline" size={16} color={colors.primary} />, colors.error, '较昨日减少2只')}
      </View>
      <View style={{ flexDirection: 'row', gap: 12, marginBottom: 24 }}>
        {renderMetricCard('疫苗倒计时', '2', '天', <Ionicons name="medkit-outline" size={16} color={colors.primary} />, colors.info, '新城疫疫苗')}
        {renderMetricCard('当前存栏', '15,672', '只', <Ionicons name="layers-outline" size={16} color={colors.primary} />, colors.success, '共5个批次')}
        {renderMetricCard('料肉比', '1.82', ':1', <Ionicons name="analytics-outline" size={16} color={colors.primary} />, colors.accent.purple, '目标: 1.80')}
      </View>

      {/* 死淘率趋势 */}
      <View style={{ backgroundColor: colors.surface, borderRadius: 12, padding: 16, marginBottom: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 8, elevation: 3 }}>
        <Text style={{ fontSize: 16, fontWeight: '600', color: colors.primaryDark, marginBottom: 12 }}>死淘率趋势</Text>
        <View style={{ flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', height: 120 }}>
          {[35, 42, 38, 45, 52, 68, 48].map((h, i) => (
            <View key={i} style={{ flex: 1, alignItems: 'center', marginHorizontal: 2 }}>
              <View style={{ width: '100%', backgroundColor: h > 60 ? colors.error : colors.primary, borderRadius: 4, height: h * 1.2 }} />
              <Text style={{ fontSize: 10, color: colors.textTertiary, marginTop: 4 }}>{['1/10', '1/11', '1/12', '1/13', '1/14', '1/15', '1/16'][i]}</Text>
            </View>
          ))}
        </View>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 8 }}>
          <Text style={{ fontSize: 12, color: colors.textSecondary }}>平均死淘率: 1.8%</Text>
          <Text style={{ fontSize: 12, color: colors.textSecondary }}>目标: ≤2.0%</Text>
        </View>
      </View>

      {/* 快捷功能 */}
      <View style={{ marginTop: 8 }}>
        {renderSectionHeader('快捷功能')}
        <View style={styles.homeGrid2x2}>
          {renderGridCard('批次管理', '管理养殖批次', <Ionicons name="layers-outline" size={22} color={colors.primary} />, 'BatchManagement')}
          {renderGridCard('员工权限', '管理员工权限', <Ionicons name="people-outline" size={22} color={colors.info} />, 'EmployeeManagement')}
          {renderGridCard('数据统计', '查看生产数据', <Ionicons name="pie-chart-outline" size={22} color={colors.accent.purple} />, 'Statistics')}
          {renderGridCard('AI诊断', '快速诊断禽病', <Ionicons name="medical-outline" size={22} color={colors.warning} />, 'VeterinaryDiagnosis')}
        {renderGridCard('服务闭环', '全流程追踪', <Ionicons name="repeat-outline" size={22} color={colors.primary} />, 'ServiceCycle')}
        </View>
      </View>

      {/* 今日任务 */}
      <View style={{ marginTop: 24 }}>
        {renderSectionHeader('今日任务')}
        {renderTaskCard('疫苗接种', '3号鸡舍 - 新城疫疫苗', 'completed')}
        {renderTaskCard('设备检查', '通风系统维护', 'in_progress')}
        {renderTaskCard('数据录入', '各批次死淘耗料记录', 'pending')}
      </View>
    </>
  );

  const renderInstitutionCDC = () => (
    <>
      {renderSectionHeader('疫情概览')}
      {renderStats3Col([
        { label: '今日新增', value: '12', icon: <Ionicons name="alert-circle-outline" size={22} color={colors.error} />, color: colors.error },
        { label: '活跃病例', value: '45', icon: <Ionicons name="time-outline" size={22} color={colors.warning} />, color: colors.warning },
        { label: '已控制', value: '89', icon: <Ionicons name="checkmark-circle-outline" size={22} color={colors.success} />, color: colors.success },
      ])}

      {/* 疫情热力图 */}
      {renderSectionHeader('疫情热力图', '查看详情', 'EpidemicHeatmap')}
      <TouchableOpacity activeOpacity={0.95} onPress={() => navigation.navigate('EpidemicHeatmap')} style={{ backgroundColor: colors.infoLight, borderRadius: 16, height: 180, marginBottom: 24, overflow: 'hidden', position: 'relative', justifyContent: 'center', alignItems: 'center' }}>
        <Ionicons name="map-outline" size={48} color={colors.infoLight} />
        <Text style={{ fontSize: 14, color: colors.info, marginTop: 8 }}>点击查看疫情热力图</Text>
        {/* 简易图例 */}
        <View style={{ position: 'absolute', bottom: 12, left: 12, backgroundColor: 'rgba(255,255,255,0.9)', borderRadius: 8, padding: 8 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
            <View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: colors.error, marginRight: 6 }} />
            <Text style={{ fontSize: 11, color: colors.textSecondary }}>高风险</Text>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
            <View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: colors.warning, marginRight: 6 }} />
            <Text style={{ fontSize: 11, color: colors.textSecondary }}>中风险</Text>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: colors.accent.purple, marginRight: 6 }} />
            <Text style={{ fontSize: 11, color: colors.textSecondary }}>低风险</Text>
          </View>
        </View>
      </TouchableOpacity>

      {/* 异常报警 */}
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
        <Text style={styles.homeSectionHeaderTitle}>异常报警</Text>
        <View style={{ backgroundColor: colors.errorLight, paddingHorizontal: 8, paddingVertical: 3, borderRadius: 12 }}>
          <Text style={{ fontSize: 12, color: colors.errorText, fontWeight: '600' }}>3</Text>
        </View>
      </View>
      {renderAlertCard('新城疫聚集性爆发', 'XX县出现5例确诊病例', '2024-01-15 14:30', 'high',
        <View style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: colors.errorLight, justifyContent: 'center', alignItems: 'center' }}><Ionicons name="alert-circle-outline" size={22} color={colors.error} /></View>
      )}
      {renderAlertCard('禽流感疑似病例', 'XX镇发现异常死亡', '2024-01-15 11:20', 'medium',
        <View style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: colors.warningLight, justifyContent: 'center', alignItems: 'center' }}><Ionicons name="alert-outline" size={22} color={colors.warning} /></View>
      )}
      {renderAlertCard('常规疫情监测', '今日监测数据汇总', '2024-01-15 09:00', 'low',
        <View style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: colors.infoLight, justifyContent: 'center', alignItems: 'center' }}><Ionicons name="information-circle-outline" size={22} color={colors.info} /></View>
      )}

      {/* 快捷功能 */}
      <View style={{ marginTop: 12 }}>
        {renderSectionHeader('快捷功能')}
        <View style={styles.homeGrid2x2}>
          {renderGridCard('报告审核', '审核诊断报告', <Ionicons name="document-text-outline" size={22} color={colors.error} />, 'ReportAudit')}
          {renderGridCard('政策下发', '发布防疫通知', <Ionicons name="megaphone-outline" size={22} color={colors.info} />, 'PolicyPublish')}
          {renderGridCard('流行病学调查', '流调记录管理', <Ionicons name="clipboard-outline" size={22} color={colors.success} />, 'SurveyList')}
          {renderGridCard('数据分析', '深度疫情分析', <Ionicons name="analytics-outline" size={22} color={colors.accent.indigo} />, 'Statistics')}
        </View>
      </View>
    </>
  );

  const renderInstitutionResearch = () => (
    <>
      {renderStats3Col([
        { label: '已标注病例', value: '234', icon: <Ionicons name="create-outline" size={22} color={colors.primary} />, color: colors.primary },
        { label: '科研群组', value: '8', icon: <Ionicons name="people-outline" size={22} color={colors.primary} />, color: colors.primary },
        { label: '协作请求', value: '3', icon: <Ionicons name="mail-outline" size={22} color={colors.primary} />, color: colors.primary },
      ])}

      {/* 核心功能CTA */}
      <TouchableOpacity
        activeOpacity={0.95}
        onPress={() => navigation.navigate('DiagnosisHistory')}
        style={{
          borderRadius: 16, padding: 20, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
          marginBottom: 12, backgroundColor: colors.primary,
          shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 8, elevation: 4,
        }}
      >
        <View style={{ flex: 1 }}>
          <Text style={{ fontSize: 18, fontWeight: 'bold', color: colors.surface, marginBottom: 4 }}>数据标注</Text>
          <Text style={{ fontSize: 14, color: 'rgba(255,255,255,0.85)' }}>标注和管理病例数据</Text>
        </View>
        <View style={{ width: 48, height: 48, borderRadius: 24, backgroundColor: 'rgba(255,255,255,0.3)', justifyContent: 'center', alignItems: 'center' }}>
          <Ionicons name="flask-outline" size={24} color={colors.primaryDark} />
        </View>
      </TouchableOpacity>

      <View style={{ flexDirection: 'row', gap: 12, marginBottom: 24 }}>
        {[
          { title: '病例采集', desc: '采集特殊病例', icon: 'server-outline', nav: 'DiagnosisHistory' },
          { title: '科研协作', desc: '管理科研群组', icon: 'people-outline', nav: 'KnowledgeGraph' },
        ].map((item, i) => (
          <TouchableOpacity key={i} activeOpacity={0.95} style={{ flex: 1, borderRadius: 16, padding: 20, backgroundColor: colors.primary, flexDirection: 'row', alignItems: 'center' }} onPress={() => navigation.navigate(item.nav)}>
            <View style={{ width: 48, height: 48, borderRadius: 24, backgroundColor: 'rgba(255,255,255,0.3)', justifyContent: 'center', alignItems: 'center', marginRight: 12 }}>
              <Ionicons name={item.icon as any} size={24} color={colors.primaryDark} />
            </View>
            <View>
              <Text style={{ fontSize: 16, fontWeight: '600', color: colors.surface }}>{item.title}</Text>
              <Text style={{ fontSize: 13, color: 'rgba(255,255,255,0.85)' }}>{item.desc}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>

      {/* 最近标注病例 */}
      {renderSectionHeader('最近标注病例')}
      {renderInfoCard('新城疫疑似病例', 'AI诊断：新城疫 (95%)', '2小时前标注', { text: '已标注', bg: colors.successLight, color: colors.successText })}
      {renderInfoCard('禽流感确诊病例', 'AI诊断：禽流感 (88%)', '昨天标注', { text: '已标注', bg: colors.successLight, color: colors.successText })}
      {renderInfoCard('传染性支气管炎', 'AI诊断：传染性支气管炎 (92%)', '昨天', { text: '待标注', bg: colors.warningLight, color: colors.warningText })}

      {/* 科研群组 */}
      <View style={{ marginTop: 24 }}>
        {renderSectionHeader('科研群组', '查看全部', 'KnowledgeGraph')}
        {['禽流感研究协作组', '多病原混合感染研究'].map((name, i) => (
          <View key={i} style={{ backgroundColor: colors.surfaceMuted, borderRadius: 12, padding: 14, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <View style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: colors.primaryLight, justifyContent: 'center', alignItems: 'center', marginRight: 12 }}>
                <Ionicons name="people-outline" size={20} color={colors.primary} />
              </View>
              <View>
                <Text style={{ fontSize: 15, fontWeight: '500', color: colors.primaryDark }}>{name}</Text>
                <Text style={{ fontSize: 12, color: colors.textTertiary }}>{[12, 15][i]}名成员</Text>
              </View>
            </View>
            <Ionicons name="chevron-forward-outline" size={18} color={colors.textDisabled} />
          </View>
        ))}
      </View>
    </>
  );

  const renderInstitutionService = () => (
    <>
      {renderSectionHeader('今日概览')}
      <View style={{ flexDirection: 'row', gap: 12, marginBottom: 12 }}>
        {renderMetricCard('今日咨询', '23', '', <Ionicons name="chatbubbles-outline" size={16} color={colors.primary} />, colors.primary, '↑12% 较昨日')}
        {renderMetricCard('待处理订单', '8', '', <Ionicons name="bag-outline" size={16} color={colors.warning} />, colors.warning, '需及时处理')}
      </View>
      <View style={{ flexDirection: 'row', gap: 12, marginBottom: 24 }}>
        {renderMetricCard('活跃客户', '156', '', <Ionicons name="people-outline" size={16} color={colors.info} />, colors.info, '本月新增12人')}
        {renderMetricCard('本月收入', '¥28.5K', '', <Ionicons name="wallet-outline" size={16} color={colors.accent.purple} />, colors.accent.purple, '↑8% 较上月')}
      </View>

      {renderSectionHeader('核心功能')}
      <View style={styles.homeGrid2x2}>
        {renderGridCard('客户管理', '管理客户档案', <Ionicons name="people-outline" size={22} color={colors.info} />, 'EmployeeManagement')}
        {renderGridCard('广告投放', '精准营销推广', <Ionicons name="megaphone-outline" size={22} color={colors.warning} />, 'Notifications')}
        {renderGridCard('在线诊疗', '接单处理咨询', <Ionicons name="videocam-outline" size={22} color={colors.success} />, 'ChatDiagnosis')}
        {renderGridCard('数据分析', '业务数据统计', <Ionicons name="pie-chart-outline" size={22} color={colors.accent.purple} />, 'Statistics')}
      </View>

      {/* 待处理任务 */}
      <View style={{ marginTop: 24 }}>
        {renderSectionHeader('待处理任务', '查看全部', 'TicketList')}
        {renderAlertCard('紧急咨询待回复', '养殖户王老板 - 新城疫诊断咨询', '2小时前', 'high',
          <View style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: colors.errorLight, justifyContent: 'center', alignItems: 'center' }}><Ionicons name="alert-circle-outline" size={22} color={colors.error} /></View>
        )}
        {renderAlertCard('新订单待处理', '养殖合作社 - 兽药采购订单', '4小时前', 'medium',
          <View style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: colors.warningLight, justifyContent: 'center', alignItems: 'center' }}><Ionicons name="cart-outline" size={22} color={colors.warning} /></View>
        )}
        {renderAlertCard('新客户待审核', '张养殖户申请成为会员', '6小时前', 'low',
          <View style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: colors.infoLight, justifyContent: 'center', alignItems: 'center' }}><Ionicons name="person-add-outline" size={22} color={colors.info} /></View>
        )}
      </View>

      {/* 客户活跃度 */}
      <View style={{ marginTop: 24 }}>
        {renderSectionHeader('客户活跃度')}
        <View style={{ backgroundColor: colors.surface, borderRadius: 12, padding: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 8, elevation: 3 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <Text style={{ fontSize: 14, color: colors.textSecondary }}>本周活跃客户</Text>
            <Text style={{ fontSize: 18, fontWeight: '600', color: colors.primaryDark }}>89人</Text>
          </View>
          {[{ day: '周一', pct: 75, val: 15 }, { day: '周二', pct: 90, val: 18 }, { day: '周三', pct: 65, val: 13 }, { day: '周四', pct: 80, val: 16 }, { day: '周五', pct: 95, val: 19 }].map((d, i) => (
            <View key={i} style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
              <Text style={{ fontSize: 13, color: colors.textSecondary, width: 32 }}>{d.day}</Text>
              <View style={styles.homeProgressBar}>
                <View style={[styles.homeProgressFill, { width: `${d.pct}%`, backgroundColor: colors.primary }]} />
              </View>
              <Text style={{ fontSize: 13, fontWeight: '500', color: colors.primaryDark, width: 28, textAlign: 'right' }}>{d.val}</Text>
            </View>
          ))}
        </View>
      </View>
    </>
  );

  // TEACHER/MENTOR - 实习指导为核心
  const renderTeacherMentor = () => (
    <>
      {renderStats3Col([
        { label: '待批改报告', value: '12', icon: <Ionicons name="document-text-outline" size={22} color={colors.primary} />, color: colors.primary },
        { label: '指导学生', value: '45', icon: <Ionicons name="people-outline" size={22} color={colors.primary} />, color: colors.primary },
        { label: '实习组数', value: '5', icon: <Ionicons name="git-branch-outline" size={22} color={colors.primary} />, color: colors.primary },
      ])}

      <View style={{ flexDirection: 'row', gap: 12, marginBottom: 12 }}>
        {[
          { title: '实习管理', desc: '管理实习任务', icon: 'calendar-outline', nav: 'MentorManagement' },
          { title: '学生指导', desc: '查看学生列表', icon: 'school-outline', nav: 'MentorManagement' },
        ].map((item, i) => (
          <TouchableOpacity key={i} activeOpacity={0.95} style={{ flex: 1, borderRadius: 16, padding: 20, backgroundColor: colors.primary, flexDirection: 'row', alignItems: 'center' }} onPress={() => navigation.navigate(item.nav)}>
            <View style={{ width: 48, height: 48, borderRadius: 24, backgroundColor: 'rgba(255,255,255,0.3)', justifyContent: 'center', alignItems: 'center', marginRight: 12 }}>
              <Ionicons name={item.icon as any} size={24} color={colors.primaryDark} />
            </View>
            <View>
              <Text style={{ fontSize: 16, fontWeight: '600', color: colors.surface }}>{item.title}</Text>
              <Text style={{ fontSize: 13, color: 'rgba(255,255,255,0.85)' }}>{item.desc}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>
      <TouchableOpacity activeOpacity={0.95} onPress={() => navigation.navigate('InternLog')}
        style={{ borderRadius: 16, padding: 20, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24, backgroundColor: colors.primary, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 8, elevation: 4 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <View style={{ width: 48, height: 48, borderRadius: 24, backgroundColor: 'rgba(255,255,255,0.3)', justifyContent: 'center', alignItems: 'center', marginRight: 12 }}>
            <Ionicons name="create-outline" size={24} color={colors.primaryDark} />
          </View>
          <View>
            <Text style={{ fontSize: 16, fontWeight: '600', color: colors.surface }}>报告批改</Text>
            <Text style={{ fontSize: 13, color: 'rgba(255,255,255,0.85)' }}>批改学生实习报告</Text>
          </View>
        </View>
      </TouchableOpacity>

      {renderSectionHeader('待办事项')}
      <View style={{ backgroundColor: colors.surface, borderRadius: 12, padding: 16, marginBottom: 24, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 8, elevation: 3 }}>
        {[
          { text: '批改张三的实习报告', sub: '截止日期：明天' },
          { text: '审核李四的实习计划', sub: '截止日期：后天' },
          { text: '召开实习小组会议', sub: '时间：明天 14:00' },
        ].map((todo, i) => (
          <View key={i} style={{ flexDirection: 'row', alignItems: 'flex-start', marginBottom: i < 2 ? 12 : 0 }}>
            <View style={{ width: 20, height: 20, borderRadius: 10, borderWidth: 2, borderColor: colors.borderStrong, marginTop: 2, marginRight: 12 }} />
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 14, color: colors.primaryDark }}>{todo.text}</Text>
              <Text style={{ fontSize: 12, color: colors.textTertiary, marginTop: 2 }}>{todo.sub}</Text>
            </View>
          </View>
        ))}
      </View>

      {renderSectionHeader('最近活动')}
      {[
        { text: '王五提交了实习日志', icon: 'school-outline', time: '2小时前' },
        { text: '赵六提交了实习报告', icon: 'document-text-outline', time: '5小时前' },
      ].map((a, _i) => (
        <View key={_i} style={{ flexDirection: 'row', alignItems: 'flex-start', marginBottom: 12 }}>
          <View style={{ width: 32, height: 32, borderRadius: 16, backgroundColor: colors.primaryLight, justifyContent: 'center', alignItems: 'center', marginRight: 12, marginTop: 2 }}>
            <Ionicons name={a.icon as any} size={16} color={colors.primary} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 14, color: colors.primaryDark }}>{a.text}</Text>
            <Text style={{ fontSize: 12, color: colors.textTertiary, marginTop: 2 }}>{a.time}</Text>
          </View>
        </View>
      ))}
    </>
  );

  // TEACHER/CLINICAL_TEACHER - 临床带教为核心
  const renderTeacherClinical = () => (
    <>
      {renderStats3Col([
        { label: '待批改报告', value: '8', icon: <Ionicons name="document-text-outline" size={22} color={colors.primary} />, color: colors.primary },
        { label: '临床带教', value: '23', icon: <Ionicons name="medkit-outline" size={22} color={colors.primary} />, color: colors.primary },
        { label: '病例讨论', value: '6', icon: <Ionicons name="chatbubbles-outline" size={22} color={colors.primary} />, color: colors.primary },
      ])}

      <View style={{ flexDirection: 'row', gap: 12, marginBottom: 12 }}>
        {[
          { title: '临床带教', desc: '病例诊疗指导', icon: 'medkit-outline', nav: 'MentorManagement' },
          { title: '教学案例', desc: '临床教学资源', icon: 'book-outline', nav: 'TeachingCaseList' },
        ].map((item, i) => (
          <TouchableOpacity key={i} activeOpacity={0.95} style={{ flex: 1, borderRadius: 16, padding: 20, backgroundColor: colors.primary, flexDirection: 'row', alignItems: 'center' }} onPress={() => navigation.navigate(item.nav)}>
            <View style={{ width: 48, height: 48, borderRadius: 24, backgroundColor: 'rgba(255,255,255,0.3)', justifyContent: 'center', alignItems: 'center', marginRight: 12 }}>
              <Ionicons name={item.icon as any} size={24} color={colors.primaryDark} />
            </View>
            <View>
              <Text style={{ fontSize: 16, fontWeight: '600', color: colors.surface }}>{item.title}</Text>
              <Text style={{ fontSize: 13, color: 'rgba(255,255,255,0.85)' }}>{item.desc}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>
      <TouchableOpacity activeOpacity={0.95} onPress={() => navigation.navigate('VeterinaryDiagnosis')}
        style={{ borderRadius: 16, padding: 20, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24, backgroundColor: colors.primary, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 8, elevation: 4 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <View style={{ width: 48, height: 48, borderRadius: 24, backgroundColor: 'rgba(255,255,255,0.3)', justifyContent: 'center', alignItems: 'center', marginRight: 12 }}>
            <Ionicons name="fitness-outline" size={24} color={colors.primaryDark} />
          </View>
          <View>
            <Text style={{ fontSize: 16, fontWeight: '600', color: colors.surface }}>AI诊断演示</Text>
            <Text style={{ fontSize: 13, color: 'rgba(255,255,255,0.85)' }}>临床教学诊断演示</Text>
          </View>
        </View>
      </TouchableOpacity>

      {renderSectionHeader('今日临床任务')}
      {renderTaskCard('带教查房', '3号鸡舍 - 新城疫病例', 'in_progress')}
      {renderTaskCard('病例讨论', '禽流感诊断要点', 'pending')}
    </>
  );

  // TEACHER/RESEARCH_TEACHER - 科研指导为核心
  const renderTeacherResearch = () => (
    <>
      {renderStats3Col([
        { label: '科研课题', value: '3', icon: <Ionicons name="flask-outline" size={22} color={colors.primary} />, color: colors.primary },
        { label: '论文审阅', value: '5', icon: <Ionicons name="document-text-outline" size={22} color={colors.primary} />, color: colors.primary },
        { label: '数据标注', value: '128', icon: <Ionicons name="create-outline" size={22} color={colors.primary} />, color: colors.primary },
      ])}

      <View style={{ flexDirection: 'row', gap: 12, marginBottom: 12 }}>
        {[
          { title: '科研管理', desc: '课题组与项目', icon: 'flask-outline', nav: 'MentorManagement' },
          { title: '数据标注', desc: '病例标注分析', icon: 'create-outline', nav: 'DiagnosisHistory' },
        ].map((item, i) => (
          <TouchableOpacity key={i} activeOpacity={0.95} style={{ flex: 1, borderRadius: 16, padding: 20, backgroundColor: colors.primary, flexDirection: 'row', alignItems: 'center' }} onPress={() => navigation.navigate(item.nav)}>
            <View style={{ width: 48, height: 48, borderRadius: 24, backgroundColor: 'rgba(255,255,255,0.3)', justifyContent: 'center', alignItems: 'center', marginRight: 12 }}>
              <Ionicons name={item.icon as any} size={24} color={colors.primaryDark} />
            </View>
            <View>
              <Text style={{ fontSize: 16, fontWeight: '600', color: colors.surface }}>{item.title}</Text>
              <Text style={{ fontSize: 13, color: 'rgba(255,255,255,0.85)' }}>{item.desc}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>
      <TouchableOpacity activeOpacity={0.95} onPress={() => navigation.navigate('EpidemicHeatmap')}
        style={{ borderRadius: 16, padding: 20, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24, backgroundColor: colors.primary, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 8, elevation: 4 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <View style={{ width: 48, height: 48, borderRadius: 24, backgroundColor: 'rgba(255,255,255,0.3)', justifyContent: 'center', alignItems: 'center', marginRight: 12 }}>
            <Ionicons name="analytics-outline" size={24} color={colors.primaryDark} />
          </View>
          <View>
            <Text style={{ fontSize: 16, fontWeight: '600', color: colors.surface }}>疫情数据分析</Text>
            <Text style={{ fontSize: 13, color: 'rgba(255,255,255,0.85)' }}>区域流行病学统计</Text>
          </View>
        </View>
      </TouchableOpacity>

      {renderSectionHeader('科研动态')}
      {[
        { text: '学生提交论文初稿', icon: 'document-text-outline', time: '3小时前' },
        { text: '数据标注任务完成80%', icon: 'checkmark-circle-outline', time: '昨天' },
      ].map((a, _i) => (
        <View key={_i} style={{ flexDirection: 'row', alignItems: 'flex-start', marginBottom: 12 }}>
          <View style={{ width: 32, height: 32, borderRadius: 16, backgroundColor: colors.primaryLight, justifyContent: 'center', alignItems: 'center', marginRight: 12, marginTop: 2 }}>
            <Ionicons name={a.icon as any} size={16} color={colors.primary} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 14, color: colors.primaryDark }}>{a.text}</Text>
            <Text style={{ fontSize: 12, color: colors.textTertiary, marginTop: 2 }}>{a.time}</Text>
          </View>
        </View>
      ))}
    </>
  );

  const renderStudentInternship = () => (
    <>
      {/* 导师批注提醒 */}
      <TouchableOpacity activeOpacity={0.95} onPress={() => navigation.navigate('InternLog')} style={{ backgroundColor: colors.surface, borderRadius: 12, padding: 16, borderLeftWidth: 4, borderLeftColor: colors.primary, marginBottom: 24, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 8, elevation: 3 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <View style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: colors.primaryLight, justifyContent: 'center', alignItems: 'center', marginRight: 12 }}>
            <Ionicons name="chatbubble-outline" size={20} color={colors.primary} />
          </View>
          <View>
            <Text style={{ fontSize: 15, fontWeight: '600', color: colors.primaryDark }}>导师有新批注</Text>
            <Text style={{ fontSize: 13, color: colors.textSecondary }}>教授已批改您的实习日志</Text>
          </View>
        </View>
        <Ionicons name="chevron-forward-outline" size={18} color={colors.textDisabled} />
      </TouchableOpacity>

      {/* 新建日志CTA */}
      {renderSectionHeader('实习管理')}
      <TouchableOpacity
        activeOpacity={0.95}
        onPress={() => navigation.navigate('InternLog')}
        style={{
          borderRadius: 16, padding: 24, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
          marginBottom: 16, backgroundColor: colors.primary,
          shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 8, elevation: 4,
        }}
      >
        <View style={{ flex: 1 }}>
          <Text style={{ fontSize: 20, fontWeight: 'bold', color: colors.surface, marginBottom: 6 }}>新建实习日志</Text>
          <Text style={{ fontSize: 14, color: 'rgba(255,255,255,0.85)' }}>记录今日实习内容和收获</Text>
        </View>
        <View style={{ width: 64, height: 64, borderRadius: 32, backgroundColor: 'rgba(255,255,255,0.3)', justifyContent: 'center', alignItems: 'center' }}>
          <Ionicons name="add-outline" size={32} color={colors.primaryDark} />
        </View>
      </TouchableOpacity>

      <View style={{ flexDirection: 'row', gap: 12, marginBottom: 24 }}>
        {renderGridCard('日志列表', '查看所有记录', <Ionicons name="list-outline" size={22} color={colors.primary} />, 'InternLog')}
        {renderGridCard('模拟诊断', 'AI诊断练习', <Ionicons name="medical-outline" size={22} color={colors.primary} />, 'VeterinaryDiagnosis')}
      </View>

      {/* 近期日志 */}
      {renderSectionHeader('近期日志', '查看全部', 'InternLog')}
      {recentLogs.length > 0
        ? recentLogs.slice(0, 3).map((log: any, _i: number) => renderInfoCard(
            log.title || '实习日志',
            log.content?.substring(0, 50) || '实习记录',
            log.date || log.createdAt || '',
            log.status === 'reviewed' ? { text: '已批改', bg: colors.successLight, color: colors.successText } : { text: '待批改', bg: colors.infoLight, color: colors.infoText }
          ))
        : <>
            {renderInfoCard('新城疫病例观察', '今日观察了新城疫病例的临床症状...', '2024-01-15', { text: '已批改', bg: colors.successLight, color: colors.successText })}
            {renderInfoCard('禽流感诊断实践', '使用AI诊断系统对禽流感病例...', '2024-01-14', { text: '待批改', bg: colors.infoLight, color: colors.infoText })}
          </>
      }

      {/* 实习统计 */}
      <View style={{ marginTop: 24 }}>
        {renderSectionHeader('实习统计')}
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12 }}>
          {[
            { label: '实习天数', value: '45', icon: 'calendar-outline' },
            { label: '完成日志', value: '28', icon: 'document-text-outline' },
            { label: '平均评分', value: '85', icon: 'star-outline' },
            { label: '完成进度', value: '78%', icon: 'trending-up-outline' },
          ].map((s, _i) => (
            <View key={_i} style={{ width: GRID_ITEM_WIDTH, backgroundColor: colors.surface, borderRadius: 12, padding: 16, alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 8, elevation: 3 }}>
              <View style={{ width: 48, height: 48, borderRadius: 24, backgroundColor: colors.primaryLight, justifyContent: 'center', alignItems: 'center', marginBottom: 8 }}>
                <Ionicons name={s.icon as any} size={22} color={colors.primary} />
              </View>
              <Text style={{ fontSize: 22, fontWeight: 'bold', color: colors.primaryDark }}>{s.value}</Text>
              <Text style={{ fontSize: 13, color: colors.textSecondary }}>{s.label}</Text>
            </View>
          ))}
        </View>
      </View>
    </>
  );

  // STUDENT/ADVANCED_INTERN - 顶岗实习，独立操作为核心
  const renderStudentAdvanced = () => (
    <>
      {/* 导师批注提醒 */}
      <TouchableOpacity activeOpacity={0.95} onPress={() => navigation.navigate('InternLog')} style={{ backgroundColor: colors.surface, borderRadius: 12, padding: 16, borderLeftWidth: 4, borderLeftColor: colors.warning, marginBottom: 24, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 8, elevation: 3 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <View style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: colors.warningLight, justifyContent: 'center', alignItems: 'center', marginRight: 12 }}>
            <Ionicons name="chatbubble-outline" size={20} color={colors.warning} />
          </View>
          <View>
            <Text style={{ fontSize: 15, fontWeight: '600', color: colors.primaryDark }}>导师有新批注</Text>
            <Text style={{ fontSize: 13, color: colors.textSecondary }}>教授已批改您的实习日志</Text>
          </View>
        </View>
        <Ionicons name="chevron-forward-outline" size={18} color={colors.textDisabled} />
      </TouchableOpacity>

      {/* 独立操作CTA */}
      {renderSectionHeader('顶岗实习')}
      <TouchableOpacity
        activeOpacity={0.95}
        onPress={() => navigation.navigate('VeterinaryDiagnosis')}
        style={{
          borderRadius: 16, padding: 24, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
          marginBottom: 16, backgroundColor: colors.warning,
          shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 8, elevation: 4,
        }}
      >
        <View style={{ flex: 1 }}>
          <Text style={{ fontSize: 20, fontWeight: 'bold', color: colors.surface, marginBottom: 6 }}>独立诊断</Text>
          <Text style={{ fontSize: 14, color: 'rgba(255,255,255,0.85)' }}>运用所学知识进行独立诊断</Text>
        </View>
        <View style={{ width: 64, height: 64, borderRadius: 32, backgroundColor: 'rgba(255,255,255,0.3)', justifyContent: 'center', alignItems: 'center' }}>
          <Ionicons name="fitness-outline" size={28} color={colors.primaryDark} />
        </View>
      </TouchableOpacity>

      <View style={{ flexDirection: 'row', gap: 12, marginBottom: 24 }}>
        {renderGridCard('日志列表', '查看所有记录', <Ionicons name="list-outline" size={22} color={colors.primary} />, 'InternLog')}
        {renderGridCard('防控预案', '查看推荐方案', <Ionicons name="shield-outline" size={22} color={colors.primary} />, 'ControlPlanList')}
      </View>

      {/* 近期日志 */}
      {renderSectionHeader('近期日志', '查看全部', 'InternLog')}
      {recentLogs.length > 0
        ? recentLogs.slice(0, 3).map((log: any, _i: number) => renderInfoCard(
            log.title || '实习日志',
            log.content?.substring(0, 50) || '实习记录',
            log.date || log.createdAt || '',
            log.status === 'reviewed' ? { text: '已批改', bg: colors.successLight, color: colors.successText } : { text: '待批改', bg: colors.infoLight, color: colors.infoText }
          ))
        : <>
            {renderInfoCard('独立诊断禽流感', '独立完成了禽流感病例的采样和诊断...', '2024-01-15', { text: '已批改', bg: colors.successLight, color: colors.successText })}
            {renderInfoCard('新城疫防控方案', '根据诊断结果制定防控方案...', '2024-01-14', { text: '待批改', bg: colors.infoLight, color: colors.infoText })}
          </>
      }

      {/* 顶岗统计 */}
      <View style={{ marginTop: 24 }}>
        {renderSectionHeader('顶岗统计')}
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12 }}>
          {[
            { label: '顶岗天数', value: '78', icon: 'calendar-outline' },
            { label: '独立诊断', value: '15', icon: 'medical-outline' },
            { label: '完成日志', value: '42', icon: 'document-text-outline' },
            { label: '平均评分', value: '92', icon: 'star-outline' },
          ].map((s, _i) => (
            <View key={_i} style={{ width: GRID_ITEM_WIDTH, backgroundColor: colors.surface, borderRadius: 12, padding: 16, alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 8, elevation: 3 }}>
              <View style={{ width: 48, height: 48, borderRadius: 24, backgroundColor: colors.warningLight, justifyContent: 'center', alignItems: 'center', marginBottom: 8 }}>
                <Ionicons name={s.icon as any} size={22} color={colors.warning} />
              </View>
              <Text style={{ fontSize: 22, fontWeight: 'bold', color: colors.primaryDark }}>{s.value}</Text>
              <Text style={{ fontSize: 13, color: colors.textSecondary }}>{s.label}</Text>
            </View>
          ))}
        </View>
      </View>
    </>
  );

  const renderStudentLearning = () => (
    <>
      {/* 学习进度概览CTA */}
      <View style={{
        borderRadius: 16, padding: 24, marginBottom: 24, backgroundColor: colors.primary,
        shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 8, elevation: 4,
      }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 20, fontWeight: 'bold', color: colors.surface, marginBottom: 4 }}>本周学习进度</Text>
            <Text style={{ fontSize: 14, color: 'rgba(255,255,255,0.85)' }}>继续加油，距离完成目标还差一点</Text>
          </View>
          <View style={{ width: 64, height: 64, borderRadius: 32, backgroundColor: 'rgba(255,255,255,0.3)', justifyContent: 'center', alignItems: 'center' }}>
            <Ionicons name="school-outline" size={28} color={colors.primaryDark} />
          </View>
        </View>
        {/* 进度条 */}
        <View style={{ marginBottom: 16 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 }}>
            <Text style={{ fontSize: 13, color: 'rgba(255,255,255,0.8)' }}>完成度</Text>
            <Text style={{ fontSize: 13, fontWeight: '600', color: colors.surface }}>75%</Text>
          </View>
          <View style={{ height: 10, backgroundColor: 'rgba(255,255,255,0.3)', borderRadius: 5 }}>
            <View style={{ height: 10, width: '75%', backgroundColor: colors.surface, borderRadius: 5 }} />
          </View>
        </View>
        <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
          {[
            { label: '已学疾病', value: '12' },
            { label: '测验得分', value: '85' },
            { label: '连续天数', value: '3' },
          ].map((s, _i) => (
            <View key={_i} style={{ alignItems: 'center' }}>
              <Text style={{ fontSize: 18, fontWeight: 'bold', color: colors.surface }}>{s.value}</Text>
              <Text style={{ fontSize: 12, color: 'rgba(255,255,255,0.8)' }}>{s.label}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* 学习工具 */}
      {renderSectionHeader('学习工具')}
      <View style={styles.homeGrid2x2}>
        {renderGridCard('图谱百科', '浏览病理图谱', <Ionicons name="book-outline" size={22} color={colors.primary} />, 'KnowledgeGraph')}
        {renderGridCard('题库测验', '知识闯关测验', <Ionicons name="help-circle-outline" size={22} color={colors.primary} />, 'QuestionBank')}
      </View>

      {/* 今日学习任务 */}
      <View style={{ marginTop: 24 }}>
        {renderSectionHeader('今日学习任务')}
        {renderTaskCard('学习新城疫病理特征', '预计用时：15分钟', 'completed')}
        {renderTaskCard('完成禽病诊断测验', '预计用时：20分钟', 'in_progress')}
        {renderTaskCard('复习禽流感防治知识', '预计用时：10分钟', 'pending')}
      </View>

      {/* 每日一病 */}
      <View style={{ marginTop: 24 }}>
        {renderSectionHeader('每日一病')}
        <View style={{ backgroundColor: colors.surface, borderRadius: 12, padding: 16, flexDirection: 'row', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 8, elevation: 3 }}>
          <View style={{ width: 64, height: 64, borderRadius: 12, backgroundColor: colors.primaryLight, justifyContent: 'center', alignItems: 'center', marginRight: 12 }}>
            <Ionicons name="bug-outline" size={28} color={colors.primary} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 15, fontWeight: '600', color: colors.primaryDark, marginBottom: 6 }}>新城疫</Text>
            <Text style={{ fontSize: 13, color: colors.textSecondary, lineHeight: 20, marginBottom: 8 }}>由新城疫病毒引起的急性、高度接触性传染病，主要特征是呼吸困难、下痢、神经症状等。</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
              <Text style={{ fontSize: 12, color: colors.textTertiary }}>1,234人已学习</Text>
              <TouchableOpacity onPress={() => navigation.navigate('KnowledgeGraph')}>
                <Text style={{ fontSize: 14, color: colors.primary, fontWeight: '600' }}>了解更多 →</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>

      {/* 学习记录 */}
      <View style={{ marginTop: 24 }}>
        {renderSectionHeader('学习记录', '查看全部', 'KnowledgeGraph')}
        {[
          { title: '图谱学习', sub: '新城疫病理特征', time: '2024-01-15 10:30', value: '15分钟', icon: 'book-outline', iconColor: colors.info },
          { title: '知识测验', sub: '禽病诊断基础', time: '2024-01-14 15:45', value: '85分', icon: 'trophy-outline', iconColor: colors.success },
        ].map((r, i) => (
          <View key={i} style={{ backgroundColor: colors.surface, borderRadius: 12, padding: 16, marginBottom: 12, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 8, elevation: 3 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
              <View style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: `${r.iconColor}15`, justifyContent: 'center', alignItems: 'center', marginRight: 12 }}>
                <Ionicons name={r.icon as any} size={20} color={r.iconColor} />
              </View>
              <View>
                <Text style={{ fontSize: 15, fontWeight: '500', color: colors.primaryDark }}>{r.title}</Text>
                <Text style={{ fontSize: 13, color: colors.textSecondary }}>{r.sub}</Text>
                <Text style={{ fontSize: 12, color: colors.textTertiary }}>{r.time}</Text>
              </View>
            </View>
            <Text style={{ fontSize: 14, fontWeight: '500', color: colors.primaryDark }}>{r.value}</Text>
          </View>
        ))}
      </View>
    </>
  );

  // ==================== 首页路由分发 ====================
  const getHomeLayout = () => {
    if (!user) return 'default';
    const { roleType, subRole: sr } = user;
    if (roleType === 'FARMER') return sr === 'ENTERPRISE' ? 'farmer-enterprise' : 'farmer-small';
    if (roleType === 'INSTITUTION') {
      if (sr === 'CDC') return 'institution-cdc';
      if (sr === 'RESEARCH_INSTITUTE') return 'institution-research';
      if (sr === 'SERVICE_PROVIDER') return 'institution-service';
      return 'institution-cdc'; // default
    }
    if (roleType === 'TEACHER') {
      if (sr === 'CLINICAL_TEACHER') return 'teacher-clinical';
      if (sr === 'RESEARCH_TEACHER') return 'teacher-research';
      return 'teacher-mentor';
    }
    if (roleType === 'STUDENT') {
      if (sr === 'LEARNING_STUDENT') return 'student-learning';
      if (sr === 'ADVANCED_INTERN') return 'student-advanced';
      return 'student-internship';
    }
    return 'default';
  };

  const roleSubtitle: Record<string, string> = {
    'farmer-small': '小散户',
    'farmer-enterprise': '养殖企业',
    'institution-cdc': '疫控机构',
    'institution-research': '科研院所',
    'institution-service': '服务商',
    'teacher-mentor': '导师',
    'teacher-clinical': '临床教师',
    'teacher-research': '科研教师',
    'student-internship': '认知实习',
    'student-advanced': '顶岗实习',
    'student-learning': '学习阶段',
  };

  const layout = getHomeLayout();

  return (
    <View style={styles.container}>
      <Header
        title="禽康智检"
        showBackButton={false}
        rightComponent={renderNotificationIcon()}
      />
      <ScrollView contentContainerStyle={[styles.scrollContent, { paddingBottom: 100 }]}>
        {/* 欢迎区 */}
        <View style={{ marginBottom: 24 }}>
          <Text style={{ fontSize: 24, fontWeight: 'bold', color: colors.primaryDark, marginBottom: 4 }}>
            {getGreeting()}，{user?.nickname || '用户'}
          </Text>
          <Text style={{ fontSize: 14, color: colors.textSecondary }}>
            {roleSubtitle[layout] || '欢迎使用禽康智检'}
          </Text>
        </View>

        {/* 按布局渲染对应首页 */}
        {layout === 'farmer-small' && renderFarmerSmall()}
        {layout === 'farmer-enterprise' && renderFarmerEnterprise()}
        {layout === 'institution-cdc' && renderInstitutionCDC()}
        {layout === 'institution-research' && renderInstitutionResearch()}
        {layout === 'institution-service' && renderInstitutionService()}
        {layout === 'teacher-mentor' && renderTeacherMentor()}
        {layout === 'teacher-clinical' && renderTeacherClinical()}
        {layout === 'teacher-research' && renderTeacherResearch()}
        {layout === 'student-internship' && renderStudentInternship()}
        {layout === 'student-advanced' && renderStudentAdvanced()}
        {layout === 'student-learning' && renderStudentLearning()}

        {/* 默认布局（未匹配角色时） */}
        {layout === 'default' && (
          <View style={{ alignItems: 'center', marginTop: 40 }}>
            <Ionicons name="home-outline" size={48} color={colors.borderStrong} />
            <Text style={{ fontSize: 16, color: colors.textTertiary, marginTop: 12 }}>欢迎使用禽康智检</Text>
          </View>
        )}

        {/* 公告区 */}
        <View style={{ marginTop: 24 }}>
          <View style={{ backgroundColor: colors.surface, borderRadius: 12, padding: 16, flexDirection: 'row', alignItems: 'center' }}>
            <View style={{ marginRight: 12 }}>
              <Ionicons name="megaphone-outline" size={20} color={colors.primaryDark} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 14, fontWeight: '600', color: colors.primaryDark, marginBottom: 2 }}>最新公告</Text>
              <Text style={{ fontSize: 14, color: colors.textSecondary }}>禽康智检V2.0正式上线，欢迎使用！</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 6) return '凌晨好';
  if (hour < 12) return '早上好';
  if (hour < 14) return '中午好';
  if (hour < 18) return '下午好';
  return '晚上好';
}

export default HomeScreen;
