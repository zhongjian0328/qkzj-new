import React, { useState, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  RefreshControl,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Header from '../components/Header';
import { styles } from '../styles';
import { surveyApi } from '../services/api';

// ======================== 类型定义 ========================

interface SurveyRecord {
  id: string;
  farmName: string;
  species: string;
  stockCount: number;
  sickCount: number;
  deadCount: number;
  onsetDate: string;
  createdAt: string;
  isDraft: boolean;
}

type TabType = 'all' | 'draft' | 'formal';

// ======================== 主组件 ========================

const SurveyListScreen: React.FC = () => {
  const navigation = useNavigation<any>();

  const [surveys, setSurveys] = useState<SurveyRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>('all');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchSurveys();
  }, [activeTab]);

  const fetchSurveys = async () => {
    setLoading(true);
    setError(null);
    try {
      const params: any = {};
      if (activeTab === 'draft') params.isDraft = true;
      if (activeTab === 'formal') params.isDraft = false;

      const response = await surveyApi.getSurveys(params);
      setSurveys(response.data || []);
    } catch (err: any) {
      setError(err?.message || '加载流调记录失败，请检查网络连接');
      setSurveys([]);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchSurveys();
    setRefreshing(false);
  }, [activeTab]);

  const handleDelete = (id: string) => {
    Alert.alert(
      '确认删除',
      '确定要删除这条流调记录吗？此操作不可撤销。',
      [
        { text: '取消', style: 'cancel' },
        {
          text: '删除',
          style: 'destructive',
          onPress: async () => {
            try {
              await surveyApi.deleteSurvey(id);
              setSurveys(prev => prev.filter(s => s.id !== id));
              Alert.alert('成功', '记录已删除');
            } catch (err: any) {
              Alert.alert('错误', err?.message || '删除失败');
            }
          },
        },
      ]
    );
  };

  const handleEdit = (survey: SurveyRecord) => {
    navigation.navigate('SurveyForm', {
      mode: 'edit',
      surveyId: survey.id,
      initialData: {
        farmName: survey.farmName,
        species: survey.species,
        stockCount: survey.stockCount.toString(),
        sickCount: survey.sickCount.toString(),
        deadCount: survey.deadCount.toString(),
        onsetDate: survey.onsetDate,
      },
    });
  };

  // ======================== 计算 ========================

  const calcRate = (num: number, total: number): string => {
    if (total <= 0) return '0.00';
    return ((num / total) * 100).toFixed(2);
  };

  // ======================== 渲染 ========================

  const renderTabs = () => (
    <View style={local.tabContainer}>
      <TouchableOpacity
        style={[local.tab, activeTab === 'all' && local.tabActive]}
        onPress={() => setActiveTab('all')}
      >
        <Text style={[local.tabText, activeTab === 'all' && local.tabTextActive]}>
          全部
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[local.tab, activeTab === 'draft' && local.tabActive]}
        onPress={() => setActiveTab('draft')}
      >
        <Text style={[local.tabText, activeTab === 'draft' && local.tabTextActive]}>
          草稿
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[local.tab, activeTab === 'formal' && local.tabActive]}
        onPress={() => setActiveTab('formal')}
      >
        <Text style={[local.tabText, activeTab === 'formal' && local.tabTextActive]}>
          正式
        </Text>
      </TouchableOpacity>
    </View>
  );

  const renderSurveyItem = ({ item }: { item: SurveyRecord }) => {
    const morbidityRate = calcRate(item.sickCount, item.stockCount);
    const mortalityRate = calcRate(item.deadCount, item.stockCount);

    return (
      <View style={local.surveyCard}>
        <TouchableOpacity
          style={local.surveyCardContent}
          onPress={() => handleEdit(item)}
          activeOpacity={0.7}
        >
          {/* 头部 */}
          <View style={local.cardHeader}>
            <View style={local.cardTitleRow}>
              <Text style={local.farmName} numberOfLines={1}>
                {item.farmName}
              </Text>
              {item.isDraft && (
                <View style={local.draftBadge}>
                  <Text style={local.draftBadgeText}>草稿</Text>
                </View>
              )}
            </View>
            <Text style={local.dateText}>{item.onsetDate || item.createdAt}</Text>
          </View>

          {/* 统计信息 */}
          <View style={local.statsGrid}>
            <View style={local.statCell}>
              <Text style={local.statLabel}>禽种</Text>
              <Text style={local.statValue}>{item.species || '-'}</Text>
            </View>
            <View style={local.statCell}>
              <Text style={local.statLabel}>存栏数</Text>
              <Text style={local.statValue}>{item.stockCount}</Text>
            </View>
            <View style={local.statCell}>
              <Text style={local.statLabel}>发病数</Text>
              <Text style={local.statValue}>{item.sickCount}</Text>
            </View>
            <View style={local.statCell}>
              <Text style={local.statLabel}>死亡数</Text>
              <Text style={local.statValue}>{item.deadCount}</Text>
            </View>
          </View>

          {/* 计算率 */}
          <View style={local.rateRow}>
            <View style={local.rateItem}>
              <Text style={local.rateLabel}>发病率</Text>
              <Text style={local.rateValue}>{morbidityRate}%</Text>
            </View>
            <View style={local.rateDivider} />
            <View style={local.rateItem}>
              <Text style={local.rateLabel}>死亡率</Text>
              <Text style={[local.rateValue, local.rateValueDanger]}>{mortalityRate}%</Text>
            </View>
          </View>
        </TouchableOpacity>

        {/* 操作按钮 */}
        <View style={local.cardActions}>
          <TouchableOpacity
            style={[local.actionBtn, local.actionBtnEdit]}
            onPress={() => handleEdit(item)}
          >
            <Text style={local.actionBtnText}>编辑</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[local.actionBtn, local.actionBtnDelete]}
            onPress={() => handleDelete(item.id)}
          >
            <Text style={[local.actionBtnText, local.actionBtnDeleteText]}>删除</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const renderEmpty = () => (
    <View style={styles.emptyState}>
      <Text style={styles.emptyStateText}>暂无流调记录</Text>
      <TouchableOpacity
        style={styles.addFirstRecordButton}
        onPress={() => navigation.navigate('SurveyForm', { mode: 'create' })}
      >
        <Text style={styles.addFirstRecordText}>新建流调记录</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <Header
        title="流行病学调查"
        showBackButton
        onBack={() => navigation.goBack()}
        rightComponent={
          <TouchableOpacity
            onPress={() => navigation.navigate('SurveyForm', { mode: 'create' })}
          >
            <Text style={{ color: '#2DBBA1', fontSize: 16, fontWeight: '600' }}>
              新增
            </Text>
          </TouchableOpacity>
        }
      />

      {renderTabs()}

      {error && (
        <View style={local.errorBox}>
          <Text style={local.errorText}>{error}</Text>
          <TouchableOpacity onPress={fetchSurveys} style={local.retryBtn}>
            <Text style={local.retryBtnText}>重试</Text>
          </TouchableOpacity>
        </View>
      )}

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#2DBBA1" />
        </View>
      ) : (
        <FlatList
          data={surveys}
          renderItem={renderSurveyItem}
          keyExtractor={item => item.id}
          contentContainerStyle={local.listContent}
          ListEmptyComponent={!error ? renderEmpty : null}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={['#2DBBA1']}
              tintColor="#2DBBA1"
            />
          }
        />
      )}
    </View>
  );
};

