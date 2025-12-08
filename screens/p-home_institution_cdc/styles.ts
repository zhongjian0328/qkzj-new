

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
  userGreeting: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
  },
  userRole: {
    fontSize: 14,
    color: '#6B7280',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  notificationButton: {
    position: 'relative',
    padding: 8,
  },
  alertBadge: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#EF4444',
  },

  // 滚动视图
  scrollView: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 24,
  },

  // 通用section样式
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  viewDetailText: {
    fontSize: 14,
    color: '#3BCCA5',
  },

  // 统计卡片
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  statCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    width: '47%',
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
  statContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 4,
  },
  statValueOrange: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#EA580C',
  },
  statValueRed: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#DC2626',
  },
  statValueBlue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2563EB',
  },
  statValueGreen: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#059669',
  },
  statIconOrange: {
    width: 48,
    height: 48,
    backgroundColor: '#FED7AA',
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statIconRed: {
    width: 48,
    height: 48,
    backgroundColor: '#FECACA',
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statIconBlue: {
    width: 48,
    height: 48,
    backgroundColor: '#DBEAFE',
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statIconGreen: {
    width: 48,
    height: 48,
    backgroundColor: '#D1FAE5',
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // 地图容器
  mapContainer: {
    backgroundColor: '#E0F2FE',
    borderRadius: 12,
    height: 256,
    position: 'relative',
    overflow: 'hidden',
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
  mapBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mapLabel: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 8,
  },

  // 热力图覆盖层
  heatmapOverlay: {
    position: 'absolute',
    borderRadius: 50,
    backgroundColor: 'rgba(255, 99, 132, 0.6)',
  },
  heatmap1: {
    width: 80,
    height: 80,
    top: 40,
    left: 64,
  },
  heatmap2: {
    width: 64,
    height: 64,
    top: 96,
    right: 80,
  },
  heatmap3: {
    width: 48,
    height: 48,
    bottom: 80,
    left: 128,
  },

  // 标记点
  alertMarker: {
    position: 'absolute',
    width: 12,
    height: 12,
    backgroundColor: '#EF4444',
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  alertMarker1: {
    top: 64,
    left: 80,
  },
  alertMarker2: {
    top: 112,
    right: 96,
  },
  alertMarker3: {
    bottom: 96,
    left: 144,
  },
  normalMarker: {
    position: 'absolute',
    width: 8,
    height: 8,
    backgroundColor: '#10B981',
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#FFFFFF',
  },
  normalMarker1: {
    top: 32,
    right: 48,
  },
  normalMarker2: {
    bottom: 64,
    right: 128,
  },
  normalMarker3: {
    top: 128,
    left: 32,
  },
  normalMarker4: {
    bottom: 32,
    left: 80,
  },

  // 报警列表
  alertsList: {
    gap: 12,
  },
  alertItem: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'flex-start',
    borderLeftWidth: 4,
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
  alertItemHigh: {
    borderLeftColor: '#EF4444',
  },
  alertItemMedium: {
    borderLeftColor: '#F97316',
  },
  alertItemLow: {
    borderLeftColor: '#EAB308',
  },
  alertContent: {
    flex: 1,
    marginRight: 12,
  },
  alertHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 8,
  },
  alertLevelHigh: {
    fontSize: 14,
    fontWeight: '500',
    color: '#B91C1C',
  },
  alertLevelMedium: {
    fontSize: 14,
    fontWeight: '500',
    color: '#EA580C',
  },
  alertLevelLow: {
    fontSize: 14,
    fontWeight: '500',
    color: '#B45309',
  },
  alertTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1F2937',
    marginBottom: 4,
  },
  alertDescription: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 8,
  },
  alertMeta: {
    flexDirection: 'row',
    gap: 16,
  },
  alertMetaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  alertMetaText: {
    fontSize: 12,
    color: '#6B7280',
  },
  alertActionButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#FEE2E2',
    borderRadius: 8,
  },
  alertActionText: {
    fontSize: 14,
    color: '#B91C1C',
  },
  alertActionButtonMedium: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#FED7AA',
    borderRadius: 8,
  },
  alertActionTextMedium: {
    fontSize: 14,
    color: '#EA580C',
  },
  alertActionButtonLow: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#FEF3C7',
    borderRadius: 8,
  },
  alertActionTextLow: {
    fontSize: 14,
    color: '#B45309',
  },

  // 快捷功能
  functionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  functionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    width: '47%',
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
  functionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  functionIconBlue: {
    width: 48,
    height: 48,
    backgroundColor: '#DBEAFE',
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  functionIconPurple: {
    width: 48,
    height: 48,
    backgroundColor: '#EDE9FE',
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  functionIconRed: {
    width: 48,
    height: 48,
    backgroundColor: '#FEE2E2',
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  functionIconGreen: {
    width: 48,
    height: 48,
    backgroundColor: '#D1FAE5',
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  functionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 2,
  },
  functionDescription: {
    fontSize: 12,
    color: '#6B7280',
  },

  // 弹窗样式
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 24,
    width: '100%',
    maxWidth: 400,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
  },
  modalBody: {
    gap: 12,
    marginBottom: 24,
  },
  modalItem: {
    gap: 4,
  },
  modalLabel: {
    fontSize: 14,
    color: '#6B7280',
  },
  modalValue: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1F2937',
  },
  modalValueOrange: {
    fontSize: 16,
    fontWeight: '500',
    color: '#EA580C',
  },
  modalValueRed: {
    color: '#DC2626',
  },
  modalValueYellow: {
    color: '#EAB308',
  },
  modalSuggestion: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
  },
  modalActions: {
    flexDirection: 'row',
    gap: 12,
  },
  modalButtonIgnore: {
    flex: 1,
    paddingVertical: 12,
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    alignItems: 'center',
  },
  modalButtonIgnoreText: {
    fontSize: 16,
    color: '#374151',
  },
  modalButtonHandle: {
    flex: 1,
    paddingVertical: 12,
    backgroundColor: '#EF4444',
    borderRadius: 8,
    alignItems: 'center',
  },
  modalButtonHandleText: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '500',
  },
});

