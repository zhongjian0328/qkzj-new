import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, TouchableOpacity, ScrollView, ActivityIndicator, RefreshControl } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import Header from '../components/Header';
import { styles } from '../styles';
import { aiDiagnosisApi } from '../services/api';

const DiagnosisHistoryScreen: React.FC = () => {
  const navigation = useNavigation<any>();

  const [diagnosisHistory, setDiagnosisHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchHistory = useCallback(async (pageNum: number = 1, isRefresh: boolean = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else if (pageNum === 1) {
        setLoading(true);
      }
      setError(null);

      const response = await aiDiagnosisApi.getDiagnosisHistory({ page: pageNum, limit: 10 });
      const records = response.data?.diagnosisRecords || [];
      const pagination = response.data?.pagination;

      if (isRefresh || pageNum === 1) {
        setDiagnosisHistory(records);
      } else {
        setDiagnosisHistory(prev => [...prev, ...records]);
      }

      setHasMore(pagination ? pageNum < pagination.totalPages : records.length >= 10);
      setPage(pageNum);
    } catch (err) {
      setError('获取诊断历史失败，请稍后重试');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  const handleRefresh = () => fetchHistory(1, true);

  const handleLoadMore = () => {
    if (!loading && hasMore) {
      fetchHistory(page + 1);
    }
  };

  const handleViewReport = (diagnosisId: string) => {
    navigation.navigate('DiagnosisReport', { diagnosisId });
  };

  // 格式化时间
  const formatTime = (dateStr: string) => {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
  };

  // 获取诊断模式显示名
  const getDiagnosisMode = (record: any) => {
    return record.diagnosisMode === 'vet' ? 'AI兽医模式' : '对话问诊';
  };

  // 获取诊断结果摘要
  const getResultSummary = (record: any) => {
    if (record.finalDiagnosis) {
      return record.finalDiagnosis;
    }
    if (record.aiResponse) {
      const text = typeof record.aiResponse === 'string' ? record.aiResponse : JSON.stringify(record.aiResponse);
      return text.length > 80 ? text.substring(0, 80) + '...' : text;
    }
    return '待诊断';
  };

  // 获取状态
  const getStatus = (record: any) => {
    if (record.finalDiagnosis) return '已确诊';
    if (record.preDiagnosis) return '初步诊断';
    return '诊断中';
  };

  // 获取症状
  const getSymptoms = (record: any) => {
    return record.basicInfo?.symptoms || record.symptoms || [];
  };

  if (loading && diagnosisHistory.length === 0) {
    return (
      <View style={styles.container}>
        <Header title="诊断历史" showBackButton onBack={() => navigation.goBack()} />
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color="#2DBBA1" />
          <Text style={{ marginTop: 12, color: '#6B7280' }}>加载中...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header title="诊断历史" showBackButton onBack={() => navigation.goBack()} />

      <ScrollView
        contentContainerStyle={{ padding: 16, paddingBottom: 100 }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} colors={['#2DBBA1']} />}
      >
        {error && (
          <View style={{ padding: 16, backgroundColor: '#FEF2F2', borderRadius: 8, marginBottom: 12 }}>
            <Text style={{ color: '#DC2626', textAlign: 'center' }}>{error}</Text>
            <TouchableOpacity onPress={handleRefresh} style={{ marginTop: 8 }}>
              <Text style={{ color: '#2DBBA1', textAlign: 'center' }}>重试</Text>
            </TouchableOpacity>
          </View>
        )}

        {diagnosisHistory.length > 0 ? (
          <>
            {diagnosisHistory.map((record, index) => {
              const status = getStatus(record);
              const isConfirmed = status === '已确诊';
              return (
                <View key={record._id || index} style={styles.diagnosisHistoryItem}>
                  <View style={styles.diagnosisHistoryItemContent}>
                    <View style={styles.diagnosisHistoryItemInfo}>
                      <View style={styles.diagnosisHistoryItemHeader}>
                        <Text style={styles.diagnosisHistoryItemId}>{record._id?.slice(-8) || `#${index + 1}`}</Text>
                        <Text style={[styles.diagnosisHistoryItemStatus,
                          isConfirmed ? styles.statusConfirmed : styles.statusPreDiagnosis
                        ]}>
                          {status}
                        </Text>
                      </View>

                      <Text style={styles.diagnosisHistoryItemDate}>
                        {formatTime(record.diagnosisTime || record.createdAt)}
                      </Text>

                      <Text style={styles.diagnosisHistoryItemMode}>
                        诊断模式：{getDiagnosisMode(record)}
                      </Text>

                      <Text style={styles.diagnosisHistoryItemResult}>
                        {getResultSummary(record)}
                      </Text>

                      {getSymptoms(record).length > 0 && (
                        <View style={styles.diagnosisHistoryItemSymptoms}>
                          {getSymptoms(record).slice(0, 3).map((symptom: string, symIndex: number) => (
                            <Text key={symIndex} style={styles.diagnosisHistoryItemSymptomTag}>
                              {symptom}
                            </Text>
                          ))}
                          {getSymptoms(record).length > 3 && (
                            <Text style={styles.diagnosisHistoryItemSymptomMore}>
                              +{getSymptoms(record).length - 3}个症状
                            </Text>
                          )}
                        </View>
                      )}
                    </View>
                  </View>

                  <View style={styles.diagnosisHistoryItemActions}>
                    <TouchableOpacity
                      style={styles.diagnosisHistoryItemActionButton}
                      onPress={() => handleViewReport(record._id)}
                    >
                      <Text style={styles.diagnosisHistoryItemActionText}>查看报告</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              );
            })}

            {hasMore && (
              <TouchableOpacity
                onPress={handleLoadMore}
                style={{ padding: 16, alignItems: 'center' }}
                disabled={loading}
              >
                <Text style={{ color: '#2DBBA1' }}>{loading ? '加载中...' : '加载更多'}</Text>
              </TouchableOpacity>
            )}
          </>
        ) : (
          <View style={styles.emptyHistoryContainer}>
            <Ionicons name="clipboard-outline" size={48} color="#9CA3AF" />
            <Text style={styles.emptyHistoryTitle}>暂无诊断历史</Text>
            <Text style={styles.emptyHistoryText}>开始您的第一次AI诊断，记录将保存在这里</Text>
            <TouchableOpacity
              style={styles.emptyHistoryButton}
              onPress={() => navigation.navigate('DiagnosisHome')}
            >
              <Text style={styles.emptyHistoryButtonText}>开始AI诊断</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

export default DiagnosisHistoryScreen;
