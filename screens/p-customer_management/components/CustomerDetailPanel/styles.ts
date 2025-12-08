

import { StyleSheet, Platform } from 'react-native';

export default StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  panel: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '90%',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.15,
        shadowRadius: 12,
      },
      android: {
        elevation: 12,
      },
    }),
  },
  header: {
    backgroundColor: '#3BCCA5',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  closeButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  editButton: {
    padding: 8,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 24,
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
    marginBottom: 16,
  },
  viewAllText: {
    fontSize: 14,
    color: '#3BCCA5',
  },
  basicInfoCard: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 16,
  },
  customerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  detailAvatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 2,
    borderColor: '#3BCCA5',
    marginRight: 12,
  },
  customerHeaderInfo: {
    flex: 1,
  },
  detailName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  detailTags: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailTag: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    marginRight: 8,
  },
  detailTagText: {
    fontSize: 12,
    fontWeight: '500',
  },
  infoList: {
    gap: 12,
  },
  infoItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  infoLabel: {
    fontSize: 14,
    color: '#6B7280',
  },
  infoValue: {
    fontSize: 14,
    color: '#1F2937',
    textAlign: 'right',
    flex: 1,
    marginLeft: 16,
  },
  ordersList: {
    gap: 12,
  },
  orderItem: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 12,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  orderNumber: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1F2937',
  },
  orderStatus: {
    fontSize: 12,
    color: '#059669',
  },
  orderDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  orderProduct: {
    fontSize: 12,
    color: '#6B7280',
  },
  orderPrice: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1F2937',
  },
  orderDate: {
    fontSize: 12,
    color: '#6B7280',
  },
  diagnosisList: {
    gap: 12,
  },
  diagnosisItem: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 12,
  },
  diagnosisHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  diagnosisName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1F2937',
  },
  diagnosisStatus: {
    fontSize: 12,
    color: '#EA580C',
  },
  diagnosisConfidence: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 4,
  },
  diagnosisDate: {
    fontSize: 12,
    color: '#6B7280',
  },
  addInteractionButton: {
    backgroundColor: '#3BCCA5',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 8,
  },
  addInteractionText: {
    fontSize: 14,
    color: '#FFFFFF',
    marginLeft: 4,
  },
  interactionList: {
    gap: 12,
  },
  interactionItem: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 12,
  },
  interactionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  interactionType: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1F2937',
  },
  interactionTime: {
    fontSize: 12,
    color: '#6B7280',
  },
  interactionContent: {
    fontSize: 12,
    color: '#6B7280',
    lineHeight: 18,
  },
});

