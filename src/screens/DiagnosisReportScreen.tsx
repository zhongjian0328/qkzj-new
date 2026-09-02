import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import Header from '../components/Header';
import { styles } from '../styles';
import { aiDiagnosisApi } from '../services/api';

const DiagnosisReportScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { diagnosisId } = route.params || {};

  const [reportData, setReportData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activePlanTab, setActivePlanTab] = useState<string>('0-24小时');

  useEffect(() => {
    if (!diagnosisId) {
      setError('缺少诊断记录ID');
      setLoading(false);
      return;
    }
    fetchReport();
  }, [diagnosisId]);

  const fetchReport = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await aiDiagnosisApi.getDiagnosisDetail(diagnosisId);
      setReportData(response.data?.diagnosisRecord || null);
    } catch (err: any) {
      setError(err?.response?.data?.message || '获取诊断报告失败');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveReport = async () => {
    try {
      await aiDiagnosisApi.saveDiagnosis(diagnosisId);
      Alert.alert('提示', '报告已保存');
    } catch (err: any) {
      Alert.alert('保存失败', err?.response?.data?.message || '请稍后重试');
    }
  };

  const formatTime = (dateStr: string) => {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Header title="AI诊断报告" showBackButton onBack={() => navigation.goBack()} />
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color="#2DBBA1" />
          <Text style={{ marginTop: 12, color: '#6B7280' }}>加载报告...</Text>
        </View>
      </View>
    );
  }

  if (error || !reportData) {
    return (
      <View style={styles.container}>
        <Header title="AI诊断报告" showBackButton onBack={() => navigation.goBack()} />
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 }}>
          <Text style={{ fontSize: 48 }}>📋</Text>
          <Text style={{ fontSize: 18, fontWeight: '600', marginTop: 16, color: '#374151' }}>
            {error || '未找到诊断报告'}
          </Text>
          <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginTop: 16 }}>
            <Text style={{ color: '#2DBBA1' }}>返回</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  const basicInfo = reportData.basicInfo || {};
  const symptoms = basicInfo.symptoms || [];
  const aiResponse = reportData.aiResponse || {};
  const diagnosisMode = reportData.diagnosisMode === 'vet' ? 'AI兽医模式' : '对话问诊';

  // 解析AI响应
  const parsedResponse = typeof aiResponse === 'string' ? (() => {
    try { return JSON.parse(aiResponse); } catch { return { text: aiResponse }; }
  })() : aiResponse;

  const diagnosis = parsedResponse.diagnosis || parsedResponse.diseaseName || reportData.finalDiagnosis || '待确诊';
  const confidence = parsedResponse.confidence || parsedResponse.confidenceLevel || '';
  const controlAdvice = parsedResponse.controlAdvice || parsedResponse.emergencyMeasures || [];
  const preventionPoints = parsedResponse.preventionPoints || parsedResponse.longTermPrevention || [];

  // 应急方案阶段
  const planTabs = ['0-24小时', '1-7天', '生物安全'];
  const currentPlanItems = activePlanTab === '0-24小时'
    ? (controlAdvice.slice(0, 4) || [])
    : activePlanTab === '1-7天'
      ? (controlAdvice.slice(4) || [])
      : (preventionPoints || []);

  return (
    <View style={styles.container}>
      <Header title="AI诊断报告" showBackButton onBack={() => navigation.goBack()} />

      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 100 }}>
        {/* 报告头部 */}
        <View style={styles.reportHeader}>
          <View style={styles.reportHeaderContent}>
            <View>
              <Text style={styles.reportTitle}>诊断报告</Text>
              <Text style={styles.reportNumber}>编号：{diagnosisId?.slice(-8)}</Text>
            </View>
            <View style={styles.reportTimeInfo}>
              <Text style={styles.reportTime}>时间：{formatTime(reportData.diagnosisTime || reportData.createdAt)}</Text>
              <Text style={styles.reportTime}>模式：{diagnosisMode}</Text>
            </View>
          </View>
        </View>

        {/* 发病基本情况 */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>发病基本情况</Text>
          <View style={styles.infoGrid}>
            {basicInfo.farmLocation && (
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>场址</Text>
                <Text style={styles.infoValue}>{basicInfo.farmLocation}</Text>
              </View>
            )}
            {basicInfo.chickenBreed && (
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>品种</Text>
                <Text style={styles.infoValue}>{basicInfo.chickenBreed}</Text>
              </View>
            )}
            {basicInfo.ageDays && (
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>日龄</Text>
                <Text style={styles.infoValue}>{basicInfo.ageDays}天</Text>
              </View>
            )}
            {basicInfo.stockQuantity && (
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>存栏量</Text>
                <Text style={styles.infoValue}>{basicInfo.stockQuantity}只</Text>
              </View>
            )}
          </View>

          {symptoms.length > 0 && (
            <View style={styles.symptomsSection}>
              <Text style={styles.infoLabel}>核心症状</Text>
              <View style={styles.symptomsList}>
                {symptoms.map((symptom: string, index: number) => (
                  <View key={index} style={styles.symptomTag}>
                    <Text style={styles.symptomTagText}>{symptom}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}
        </View>

        {/* AI诊断结论 */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>AI诊断结论</Text>
          <View style={styles.conclusionCard}>
            <Text style={styles.conclusionTitle}>{diagnosis}</Text>
            {confidence && <Text style={{ color: '#6B7280', marginTop: 4 }}>置信度：{confidence}</Text>}
          </View>

          {parsedResponse.diagnosticBasis && (
            <View style={styles.basisSection}>
              <Text style={styles.basisTitle}>诊断依据：</Text>
              <View style={styles.basisList}>
                {(Array.isArray(parsedResponse.diagnosticBasis) ? parsedResponse.diagnosticBasis : [parsedResponse.diagnosticBasis]).map((item: any, index: number) => (
                  <Text key={index} style={styles.basisItem}>• {typeof item === 'string' ? item : JSON.stringify(item)}</Text>
                ))}
              </View>
            </View>
          )}
        </View>

        {/* 防控建议 */}
        {controlAdvice.length > 0 && (
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>防控建议</Text>
            <View style={styles.planTabs}>
              {planTabs.map(tab => (
                <TouchableOpacity
                  key={tab}
                  style={[styles.planTab, activePlanTab === tab && styles.planTabActive]}
                  onPress={() => setActivePlanTab(tab)}
                >
                  <Text style={[styles.planTabText, activePlanTab === tab && styles.planTabTextActive]}>{tab}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <View style={styles.planContent}>
              {(Array.isArray(currentPlanItems) ? currentPlanItems : []).map((item: any, index: number) => (
                <View key={index} style={styles.planItem}>
                  <Text style={styles.planItemIcon}>✓</Text>
                  <View>
                    <Text style={styles.planItemTitle}>{item.title || item.measure || `建议${index + 1}`}</Text>
                    <Text style={styles.planItemDescription}>{item.description || (typeof item === 'string' ? item : '')}</Text>
                  </View>
                </View>
              ))}
              {(!Array.isArray(currentPlanItems) || currentPlanItems.length === 0) && (
                <Text style={{ color: '#6B7280', textAlign: 'center', padding: 16 }}>暂无{activePlanTab}阶段建议</Text>
              )}
            </View>
          </View>
        )}

        {/* 操作按钮 */}
        <TouchableOpacity style={styles.saveButton} onPress={handleSaveReport}>
          <Text style={styles.saveButtonText}>保存诊断报告</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

export default DiagnosisReportScreen;
