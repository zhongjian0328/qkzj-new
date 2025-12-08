

import React, { useState, useCallback } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, Modal, Alert, RefreshControl, } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { FontAwesome6 } from '@expo/vector-icons';
import styles from './styles';
import CustomerListItem from './components/CustomerListItem';
import CustomerDetailPanel from './components/CustomerDetailPanel';
import AddCustomerModal from './components/AddCustomerModal';

interface Customer {
  id: string;
  name: string;
  phone: string;
  avatar: string;
  type: string;
  status: string;
  lastInteraction: string;
  address?: string;
  scale?: string;
  registerTime?: string;
}

const CustomerManagementScreen = () => {
  const router = useRouter();
  
  // 状态管理
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [isDetailPanelVisible, setIsDetailPanelVisible] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // 模拟客户数据
  const [customers, setCustomers] = useState<Customer[]>([
    {
      id: 'customer1',
      name: '王大强',
      phone: '138****5678',
      avatar: 'https://s.coze.cn/image/qnRLMYNIvnA/',
      type: '小散户',
      status: '活跃',
      lastInteraction: '2024-01-15',
      address: '河南省郑州市中牟县',
      scale: '约5000只肉鸡',
      registerTime: '2023-06-15',
    },
    {
      id: 'customer2',
      name: '李养殖合作社',
      phone: '139****9876',
      avatar: 'https://s.coze.cn/image/F6JLewjHhSo/',
      type: '合作社',
      status: 'VIP',
      lastInteraction: '2024-01-14',
      address: '河南省开封市祥符区',
      scale: '约20000只蛋鸡',
      registerTime: '2023-05-20',
    },
    {
      id: 'customer3',
      name: '张老板',
      phone: '136****4321',
      avatar: 'https://s.coze.cn/image/4jq5js00O_M/',
      type: '养殖企业',
      status: '待跟进',
      lastInteraction: '2024-01-13',
      address: '河南省新乡市卫辉市',
      scale: '约50000只肉鸡',
      registerTime: '2023-07-01',
    },
    {
      id: 'customer4',
      name: '刘农户',
      phone: '137****8765',
      avatar: 'https://s.coze.cn/image/-qLiAMJkzYY/',
      type: '小散户',
      status: '休眠',
      lastInteraction: '2024-01-10',
      address: '河南省许昌市建安区',
      scale: '约3000只蛋鸡',
      registerTime: '2023-08-15',
    },
    {
      id: 'customer5',
      name: '陈养殖集团',
      phone: '135****3456',
      avatar: 'https://s.coze.cn/image/BFImThYIOSs/',
      type: '养殖企业',
      status: '活跃',
      lastInteraction: '2024-01-12',
      address: '河南省周口市淮阳区',
      scale: '约100000只肉鸡',
      registerTime: '2023-04-10',
    },
  ]);

  // 事件处理函数
  const handleBackPress = useCallback(() => {
    if (router.canGoBack()) {
      router.back();
    }
  }, [router]);

  const handleSearchPress = useCallback(() => {
    setIsSearchVisible(true);
  }, []);

  const handleSearchClose = useCallback(() => {
    setIsSearchVisible(false);
    setSearchText('');
  }, []);

  const handleAddCustomerPress = useCallback(() => {
    setIsAddModalVisible(true);
  }, []);

  const handleCustomerPress = useCallback((customer: Customer) => {
    setSelectedCustomer(customer);
    setIsDetailPanelVisible(true);
  }, []);

  const handleDetailPanelClose = useCallback(() => {
    setIsDetailPanelVisible(false);
    setSelectedCustomer(null);
  }, []);

  const handleAddCustomerSubmit = useCallback((customerData: Omit<Customer, 'id'>) => {
    const newCustomer: Customer = {
      ...customerData,
      id: `customer${Date.now()}`,
      lastInteraction: new Date().toISOString().split('T')[0],
    };
    setCustomers(prev => [newCustomer, ...prev]);
    setIsAddModalVisible(false);
    Alert.alert('成功', '客户添加成功');
  }, []);

  const handleFilterPress = useCallback(() => {
    Alert.alert('筛选', '筛选功能');
  }, []);

  const handleSortPress = useCallback(() => {
    Alert.alert('排序', '排序功能');
  }, []);

  const handleLoadMorePress = useCallback(() => {
    setIsLoading(true);
    // 模拟加载更多
    setTimeout(() => {
      setIsLoading(false);
      Alert.alert('加载更多', '已加载全部客户');
    }, 1000);
  }, []);

  const handleRefresh = useCallback(() => {
    setIsRefreshing(true);
    // 模拟刷新
    setTimeout(() => {
      setIsRefreshing(false);
    }, 1000);
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      {/* 顶部导航栏 */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity style={styles.backButton} onPress={handleBackPress}>
            <FontAwesome6 name="arrow-left" size={20} color="#6B7280" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>客户管理</Text>
        </View>
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.searchButton} onPress={handleSearchPress}>
            <FontAwesome6 name="magnifying-glass" size={20} color="#6B7280" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.addButton} onPress={handleAddCustomerPress}>
            <FontAwesome6 name="plus" size={14} color="#FFFFFF" />
            <Text style={styles.addButtonText}>添加客户</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* 搜索栏 */}
      {isSearchVisible && (
        <View style={styles.searchBar}>
          <View style={styles.searchInputWrapper}>
            <FontAwesome6 name="magnifying-glass" size={16} color="#6B7280" style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="搜索客户姓名、电话..."
              value={searchText}
              onChangeText={setSearchText}
              autoFocus
            />
            <TouchableOpacity style={styles.searchCloseButton} onPress={handleSearchClose}>
              <FontAwesome6 name="xmark" size={16} color="#6B7280" />
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* 主要内容区域 */}
      <ScrollView
        style={styles.mainContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} />
        }
      >
        {/* 数据概览 */}
        <View style={styles.dataOverview}>
          <View style={styles.overviewCard}>
            <Text style={styles.overviewNumber}>128</Text>
            <Text style={styles.overviewLabel}>总客户数</Text>
          </View>
          <View style={styles.overviewCard}>
            <Text style={[styles.overviewNumber, styles.activeNumber]}>95</Text>
            <Text style={styles.overviewLabel}>活跃客户</Text>
          </View>
          <View style={styles.overviewCard}>
            <Text style={[styles.overviewNumber, styles.pendingNumber]}>12</Text>
            <Text style={styles.overviewLabel}>待处理咨询</Text>
          </View>
        </View>

        {/* 客户列表 */}
        <View style={styles.customerListSection}>
          <View style={styles.listHeader}>
            <Text style={styles.listTitle}>客户列表</Text>
            <View style={styles.filterSection}>
              <TouchableOpacity style={styles.filterButton} onPress={handleFilterPress}>
                <FontAwesome6 name="filter" size={12} color="#6B7280" />
                <Text style={styles.filterButtonText}>筛选</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.filterButton} onPress={handleSortPress}>
                <FontAwesome6 name="sort" size={12} color="#6B7280" />
                <Text style={styles.filterButtonText}>排序</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.customerList}>
            {customers.map((customer) => (
              <CustomerListItem
                key={customer.id}
                customer={customer}
                onPress={() => handleCustomerPress(customer)}
              />
            ))}
          </View>

          {/* 加载更多 */}
          <View style={styles.loadMoreSection}>
            <TouchableOpacity
              style={styles.loadMoreButton}
              onPress={handleLoadMorePress}
              disabled={isLoading}
            >
              <Text style={styles.loadMoreText}>
                {isLoading ? '加载中...' : '加载更多客户'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* 客户详情面板 */}
      <CustomerDetailPanel
        visible={isDetailPanelVisible}
        customer={selectedCustomer}
        onClose={handleDetailPanelClose}
      />

      {/* 添加客户弹窗 */}
      <AddCustomerModal
        visible={isAddModalVisible}
        onClose={() => setIsAddModalVisible(false)}
        onSubmit={handleAddCustomerSubmit}
      />
    </SafeAreaView>
  );
};

export default CustomerManagementScreen;

