

import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, RefreshControl, } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { FontAwesome6 } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import styles from './styles';

interface InternshipLog {
  id: string;
  title: string;
  date: string;
  status: 'completed' | 'pending';
  statusText: string;
}

const HomeStudentInternshipScreen = () => {
  const router = useRouter();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const internshipLogs: InternshipLog[] = [
    {
      id: 'log001',
      title: '新城疫病例观察',
      date: '2024-01-15',
      status: 'completed',
      statusText: '已批改',
    },
    {
      id: 'log002',
      title: '禽流感诊断实践',
      date: '2024-01-14',
      status: 'pending',
      statusText: '待批改',
    },
    {
      id: 'log003',
      title: '鸡舍环境管理学习',
      date: '2024-01-13',
      status: 'completed',
      statusText: '已批改',
    },
  ];

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      // 模拟刷新数据
      await new Promise(resolve => setTimeout(resolve, 1000));
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleNewLogPress = () => {
    router.push('/p-intern_log_detail');
  };

  const handleMentorCommentPress = () => {
    router.push('/p-intern_log_detail?logId=log001');
  };

  const handleLogItemPress = (logId: string) => {
    router.push(`/p-intern_log_detail?logId=${logId}`);
  };

  const handleViewAllLogsPress = () => {
    router.push('/p-intern_log_list');
  };

  const handleProfilePress = () => {
    router.push('/p-user_profile');
  };

  const handleNotificationPress = () => {
    console.log('显示通知列表');
  };

  const handleContactMentorPress = () => {
    console.log('需要调用第三方接口实现联系导师功能');
  };

  const renderLogItem = (log: InternshipLog) => (
    <TouchableOpacity
      key={log.id}
      style={styles.logItem}
      onPress={() => handleLogItemPress(log.id)}
      activeOpacity={0.7}
    >
      <View style={styles.logItemContent}>
        <View style={styles.logItemLeft}>
          <View style={[
            styles.logItemIcon,
            log.status === 'completed' ? styles.logItemIconCompleted : styles.logItemIconPending
          ]}>
            <FontAwesome6
              name={log.status === 'completed' ? 'check' : 'clock'}
              size={16}
              color={log.status === 'completed' ? '#10B981' : '#3B82F6'}
            />
          </View>
          <View style={styles.logItemInfo}>
            <Text style={styles.logItemTitle}>{log.title}</Text>
            <Text style={styles.logItemDate}>{log.date}</Text>
            <Text style={[
              styles.logItemStatus,
              log.status === 'completed' ? styles.logItemStatusCompleted : styles.logItemStatusPending
            ]}>
              {log.statusText}
            </Text>
          </View>
        </View>
        <View style={styles.logItemRight}>
          <View style={[
            styles.logItemIndicator,
            log.status === 'completed' ? styles.logItemIndicatorCompleted : styles.logItemIndicatorPending
          ]} />
          <FontAwesome6 name="chevron-right" size={14} color="#6B7280" />
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* 顶部导航栏 */}
      <View style={styles.header}>
        <View style={styles.userInfo}>
          <Image
            source={{ uri: 'https://s.coze.cn/image/sSQuYH2cEMo/' }}
            style={styles.userAvatar}
          />
          <View>
            <Text style={styles.userGreeting}>早上好，张同学</Text>
            <Text style={styles.userRole}>顶岗实习</Text>
          </View>
        </View>
        <View style={styles.headerActions}>
          <TouchableOpacity
            style={styles.notificationButton}
            onPress={handleNotificationPress}
            activeOpacity={0.7}
          >
            <FontAwesome6 name="bell" size={20} color="#6B7280" />
            <View style={styles.notificationBadge} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.profileButton}
            onPress={handleProfilePress}
            activeOpacity={0.7}
          >
            <FontAwesome6 name="circle-user" size={20} color="#6B7280" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollViewContent}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={handleRefresh}
            colors={['#3BCCA5']}
            tintColor="#3BCCA5"
          />
        }
        showsVerticalScrollIndicator={false}
      >
        {/* 导师批注提醒 */}
        <View style={styles.mentorNotificationSection}>
          <TouchableOpacity
            style={styles.mentorCommentCard}
            onPress={handleMentorCommentPress}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={['#FF6B6B', '#FF8E8E']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.mentorCommentGradient}
            >
              <View style={styles.mentorCommentContent}>
                <View style={styles.mentorCommentLeft}>
                  <View style={styles.mentorCommentIcon}>
                    <FontAwesome6 name="comment-dots" size={18} color="#FFFFFF" />
                  </View>
                  <View style={styles.mentorCommentInfo}>
                    <Text style={styles.mentorCommentTitle}>导师新批注</Text>
                    <Text style={styles.mentorCommentDesc}>李教授已批改您的实习日志</Text>
                    <Text style={styles.mentorCommentTime}>2024-01-15 16:30</Text>
                  </View>
                </View>
                <FontAwesome6 name="chevron-right" size={16} color="rgba(255, 255, 255, 0.6)" />
              </View>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        {/* 核心功能区 */}
        <View style={styles.coreFunctionsSection}>
          <Text style={styles.sectionTitle}>实习管理</Text>
          <View style={styles.functionsGrid}>
            <TouchableOpacity
              style={styles.functionCard}
              onPress={handleNewLogPress}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={['#D3F8EE', '#3BCCA5']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.functionCardGradient}
              >
                <View style={styles.functionCardContent}>
                  <View style={styles.functionCardIcon}>
                    <FontAwesome6 name="plus" size={20} color="#2B6A5A" />
                  </View>
                  <View style={styles.functionCardInfo}>
                    <Text style={styles.functionCardTitle}>新建日志</Text>
                    <Text style={styles.functionCardDesc}>记录今日实习</Text>
                  </View>
                </View>
              </LinearGradient>
            </TouchableOpacity>

            <View style={styles.statisticsCard}>
              <View style={styles.functionCardContent}>
                <View style={styles.statisticsCardIcon}>
                  <FontAwesome6 name="chart-column" size={20} color="#3BCCA5" />
                </View>
                <View style={styles.functionCardInfo}>
                  <Text style={styles.statisticsCardTitle}>实习统计</Text>
                  <Text style={styles.statisticsCardDesc}>已完成 15 天</Text>
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* 实习日志列表 */}
        <View style={styles.internshipLogsSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>实习日志</Text>
            <TouchableOpacity onPress={handleViewAllLogsPress} activeOpacity={0.7}>
              <Text style={styles.viewAllButton}>查看全部</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.logsList}>
            {internshipLogs.map(renderLogItem)}
          </View>
        </View>

        {/* 实习进度 */}
        <View style={styles.internshipProgressSection}>
          <Text style={styles.sectionTitle}>实习进度</Text>
          <View style={styles.progressCard}>
            <View style={styles.progressHeader}>
              <Text style={styles.progressLabel}>实习完成度</Text>
              <Text style={styles.progressValue}>75%</Text>
            </View>
            <View style={styles.progressBarContainer}>
              <View style={styles.progressBarBackground}>
                <View style={styles.progressBarFill} />
              </View>
            </View>
            <View style={styles.progressStats}>
              <View style={styles.progressStatItem}>
                <Text style={styles.progressStatValue}>15</Text>
                <Text style={styles.progressStatLabel}>已完成天数</Text>
              </View>
              <View style={styles.progressStatItem}>
                <Text style={styles.progressStatValueTotal}>20</Text>
                <Text style={styles.progressStatLabel}>总天数</Text>
              </View>
              <View style={styles.progressStatItem}>
                <Text style={styles.progressStatValueAccent}>5</Text>
                <Text style={styles.progressStatLabel}>剩余天数</Text>
              </View>
            </View>
          </View>
        </View>

        {/* 导师信息 */}
        <View style={styles.mentorInfoSection}>
          <Text style={styles.sectionTitle}>指导导师</Text>
          <View style={styles.mentorCard}>
            <View style={styles.mentorCardContent}>
              <Image
                source={{ uri: 'https://s.coze.cn/image/_GFFFvd4ZEk/' }}
                style={styles.mentorAvatar}
              />
              <View style={styles.mentorInfo}>
                <Text style={styles.mentorName}>李教授</Text>
                <Text style={styles.mentorTitle}>动物医学系 副教授</Text>
                <Text style={styles.mentorStudents}>指导学生：12人</Text>
              </View>
              <TouchableOpacity
                style={styles.contactMentorButton}
                onPress={handleContactMentorPress}
                activeOpacity={0.8}
              >
                <Text style={styles.contactMentorButtonText}>联系导师</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default HomeStudentInternshipScreen;

