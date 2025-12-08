

import { StyleSheet, Platform } from 'react-native';

export default StyleSheet.create({
  container: {
    gap: 16,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 16,
    color: '#6B7280',
  },
  caseInfo: {
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
  caseInfoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  caseImage: {
    width: 64,
    height: 64,
    borderRadius: 8,
  },
  caseDetails: {
    flex: 1,
    gap: 4,
  },
  caseTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1F2937',
  },
  caseDiagnosis: {
    fontSize: 14,
    color: '#6B7280',
  },
  caseActions: {
    flexDirection: 'row',
    gap: 8,
  },
  downloadButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#3B82F6',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    gap: 8,
  },
  downloadButtonText: {
    fontSize: 14,
    color: '#FFFFFF',
    fontWeight: '500',
  },
  saveButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#3BCCA5',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    gap: 8,
  },
  saveButtonText: {
    fontSize: 14,
    color: '#FFFFFF',
    fontWeight: '500',
  },
  toolbar: {
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
  toolbarTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1F2937',
    marginBottom: 12,
  },
  toolButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  toolButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    gap: 4,
  },
  activeToolButton: {
    backgroundColor: '#3BCCA5',
    borderColor: '#3BCCA5',
  },
  toolButtonText: {
    fontSize: 14,
    color: '#6B7280',
  },
  activeToolButtonText: {
    color: '#FFFFFF',
  },
  canvasContainer: {
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
  canvasWrapper: {
    width: '100%',
    height: 320,
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  canvasImage: {
    width: '100%',
    height: '100%',
  },
  propertiesPanel: {
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
  propertiesTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1F2937',
    marginBottom: 12,
  },
  propertiesContent: {
    gap: 12,
  },
  propertyItem: {
    gap: 4,
  },
  propertyLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
  },
  propertyInput: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 14,
    color: '#1F2937',
  },
  propertyRow: {
    flexDirection: 'row',
    gap: 12,
  },
  propertyItemHalf: {
    flex: 1,
    gap: 4,
  },
  colorPicker: {
    width: '100%',
    height: 32,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  thicknessSlider: {
    width: '100%',
    height: 40,
  },
  sliderThumb: {
    backgroundColor: '#3BCCA5',
    width: 20,
    height: 20,
  },
  annotationsList: {
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
  annotationsTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1F2937',
    marginBottom: 12,
  },
  annotationsContent: {
    gap: 8,
  },
  annotationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F9FAFB',
    padding: 8,
    borderRadius: 8,
  },
  annotationInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  annotationLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1F2937',
  },
  annotationType: {
    fontSize: 12,
    color: '#6B7280',
  },
  deleteButton: {
    padding: 4,
  },
});

