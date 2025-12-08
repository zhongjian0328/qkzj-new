

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
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  image: {
    width: 64,
    height: 64,
    borderRadius: 8,
  },
  info: {
    flex: 1,
    gap: 4,
  },
  title: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1F2937',
  },
  diagnosis: {
    fontSize: 14,
    color: '#6B7280',
  },
  meta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  statusAnnotated: {
    backgroundColor: '#D1FAE5',
  },
  statusPending: {
    backgroundColor: '#FED7AA',
  },
  statusInProgress: {
    backgroundColor: '#BFDBFE',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#065F46',
  },
  date: {
    fontSize: 12,
    color: '#6B7280',
  },
});

