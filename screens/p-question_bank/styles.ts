

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
  
  // 主要内容区域
  mainContent: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 24,
  },
  
  // 模式选择页
  modeSelectionContainer: {
    flex: 1,
  },
  
  modeSelectionHeader: {
    alignItems: 'center',
    marginBottom: 32,
  },
  
  modeSelectionIcon: {
    width: 80,
    height: 80,
    backgroundColor: 'rgba(59, 204, 165, 0.1)',
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  
  modeSelectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 8,
  },
  
  modeSelectionSubtitle: {
    fontSize: 16,
    color: '#6B7280',
  },
  
  modeCardsContainer: {
    gap: 16,
  },
  
  modeCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 24,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 8,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  
  modeCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  
  modeCardIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  
  blueIcon: {
    backgroundColor: 'rgba(37, 99, 235, 0.1)',
  },
  
  purpleIcon: {
    backgroundColor: 'rgba(124, 58, 237, 0.1)',
  },
  
  modeCardInfo: {
    flex: 1,
  },
  
  modeCardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  
  modeCardDescription: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 8,
  },
  
  modeCardMeta: {
    flexDirection: 'row',
    gap: 16,
  },
  
  modeCardMetaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  
  modeCardMetaText: {
    fontSize: 12,
    color: '#6B7280',
  },
  
  // 章节选择页
  chapterSelectionContainer: {
    flex: 1,
  },
  
  chapterSelectionHeader: {
    marginBottom: 24,
  },
  
  chapterSelectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 8,
  },
  
  chapterSelectionSubtitle: {
    fontSize: 16,
    color: '#6B7280',
  },
  
  chaptersContainer: {
    gap: 12,
  },
  
  chapterCard: {
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
        elevation: 3,
      },
    }),
  },
  
  chapterCardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  
  chapterCardDescription: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 8,
  },
  
  chapterCardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  
  chapterCardQuestions: {
    fontSize: 12,
    color: '#6B7280',
  },
  
  chapterCardStart: {
    fontSize: 12,
    color: '#3BCCA5',
    fontWeight: '500',
  },
  
  // 答题页面
  quizPageContainer: {
    flex: 1,
  },
  
  progressSection: {
    marginBottom: 24,
  },
  
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  
  progressText: {
    fontSize: 14,
    color: '#6B7280',
  },
  
  scoreText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1F2937',
  },
  
  progressBarContainer: {
    width: '100%',
    height: 8,
    backgroundColor: '#E5E7EB',
    borderRadius: 4,
    overflow: 'hidden',
  },
  
  progressBar: {
    height: '100%',
    backgroundColor: '#3BCCA5',
    borderRadius: 4,
  },
  
  questionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 24,
    marginBottom: 24,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 8,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  
  questionHeader: {
    marginBottom: 16,
  },
  
  questionNumber: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 12,
  },
  
  questionText: {
    fontSize: 16,
    color: '#1F2937',
    lineHeight: 24,
  },
  
  optionsList: {
    gap: 12,
  },
  
  optionItem: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    padding: 16,
  },
  
  optionSelected: {
    backgroundColor: '#D3F8EE',
    borderColor: '#3BCCA5',
  },
  
  optionCorrect: {
    backgroundColor: '#D1FAE5',
    borderColor: '#10B981',
  },
  
  optionIncorrect: {
    backgroundColor: '#FEE2E2',
    borderColor: '#EF4444',
  },
  
  optionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  
  optionLetter: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#E5E7EB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  optionLetterSelected: {
    backgroundColor: '#3BCCA5',
  },
  
  optionLetterCorrect: {
    backgroundColor: '#10B981',
  },
  
  optionLetterIncorrect: {
    backgroundColor: '#EF4444',
  },
  
  optionLetterText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
  },
  
  optionText: {
    flex: 1,
    fontSize: 16,
    color: '#1F2937',
  },
  
  optionTextCorrect: {
    color: '#047857',
    fontWeight: '500',
  },
  
  optionTextIncorrect: {
    color: '#DC2626',
    fontWeight: '500',
  },
  
  quizActions: {
    flexDirection: 'row',
    gap: 12,
  },
  
  quizButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    gap: 8,
  },
  
  prevButton: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    backgroundColor: '#FFFFFF',
  },
  
  submitButton: {
    backgroundColor: '#3BCCA5',
    ...Platform.select({
      ios: {
        shadowColor: '#3BCCA5',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  
  nextButton: {
    backgroundColor: '#3BCCA5',
    ...Platform.select({
      ios: {
        shadowColor: '#3BCCA5',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  
  disabledButton: {
    opacity: 0.5,
  },
  
  quizButtonText: {
    fontSize: 16,
    fontWeight: '500',
  },
  
  submitButtonText: {
    color: '#FFFFFF',
  },
  
  nextButtonText: {
    color: '#FFFFFF',
  },
  
  disabledButtonText: {
    color: '#9CA3AF',
  },
  
  // 结果页面
  resultPageContainer: {
    flex: 1,
  },
  
  resultHeader: {
    alignItems: 'center',
    marginBottom: 32,
  },
  
  resultIcon: {
    width: 96,
    height: 96,
    backgroundColor: 'rgba(59, 204, 165, 0.1)',
    borderRadius: 48,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  
  resultTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 8,
  },
  
  resultSubtitle: {
    fontSize: 16,
    color: '#6B7280',
  },
  
  resultCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 24,
    marginBottom: 24,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 8,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  
  resultCardHeader: {
    alignItems: 'center',
    marginBottom: 24,
  },
  
  finalScore: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#3BCCA5',
    marginBottom: 8,
  },
  
  scorePercentage: {
    fontSize: 18,
    color: '#6B7280',
    marginBottom: 16,
  },
  
  rankBadgeGreen: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#D1FAE5',
    borderRadius: 20,
  },
  
  rankBadgeBlue: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#DBEAFE',
    borderRadius: 20,
  },
  
  rankBadgeYellow: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#FEF3C7',
    borderRadius: 20,
  },
  
  rankBadgeRed: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#FEE2E2',
    borderRadius: 20,
  },
  
  rankTextGreen: {
    color: '#047857',
    fontWeight: '500',
  },
  
  rankTextBlue: {
    color: '#1E40AF',
    fontWeight: '500',
  },
  
  rankTextYellow: {
    color: '#92400E',
    fontWeight: '500',
  },
  
  rankTextRed: {
    color: '#DC2626',
    fontWeight: '500',
  },
  
  resultStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  
  resultStatItem: {
    alignItems: 'center',
  },
  
  resultStatNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  
  correctNumber: {
    color: '#059669',
  },
  
  wrongNumber: {
    color: '#DC2626',
  },
  
  resultStatLabel: {
    fontSize: 14,
    color: '#6B7280',
  },
  
  reviewSection: {
    marginBottom: 24,
  },
  
  reviewTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 16,
  },
  
  wrongQuestions: {
    gap: 16,
  },
  
  wrongQuestionCard: {
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
        elevation: 3,
      },
    }),
  },
  
  wrongQuestionText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1F2937',
    marginBottom: 12,
  },
  
  wrongQuestionOptions: {
    gap: 8,
    marginBottom: 12,
  },
  
  wrongQuestionOption: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  
  correctAnswerOption: {
    backgroundColor: '#D1FAE5',
    padding: 8,
    borderRadius: 8,
  },
  
  wrongQuestionOptionLetter: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#E5E7EB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  correctAnswerLetter: {
    backgroundColor: '#10B981',
  },
  
  wrongQuestionOptionLetterText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
  },
  
  correctAnswerLetterText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#FFFFFF',
  },
  
  wrongQuestionOptionText: {
    fontSize: 16,
    color: '#6B7280',
  },
  
  correctAnswerText: {
    fontSize: 16,
    color: '#047857',
    fontWeight: '500',
  },
  
  explanationContainer: {
    padding: 12,
    backgroundColor: '#EFF6FF',
    borderRadius: 8,
  },
  
  explanationText: {
    fontSize: 14,
    color: '#1E40AF',
    lineHeight: 20,
  },
  
  resultActions: {
    flexDirection: 'row',
    gap: 12,
  },
  
  reviewAllButton: {
    borderWidth: 1,
    borderColor: '#3BCCA5',
    backgroundColor: '#FFFFFF',
  },
  
  newQuizButton: {
    backgroundColor: '#3BCCA5',
    ...Platform.select({
      ios: {
        shadowColor: '#3BCCA5',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  
  reviewAllButtonText: {
    color: '#3BCCA5',
  },
  
  newQuizButtonText: {
    color: '#FFFFFF',
  },
});

