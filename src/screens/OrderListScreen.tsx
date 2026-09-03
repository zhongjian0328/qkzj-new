import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, TouchableOpacity, ScrollView, ActivityIndicator, RefreshControl, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import Header from '../components/Header';
import { styles } from '../styles';
import { businessApi } from '../services/api';

const OrderListScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>('all');

  const tabs = [
    { value: 'all', label: '全部' },
    { value: 'PENDING', label: '待处理' },
    { value: 'PROCESSING', label: '进行中' },
    { value: 'COMPLETED', label: '已完成' },
    { value: 'CANCELLED', label: '已取消' },
  ];

  const fetchOrders = useCallback(async (isRefresh = false) => {
    try {
      if (isRefresh) setRefreshing(true); else setLoading(true);
      setError(null);
      const params: any = { page: 1, limit: 50 };
      if (activeTab !== 'all') params.status = activeTab;
      const response = await businessApi.getOrders(params);
      const data = response.data?.orders || [];
      setOrders(data);
    } catch (err) {
      console.error('获取订单列表失败:', err);
      setError('加载订单失败，请稍后重试');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [activeTab]);

  useEffect(() => { fetchOrders(); }, [fetchOrders]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING': return '#F59E0B';
      case 'PROCESSING': return '#3B82F6';
      case 'COMPLETED': return '#10B981';
      case 'CANCELLED': return '#6B7280';
      default: return '#6B7280';
    }
  };

  const getStatusLabel = (status: string) => {
    const found = tabs.find(t => t.value === status);
    return found ? found.label : status;
  };

  const getProductTypeLabel = (type: string) => {
    switch (type) {
      case 'medicine': return '兽药';
      case 'vaccine': return '疫苗';
      case 'disinfectant': return '消毒剂';
      case 'equipment': return '器械';
      case 'diagnosis_service': return '诊疗服务';
      case 'consultation': return '在线咨询';
      default: return type;
    }
  };

  const handleCancelOrder = async (orderId: string) => {
    Alert.alert('取消订单', '确定要取消此订单吗？', [
      { text: '取消', style: 'cancel' },
      {
        text: '确定',
        onPress: async () => {
          try {
            await businessApi.cancelOrder(orderId);
            Alert.alert('成功', '订单已取消');
            fetchOrders(true);
          } catch (err) {
            Alert.alert('错误', '取消订单失败');
          }
        },
      },
    ]);
  };

  const handleConfirmOrder = async (orderId: string) => {
    try {
      await businessApi.confirmOrder(orderId);
      Alert.alert('成功', '已确认收货');
      fetchOrders(true);
    } catch (err) {
      Alert.alert('错误', '确认收货失败');
    }
  };

  return (
    <View style={styles.container}>
      <Header title="我的订单" showBackButton onBack={() => navigation.goBack()} />

      {/* Tab 切换 */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ paddingHorizontal: 16, paddingVertical: 12 }}>
        {tabs.map(tab => (
          <TouchableOpacity
            key={tab.value}
            style={{
              backgroundColor: activeTab === tab.value ? '#2DBBA1' : '#FFFFFF',
              borderWidth: 1,
              borderColor: activeTab === tab.value ? '#2DBBA1' : '#E5E7EB',
              borderRadius: 20,
              paddingHorizontal: 16,
              paddingVertical: 8,
              marginRight: 8,
            }}
            onPress={() => setActiveTab(tab.value)}
          >
            <Text style={{ fontSize: 13, fontWeight: '500', color: activeTab === tab.value ? '#FFFFFF' : '#6B7280' }}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#2DBBA1" />
          <Text style={styles.loadingText}>正在加载订单...</Text>
        </View>
      ) : error ? (
        <View style={styles.loadingContainer}>
          <Ionicons name="alert-circle-outline" size={48} color="#9CA3AF" />
          <Text style={{ fontSize: 16, color: '#6B7280', marginBottom: 16 }}>{error}</Text>
          <TouchableOpacity style={{ backgroundColor: '#2DBBA1', borderRadius: 8, paddingHorizontal: 24, paddingVertical: 10 }} onPress={() => fetchOrders()}>
            <Text style={{ color: '#FFFFFF', fontSize: 16, fontWeight: '600' }}>重试</Text>
          </TouchableOpacity>
        </View>
      ) : orders.length === 0 ? (
        <View style={styles.loadingContainer}>
          <Ionicons name="receipt-outline" size={48} color="#9CA3AF" />
          <Text style={{ fontSize: 16, color: '#6B7280' }}>暂无订单</Text>
        </View>
      ) : (
        <ScrollView
          contentContainerStyle={{ padding: 16 }}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => fetchOrders(true)} colors={['#2DBBA1']} />}
        >
          {orders.map(order => (
            <View
              key={order._id || order.id}
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: 12,
                padding: 16,
                marginBottom: 12,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.06,
                shadowRadius: 3.84,
                elevation: 2,
                borderLeftWidth: 4,
                borderLeftColor: getStatusColor(order.orderStatus),
              }}
            >
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <Text style={{ fontSize: 14, fontWeight: '600', color: '#111827' }}>
                  {getProductTypeLabel(order.productType)} - {order.productType === 'diagnosis_service' ? '诊疗服务' : '商品订单'}
                </Text>
                <View style={{ backgroundColor: getStatusColor(order.orderStatus) + '1A', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 }}>
                  <Text style={{ fontSize: 12, fontWeight: '600', color: getStatusColor(order.orderStatus) }}>
                    {getStatusLabel(order.orderStatus)}
                  </Text>
                </View>
              </View>

              {order.serviceDescription && (
                <Text style={{ fontSize: 14, color: '#4B5563', marginBottom: 8, lineHeight: 20 }} numberOfLines={2}>
                  {order.serviceDescription}
                </Text>
              )}

              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <Text style={{ fontSize: 16, fontWeight: '700', color: '#DC2626' }}>
                  ¥{order.totalPrice?.toFixed(2) || '0.00'}
                </Text>
                <Text style={{ fontSize: 12, color: '#9CA3AF' }}>
                  {order.orderDate ? new Date(order.orderDate).toLocaleDateString('zh-CN') : ''}
                </Text>
              </View>

              {/* 操作按钮 */}
              <View style={{ flexDirection: 'row', justifyContent: 'flex-end', gap: 8 }}>
                {order.orderStatus === 'PENDING' && (
                  <TouchableOpacity
                    style={{ backgroundColor: '#FEF2F2', borderRadius: 8, paddingHorizontal: 14, paddingVertical: 8 }}
                    onPress={() => handleCancelOrder(order._id || order.id)}
                  >
                    <Text style={{ fontSize: 13, fontWeight: '500', color: '#DC2626' }}>取消订单</Text>
                  </TouchableOpacity>
                )}
                {order.orderStatus === 'PROCESSING' && (
                  <TouchableOpacity
                    style={{ backgroundColor: '#2DBBA1', borderRadius: 8, paddingHorizontal: 14, paddingVertical: 8 }}
                    onPress={() => handleConfirmOrder(order._id || order.id)}
                  >
                    <Text style={{ fontSize: 13, fontWeight: '500', color: '#FFFFFF' }}>确认收货</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          ))}
        </ScrollView>
      )}
    </View>
  );
};

export default OrderListScreen;
