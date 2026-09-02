import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import Header from '../components/Header';
import { followUpApi } from '../services/api';
import { styles } from '../styles';

const TYPE_LABELS: Record<string, string> = { day3: '第3日回访', day7: '第7日回访', custom: '自定义回访' };
const STATUS_LABELS: Record<string, string> = { pending: '待回访', completed: '已完成', overdue: '逾期', cancelled: '已取消' };

const QUESTIONS = [
  { key: 'mortalityChange', label: '死亡率变化', placeholder: '描述死亡率是否改善' },
  { key: 'symptomImprovement', label: '症状改善', placeholder: '描述症状是否有好转' },
  { key: 'medicationCompliance', label: '用药依从性', placeholder: '是否按方案执行用药' },
  { key: 'sideEffects', label: '不良反应', placeholder: '是否有药物不良反应' },
  { key: 'feedIntakeChange', label: '采食量变化', placeholder: '描述采食量变化' },
  { key: 'additionalSymptoms', label: '新增症状', placeholder: '是否出现新的症状' },
  { key: 'overallAssessment', label: '总体评估', placeholder: '整体治疗效果评估' },
];

export default function FollowUpDetailScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { followUpId } = route.params;
  const [followUp, setFollowUp] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const res = await followUpApi.getFollowUpById(followUpId);
        const data = res?.data;
        setFollowUp(data);
        if (data?.questions) {
          setAnswers(data.questions);
        }
      } catch (e: any) {
        Alert.alert('错误', '获取回访详情失败');
      } finally {
        setLoading(false);
      }
    })();
  }, [followUpId]);

  const handleSubmit = async () => {
    if (!answers.overallAssessment || !answers.symptomImprovement) {
      Alert.alert('提示', '请至少填写"症状改善"和"总体评估"');
      return;
    }
    setSubmitting(true);
    try {
      const res = await followUpApi.completeFollowUp(followUpId, { questions: answers });
      if (res?.data) {
        setFollowUp(res.data);
        Alert.alert('提交成功', res.data.aiAssessment
          ? `AI评估：${res.data.aiAssessment.effectiveness}\n建议：${res.data.aiAssessment.recommendation}`
          : '回访已完成'
        );
      }
    } catch (e: any) {
      Alert.alert('错误', e.message || '提交失败');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}><ActivityIndicator size="large" color="#2DBBA1" /></View>;
  if (!followUp) return <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}><Text>回访不存在</Text></View>;

  const isCompleted = followUp.status === 'completed';

  return (
    <View style={styles.container}>
      <Header title="回访问卷" showBackButton onBack={() => navigation.goBack()} />
      <ScrollView style={{ padding: 12, gap: 12 }}>
        {/* 回访信息 */}
        <View style={styles.card}>
          <Text style={{ fontSize: 16, fontWeight: '600', color: '#111827', marginBottom: 4 }}>
            {TYPE_LABELS[followUp.followUpType]}
          </Text>
          <Text style={{ fontSize: 13, color: '#6B7280' }}>
            状态：{STATUS_LABELS[followUp.status]} | 计划日期：{new Date(followUp.scheduledDate).toLocaleDateString('zh-CN')}
          </Text>
          {followUp.planId && (
            <Text style={{ fontSize: 13, color: '#4B5563', marginTop: 4 }}>
              关联预案：{followUp.planId.planName || followUp.planId.diseaseName}
            </Text>
          )}
        </View>

        {/* 回访问卷表单 */}
        {!isCompleted && QUESTIONS.map(q => (
          <View key={q.key} style={styles.card}>
            <Text style={{ fontSize: 14, fontWeight: '600', color: '#111827', marginBottom: 8 }}>{q.label}</Text>
            <TextInput
              style={[styles.formInput, { minHeight: 60, textAlignVertical: 'top' }]}
              placeholder={q.placeholder}
              value={answers[q.key] || ''}
              onChangeText={(text) => setAnswers(prev => ({ ...prev, [q.key]: text }))}
              multiline
            />
          </View>
        ))}

        {/* 回访备注 */}
        {!isCompleted && (
          <View style={styles.card}>
            <Text style={{ fontSize: 14, fontWeight: '600', color: '#111827', marginBottom: 8 }}>备注</Text>
            <TextInput
              style={[styles.formInput, { minHeight: 60, textAlignVertical: 'top' }]}
              placeholder="其他补充说明"
              value={answers.notes || ''}
              onChangeText={(text) => setAnswers(prev => ({ ...prev, notes: text }))}
              multiline
            />
          </View>
        )}

        {/* AI 评估结果 */}
        {isCompleted && followUp.aiAssessment && (
          <View style={[styles.card, { backgroundColor: '#F0FFF4', borderWidth: 1, borderColor: '#C6F6D5' }]}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 12 }}>
              <Ionicons name="hardware-chip" size={18} color="#2DBBA1" />
              <Text style={{ fontSize: 16, fontWeight: '600', color: '#22543D' }}>AI 回访评估</Text>
            </View>
            <View style={{ gap: 8 }}>
              <View>
                <Text style={{ fontSize: 13, fontWeight: '600', color: '#22543D' }}>效果评估</Text>
                <Text style={{ fontSize: 14, color: '#276749' }}>{followUp.aiAssessment.effectiveness}</Text>
              </View>
              <View>
                <Text style={{ fontSize: 13, fontWeight: '600', color: '#22543D' }}>调整建议</Text>
                <Text style={{ fontSize: 14, color: '#276749' }}>{followUp.aiAssessment.recommendation || '无需调整'}</Text>
              </View>
              <View>
                <Text style={{ fontSize: 13, fontWeight: '600', color: '#22543D' }}>是否需要调整</Text>
                <Text style={{ fontSize: 14, color: '#276749' }}>{followUp.aiAssessment.needAdjustment ? '是，已自动创建下次回访' : '否，当前方案有效'}</Text>
              </View>
              {followUp.aiAssessment.nextFollowUpDate && (
                <Text style={{ fontSize: 13, color: '#6B7280' }}>
                  下次回访：{new Date(followUp.aiAssessment.nextFollowUpDate).toLocaleDateString('zh-CN')}
                </Text>
              )}
            </View>
          </View>
        )}
      </ScrollView>

      {/* 提交按钮 */}
      {!isCompleted && (
        <View style={{ padding: 16, backgroundColor: '#FFFFFF', borderTopWidth: 1, borderTopColor: '#E5E7EB' }}>
          <TouchableOpacity
            style={[styles.primaryButton, submitting && { opacity: 0.6 }]}
            onPress={handleSubmit}
            disabled={submitting}
          >
            {submitting ? (
              <>
                <ActivityIndicator size="small" color="#FFFFFF" />
                <Text style={[styles.primaryButtonText, { marginLeft: 8 }]}>AI评估中...</Text>
              </>
            ) : (
              <>
                <Ionicons name="checkmark-circle" size={20} color="#FFFFFF" />
                <Text style={[styles.primaryButtonText, { marginLeft: 8 }]}>提交回访</Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}
