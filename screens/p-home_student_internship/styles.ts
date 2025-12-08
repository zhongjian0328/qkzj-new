

import { StyleSheet, Platform } from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
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
    backgroundColor: '#EF4444',
    borderRadius: 6,
  },
  profileButton: {
    padding: 8,
  },
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    paddingHorizontal: 16,
    paddingVertical: 24,
    paddingBottom: 80,
  },
  mentorNotificationSection: {
    marginBottom: 24,
  },
  mentorCommentCard: {
    borderRadius: 12,
    overflow: 'hidden',
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
  mentorCommentGradient: {
    padding: 16,
  },
  mentorCommentContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  mentorCommentLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  mentorCommentIcon: {
    width: 40,
    height: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  mentorCommentInfo: {
    flex: 1,
  },
  mentorCommentTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  mentorCommentDesc: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 2,
  },
  mentorCommentTime: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.6)',
  },
  coreFunctionsSection: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 16,
  },
  functionsGrid: {
    flexDirection: 'row',
    gap: 16,
  },
  functionCard: {
    flex: 1,
    borderRadius: 12,
    overflow: 'hidden',
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
  functionCardGradient: {
    padding: 16,
  },
  functionCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  functionCardIcon: {
    width: 48,
    height: 48,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  functionCardInfo: {
    flex: 1,
  },
  functionCardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2B6A5A',
    marginBottom: 2,
  },
  functionCardDesc: {
    fontSize: 14,
    color: 'rgba(43, 106, 90, 0.8)',
  },
  statisticsCard: {
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
        elevation: 4,
      },
    }),
  },
  statisticsCardIcon: {
    width: 48,
    height: 48,
    backgroundColor: 'rgba(59, 204, 165, 0.1)',
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  statisticsCardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 2,
  },
  statisticsCardDesc: {
    fontSize: 14,
    color: '#6B7280',
  },
  internshipLogsSection: {
    marginBottom: 32,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  viewAllButton: {
    fontSize: 14,
    color: '#3BCCA5',
    fontWeight: '500',
  },
  logsList: {
    gap: 12,
  },
  logItem: {
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
  logItemContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  logItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  logItemIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  logItemIconCompleted: {
    backgroundColor: '#D1FAE5',
  },
  logItemIconPending: {
    backgroundColor: '#DBEAFE',
  },
  logItemInfo: {
    flex: 1,
  },
  logItemTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1F2937',
    marginBottom: 4,
  },
  logItemDate: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 2,
  },
  logItemStatus: {
    fontSize: 12,
  },
  logItemStatusCompleted: {
    color: '#10B981',
  },
  logItemStatusPending: {
    color: '#3B82F6',
  },
  logItemRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  logItemIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  logItemIndicatorCompleted: {
    backgroundColor: '#10B981',
  },
  logItemIndicatorPending: {
    backgroundColor: '#3B82F6',
  },
  internshipProgressSection: {
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
        elevation: 4,
      },
    }),
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  progressLabel: {
    fontSize: 14,
    color: '#6B7280',
  },
  progressValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  progressBarContainer: {
    marginBottom: 16,
  },
  progressBarBackground: {
    width: '100%',
    height: 8,
    backgroundColor: '#E5E7EB',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarFill: {
    width: '75%',
    height: '100%',
    backgroundColor: '#3BCCA5',
    borderRadius: 4,
  },
  progressStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 8,
  },
  progressStatItem: {
    alignItems: 'center',
    flex: 1,
  },
  progressStatValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#3BCCA5',
    marginBottom: 4,
  },
  progressStatValueTotal: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  progressStatValueAccent: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2B6A5A',
    marginBottom: 4,
  },
  progressStatLabel: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
  },
  mentorInfoSection: {
    marginBottom: 32,
  },
  mentorCard: {
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
  mentorCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  mentorAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 2,
    borderColor: '#3BCCA5',
    marginRight: 12,
  },
  mentorInfo: {
    flex: 1,
  },
  mentorName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  mentorTitle: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 2,
  },
  mentorStudents: {
    fontSize: 12,
    color: '#6B7280',
  },
  contactMentorButton: {
    backgroundColor: '#3BCCA5',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  contactMentorButtonText: {
    fontSize: 14,
    color: '#FFFFFF',
    fontWeight: '500',
  },
});

