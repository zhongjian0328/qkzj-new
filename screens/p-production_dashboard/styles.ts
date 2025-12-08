

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
    justifyContent: 'space-between',
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
  
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  
  userAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#3BCCA5',
    marginRight: 12,
  },
  
  userTextContainer: {
    flex: 1,
  },
  
  userGreeting: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 2,
  },
  
  userRole: {
    fontSize: 14,
    color: '#6B7280',
  },
  
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  
  notificationButton: {
    position: 'relative',
    padding: 8,
    marginRight: 12,
  },
  
  notificationBadge: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#EF4444',
  },
  
  profileButton: {
    padding: 8,
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
  
  // 核心数据卡片
  coreDataGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  
  coreDataCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    width: '48%',
    marginBottom: 16,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 8,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  
  coreDataHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  
  coreDataTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
    flex: 1,
  },
  
  coreDataIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  coreDataValueContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 4,
  },
  
  coreDataValue: {
    fontSize: 24,
    fontWeight: 'bold',
    marginRight: 8,
  },
  
  coreDataChange: {
    fontSize: 12,
  },
  
  coreDataDescription: {
    fontSize: 12,
    color: '#6B7280',
  },
  
  // 图表卡片
  chartCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 8,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  
  chartHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  
  chartTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1F2937',
  },
  
  periodSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  
  periodSelectorText: {
    fontSize: 14,
    color: '#6B7280',
    marginRight: 4,
  },
  
  chartContainer: {
    backgroundColor: '#F8FAFC',
    borderRadius: 8,
    padding: 16,
    height: 160,
    marginBottom: 12,
  },
  
  chartBarsContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingHorizontal: 8,
  },
  
  chartBarContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginHorizontal: 2,
  },
  
  chartBar: {
    width: 24,
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
    marginBottom: 8,
  },
  
  chartBarLabel: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
  },
  
  chartFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  
  chartFooterText: {
    fontSize: 12,
    color: '#6B7280',
  },
  
  chartFooterTextHighlight: {
    fontSize: 12,
    color: '#EF4444',
  },
  
  chartFooterTextAccent: {
    fontSize: 12,
    color: '#2B6A5A',
  },
  
  // 快捷功能
  quickFunctionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  
  quickFunctionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    width: '48%',
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 8,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  
  quickFunctionIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(59, 204, 165, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  
  quickFunctionTextContainer: {
    flex: 1,
  },
  
  quickFunctionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 2,
  },
  
  quickFunctionDescription: {
    fontSize: 12,
    color: '#6B7280',
  },
  
  // 模态框
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1000,
  },
  
  modalBackdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  
  modalContent: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: 20,
    paddingBottom: 40,
  },
  
  modalOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  
  modalOptionText: {
    fontSize: 16,
    color: '#1F2937',
  },
  
  modalOptionTextSelected: {
    color: '#3BCCA5',
    fontWeight: '500',
  },
  
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
});

