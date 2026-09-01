import React, { useState, useCallback, useEffect } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, TextInput,
  ActivityIndicator, Alert, Modal, Image,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import Header from '../components/Header';
import { teachingCaseApi } from '../services/api';
import { StyleSheet } from 'react-native';

const COLORS = {
  primary: '#2DBBA1',
  primaryDark: '#1F5E52',
  bgLight: '#E6F7F3',
  text: '#1F2937',
  textSecondary: '#6B7280',
  border: '#E5E7EB',
  danger: '#EF4444',
  warning: '#F59E0B',
};

const STATUS_CONFIG: Record<string, { color: string; label: string }> = {
  draft: { color: '#9CA3AF', label: '草稿' },
  pending_review: { color: COLORS.warning, label: '待审核' },
  approved: { color: '#22C55E', label: '已通过' },
  rejected: { color: COLORS.danger, label: '已驳回' },
};

type RootStackParamList = {
  TeachingCaseDetail: { caseId: string };
};

export default function TeachingCaseDetailScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<RouteProp<RootStackParamList, 'TeachingCaseDetail'>>();
  const { caseId } = route.params;
  const isNew = caseId === 'new';

  const [caseData, setCaseData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    description: true, keyFindings: false, process: false, result: false, experience: false,
  });

  // 编辑状态
  const [isEditing, setIsEditing] = useState(isNew);
  const [editForm, setEditForm] = useState<any>({
    title: '', diseaseType: '', description: '', keyFindings: '',
    process: '', result: '', experience: '',
  });

  // 审核弹窗
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewStatus, setReviewStatus] = useState<'approved' | 'rejected'>('approved');
  const [reviewComment, setReviewComment] = useState('');

  const fetchCase = useCallback(async () => {
    if (isNew) { setLoading(false); setIsEditing(true); return; }
    try {
      const res = await teachingCaseApi.getCaseById(caseId);
      const data = res?.data || res;
      setCaseData(data);
      setEditForm({
        title: data.title || '',
        diseaseType: data.diseaseType || '',
        description: data.description || '',
        keyFindings: data.keyFindings || '',
        process: data.process || '',
        result: data.result || '',
        experience: data.experience || '',
      });
    } catch (e: any) {
      console.error('获取案例详情失败:', e.message);
      Alert.alert('错误', '获取案例详情失败');
    } finally {
      setLoading(false);
    }
  }, [caseId, isNew]);

  useEffect(() => { fetchCase(); }, [fetchCase]);

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const handleSubmitForReview = async () => {
    if (isNew || !caseData) return;
    try {
      await teachingCaseApi.submitForReview(caseId);
      Alert.alert('成功', '已提交审核');
      fetchCase();
    } catch (e: any) {
      Alert.alert('错误', e.message || '提交审核失败');
    }
  };

  const handleSave = async () => {
    if (!editForm.title.trim()) { Alert.alert('提示', '请输入标题'); return; }
    try {
      if (isNew) {
        await teachingCaseApi.createCase(editForm);
        Alert.alert('成功', '案例已创建', [
          { text: '确定', onPress: () => navigation.goBack() },
        ]);
      } else {
        await teachingCaseApi.updateCase(caseId, editForm);
        Alert.alert('成功', '案例已更新');
        setIsEditing(false);
        fetchCase();
      }
    } catch (e: any) {
      Alert.alert('错误', e.message || '保存失败');
    }
  };

  const handleReview = async () => {
    if (!caseId) return;
    try {
      await teachingCaseApi.reviewCase(caseId, {
        status: reviewStatus,
        comment: reviewComment.trim() || undefined,
      });
      setShowReviewModal(false);
      Alert.alert('成功', `案例已${reviewStatus === 'approved' ? '通过' : '驳回'}`);
      fetchCase();
    } catch (e: any) {
      Alert.alert('错误', e.message || '审核失败');
    }
  };

  const renderCollapsibleSection = (key: string, title: string, content: string) => {
    const isExpanded = expandedSections[key];
    const displayContent = isEditing ? (editForm as any)[key] : content;

    return (
      <View style={styles.section}>
        <TouchableOpacity style={styles.sectionHeader} onPress={() => toggleSection(key)}>
          <Text style={styles.sectionTitle}>{title}</Text>
          <Text style={styles.expandIcon}>{isExpanded ? '▲' : '▼'}</Text>
        </TouchableOpacity>
        {isExpanded && (
          isEditing ? (
            <TextInput
              style={styles.editInput}
              value={displayContent || ''}
              onChangeText={(text) => setEditForm((prev: any) => ({ ...prev, [key]: text }))}
              multiline
              textAlignVertical="top"
              placeholder={`请输入${title}`}
            />
          ) : (
            <Text style={styles.sectionContent}>{displayContent || '暂无内容'}</Text>
          )
        )}
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Header title="教学案例详情" showBackButton onBack={() => navigation.goBack()} />
        <View style={{ justifyContent: 'center', alignItems: 'center', flex: 1 }}>
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      </View>
    );
  }

  const status = caseData ? (STATUS_CONFIG[caseData.status] || STATUS_CONFIG.draft) : null;

  return (
    <View style={styles.container}>
      <Header
        title={isNew ? '创建教学案例' : '教学案例详情'}
        showBackButton
        onBack={() => navigation.goBack()}
      />

      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
        {isEditing && caseData ? (
          /* 编辑模式 */
          <>
            <View style={styles.section}>
              <Text style={styles.label}>案例标题 <Text style={styles.required}>*</Text></Text>
              <TextInput
                style={styles.editInput}
                value={editForm.title}
                onChangeText={(text) => setEditForm((prev: any) => ({ ...prev, title: text }))}
                placeholder="请输入案例标题"
              />
            </View>
            <View style={styles.section}>
              <Text style={styles.label}>疾病类型 <Text style={styles.required}>*</Text></Text>
              <TextInput
                style={styles.editInput}
                value={editForm.diseaseType}
                onChangeText={(text) => setEditForm((prev: any) => ({ ...prev, diseaseType: text }))}
                placeholder="例如：新城疫"
              />
            </View>
            {renderCollapsibleSection('description', '案例描述', caseData?.description)}
            {renderCollapsibleSection('keyFindings', '关键发现', caseData?.keyFindings)}
            {renderCollapsibleSection('process', '处理过程', caseData?.process)}
            {renderCollapsibleSection('result', '结果', caseData?.result)}
            {renderCollapsibleSection('experience', '经验总结', caseData?.experience)}
          </>
        ) : caseData ? (
          /* 查看模式 */
          <>
            {/* 案例头部信息 */}
            <View style={styles.headerSection}>
              <Text style={styles.title}>{caseData.title}</Text>
              <View style={styles.metaRow}>
                <View style={[styles.tag, { backgroundColor: COLORS.bgLight }]}>
                  <Text style={[styles.tagText, { color: COLORS.primaryDark }]}>{caseData.diseaseType}</Text>
                </View>
                {status && (
                  <View style={[styles.tag, { backgroundColor: status.color + '20' }]}>
                    <Text style={[styles.tagText, { color: status.color }]}>{status.label}</Text>
                  </View>
                )}
              </View>
              <View style={styles.metaInfo}>
                <Text style={styles.metaText}>
                  作者：{caseData.authorName || caseData.author || '匿名'}
                </Text>
                <Text style={styles.metaText}>
                  时间：{caseData.createdAt ? new Date(caseData.createdAt).toLocaleDateString('zh-CN') : '-'}
                </Text>
                <Text style={styles.metaText}>
                  浏览：{caseData.viewCount || 0}
                </Text>
              </View>
            </View>

            {/* 折叠内容区 */}
            {renderCollapsibleSection('description', '案例描述', caseData.description)}
            {renderCollapsibleSection('keyFindings', '关键发现', caseData.keyFindings)}
            {renderCollapsibleSection('process', '处理过程', caseData.process)}
            {renderCollapsibleSection('result', '结果', caseData.result)}
            {renderCollapsibleSection('experience', '经验总结', caseData.experience)}

            {/* 图片画廊 */}
            {caseData.caseImages && caseData.caseImages.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>相关图片</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  {caseData.caseImages.map((img: string, idx: number) => (
                    <Image
                      key={idx}
                      source={{ uri: img }}
                      style={styles.galleryImage}
                      resizeMode="cover"
                    />
                  ))}
                </ScrollView>
              </View>
            )}

            {/* 导师评语 */}
            {caseData.mentorComment && (
              <View style={[styles.section, { backgroundColor: COLORS.bgLight, borderColor: COLORS.primary }]}>
                <Text style={styles.sectionTitle}>导师评语</Text>
                <Text style={styles.sectionContent}>{caseData.mentorComment}</Text>
              </View>
            )}
          </>
        ) : null}
      </ScrollView>

      {/* 底部操作栏 */}
      {caseData && !isEditing && (
        <View style={styles.actionBar}>
          {/* 作者视角 */}
          {(caseData.status === 'draft' || caseData.status === 'rejected') && (
            <TouchableOpacity style={[styles.actionButton, { backgroundColor: COLORS.primary }]} onPress={() => setIsEditing(true)}>
              <Text style={styles.actionButtonText}>编辑案例</Text>
            </TouchableOpacity>
          )}
          {caseData.status === 'draft' && (
            <TouchableOpacity style={[styles.actionButton, { backgroundColor: '#22C55E' }]} onPress={handleSubmitForReview}>
              <Text style={styles.actionButtonText}>提交审核</Text>
            </TouchableOpacity>
          )}
          {/* 导师视角 */}
          {caseData.status === 'pending_review' && (
            <View style={{ flexDirection: 'row', gap: 8 }}>
              <TouchableOpacity
                style={[styles.actionButton, { flex: 1, backgroundColor: '#22C55E' }]}
                onPress={() => { setReviewStatus('approved'); setReviewComment(''); setShowReviewModal(true); }}
              >
                <Text style={styles.actionButtonText}>审核通过</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.actionButton, { flex: 1, backgroundColor: COLORS.danger }]}
                onPress={() => { setReviewStatus('rejected'); setReviewComment(''); setShowReviewModal(true); }}
              >
                <Text style={styles.actionButtonText}>驳回</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      )}

      {/* 编辑模式保存按钮 */}
      {isEditing && (
        <View style={styles.actionBar}>
          <View style={{ flexDirection: 'row', gap: 8 }}>
            <TouchableOpacity style={[styles.actionButton, { flex: 1, backgroundColor: '#F3F4F6' }]} onPress={() => { setIsEditing(false); if (isNew) navigation.goBack(); }}>
              <Text style={[styles.actionButtonText, { color: COLORS.textSecondary }]}>取消</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.actionButton, { flex: 1, backgroundColor: COLORS.primary }]} onPress={handleSave}>
              <Text style={styles.actionButtonText}>保存</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* 审核弹窗 */}
      <Modal visible={showReviewModal} transparent animationType="fade" onRequestClose={() => setShowReviewModal(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              {reviewStatus === 'approved' ? '审核通过' : '驳回案例'}
            </Text>
            <TextInput
              style={styles.reviewInput}
              placeholder="请输入审核评语（可选）"
              value={reviewComment}
              onChangeText={setReviewComment}
              multiline
              maxLength={500}
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity style={[styles.modalButton, { backgroundColor: '#F3F4F6' }]} onPress={() => setShowReviewModal(false)}>
                <Text style={[styles.modalButtonText, { color: COLORS.textSecondary }]}>取消</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, { backgroundColor: reviewStatus === 'approved' ? '#22C55E' : COLORS.danger }]}
                onPress={handleReview}
              >
                <Text style={styles.modalButtonText}>确认</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB' },
  scroll: { flex: 1 },
  scrollContent: { paddingBottom: 100 },
  headerSection: { backgroundColor: '#FFFFFF', margin: 12, borderRadius: 12, padding: 16, borderWidth: 1, borderColor: COLORS.border },
  title: { fontSize: 18, fontWeight: '700', color: COLORS.text, marginBottom: 10 },
  metaRow: { flexDirection: 'row', gap: 8, marginBottom: 10 },
  tag: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  tagText: { fontSize: 13, fontWeight: '500' },
  metaInfo: { gap: 4 },
  metaText: { fontSize: 13, color: COLORS.textSecondary },
  section: { backgroundColor: '#FFFFFF', marginHorizontal: 12, marginBottom: 8, borderRadius: 12, padding: 14, borderWidth: 1, borderColor: COLORS.border },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  sectionTitle: { fontSize: 15, fontWeight: '600', color: COLORS.text },
  sectionContent: { fontSize: 14, color: COLORS.textSecondary, lineHeight: 22, marginTop: 8 },
  expandIcon: { fontSize: 12, color: COLORS.textSecondary },
  label: { fontSize: 14, fontWeight: '600', color: COLORS.text, marginBottom: 8 },
  required: { color: COLORS.danger },
  editInput: {
    borderWidth: 1, borderColor: COLORS.border, borderRadius: 8,
    paddingHorizontal: 12, paddingVertical: 10, fontSize: 14,
    backgroundColor: '#FAFAFA', color: COLORS.text, minHeight: 40,
    textAlignVertical: 'top',
  },
  galleryImage: { width: 120, height: 120, borderRadius: 8, marginRight: 8, backgroundColor: '#F3F4F6' },
  actionBar: { padding: 12, backgroundColor: '#FFFFFF', borderTopWidth: 1, borderTopColor: COLORS.border },
  actionButton: { paddingVertical: 12, borderRadius: 8, alignItems: 'center' },
  actionButtonText: { fontSize: 15, fontWeight: '600', color: '#FFFFFF' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
  modalContent: { backgroundColor: '#FFFFFF', borderRadius: 16, padding: 24, width: '80%', maxWidth: 340 },
  modalTitle: { fontSize: 18, fontWeight: '700', color: COLORS.text, textAlign: 'center', marginBottom: 16 },
  reviewInput: { borderWidth: 1, borderColor: COLORS.border, borderRadius: 8, padding: 10, fontSize: 14, minHeight: 80, textAlignVertical: 'top', marginBottom: 16 },
  modalButtons: { flexDirection: 'row', gap: 12 },
  modalButton: { flex: 1, paddingVertical: 12, borderRadius: 8, alignItems: 'center' },
  modalButtonText: { fontSize: 15, fontWeight: '600', color: '#FFFFFF' },
});
