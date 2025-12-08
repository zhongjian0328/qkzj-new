

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

  // 页面说明
  descriptionSection: {
    paddingHorizontal: 16,
    paddingTop: 24,
    marginBottom: 32,
  },
  descriptionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
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
  descriptionIconContainer: {
    width: 40,
    height: 40,
    backgroundColor: 'rgba(59, 204, 165, 0.1)',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    marginTop: 4,
  },
  descriptionContent: {
    flex: 1,
  },
  descriptionTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1F2937',
    marginBottom: 8,
  },
  descriptionText: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
  },

  // 主角色选择
  mainRolesSection: {
    paddingHorizontal: 16,
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 16,
  },
  mainRolesContainer: {
    gap: 16,
  },
  mainRoleCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    borderWidth: 2,
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
  mainRoleCardSelected: {
    borderColor: '#3BCCA5',
    backgroundColor: 'rgba(59, 204, 165, 0.05)',
    ...Platform.select({
      ios: {
        shadowColor: '#3BCCA5',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  mainRoleContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  mainRoleIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  mainRoleInfo: {
    flex: 1,
  },
  mainRoleName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  mainRoleDesc: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 8,
  },
  mainRoleCount: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  mainRoleCountText: {
    fontSize: 12,
    color: '#6B7280',
    marginLeft: 4,
  },
  mainRoleRadio: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#D1D5DB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  mainRoleRadioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: 'transparent',
  },
  mainRoleRadioSelected: {
    backgroundColor: '#3BCCA5',
  },

  // 子角色选择
  subRolesSection: {
    paddingHorizontal: 16,
    marginBottom: 32,
  },
  subRolesContainer: {
    gap: 12,
  },
  subRoleCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
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
  subRoleCardSelected: {
    borderColor: '#3BCCA5',
    backgroundColor: 'rgba(59, 204, 165, 0.1)',
  },
  subRoleContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  subRoleIconContainer: {
    width: 48,
    height: 48,
    backgroundColor: 'rgba(59, 204, 165, 0.1)',
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  subRoleInfo: {
    flex: 1,
  },
  subRoleName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1F2937',
    marginBottom: 4,
  },
  subRoleDesc: {
    fontSize: 14,
    color: '#6B7280',
  },
  subRoleRadio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#D1D5DB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  subRoleRadioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: 'transparent',
  },
  subRoleRadioSelected: {
    backgroundColor: '#3BCCA5',
  },

  // 底部间距
  bottomSpacing: {
    height: 120,
  },

  // 底部按钮
  bottomAction: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    padding: 16,
    paddingBottom: Platform.select({
      ios: 34,
      android: 16,
    }),
  },
  nextButton: {
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  nextButtonEnabled: {
    backgroundColor: '#3BCCA5',
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
  nextButtonDisabled: {
    backgroundColor: '#D1D5DB',
  },
  nextButtonText: {
    fontSize: 16,
    fontWeight: '500',
  },
  nextButtonTextEnabled: {
    color: '#FFFFFF',
  },
  nextButtonTextDisabled: {
    color: '#9CA3AF',
  },
});

