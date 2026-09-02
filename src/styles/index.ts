import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  // 启动屏幕样式
  splashScreenContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  splashLogoContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#E6F7F3',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  splashLogoIcon: {
    fontSize: 64,
  },
  splashAppTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1F5E52',
    marginBottom: 8,
  },
  splashAppSubtitle: {
    fontSize: 16,
    color: '#666',
  },
  // 多角色首页样式
  homeWelcomeSection: {
    marginBottom: 24,
  },
  homeWelcomeCard: {
    padding: 16,
  },
  homeWelcomeContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  homeWelcomeText: {
    flex: 1,
  },
  homeWelcomeTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F5E52',
    marginBottom: 8,
  },
  homeWelcomeDescription: {
    fontSize: 16,
    color: '#666',
  },
  homeWelcomeIcon: {
    width: 80,
    height: 80,
  },
  homeSection: {
    marginBottom: 24,
  },
  homeSectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  homeSectionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    backgroundColor: '#E6F7F3',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 3,
  },
  homeSectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F5E52',
  },
  homeSectionItems: {
    gap: 16,
  },
  homeSectionItemCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 4,
  },
  homeSectionItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  homeSectionItemIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#E6F7F3',
    marginRight: 16,
  },
  homeSectionItemInfo: {
    flex: 1,
  },
  homeSectionItemTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F5E52',
    marginBottom: 4,
  },
  homeSectionItemDescription: {
    fontSize: 14,
    color: '#666',
  },
  homeSectionItemArrow: {
    marginLeft: 8,
  },
  homeSectionItemArrowText: {
    fontSize: 20,
    color: '#2DBBA1',
  },
  homeAnnouncementSection: {
    marginTop: 24,
  },
  homeAnnouncementCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
  },
  homeAnnouncementContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  homeAnnouncementIcon: {
    marginRight: 12,
  },
  homeAnnouncementText: {
    flex: 1,
  },
  homeAnnouncementTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F5E52',
    marginBottom: 4,
  },
  homeAnnouncementDescription: {
    fontSize: 14,
    color: '#666',
  },
  // 全局样式定义
  container: {
    flex: 1,
    backgroundColor: '#F8FFF7', // 统一背景色为浅绿色
  },
  scrollContent: {
    padding: 16,
  },
  // 统一按钮样式
  primaryButton: {
    backgroundColor: '#2DBBA1',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
    shadowColor: '#2DBBA1',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 3.84,
    elevation: 5,
  },
  primaryButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  secondaryButton: {
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#2DBBA1',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  secondaryButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2DBBA1',
  },
  // 阶段指示器样式
  stepIndicatorContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 20,
  },
  stepIndicatorWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  stepIndicator: {
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#E0E0E0',
  },
  stepIndicatorActive: {
    backgroundColor: '#2DBBA1',
  },
  stepIndicatorCompleted: {
    backgroundColor: '#2DBBA1',
  },
  stepIndicatorText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 14,
  },
  stepIndicatorTextActive: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 14,
  },
  stepIndicatorTextCompleted: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 14,
  },
  stepSeparator: {
    width: 40,
    height: 2,
    backgroundColor: '#E0E0E0',
    marginHorizontal: 10,
  },
  stepSeparatorCompleted: {
    backgroundColor: '#2DBBA1',
  },
  // 新的阶段指示器样式（基于交互原型）
  stageIndicatorContainer: {
    marginBottom: 24,
  },
  stageIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  stageItem: {
    flexDirection: 'column',
    alignItems: 'center',
    flex: 1,
  },
  stageCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#E5E7EB',
    marginBottom: 4,
  },
  stageCircleText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#9CA3AF',
  },
  stageLine: {
    flex: 1,
    height: 2,
    backgroundColor: '#E5E7EB',
    marginHorizontal: 12,
  },
  stageText: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  stageActive: {
    backgroundColor: '#2DBBA1',
  },
  stageActiveText: {
    color: '#2DBBA1',
    fontWeight: '500',
  },
  stepCard: {
    marginBottom: 16,
  },
  stepTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#1F5E52',
  },
  sectionSubtitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
    color: '#1F5E52',
  },
  input: {
    marginBottom: 16,
  },
  inputContainer: {
    marginBottom: 16,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  stepButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  stepButton: {
    flex: 1,
    marginHorizontal: 8,
  },
  symptomGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
  },
  symptomItem: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    marginRight: 10,
    marginBottom: 10,
  },
  symptomItemSelected: {
    backgroundColor: '#2DBBA1',
    borderColor: '#2DBBA1',
  },
  symptomItemText: {
    color: '#333333',
  },
  symptomItemTextSelected: {
    color: '#FFFFFF',
  },
  imageUploadContainer: {
    marginBottom: 16,
  },
  imageList: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  imageWrapper: {
    position: 'relative',
    marginRight: 10,
  },
  uploadedImage: {
    width: 100,
    height: 100,
    borderRadius: 8,
  },
  removeImageButton: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: '#FF5252',
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  removeImageText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  noImagesContainer: {
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    marginBottom: 10,
  },
  noImagesText: {
    color: '#9E9E9E',
  },
  uploadButton: {
    alignSelf: 'flex-start',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1000,
  },
  loadingText: {
    marginTop: 10,
    color: '#1F5E52',
    fontSize: 16,
  },
  diagnosisSummary: {
    backgroundColor: '#F5F5F5',
    padding: 16,
    borderRadius: 8,
    marginBottom: 20,
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#1F5E52',
  },
  summaryText: {
    marginBottom: 5,
    color: '#333333',
  },
  messageContainer: {
    marginVertical: 8,
    marginHorizontal: 16,
    maxWidth: '80%',
  },
  userMessageContainer: {
    alignSelf: 'flex-end',
  },
  aiMessageContainer: {
    alignSelf: 'flex-start',
  },
  messageBubble: {
    padding: 12,
    borderRadius: 16,
    maxWidth: '100%',
  },
  userMessageBubble: {
    backgroundColor: '#2DBBA1',
    borderBottomRightRadius: 4,
  },
  aiMessageBubble: {
    backgroundColor: '#F0F0F0',
    borderBottomLeftRadius: 4,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 22,
  },
  userMessageText: {
    color: '#FFFFFF',
  },
  aiMessageText: {
    color: '#333333',
  },
  messageTimestamp: {
    fontSize: 12,
    marginTop: 4,
    opacity: 0.7,
  },
  messageImages: {
    marginBottom: 8,
  },
  messageImage: {
    width: 200,
    height: 150,
    borderRadius: 8,
    marginBottom: 4,
  },
  imagePreviewContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: 16,
    marginBottom: 16,
  },
  imagePreviewWrapper: {
    position: 'relative',
    marginRight: 10,
    marginBottom: 10,
  },
  imagePreview: {
    width: 100,
    height: 100,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  imagePickerButton: {
    marginRight: 10,
    padding: 10,
    backgroundColor: '#F0F0F0',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imagePickerIcon: {
    fontSize: 24,
  },
  textInput: {
    flex: 1,
    backgroundColor: '#F0F0F0',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    maxHeight: 100,
    textAlignVertical: 'bottom',
  },
  typingIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    marginBottom: 16,
  },
  typingText: {
    marginLeft: 8,
    color: '#9E9E9E',
  },
  // 登录和注册页面样式
  roleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  roleButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: '#2DBBA1',
    backgroundColor: 'transparent',
  },
  roleButtonActive: {
    backgroundColor: '#2DBBA1',
  },
  roleButtonText: {
    color: '#2DBBA1',
    fontWeight: 'bold',
  },
  roleButtonTextActive: {
    color: '#FFFFFF',
  },
  errorText: {
    color: '#FF5252',
    marginBottom: 16,
    textAlign: 'center',
  },
  registerButton: {
    marginTop: 20,
  },
  loginLinkContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  loginLinkText: {
    color: '#666666',
  },
  loginLink: {
    color: '#2DBBA1',
    fontWeight: 'bold',
    marginLeft: 5,
  },
  // 诊断首页样式
  introCard: {
    marginBottom: 20,
    padding: 20,
    backgroundColor: '#E8F5E8',
  },
  introTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#1F5E52',
  },
  introText: {
    fontSize: 16,
    color: '#666666',
    lineHeight: 24,
  },
  diagnosisModesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
    flexWrap: 'wrap',
  },
  diagnosisModeCard: {
    width: '45%',
    marginBottom: 20,
    padding: 20,
    alignItems: 'center',
  },
  modeImage: {
    width: 100,
    height: 100,
    marginBottom: 15,
  },
  modeTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#1F5E52',
  },
  modeDescription: {
    fontSize: 14,
    color: '#666666',
    textAlign: 'center',
    marginBottom: 15,
    lineHeight: 20,
  },
  modeButton: {
    width: '100%',
  },
  // 登录页面样式
  logo: {
    width: 150,
    height: 150,
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1F5E52',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#666666',
    marginBottom: 30,
  },
  loginCard: {
    padding: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F5E52',
    marginBottom: 20,
    textAlign: 'center',
  },
  forgotPassword: {
    textAlign: 'right',
    marginTop: 10,
    marginBottom: 20,
    color: '#2DBBA1',
    fontWeight: 'bold',
  },
  registerLink: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  registerLinkText: {
    color: '#666666',
  },
  registerLinkButton: {
    color: '#2DBBA1',
    fontWeight: 'bold',
    marginLeft: 5,
  },
  // 聊天诊断页面样式
  chatContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  chatContent: {
    flex: 1,
  },
  // 诊断指南样式
  guideCard: {
    marginBottom: 20,
    padding: 20,
  },
  guideTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#1F5E52',
    textAlign: 'center',
  },
  guideContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    flexWrap: 'wrap',
  },
  guideItem: {
    width: '45%',
    marginBottom: 15,
    flexDirection: 'row',
    alignItems: 'center',
  },
  guideItemNumber: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#2DBBA1',
    color: '#FFFFFF',
    textAlign: 'center',
    lineHeight: 30,
    fontWeight: 'bold',
    marginRight: 10,
  },
  guideItemText: {
    flex: 1,
    fontSize: 14,
    color: '#666666',
    lineHeight: 20,
  },
  // 登录页面样式补充
  loginTypeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  loginTypeButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: '#2DBBA1',
    backgroundColor: 'transparent',
  },
  loginTypeButtonActive: {
    backgroundColor: '#2DBBA1',
  },
  loginTypeText: {
    color: '#2DBBA1',
    fontWeight: 'bold',
  },
  loginTypeTextActive: {
    color: '#FFFFFF',
  },
  // 登录模式切换样式
  loginModeSwitcher: {
    flexDirection: 'row',
    backgroundColor: '#E5E7EB',
    borderRadius: 8,
    padding: 4,
    marginBottom: 16,
  },
  loginModeButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 6,
  },
  loginModeActive: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 1,
    elevation: 1,
  },
  loginModeText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
  },
  loginModeTextActive: {
    color: '#3BCCA5',
    fontWeight: '600',
  },
  verificationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  verificationInput: {
    flex: 1,
    marginRight: 10,
  },
  codeButton: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    backgroundColor: '#2DBBA1',
    borderRadius: 8,
  },
  codeButtonDisabled: {
    backgroundColor: '#B0B0B0',
  },
  codeButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  loginButton: {
    marginTop: 20,
  },
  footerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  footerText: {
    color: '#666666',
  },
  // 新登录界面样式
  loginLogoSection: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  loginLogoContainer: {
    width: 96,
    height: 96,
    borderRadius: 24,
    backgroundColor: '#E6F7F3',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.06,
    shadowRadius: 3.84,
    elevation: 5,
  },
  loginLogoIcon: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loginAppTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 8,
  },
  loginAppSubtitle: {
    fontSize: 16,
    color: '#4B5563',
    textAlign: 'center',
  },
  loginFormSection: {
    paddingHorizontal: 24,
    paddingBottom: 32,
  },
  loginTabSwitcher: {
    flexDirection: 'row',
    backgroundColor: '#E5E7EB',
    borderRadius: 8,
    padding: 4,
    marginBottom: 24,
  },
  loginTabButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 6,
  },
  loginTabActive: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 1,
    elevation: 1,
  },
  loginTabText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#6B7280',
  },
  loginTabTextActive: {
    color: '#3BCCA5',
    fontWeight: '600',
  },
  loginFormGroup: {
    gap: 8,
  },
  loginForm: {
    gap: 16,
  },
  loginFormInput: {
    width: '100%',
  },
  loginVerificationContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  loginVerificationInput: {
    flex: 1,
  },
  loginCodeButton: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    backgroundColor: '#2DBBA1',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loginCodeButtonDisabled: {
    backgroundColor: '#9CA3AF',
  },
  loginCodeButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
  },
  loginSubmitButton: {
    marginTop: 8,
    marginBottom: 16,
  },
  loginSubmitButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  loginForgotPassword: {
    alignItems: 'center',
    marginBottom: 24,
  },
  loginForgotPasswordText: {
    fontSize: 14,
    color: '#2DBBA1',
    fontWeight: '500',
  },
  // 体验APP按钮
  loginExperienceButton: {
    marginBottom: 24,
  },
  loginExperienceButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  loginExperienceSection: {
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  // 角色选择页面样式
  loginHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  loginBackButton: {
    padding: 8,
  },
  loginBackButtonText: {
    fontSize: 24,
    color: '#111827',
  },
  loginHeaderTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  loginHeaderRight: {
    width: 40,
  },
  roleSelectScrollContent: {
    padding: 24,
    paddingBottom: 120,
  },
  roleSelectSection: {
    marginBottom: 32,
  },
  roleSelectSectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 16,
  },
  roleSelectMainRolesContainer: {
    gap: 16,
  },
  roleSelectMainRoleCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.06,
    shadowRadius: 3.84,
    elevation: 5,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  roleSelectMainRoleCardSelected: {
    borderColor: '#2DBBA1',
    backgroundColor: 'rgba(45, 187, 161, 0.05)',
  },
  roleSelectMainRoleContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  roleSelectMainRoleIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 20,
  },
  roleSelectMainRoleInfo: {
    flex: 1,
  },
  roleSelectMainRoleTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  roleSelectMainRoleDescription: {
    fontSize: 14,
    color: '#4B5563',
  },
  roleSelectMainRoleArrow: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  roleSelectMainRoleArrowText: {
    fontSize: 20,
    color: '#6B7280',
  },
  roleSelectSubRolesContainer: {
    gap: 12,
  },
  roleSelectSubRoleCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  roleSelectSubRoleCardSelected: {
    borderColor: '#2DBBA1',
    backgroundColor: 'rgba(45, 187, 161, 0.1)',
  },
  roleSelectSubRoleTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#111827',
    marginBottom: 4,
  },
  roleSelectSubRoleDescription: {
    fontSize: 14,
    color: '#4B5563',
  },
  roleSelectDescriptionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.06,
    shadowRadius: 3.84,
    elevation: 5,
  },
  roleSelectDescriptionContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  roleSelectDescriptionIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#E6F7F3',
    justifyContent: 'center',
    alignItems: 'center',
    flexShrink: 0,
  },
  roleSelectDescriptionInfo: {
    flex: 1,
  },
  roleSelectDescriptionTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#111827',
    marginBottom: 8,
  },
  roleSelectDescriptionText: {
    fontSize: 14,
    color: '#4B5563',
    lineHeight: 20,
  },
  roleSelectBottomButtonContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    padding: 24,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  roleSelectNextButton: {
    backgroundColor: '#2DBBA1',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  roleSelectNextButtonDisabled: {
    opacity: 0.5,
  },
  roleSelectNextButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  // 体验模式页面样式
  experienceInfoCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 32,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.06,
    shadowRadius: 3.84,
    elevation: 5,
  },
  experienceInfoContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  experienceInfoIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#E6F7F3',
    justifyContent: 'center',
    alignItems: 'center',
    flexShrink: 0,
  },
  experienceInfoText: {
    flex: 1,
  },
  experienceInfoTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#111827',
    marginBottom: 8,
  },
  experienceInfoDescription: {
    fontSize: 14,
    color: '#4B5563',
    lineHeight: 20,
  },
  experienceRolesSection: {
    marginBottom: 32,
  },
  experienceRolesTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 16,
  },
  experienceRolesContainer: {
    gap: 16,
  },
  experienceRoleCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.06,
    shadowRadius: 3.84,
    elevation: 5,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  experienceRoleCardSelected: {
    borderColor: '#2DBBA1',
    backgroundColor: 'rgba(45, 187, 161, 0.05)',
  },
  experienceRoleContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  experienceRoleIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 20,
  },
  experienceRoleInfo: {
    flex: 1,
  },
  experienceRoleTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  experienceRoleDescription: {
    fontSize: 14,
    color: '#4B5563',
  },
  experienceRoleArrow: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  experienceRoleArrowText: {
    fontSize: 20,
    color: '#6B7280',
  },
  loginErrorText: {
    color: '#EF4444',
    fontSize: 14,
  },
  loginAgreementSection: {
    alignItems: 'center',
  },
  loginAgreementText: {
    fontSize: 12,
    color: '#9CA3AF',
    textAlign: 'center',
    lineHeight: 18,
  },
  loginAgreementLink: {
    color: '#2DBBA1',
    fontWeight: '500',
  },
  // 注册页面样式补充
  registerCard: {
    padding: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  section: {
    marginBottom: 20,
  },
  sectionLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#1F5E52',
  },
  // 诊断首页历史记录样式
  historyCard: {
    padding: 16,
    marginBottom: 16,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
  },
  historyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  historyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  viewAllText: {
    fontSize: 14,
    color: '#2DBBA1',
    fontWeight: '500',
  },
  historyList: {
    gap: 12,
  },
  historyItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  historyItemLeft: {
    flex: 1,
  },
  historyItemTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#111827',
    marginBottom: 4,
  },
  historyItemDate: {
    fontSize: 12,
    color: '#6B7280',
  },
  historyItemStatus: {
    fontSize: 14,
    fontWeight: '500',
    color: '#2DBBA1',
  },
  // 指南列表样式
  guideList: {
    marginTop: 16,
    gap: 12,
  },
  // 诊断首页样式
  diagnosisHomeIntroSection: {
    marginBottom: 24,
  },
  diagnosisHomeIntroCard: {
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.06,
    shadowRadius: 3.84,
    elevation: 5,
  },
  diagnosisHomeIntroTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#111827',
    marginBottom: 8,
  },
  diagnosisHomeIntroText: {
    fontSize: 14,
    color: '#4B5563',
  },
  diagnosisHomeModeCardsSection: {
    marginBottom: 24,
  },
  diagnosisHomeModeCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.06,
    shadowRadius: 3.84,
    elevation: 5,
    borderWidth: 2,
    borderColor: 'transparent',
    marginBottom: 16,
  },
  diagnosisHomeModeCardContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 0,
  },
  diagnosisHomeModeCardIcon: {
    width: 56,
    height: 56,
    backgroundColor: '#E6F7F3',
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    flexShrink: 0,
    marginRight: 16,
    shadowColor: '#2DBBA1',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4.65,
    elevation: 5,
  },
  diagnosisHomeModeCardInfo: {
    flex: 1,
  },
  diagnosisHomeModeCardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 8,
  },
  diagnosisHomeModeCardDescription: {
    fontSize: 14,
    color: '#4B5563',
    marginBottom: 12,
    lineHeight: 20,
  },
  diagnosisHomeModeCardBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  diagnosisHomeModeCardBadgeIcon: {
    fontSize: 16,
    marginRight: 6,
  },
  diagnosisHomeModeCardBadgeText: {
    fontSize: 12,
    color: '#6B7280',
  },
  diagnosisHomeNotesSection: {
    marginBottom: 24,
  },
  diagnosisHomeNotesCard: {
    padding: 16,
    backgroundColor: '#EBF8FF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#3182CE',
  },
  diagnosisHomeNotesContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 0,
  },
  diagnosisHomeNotesIcon: {
    fontSize: 24,
    flexShrink: 0,
    marginTop: 2,
    marginRight: 12,
  },
  diagnosisHomeNotesInfo: {
    flex: 1,
  },
  diagnosisHomeNotesTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#111827',
    marginBottom: 4,
  },
  diagnosisHomeNotesText: {
    fontSize: 12,
    color: '#4B5563',
    lineHeight: 18,
  },
  // 认证页面样式
  authTypeInfoCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.06,
    shadowRadius: 3.84,
    elevation: 5,
  },
  authTypeInfoContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 16,
    marginBottom: 16,
  },
  authTypeInfoIcon: {
    width: 48,
    height: 48,
    backgroundColor: '#E6F7F3',
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    flexShrink: 0,
  },
  authTypeInfoText: {
    flex: 1,
  },
  authTypeInfoTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  authTypeInfoDescription: {
    fontSize: 14,
    color: '#4B5563',
  },
  authBenefits: {
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    padding: 12,
  },
  authBenefitsTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#111827',
    marginBottom: 8,
  },
  authBenefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  authBenefitIcon: {
    fontSize: 12,
    marginRight: 8,
    color: '#2DBBA1',
  },
  authBenefitText: {
    fontSize: 14,
    color: '#4B5563',
  },
  authFormCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.06,
    shadowRadius: 3.84,
    elevation: 5,
  },
  authFormTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 16,
  },
  authFormGroup: {
    marginBottom: 16,
  },
  authFormLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#111827',
    marginBottom: 8,
  },
  authFormInput: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    color: '#111827',
  },
  authFormSelect: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    overflow: 'hidden',
  },
  authFormSelectButton: {
    padding: 12,
    backgroundColor: '#F3F4F6',
  },
  authFormSelectButtonText: {
    color: '#4B5563',
    fontSize: 16,
  },
  authUploadArea: {
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: '#E5E7EB',
    borderRadius: 8,
    padding: 24,
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
  },
  authUploadIcon: {
    fontSize: 48,
    color: '#9CA3AF',
    marginBottom: 8,
  },
  authUploadText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#111827',
    marginBottom: 4,
  },
  authUploadSubtext: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  authUploadPreview: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    overflow: 'hidden',
  },
  authUploadPreviewImage: {
    width: '100%',
    height: 180,
    resizeMode: 'cover',
  },
  authUploadPreviewButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    padding: 12,
    gap: 12,
  },
  authUploadPreviewButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
  },
  authUploadPreviewButtonDelete: {
    backgroundColor: '#FEE2E2',
  },
  authUploadPreviewButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#111827',
  },
  authUploadPreviewButtonTextDelete: {
    color: '#EF4444',
  },
  authSubmitButton: {
    backgroundColor: '#E6F7F3',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    marginBottom: 12,
    shadowColor: '#2DBBA1',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 3.84,
    elevation: 5,
  },
  authSubmitNote: {
    textAlign: 'center',
    fontSize: 12,
    color: '#9CA3AF',
    marginTop: 12,
  },
  // 聊天诊断页面样式
  chatMessagesContainer: {
    flexGrow: 1,
    padding: 16,
    gap: 16,
    backgroundColor: '#F3F4F6',
  },
  chatMessageRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  chatAiMessageRow: {
    justifyContent: 'flex-start',
  },
  chatUserMessageRow: {
    justifyContent: 'flex-end',
  },
  chatAiAvatar: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  chatUserAvatar: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  chatMessageBubble: {
    maxWidth: '75%',
    padding: 12,
    borderRadius: 16,
  },
  chatAiMessageBubble: {
    backgroundColor: '#FFFFFF',
    borderBottomLeftRadius: 4,
  },
  chatUserMessageBubble: {
    backgroundColor: '#2DBBA1',
    borderBottomRightRadius: 4,
  },
  chatAiHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  chatAiName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
  },
  chatMessageImages: {
    gap: 8,
    marginBottom: 8,
  },
  chatMessageImage: {
    width: 150,
    height: 150,
    borderRadius: 8,
  },
  chatMessageText: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 4,
  },
  chatAiMessageText: {
    color: '#111827',
  },
  chatUserMessageText: {
    color: '#FFFFFF',
  },
  chatMessageTimestamp: {
    fontSize: 12,
    color: '#6B7280',
    alignSelf: 'flex-end',
  },
  chatInputArea: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 12,
    padding: 12,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  chatFunctionButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  chatFunctionButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  chatFunctionButtonIcon: {
    fontSize: 20,
  },
  chatMessageInput: {
    flex: 1,
    minHeight: 40,
    maxHeight: 100,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    fontSize: 14,
    color: '#111827',
  },
  chatSendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#2DBBA1',
    justifyContent: 'center',
    alignItems: 'center',
  },
  chatSendButtonIcon: {
    fontSize: 20,
    color: '#FFFFFF',
  },
  chatImagePreviewContainer: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  chatImagePreviewList: {
    flexDirection: 'row',
    gap: 12,
  },
  chatImagePreviewWrapper: {
    position: 'relative',
    width: 80,
    height: 80,
  },
  chatImagePreview: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  chatRemoveImageButton: {
    position: 'absolute',
    top: -8,
    right: -8,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#EF4444',
    justifyContent: 'center',
    alignItems: 'center',
  },
  chatRemoveImageText: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  chatTypingIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    marginHorizontal: 12,
    marginBottom: 8,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    alignSelf: 'flex-start',
  },
  chatTypingText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#6B7280',
  },
  // AI兽医诊断页面样式
  tabContainer: {
    marginBottom: 16,
  },
  tabScrollView: {
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    paddingHorizontal: 4,
  },
  tabButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 16,
    marginVertical: 4,
    marginHorizontal: 4,
  },
  tabActive: {
    backgroundColor: '#2DBBA1',
  },
  tabButtonText: {
    color: '#6B7280',
    fontSize: 14,
    fontWeight: '500',
  },
  tabButtonTextActive: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  tabContent: {
    padding: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 12,
  },
  formGrid: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 16,
  },
  gridItem: {
    flex: 1,
  },
  testResultItem: {
    marginBottom: 16,
  },
  testResultLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#111827',
    marginBottom: 8,
  },
  experimentItem: {
    marginBottom: 16,
  },
  experimentItemTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 12,
  },
  imageUploadGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  uploadedImageWrapper: {
    position: 'relative',
    width: 100,
    height: 100,
    borderRadius: 8,
    overflow: 'hidden',
  },

  uploadButtonIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  uploadButtonText: {
    fontSize: 12,
    color: '#6B7280',
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  // 诊断报告页面样式
  reportHeader: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.06,
    shadowRadius: 3.84,
    elevation: 2,
  },
  reportHeaderContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  reportTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  reportNumber: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  reportTimeInfo: {
    alignItems: 'flex-end',
  },
  reportTime: {
    fontSize: 12,
    color: '#9CA3AF',
    marginBottom: 2,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.06,
    shadowRadius: 3.84,
    elevation: 2,
  },

  sectionIcon: {
    fontSize: 20,
    marginRight: 8,
  },
  infoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
  },
  infoItem: {
    width: '50%',
    marginBottom: 12,
  },
  infoLabel: {
    fontSize: 12,
    color: '#9CA3AF',
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 14,
    color: '#111827',
  },
  symptomsSection: {
    marginTop: 8,
  },
  symptomsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  symptomTag: {
    backgroundColor: '#EBF8FF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  symptomTagText: {
    fontSize: 12,
    color: '#3182CE',
  },
  conclusionCard: {
    backgroundColor: '#F0FFF4',
    borderWidth: 1,
    borderColor: '#C6F6D5',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  conclusionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#22543D',
    marginBottom: 8,
  },
  conclusionDescription: {
    fontSize: 14,
    color: '#22543D',
  },
  basisSection: {
    marginTop: 8,
  },
  basisTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 8,
  },
  basisList: {
    gap: 4,
  },
  basisItem: {
    fontSize: 14,
    color: '#4B5563',
    marginBottom: 4,
  },
  planTabs: {
    flexDirection: 'row',
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    padding: 4,
    marginBottom: 16,
  },
  planTab: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
  },
  planTabActive: {
    backgroundColor: '#2DBBA1',
  },
  planTabText: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  planTabTextActive: {
    color: '#FFFFFF',
  },
  planContent: {
    gap: 12,
  },
  planItem: {
    flexDirection: 'row',
    gap: 12,
  },
  planItemIcon: {
    fontSize: 16,
    color: '#10B981',
    marginTop: 2,
  },
  planItemTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  planItemDescription: {
    fontSize: 14,
    color: '#4B5563',
  },
  optimizationList: {
    gap: 12,
  },
  optimizationItem: {
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    padding: 12,
  },
  optimizationTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  optimizationDescription: {
    fontSize: 14,
    color: '#4B5563',
  },
  saveButton: {
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#2DBBA1',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  saveButtonIcon: {
    fontSize: 20,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2DBBA1',
  },
  shareButton: {
    backgroundColor: '#2DBBA1',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
    shadowColor: '#2DBBA1',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 3.84,
    elevation: 5,
  },
  shareButtonIcon: {
    fontSize: 20,
    color: '#FFFFFF',
  },
  shareButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  // 诊断历史页面样式
  diagnosisHistoryList: {
    gap: 16,
  },
  diagnosisHistoryItem: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 4,
  },
  diagnosisHistoryItemContent: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  diagnosisHistoryItemImage: {
    marginRight: 12,
  },
  diagnosisHistoryItemInfo: {
    flex: 1,
  },
  diagnosisHistoryItemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  diagnosisHistoryItemId: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
  },
  diagnosisHistoryItemStatus: {
    fontSize: 12,
    fontWeight: '500',
    paddingVertical: 2,
    paddingHorizontal: 8,
    borderRadius: 12,
  },
  statusConfirmed: {
    backgroundColor: '#D1FAE5',
    color: '#1F5E52',
  },
  statusPreDiagnosis: {
    backgroundColor: '#FEF3C7',
    color: '#92400E',
  },
  diagnosisHistoryItemDate: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 4,
  },
  diagnosisHistoryItemMode: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 4,
  },
  diagnosisHistoryItemResult: {
    fontSize: 14,
    color: '#111827',
    marginBottom: 8,
  },
  diagnosisHistoryItemSymptoms: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  diagnosisHistoryItemSymptomTag: {
    backgroundColor: '#E6F7F3',
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 16,
    fontSize: 12,
    color: '#1F5E52',
  },
  diagnosisHistoryItemSymptomMore: {
    backgroundColor: '#F3F4F6',
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 16,
    fontSize: 12,
    color: '#6B7280',
  },
  diagnosisHistoryItemActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
  },
  diagnosisHistoryItemActionButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: '#E6F7F3',
  },
  diagnosisHistoryItemActionText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1F5E52',
  },
  deleteButtonText: {
    color: '#EF4444',
  },

  emptyHistoryContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 64,
  },
  emptyHistoryIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptyHistoryTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 8,
  },
  emptyHistoryText: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 24,
    textAlign: 'center',
    paddingHorizontal: 32,
  },
  emptyHistoryButton: {
    backgroundColor: '#2DBBA1',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  emptyHistoryButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  // 生产管理样式
  productionModulesContainer: {
    paddingBottom: 24,
  },
  productionModuleCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    flexDirection: 'row',
    alignItems: 'center',
  },
  productionModuleIcon: {
    width: 60,
    height: 60,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  productionModuleContent: {
    flex: 1,
  },
  productionModuleTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  productionModuleDescription: {
    fontSize: 14,
    color: '#6B7280',
  },
  productionModuleArrow: {
    marginLeft: 8,
  },
  productionModuleArrowText: {
    fontSize: 18,
    color: '#6B7280',
  },
  
  // 批次管理样式
  batchList: {
    padding: 16,
  },
  batchItem: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  batchItemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  batchItemTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
  },
  batchItemStatus: {
    fontSize: 14,
    fontWeight: '500',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 12,
  },
  batchStatusActive: {
    backgroundColor: '#D1FAE5',
    color: '#1F5E52',
  },
  batchStatusInactive: {
    backgroundColor: '#F3F4F6',
    color: '#6B7280',
  },
  batchItemContent: {
    marginBottom: 12,
  },
  batchItemInfo: {
    fontSize: 14,
    color: '#4B5563',
    marginBottom: 4,
  },
  batchItemActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  actionButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
    marginLeft: 8,
  },
  editButton: {
    backgroundColor: '#E6F7F3',
  },
  deleteButton: {
    backgroundColor: '#FEE2E2',
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: '500',
  },
  
  // 模态框样式
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    width: '90%',
    maxHeight: '80%',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
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
  modalCloseButton: {
    fontSize: 24,
    color: '#6B7280',
    padding: 4,
  },
  modalBody: {
    padding: 16,
  },
  modalInput: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    fontSize: 14,
    backgroundColor: '#FFFFFF',
  },
  modalFooter: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  modalButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginLeft: 12,
  },
  cancelButton: {
    backgroundColor: '#F3F4F6',
  },
  submitButton: {
    backgroundColor: '#2DBBA1',
  },
  modalButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#FFFFFF',
  },
  
  // 表单样式
  formGroup: {
    marginBottom: 16,
  },
  formLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#4B5563',
    marginBottom: 8,
  },
  formInput: {
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    padding: 12,
    fontSize: 15,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    color: '#1F2937',
  },
  
  // 死淘/耗料记录样式
  batchSelectContainer: {
    padding: 16,
  },
  batchSelectLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#4B5563',
    marginBottom: 12,
  },
  batchSelectScrollView: {
    marginBottom: 16,
  },
  batchSelectItem: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  batchSelectItemSelected: {
    backgroundColor: '#2DBBA1',
    borderColor: '#2DBBA1',
  },
  batchSelectItemText: {
    fontSize: 14,
    color: '#4B5563',
    fontWeight: '500',
  },
  batchSelectItemTextSelected: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  selectedBatchInfo: {
    padding: 16,
    backgroundColor: '#E6F7F3',
    marginBottom: 8,
  },
  selectedBatchText: {
    fontSize: 14,
    color: '#1F5E52',
  },
  recordList: {
    padding: 16,
  },
  deathFeedItem: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  deathFeedItemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  deathFeedItemDate: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  deathFeedItemBatch: {
    fontSize: 14,
    color: '#6B7280',
  },
  deathFeedItemContent: {
    marginBottom: 12,
  },
  deathFeedItemStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    padding: 12,
  },
  statItem: {
    alignItems: 'center',
  },
  statItemLabel: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 4,
  },
  statItemValue: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
  },
  deathFeedItemActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  addFirstRecordButton: {
    marginTop: 16,
    paddingVertical: 12,
    paddingHorizontal: 24,
    backgroundColor: '#2DBBA1',
    borderRadius: 8,
    alignItems: 'center',
  },
  addFirstRecordText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  
  // 员工管理样式
  employeeList: {
    padding: 16,
  },
  employeeItem: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  employeeItemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  employeeItemName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
  },
  employeeItemRole: {
    fontSize: 14,
    backgroundColor: '#E6F7F3',
    color: '#1F5E52',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 12,
  },
  employeeItemContent: {
    marginBottom: 12,
  },
  employeeItemPermissionsTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#4B5563',
    marginBottom: 8,
  },
  employeePermissionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  employeePermissionTag: {
    backgroundColor: '#EBF5FF',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
  },
  employeePermissionTagText: {
    fontSize: 14,
    color: '#3B82F6',
  },
  employeeItemActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  
  // 权限设置样式
  permissionOptionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  permissionOptionItem: {
    backgroundColor: '#F9FAFB',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  permissionOptionItemSelected: {
    backgroundColor: '#D1FAE5',
    borderColor: '#2DBBA1',
  },
  permissionOptionText: {
    fontSize: 14,
    color: '#4B5563',
  },
  permissionOptionTextSelected: {
    color: '#1F5E52',
    fontWeight: '500',
  },
  
  // 空状态样式
  emptyState: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 24,
    alignItems: 'center',
    margin: 16,
  },

  // 日期筛选器样式
  filterValue: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
  },
  filterValueText: {
    fontSize: 14,
    color: '#111827',
    marginRight: 4,
  },
  filterValueIcon: {
    fontSize: 16,
  },
  
  // 筛选器样式
  filterItem: {
    marginBottom: 16,
  },
  filterLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#111827',
    marginBottom: 8,
  },
  filterOptions: {
    flexDirection: 'row',
  },
  filterOption: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  filterOptionActive: {
    backgroundColor: '#1F5E52',
    borderColor: '#1F5E52',
  },
  filterOptionText: {
    fontSize: 14,
    color: '#6B7280',
  },
  filterOptionTextActive: {
    color: '#FFFFFF',
    fontWeight: '500',
  },
  
  // 热力图样式
  heatmapContainer: {
    padding: 16,
    backgroundColor: '#FFFFFF',
    marginBottom: 12,
  },
  heatmapPlaceholder: {
    height: 200,
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  heatmapPlaceholderIcon: {
    fontSize: 48,
    marginBottom: 8,
  },
  heatmapPlaceholderText: {
    fontSize: 18,
    fontWeight: '500',
    color: '#111827',
    marginBottom: 4,
  },
  heatmapPlaceholderSubtext: {
    fontSize: 14,
    color: '#6B7280',
  },
  heatmapLegend: {
    marginTop: 16,
  },
  heatmapLegendTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#4B5563',
    marginBottom: 8,
  },
  heatmapLegendItems: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  heatmapLegendItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  heatmapLegendColor: {
    width: 16,
    height: 16,
    borderRadius: 4,
    marginRight: 6,
  },
  heatmapLegendText: {
    fontSize: 14,
    color: '#6B7280',
  },
  
  // 通用区块标题样式
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  
  // 个人中心样式
  profileUserCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 3.84,
    elevation: 2
  },
  
  profileUserInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  
  profileUserAvatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#E6F7F3',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  
  profileUserDetails: {
    flex: 1,
  },
  
  profileUserName: {
    fontSize: 20,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  
  profileUserRole: {
    fontSize: 14,
    color: '#6B7280',
  },
  
  profileMenuSection: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 8,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 3.84,
    elevation: 2
  },
  
  profileMenuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
  },
  
  profileMenuItemIcon: {
    marginRight: 12,
  },
  
  profileMenuItemText: {
    flex: 1,
    fontSize: 16,
    color: '#111827',
  },
  
  profileMenuArrow: {
    fontSize: 16,
    color: '#9CA3AF',
  },
  
  profileVersionInfo: {
    alignItems: 'center',
    marginTop: 32,
    padding: 16,
  },
  
  profileVersionText: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 4,
  },
  
  profileCopyrightText: {
    fontSize: 12,
    color: '#9CA3AF',
  },

  // 编辑个人信息页面样式
  profileEditSection: {
    marginBottom: 16,
  },
  profileEditLabel: {
    fontSize: 14,
    color: '#374151',
    marginBottom: 6,
    fontWeight: '600',
  },
  profileEditInput: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    color: '#111827',
  },
  profileEditInfoCard: {
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    padding: 16,
    marginTop: 8,
  },
  profileEditInfoText: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 4,
  },
  profileEditBottomButtonContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  profileEditSaveButton: {
    backgroundColor: '#2DBBA1',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
  },
  profileEditSaveButtonDisabled: {
    opacity: 0.6,
  },
  profileEditSaveButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  
  // 统计页面样式
  statisticsScrollContent: {
    padding: 16,
    paddingBottom: 100,
  },
  dataCardsContainer: {
    marginBottom: 16,
  },
  
  // 疫情热力图样式
  epidemicHeatmapFilters: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  
  epidemicDataSection: {
    padding: 16,
    backgroundColor: '#FFFFFF',
    marginBottom: 12,
  },
  
  epidemicStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 16,
  },
  
  epidemicStatItem: {
    alignItems: 'center',
  },
  
  epidemicStatValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 4,
  },
  
  epidemicStatLabel: {
    fontSize: 14,
    color: '#6B7280',
  },
  
  epidemicDetailSection: {
    padding: 16,
    backgroundColor: '#FFFFFF',
    marginBottom: 12,
  },
  
  epidemicDetailList: {
    marginTop: 16,
  },
  
  epidemicDetailItem: {
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  
  epidemicDetailHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  
  epidemicDetailLocation: {
    fontSize: 16,
    fontWeight: '500',
    color: '#111827',
  },
  
  epidemicDetailRiskLevel: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  
  epidemicDetailRiskText: {
    fontSize: 12,
    fontWeight: '500',
  },
  
  epidemicDetailInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  
  epidemicDetailDisease: {
    fontSize: 14,
    color: '#374151',
  },
  
  epidemicDetailCases: {
    fontSize: 14,
    color: '#EF4444',
    fontWeight: '500',
  },
  
  epidemicDetailActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  
  epidemicDetailActionButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
    backgroundColor: '#1F5E52',
  },
  
  epidemicDetailActionText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#FFFFFF',
  },
  
  epidemicAlertsSection: {
    padding: 16,
    backgroundColor: '#FFFFFF',
  },
  
  sectionMoreText: {
    fontSize: 14,
    color: '#1F5E52',
    fontWeight: '500',
  },
  
  epidemicAlertItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#FEF3C7',
    borderRadius: 8,
    marginBottom: 12,
  },
  
  epidemicAlertContent: {
    flex: 1,
    marginRight: 12,
  },
  
  epidemicAlertIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FCD34D',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  
  epidemicAlertIcon: {
    fontSize: 20,
  },
  
  epidemicAlertInfo: {
    flex: 1,
  },
  
  epidemicAlertTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#92400E',
    marginBottom: 4,
  },
  
  epidemicAlertTime: {
    fontSize: 12,
    color: '#B45309',
    marginBottom: 4,
  },
  
  epidemicAlertDescription: {
    fontSize: 14,
    color: '#B45309',
    lineHeight: 20,
  },
  
  epidemicAlertAction: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
    backgroundColor: '#F59E0B',
  },
  
  epidemicAlertActionText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#FFFFFF',
  },
  emptyStateText: {
    fontSize: 16,
    color: '#6B7280',
    marginBottom: 16,
  },

  addFirstEmployeeButton: {
    backgroundColor: '#E6F7F3',
    borderRadius: 8,
    padding: 12,
  },
  addFirstEmployeeText: {
    fontSize: 15,
    fontWeight: '500',
    color: '#1F5E52',
  },
});
