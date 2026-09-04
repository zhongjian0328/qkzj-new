import { colors } from '../theme';
import React, { useState, useCallback } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Modal } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/UserContext';
import Header from '../components/Header';
import { statisticsApi } from '../services/api';
import { styles } from '../styles';

interface MenuItem {
  title: string;
  subtitle?: string;
  iconName: string;
  iconColor: string;
  onPress: () => void;
  badge?: number;
}

const ProfileScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const { state, logout } = useAuth();
  const user = state.user;
  const [stats, setStats] = useState({ diagnosisCount: 0, successRate: '0%', usageDays: 1 });
  const [logoutModalVisible, setLogoutModalVisible] = useState(false);

  // 获取用户统计数据
  useFocusEffect(useCallback(() => {
    const fetchStats = async () => {
      try {
        const res = await statisticsApi.getDashboard();
        const d = (res as any)?.data;
        if (d) {
          setStats({
            diagnosisCount: d.totalDiagnoses ?? d.diagnosisCount ?? 0,
            successRate: d.successRate != null ? `${d.successRate}%` : '0%',
            usageDays: d.usageDays ?? 1,
          });
        }
      } catch { /* ignore */ }
    };
    fetchStats();
  }, []));

  // 角色标签映射
  const roleLabel: Record<string, string> = {
    FARMER: '养殖户',
    INSTITUTION: '疫控机构',
    STUDENT: '学生',
    TEACHER: '教师',
  };

  const subRoleLabel: Record<string, string> = {
    SMALL: '小散户',
    COOPERATIVE: '合作社',
    ENTERPRISE: '养殖企业',
    RESEARCH_INSTITUTE: '科研院所',
    SERVICE_PROVIDER: '服务商',
    LEARNING_STUDENT: '学习阶段',
    COGNITIVE_INTERN: '认知实习',
    ADVANCED_INTERN: '顶岗实习',
    GENERAL: '通用',
    SPECIALIST: '专科',
    RESEARCHER_GENERAL: '科研导师',
    LAB_RESEARCHER: '实验室研究员',
    MENTOR: '指导教师',
    CLINICAL_TEACHER: '临床教师',
    RESEARCH_TEACHER: '科研导师',
  };

  // 角色差异化菜单配置
  const getRoleMenuItems = (): { group: string; items: MenuItem[] }[] => {
    const commonItems: { group: string; items: MenuItem[] }[] = [
      {
        group: '我的服务',
        items: [
          {
            title: '我的诊断',
            subtitle: '查看诊断历史记录',
            iconName: 'medkit-outline',
            iconColor: colors.primary,
            onPress: () => navigation.navigate('DiagnosisHistory'),
          },
          {
            title: '我的收藏',
            subtitle: '收藏的知识文章',
            iconName: 'heart-outline',
            iconColor: colors.error,
            onPress: () => navigation.navigate('MyFavorites'),
          },
        ],
      },
    ];

    // 角色专属菜单
    const roleSpecific: { group: string; items: MenuItem[] }[] = [];

    if (user?.roleType === 'FARMER') {
      roleSpecific.push({
        group: '生产管理',
        items: [
          {
            title: '批次管理',
            subtitle: '管理养殖批次',
            iconName: 'layers-outline',
            iconColor: colors.warning,
            onPress: () => navigation.navigate('BatchManagement'),
          },
          {
            title: '环境监测',
            subtitle: '查看环境数据与预警',
            iconName: 'thermometer-outline',
            iconColor: colors.info,
            onPress: () => navigation.navigate('EnvironmentRecord'),
          },
          {
            title: '数据统计',
            subtitle: '查看生产数据分析',
            iconName: 'bar-chart-outline',
            iconColor: colors.accent.purple,
            onPress: () => navigation.navigate('Statistics'),
          },
        ],
      });
    }

    if (user?.roleType === 'INSTITUTION') {
      const subRole = user?.subRole;
      if (subRole === 'CDC') {
        roleSpecific.push({
          group: '疫控管理',
          items: [
            {
              title: '疫情热力图',
              subtitle: '实时疫情监测',
              iconName: 'map-outline',
              iconColor: colors.error,
              onPress: () => navigation.navigate('EpidemicHeatmap'),
            },
            {
              title: '流行病学调查',
              subtitle: '管理流调记录',
              iconName: 'clipboard-outline',
              iconColor: colors.info,
              onPress: () => navigation.navigate('SurveyList'),
            },
            {
              title: '异常报警',
              subtitle: '查看环境预警',
              iconName: 'alert-circle-outline',
              iconColor: colors.warning,
              onPress: () => navigation.navigate('EnvironmentAlert'),
            },
          ],
        });
      } else if (subRole === 'RESEARCH_INSTITUTE') {
        roleSpecific.push({
          group: '科研工作',
          items: [
            {
              title: '知识图谱',
              subtitle: '疾病图谱百科',
              iconName: 'git-network-outline',
              iconColor: colors.accent.purple,
              onPress: () => navigation.navigate('KnowledgeGraph'),
            },
            {
              title: '教学案例',
              subtitle: '管理教学案例库',
              iconName: 'book-outline',
              iconColor: colors.info,
              onPress: () => navigation.navigate('TeachingCaseList'),
            },
          ],
        });
      } else if (subRole === 'SERVICE_PROVIDER') {
        roleSpecific.push({
          group: '服务管理',
          items: [
            {
              title: '服务工单',
              subtitle: '管理服务请求',
              iconName: 'document-text-outline',
              iconColor: colors.primary,
              onPress: () => navigation.navigate('TicketList'),
              badge: 3,
            },
            {
              title: '知识库',
              subtitle: '查阅专业知识',
              iconName: 'library-outline',
              iconColor: colors.info,
              onPress: () => navigation.navigate('KnowledgeList'),
            },
          ],
        });
      }
    }

    if (user?.roleType === 'STUDENT') {
      roleSpecific.push({
        group: '学习实践',
        items: [
          {
            title: '实习日志',
            subtitle: '记录实习经历',
            iconName: 'create-outline',
            iconColor: colors.primary,
            onPress: () => navigation.navigate('InternLog'),
          },
          {
            title: '题库测验',
            subtitle: '检验学习成果',
            iconName: 'school-outline',
            iconColor: colors.accent.purple,
            onPress: () => navigation.navigate('QuestionBank'),
          },
          {
            title: '知识图谱',
            subtitle: '疾病图谱百科',
            iconName: 'gitNetwork-outline',
            iconColor: colors.info,
            onPress: () => navigation.navigate('KnowledgeGraph'),
          },
        ],
      });
    }

    if (user?.roleType === 'TEACHER') {
      roleSpecific.push({
        group: '教学管理',
        items: [
          {
            title: '学生管理',
            subtitle: '管理实习生与日志',
            iconName: 'people-outline',
            iconColor: colors.primary,
            onPress: () => navigation.navigate('MentorManagement'),
          },
          {
            title: '教学案例',
            subtitle: '管理教学案例库',
            iconName: 'book-outline',
            iconColor: colors.info,
            onPress: () => navigation.navigate('TeachingCaseList'),
          },
          {
            title: '诊断报告审核',
            subtitle: '批阅学生诊断报告',
            iconName: 'checkmark-done-outline',
            iconColor: colors.warning,
            onPress: () => navigation.navigate('DiagnosisHistory'),
            badge: 12,
          },
        ],
      });
    }

    const accountItems: { group: string; items: MenuItem[] } = {
      group: '账户与设置',
      items: [
        {
          title: '个人信息',
          subtitle: '编辑个人资料',
          iconName: 'person-outline',
          iconColor: colors.textTertiary,
          onPress: () => navigation.navigate('EditProfile'),
        },
        {
          title: '身份认证',
          subtitle: '认证专业身份',
          iconName: 'shield-checkmark-outline',
          iconColor: colors.primary,
          onPress: () => navigation.navigate('AuthCertification', { role: user?.roleType }),
        },
        {
          title: '消息通知',
          subtitle: '查看系统通知',
          iconName: 'notifications-outline',
          iconColor: colors.warning,
          onPress: () => navigation.navigate('Notifications'),
        },
      ],
    };

    return [...commonItems, ...roleSpecific, accountItems];
  };

  const menuGroups = getRoleMenuItems();

  return (
    <View style={styles.container}>
      <Header
        title="我的"
        showBackButton={false}
      />

      <ScrollView contentContainerStyle={[styles.scrollContent, { paddingBottom: 100 }]}>
        {/* 用户信息卡片 */}
        <View style={styles.profileUserCard}>
          <View style={styles.profileUserInfo}>
            <View style={styles.profileUserAvatar}>
              <Ionicons
                name={
                  user?.roleType === 'FARMER' ? 'leaf-outline' :
                  user?.roleType === 'INSTITUTION' ? 'business-outline' :
                  user?.roleType === 'STUDENT' ? 'school-outline' :
                  user?.roleType === 'TEACHER' ? 'person-outline' : 'person-circle-outline'
                }
                size={40}
                color={colors.primary}
              />
            </View>
            <View style={styles.profileUserDetails}>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
                <Text style={styles.profileUserName}>{user?.nickname || '未登录用户'}</Text>
                <View style={{
                  marginLeft: 8,
                  paddingHorizontal: 8,
                  paddingVertical: 2,
                  borderRadius: 10,
                  backgroundColor: colors.primaryLight,
                }}>
                  <Text style={{ fontSize: 12, fontWeight: '500', color: colors.primaryDark }}>
                    {roleLabel[user?.roleType || ''] || '未知'}
                  </Text>
                </View>
              </View>
              {user?.subRole && subRoleLabel[user.subRole] && (
                <Text style={{ fontSize: 12, color: colors.textTertiary, marginBottom: 2 }}>
                  {subRoleLabel[user.subRole]}
                </Text>
              )}
              {user?.phoneNumber && (
                <Text style={{ fontSize: 12, color: colors.textDisabled }}>
                  {user.phoneNumber.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2')}
                </Text>
              )}
            </View>
          </View>
        </View>

        {/* 统计数据区 */}
        <View style={{
          flexDirection: 'row',
          backgroundColor: colors.surface,
          borderRadius: 12,
          padding: 16,
          marginBottom: 16,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.06,
          shadowRadius: 3.84,
          elevation: 2,
        }}>
          {[
            { label: '诊断次数', value: String(stats.diagnosisCount), icon: 'medkit-outline', color: colors.primary },
            { label: '成功率', value: stats.successRate, icon: 'checkmark-circle-outline', color: colors.success },
            { label: '使用天数', value: String(stats.usageDays), icon: 'calendar-outline', color: colors.info },
          ].map((stat, index) => (
            <View key={index} style={{ flex: 1, alignItems: 'center' }}>
              <Ionicons name={stat.icon as any} size={20} color={stat.color} style={{ marginBottom: 4 }} />
              <Text style={{ fontSize: 20, fontWeight: 'bold', color: colors.textPrimary }}>{stat.value}</Text>
              <Text style={{ fontSize: 12, color: colors.textTertiary }}>{stat.label}</Text>
            </View>
          ))}
        </View>

        {/* 菜单区域 */}
        {menuGroups.map((group, groupIndex) => (
          <View key={groupIndex} style={styles.profileMenuSection}>
            <Text style={{
              fontSize: 14,
              fontWeight: '600',
              color: colors.textTertiary,
              marginBottom: 8,
              marginLeft: 4,
            }}>
              {group.group}
            </Text>
            {group.items.map((item, itemIndex) => (
              <TouchableOpacity
                key={itemIndex}
                style={styles.profileMenuItem}
                onPress={item.onPress}
                activeOpacity={0.7}
              >
                <View style={[styles.profileMenuItemIcon, { backgroundColor: item.iconColor + '20' }]}>
                  <Ionicons name={item.iconName as any} size={22} color={item.iconColor} />
                </View>
                <View style={{ flex: 1 }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Text style={styles.profileMenuItemText}>{item.title}</Text>
                    {item.badge && item.badge > 0 && (
                      <View style={{
                        marginLeft: 8,
                        backgroundColor: colors.error,
                        borderRadius: 10,
                        minWidth: 20,
                        height: 20,
                        alignItems: 'center',
                        justifyContent: 'center',
                        paddingHorizontal: 6,
                      }}>
                        <Text style={{ color: colors.surface, fontSize: 11, fontWeight: '600' }}>
                          {item.badge > 99 ? '99+' : item.badge}
                        </Text>
                      </View>
                    )}
                  </View>
                  {item.subtitle && (
                    <Text style={{ fontSize: 12, color: colors.textDisabled, marginTop: 2 }}>{item.subtitle}</Text>
                  )}
                </View>
                <Ionicons name="chevron-forward" size={18} color={colors.textDisabled} />
              </TouchableOpacity>
            ))}
          </View>
        ))}

        {/* 退出登录按钮 */}
        <TouchableOpacity
          style={{
            backgroundColor: colors.surface,
            borderRadius: 12,
            padding: 16,
            marginTop: 8,
            marginBottom: 16,
            alignItems: 'center',
            borderWidth: 1,
            borderColor: colors.errorLight,
          }}
          onPress={() => setLogoutModalVisible(true)}
          activeOpacity={0.7}
        >
          <Text style={{ fontSize: 16, fontWeight: '600', color: colors.error }}>退出登录</Text>
        </TouchableOpacity>

        {/* 版本信息 */}
        <View style={styles.profileVersionInfo}>
          <Text style={styles.profileVersionText}>禽康智检 v2.0.0</Text>
          <Text style={styles.profileCopyrightText}>© 2026 禽康智检 版权所有</Text>
        </View>
      </ScrollView>

      {/* 退出登录确认弹窗 */}
      <Modal
        visible={logoutModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setLogoutModalVisible(false)}
      >
        <View style={{
          flex: 1,
          backgroundColor: 'rgba(0,0,0,0.5)',
          justifyContent: 'flex-end',
        }}>
          <View style={{
            backgroundColor: colors.surface,
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            padding: 24,
            alignItems: 'center',
          }}>
            <View style={{
              width: 56,
              height: 56,
              borderRadius: 28,
              backgroundColor: colors.errorLight,
              justifyContent: 'center',
              alignItems: 'center',
              marginBottom: 16,
            }}>
              <Ionicons name="log-out-outline" size={28} color={colors.error} />
            </View>
            <Text style={{ fontSize: 18, fontWeight: '600', color: colors.textPrimary, marginBottom: 8 }}>
              确认退出登录
            </Text>
            <Text style={{ fontSize: 14, color: colors.textTertiary, textAlign: 'center', marginBottom: 24 }}>
              退出后需要重新登录才能使用APP功能
            </Text>
            <View style={{ flexDirection: 'row', gap: 12, width: '100%' }}>
              <TouchableOpacity
                style={{
                  flex: 1,
                  paddingVertical: 14,
                  borderRadius: 12,
                  backgroundColor: colors.surfaceMuted,
                  alignItems: 'center',
                }}
                onPress={() => setLogoutModalVisible(false)}
              >
                <Text style={{ fontSize: 16, fontWeight: '600', color: colors.textSecondary }}>取消</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  flex: 1,
                  paddingVertical: 14,
                  borderRadius: 12,
                  backgroundColor: colors.error,
                  alignItems: 'center',
                }}
                onPress={() => {
                  setLogoutModalVisible(false);
                  logout();
                }}
              >
                <Text style={{ fontSize: 16, fontWeight: '600', color: colors.surface }}>退出登录</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default ProfileScreen;
