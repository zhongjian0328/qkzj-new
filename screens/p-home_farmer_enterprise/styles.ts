

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
  },
  userRole: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 2,
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
  notificationBadge: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 12,
    height: 12,
    backgroundColor: '#EF4444',
    borderRadius: 6,
  },
  scrollView: {
    flex: 1,
  },
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
  dataCardsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    marginBottom: 24,
  },
  dataCard: {
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
  dataCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  dataCardLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
  },
  dataCardValueRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 4,
  },
  dataCardValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#F97316',
    marginRight: 4,
  },
  dataCardUnit: {
    fontSize: 12,
    color: '#6B7280',
  },
  dataCardSubtext: {
    fontSize: 12,
    color: '#6B7280',
  },
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
        elevation: 2,
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
  batchSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    gap: 4,
  },
  batchSelectorText: {
    fontSize: 14,
    color: '#6B7280',
  },
  chartContainer: {
    backgroundColor: '#D3F8EE',
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
  },
  chartLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
  },
  chartLabel: {
    fontSize: 12,
    color: '#6B7280',
  },
  barChartContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    height: 100,
    gap: 8,
    marginTop: 16,
  },
  barWrapper: {
    flex: 1,
    alignItems: 'center',
    height: '100%',
    justifyContent: 'flex-end',
  },
  bar: {
    width: '100%',
    borderRadius: 4,
    marginBottom: 8,
    minHeight: 10,
  },
  barDay: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 4,
  },
  barValue: {
    fontSize: 12,
    fontWeight: '500',
    color: '#1F2937',
  },
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
        elevation: 2,
      },
    }),
  },
  functionIconContainer: {
    width: 48,
    height: 48,
    backgroundColor: 'rgba(59, 204, 165, 0.1)',
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
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
  functionSubtitle: {
    fontSize: 12,
    color: '#6B7280',
  },
  alertsList: {
    gap: 12,
  },
  alertCard: {
    borderRadius: 8,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'flex-start',
    borderLeftWidth: 4,
  },
  alertCardBlue: {
    backgroundColor: '#EFF6FF',
    borderLeftColor: '#3B82F6',
  },
  alertCardYellow: {
    backgroundColor: '#FFFBEB',
    borderLeftColor: '#F59E0B',
  },
  alertCardGreen: {
    backgroundColor: '#ECFDF5',
    borderLeftColor: '#10B981',
  },
  alertIcon: {
    marginTop: 4,
    marginRight: 12,
  },
  alertContent: {
    flex: 1,
  },
  alertTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1E40AF',
    marginBottom: 4,
  },
  alertTitleYellow: {
    fontSize: 16,
    fontWeight: '500',
    color: '#92400E',
    marginBottom: 4,
  },
  alertTitleGreen: {
    fontSize: 16,
    fontWeight: '500',
    color: '#047857',
    marginBottom: 4,
  },
  alertDescription: {
    fontSize: 14,
    color: '#1D4ED8',
    marginBottom: 4,
    lineHeight: 20,
  },
  alertDescriptionYellow: {
    fontSize: 14,
    color: '#B45309',
    marginBottom: 4,
    lineHeight: 20,
  },
  alertDescriptionGreen: {
    fontSize: 14,
    color: '#065F46',
    marginBottom: 4,
    lineHeight: 20,
  },
  alertSubtext: {
    fontSize: 12,
    color: '#2563EB',
  },
  alertSubtextYellow: {
    fontSize: 12,
    color: '#D97706',
  },
  alertSubtextGreen: {
    fontSize: 12,
    color: '#059669',
  },
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'flex-end',
  },
  modalBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  batchSelectorModal: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingBottom: 34,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
  },
  batchOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  batchOptionSelected: {
    backgroundColor: '#F0FDF4',
  },
  batchOptionText: {
    fontSize: 16,
    color: '#374151',
  },
  batchOptionTextSelected: {
    color: '#10B981',
    fontWeight: '500',
  },
});

