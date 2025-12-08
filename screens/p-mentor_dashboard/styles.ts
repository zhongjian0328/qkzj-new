

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
    flex: 1,
  },
  backButtonContainer: {
    padding: 8,
    marginLeft: -8,
  },
  headerTitleContainer: {
    marginLeft: 12,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 2,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  notificationButton: {
    padding: 8,
    marginRight: 12,
    position: 'relative',
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

  // 主要内容区域
  mainContent: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 24,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButtonText: {
    fontSize: 14,
    color: '#3BCCA5',
    marginLeft: 4,
  },

  // 统计卡片
  statsGrid: {
    flexDirection: 'row',
    gap: 16,
  },
  statsCard: {
    flex: 1,
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
  statsValue: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statsLabel: {
    fontSize: 14,
    color: '#6B7280',
  },

  // 学生列表
  studentsList: {
    gap: 12,
  },
  studentItem: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#E5E7EB',
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
  studentItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  studentAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 2,
    borderColor: '#3BCCA5',
  },
  studentInfo: {
    marginLeft: 12,
    flex: 1,
  },
  studentName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1F2937',
  },
  studentGroup: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 2,
  },
  studentStats: {
    flexDirection: 'row',
    marginTop: 4,
    gap: 16,
  },
  studentStatItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  studentStatText: {
    fontSize: 12,
    color: '#6B7280',
  },

  // 日志列表
  logsList: {
    gap: 12,
  },
  logItem: {
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
  logItemPending: {
    borderLeftWidth: 4,
    borderLeftColor: '#F59E0B',
  },
  logItemReviewed: {
    borderLeftWidth: 4,
    borderLeftColor: '#10B981',
  },
  logItemSubmitted: {
    borderLeftWidth: 4,
    borderLeftColor: '#3B82F6',
  },
  logItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  logIconContainer: {
    width: 40,
    height: 40,
    backgroundColor: 'rgba(59, 204, 165, 0.1)',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logInfo: {
    marginLeft: 12,
    flex: 1,
  },
  logTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1F2937',
  },
  logDate: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 2,
  },
  logStatusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  logStatusPending: {
    backgroundColor: '#FEF3C7',
  },
  logStatusReviewed: {
    backgroundColor: '#D1FAE5',
  },
  logStatusSubmitted: {
    backgroundColor: '#DBEAFE',
  },
  logStatusDefault: {
    backgroundColor: '#F3F4F6',
  },
  logStatusText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#374151',
  },

  // 日志详情
  logContentCard: {
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
        elevation: 2,
      },
    }),
  },
  logHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  logStudentName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  logContent: {
    gap: 16,
  },
  logSection: {
    gap: 8,
  },
  logSectionTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1F2937',
  },
  logTextContent: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
  },
  diagnosisContainer: {
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    padding: 12,
    gap: 8,
  },
  diagnosisItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  diagnosisText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1F2937',
  },
  imagesContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  logImage: {
    flex: 1,
    height: 80,
    borderRadius: 8,
  },

  // 导师批注
  commentCard: {
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
  commentCardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 12,
  },
  existingComment: {
    backgroundColor: '#EFF6FF',
    borderRadius: 8,
    padding: 12,
  },
  commentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  commentAuthor: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1E40AF',
  },
  commentDate: {
    fontSize: 12,
    color: '#3B82F6',
  },
  commentText: {
    fontSize: 14,
    color: '#1E40AF',
    lineHeight: 20,
  },
  commentInputSection: {
    gap: 12,
  },
  commentInput: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    color: '#1F2937',
    minHeight: 100,
  },
  commentActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
  },
  cancelButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
  },
  cancelButtonText: {
    fontSize: 14,
    color: '#6B7280',
  },
  submitButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#3BCCA5',
    borderRadius: 8,
    ...Platform.select({
      ios: {
        shadowColor: '#3BCCA5',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  submitButtonDisabled: {
    backgroundColor: '#9CA3AF',
  },
  submitButtonText: {
    fontSize: 14,
    color: '#FFFFFF',
    fontWeight: '500',
  },
});

