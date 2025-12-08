

import { StyleSheet, Platform } from 'react-native';

export default StyleSheet.create({
  container: {
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
  
  // 头部
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  headerLeft: {
    flex: 1,
    marginRight: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1F2937',
    marginBottom: 4,
  },
  date: {
    fontSize: 14,
    color: '#6B7280',
  },

  // 状态标签
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusDraft: {
    backgroundColor: '#FEF3C7',
  },
  statusSubmitted: {
    backgroundColor: '#DBEAFE',
  },
  statusReviewed: {
    backgroundColor: '#D1FAE5',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
  },
  statusTextDraft: {
    color: '#92400E',
  },
  statusTextSubmitted: {
    color: '#1E40AF',
  },
  statusTextReviewed: {
    color: '#065F46',
  },

  // 内容
  content: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
    marginBottom: 12,
  },

  // 底部
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  footerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  statusInfoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statusInfoText: {
    fontSize: 12,
    color: '#6B7280',
  },
  statusInfoTextDraft: {
    fontSize: 12,
    color: '#D97706',
  },
  time: {
    fontSize: 12,
    color: '#6B7280',
  },
});

