

import React, { useState, useCallback } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, RefreshControl, Alert, } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { FontAwesome6 } from '@expo/vector-icons';
import styles from './styles';
import LogItem from './components/LogItem';
import StatsCard from './components/StatsCard';

interface LogData {
  id: string;
  title: string;
  date: string;
  time: string;
  content: string;
  status: 'draft' | 'submitted' | 'reviewed';
  imageCount: number;
  hasComment?: boolean;
}

interface FilterState {
  all: boolean;
  draft: boolean;
  submitted: boolean;
  reviewed: boolean;
}

const InternLogListScreen: React.FC = () => {
  const router = useRouter();
  
  // 状态管理
  const [searchText, setSearchText] = useState<string>('');
  const [isFilterDropdownVisible, setIsFilterDropdownVisible] = useState<boolean>(false);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [isLoadingMore, setIsLoadingMore] = useState<boolean>(false);
  
  const [filterState, setFilterState] = useState<FilterState>({
    all: true,
    draft: false,
    submitted: false,
    reviewed: false,
  });

  // 模拟日志数据
  const [logsData, setLogsData] = useState<LogData[]>([
    {
      id: 'log_001',
      title: '新城疫病例观察与诊断',
      date: '2024-01-15',
      time: '14:30',
      content: '今日在养殖场观察到3只鸡出现精神萎靡、呼吸困难等症状，疑似新城疫。通过AI诊断确认后，协助兽医进行隔离治疗...',
      status: 'reviewed',
      imageCount: 3,
      hasComment: true,
    },
    {
      id: 'log_002',
      title: '禽流感预防措施学习',
      date: '2024-01-14',
      time: '16:45',
      content: '参加养殖场禽流感预防培训，学习了疫苗接种流程、消毒方法和应急处理措施。实践操作了鸡舍消毒工作...',
      status: 'submitted',
      imageCount: 1,
    },
    {
      id: 'log_003',
      title: '鸡舍环境管理记录',
      date: '2024-01-13',
      time: '11:20',
      content: '记录今日鸡舍温湿度、通风情况，观察鸡群活动状态。发现部分区域湿度偏高，已调整通风设备...',
      status: 'draft',
      imageCount: 2,
    },
    {
      id: 'log_004',
      title: '饲料配方与饲喂管理',
      date: '2024-01-12',
      time: '15:10',
      content: '学习不同生长阶段的饲料配方特点，参与制定饲喂计划。观察饲料转化率和鸡群生长状况...',
      status: 'reviewed',
      imageCount: 0,
      hasComment: true,
    },
    {
      id: 'log_005',
      title: '疫苗接种操作实践',
      date: '2024-01-11',
      time: '10:30',
      content: '在兽医指导下进行新城疫疫苗接种，学习正确的注射方法和剂量控制。共接种500只肉鸡...',
      status: 'submitted',
      imageCount: 5,
    },
  ]);

  // 统计数据
  const statsData = {
    total: logsData.length,
    submitted: logsData.filter(log => log.status === 'submitted').length,
    reviewed: logsData.filter(log => log.status === 'reviewed').length,
  };

  // 事件处理函数
  const handleBackPress = useCallback(() => {
    if (router.canGoBack()) {
      router.back();
    }
  }, [router]);

  const handleAddLogPress = useCallback(() => {
    router.push('/p-intern_log_detail');
  }, [router]);

  const handleLogItemPress = useCallback((logId: string) => {
    router.push(`/p-intern_log_detail?logId=${logId}`);
  }, [router]);

  const handleFilterPress = useCallback(() => {
    setIsFilterDropdownVisible(!isFilterDropdownVisible);
  }, [isFilterDropdownVisible]);

  const handleFilterChange = useCallback((filterKey: keyof FilterState) => {
    setFilterState(prevState => {
      const newState = { ...prevState };
      
      if (filterKey === 'all') {
        // 如果全选被勾选，取消其他选项
        newState.all = !prevState.all;
        if (newState.all) {
          newState.draft = false;
          newState.submitted = false;
          newState.reviewed = false;
        }
      } else {
        // 如果其他选项被勾选，取消全选
        newState[filterKey] = !prevState[filterKey];
        if (newState[filterKey]) {
          newState.all = false;
        }
      }
      
      return newState;
    });
  }, []);

  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    try {
      // 模拟刷新数据
      await new Promise(resolve => setTimeout(resolve, 1000));
    } catch (error) {
      Alert.alert('刷新失败', '请检查网络连接后重试');
    } finally {
      setIsRefreshing(false);
    }
  }, []);

  const handleLoadMore = useCallback(async () => {
    if (isLoadingMore) return;
    
    setIsLoadingMore(true);
    try {
      // 模拟加载更多数据
      await new Promise(resolve => setTimeout(resolve, 1000));
    } catch (error) {
      Alert.alert('加载失败', '请检查网络连接后重试');
    } finally {
      setIsLoadingMore(false);
    }
  }, [isLoadingMore]);

  // 筛选和搜索逻辑
  const getFilteredLogs = useCallback(() => {
    let filteredLogs = logsData;

    // 应用搜索筛选
    if (searchText.trim()) {
      const searchLower = searchText.toLowerCase();
      filteredLogs = filteredLogs.filter(log =>
        log.title.toLowerCase().includes(searchLower) ||
        log.content.toLowerCase().includes(searchLower)
      );
    }

    // 应用状态筛选
    if (!filterState.all) {
      const selectedStatuses: string[] = [];
      if (filterState.draft) selectedStatuses.push('draft');
      if (filterState.submitted) selectedStatuses.push('submitted');
      if (filterState.reviewed) selectedStatuses.push('reviewed');
      
      filteredLogs = filteredLogs.filter(log => 
        selectedStatuses.includes(log.status)
      );
    }

    return filteredLogs;
  }, [logsData, searchText, filterState]);

  const filteredLogs = getFilteredLogs();

  return (
    <SafeAreaView style={styles.container}>
      {/* 顶部导航栏 */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={handleBackPress}
            activeOpacity={0.7}
          >
            <FontAwesome6 name="arrow-left" size={20} color="#6B7280" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>实习日志</Text>
        </View>
        <TouchableOpacity 
          style={styles.addButton}
          onPress={handleAddLogPress}
          activeOpacity={0.8}
        >
          <FontAwesome6 name="plus" size={14} color="#FFFFFF" />
          <Text style={styles.addButtonText}>新建日志</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollView}
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
        {/* 搜索和筛选区域 */}
        <View style={styles.searchFilterSection}>
          <View style={styles.searchFilterRow}>
            <View style={styles.searchInputWrapper}>
              <FontAwesome6 
                name="magnifying-glass" 
                size={16} 
                color="#6B7280" 
                style={styles.searchIcon}
              />
              <TextInput
                style={styles.searchInput}
                placeholder="搜索日志内容..."
                placeholderTextColor="#9CA3AF"
                value={searchText}
                onChangeText={setSearchText}
              />
            </View>
            <TouchableOpacity 
              style={styles.filterButton}
              onPress={handleFilterPress}
              activeOpacity={0.7}
            >
              <FontAwesome6 name="filter" size={16} color="#6B7280" />
            </TouchableOpacity>
          </View>

          {/* 筛选下拉菜单 */}
          {isFilterDropdownVisible && (
            <View style={styles.filterDropdown}>
              <View style={styles.filterDropdownContent}>
                <Text style={styles.filterTitle}>筛选条件</Text>
                <View style={styles.filterOptions}>
                  <TouchableOpacity 
                    style={styles.filterOption}
                    onPress={() => handleFilterChange('all')}
                    activeOpacity={0.7}
                  >
                    <View style={[
                      styles.checkbox,
                      filterState.all && styles.checkboxChecked
                    ]}>
                      {filterState.all && (
                        <FontAwesome6 name="check" size={10} color="#FFFFFF" />
                      )}
                    </View>
                    <Text style={styles.filterOptionText}>全部日志</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity 
                    style={styles.filterOption}
                    onPress={() => handleFilterChange('draft')}
                    activeOpacity={0.7}
                  >
                    <View style={[
                      styles.checkbox,
                      filterState.draft && styles.checkboxChecked
                    ]}>
                      {filterState.draft && (
                        <FontAwesome6 name="check" size={10} color="#FFFFFF" />
                      )}
                    </View>
                    <Text style={styles.filterOptionText}>草稿</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity 
                    style={styles.filterOption}
                    onPress={() => handleFilterChange('submitted')}
                    activeOpacity={0.7}
                  >
                    <View style={[
                      styles.checkbox,
                      filterState.submitted && styles.checkboxChecked
                    ]}>
                      {filterState.submitted && (
                        <FontAwesome6 name="check" size={10} color="#FFFFFF" />
                      )}
                    </View>
                    <Text style={styles.filterOptionText}>已提交</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity 
                    style={styles.filterOption}
                    onPress={() => handleFilterChange('reviewed')}
                    activeOpacity={0.7}
                  >
                    <View style={[
                      styles.checkbox,
                      filterState.reviewed && styles.checkboxChecked
                    ]}>
                      {filterState.reviewed && (
                        <FontAwesome6 name="check" size={10} color="#FFFFFF" />
                      )}
                    </View>
                    <Text style={styles.filterOptionText}>已批阅</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          )}
        </View>

        {/* 统计信息 */}
        <View style={styles.statsSection}>
          <View style={styles.statsGrid}>
            <StatsCard
              value={statsData.total}
              label="总日志"
              color="#3BCCA5"
            />
            <StatsCard
              value={statsData.submitted}
              label="已提交"
              color="#2563EB"
            />
            <StatsCard
              value={statsData.reviewed}
              label="已批阅"
              color="#059669"
            />
          </View>
        </View>

        {/* 日志列表 */}
        <View style={styles.logsSection}>
          <View style={styles.logsSectionHeader}>
            <Text style={styles.logsTitle}>我的日志</Text>
            <Text style={styles.logsCount}>共{filteredLogs.length}篇</Text>
          </View>

          <View style={styles.logsList}>
            {filteredLogs.map((log) => (
              <LogItem
                key={log.id}
                log={log}
                onPress={() => handleLogItemPress(log.id)}
              />
            ))}
          </View>

          {/* 加载更多 */}
          <View style={styles.loadMoreSection}>
            <TouchableOpacity 
              style={styles.loadMoreButton}
              onPress={handleLoadMore}
              activeOpacity={0.7}
              disabled={isLoadingMore}
            >
              <Text style={styles.loadMoreText}>
                {isLoadingMore ? '加载中...' : '加载更多'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default InternLogListScreen;

