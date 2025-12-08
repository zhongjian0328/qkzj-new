

import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, RefreshControl, } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { FontAwesome5, FontAwesome6 } from '@expo/vector-icons';
import styles from './styles';

interface StatCardProps {
  label: string;
  count: string;
  change: string;
  icon: string;
  iconColor: string;
  iconBgColor: string;
  changeColor: string;
  changeIcon: string;
}

interface FunctionCardProps {
  title: string;
  subtitle: string;
  icon: string;
  onPress: () => void;
}

interface ActivityItemProps {
  title: string;
  description: string;
  time: string;
  icon: string;
  iconColor: string;
  iconBgColor: string;
}

interface QuickActionProps {
  title: string;
  icon: string;
  iconColor: string;
  iconBgColor: string;
  onPress: () => void;
}

const StatCard: React.FC<StatCardProps> = ({
  label,
  count,
  change,
  icon,
  iconColor,
  iconBgColor,
  changeColor,
  changeIcon,
}) => {
  return (
    <View style={styles.statCard}>
      <View style={styles.statCardContent}>
        <View style={styles.statInfo}>
          <Text style={styles.statLabel}>{label}</Text>
          <Text style={styles.statCount}>{count}</Text>
          <View style={styles.statChangeContainer}>
            <FontAwesome6 name={changeIcon} size={10} color={changeColor} />
            <Text style={[styles.statChange, { color: changeColor }]}>
              {change}
            </Text>
          </View>
        </View>
        <View style={[styles.statIconContainer, { backgroundColor: iconBgColor }]}>
          <FontAwesome6 name={icon} size={20} color={iconColor} />
        </View>
      </View>
    </View>
  );
};

