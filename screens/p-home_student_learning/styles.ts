

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
  userDetails: {
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
    backgroundColor: '#EF4444',
    borderRadius: 6,
  },
  profileButton: {
    padding: 8,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingVertical: 24,
    paddingBottom: 80,
  },
  overviewSection: {
    marginBottom: 32,
  },
  overviewCard: {
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
  overviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  overviewTitleContainer: {
    flex: 1,
  },
  overviewTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2B6A5A',
    marginBottom: 4,
  },
  overviewSubtitle: {
    fontSize: 14,
    color: 'rgba(43, 106, 90, 0.8)',
  },
  progressIcon: {
    width: 64,
    height: 64,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressSection: {
    marginBottom: 16,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  progressLabel: {
    fontSize: 14,
    color: 'rgba(43, 106, 90, 0.8)',
  },
  progressValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2B6A5A',
  },
  progressBarContainer: {
    width: '100%',
    height: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    borderRadius: 4,
  },
  learningStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2B6A5A',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: 'rgba(43, 106, 90, 0.8)',
  },
  functionsSection: {
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
  functionContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  functionIcon: {
    width: 48,
    height: 48,
    backgroundColor: 'rgba(59, 204, 165, 0.1)',
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  functionInfo: {
    flex: 1,
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
  tasksSection: {
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
  tasksList: {
    gap: 12,
  },
  taskItem: {
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
  taskContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  taskLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  taskCheckbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#D1D5DB',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  taskCheckboxCompleted: {
    backgroundColor: '#3BCCA5',
    borderColor: '#3BCCA5',
  },
  taskInfo: {
    flex: 1,
  },
  taskTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1F2937',
    marginBottom: 2,
  },
  taskCategory: {
    fontSize: 14,
    color: '#6B7280',
  },
  taskPoints: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
  },
  taskPointsCompleted: {
    color: '#3BCCA5',
  },
  dailyDiseaseSection: {
    marginBottom: 32,
  },
  diseaseCard: {
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
  diseaseContent: {
    flexDirection: 'row',
  },
  diseaseImage: {
    width: 64,
    height: 64,
    borderRadius: 8,
    marginRight: 12,
  },
  diseaseInfo: {
    flex: 1,
  },
  diseaseName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1F2937',
    marginBottom: 8,
  },
  diseaseDescription: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
    marginBottom: 12,
  },
  diseaseFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  diseaseStats: {
    flexDirection: 'row',
    gap: 16,
  },
  diseaseStat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  diseaseStatText: {
    fontSize: 12,
    color: '#6B7280',
  },
  learnMoreButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  learnMoreText: {
    fontSize: 12,
    color: '#3BCCA5',
    fontWeight: '500',
  },
  recordsSection: {
    marginBottom: 32,
  },
  recordsList: {
    gap: 12,
  },
  recordItem: {
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
  recordContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  recordLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  recordIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  recordInfo: {
    flex: 1,
  },
  recordTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1F2937',
    marginBottom: 2,
  },
  recordCategory: {
    fontSize: 14,
    color: '#6B7280',
  },
  recordStatus: {
    fontSize: 12,
    color: '#3BCCA5',
    fontWeight: '500',
  },
  recordStatusScore: {
    color: '#10B981',
  },
});

