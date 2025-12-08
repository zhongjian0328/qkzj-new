

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
  },
  
  // 导出配置区域
  exportConfigSection: {
    paddingHorizontal: 16,
    paddingVertical: 24,
  },
  
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 16,
  },
  
  // 导出类型选择
  exportTypeSection: {
    marginBottom: 24,
  },
  
  subSectionTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1F2937',
    marginBottom: 12,
  },
  
  exportTypeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  
  exportTypeButton: {
    flex: 1,
    minWidth: '45%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
  },
  
  exportTypeButtonActive: {
    backgroundColor: '#3BCCA5',
  },
  
  exportTypeButtonInactive: {
    backgroundColor: '#F3F4F6',
  },
  
  exportTypeIcon: {
    marginRight: 8,
  },
  
  exportTypeText: {
    fontSize: 14,
    fontWeight: '500',
  },
  
  exportTypeTextActive: {
    color: '#FFFFFF',
  },
  
  exportTypeTextInactive: {
    color: '#6B7280',
  },
  
  // 时间范围选择
  timeRangeSection: {
    marginBottom: 24,
  },
  
  timeRangeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  
  timeRangeButton: {
    flex: 1,
    minWidth: '30%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  
  timeRangeButtonActive: {
    backgroundColor: '#3BCCA5',
  },
  
  timeRangeButtonInactive: {
    backgroundColor: '#F3F4F6',
  },
  
  timeRangeText: {
    fontSize: 12,
    fontWeight: '500',
  },
  
  timeRangeTextActive: {
    color: '#FFFFFF',
  },
  
  timeRangeTextInactive: {
    color: '#6B7280',
  },
  
  // 自定义时间选择器
  customDatePicker: {
    marginBottom: 24,
  },
  
  dateInputRow: {
    flexDirection: 'row',
    gap: 16,
  },
  
  dateInputWrapper: {
    flex: 1,
  },
  
  dateInputLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1F2937',
    marginBottom: 8,
  },
  
  dateInput: {
    width: '100%',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    fontSize: 14,
    color: '#1F2937',
    backgroundColor: '#FFFFFF',
  },
  
  // 导出按钮
  exportButtonContainer: {
    borderRadius: 12,
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
  
  exportButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
  },
  
  exportButtonIcon: {
    marginRight: 8,
  },
  
  exportButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2B6A5A',
  },
  
  // 导出进度
  exportProgressSection: {
    paddingHorizontal: 16,
    marginBottom: 32,
  },
  
  progressCard: {
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
  
  progressHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  
  progressTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1F2937',
  },
  
  loadingSpinner: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: '#F3F3F3',
    borderTopColor: '#3BCCA5',
    borderRadius: 10,
  },
  
  progressBarContainer: {
    width: '100%',
    height: 4,
    backgroundColor: '#E5E7EB',
    borderRadius: 2,
    marginBottom: 8,
  },
  
  progressBar: {
    height: 4,
    backgroundColor: '#3BCCA5',
    borderRadius: 2,
  },
  
  progressText: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'right',
  },
  
  // 导出历史记录
  exportHistorySection: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  
  historyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  
  clearHistoryButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  
  clearHistoryIcon: {
    marginRight: 4,
  },
  
  clearHistoryText: {
    fontSize: 14,
    color: '#6B7280',
  },
  
  historyList: {
    gap: 12,
  },
  
  historyItem: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
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
  
  historyItemContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  
  historyItemIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  
  historyItemInfo: {
    flex: 1,
  },
  
  historyItemTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1F2937',
    marginBottom: 4,
  },
  
  historyItemDateRange: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 2,
  },
  
  historyItemTimestamp: {
    fontSize: 12,
    color: '#6B7280',
  },
  
  historyItemDownloadButton: {
    padding: 8,
  },
  
  // 空状态
  emptyHistoryContainer: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  
  emptyHistoryText: {
    fontSize: 14,
    color: '#6B7280',
  },
});

