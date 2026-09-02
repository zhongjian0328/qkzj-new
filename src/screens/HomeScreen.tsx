import React, { useState, useCallback } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import Header from '../components/Header';
import { useAuth } from '../context/UserContext';
import { styles } from '../styles';
import { notificationApi } from '../services/api';

const HomeScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const { state } = useAuth();
  const user = state.user;
  const [unreadCount, setUnreadCount] = useState(0);

  const fetchUnreadCount = useCallback(async () => {
    try {
      const res = await notificationApi.getUnreadCount();
      setUnreadCount(res?.data?.count ?? 0);
    } catch (e) {
      console.error('获取未读通知数量失败:', e);
    }
  }, []);

  useFocusEffect(useCallback(() => {
    fetchUnreadCount();
  }, [fetchUnreadCount]));

  // 根据角色获取首页配置
  const getHomeConfig = () => {
    if (!user) {
      return {
        title: '禽康智检',
        welcomeText: '欢迎使用禽康智检',
        sections: []
      };
    }

    switch (user.roleType) {
      case 'FARMER':
        return {
          title: '禽康智检',
          welcomeText: `欢迎，${user.nickname}`,
          sections: [
            {
              title: 'AI诊断',
              icon: 'medical-outline',
              backgroundColor: '#E6F7F3',
              items: [
                {
                  id: 'chat-diagnosis',
                  title: '对话问诊',
                  description: '直接描述症状，获取初步诊断',
                  icon: 'chatbubbles-outline',
                  navigation: 'ChatDiagnosis'
                },
                {
                  id: 'veterinary-diagnosis',
                  title: 'AI兽医诊断',
                  description: '标准化流程，分阶段诊断',
                  icon: 'medical-outline',
                  navigation: 'VeterinaryDiagnosis'
                },
                {
                  id: 'diagnosis-history',
                  title: '诊断历史',
                  description: '查看历史诊断记录',
                  icon: 'document-text-outline',
                  navigation: 'DiagnosisHistory'
                }
              ]
            },
            {
              title: '防控管理',
              icon: 'shield-checkmark-outline',
              backgroundColor: '#FEF3C7',
              items: [
                {
                  id: 'control-plan-list',
                  title: '防控预案',
                  description: '生成和管理防控预案',
                  icon: 'shield-outline',
                  navigation: 'ControlPlanList'
                },
                {
                  id: 'follow-up-list',
                  title: '回访管理',
                  description: '随访记录与效果评估',
                  icon: 'time-outline',
                  navigation: 'FollowUpList'
                }
              ]
            },
            {
              title: '生产管理',
              icon: 'bar-chart-outline',
              backgroundColor: '#EBF5FF',
              items: [
                {
                  id: 'production-management',
                  title: '生产管理',
                  description: '批次管理、死淘率分析',
                  icon: 'clipboard-outline',
                  navigation: 'ProductionManagement'
                },
                {
                  id: 'batch-management',
                  title: '批次管理',
                  description: '创建和管理养殖批次',
                  icon: 'pricetag-outline',
                  navigation: 'BatchManagement'
                },
                {
                  id: 'statistics',
                  title: '数据统计',
                  description: '生产数据统计与分析',
                  icon: 'trending-up-outline',
                  navigation: 'Statistics'
                },
                {
                  id: 'environment-record',
                  title: '环境监测',
                  description: '环境数据记录与预警',
                  icon: 'thermometer-outline',
                  navigation: 'EnvironmentRecord'
                }
              ]
            },
            {
              title: '知识与服务',
              icon: 'book-outline',
              backgroundColor: '#F3E8FF',
              items: [
                {
                  id: 'knowledge-list',
                  title: '知识库',
                  description: '禽病防控知识文章',
                  icon: 'book-outline',
                  navigation: 'KnowledgeList'
                },
                {
                  id: 'ticket-list',
                  title: '服务工单',
                  description: '提交和查看服务工单',
                  icon: 'create-outline',
                  navigation: 'TicketList'
                },
                {
                  id: 'notifications',
                  title: '消息通知',
                  description: '系统通知与预警消息',
                  icon: 'notifications-outline',
                  navigation: 'Notifications'
                }
              ]
            }
          ]
        };
      case 'INSTITUTION':
        return {
          title: '禽康智检',
          welcomeText: `欢迎，${user.nickname}`,
          sections: [
            {
              title: '疫情监测',
              icon: 'shield-checkmark-outline',
              backgroundColor: '#E6F7F3',
              items: [
                {
                  id: 'epidemic-heatmap',
                  title: '疫情热力图',
                  description: '查看疫情分布情况',
                  icon: 'map-outline',
                  navigation: 'EpidemicHeatmap'
                },
                {
                  id: 'abnormal-alerts',
                  title: '异常高发报警',
                  description: '接收疫情异常报警',
                  icon: 'alert-circle-outline',
                  navigation: 'DiagnosisHome'
                },
                {
                  id: 'statistics',
                  title: '数据统计',
                  description: '疫情数据分析报告',
                  icon: 'pie-chart-outline',
                  navigation: 'Statistics'
                },
                {
                  id: 'survey-list',
                  title: '流行病学调查',
                  description: '流调记录管理与分析',
                  icon: 'clipboard-outline',
                  navigation: 'SurveyList'
                }
              ]
            },
            {
              title: '诊断管理',
              icon: 'stethoscope-outline',
              backgroundColor: '#EBF5FF',
              items: [
                {
                  id: 'diagnosis-history',
                  title: '诊断历史',
                  description: '查看诊断记录',
                  icon: 'document-text-outline',
                  navigation: 'DiagnosisHistory'
                },
                {
                  id: 'report-audit',
                  title: '报告审核',
                  description: '审核诊断报告',
                  icon: 'checkmark-circle-outline',
                  navigation: 'DiagnosisHome'
                }
              ]
            }
          ]
        };
      case 'STUDENT':
        return {
          title: '禽康智检',
          welcomeText: `欢迎，${user.nickname}`,
          sections: [
            {
              title: '学习资源',
              icon: 'book-outline',
              backgroundColor: '#F3E8FF',
              items: [
                {
                  id: 'pathology-atlas',
                  title: '病理图谱',
                  description: '浏览典型病理图片',
                  icon: 'images-outline',
                  navigation: 'KnowledgeGraph'
                },
                {
                  id: 'knowledge-quiz',
                  title: '知识测验',
                  description: '在线答题，巩固知识',
                  icon: 'school-outline',
                  navigation: 'QuestionBank'
                }
              ]
            },
            {
              title: '实习实践',
              icon: 'flask-outline',
              backgroundColor: '#FEF3C7',
              items: [
                {
                  id: 'simulation-diagnosis',
                  title: '模拟诊断',
                  description: '进行模拟诊断练习',
                  icon: 'medical-outline',
                  navigation: 'VeterinaryDiagnosis'
                },
                {
                  id: 'internship-logs',
                  title: '实习日志',
                  description: '记录实习情况',
                  icon: 'create-outline',
                  navigation: 'InternLog'
                },
                {
                  id: 'mentor-management',
                  title: '导师管理',
                  description: '查看导师和实习项目',
                  icon: 'people-outline',
                  navigation: 'MentorManagement'
                }
              ]
            }
          ]
        };
      case 'TEACHER':
        return {
          title: '禽康智检',
          welcomeText: `欢迎，${user.nickname}`,
          sections: [
            {
              title: '教学管理',
              icon: 'people-outline',
              backgroundColor: '#FFF3E0',
              items: [
                {
                  id: 'mentor-management',
                  title: '导师管理',
                  description: '查看学生和实习项目',
                  icon: 'people-outline',
                  navigation: 'MentorManagement'
                },
                {
                  id: 'internship-logs',
                  title: '实习日志批阅',
                  description: '查看和批阅学生实习日志',
                  icon: 'create-outline',
                  navigation: 'InternLog'
                }
              ]
            },
            {
              title: '学习资源',
              icon: 'book-outline',
              backgroundColor: '#F3E8FF',
              items: [
                {
                  id: 'knowledge-quiz',
                  title: '题库管理',
                  description: '管理题库和知识测验',
                  icon: 'school-outline',
                  navigation: 'QuestionBank'
                },
                {
                  id: 'pathology-atlas',
                  title: '病理图谱',
                  description: '浏览典型病理图片',
                  icon: 'images-outline',
                  navigation: 'KnowledgeGraph'
                }
              ]
            }
          ]
        };
      default:
        return {
          title: '禽康智检',
          welcomeText: `欢迎，${user.nickname}`,
          sections: []
        };
    }
  };

  const homeConfig = getHomeConfig();

  return (
    <View style={styles.container}>
      <Header
        title={homeConfig.title}
        showBackButton={false}
        rightComponent={
          <TouchableOpacity
            style={{ position: 'relative', padding: 8 }}
            onPress={() => navigation.navigate('Notifications')}
            activeOpacity={0.7}
          >
            <Ionicons name="notifications-outline" size={24} color="#1F5E52" />
            {unreadCount > 0 && (
              <View
                style={{
                  position: 'absolute',
                  top: 2,
                  right: 2,
                  minWidth: 16,
                  height: 16,
                  borderRadius: 8,
                  backgroundColor: '#EF4444',
                  justifyContent: 'center',
                  alignItems: 'center',
                  paddingHorizontal: 3,
                }}
              >
                <Text style={{ fontSize: 9, fontWeight: '700', color: '#FFFFFF' }}>
                  {unreadCount > 99 ? '99+' : unreadCount}
                </Text>
              </View>
            )}
          </TouchableOpacity>
        }
      />
      
      <ScrollView contentContainerStyle={[styles.scrollContent, { paddingBottom: 100 }]}>
        {/* 欢迎区域 */}
        <View style={styles.homeWelcomeSection}>
          <View style={styles.homeWelcomeCard}>
            <View style={styles.homeWelcomeContent}>
              <View style={styles.homeWelcomeText}>
                <Text style={styles.homeWelcomeTitle}>{homeConfig.welcomeText}</Text>
                <Text style={styles.homeWelcomeDescription}>
                  {user?.roleType === 'FARMER' ? '开始您的AI诊断之旅' :
                   user?.roleType === 'INSTITUTION' ? '开始您的疫情监测工作' :
                   user?.roleType === 'STUDENT' ? '开始您的学习和实习' :
                   user?.roleType === 'TEACHER' ? '开始您的教学管理工作' :
                   '探索禽康智检的各项功能'}
                </Text>
              </View>
              <View style={styles.homeWelcomeIcon}>
                <Ionicons 
                  name={user?.roleType === 'FARMER' ? 'leaf-outline' :
                   user?.roleType === 'INSTITUTION' ? 'business-outline' :
                   user?.roleType === 'STUDENT' ? 'school-outline' :
                   user?.roleType === 'TEACHER' ? 'people-outline' : 'medical-outline'} 
                  size={48} 
                  color="#1F5E52" 
                />
              </View>
            </View>
          </View>
        </View>
        
        {/* 功能区域 */}
        {homeConfig.sections.map((section, sectionIndex) => (
          <View key={sectionIndex} style={styles.homeSection}>
            <View style={styles.homeSectionHeader}>
              <View style={[styles.homeSectionIcon, { backgroundColor: section.backgroundColor }]}>
                <Ionicons name={section.icon as any} size={24} color="#1F5E52" />
              </View>
              <Text style={styles.homeSectionTitle}>{section.title}</Text>
            </View>
            
            <View style={styles.homeSectionItems}>
              {section.items.map((item) => (
                <TouchableOpacity 
                  key={item.id}
                  style={styles.homeSectionItemCard}
                  onPress={() => navigation.navigate(item.navigation)}
                  activeOpacity={0.95}
                >
                  <View style={styles.homeSectionItemContent}>
                    <View style={styles.homeSectionItemIcon}>
                      <Ionicons name={item.icon as any} size={32} color="#2DBBA1" />
                    </View>
                    <View style={styles.homeSectionItemInfo}>
                      <Text style={styles.homeSectionItemTitle}>{item.title}</Text>
                      <Text style={styles.homeSectionItemDescription}>{item.description}</Text>
                    </View>
                    <View style={styles.homeSectionItemArrow}>
                      <Text style={styles.homeSectionItemArrowText}>→</Text>
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ))}
        
        {/* 公告区域 */}
        <View style={styles.homeAnnouncementSection}>
          <View style={styles.homeAnnouncementCard}>
            <View style={styles.homeAnnouncementContent}>
              <View style={styles.homeAnnouncementIcon}>
                <Ionicons name="megaphone-outline" size={20} color="#1F5E52" />
              </View>
              <View style={styles.homeAnnouncementText}>
                <Text style={styles.homeAnnouncementTitle}>最新公告</Text>
                <Text style={styles.homeAnnouncementDescription}>
                  禽康智检V1.0正式上线，欢迎使用！
                </Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default HomeScreen;
