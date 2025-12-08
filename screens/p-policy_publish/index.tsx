

import React, { useState, useCallback } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Modal, TextInput, Alert, RefreshControl, } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { FontAwesome6 } from '@expo/vector-icons';
import styles from './styles';
import PolicyItem from './components/PolicyItem';
import PublishModal from './components/PublishModal';
import DetailModal from './components/DetailModal';

interface Policy {
  id: string;
  title: string;
  summary: string;
  content: string;
  publishTime: string;
  views: number;
  status: 'published' | 'draft' | 'expired';
  scope: 'all' | 'farmers' | 'enterprises' | 'students';
}

const PolicyPublishScreen = () => {
  const router = useRouter();
  
  const [isPublishModalVisible, setIsPublishModalVisible] = useState(false);
  const [isDetailModalVisible, setIsDetailModalVisible] = useState(false);
  const [selectedPolicy, setSelectedPolicy] = useState<Policy | null>(null);
  const [statusFilter, setStatusFilter] = useState('all');
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  const [policies, setPolicies] = useState<Policy[]>([
    {
      id: 'policy-001',
      title: '关于加强春季禽流感防控工作的通知',
      summary: '春季是禽流感高发季节，各养殖单位需加强鸡舍通风，定期消毒，及时接种疫苗...',
      content: '春季是禽流感高发季节，各养殖单位需加强鸡舍通风，定期消毒，及时接种疫苗。发现异常症状应立即隔离病禽并进行诊断。具体防控措施如下：\n\n1. 加强鸡舍通风换气\n2. 定期进行彻底消毒\n3. 及时接种禽流感疫苗\n4. 加强饲养管理\n5. 发现异常立即报告',
      publishTime: '2024-01-15 09:30',
      views: 1234,
      status: 'published',
      scope: 'all',
    },
    {
      id: 'policy-002',
      title: '禽类养殖场所消毒技术规范',
      summary: '为规范禽类养殖场所消毒操作，保障养殖安全，特制定本技术规范...',
      content: '为规范禽类养殖场所消毒操作，保障养殖安全，特制定本技术规范。本规范适用于各类禽类养殖场、养殖小区等场所的消毒工作。\n\n消毒范围包括：鸡舍、器具、设备、场地等。消毒方法应根据不同对象选择合适的消毒剂和消毒方式。',
      publishTime: '2024-01-12 14:20',
      views: 856,
      status: 'published',
      scope: 'farmers',
    },
    {
      id: 'policy-003',
      title: '新型疫苗接种推广方案',
      summary: '推广使用新型高效疫苗，提高禽类免疫力，降低疫病发生风险...',
      content: '推广使用新型高效疫苗，提高禽类免疫力，降低疫病发生风险。新型疫苗具有以下优点：\n\n1. 免疫效果更好\n2. 保护期更长\n3. 副作用更小\n4. 成本效益更高',
      publishTime: '未发布',
      views: 0,
      status: 'draft',
      scope: 'enterprises',
    },
    {
      id: 'policy-004',
      title: '冬季养殖保暖措施指导意见',
      summary: '针对冬季低温天气，为保障禽类健康生长，提出以下保暖措施...',
      content: '针对冬季低温天气，为保障禽类健康生长，提出以下保暖措施：\n\n1. 加强鸡舍保温\n2. 适当增加饲养密度\n3. 调整饲料配方\n4. 保证充足饮水\n5. 加强通风换气',
      publishTime: '2023-12-01 10:15',
      views: 2156,
      status: 'expired',
      scope: 'farmers',
    },
  ]);

  const filteredPolicies = policies.filter(policy => {
    if (statusFilter === 'all') return true;
    return policy.status === statusFilter;
  });

  const handleBackPress = useCallback(() => {
    if (router.canGoBack()) {
      router.back();
    }
  }, [router]);

  const handlePublishNewPolicy = useCallback(() => {
    setIsPublishModalVisible(true);
  }, []);

  const handlePolicyPress = useCallback((policy: Policy) => {
    setSelectedPolicy(policy);
    setIsDetailModalVisible(true);
  }, []);

  const handleClosePublishModal = useCallback(() => {
    setIsPublishModalVisible(false);
  }, []);

  const handleCloseDetailModal = useCallback(() => {
    setIsDetailModalVisible(false);
    setSelectedPolicy(null);
  }, []);

  const handleSearchPress = useCallback(() => {
    Alert.alert('搜索', '搜索功能');
  }, []);

  const handlePublishPolicy = useCallback((policyData: { title: string; content: string; scope: string }) => {
    const newPolicy: Policy = {
      id: `policy-${Date.now()}`,
      title: policyData.title,
      summary: policyData.content.length > 100 ? policyData.content.substring(0, 100) + '...' : policyData.content,
      content: policyData.content,
      publishTime: new Date().toLocaleString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
      }),
      views: 0,
      status: 'published',
      scope: policyData.scope as Policy['scope'],
    };

    setPolicies(prevPolicies => [newPolicy, ...prevPolicies]);
    setIsPublishModalVisible(false);
    Alert.alert('成功', '政策已发布');
  }, []);

  const handleEditPolicy = useCallback(() => {
    Alert.alert('编辑', '编辑功能');
    setIsDetailModalVisible(false);
  }, []);

  const handleDeletePolicy = useCallback(() => {
    Alert.alert(
      '删除政策',
      '确定要删除这个政策吗？',
      [
        { text: '取消', style: 'cancel' },
        {
          text: '删除',
          style: 'destructive',
          onPress: () => {
            if (selectedPolicy) {
              setPolicies(prevPolicies => 
                prevPolicies.filter(policy => policy.id !== selectedPolicy.id)
              );
              setIsDetailModalVisible(false);
              setSelectedPolicy(null);
              Alert.alert('成功', '政策已删除');
            }
          },
        },
      ]
    );
  }, [selectedPolicy]);

  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    // 模拟刷新数据
    setTimeout(() => {
      setIsRefreshing(false);
    }, 1000);
  }, []);

  const getScopeText = useCallback((scope: Policy['scope']) => {
    const scopeMap = {
      all: '全部用户',
      farmers: '养殖户',
      enterprises: '养殖企业',
      students: '学生',
    };
    return scopeMap[scope];
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      {/* 顶部导航栏 */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity style={styles.backButton} onPress={handleBackPress}>
            <FontAwesome6 name="arrow-left" size={20} color="#6B7280" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>政策下发</Text>
        </View>
        <TouchableOpacity style={styles.publishButton} onPress={handlePublishNewPolicy}>
          <FontAwesome6 name="plus" size={14} color="#FFFFFF" />
          <Text style={styles.publishButtonText}>发布新政策</Text>
        </TouchableOpacity>
      </View>

      {/* 主要内容区域 */}
      <ScrollView
        style={styles.mainContent}
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} />
        }
      >
        {/* 政策列表 */}
        <View style={styles.policyListSection}>
          <View style={styles.policyListHeader}>
            <Text style={styles.policyListTitle}>政策列表</Text>
            <View style={styles.filterControls}>
              <View style={styles.statusFilterContainer}>
                <Text style={styles.statusFilterText}>
                  {statusFilter === 'all' ? '全部状态' :
                   statusFilter === 'published' ? '已发布' :
                   statusFilter === 'draft' ? '草稿' : '已过期'}
                </Text>
                <FontAwesome6 name="chevron-down" size={12} color="#6B7280" />
              </View>
              <TouchableOpacity style={styles.searchButton} onPress={handleSearchPress}>
                <FontAwesome6 name="magnifying-glass" size={16} color="#6B7280" />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.policyList}>
            {filteredPolicies.map((policy) => (
              <PolicyItem
                key={policy.id}
                policy={policy}
                onPress={() => handlePolicyPress(policy)}
                getScopeText={getScopeText}
              />
            ))}
          </View>
        </View>
      </ScrollView>

      {/* 发布新政策弹窗 */}
      <PublishModal
        visible={isPublishModalVisible}
        onClose={handleClosePublishModal}
        onPublish={handlePublishPolicy}
      />

      {/* 政策详情弹窗 */}
      <DetailModal
        visible={isDetailModalVisible}
        policy={selectedPolicy}
        onClose={handleCloseDetailModal}
        onEdit={handleEditPolicy}
        onDelete={handleDeletePolicy}
        getScopeText={getScopeText}
      />
    </SafeAreaView>
  );
};

export default PolicyPublishScreen;

