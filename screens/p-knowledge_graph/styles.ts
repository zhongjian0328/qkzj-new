

import { StyleSheet, Platform } from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  
  // 顶部导航栏
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
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
  backButton: {
    padding: 8,
    marginLeft: -8,
    marginRight: 12,
  },
  backButtonIcon: {
    fontSize: 20,
    color: '#6B7280',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
  },

  // 主要内容区域
  mainContent: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 24,
    paddingBottom: 80,
  },

  // 搜索框
  searchSection: {
    marginBottom: 24,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
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
  searchIcon: {
    fontSize: 16,
    color: '#6B7280',
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#1F2937',
    padding: 0,
  },

  // 分类导航
  categorySection: {
    marginBottom: 24,
  },
  categoryListContainer: {
    paddingRight: 16,
  },
  categoryButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 12,
  },
  categoryButtonActive: {
    backgroundColor: '#3BCCA5',
  },
  categoryButtonInactive: {
    backgroundColor: '#F3F4F6',
  },
  categoryButtonText: {
    fontSize: 14,
    fontWeight: '500',
  },
  categoryButtonTextActive: {
    color: '#FFFFFF',
  },
  categoryButtonTextInactive: {
    color: '#6B7280',
  },

  // 图谱列表
  graphListSection: {
    flex: 1,
  },
  listTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 16,
  },
  graphListContainer: {
    paddingBottom: 20,
  },
  diseaseCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
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
  diseaseCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  diseaseCardImage: {
    width: 64,
    height: 64,
    borderRadius: 8,
    marginRight: 16,
  },
  diseaseCardInfo: {
    flex: 1,
  },
  diseaseCardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  diseaseCardDescription: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
    marginBottom: 8,
  },
  diseaseCardCategoryContainer: {
    alignSelf: 'flex-start',
  },
  diseaseCardCategory: {
    fontSize: 12,
    color: '#3BCCA5',
    backgroundColor: 'rgba(59, 204, 165, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    overflow: 'hidden',
  },
  diseaseCardArrow: {
    fontSize: 14,
    color: '#6B7280',
  },

  // 空状态
  emptyStateContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 48,
  },
  emptyStateIcon: {
    fontSize: 48,
    color: '#6B7280',
    marginBottom: 16,
  },
  emptyStateText: {
    fontSize: 16,
    color: '#6B7280',
  },

  // 模态框
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalOverlayTouchable: {
    flex: 1,
  },
  modalContainer: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '80%',
  },
  modalHandle: {
    width: 48,
    height: 4,
    backgroundColor: '#D1D5DB',
    borderRadius: 2,
    alignSelf: 'center',
    marginTop: 16,
    marginBottom: 24,
  },
  modalScrollView: {
    flex: 1,
  },
  modalContent: {
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  modalHeader: {
    marginBottom: 24,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 8,
  },
  modalCategoryContainer: {
    alignSelf: 'flex-start',
  },
  modalCategory: {
    fontSize: 14,
    color: '#3BCCA5',
    backgroundColor: 'rgba(59, 204, 165, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 16,
    overflow: 'hidden',
  },
  modalSection: {
    marginBottom: 24,
  },
  modalSectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 12,
  },
  modalImagesContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  modalImage: {
    flex: 1,
    height: 128,
    borderRadius: 8,
  },
  modalDescription: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 22,
  },
  modalSymptomsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  modalSymptomTag: {
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 16,
  },
  modalSymptomText: {
    fontSize: 14,
    color: '#3B82F6',
  },
  modalRelatedDiseasesContainer: {
    gap: 8,
  },
  modalRelatedDiseaseItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    padding: 12,
    borderRadius: 8,
  },
  modalRelatedDiseaseImage: {
    width: 48,
    height: 48,
    borderRadius: 8,
    marginRight: 12,
  },
  modalRelatedDiseaseInfo: {
    flex: 1,
  },
  modalRelatedDiseaseName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1F2937',
    marginBottom: 2,
  },
  modalRelatedDiseaseCategory: {
    fontSize: 12,
    color: '#6B7280',
  },
  modalRelatedDiseaseArrow: {
    fontSize: 12,
    color: '#6B7280',
  },
});

