import { StyleSheet } from 'react-native';
import { colors } from '../theme';

export const styles = StyleSheet.create({
  // 启动屏幕样式
  splashScreenContainer: {
    flex: 1,
    backgroundColor: colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
  },
  splashLogoContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: colors.primaryLight,
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
    color: colors.primaryDark,
    marginBottom: 8,
  },
  splashAppSubtitle: {
    fontSize: 16,
    color: colors.textSecondary,
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
    color: colors.primaryDark,
    marginBottom: 8,
  },
  homeWelcomeDescription: {
    fontSize: 16,
    color: colors.textSecondary,
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
    backgroundColor: colors.primaryLight,
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
    color: colors.primaryDark,
  },
  homeSectionItems: {
    gap: 16,
  },
  homeSectionItemCard: {
    backgroundColor: colors.surface,
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
    backgroundColor: colors.primaryLight,
    marginRight: 16,
  },
  homeSectionItemInfo: {
    flex: 1,
  },
  homeSectionItemTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.primaryDark,
    marginBottom: 4,
  },
  homeSectionItemDescription: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  homeSectionItemArrow: {
    marginLeft: 8,
  },
  homeSectionItemArrowText: {
    fontSize: 20,
    color: colors.primary,
  },
  homeAnnouncementSection: {
    marginTop: 24,
  },
  homeAnnouncementCard: {
    backgroundColor: colors.surface,
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
    color: colors.primaryDark,
    marginBottom: 4,
  },
  homeAnnouncementDescription: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  // 首页差异化：渐变CTA大卡片
  homeCtaCard: {
    borderRadius: 16,
    padding: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  homeCtaTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.primaryDark,
    marginBottom: 6,
  },
  homeCtaDesc: {
    fontSize: 14,
    color: 'rgba(31, 94, 82, 0.8)',
  },
  homeCtaIconWrap: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  // 首页差异化：数据指标卡
  homeMetricCard: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 16,
    flex: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  homeMetricRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  homeMetricLabel: {
    fontSize: 13,
    fontWeight: '500',
    color: colors.textSecondary,
  },
  homeMetricValue: {
    fontSize: 26,
    fontWeight: 'bold',
  },
  homeMetricUnit: {
    fontSize: 13,
    color: colors.textSecondary,
    marginLeft: 2,
  },
  homeMetricSub: {
    fontSize: 12,
    color: colors.textTertiary,
    marginTop: 4,
  },
  // 首页差异化：2x2网格卡
  homeGridCard: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 16,
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  homeGridIconWrap: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  homeGridTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.primaryDark,
    marginBottom: 2,
  },
  homeGridDesc: {
    fontSize: 12,
    color: colors.textTertiary,
  },
  // 首页差异化：进度条
  homeProgressBar: {
    flex: 1,
    height: 8,
    backgroundColor: colors.border,
    borderRadius: 4,
    marginHorizontal: 12,
  },
  homeProgressFill: {
    height: 8,
    borderRadius: 4,
  },
  // 首页差异化：告警条目
  homeAlertCard: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
    borderLeftWidth: 4,
  },
  // 首页差异化：任务条目
  homeTaskCard: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  homeTaskCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  // 首页差异化：信息列表条目
  homeInfoCard: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  homeInfoCardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  homeInfoTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.primaryDark,
    marginBottom: 4,
  },
  homeInfoSub: {
    fontSize: 13,
    color: colors.textSecondary,
    marginBottom: 2,
  },
  homeInfoTime: {
    fontSize: 12,
    color: colors.textTertiary,
  },
  // 首页差异化：区域标题
  homeSectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  homeSectionHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  homeSectionHeaderTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.primaryDark,
  },
  homeSectionHeaderAction: {
    fontSize: 14,
    color: colors.primary,
  },
  // 首页差异化：统计3格
  homeStats3Col: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  homeStats3Card: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 16,
    flex: 1,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  homeStats3IconWrap: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  homeStats3Value: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  homeStats3Label: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  // 首页差异化：2x2网格容器
  homeGrid2x2: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  homeGrid2x2Item: {
    width: '48%',
  },
  // 全局样式定义
  container: {
    flex: 1,
    backgroundColor: colors.background, // 统一背景色为浅绿色
  },
  scrollContent: {
    padding: 16,
  },
  // 统一按钮样式
  primaryButton: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
    shadowColor: colors.primary,
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
    color: colors.surface,
  },
  secondaryButton: {
    backgroundColor: colors.surface,
    borderWidth: 2,
    borderColor: colors.primary,
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
    color: colors.primary,
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
    backgroundColor: colors.border,
  },
  stepIndicatorActive: {
    backgroundColor: colors.primary,
  },
  stepIndicatorCompleted: {
    backgroundColor: colors.primary,
  },
  stepIndicatorText: {
    color: colors.surface,
    fontWeight: 'bold',
    fontSize: 14,
  },
  stepIndicatorTextActive: {
    color: colors.surface,
    fontWeight: 'bold',
    fontSize: 14,
  },
  stepIndicatorTextCompleted: {
    color: colors.surface,
    fontWeight: 'bold',
    fontSize: 14,
  },
  stepSeparator: {
    width: 40,
    height: 2,
    backgroundColor: colors.border,
    marginHorizontal: 10,
  },
  stepSeparatorCompleted: {
    backgroundColor: colors.primary,
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
    backgroundColor: colors.border,
    marginBottom: 4,
  },
  stageCircleText: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.textDisabled,
  },
  stageLine: {
    flex: 1,
    height: 2,
    backgroundColor: colors.border,
    marginHorizontal: 12,
  },
  stageText: {
    fontSize: 12,
    color: colors.textDisabled,
  },
  stageActive: {
    backgroundColor: colors.primary,
  },
  stageActiveText: {
    color: colors.primary,
    fontWeight: '500',
  },
  stepCard: {
    marginBottom: 16,
  },
  stepTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    color: colors.primaryDark,
  },
  sectionSubtitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
    color: colors.primaryDark,
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
    borderTopColor: colors.border,
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
    borderColor: colors.border,
    marginRight: 10,
    marginBottom: 10,
  },
  symptomItemSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  symptomItemText: {
    color: colors.textPrimary,
  },
  symptomItemTextSelected: {
    color: colors.surface,
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
    backgroundColor: colors.error,
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  removeImageText: {
    color: colors.surface,
    fontSize: 16,
    fontWeight: 'bold',
  },
  noImagesContainer: {
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.surfaceMuted,
    borderRadius: 8,
    marginBottom: 10,
  },
  noImagesText: {
    color: colors.textTertiary,
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
    color: colors.primaryDark,
    fontSize: 16,
  },
  diagnosisSummary: {
    backgroundColor: colors.surfaceMuted,
    padding: 16,
    borderRadius: 8,
    marginBottom: 20,
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    color: colors.primaryDark,
  },
  summaryText: {
    marginBottom: 5,
    color: colors.textPrimary,
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
    backgroundColor: colors.primary,
    borderBottomRightRadius: 4,
  },
  aiMessageBubble: {
    backgroundColor: colors.surfaceMuted,
    borderBottomLeftRadius: 4,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 22,
  },
  userMessageText: {
    color: colors.surface,
  },
  aiMessageText: {
    color: colors.textPrimary,
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
    borderColor: colors.border,
  },
  imagePickerButton: {
    marginRight: 10,
    padding: 10,
    backgroundColor: colors.surfaceMuted,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imagePickerIcon: {
    fontSize: 24,
  },
  textInput: {
    flex: 1,
    backgroundColor: colors.surfaceMuted,
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
    color: colors.textTertiary,
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
    borderColor: colors.primary,
    backgroundColor: 'transparent',
  },
  roleButtonActive: {
    backgroundColor: colors.primary,
  },
  roleButtonText: {
    color: colors.primary,
    fontWeight: 'bold',
  },
  roleButtonTextActive: {
    color: colors.surface,
  },
  errorText: {
    color: colors.error,
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
    color: colors.textSecondary,
  },
  loginLink: {
    color: colors.primary,
    fontWeight: 'bold',
    marginLeft: 5,
  },
  // 诊断首页样式
  introCard: {
    marginBottom: 20,
    padding: 20,
    backgroundColor: colors.primaryLight,
  },
  introTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: colors.primaryDark,
  },
  introText: {
    fontSize: 16,
    color: colors.textSecondary,
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
    color: colors.primaryDark,
  },
  modeDescription: {
    fontSize: 14,
    color: colors.textSecondary,
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
    color: colors.primaryDark,
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    marginBottom: 30,
  },
  loginCard: {
    padding: 20,
    backgroundColor: colors.surface,
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
    color: colors.primaryDark,
    marginBottom: 20,
    textAlign: 'center',
  },
  forgotPassword: {
    textAlign: 'right',
    marginTop: 10,
    marginBottom: 20,
    color: colors.primary,
    fontWeight: 'bold',
  },
  registerLink: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  registerLinkText: {
    color: colors.textSecondary,
  },
  registerLinkButton: {
    color: colors.primary,
    fontWeight: 'bold',
    marginLeft: 5,
  },
  // 聊天诊断页面样式
  chatContainer: {
    flex: 1,
    backgroundColor: colors.surface,
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
    color: colors.primaryDark,
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
    backgroundColor: colors.primary,
    color: colors.surface,
    textAlign: 'center',
    lineHeight: 30,
    fontWeight: 'bold',
    marginRight: 10,
  },
  guideItemText: {
    flex: 1,
    fontSize: 14,
    color: colors.textSecondary,
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
    borderColor: colors.primary,
    backgroundColor: 'transparent',
  },
  loginTypeButtonActive: {
    backgroundColor: colors.primary,
  },
  loginTypeText: {
    color: colors.primary,
    fontWeight: 'bold',
  },
  loginTypeTextActive: {
    color: colors.surface,
  },
  // 登录模式切换样式
  loginModeSwitcher: {
    flexDirection: 'row',
    backgroundColor: colors.border,
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
    backgroundColor: colors.surface,
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
    color: colors.textTertiary,
  },
  loginModeTextActive: {
    color: colors.primary,
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
    backgroundColor: colors.primary,
    borderRadius: 8,
  },
  codeButtonDisabled: {
    backgroundColor: colors.textDisabled,
  },
  codeButtonText: {
    color: colors.surface,
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
    color: colors.textSecondary,
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
    backgroundColor: colors.primaryLight,
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
    color: colors.textPrimary,
    marginBottom: 8,
  },
  loginAppSubtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  loginFormSection: {
    paddingHorizontal: 24,
    paddingBottom: 32,
  },
  loginTabSwitcher: {
    flexDirection: 'row',
    backgroundColor: colors.border,
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
    backgroundColor: colors.surface,
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
    color: colors.textTertiary,
  },
  loginTabTextActive: {
    color: colors.primary,
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
    backgroundColor: colors.primary,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loginCodeButtonDisabled: {
    backgroundColor: colors.textDisabled,
  },
  loginCodeButtonText: {
    color: colors.surface,
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
    color: colors.primary,
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
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  loginBackButton: {
    padding: 8,
  },
  loginBackButtonText: {
    fontSize: 24,
    color: colors.textPrimary,
  },
  loginHeaderTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.textPrimary,
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
    color: colors.textPrimary,
    marginBottom: 16,
  },
  roleSelectMainRolesContainer: {
    gap: 16,
  },
  roleSelectMainRoleCard: {
    backgroundColor: colors.surface,
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
    borderColor: colors.primary,
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
    color: colors.textPrimary,
    marginBottom: 4,
  },
  roleSelectMainRoleDescription: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  roleSelectMainRoleArrow: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  roleSelectMainRoleArrowText: {
    fontSize: 20,
    color: colors.textTertiary,
  },
  roleSelectSubRolesContainer: {
    gap: 12,
  },
  roleSelectSubRoleCard: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  roleSelectSubRoleCardSelected: {
    borderColor: colors.primary,
    backgroundColor: 'rgba(45, 187, 161, 0.1)',
  },
  roleSelectSubRoleTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.textPrimary,
    marginBottom: 4,
  },
  roleSelectSubRoleDescription: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  roleSelectDescriptionCard: {
    backgroundColor: colors.surface,
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
    backgroundColor: colors.primaryLight,
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
    color: colors.textPrimary,
    marginBottom: 8,
  },
  roleSelectDescriptionText: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  roleSelectBottomButtonContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.surface,
    padding: 24,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  roleSelectNextButton: {
    backgroundColor: colors.primary,
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
    color: colors.surface,
  },
  // 体验模式页面样式
  experienceInfoCard: {
    backgroundColor: colors.surface,
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
    backgroundColor: colors.primaryLight,
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
    color: colors.textPrimary,
    marginBottom: 8,
  },
  experienceInfoDescription: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  experienceRolesSection: {
    marginBottom: 32,
  },
  experienceRolesTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 16,
  },
  experienceRolesContainer: {
    gap: 16,
  },
  experienceRoleCard: {
    backgroundColor: colors.surface,
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
    borderColor: colors.primary,
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
    color: colors.textPrimary,
    marginBottom: 4,
  },
  experienceRoleDescription: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  experienceRoleArrow: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  experienceRoleArrowText: {
    fontSize: 20,
    color: colors.textTertiary,
  },
  loginErrorText: {
    color: colors.error,
    fontSize: 14,
  },
  loginAgreementSection: {
    alignItems: 'center',
  },
  loginAgreementText: {
    fontSize: 12,
    color: colors.textDisabled,
    textAlign: 'center',
    lineHeight: 18,
  },
  loginAgreementLink: {
    color: colors.primary,
    fontWeight: '500',
  },
  // 注册页面样式补充
  registerCard: {
    padding: 20,
    backgroundColor: colors.surface,
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
    color: colors.primaryDark,
  },
  // 诊断首页历史记录样式
  historyCard: {
    padding: 16,
    marginBottom: 16,
    borderRadius: 12,
    backgroundColor: colors.surface,
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
    color: colors.textPrimary,
  },
  viewAllText: {
    fontSize: 14,
    color: colors.primary,
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
    backgroundColor: colors.surfaceSoft,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  historyItemLeft: {
    flex: 1,
  },
  historyItemTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.textPrimary,
    marginBottom: 4,
  },
  historyItemDate: {
    fontSize: 12,
    color: colors.textTertiary,
  },
  historyItemStatus: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.primary,
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
    backgroundColor: colors.surface,
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
    color: colors.textPrimary,
    marginBottom: 8,
  },
  diagnosisHomeIntroText: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  diagnosisHomeModeCardsSection: {
    marginBottom: 24,
  },
  diagnosisHomeModeCard: {
    backgroundColor: colors.surface,
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
    backgroundColor: colors.primaryLight,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    flexShrink: 0,
    marginRight: 16,
    shadowColor: colors.primary,
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
    color: colors.textPrimary,
    marginBottom: 8,
  },
  diagnosisHomeModeCardDescription: {
    fontSize: 14,
    color: colors.textSecondary,
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
    color: colors.textTertiary,
  },
  diagnosisHomeNotesSection: {
    marginBottom: 24,
  },
  diagnosisHomeNotesCard: {
    padding: 16,
    backgroundColor: colors.infoLight,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.info,
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
    color: colors.textPrimary,
    marginBottom: 4,
  },
  diagnosisHomeNotesText: {
    fontSize: 12,
    color: colors.textSecondary,
    lineHeight: 18,
  },
  // 认证页面样式
  authTypeInfoCard: {
    backgroundColor: colors.surface,
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
    backgroundColor: colors.primaryLight,
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
    color: colors.textPrimary,
    marginBottom: 4,
  },
  authTypeInfoDescription: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  authBenefits: {
    backgroundColor: colors.surfaceMuted,
    borderRadius: 8,
    padding: 12,
  },
  authBenefitsTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.textPrimary,
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
    color: colors.primary,
  },
  authBenefitText: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  authFormCard: {
    backgroundColor: colors.surface,
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
    color: colors.textPrimary,
    marginBottom: 16,
  },
  authFormGroup: {
    marginBottom: 16,
  },
  authFormLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.textPrimary,
    marginBottom: 8,
  },
  authFormInput: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    color: colors.textPrimary,
  },
  authFormSelect: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    overflow: 'hidden',
  },
  authFormSelectButton: {
    padding: 12,
    backgroundColor: colors.surfaceMuted,
  },
  authFormSelectButtonText: {
    color: colors.textSecondary,
    fontSize: 16,
  },
  authUploadArea: {
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: colors.border,
    borderRadius: 8,
    padding: 24,
    alignItems: 'center',
    backgroundColor: colors.surfaceSoft,
  },
  authUploadIcon: {
    fontSize: 48,
    color: colors.textDisabled,
    marginBottom: 8,
  },
  authUploadText: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.textPrimary,
    marginBottom: 4,
  },
  authUploadSubtext: {
    fontSize: 12,
    color: colors.textDisabled,
  },
  authUploadPreview: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
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
    backgroundColor: colors.surfaceMuted,
    borderRadius: 8,
  },
  authUploadPreviewButtonDelete: {
    backgroundColor: colors.errorLight,
  },
  authUploadPreviewButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.textPrimary,
  },
  authUploadPreviewButtonTextDelete: {
    color: colors.error,
  },
  authSubmitButton: {
    backgroundColor: colors.primaryLight,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    marginBottom: 12,
    shadowColor: colors.primary,
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
    color: colors.textDisabled,
    marginTop: 12,
  },
  // 聊天诊断页面样式
  chatMessagesContainer: {
    flexGrow: 1,
    padding: 16,
    gap: 16,
    backgroundColor: colors.surfaceMuted,
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
    backgroundColor: colors.surfaceMuted,
    borderBottomLeftRadius: 4,
  },
  chatUserMessageBubble: {
    backgroundColor: colors.primary,
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
    color: colors.textPrimary,
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
    color: colors.textPrimary,
  },
  chatUserMessageText: {
    color: colors.surface,
  },
  chatMessageTimestamp: {
    fontSize: 12,
    color: colors.textTertiary,
    alignSelf: 'flex-end',
  },
  chatInputArea: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 12,
    padding: 12,
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  chatFunctionButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  chatFunctionButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.surfaceMuted,
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
    backgroundColor: colors.surfaceMuted,
    fontSize: 14,
    color: colors.textPrimary,
  },
  chatSendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  chatSendButtonIcon: {
    fontSize: 20,
    color: colors.surface,
  },
  chatImagePreviewContainer: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.border,
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
    backgroundColor: colors.error,
    justifyContent: 'center',
    alignItems: 'center',
  },
  chatRemoveImageText: {
    fontSize: 16,
    color: colors.surface,
    fontWeight: 'bold',
  },
  chatTypingIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    marginHorizontal: 12,
    marginBottom: 8,
    borderRadius: 12,
    backgroundColor: colors.surface,
    alignSelf: 'flex-start',
  },
  chatTypingText: {
    marginLeft: 8,
    fontSize: 14,
    color: colors.textTertiary,
  },
  // AI兽医诊断页面样式
  tabContainer: {
    marginBottom: 16,
  },
  tabScrollView: {
    backgroundColor: colors.surfaceMuted,
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
    backgroundColor: colors.primary,
  },
  tabButtonText: {
    color: colors.textTertiary,
    fontSize: 14,
    fontWeight: '500',
  },
  tabButtonTextActive: {
    color: colors.surface,
    fontWeight: '600',
  },
  tabContent: {
    padding: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
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
    color: colors.textPrimary,
    marginBottom: 8,
  },
  pickerField: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.surfaceSoft,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 16,
  },
  pickerFieldText: {
    fontSize: 15,
    color: colors.textPrimary,
    flex: 1,
  },
  experimentItem: {
    marginBottom: 16,
  },
  experimentItemTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textPrimary,
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
    color: colors.textTertiary,
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
    backgroundColor: colors.surface,
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
    color: colors.textPrimary,
    marginBottom: 4,
  },
  reportNumber: {
    fontSize: 12,
    color: colors.textDisabled,
  },
  reportTimeInfo: {
    alignItems: 'flex-end',
  },
  reportTime: {
    fontSize: 12,
    color: colors.textDisabled,
    marginBottom: 2,
  },
  card: {
    backgroundColor: colors.surface,
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
    color: colors.textDisabled,
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 14,
    color: colors.textPrimary,
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
    backgroundColor: colors.infoLight,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  symptomTagText: {
    fontSize: 12,
    color: colors.info,
  },
  conclusionCard: {
    backgroundColor: colors.successLight,
    borderWidth: 1,
    borderColor: colors.success,
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  conclusionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.successText,
    marginBottom: 8,
  },
  conclusionDescription: {
    fontSize: 14,
    color: colors.successText,
  },
  basisSection: {
    marginTop: 8,
  },
  basisTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 8,
  },
  basisList: {
    gap: 4,
  },
  basisItem: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  planTabs: {
    flexDirection: 'row',
    backgroundColor: colors.surfaceMuted,
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
    backgroundColor: colors.primary,
  },
  planTabText: {
    fontSize: 14,
    color: colors.textTertiary,
    fontWeight: '500',
  },
  planTabTextActive: {
    color: colors.surface,
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
    color: colors.success,
    marginTop: 2,
  },
  planItemTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 4,
  },
  planItemDescription: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  optimizationList: {
    gap: 12,
  },
  optimizationItem: {
    backgroundColor: colors.surfaceMuted,
    borderRadius: 8,
    padding: 12,
  },
  optimizationTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 4,
  },
  optimizationDescription: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  saveButton: {
    backgroundColor: colors.surface,
    borderWidth: 2,
    borderColor: colors.primary,
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
    color: colors.primary,
  },
  shareButton: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
    shadowColor: colors.primary,
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
    color: colors.surface,
  },
  shareButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.surface,
  },
  // 诊断历史页面样式
  diagnosisHistoryList: {
    gap: 16,
  },
  diagnosisHistoryItem: {
    backgroundColor: colors.surface,
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
    color: colors.textPrimary,
  },
  diagnosisHistoryItemStatus: {
    fontSize: 12,
    fontWeight: '500',
    paddingVertical: 2,
    paddingHorizontal: 8,
    borderRadius: 12,
  },
  statusConfirmed: {
    backgroundColor: colors.successLight,
    color: colors.primaryDark,
  },
  statusPreDiagnosis: {
    backgroundColor: colors.warningLight,
    color: colors.warningText,
  },
  diagnosisHistoryItemDate: {
    fontSize: 12,
    color: colors.textTertiary,
    marginBottom: 4,
  },
  diagnosisHistoryItemMode: {
    fontSize: 12,
    color: colors.textTertiary,
    marginBottom: 4,
  },
  diagnosisHistoryItemResult: {
    fontSize: 14,
    color: colors.textPrimary,
    marginBottom: 8,
  },
  diagnosisHistoryItemSymptoms: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  diagnosisHistoryItemSymptomTag: {
    backgroundColor: colors.primaryLight,
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 16,
    fontSize: 12,
    color: colors.primaryDark,
  },
  diagnosisHistoryItemSymptomMore: {
    backgroundColor: colors.surfaceMuted,
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 16,
    fontSize: 12,
    color: colors.textTertiary,
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
    backgroundColor: colors.primaryLight,
  },
  diagnosisHistoryItemActionText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.primaryDark,
  },
  deleteButtonText: {
    color: colors.error,
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
    color: colors.textPrimary,
    marginBottom: 8,
  },
  emptyHistoryText: {
    fontSize: 14,
    color: colors.textTertiary,
    marginBottom: 24,
    textAlign: 'center',
    paddingHorizontal: 32,
  },
  emptyHistoryButton: {
    backgroundColor: colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  emptyHistoryButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.surface,
  },
  // 生产管理样式
  productionModulesContainer: {
    paddingBottom: 24,
  },
  productionModuleCard: {
    backgroundColor: colors.surface,
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
    color: colors.textPrimary,
    marginBottom: 4,
  },
  productionModuleDescription: {
    fontSize: 14,
    color: colors.textTertiary,
  },
  productionModuleArrow: {
    marginLeft: 8,
  },
  productionModuleArrowText: {
    fontSize: 18,
    color: colors.textTertiary,
  },
  
  // 批次管理样式
  batchList: {
    padding: 16,
  },
  batchItem: {
    backgroundColor: colors.surface,
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
    color: colors.textPrimary,
  },
  batchItemStatus: {
    fontSize: 14,
    fontWeight: '500',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 12,
  },
  batchStatusActive: {
    backgroundColor: colors.successLight,
    color: colors.primaryDark,
  },
  batchStatusInactive: {
    backgroundColor: colors.surfaceMuted,
    color: colors.textTertiary,
  },
  batchItemContent: {
    marginBottom: 12,
  },
  batchItemInfo: {
    fontSize: 14,
    color: colors.textSecondary,
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
    backgroundColor: colors.primaryLight,
  },
  deleteButton: {
    backgroundColor: colors.errorLight,
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
    backgroundColor: colors.surface,
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
    borderBottomColor: colors.border,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  modalCloseButton: {
    fontSize: 24,
    color: colors.textTertiary,
    padding: 4,
  },
  modalBody: {
    padding: 16,
  },
  modalInput: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    fontSize: 14,
    backgroundColor: colors.surface,
  },
  modalFooter: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  modalButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginLeft: 12,
  },
  cancelButton: {
    backgroundColor: colors.surfaceMuted,
  },
  submitButton: {
    backgroundColor: colors.primary,
  },
  modalButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.surface,
  },
  
  // 表单样式
  formGroup: {
    marginBottom: 16,
  },
  formLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.textSecondary,
    marginBottom: 8,
  },
  formInput: {
    backgroundColor: colors.surfaceSoft,
    borderRadius: 8,
    padding: 12,
    fontSize: 15,
    borderWidth: 1,
    borderColor: colors.border,
    color: colors.textPrimary,
  },
  
  // 死淘/耗料记录样式
  batchSelectContainer: {
    padding: 16,
  },
  batchSelectLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.textSecondary,
    marginBottom: 12,
  },
  batchSelectScrollView: {
    marginBottom: 16,
  },
  batchSelectItem: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: colors.surfaceMuted,
    marginRight: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  batchSelectItemSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  batchSelectItemText: {
    fontSize: 14,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  batchSelectItemTextSelected: {
    color: colors.surface,
    fontWeight: '600',
  },
  selectedBatchInfo: {
    padding: 16,
    backgroundColor: colors.primaryLight,
    marginBottom: 8,
  },
  selectedBatchText: {
    fontSize: 14,
    color: colors.primaryDark,
  },
  recordList: {
    padding: 16,
  },
  deathFeedItem: {
    backgroundColor: colors.surface,
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
    color: colors.textPrimary,
  },
  deathFeedItemBatch: {
    fontSize: 14,
    color: colors.textTertiary,
  },
  deathFeedItemContent: {
    marginBottom: 12,
  },
  deathFeedItemStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: colors.surfaceSoft,
    borderRadius: 8,
    padding: 12,
  },
  statItem: {
    alignItems: 'center',
  },
  statItemLabel: {
    fontSize: 14,
    color: colors.textTertiary,
    marginBottom: 4,
  },
  statItemValue: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  deathFeedItemActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  addFirstRecordButton: {
    marginTop: 16,
    paddingVertical: 12,
    paddingHorizontal: 24,
    backgroundColor: colors.primary,
    borderRadius: 8,
    alignItems: 'center',
  },
  addFirstRecordText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.surface,
  },
  
  // 员工管理样式
  employeeList: {
    padding: 16,
  },
  employeeItem: {
    backgroundColor: colors.surface,
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
    color: colors.textPrimary,
  },
  employeeItemRole: {
    fontSize: 14,
    backgroundColor: colors.primaryLight,
    color: colors.primaryDark,
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
    color: colors.textSecondary,
    marginBottom: 8,
  },
  employeePermissionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  employeePermissionTag: {
    backgroundColor: colors.infoLight,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
  },
  employeePermissionTagText: {
    fontSize: 14,
    color: colors.info,
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
    backgroundColor: colors.surfaceSoft,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  permissionOptionItemSelected: {
    backgroundColor: colors.successLight,
    borderColor: colors.primary,
  },
  permissionOptionText: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  permissionOptionTextSelected: {
    color: colors.primaryDark,
    fontWeight: '500',
  },
  
  // 空状态样式
  emptyState: {
    backgroundColor: colors.surface,
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
    backgroundColor: colors.surfaceMuted,
    borderRadius: 8,
  },
  filterValueText: {
    fontSize: 14,
    color: colors.textPrimary,
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
    color: colors.textPrimary,
    marginBottom: 8,
  },
  filterOptions: {
    flexDirection: 'row',
  },
  filterOption: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: colors.surfaceMuted,
    marginRight: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  filterOptionActive: {
    backgroundColor: colors.primaryDark,
    borderColor: colors.primaryDark,
  },
  filterOptionText: {
    fontSize: 14,
    color: colors.textTertiary,
  },
  filterOptionTextActive: {
    color: colors.surface,
    fontWeight: '500',
  },
  
  // 热力图样式
  heatmapContainer: {
    padding: 16,
    backgroundColor: colors.surface,
    marginBottom: 12,
  },
  heatmapPlaceholder: {
    height: 200,
    backgroundColor: colors.surfaceSoft,
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
    color: colors.textPrimary,
    marginBottom: 4,
  },
  heatmapPlaceholderSubtext: {
    fontSize: 14,
    color: colors.textTertiary,
  },
  heatmapLegend: {
    marginTop: 16,
  },
  heatmapLegendTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.textSecondary,
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
    color: colors.textTertiary,
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
    backgroundColor: colors.surface,
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
    backgroundColor: colors.primaryLight,
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
    color: colors.textPrimary,
    marginBottom: 4,
  },
  
  profileUserRole: {
    fontSize: 14,
    color: colors.textTertiary,
  },
  
  profileMenuSection: {
    backgroundColor: colors.surface,
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
    color: colors.textPrimary,
  },
  
  profileMenuArrow: {
    fontSize: 16,
    color: colors.textDisabled,
  },
  
  profileVersionInfo: {
    alignItems: 'center',
    marginTop: 32,
    padding: 16,
  },
  
  profileVersionText: {
    fontSize: 14,
    color: colors.textTertiary,
    marginBottom: 4,
  },
  
  profileCopyrightText: {
    fontSize: 12,
    color: colors.textDisabled,
  },

  // 编辑个人信息页面样式
  profileEditSection: {
    marginBottom: 16,
  },
  profileEditLabel: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 6,
    fontWeight: '600',
  },
  profileEditInput: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.borderStrong,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    color: colors.textPrimary,
  },
  profileEditInfoCard: {
    backgroundColor: colors.surfaceMuted,
    borderRadius: 8,
    padding: 16,
    marginTop: 8,
  },
  profileEditInfoText: {
    fontSize: 14,
    color: colors.textTertiary,
    marginBottom: 4,
  },
  profileEditBottomButtonContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  profileEditSaveButton: {
    backgroundColor: colors.primary,
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
  },
  profileEditSaveButtonDisabled: {
    opacity: 0.6,
  },
  profileEditSaveButtonText: {
    color: colors.surface,
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
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  
  epidemicDataSection: {
    padding: 16,
    backgroundColor: colors.surface,
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
    color: colors.textPrimary,
    marginBottom: 4,
  },
  
  epidemicStatLabel: {
    fontSize: 14,
    color: colors.textTertiary,
  },
  
  epidemicDetailSection: {
    padding: 16,
    backgroundColor: colors.surface,
    marginBottom: 12,
  },
  
  epidemicDetailList: {
    marginTop: 16,
  },
  
  epidemicDetailItem: {
    backgroundColor: colors.surfaceSoft,
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
    color: colors.textPrimary,
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
    color: colors.textSecondary,
  },
  
  epidemicDetailCases: {
    fontSize: 14,
    color: colors.error,
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
    backgroundColor: colors.primaryDark,
  },
  
  epidemicDetailActionText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.surface,
  },
  
  epidemicAlertsSection: {
    padding: 16,
    backgroundColor: colors.surface,
  },
  
  sectionMoreText: {
    fontSize: 14,
    color: colors.primaryDark,
    fontWeight: '500',
  },
  
  epidemicAlertItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    backgroundColor: colors.warningLight,
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
    backgroundColor: colors.warning,
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
    color: colors.warningText,
    marginBottom: 4,
  },
  
  epidemicAlertTime: {
    fontSize: 12,
    color: colors.warningText,
    marginBottom: 4,
  },
  
  epidemicAlertDescription: {
    fontSize: 14,
    color: colors.warningText,
    lineHeight: 20,
  },
  
  epidemicAlertAction: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
    backgroundColor: colors.warning,
  },
  
  epidemicAlertActionText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.surface,
  },
  emptyStateText: {
    fontSize: 16,
    color: colors.textTertiary,
    marginBottom: 16,
  },

  addFirstEmployeeButton: {
    backgroundColor: colors.primaryLight,
    borderRadius: 8,
    padding: 12,
  },
  addFirstEmployeeText: {
    fontSize: 15,
    fontWeight: '500',
    color: colors.primaryDark,
  },
});
