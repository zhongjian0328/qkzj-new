

import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, Image, Alert, } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { FontAwesome6 } from '@expo/vector-icons';
import styles from './styles';

interface StudentLog {
  id: string;
  date: string;
  title: string;
  status: 'pending' | 'reviewed' | 'submitted';
  content: string;
}

interface Student {
  id: string;
  name: string;
  group: string;
  logs: number;
  pending: number;
  avatar: string;
  logsData: StudentLog[];
}

const MentorDashboardScreen = () => {
  const router = useRouter();
  
  // 状态管理
  const [currentStudentId, setCurrentStudentId] = useState<string | null>(null);
  const [currentLogId, setCurrentLogId] = useState<string | null>(null);
  const [commentText, setCommentText] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // 模拟数据
  const studentsData: Student[] = [
    {
      id: 'student-001',
      name: '李小明',
      group: '实习组A · 动物医学专业',
      logs: 12,
      pending: 3,
      avatar: 'https://s.coze.cn/image/8f8C9IEjYkw/',
      logsData: [
        {
          id: 'log-001',
          date: '2024-01-15',
          title: '新城疫诊断实习',
          status: 'pending',
          content: '今天在养殖场观察了鸡群的健康状况，发现有几只鸡出现呼吸道症状。通过AI诊断初步判断可能是新城疫，已按照指导进行隔离处理。学习了如何正确采集病料样本。'
        },
        {
          id: 'log-002',
          date: '2024-01-14',
          title: '禽流感预防措施学习',
          status: 'submitted',
          content: '学习了禽流感的预防措施，包括疫苗接种、生物安全管理等。参与了鸡舍消毒工作。'
        },
        {
          id: 'log-003',
          date: '2024-01-13',
          title: '正常',
          status: 'reviewed',
          content: '今天鸡群状况良好，没有发现异常症状。继续观察中。'
        }
      ]
    },
    {
      id: 'student-002',
      name: '王小红',
      group: '实习组B · 畜牧兽医专业',
      logs: 8,
      pending: 0,
      avatar: 'https://s.coze.cn/image/5FIb_Wmm3VM/',
      logsData: [
        {
          id: 'log-004',
          date: '2024-01-15',
          title: '日常饲养管理',
          status: 'reviewed',
          content: '参与了今天的日常饲养管理工作，包括饲料配比、饮水管理等。'
        }
      ]
    },
    {
      id: 'student-003',
      name: '赵大力',
      group: '实习组A · 动物医学专业',
      logs: 15,
      pending: 2,
      avatar: 'https://s.coze.cn/image/j7lBjwJeIAc/',
      logsData: [
        {
          id: 'log-005',
          date: '2024-01-15',
          title: '鸡瘟诊断案例分析',
          status: 'pending',
          content: '分析了一个典型的鸡瘟案例，学习了诊断要点和治疗方案。'
        }
      ]
    }
  ];

  const statsData = {
    totalStudents: 12,
    pendingReviews: 5,
    completedReviews: 28
  };

  // 获取当前学生
  const currentStudent = currentStudentId ? studentsData.find(s => s.id === currentStudentId) : null;
  // 获取当前日志
  const currentLog = currentLogId && currentStudent ? currentStudent.logsData.find(l => l.id === currentLogId) : null;

  // 事件处理函数
  const handleBackPress = () => {
    if (router.canGoBack()) {
      router.back();
    }
  };

  const handleProfilePress = () => {
    router.push('/p-user_profile');
  };

  const handleNotificationPress = () => {
    // 处理通知点击
  };

  const handleStudentPress = (studentId: string) => {
    setCurrentStudentId(studentId);
    setCurrentLogId(null);
  };

  const handleBackToStudents = () => {
    setCurrentStudentId(null);
    setCurrentLogId(null);
  };

  const handleLogPress = (logId: string) => {
    setCurrentLogId(logId);
  };

  const handleBackToLogs = () => {
    setCurrentLogId(null);
  };

  const handleSubmitComment = async () => {
    if (!commentText.trim()) {
      Alert.alert('提示', '请输入批注内容');
      return;
    }

    setIsLoading(true);
    try {
      // 模拟提交批注
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // 更新日志状态
      if (currentStudent && currentLog) {
        const updatedStudent = studentsData.map(student => {
          if (student.id === currentStudentId) {
            return {
              ...student,
              logsData: student.logsData.map(log => 
                log.id === currentLogId ? { ...log, status: 'reviewed' as const } : log
              )
            };
          }
          return student;
        });
        // 这里应该更新实际的数据存储
      }

      Alert.alert('成功', '批注已提交');
      handleBackToLogs();
      setCommentText('');
    } catch (error) {
      Alert.alert('错误', '提交失败，请重试');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelComment = () => {
    handleBackToLogs();
    setCommentText('');
  };

  // 辅助函数
  const getLogStatusText = (status: string) => {
    switch(status) {
      case 'pending': return '待批改';
      case 'reviewed': return '已批改';
      case 'submitted': return '已提交';
      default: return '未知';
    }
  };

  const getLogStatusBadgeStyle = (status: string) => {
    switch(status) {
      case 'pending': return styles.logStatusPending;
      case 'reviewed': return styles.logStatusReviewed;
      case 'submitted': return styles.logStatusSubmitted;
      default: return styles.logStatusDefault;
    }
  };

  const getLogItemStyle = (status: string) => {
    switch(status) {
      case 'pending': return styles.logItemPending;
      case 'reviewed': return styles.logItemReviewed;
      case 'submitted': return styles.logItemSubmitted;
      default: return {};
    }
  };

  // 渲染统计卡片
  const renderStatsCard = (value: number, label: string, color: string) => (
    <View style={styles.statsCard}>
      <Text style={[styles.statsValue, { color }]}>{value}</Text>
      <Text style={styles.statsLabel}>{label}</Text>
    </View>
  );

  // 渲染学生列表项
  const renderStudentItem = (student: Student) => (
    <TouchableOpacity
      key={student.id}
      style={styles.studentItem}
      onPress={() => handleStudentPress(student.id)}
      activeOpacity={0.7}
    >
      <View style={styles.studentItemContent}>
        <Image source={{ uri: student.avatar }} style={styles.studentAvatar} />
        <View style={styles.studentInfo}>
          <Text style={styles.studentName}>{student.name}</Text>
          <Text style={styles.studentGroup}>{student.group}</Text>
          <View style={styles.studentStats}>
            <View style={styles.studentStatItem}>
              <FontAwesome6 name="file-lines" size={10} color="#6B7280" />
              <Text style={styles.studentStatText}>{student.logs}篇日志</Text>
            </View>
            <View style={styles.studentStatItem}>
              <FontAwesome6 
                name={student.pending > 0 ? "clock" : "check"} 
                size={10} 
                color={student.pending > 0 ? "#F59E0B" : "#10B981"} 
              />
              <Text style={[
                styles.studentStatText, 
                { color: student.pending > 0 ? "#F59E0B" : "#10B981" }
              ]}>
                {student.pending > 0 ? `${student.pending}篇待批改` : '已完成'}
              </Text>
            </View>
          </View>
        </View>
      </View>
      <FontAwesome6 name="chevron-right" size={16} color="#6B7280" />
    </TouchableOpacity>
  );

  // 渲染日志列表项
  const renderLogItem = (log: StudentLog) => (
    <TouchableOpacity
      key={log.id}
      style={[styles.logItem, getLogItemStyle(log.status)]}
      onPress={() => handleLogPress(log.id)}
      activeOpacity={0.7}
    >
      <View style={styles.logItemContent}>
        <View style={styles.logIconContainer}>
          <FontAwesome6 name="file-lines" size={16} color="#3BCCA5" />
        </View>
        <View style={styles.logInfo}>
          <Text style={styles.logTitle}>{log.title}</Text>
          <Text style={styles.logDate}>{log.date}</Text>
        </View>
      </View>
      <View style={[styles.logStatusBadge, getLogStatusBadgeStyle(log.status)]}>
        <Text style={styles.logStatusText}>{getLogStatusText(log.status)}</Text>
      </View>
    </TouchableOpacity>
  );

  // 渲染主内容
  const renderMainContent = () => {
    if (currentLogId && currentLog && currentStudent) {
      // 日志详情页面
      return (
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>日志详情</Text>
            <TouchableOpacity onPress={handleBackToLogs} style={styles.backButton}>
              <FontAwesome6 name="arrow-left" size={12} color="#3BCCA5" />
              <Text style={styles.backButtonText}>返回日志列表</Text>
            </TouchableOpacity>
          </View>

          {/* 日志内容卡片 */}
          <View style={styles.logContentCard}>
            <View style={styles.logHeader}>
              <View>
                <Text style={styles.logStudentName}>{currentStudent.name}</Text>
                <Text style={styles.logDate}>{currentLog.date}</Text>
              </View>
              <View style={[styles.logStatusBadge, getLogStatusBadgeStyle(currentLog.status)]}>
                <Text style={styles.logStatusText}>{getLogStatusText(currentLog.status)}</Text>
              </View>
            </View>

            <View style={styles.logContent}>
              <View style={styles.logSection}>
                <Text style={styles.logSectionTitle}>实习内容</Text>
                <Text style={styles.logTextContent}>{currentLog.content}</Text>
              </View>

              <View style={styles.logSection}>
                <Text style={styles.logSectionTitle}>诊断记录</Text>
                <View style={styles.diagnosisContainer}>
                  <View style={styles.diagnosisItem}>
                    <FontAwesome6 name="stethoscope" size={14} color="#3BCCA5" />
                    <Text style={styles.diagnosisText}>学生诊断：新城疫</Text>
                  </View>
                  <View style={styles.diagnosisItem}>
                    <FontAwesome6 name="robot" size={14} color="#3BCCA5" />
                    <Text style={styles.diagnosisText}>AI参考：新城疫（置信度95%）</Text>
                  </View>
                </View>
              </View>

              <View style={styles.logSection}>
                <Text style={styles.logSectionTitle}>现场图片</Text>
                <View style={styles.imagesContainer}>
                  <Image 
                    source={{ uri: 'https://s.coze.cn/image/Vd_iKFVVp8I/' }} 
                    style={styles.logImage} 
                  />
                  <Image 
                    source={{ uri: 'https://s.coze.cn/image/y_Vge8zjpFU/' }} 
                    style={styles.logImage} 
                  />
                  <Image 
                    source={{ uri: 'https://s.coze.cn/image/-RuNG9ZPCN0/' }} 
                    style={styles.logImage} 
                  />
                </View>
              </View>
            </View>
          </View>

          {/* 导师批注 */}
          <View style={styles.commentCard}>
            <Text style={styles.commentCardTitle}>导师批注</Text>

            {/* 已有批注 */}
            {currentLog.status === 'reviewed' && (
              <View style={styles.existingComment}>
                <View style={styles.commentHeader}>
                  <FontAwesome6 name="user-tie" size={14} color="#3B82F6" />
                  <Text style={styles.commentAuthor}>张教授</Text>
                  <Text style={styles.commentDate}>2024-01-16 10:30</Text>
                </View>
                <Text style={styles.commentText}>
                  诊断准确，处理得当。建议在采集病料时注意生物安全防护，继续保持。
                </Text>
              </View>
            )}

            {/* 批注输入框 */}
            {currentLog.status !== 'reviewed' && (
              <View style={styles.commentInputSection}>
                <TextInput
                  style={styles.commentInput}
                  placeholder="请输入您的批注..."
                  value={commentText}
                  onChangeText={setCommentText}
                  multiline
                  numberOfLines={4}
                  textAlignVertical="top"
                />
                <View style={styles.commentActions}>
                  <TouchableOpacity 
                    style={styles.cancelButton} 
                    onPress={handleCancelComment}
                    disabled={isLoading}
                  >
                    <Text style={styles.cancelButtonText}>取消</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={[styles.submitButton, isLoading && styles.submitButtonDisabled]} 
                    onPress={handleSubmitComment}
                    disabled={isLoading}
                  >
                    <Text style={styles.submitButtonText}>
                      {isLoading ? '提交中...' : '提交批注'}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </View>
        </View>
      );
    }

    if (currentStudentId && currentStudent) {
      // 日志列表页面
      return (
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>{currentStudent.name}的实习日志</Text>
            <TouchableOpacity onPress={handleBackToStudents} style={styles.backButton}>
              <FontAwesome6 name="arrow-left" size={12} color="#3BCCA5" />
              <Text style={styles.backButtonText}>返回学生列表</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.logsList}>
            {currentStudent.logsData.map(renderLogItem)}
          </View>
        </View>
      );
    }

    // 学生列表页面
    return (
      <>
        {/* 统计概览 */}
        <View style={styles.section}>
          <View style={styles.statsGrid}>
            {renderStatsCard(statsData.totalStudents, '总学生数', '#3BCCA5')}
            {renderStatsCard(statsData.pendingReviews, '待批改', '#F59E0B')}
            {renderStatsCard(statsData.completedReviews, '已完成', '#10B981')}
          </View>
        </View>

        {/* 学生列表 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>我的学生</Text>
          <View style={styles.studentsList}>
            {studentsData.map(renderStudentItem)}
          </View>
        </View>
      </>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* 顶部导航栏 */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity style={styles.backButtonContainer} onPress={handleBackPress}>
            <FontAwesome6 name="arrow-left" size={20} color="#6B7280" />
          </TouchableOpacity>
          <View style={styles.headerTitleContainer}>
            <Text style={styles.headerTitle}>导师管理</Text>
            <Text style={styles.headerSubtitle}>农业大学 · 张教授</Text>
          </View>
        </View>
        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.notificationButton} onPress={handleNotificationPress}>
            <FontAwesome6 name="bell" size={20} color="#6B7280" />
            <View style={styles.notificationBadge} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.profileButton} onPress={handleProfilePress}>
            <FontAwesome6 name="circle-user" size={20} color="#6B7280" />
          </TouchableOpacity>
        </View>
      </View>

      {/* 主要内容区域 */}
      <ScrollView style={styles.mainContent} showsVerticalScrollIndicator={false}>
        {renderMainContent()}
      </ScrollView>
    </SafeAreaView>
  );
};

export default MentorDashboardScreen;