const FunctionCard: React.FC<FunctionCardProps> = ({
  title,
  subtitle,
  icon,
  onPress,
}) => {
  return (
    <TouchableOpacity style={styles.functionCard} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.functionCardContent}>
        <View style={styles.functionIconContainer}>
          <FontAwesome6 name={icon} size={20} color="#3BCCA5" />
        </View>
        <View style={styles.functionInfo}>
          <Text style={styles.functionTitle}>{title}</Text>
          <Text style={styles.functionSubtitle}>{subtitle}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const ActivityItem: React.FC<ActivityItemProps> = ({
  title,
  description,
  time,
  icon,
  iconColor,
  iconBgColor,
}) => {
  return (
    <View style={styles.activityItem}>
      <View style={styles.activityContent}>
        <View style={[styles.activityIconContainer, { backgroundColor: iconBgColor }]}>
          <FontAwesome6 name={icon} size={14} color={iconColor} />
        </View>
        <View style={styles.activityInfo}>
          <Text style={styles.activityTitle}>{title}</Text>
          <Text style={styles.activityDescription}>{description}</Text>
          <Text style={styles.activityTime}>{time}</Text>
        </View>
      </View>
    </View>
  );
};

const QuickAction: React.FC<QuickActionProps> = ({
  title,
  icon,
  iconColor,
  iconBgColor,
  onPress,
}) => {
  return (
    <TouchableOpacity style={styles.quickAction} onPress={onPress} activeOpacity={0.7}>
      <View style={[styles.quickActionIconContainer, { backgroundColor: iconBgColor }]}>
        <FontAwesome6 name={icon} size={16} color={iconColor} />
      </View>
      <Text style={styles.quickActionTitle}>{title}</Text>
    </TouchableOpacity>
  );
};

const HomeInstitutionServiceScreen: React.FC = () => {
  const router = useRouter();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    // 模拟刷新数据
    setTimeout(() => {
      setIsRefreshing(false);
    }, 1000);
  };

  const handleNotificationPress = () => {
    console.log('打开通知页面');
    // 实际应用中会跳转到通知页面
  };

  const handleProfilePress = () => {
    router.push('/p-user_profile');
  };

  const handleCustomerManagementPress = () => {
    router.push('/p-customer_management');
  };

  const handleAdPrecisionPress = () => {
    router.push('/p-ad_precision');
  };

  const handleOnlineConsultPress = () => {
    router.push('/p-online_consult');
  };

  const handleDataAnalysisPress = () => {
    console.log('打开数据分析页面');
    // 实际应用中会跳转到数据分析页面
  };

  const handleAddCustomerPress = () => {
    console.log('添加客户');
    // 实际应用中会弹出添加客户表单
  };

  const handleCreateAdPress = () => {
    console.log('创建广告');
    // 实际应用中会跳转到广告创建页面
  };

  const handleViewReportsPress = () => {
    console.log('查看报表');
    // 实际应用中会跳转到报表页面
  };

  const handleViewAllActivitiesPress = () => {
    console.log('查看全部活动');
    // 实际应用中会跳转到活动列表页面
  };

  const statisticsData = [
    {
      label: '今日咨询',
      count: '23',
      change: '+12%',
      icon: 'comments',
      iconColor: '#3BCCA5',
      iconBgColor: 'rgba(59, 204, 165, 0.1)',
      changeColor: '#059669',
      changeIcon: 'arrow-up',
    },
    {
      label: '待处理订单',
      count: '8',
      change: '需处理',
      icon: 'shopping-bag',
      iconColor: '#F97316',
      iconBgColor: 'rgba(249, 115, 22, 0.1)',
      changeColor: '#EA580C',
      changeIcon: 'clock',
    },
    {
      label: '活跃广告',
      count: '15',
      change: '投放中',
      icon: 'bullhorn',
      iconColor: '#3B82F6',
      iconBgColor: 'rgba(59, 130, 246, 0.1)',
      changeColor: '#2563EB',
      changeIcon: 'eye',
    },
    {
      label: '新增客户',
      count: '5',
      change: '本周',
      icon: 'users',
      iconColor: '#8B5CF6',
      iconBgColor: 'rgba(139, 92, 246, 0.1)',
      changeColor: '#7C3AED',
      changeIcon: 'user-plus',
    },
  ];

  const functionsData = [
    {
      title: '客户管理',
      subtitle: '管理客户档案',
      icon: 'address-book',
      onPress: handleCustomerManagementPress,
    },
    {
      title: '广告投放',
      subtitle: '精准营销推广',
      icon: 'bullhorn',
      onPress: handleAdPrecisionPress,
    },
    {
      title: '在线诊疗',
      subtitle: '接单处理咨询',
      icon: 'stethoscope',
      onPress: handleOnlineConsultPress,
    },
    {
      title: '数据分析',
      subtitle: '查看业务报表',
      icon: 'chart-line',
      onPress: handleDataAnalysisPress,
    },
  ];

  const activitiesData = [
    {
      title: '王养殖户完成在线咨询',
      description: '新城疫诊断咨询已完成',
      time: '2024-01-15 14:30',
      icon: 'check',
      iconColor: '#059669',
      iconBgColor: 'rgba(5, 150, 105, 0.1)',
    },
    {
      title: '李养殖户下单购买兽药',
      description: '订单金额：¥298.00',
      time: '2024-01-15 11:20',
      icon: 'shopping-cart',
      iconColor: '#2563EB',
      iconBgColor: 'rgba(37, 99, 235, 0.1)',
    },
    {
      title: '春季疫苗推广广告投放成功',
      description: '覆盖用户：1,234人',
      time: '2024-01-15 09:15',
      icon: 'bullhorn',
      iconColor: '#7C3AED',
      iconBgColor: 'rgba(124, 58, 237, 0.1)',
    },
  ];

  const quickActionsData = [
    {
      title: '添加客户',
      icon: 'user-plus',
      iconColor: '#059669',
      iconBgColor: 'rgba(5, 150, 105, 0.1)',
      onPress: handleAddCustomerPress,
    },
    {
      title: '创建广告',
      icon: 'plus-circle',
      iconColor: '#2563EB',
      iconBgColor: 'rgba(37, 99, 235, 0.1)',
      onPress: handleCreateAdPress,
    },
    {
      title: '查看报表',
      icon: 'chart-bar',
      iconColor: '#EA580C',
      iconBgColor: 'rgba(234, 88, 12, 0.1)',
      onPress: handleViewReportsPress,
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      {/* 顶部导航栏 */}
      <View style={styles.header}>
        <View style={styles.userInfo}>
          <Image
            source={{
              uri: 'https://s.coze.cn/image/Y_IoeYMzvk4/',
            }}
            style={styles.userAvatar}
          />
          <View style={styles.userDetails}>
            <Text style={styles.userGreeting}>早上好，李经理</Text>
            <Text style={styles.userRole}>兽药服务商</Text>
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
            <FontAwesome5 name="user-circle" size={20} color="#6B7280" />
          </TouchableOpacity>
        </View>
      </View>

      {/* 主要内容区域 */}
      <ScrollView
        style={styles.mainContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} />
        }
      >
        {/* 数据概览区 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>今日概览</Text>
          <View style={styles.statsGrid}>
            {statisticsData.map((stat, index) => (
              <StatCard key={index} {...stat} />
            ))}
          </View>
        </View>

        {/* 核心功能区 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>核心功能</Text>
          <View style={styles.functionsGrid}>
            {functionsData.map((func, index) => (
              <FunctionCard key={index} {...func} />
            ))}
          </View>
        </View>

        {/* 最近活动 */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>最近活动</Text>
            <TouchableOpacity
              onPress={handleViewAllActivitiesPress}
              activeOpacity={0.7}
            >
              <Text style={styles.viewAllButton}>查看全部</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.activitiesList}>
            {activitiesData.map((activity, index) => (
              <ActivityItem key={index} {...activity} />
            ))}
          </View>
        </View>

        {/* 快捷操作 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>快捷操作</Text>
          <View style={styles.quickActionsGrid}>
            {quickActionsData.map((action, index) => (
              <QuickAction key={index} {...action} />
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default HomeInstitutionServiceScreen;

