

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
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
  },

  // 滚动视图
  scrollView: {
    flex: 1,
  },

  // 步骤指示器
  stepIndicatorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 24,
  },
  stepWrapper: {
    alignItems: 'center',
  },
  stepCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  stepCompleted: {
    backgroundColor: '#D3F8EE',
  },
  stepPending: {
    backgroundColor: '#F3F4F6',
  },
  stepText: {
    fontSize: 14,
    fontWeight: '500',
  },
  stepActiveText: {
    color: '#FFFFFF',
  },
  stepPendingText: {
    color: '#9CA3AF',
  },
  stepLabel: {
    fontSize: 12,
    color: '#6B7280',
  },
  stepProgressContainer: {
    flex: 1,
    height: 2,
    backgroundColor: '#E5E7EB',
    marginHorizontal: 16,
  },
  stepProgress: {
    height: '100%',
    backgroundColor: '#3BCCA5',
  },

  // 认证类型信息
  authTypeCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 24,
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
  authTypeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  authIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(59, 204, 165, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  authTypeTextContainer: {
    flex: 1,
  },
  authTypeTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 2,
  },
  authTypeDescription: {
    fontSize: 14,
    color: '#6B7280',
  },
  authBenefitsContainer: {
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    padding: 12,
  },
  authBenefitsTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1F2937',
    marginBottom: 8,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  benefitIcon: {
    marginRight: 8,
  },
  benefitText: {
    fontSize: 14,
    color: '#6B7280',
    flex: 1,
  },

  // 表单样式
  formSection: {
    marginHorizontal: 16,
    marginBottom: 24,
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1F2937',
    marginBottom: 8,
  },
  textInput: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#1F2937',
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  // 导师邀请码相关样式
  mentorCodeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  mentorCodeInput: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#1F2937',
  },
  verifyButton: {
    backgroundColor: '#3BCCA5',
    borderRadius: 8,
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  verifyButtonDisabled: {
    backgroundColor: '#D1D5DB',
    opacity: 0.7,
  },
  verifyButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#FFFFFF',
  },
  errorText: {
    fontSize: 12,
    color: '#EF4444',
    marginTop: 6,
  },
  mentorInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    padding: 12,
    backgroundColor: '#F0FDF4',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#D1FAE5',
  },
  mentorInfoIcon: {
    marginRight: 8,
  },
  mentorInfoText: {
    fontSize: 14,
    color: '#065F46',
  },
  // 选择器样式
  selectContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  selectItem: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D1D5DB',
  },
  selectItemSelected: {
    backgroundColor: '#3BCCA5',
    borderColor: '#3BCCA5',
  },
  selectItemText: {
    fontSize: 16,
    color: '#1F2937',
  },
  selectItemTextSelected: {
    color: '#FFFFFF',
    fontWeight: '500',
  },

  // 上传区域
  uploadSection: {
    marginHorizontal: 16,
    marginBottom: 24,
  },
  uploadSectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 16,
  },
  uploadItem: {
    marginBottom: 16,
  },
  uploadLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1F2937',
    marginBottom: 8,
  },
  uploadArea: {
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#3BCCA5',
    borderStyle: 'dashed',
    borderRadius: 12,
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  uploadContent: {
    alignItems: 'center',
  },
  uploadText: {
    fontSize: 16,
    color: '#1F2937',
    marginTop: 12,
    marginBottom: 4,
  },
  uploadSubtext: {
    fontSize: 14,
    color: '#6B7280',
  },
  uploadPreview: {
    alignItems: 'center',
    width: '100%',
  },
  previewImage: {
    width: '100%',
    height: 192,
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  removeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
  },
  removeButtonText: {
    fontSize: 14,
    color: '#EF4444',
    marginLeft: 4,
  },

  // 提交区域
  submitSection: {
    marginHorizontal: 16,
    marginBottom: 24,
  },
  submitButton: {
    backgroundColor: '#3BCCA5',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#3BCCA5',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  submitButtonDisabled: {
    backgroundColor: '#D1D5DB',
    ...Platform.select({
      ios: {
        shadowOpacity: 0,
      },
      android: {
        elevation: 0,
      },
    }),
  },
  submitButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  submitNote: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    marginTop: 12,
  },

  // 状态显示
  statusContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 24,
    marginHorizontal: 16,
    marginBottom: 24,
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
  statusIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(245, 158, 11, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  approvedIcon: {
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
  },
  rejectedIcon: {
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
  },
  statusTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 8,
  },
  statusDescription: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
  },
  statusButtonsContainer: {
    flexDirection: 'row',
    gap: 16,
  },
  statusButton: {
    backgroundColor: '#3BCCA5',
    borderRadius: 8,
    paddingHorizontal: 24,
    paddingVertical: 8,
  },
  statusButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#FFFFFF',
  },
  statusButtonSecondary: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    paddingHorizontal: 24,
    paddingVertical: 8,
  },
  statusButtonSecondaryText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1F2937',
  },
  continueButton: {
    backgroundColor: '#3BCCA5',
    borderRadius: 8,
    paddingHorizontal: 32,
    paddingVertical: 12,
    width: '100%',
    alignItems: 'center',
  },
  continueButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#FFFFFF',
  },
  retryButton: {
    backgroundColor: '#3BCCA5',
    borderRadius: 8,
    paddingHorizontal: 32,
    paddingVertical: 12,
    width: '100%',
    alignItems: 'center',
  },
  retryButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#FFFFFF',
  },
});

