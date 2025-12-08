

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
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    padding: 8,
    marginLeft: -8,
  },
  backIcon: {
    fontSize: 20,
    color: '#6B7280',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginLeft: 12,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  notificationButton: {
    position: 'relative',
    padding: 8,
    marginRight: 12,
  },
  notificationIcon: {
    fontSize: 20,
    color: '#6B7280',
  },
  notificationBadge: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 12,
    height: 12,
    backgroundColor: '#EF4444',
    borderRadius: 6,
  },
  profileButton: {
    padding: 8,
  },
  profileIcon: {
    fontSize: 20,
    color: '#6B7280',
  },
  
  // 滚动视图
  scrollView: {
    flex: 1,
  },
  
  // 筛选工具栏
  filterToolbar: {
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  filterButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  filterButton: {
    flex: 1,
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  filterButtonText: {
    fontSize: 14,
    color: '#374151',
  },
  filterButtonIcon: {
    fontSize: 12,
    color: '#6B7280',
    marginLeft: 8,
  },
  refreshButton: {
    backgroundColor: 'rgba(59, 204, 165, 0.1)',
    borderRadius: 8,
    padding: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  refreshIcon: {
    fontSize: 16,
    color: '#3BCCA5',
  },
  filterDropdown: {
    marginTop: 8,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  filterOption: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
  },
  filterOptionText: {
    fontSize: 14,
    color: '#374151',
  },
  
  // 主要内容区域
  mainContent: {
    paddingHorizontal: 16,
    paddingVertical: 24,
    paddingBottom: 80,
  },
  
  // 疫情统计卡片
  statsSection: {
    marginBottom: 24,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 16,
  },
  statCard: {
    flex: 1,
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
  statContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  statInfo: {
    flex: 1,
  },
  statLabel: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 4,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#DC2626',
  },
  statValueOrange: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#EA580C',
  },
  statIconContainer: {
    width: 48,
    height: 48,
    backgroundColor: '#FEE2E2',
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statIconContainerOrange: {
    width: 48,
    height: 48,
    backgroundColor: '#FED7AA',
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statIcon: {
    fontSize: 20,
    color: '#DC2626',
  },
  statIconOrange: {
    fontSize: 20,
    color: '#EA580C',
  },
  
  // 疫情热力图
  heatmapSection: {
    marginBottom: 24,
  },
  heatmapHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  heatmapTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
  },
  mapControls: {
    flexDirection: 'row',
    gap: 8,
  },
  mapControlButton: {
    backgroundColor: '#F3F4F6',
    borderRadius: 4,
    padding: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mapControlIcon: {
    fontSize: 14,
    color: '#374151',
  },
  mapContainer: {
    height: 320,
    borderRadius: 12,
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
  mapGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  mapOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  provinceBoundary: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    height: '100%',
  },
  mapControlContainer: {
    position: 'absolute',
    top: 16,
    right: 16,
    gap: 8,
  },
  mapControlButtonLarge: {
    width: 40,
    height: 40,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  mapControlIconLarge: {
    fontSize: 16,
    color: '#374151',
  },
  mapLegend: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 12,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  legendTitle: {
    fontSize: 12,
    fontWeight: '500',
    color: '#1F2937',
    marginBottom: 8,
  },
  legendItems: {
    gap: 4,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  legendDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  legendDotHigh: {
    backgroundColor: '#EF4444',
  },
  legendDotMedium: {
    backgroundColor: '#EAB308',
  },
  legendDotLow: {
    backgroundColor: '#22C55E',
  },
  legendText: {
    fontSize: 12,
    color: '#374151',
  },
  
  // 报警信息
  alertSection: {
    marginBottom: 24,
  },
  alertSectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  alertSectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
  },
  viewAllButton: {
    fontSize: 14,
    color: '#3BCCA5',
  },
  alertItem: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
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
  alertHigh: {
    borderLeftColor: '#EF4444',
  },
  alertMedium: {
    borderLeftColor: '#EA580C',
  },
  alertLow: {
    borderLeftColor: '#EAB308',
  },
  alertContent: {
    flex: 1,
  },
  alertHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 8,
  },
  alertIcon: {
    fontSize: 14,
  },
  alertTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1F2937',
    flex: 1,
  },
  alertLevelBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  alertLevelText: {
    fontSize: 12,
    fontWeight: '500',
  },
  alertDescription: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 8,
    lineHeight: 20,
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
  alertMetaIcon: {
    fontSize: 12,
    color: '#6B7280',
  },
  alertMetaText: {
    fontSize: 12,
    color: '#6B7280',
  },
  alertDetailButton: {
    padding: 8,
    marginLeft: 12,
  },
  alertDetailIcon: {
    fontSize: 14,
    color: '#6B7280',
  },
  
  // 弹窗
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: 24,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
  },
  modalCloseButton: {
    padding: 8,
  },
  modalCloseIcon: {
    fontSize: 20,
    color: '#6B7280',
  },
  modalContent: {
    gap: 16,
  },
  modalRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  modalLabel: {
    fontSize: 14,
    color: '#6B7280',
  },
  modalValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1F2937',
    flex: 1,
    textAlign: 'right',
    marginLeft: 16,
  },
  modalValueHigh: {
    color: '#DC2626',
  },
  modalValueMedium: {
    color: '#EA580C',
  },
  modalValueLow: {
    color: '#EAB308',
  },
});

