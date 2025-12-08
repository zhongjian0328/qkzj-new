

import { StyleSheet, Platform } from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  
  // 顶部导航栏
  header: {
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
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
  },

  // 通用section样式
  section: {
    paddingHorizontal: 16,
    paddingVertical: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 16,
  },

  // 诊断结果摘要
  diagnosisCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  diagnosisHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  diagnosisInfo: {
    flex: 1,
  },
  diseaseName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  diagnosisConfidence: {
    fontSize: 14,
    color: '#6B7280',
  },
  severityLevel: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
  },
  severityHigh: {
    backgroundColor: '#FEE2E2',
  },
  severityMedium: {
    backgroundColor: '#FEF3C7',
  },
  severityLow: {
    backgroundColor: '#D1FAE5',
  },
  severityText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#B91C1C',
  },
  diseaseDescription: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 16,
  },
  descriptionTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1F2937',
    marginBottom: 8,
  },
  descriptionText: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
  },

  // 用药方案
  medicationList: {
    gap: 16,
  },
  medicationItem: {
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
        elevation: 4,
      },
    }),
  },
  medicationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  medicationInfo: {
    flex: 1,
  },
  medicationName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  medicationType: {
    fontSize: 14,
    color: '#6B7280',
  },
  detailButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  detailButtonText: {
    fontSize: 14,
    color: '#3BCCA5',
  },
  dosageInfo: {
    backgroundColor: '#F0FDF4',
    borderRadius: 8,
    padding: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#3BCCA5',
  },
  dosageTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1F2937',
    marginBottom: 8,
  },
  dosageList: {
    gap: 4,
  },
  dosageItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dosageLabel: {
    fontSize: 14,
    color: '#6B7280',
    minWidth: 60,
  },
  dosageValue: {
    fontSize: 14,
    color: '#1F2937',
    flex: 1,
  },

  // 注意事项
  precautionsCard: {
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
        elevation: 4,
      },
    }),
  },
  precautionList: {
    gap: 12,
  },
  precautionItem: {
    backgroundColor: '#FEF3C7',
    borderRadius: 8,
    padding: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#F59E0B',
  },
  precautionContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  precautionIcon: {
    marginTop: 2,
    marginRight: 12,
  },
  precautionText: {
    flex: 1,
  },
  precautionTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1F2937',
    marginBottom: 4,
  },
  precautionDescription: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 18,
  },

  // 治疗效果评估
  evaluationCard: {
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
        elevation: 4,
      },
    }),
  },
  expectedOutcomes: {
    gap: 12,
  },
  outcomeItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
  },
  outcomeContent: {
    flex: 1,
  },
  outcomeTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1F2937',
    marginBottom: 4,
  },
  outcomeDescription: {
    fontSize: 14,
    color: '#6B7280',
  },

  // 前往商城按钮
  purchaseSection: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  goToMallButton: {
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
    gap: 8,
  },
  goToMallButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2B6A5A',
  },
  
  // 加载状态
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#6B7280',
  },
});

