import { colors } from '../theme';
import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, TouchableOpacity, ScrollView, TextInput, ActivityIndicator, RefreshControl, Modal, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import Header from '../components/Header';
import { styles } from '../styles';
import { aiDiagnosisApi, epidemicApi } from '../services/api';

const ReportAuditScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedReport, setSelectedReport] = useState<any | null>(null);
  const [auditComment, setAuditComment] = useState('');
  const [auditing, setAuditing] = useState(false);

  const fetchReports = useCallback(async (isRefresh = false) => {
    try {
      if (isRefresh) setRefreshing(true); else setLoading(true);
      setError(null);
      // 获取异常高发报警（高风险诊断记录）
      const response = await epidemicApi.getAbnormalAlerts({ page: 1, limit: 50 });
      const data = response.data?.alerts || [];
      setReports(data);
    } catch (err) {
      console.error('获取待审核报告失败:', err);
      setError('加载待审核报告失败，请稍后重试');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => { fetchReports(); }, [fetchReports]);

  const handleAudit = async (status: 'REVIEWED' | 'REVISED') => {
    if (!selectedReport) return;
    setAuditing(true);
    try {
      await aiDiagnosisApi.auditReport(selectedReport._id || selectedReport.id, {
        auditStatus: status,
        auditComments: auditComment
      });
      Alert.alert('成功', status === 'REVIEWED' ? '报告已审核通过' : '报告已标记需修订');
      setSelectedReport(null);
      setAuditComment('');
      fetchReports(true);
    } catch (err) {
      Alert.alert('错误', '审核操作失败，请重试');
    } finally {
      setAuditing(false);
    }
  };

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'EXTREME': return colors.errorText;
      case 'HIGH': return colors.error;
      case 'MEDIUM': return colors.warning;
      case 'LOW': return colors.success;
      default: return colors.textTertiary;
    }
  };

  const getRiskText = (level: string) => {
    switch (level) {
      case 'EXTREME': return '极高';
      case 'HIGH': return '高';
      case 'MEDIUM': return '中';
      case 'LOW': return '低';
      default: return '未知';
    }
  };

  return (
    <View style={styles.container}>
      <Header title="报告审核" showBackButton onBack={() => navigation.goBack()} />

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>正在加载待审核报告...</Text>
        </View>
      ) : error ? (
        <View style={styles.loadingContainer}>
          <Ionicons name="alert-circle-outline" size={48} color={colors.textDisabled} />
          <Text style={{ fontSize: 16, color: colors.textTertiary, marginBottom: 16 }}>{error}</Text>
          <TouchableOpacity style={{ backgroundColor: colors.primary, borderRadius: 8, paddingHorizontal: 24, paddingVertical: 10 }} onPress={() => fetchReports()}>
            <Text style={{ color: colors.surface, fontSize: 16, fontWeight: '600' }}>重试</Text>
          </TouchableOpacity>
        </View>
      ) : reports.length === 0 ? (
        <View style={styles.loadingContainer}>
          <Ionicons name="checkmark-circle-outline" size={48} color={colors.success} />
          <Text style={{ fontSize: 16, color: colors.textTertiary }}>暂无待审核报告</Text>
        </View>
      ) : (
        <ScrollView
          contentContainerStyle={{ padding: 16 }}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => fetchReports(true)} colors={[colors.primary]} />}
        >
          <Text style={{ fontSize: 16, fontWeight: '600', color: colors.textTertiary, marginBottom: 12 }}>
            待审核报告 ({reports.length} 条)
          </Text>

          {reports.map((report) => {
            const riskLevel = report.mixedInfectionRisk?.riskLevel || 'LOW';
            const diseases = (report.singleDiagnosis || []).map((d: any) => d.pathogenName).join('、');
            return (
              <TouchableOpacity
                key={report._id || report.id}
                style={{
                  backgroundColor: colors.surface,
                  borderRadius: 12,
                  padding: 16,
                  marginBottom: 12,
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.06,
                  shadowRadius: 3.84,
                  elevation: 2,
                  borderLeftWidth: 4,
                  borderLeftColor: getRiskColor(riskLevel),
                }}
                onPress={() => {
                  setSelectedReport(report);
                  setAuditComment('');
                }}
              >
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                  <Text style={{ fontSize: 16, fontWeight: '600', color: colors.textPrimary, flex: 1 }}>
                    {report.userId?.nickname || '未知用户'}
                  </Text>
                  <View style={{ backgroundColor: getRiskColor(riskLevel), paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 }}>
                    <Text style={{ fontSize: 12, fontWeight: '600', color: colors.surface }}>
                      {getRiskText(riskLevel)}风险
                    </Text>
                  </View>
                </View>

                <Text style={{ fontSize: 14, color: colors.textSecondary, marginBottom: 4 }}>
                  诊断病原：{diseases || '未识别'}
                </Text>
                <Text style={{ fontSize: 12, color: colors.textDisabled }}>
                  {report.diagnosisTime ? new Date(report.diagnosisTime).toLocaleString('zh-CN') : ''}
                </Text>
                {report.auditStatus && report.auditStatus !== 'UNREVIEWED' && (
                  <Text style={{ fontSize: 12, color: colors.primary, marginTop: 4 }}>
                    已审核
                  </Text>
                )}
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      )}

      {/* 审核弹窗 */}
      <Modal visible={!!selectedReport} transparent animationType="slide" onRequestClose={() => setSelectedReport(null)}>
        <View style={{ flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <View style={{ backgroundColor: colors.surface, borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 20, maxHeight: '80%' }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <Text style={{ fontSize: 18, fontWeight: '600', color: colors.textPrimary }}>报告审核</Text>
              <TouchableOpacity onPress={() => setSelectedReport(null)}>
                <Ionicons name="close" size={24} color={colors.textDisabled} />
              </TouchableOpacity>
            </View>

            {selectedReport && (
              <ScrollView>
                <Text style={{ fontSize: 14, color: colors.textSecondary, marginBottom: 8 }}>
                  申请人：{selectedReport.userId?.nickname || '未知'}
                </Text>
                <Text style={{ fontSize: 14, color: colors.textSecondary, marginBottom: 8 }}>
                  病原：{(selectedReport.singleDiagnosis || []).map((d: any) => d.pathogenName).join('、')}
                </Text>
                <Text style={{ fontSize: 14, color: colors.textSecondary, marginBottom: 16 }}>
                  核心威胁：{selectedReport.coreThreat || '无'}
                </Text>

                <Text style={{ fontSize: 14, fontWeight: '600', color: colors.textPrimary, marginBottom: 8 }}>审核意见</Text>
                <TextInput
                  style={{
                    borderWidth: 1,
                    borderColor: colors.border,
                    borderRadius: 8,
                    padding: 12,
                    minHeight: 80,
                    fontSize: 14,
                    textAlignVertical: 'top',
                    marginBottom: 16,
                  }}
                  placeholder="请输入审核意见..."
                  placeholderTextColor={colors.textDisabled}
                  value={auditComment}
                  onChangeText={setAuditComment}
                  multiline
                />

                <View style={{ flexDirection: 'row', gap: 12, marginBottom: 20 }}>
                  <TouchableOpacity
                    style={{ flex: 1, backgroundColor: colors.warningLight, borderRadius: 8, padding: 14, alignItems: 'center' }}
                    onPress={() => handleAudit('REVISED')}
                    disabled={auditing}
                  >
                    <Text style={{ fontSize: 14, fontWeight: '600', color: colors.warningText }}>需修订</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={{ flex: 1, backgroundColor: colors.primary, borderRadius: 8, padding: 14, alignItems: 'center' }}
                    onPress={() => handleAudit('REVIEWED')}
                    disabled={auditing}
                  >
                    <Text style={{ fontSize: 14, fontWeight: '600', color: colors.surface }}>
                      {auditing ? '处理中...' : '审核通过'}
                    </Text>
                  </TouchableOpacity>
                </View>
              </ScrollView>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default ReportAuditScreen;