// ======================== 局部样式 ========================

const local = {
  tabContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    gap: 12,
  },
  tab: {
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
  },
  tabActive: {
    backgroundColor: '#2DBBA1',
  },
  tabText: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  tabTextActive: {
    color: '#FFFFFF',
    fontWeight: '600',
  },

  // 错误提示
  errorBox: {
    backgroundColor: '#FEF2F2',
    margin: 16,
    borderRadius: 8,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorText: {
    fontSize: 14,
    color: '#DC2626',
    marginRight: 12,
  },
  retryBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#DC2626',
    borderRadius: 6,
  },
  retryBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '500',
  },

  // 列表
  listContent: {
    padding: 16,
    paddingBottom: 32,
  },

  // 卡片
  surveyCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
    overflow: 'hidden',
  },
  surveyCardContent: {
    padding: 16,
  },

  // 卡片头部
  cardHeader: {
    marginBottom: 12,
  },
  cardTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  farmName: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  draftBadge: {
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
    marginLeft: 8,
  },
  draftBadgeText: {
    fontSize: 11,
    color: '#92400E',
    fontWeight: '500',
  },
  dateText: {
    fontSize: 13,
    color: '#9CA3AF',
  },

  // 统计网格
  statsGrid: {
    flexDirection: 'row',
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  statCell: {
    flex: 1,
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 4,
  },
  statValue: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1F2937',
  },

  // 比率行
  rateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  rateItem: {
    alignItems: 'center',
    flex: 1,
  },
  rateLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 2,
  },
  rateValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1F5E52',
  },
  rateValueDanger: {
    color: '#DC2626',
  },
  rateDivider: {
    width: 1,
    height: 30,
    backgroundColor: '#E5E7EB',
  },

  // 操作按钮
  cardActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    gap: 8,
  },
  actionBtn: {
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 6,
  },
  actionBtnEdit: {
    backgroundColor: '#E6F7F3',
  },
  actionBtnDelete: {
    backgroundColor: '#FEE2E2',
  },
  actionBtnText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#1F5E52',
  },
  actionBtnDeleteText: {
    color: '#DC2626',
  },
};

export default SurveyListScreen;
