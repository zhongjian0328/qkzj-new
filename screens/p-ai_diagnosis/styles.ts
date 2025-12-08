

import { StyleSheet, Platform } from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  
  // 顶部导航栏
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  backButton: {
    padding: 8,
    marginLeft: -8,
    marginRight: 12,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
  },

  // 滚动视图
  scrollView: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 24,
  },

  // 通用区域样式
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 16,
  },

  // 图片上传区域
  uploadArea: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 32,
    borderWidth: 2,
    borderColor: '#3BCCA5',
    borderStyle: 'dashed',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 8,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  uploadPlaceholder: {
    alignItems: 'center',
  },
  uploadIcon: {
    width: 64,
    height: 64,
    backgroundColor: 'rgba(59, 204, 165, 0.1)',
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  uploadTextContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  uploadText: {
    fontSize: 18,
    fontWeight: '500',
    color: '#1F2937',
    marginBottom: 8,
  },
  uploadDescription: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 20,
  },
  uploadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#3BCCA5',
    paddingHorizontal: 24,
    paddingVertical: 8,
    borderRadius: 8,
  },
  uploadButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '500',
  },

  // 图片预览
  uploadPreview: {
    alignItems: 'center',
  },
  previewImage: {
    width: '100%',
    height: 192,
    borderRadius: 8,
    marginBottom: 16,
  },
  uploadActions: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
  retryButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#E5E7EB',
    paddingVertical: 8,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#6B7280',
    fontSize: 16,
    fontWeight: '500',
  },
  confirmButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#3BCCA5',
    paddingVertical: 8,
    borderRadius: 8,
  },
  confirmButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '500',
  },

  // 病禽部位选择
  bodyPartGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  bodyPartButton: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 8,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  bodyPartButtonSelected: {
    borderWidth: 2,
    borderColor: '#3BCCA5',
    backgroundColor: 'rgba(59, 204, 165, 0.05)',
  },
  bodyPartIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  bodyPartText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1F2937',
  },

  // 开始诊断按钮
  startDiagnosisButton: {
    borderRadius: 16,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#3BCCA5',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  gradientButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
  },
  startDiagnosisButtonText: {
    color: '#2B6A5A',
    fontSize: 18,
    fontWeight: 'bold',
  },

  // 学生输入区域
  studentInputCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 8,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  studentInput: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#1F2937',
    textAlignVertical: 'top',
    minHeight: 96,
  },
  studentInputActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
  },
  charCount: {
    fontSize: 12,
    color: '#6B7280',
  },
  submitStudentButton: {
    backgroundColor: '#3BCCA5',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  submitStudentButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
  },

  // 加载区域
  loadingCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 32,
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 8,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  loadingSpinner: {
    width: 40,
    height: 40,
    borderWidth: 3,
    borderColor: '#F3F4F6',
    borderTopColor: '#3BCCA5',
    borderRadius: 20,
    marginBottom: 16,
  },
  loadingTitle: {
    fontSize: 18,
    fontWeight: '500',
    color: '#1F2937',
    marginBottom: 8,
  },
  loadingDescription: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 24,
  },
  progressContainer: {
    width: '100%',
  },
  progressBarBackground: {
    width: '100%',
    height: 8,
    backgroundColor: '#E5E7EB',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#3BCCA5',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'right',
    marginTop: 8,
  },

  // 诊断结果
  resultCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 24,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 8,
      },
      android: {
        elevation: 2,
      },
    }),
  },

  // 学生诊断对比
  studentComparison: {
    marginBottom: 24,
  },
  comparisonTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1F2937',
    marginBottom: 12,
  },
  comparisonContent: {
    gap: 12,
    marginBottom: 16,
  },
  comparisonRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  comparisonLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
    width: 64,
  },
  comparisonValue: {
    flex: 1,
    fontSize: 14,
    color: '#1F2937',
    lineHeight: 20,
  },
  aiDiagnosisText: {
    fontWeight: '500',
    color: '#3BCCA5',
  },
  completionBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ECFDF5',
    padding: 12,
    borderRadius: 8,
    gap: 8,
  },
  completionText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#065F46',
  },

  // 主要诊断
  mainDiagnosis: {
    marginBottom: 24,
  },
  mainDiagnosisHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  mainDiagnosisTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  confidenceBadge: {
    backgroundColor: 'rgba(59, 204, 165, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 16,
  },
  confidenceText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#3BCCA5',
  },
  diseaseInfo: {
    flexDirection: 'row',
    gap: 16,
  },
  diseaseImage: {
    width: 64,
    height: 64,
    borderRadius: 8,
  },
  diseaseDetails: {
    flex: 1,
  },
  diseaseName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  diseaseSummary: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
  },

  // 其他可能疾病
  otherDiseases: {
    marginBottom: 24,
  },
  otherDiseasesTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1F2937',
    marginBottom: 12,
  },
  otherDiseasesList: {
    gap: 8,
  },
  otherDiseaseItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    padding: 12,
    borderRadius: 8,
  },
  otherDiseaseName: {
    fontSize: 14,
    color: '#1F2937',
  },
  otherDiseaseConfidence: {
    fontSize: 14,
    color: '#6B7280',
  },

  // 结果操作按钮
  resultActions: {
    flexDirection: 'row',
    gap: 12,
  },
  treatmentButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#3BCCA5',
    paddingVertical: 12,
    borderRadius: 8,
    gap: 8,
  },
  treatmentButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '500',
  },
  confirmationButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#3B82F6',
    paddingVertical: 12,
    borderRadius: 8,
    gap: 8,
  },
  confirmationButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '500',
  },
  riskButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F59E0B',
    paddingVertical: 12,
    borderRadius: 8,
    gap: 8,
  },
  riskButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '500',
  },
  emergencyButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#8B5CF6',
    paddingVertical: 12,
    borderRadius: 8,
    gap: 8,
  },
  emergencyButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '500',
  },
  saveButton: {
    backgroundColor: '#E5E7EB',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // 错误区域
  errorCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 24,
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 8,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  errorIcon: {
    width: 64,
    height: 64,
    backgroundColor: 'rgba(220, 38, 38, 0.1)',
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  errorTitle: {
    fontSize: 18,
    fontWeight: '500',
    color: '#1F2937',
    marginBottom: 8,
  },
  errorDescription: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 16,
  },
  retryDiagnosisButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#3BCCA5',
    paddingHorizontal: 24,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 8,
  },
  retryDiagnosisButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '500',
  },

  // 通用按钮图标
  buttonIcon: {
    marginRight: 8,
  },

  // 确诊方案推荐
  confirmationCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 24,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 8,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  loadingContainer: {
    alignItems: 'center',
    padding: 24,
  },
  loadingText: {
    fontSize: 16,
    color: '#6B7280',
    marginTop: 12,
  },
  planSection: {
    marginBottom: 20,
  },
  planHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
  },
  planLevelBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 12,
  },
  planLevelText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  planHeaderContent: {
    flex: 1,
  },
  planName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  planDescription: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
  },
  planItems: {
    paddingHorizontal: 8,
  },
  planItem: {
    backgroundColor: '#F9FAFB',
    padding: 16,
    borderRadius: 8,
    marginBottom: 8,
  },
  planItemName: {
    fontSize: 15,
    fontWeight: '500',
    color: '#1F2937',
    marginBottom: 12,
  },
  planItemDetails: {
    gap: 8,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  detailText: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
  },

  // 混合感染风险评估
  riskCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 24,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 8,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  riskSection: {
    marginBottom: 20,
  },
  riskHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
  },
  riskLevelBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 12,
  },
  riskLevelText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  riskHeaderContent: {
    flex: 1,
  },
  infectionCombination: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  probabilityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  probabilityText: {
    fontSize: 14,
    fontWeight: '500',
  },
  riskDetails: {
    backgroundColor: '#F9FAFB',
    padding: 16,
    borderRadius: 8,
    gap: 12,
  },
  riskItem: {
    gap: 8,
  },
  riskItemTitle: {
    fontSize: 15,
    fontWeight: '500',
    color: '#1F2937',
  },
  riskItemContent: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
  },

  // 应急防控方案
  emergencyCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 24,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 8,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  emergencySection: {
    marginBottom: 20,
  },
  emergencyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
  },
  timePeriodBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 12,
  },
  timePeriodText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  emergencyHeaderContent: {
    flex: 1,
  },
  emergencyTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  emergencyDescription: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
  },
  emergencyMeasures: {
    paddingHorizontal: 8,
  },
  measureCategory: {
    marginBottom: 16,
  },
  measureCategoryTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 12,
  },
  measureItems: {
    gap: 8,
  },
  measureItem: {
    backgroundColor: '#F9FAFB',
    padding: 16,
    borderRadius: 8,
  },
  measureItemHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  measureItemName: {
    fontSize: 15,
    fontWeight: '500',
    color: '#1F2937',
  },
  measureItemDetails: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
    paddingLeft: 22,
  },
});

