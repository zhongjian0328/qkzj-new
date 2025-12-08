

import React, { useState, useCallback } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Alert, } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { FontAwesome6 } from '@expo/vector-icons';
import styles from './styles';

// 类型定义
interface Question {
  question: string;
  options: string[];
  correct: string;
}

interface UserAnswer {
  questionIndex: number;
  selected: string;
  correct: string;
  isCorrect: boolean;
}

type PageState = 'mode-selection' | 'chapter-selection' | 'quiz-page' | 'result-page';

const QuestionBankScreen: React.FC = () => {
  const router = useRouter();
  
  // 状态管理
  const [currentPage, setCurrentPage] = useState<PageState>('mode-selection');
  const [currentMode, setCurrentMode] = useState<string>('');
  const [currentChapter, setCurrentChapter] = useState<string>('');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [totalQuestions, setTotalQuestions] = useState<number>(0);
  const [score, setScore] = useState<number>(0);
  const [userAnswers, setUserAnswers] = useState<UserAnswer[]>([]);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState<boolean>(false);

  // 模拟题库数据
  const quizData: Record<string, Question[]> = {
    chapter1: [
      {
        question: '以下哪种症状不是新城疫的典型临床表现？',
        options: [
          '呼吸困难，张口呼吸',
          '神经症状，如扭颈、转圈',
          '皮肤出现红疹和水泡',
          '产蛋率下降，蛋品质降低'
        ],
        correct: 'C'
      },
      {
        question: '新城疫病毒属于以下哪个病毒科？',
        options: ['正黏病毒科', '副黏病毒科', '冠状病毒科', '疱疹病毒科'],
        correct: 'B'
      },
      {
        question: '新城疫的主要传播途径是？',
        options: ['空气传播', '接触传播', '水源传播', '土壤传播'],
        correct: 'A'
      }
    ]
  };

  // 返回按钮处理
  const handleBackPress = useCallback(() => {
    if (currentPage === 'quiz-page') {
      Alert.alert(
        '退出测验',
        '确定要退出当前测验吗？进度将会丢失。',
        [
          { text: '取消', style: 'cancel' },
          { text: '确定', onPress: () => showModeSelection() }
        ]
      );
    } else if (currentPage === 'result-page' || currentPage === 'chapter-selection') {
      showModeSelection();
    } else {
      router.back();
    }
  }, [currentPage, router]);

  // 显示模式选择页
  const showModeSelection = useCallback(() => {
    setCurrentPage('mode-selection');
    resetQuiz();
  }, []);

  // 显示章节选择页
  const showChapterSelection = useCallback(() => {
    setCurrentPage('chapter-selection');
  }, []);

  // 开始测验
  const startQuiz = useCallback((mode: string, questionsCount: number) => {
    setCurrentMode(mode);
    setTotalQuestions(questionsCount);
    setCurrentQuestionIndex(0);
    setScore(0);
    setUserAnswers([]);
    setSelectedOption(null);
    setIsAnswerSubmitted(false);
    setCurrentPage('quiz-page');
  }, []);

  // 重置测验
  const resetQuiz = useCallback(() => {
    setCurrentMode('');
    setCurrentChapter('');
    setCurrentQuestionIndex(0);
    setTotalQuestions(0);
    setScore(0);
    setUserAnswers([]);
    setSelectedOption(null);
    setIsAnswerSubmitted(false);
  }, []);

  // 选择选项
  const handleOptionSelect = useCallback((option: string) => {
    if (!isAnswerSubmitted) {
      setSelectedOption(option);
    }
  }, [isAnswerSubmitted]);

  // 提交答案
  const handleSubmitAnswer = useCallback(() => {
    if (selectedOption && !isAnswerSubmitted) {
      const currentQuestion = quizData.chapter1[currentQuestionIndex] || quizData.chapter1[0];
      const isCorrect = selectedOption === currentQuestion.correct;
      
      setIsAnswerSubmitted(true);
      
      if (isCorrect) {
        setScore(prev => prev + 10);
      }
      
      setUserAnswers(prev => [...prev, {
        questionIndex: currentQuestionIndex,
        selected: selectedOption,
        correct: currentQuestion.correct,
        isCorrect: isCorrect
      }]);
      
      // 延迟进入下一题
      setTimeout(() => {
        if (currentQuestionIndex < totalQuestions - 1) {
          setCurrentQuestionIndex(prev => prev + 1);
          setSelectedOption(null);
          setIsAnswerSubmitted(false);
        } else {
          setCurrentPage('result-page');
        }
      }, 1500);
    }
  }, [selectedOption, isAnswerSubmitted, currentQuestionIndex, totalQuestions]);

  // 上一题
  const handlePreviousQuestion = useCallback(() => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
      setSelectedOption(null);
      setIsAnswerSubmitted(false);
    }
  }, [currentQuestionIndex]);

  // 下一题
  const handleNextQuestion = useCallback(() => {
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedOption(null);
      setIsAnswerSubmitted(false);
    } else {
      setCurrentPage('result-page');
    }
  }, [currentQuestionIndex, totalQuestions]);

  // 重新测验
  const handleNewQuiz = useCallback(() => {
    showModeSelection();
  }, [showModeSelection]);

  // 查看全部题目
  const handleReviewAll = useCallback(() => {
    // 查看全部题目功能
    console.log('查看全部题目');
  }, []);

  // 渲染模式选择页
  const renderModeSelection = () => (
    <View style={styles.modeSelectionContainer}>
      <View style={styles.modeSelectionHeader}>
        <View style={styles.modeSelectionIcon}>
          <FontAwesome6 name="clipboard-check" size={32} color="#3BCCA5" />
        </View>
        <Text style={styles.modeSelectionTitle}>选择测验模式</Text>
        <Text style={styles.modeSelectionSubtitle}>选择适合你的学习方式</Text>
      </View>

      <View style={styles.modeCardsContainer}>
        <TouchableOpacity
          style={styles.modeCard}
          onPress={() => {
            setCurrentMode('chapter');
            showChapterSelection();
          }}
          activeOpacity={0.8}
        >
          <View style={styles.modeCardContent}>
            <View style={[styles.modeCardIcon, styles.blueIcon]}>
              <FontAwesome6 name="book-open" size={24} color="#2563EB" />
            </View>
            <View style={styles.modeCardInfo}>
              <Text style={styles.modeCardTitle}>章节测验</Text>
              <Text style={styles.modeCardDescription}>针对性练习，巩固知识点</Text>
              <View style={styles.modeCardMeta}>
                <View style={styles.modeCardMetaItem}>
                  <FontAwesome6 name="clock" size={10} color="#6B7280" />
                  <Text style={styles.modeCardMetaText}>15-30分钟</Text>
                </View>
                <View style={styles.modeCardMetaItem}>
                  <FontAwesome6 name="circle-question" size={10} color="#6B7280" />
                  <Text style={styles.modeCardMetaText}>10-20题</Text>
                </View>
              </View>
            </View>
            <FontAwesome6 name="chevron-right" size={16} color="#6B7280" />
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.modeCard}
          onPress={() => startQuiz('comprehensive', 15)}
          activeOpacity={0.8}
        >
          <View style={styles.modeCardContent}>
            <View style={[styles.modeCardIcon, styles.purpleIcon]}>
              <FontAwesome6 name="award" size={24} color="#7C3AED" />
            </View>
            <View style={styles.modeCardInfo}>
              <Text style={styles.modeCardTitle}>综合测验</Text>
              <Text style={styles.modeCardDescription}>全面考察，检验学习成果</Text>
              <View style={styles.modeCardMeta}>
                <View style={styles.modeCardMetaItem}>
                  <FontAwesome6 name="clock" size={10} color="#6B7280" />
                  <Text style={styles.modeCardMetaText}>30-60分钟</Text>
                </View>
                <View style={styles.modeCardMetaItem}>
                  <FontAwesome6 name="circle-question" size={10} color="#6B7280" />
                  <Text style={styles.modeCardMetaText}>30-50题</Text>
                </View>
              </View>
            </View>
            <FontAwesome6 name="chevron-right" size={16} color="#6B7280" />
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );

  // 渲染章节选择页
  const renderChapterSelection = () => (
    <View style={styles.chapterSelectionContainer}>
      <View style={styles.chapterSelectionHeader}>
        <Text style={styles.chapterSelectionTitle}>选择章节</Text>
        <Text style={styles.chapterSelectionSubtitle}>选择你想练习的章节内容</Text>
      </View>

      <View style={styles.chaptersContainer}>
        <TouchableOpacity
          style={styles.chapterCard}
          onPress={() => startQuiz('chapter', 15)}
          activeOpacity={0.8}
        >
          <Text style={styles.chapterCardTitle}>第一章：禽类常见疾病诊断</Text>
          <Text style={styles.chapterCardDescription}>新城疫、禽流感、传染性支气管炎等</Text>
          <View style={styles.chapterCardFooter}>
            <Text style={styles.chapterCardQuestions}>15道题目</Text>
            <Text style={styles.chapterCardStart}>开始测验 →</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.chapterCard}
          onPress={() => startQuiz('chapter', 12)}
          activeOpacity={0.8}
        >
          <Text style={styles.chapterCardTitle}>第二章：禽类解剖学基础</Text>
          <Text style={styles.chapterCardDescription}>呼吸系统、消化系统、免疫系统</Text>
          <View style={styles.chapterCardFooter}>
            <Text style={styles.chapterCardQuestions}>12道题目</Text>
            <Text style={styles.chapterCardStart}>开始测验 →</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.chapterCard}
          onPress={() => startQuiz('chapter', 18)}
          activeOpacity={0.8}
        >
          <Text style={styles.chapterCardTitle}>第三章：兽药使用规范</Text>
          <Text style={styles.chapterCardDescription}>抗生素、疫苗、用药剂量计算</Text>
          <View style={styles.chapterCardFooter}>
            <Text style={styles.chapterCardQuestions}>18道题目</Text>
            <Text style={styles.chapterCardStart}>开始测验 →</Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );

  // 渲染答题页面
  const renderQuizPage = () => {
    const currentQuestion = quizData.chapter1[currentQuestionIndex] || quizData.chapter1[0];
    const progress = ((currentQuestionIndex + 1) / totalQuestions) * 100;
    const optionLetters = ['A', 'B', 'C', 'D'];

    return (
      <View style={styles.quizPageContainer}>
        {/* 进度条 */}
        <View style={styles.progressSection}>
          <View style={styles.progressHeader}>
            <Text style={styles.progressText}>第 {currentQuestionIndex + 1} 题 / 共 {totalQuestions} 题</Text>
            <Text style={styles.scoreText}>得分: {score}</Text>
          </View>
          <View style={styles.progressBarContainer}>
            <View style={[styles.progressBar, { width: `${progress}%` }]} />
          </View>
        </View>

        {/* 题目卡片 */}
        <View style={styles.questionCard}>
          <View style={styles.questionHeader}>
            <Text style={styles.questionNumber}>第 {currentQuestionIndex + 1} 题</Text>
            <Text style={styles.questionText}>{currentQuestion.question}</Text>
          </View>

          {/* 选项列表 */}
          <View style={styles.optionsList}>
            {currentQuestion.options.map((option, index) => {
              const optionLetter = optionLetters[index];
              let optionStyle = styles.optionItem;
              let letterStyle = styles.optionLetter;
              let textStyle = styles.optionText;
              let icon = null;

              if (isAnswerSubmitted) {
                if (optionLetter === currentQuestion.correct) {
                  optionStyle = { ...styles.optionItem, ...styles.optionCorrect };
                  letterStyle = { ...styles.optionLetter, ...styles.optionLetterCorrect };
                  textStyle = { ...styles.optionText, ...styles.optionTextCorrect };
                  icon = <FontAwesome6 name="circle-check" size={16} color="#10B981" />;
                } else if (optionLetter === selectedOption && selectedOption !== currentQuestion.correct) {
                  optionStyle = { ...styles.optionItem, ...styles.optionIncorrect };
                  letterStyle = { ...styles.optionLetter, ...styles.optionLetterIncorrect };
                  textStyle = { ...styles.optionText, ...styles.optionTextIncorrect };
                  icon = <FontAwesome6 name="circle-xmark" size={16} color="#EF4444" />;
                }
              } else if (optionLetter === selectedOption) {
                optionStyle = { ...styles.optionItem, ...styles.optionSelected };
                letterStyle = { ...styles.optionLetter, ...styles.optionLetterSelected };
              }

              return (
                <TouchableOpacity
                  key={optionLetter}
                  style={optionStyle}
                  onPress={() => handleOptionSelect(optionLetter)}
                  disabled={isAnswerSubmitted}
                  activeOpacity={0.8}
                >
                  <View style={styles.optionContent}>
                    <View style={letterStyle}>
                      <Text style={[styles.optionLetterText, textStyle]}>{optionLetter}</Text>
                    </View>
                    <Text style={textStyle}>{option}</Text>
                    {icon && icon}
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* 答题按钮 */}
        <View style={styles.quizActions}>
          <TouchableOpacity
            style={[styles.quizButton, styles.prevButton, currentQuestionIndex === 0 && styles.disabledButton]}
            onPress={handlePreviousQuestion}
            disabled={currentQuestionIndex === 0}
            activeOpacity={0.8}
          >
            <FontAwesome6 name="chevron-left" size={14} color={currentQuestionIndex === 0 ? '#9CA3AF' : '#6B7280'} />
            <Text style={[styles.quizButtonText, currentQuestionIndex === 0 && styles.disabledButtonText]}>上一题</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.quizButton, styles.submitButton, (!selectedOption || isAnswerSubmitted) && styles.disabledButton]}
            onPress={handleSubmitAnswer}
            disabled={!selectedOption || isAnswerSubmitted}
            activeOpacity={0.8}
          >
            <Text style={[styles.quizButtonText, styles.submitButtonText, (!selectedOption || isAnswerSubmitted) && styles.disabledButtonText]}>
              提交答案
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.quizButton, styles.nextButton, (!selectedOption && currentQuestionIndex < totalQuestions - 1) && styles.disabledButton]}
            onPress={handleNextQuestion}
            disabled={!selectedOption && currentQuestionIndex < totalQuestions - 1}
            activeOpacity={0.8}
          >
            <Text style={[styles.quizButtonText, styles.nextButtonText, (!selectedOption && currentQuestionIndex < totalQuestions - 1) && styles.disabledButtonText]}>
              下一题
            </Text>
            <FontAwesome6 name="chevron-right" size={14} color={(!selectedOption && currentQuestionIndex < totalQuestions - 1) ? '#9CA3AF' : '#FFFFFF'} />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  // 渲染结果页面
  const renderResultPage = () => {
    const correctCount = userAnswers.filter(ans => ans.isCorrect).length;
    const wrongCount = userAnswers.filter(ans => !ans.isCorrect).length;
    const percentage = Math.round((correctCount / totalQuestions) * 100);
    
    let rankText = '';
    let rankStyle = styles.rankBadgeGreen;
    let rankTextStyle = styles.rankTextGreen;
    
    if (percentage >= 90) {
      rankText = '优秀';
      rankStyle = styles.rankBadgeGreen;
      rankTextStyle = styles.rankTextGreen;
    } else if (percentage >= 80) {
      rankText = '良好';
      rankStyle = styles.rankBadgeBlue;
      rankTextStyle = styles.rankTextBlue;
    } else if (percentage >= 60) {
      rankText = '及格';
      rankStyle = styles.rankBadgeYellow;
      rankTextStyle = styles.rankTextYellow;
    } else {
      rankText = '需要加强';
      rankStyle = styles.rankBadgeRed;
      rankTextStyle = styles.rankTextRed;
    }

    return (
      <View style={styles.resultPageContainer}>
        <View style={styles.resultHeader}>
          <View style={styles.resultIcon}>
            <FontAwesome6 name="chart-line" size={32} color="#3BCCA5" />
          </View>
          <Text style={styles.resultTitle}>测验完成！</Text>
          <Text style={styles.resultSubtitle}>恭喜你完成了本次测验</Text>
        </View>

        {/* 成绩卡片 */}
        <View style={styles.resultCard}>
          <View style={styles.resultCardHeader}>
            <Text style={styles.finalScore}>{score}</Text>
            <Text style={styles.scorePercentage}>正确率：{percentage}%</Text>
            <View style={rankStyle}>
              <Text style={rankTextStyle}>{rankText}</Text>
            </View>
          </View>

          <View style={styles.resultStats}>
            <View style={styles.resultStatItem}>
              <Text style={styles.resultStatNumber}>{totalQuestions}</Text>
              <Text style={styles.resultStatLabel}>总题目</Text>
            </View>
            <View style={styles.resultStatItem}>
              <Text style={[styles.resultStatNumber, styles.correctNumber]}>{correctCount}</Text>
              <Text style={styles.resultStatLabel}>答对</Text>
            </View>
            <View style={styles.resultStatItem}>
              <Text style={[styles.resultStatNumber, styles.wrongNumber]}>{wrongCount}</Text>
              <Text style={styles.resultStatLabel}>答错</Text>
            </View>
          </View>
        </View>

        {/* 错题回顾 */}
        <View style={styles.reviewSection}>
          <Text style={styles.reviewTitle}>错题回顾</Text>
          
          <View style={styles.wrongQuestions}>
            <View style={styles.wrongQuestionCard}>
              <Text style={styles.wrongQuestionText}>第 5 题：以下哪种不是禽流感的传播途径？</Text>
              <View style={styles.wrongQuestionOptions}>
                <View style={styles.wrongQuestionOption}>
                  <View style={styles.wrongQuestionOptionLetter}>
                    <Text style={styles.wrongQuestionOptionLetterText}>A</Text>
                  </View>
                  <Text style={styles.wrongQuestionOptionText}>空气传播</Text>
                </View>
                <View style={styles.wrongQuestionOption}>
                  <View style={styles.wrongQuestionOptionLetter}>
                    <Text style={styles.wrongQuestionOptionLetterText}>B</Text>
                  </View>
                  <Text style={styles.wrongQuestionOptionText}>接触传播</Text>
                </View>
                <View style={[styles.wrongQuestionOption, styles.correctAnswerOption]}>
                  <View style={[styles.wrongQuestionOptionLetter, styles.correctAnswerLetter]}>
                    <Text style={styles.correctAnswerLetterText}>C</Text>
                  </View>
                  <Text style={styles.correctAnswerText}>土壤传播</Text>
                  <FontAwesome6 name="circle-check" size={16} color="#10B981" />
                </View>
                <View style={styles.wrongQuestionOption}>
                  <View style={styles.wrongQuestionOptionLetter}>
                    <Text style={styles.wrongQuestionOptionLetterText}>D</Text>
                  </View>
                  <Text style={styles.wrongQuestionOptionText}>水源传播</Text>
                </View>
              </View>
              <View style={styles.explanationContainer}>
                <Text style={styles.explanationText}>
                  <FontAwesome6 name="circle-info" size={12} color="#2563EB" /> 解析：禽流感主要通过空气、接触和水源传播，土壤传播不是主要途径。
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* 结果操作按钮 */}
        <View style={styles.resultActions}>
          <TouchableOpacity
            style={[styles.quizButton, styles.reviewAllButton]}
            onPress={handleReviewAll}
            activeOpacity={0.8}
          >
            <FontAwesome6 name="eye" size={14} color="#3BCCA5" />
            <Text style={[styles.quizButtonText, styles.reviewAllButtonText]}>查看全部题目</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.quizButton, styles.newQuizButton]}
            onPress={handleNewQuiz}
            activeOpacity={0.8}
          >
            <FontAwesome6 name="arrow-rotate-right" size={14} color="#FFFFFF" />
            <Text style={[styles.quizButtonText, styles.newQuizButtonText]}>重新测验</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  // 渲染当前页面
  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'mode-selection':
        return renderModeSelection();
      case 'chapter-selection':
        return renderChapterSelection();
      case 'quiz-page':
        return renderQuizPage();
      case 'result-page':
        return renderResultPage();
      default:
        return renderModeSelection();
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* 顶部导航栏 */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={handleBackPress}
          activeOpacity={0.8}
        >
          <FontAwesome6 name="arrow-left" size={20} color="#6B7280" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>题库测验</Text>
      </View>

      {/* 主要内容区域 */}
      <ScrollView style={styles.mainContent} showsVerticalScrollIndicator={false}>
        {renderCurrentPage()}
      </ScrollView>
    </SafeAreaView>
  );
};

export default QuestionBankScreen;

