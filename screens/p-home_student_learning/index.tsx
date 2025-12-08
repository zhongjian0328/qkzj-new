

import React, { useState, useCallback } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, RefreshControl, } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { FontAwesome6 } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import styles from './styles';

interface TaskItem {
  id: string;
  title: string;
  category: string;
  status: 'completed' | 'pending';
  points: number;
}

interface LearningRecord {
  id: string;
  title: string;
  category: string;
  time: string;
  status: string;
  iconColor: string;
  iconName: string;
}

const HomeStudentLearningScreen: React.FC = () => {
  const router = useRouter();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const dailyTasks: TaskItem[] = [
    {
      id: '1',
      title: '学习新城疫病理特征',
      category: '图谱百科',
      status: 'completed',
      points: 10,
    },
    {
      id: '2',
      title: '完成禽病诊断测验',
      category: '题库测验',
      status: 'pending',
      points: 20,
    },
    {
      id: '3',
      title: '复习禽流感预防知识',
      category: '每日一病',
      status: 'pending',
      points: 15,
    },
  ];

  const learningRecords: LearningRecord[] = [
    {
      id: '1',
      title: '禽流感病理特征',
      category: '图谱百科',
      time: '2小时前',
      status: '已完成',
      iconColor: '#3B82F6',
      iconName: 'book',
    },
    {
      id: '2',
      title: '禽病诊断综合测验',
      category: '题库测验',
      time: '昨天',
      status: '85分',
      iconColor: '#10B981',
      iconName: 'list-check',
    },
    {
      id: '3',
      title: '鸡瘟病毒检测方法',
      category: '图谱百科',
      time: '2天前',
      status: '已完成',
      iconColor: '#8B5CF6',
      iconName: 'vial',
    },
  ];

  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    try {
      // 模拟刷新数据
      await new Promise(resolve => setTimeout(resolve, 1000));
    } finally {
      setIsRefreshing(false);
    }
  }, []);

  const handleNotificationPress = useCallback(() => {
    console.log('显示通知列表');
    // TODO: 实现通知功能
  }, []);

  const handleProfilePress = useCallback(() => {
    router.push('/p-user_profile');
  }, [router]);

  const handleKnowledgeGraphPress = useCallback(() => {
    router.push('/p-knowledge_graph');
  }, [router]);

  const handleQuestionBankPress = useCallback(() => {
    router.push('/p-question_bank');
  }, [router]);

  const handleViewAllTasksPress = useCallback(() => {
    console.log('查看全部学习任务');
    // TODO: 跳转到任务列表页面
  }, []);

  const handleViewAllRecordsPress = useCallback(() => {
    console.log('查看全部学习记录');
    // TODO: 跳转到学习记录页面
  }, []);

  const handleTaskPress = useCallback((task: TaskItem) => {
    if (task.status === 'pending') {
      if (task.category === '题库测验') {
        router.push('/p-question_bank');
      } else if (task.category === '每日一病') {
        router.push('/p-knowledge_graph');
      }
    }
  }, [router]);

  const handleLearnMorePress = useCallback(() => {
    router.push('/p-knowledge_graph');
  }, [router]);

  const handleRecordPress = useCallback((record: LearningRecord) => {
    if (record.category === '图谱百科') {
      router.push('/p-knowledge_graph');
    } else if (record.category === '题库测验') {
      router.push('/p-question_bank');
    }
  }, [router]);

  const renderTaskItem = useCallback(({ item }: { item: TaskItem }) => (
    <TouchableOpacity
      style={styles.taskItem}
      onPress={() => handleTaskPress(item)}
      activeOpacity={0.7}
    >
      <View style={styles.taskContent}>
        <View style={styles.taskLeft}>
          <View style={[
            styles.taskCheckbox,
            item.status === 'completed' && styles.taskCheckboxCompleted
          ]}>
            {item.status === 'completed' && (
              <FontAwesome6 name="check" size={12} color="#FFFFFF" />
            )}
          </View>
          <View style={styles.taskInfo}>
            <Text style={styles.taskTitle}>{item.title}</Text>
            <Text style={styles.taskCategory}>
              {item.category} · {item.status === 'completed' ? '已完成' : '待完成'}
            </Text>
          </View>
        </View>
        <Text style={[
          styles.taskPoints,
          item.status === 'completed' && styles.taskPointsCompleted
        ]}>
          +{item.points}分
        </Text>
      </View>
    </TouchableOpacity>
  ), [handleTaskPress]);

  const renderLearningRecord = useCallback(({ item }: { item: LearningRecord }) => (
    <TouchableOpacity
      style={styles.recordItem}
      onPress={() => handleRecordPress(item)}
      activeOpacity={0.7}
    >
      <View style={styles.recordContent}>
        <View style={styles.recordLeft}>
          <View style={[styles.recordIcon, { backgroundColor: `${item.iconColor}20` }]}>
            <FontAwesome6 name={item.iconName} size={16} color={item.iconColor} />
          </View>
          <View style={styles.recordInfo}>
            <Text style={styles.recordTitle}>{item.title}</Text>
            <Text style={styles.recordCategory}>
              {item.category} · {item.time}
            </Text>
          </View>
        </View>
        <Text style={[
          styles.recordStatus,
          item.status === '85分' && styles.recordStatusScore
        ]}>
          {item.status}
        </Text>
      </View>
    </TouchableOpacity>
  ), [handleRecordPress]);

  return (
    <SafeAreaView style={styles.container}>
      {/* 顶部导航栏 */}
      <View style={styles.header}>
        <View style={styles.userInfo}>
          <Image
            source={{ uri: 'https://s.coze.cn/image/n-8vOoX8LDs/' }}
            style={styles.userAvatar}
          />
          <View style={styles.userDetails}>
            <Text style={styles.userGreeting}>早上好，张同学</Text>
            <Text style={styles.userRole}>学习阶段</Text>
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
        contentContainerStyle={styles.scrollContent}
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
        {/* 学习进度概览 */}
        <View style={styles.overviewSection}>
          <LinearGradient
            colors={['#D3F8EE', '#3BCCA5']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.overviewCard}
          >
            <View style={styles.overviewHeader}>
              <View style={styles.overviewTitleContainer}>
                <Text style={styles.overviewTitle}>今日学习进度</Text>
                <Text style={styles.overviewSubtitle}>继续加油，距离目标更近一步</Text>
              </View>
              <View style={styles.progressIcon}>
                <FontAwesome6 name="graduation-cap" size={24} color="#2B6A5A" />
              </View>
            </View>

            {/* 进度条 */}
            <View style={styles.progressSection}>
              <View style={styles.progressHeader}>
                <Text style={styles.progressLabel}>本周完成度</Text>
                <Text style={styles.progressValue}>75%</Text>
              </View>
              <View style={styles.progressBarContainer}>
                <LinearGradient
                  colors={['#3BCCA5', '#2B6A5A']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={[styles.progressBar, { width: '75%' }]}
                />
              </View>
            </View>

            {/* 学习统计 */}
            <View style={styles.learningStats}>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>12</Text>
                <Text style={styles.statLabel}>已学疾病</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>85</Text>
                <Text style={styles.statLabel}>测验得分</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>5</Text>
                <Text style={styles.statLabel}>连续天数</Text>
              </View>
            </View>
          </LinearGradient>
        </View>

        {/* 核心功能区 */}
        <View style={styles.functionsSection}>
          <Text style={styles.sectionTitle}>学习资源</Text>
          <View style={styles.functionsGrid}>
            <TouchableOpacity
              style={styles.functionCard}
              onPress={handleKnowledgeGraphPress}
              activeOpacity={0.7}
            >
              <View style={styles.functionContent}>
                <View style={styles.functionIcon}>
                  <FontAwesome6 name="book-open" size={20} color="#3BCCA5" />
                </View>
                <View style={styles.functionInfo}>
                  <Text style={styles.functionTitle}>图谱百科</Text>
                  <Text style={styles.functionDescription}>浏览病理图谱</Text>
                </View>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.functionCard}
              onPress={handleQuestionBankPress}
              activeOpacity={0.7}
            >
              <View style={styles.functionContent}>
                <View style={styles.functionIcon}>
                  <FontAwesome6 name="circle-question" size={20} color="#3BCCA5" />
                </View>
                <View style={styles.functionInfo}>
                  <Text style={styles.functionTitle}>题库测验</Text>
                  <Text style={styles.functionDescription}>知识闯关测验</Text>
                </View>
              </View>
            </TouchableOpacity>
          </View>
        </View>

        {/* 今日学习任务 */}
        <View style={styles.tasksSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>今日学习任务</Text>
            <TouchableOpacity onPress={handleViewAllTasksPress} activeOpacity={0.7}>
              <Text style={styles.viewAllButton}>查看全部</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.tasksList}>
            {dailyTasks.map((task) => (
              <View key={task.id}>
                {renderTaskItem({ item: task })}
              </View>
            ))}
          </View>
        </View>

        {/* 每日一病科普 */}
        <View style={styles.dailyDiseaseSection}>
          <Text style={styles.sectionTitle}>每日一病</Text>
          <View style={styles.diseaseCard}>
            <View style={styles.diseaseContent}>
              <Image
                source={{ uri: 'https://s.coze.cn/image/9OA2au4GFDY/' }}
                style={styles.diseaseImage}
              />
              <View style={styles.diseaseInfo}>
                <Text style={styles.diseaseName}>新城疫</Text>
                <Text style={styles.diseaseDescription}>
                  新城疫是由新城疫病毒引起的一种高度接触性传染病，主要特征是呼吸困难、下痢、神经症状等。
                </Text>
                <View style={styles.diseaseFooter}>
                  <View style={styles.diseaseStats}>
                    <View style={styles.diseaseStat}>
                      <FontAwesome6 name="eye" size={10} color="#6B7280" />
                      <Text style={styles.diseaseStatText}>1.2k 学习</Text>
                    </View>
                    <View style={styles.diseaseStat}>
                      <FontAwesome6 name="heart" size={10} color="#6B7280" />
                      <Text style={styles.diseaseStatText}>89 收藏</Text>
                    </View>
                  </View>
                  <TouchableOpacity
                    onPress={handleLearnMorePress}
                    activeOpacity={0.7}
                  >
                    <View style={styles.learnMoreButton}>
                      <Text style={styles.learnMoreText}>了解更多</Text>
                      <FontAwesome6 name="arrow-right" size={10} color="#3BCCA5" />
                    </View>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* 学习记录 */}
        <View style={styles.recordsSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>最近学习</Text>
            <TouchableOpacity onPress={handleViewAllRecordsPress} activeOpacity={0.7}>
              <Text style={styles.viewAllButton}>查看全部</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.recordsList}>
            {learningRecords.map((record) => (
              <View key={record.id}>
                {renderLearningRecord({ item: record })}
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default HomeStudentLearningScreen;

