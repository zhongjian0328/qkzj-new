import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Alert, ActivityIndicator, RefreshControl } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import Header from '../components/Header';
import { styles } from '../styles';
import { knowledgeApi } from '../services/api';

// 题目数据结构——对齐后端 QuestionBank 模型
interface Question {
  _id: string;
  questionText: string;
  questionType: string; // SINGLE_CHOICE | MULTIPLE_CHOICE | TRUE_FALSE | SHORT_ANSWER
  options: string[];
  correctAnswer: number | number[]; // 单选/判断为Number，多选为Number[]
  explanation: string;
  knowledgePoint: string;
  difficulty: string; // EASY | MEDIUM | HARD
  tags: string[];
}

const QuestionBankScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const [activeCategory, setActiveCategory] = useState('all');
  const [activeDifficulty, setActiveDifficulty] = useState('all');
  const [isQuizMode, setIsQuizMode] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
  const [quizScore, setQuizScore] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [quizQuestions, setQuizQuestions] = useState<Question[]>([]);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [lastAnswerCorrect, setLastAnswerCorrect] = useState(false);
  const [wrongQuestions, setWrongQuestions] = useState<{ question: Question; userAnswers: number[] }[]>([]);

  const fetchQuestions = useCallback(async (isRefresh = false) => {
    try {
      if (isRefresh) setRefreshing(true); else setLoading(true);
      setError(null);
      const response = await knowledgeApi.getQuestionBank({
        knowledgePoint: activeCategory !== 'all' ? activeCategory : undefined,
        difficulty: activeDifficulty !== 'all' ? activeDifficulty.toUpperCase() : undefined,
      });
      const data = response.data?.questions || response.data || [];
      setQuestions(data.map((q: any) => ({
        _id: q._id || q.id,
        questionText: q.questionText || q.question || '',
        questionType: q.questionType || 'SINGLE_CHOICE',
        options: q.options || [],
        correctAnswer: q.correctAnswer ?? (q.correctAnswers?.length > 1 ? q.correctAnswers : q.correctAnswers?.[0]),
        explanation: q.explanation || '',
        knowledgePoint: q.knowledgePoint || q.category || 'general',
        difficulty: q.difficulty || 'MEDIUM',
        tags: q.tags || [],
      })));
    } catch (err) {
      console.error('获取题库失败:', err);
      setError('加载题库失败，请稍后重试');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [activeCategory, activeDifficulty]);

  useEffect(() => { fetchQuestions(); }, [fetchQuestions]);

  // 分类列表——按知识点筛选
  const categories = [
    { id: 'all', name: '全部' },
    { id: '禽流感', name: '禽流感' },
    { id: '新城疫', name: '新城疫' },
    { id: '传支', name: '传支' },
    { id: '马立克氏病', name: '马立克' },
    { id: '法氏囊病', name: '法氏囊' },
    { id: '用药', name: '用药' },
    { id: '免疫', name: '免疫' },
    { id: '消毒', name: '消毒' },
    { id: '球虫', name: '球虫' },
    { id: '鸭瘟', name: '鸭瘟' },
  ];

  // 难度列表——对齐后端枚举
  const difficulties = [
    { id: 'all', name: '全部' },
    { id: 'easy', name: '简单' },
    { id: 'medium', name: '中等' },
    { id: 'hard', name: '困难' }
  ];

  // 过滤题目
  const filteredQuestions = questions.filter(question => {
    const matchesCategory = activeCategory === 'all' || question.knowledgePoint?.includes(activeCategory);
    const matchesDifficulty = activeDifficulty === 'all' || question.difficulty === activeDifficulty.toUpperCase();
    return matchesCategory && matchesDifficulty;
  });

  // 开始测验
  const startQuiz = () => {
    if (filteredQuestions.length === 0) {
      Alert.alert('提示', '当前筛选条件下没有题目');
      return;
    }
    setQuizQuestions(filteredQuestions);
    setIsQuizMode(true);
    setCurrentQuestionIndex(0);
    setSelectedAnswers([]);
    setQuizScore(0);
    setQuizCompleted(false);
    setShowFeedback(false);
    setWrongQuestions([]);
  };

  // 提交答案
  const submitAnswer = () => {
    const currentQuestion = quizQuestions[currentQuestionIndex];
    let isCorrect = false;

    if (currentQuestion.questionType === 'SINGLE_CHOICE' || currentQuestion.questionType === 'TRUE_FALSE') {
      isCorrect = selectedAnswers.length === 1 && selectedAnswers[0] === currentQuestion.correctAnswer;
    } else if (currentQuestion.questionType === 'MULTIPLE_CHOICE') {
      const correctArr = Array.isArray(currentQuestion.correctAnswer) ? currentQuestion.correctAnswer : [currentQuestion.correctAnswer];
      const userSorted = [...selectedAnswers].sort().join(',');
      const correctSorted = [...correctArr].sort().join(',');
      isCorrect = userSorted === correctSorted;
    }

    if (isCorrect) {
      setQuizScore(prev => prev + 1);
    } else {
      setWrongQuestions(prev => [...prev, { question: currentQuestion, userAnswers: [...selectedAnswers] }]);
    }

    setLastAnswerCorrect(isCorrect);
    setShowFeedback(true);
  };

  // 下一题
  const nextQuestion = () => {
    setShowFeedback(false);
    setSelectedAnswers([]);

    if (currentQuestionIndex < quizQuestions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      setQuizCompleted(true);
    }
  };

  // 重置测验
  const resetQuiz = () => {
    setIsQuizMode(false);
    setQuizCompleted(false);
    setCurrentQuestionIndex(0);
    setSelectedAnswers([]);
    setQuizScore(0);
    setShowFeedback(false);
    setWrongQuestions([]);
  };

  // 切换答案选择
  const toggleAnswer = (index: number) => {
    const currentQuestion = quizQuestions[currentQuestionIndex];
    if (currentQuestion.questionType === 'SINGLE_CHOICE' || currentQuestion.questionType === 'TRUE_FALSE') {
      setSelectedAnswers([index]);
    } else {
      setSelectedAnswers(prev => {
        if (prev.includes(index)) {
          return prev.filter(i => i !== index);
        } else {
          return [...prev, index];
        }
      });
    }
  };

  // 获取难度文字
  const getDifficultyText = (difficulty: string) => {
    switch (difficulty) {
      case 'EASY': case 'easy': return '简单';
      case 'MEDIUM': case 'medium': return '中等';
      case 'HARD': case 'hard': return '困难';
      default: return '全部';
    }
  };

  // 获取难度颜色
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'EASY': case 'easy': return { bg: '#D1FAE5', text: '#1F5E52' };
      case 'MEDIUM': case 'medium': return { bg: '#FEF3C7', text: '#92400E' };
      case 'HARD': case 'hard': return { bg: '#FEE2E2', text: '#991B1B' };
      default: return { bg: '#F3F4F6', text: '#6B7280' };
    }
  };

  // 获取题型标签
  const getQuestionTypeLabel = (type: string) => {
    switch (type) {
      case 'SINGLE_CHOICE': return '单选题';
      case 'MULTIPLE_CHOICE': return '多选题';
      case 'TRUE_FALSE': return '判断题';
      case 'SHORT_ANSWER': return '简答题';
      default: return '单选题';
    }
  };

  // 判断是否为多选题
  const isMultipleChoice = (type: string) => type === 'MULTIPLE_CHOICE';

  return (
    <View style={styles.container}>
      <Header 
        title="题库与测验" 
        showBackButton 
        onBack={() => navigation.goBack()} 
      />
      
      {!isQuizMode ? (
        // 题库模式
        loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#2DBBA1" />
            <Text style={styles.loadingText}>正在加载题库...</Text>
          </View>
        ) : error ? (
          <View style={styles.loadingContainer}>
            <Ionicons name="alert-circle-outline" size={48} color="#9CA3AF" />
            <Text style={{ fontSize: 16, color: '#6B7280', marginBottom: 16 }}>{error}</Text>
            <TouchableOpacity style={{ backgroundColor: '#2DBBA1', borderRadius: 8, paddingHorizontal: 24, paddingVertical: 10 }} onPress={() => fetchQuestions()}>
              <Text style={{ color: '#FFFFFF', fontSize: 16, fontWeight: '600' }}>重试</Text>
            </TouchableOpacity>
          </View>
        ) : questions.length === 0 ? (
          <View style={styles.loadingContainer}>
            <Ionicons name="folder-open-outline" size={48} color="#9CA3AF" />
            <Text style={{ fontSize: 16, color: '#6B7280' }}>暂无题目数据</Text>
          </View>
        ) : (
        <ScrollView contentContainerStyle={{ padding: 16 }}>
          {/* 筛选条件 */}
          <View style={{ marginBottom: 16 }}>
            <Text style={{ fontSize: 16, fontWeight: '600', color: '#111827', marginBottom: 8 }}>
              分类筛选
            </Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={{ flexDirection: 'row', gap: 8 }}>
                {categories.map(category => (
                  <TouchableOpacity
                    key={category.id}
                    style={[
                      {
                        paddingHorizontal: 16,
                        paddingVertical: 8,
                        borderRadius: 20,
                        backgroundColor: activeCategory === category.id ? '#2DBBA1' : '#F3F4F6'
                      }
                    ]}
                    onPress={() => setActiveCategory(category.id)}
                  >
                    <Text style={[
                      {
                        fontSize: 14,
                        fontWeight: '500',
                        color: activeCategory === category.id ? '#FFFFFF' : '#6B7280'
                      }
                    ]}>
                      {category.name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
          </View>

          <View style={{ marginBottom: 16 }}>
            <Text style={{ fontSize: 16, fontWeight: '600', color: '#111827', marginBottom: 8 }}>
              难度筛选
            </Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={{ flexDirection: 'row', gap: 8 }}>
                {difficulties.map(difficulty => (
                  <TouchableOpacity
                    key={difficulty.id}
                    style={[
                      {
                        paddingHorizontal: 16,
                        paddingVertical: 8,
                        borderRadius: 20,
                        backgroundColor: activeDifficulty === difficulty.id ? '#2DBBA1' : '#F3F4F6'
                      }
                    ]}
                    onPress={() => setActiveDifficulty(difficulty.id)}
                  >
                    <Text style={[
                      {
                        fontSize: 14,
                        fontWeight: '500',
                        color: activeDifficulty === difficulty.id ? '#FFFFFF' : '#6B7280'
                      }
                    ]}>
                      {difficulty.name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
          </View>

          {/* 题目列表 */}
          <View style={{ marginBottom: 24 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <Text style={{ fontSize: 18, fontWeight: '600', color: '#111827' }}>
                题目列表 ({filteredQuestions.length} 题)
              </Text>
              <TouchableOpacity
                style={{
                  backgroundColor: '#2DBBA1',
                  borderRadius: 8,
                  paddingHorizontal: 16,
                  paddingVertical: 8
                }}
                onPress={startQuiz}
              >
                <Text style={{ fontSize: 14, fontWeight: '600', color: '#FFFFFF' }}>
                  开始测验
                </Text>
              </TouchableOpacity>
            </View>

            {filteredQuestions.map((question, index) => (
              <View key={question._id} style={{
                backgroundColor: '#FFFFFF',
                borderRadius: 12,
                padding: 16,
                marginBottom: 12,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.06,
                shadowRadius: 3.84,
                elevation: 2
              }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                  <Text style={{ fontSize: 14, fontWeight: '500', color: '#6B7280' }}>
                    {index + 1}. {getQuestionTypeLabel(question.questionType)}
                  </Text>
                  <View style={{ flexDirection: 'row', gap: 8 }}>
                    <View style={{
                      paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12,
                      backgroundColor: '#E6F7F3',
                    }}>
                      <Text style={{ fontSize: 12, fontWeight: '500', color: '#1F5E52' }}>
                        {question.knowledgePoint}
                      </Text>
                    </View>
                    <View style={{
                      paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12,
                      backgroundColor: getDifficultyColor(question.difficulty).bg,
                    }}>
                      <Text style={{ fontSize: 12, fontWeight: '500', color: getDifficultyColor(question.difficulty).text }}>
                        {getDifficultyText(question.difficulty)}
                      </Text>
                    </View>
                  </View>
                </View>
                <Text style={{ fontSize: 16, color: '#111827', marginBottom: 12 }}>
                  {question.questionText}
                </Text>
                <View style={{ gap: 8 }}>
                  {question.options.map((option, optionIndex) => (
                    <View key={optionIndex} style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      padding: 12,
                      backgroundColor: '#F3F4F6',
                      borderRadius: 8
                    }}>
                      <View style={{
                        width: 24,
                        height: 24,
                        borderRadius: isMultipleChoice(question.questionType) ? 8 : 12,
                        borderWidth: 2,
                        borderColor: '#2DBBA1',
                        justifyContent: 'center',
                        alignItems: 'center',
                        marginRight: 12
                      }}>
                        <Text style={{ fontSize: 14, fontWeight: '600', color: '#2DBBA1' }}>
                          {String.fromCharCode(65 + optionIndex)}
                        </Text>
                      </View>
                      <Text style={{ fontSize: 14, color: '#4B5563' }}>
                        {option}
                      </Text>
                    </View>
                  ))}
                </View>
              </View>
            ))}
          </View>
        </ScrollView>
        )
      ) : quizCompleted ? (
        // 测验结果
        <ScrollView contentContainerStyle={{ padding: 16, alignItems: 'center' }}>
          <View style={{
            backgroundColor: '#FFFFFF',
            borderRadius: 16,
            padding: 24,
            alignItems: 'center',
            marginBottom: 16,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.06,
            shadowRadius: 3.84,
            elevation: 2
          }}>
            <Ionicons name="checkmark-circle-outline" size={48} color="#2DBBA1" />
            <Text style={{ fontSize: 24, fontWeight: '600', color: '#111827', marginBottom: 8 }}>
              测验完成！
            </Text>
            <Text style={{ fontSize: 16, color: '#6B7280', marginBottom: 24, textAlign: 'center' }}>
              你在本次测验中表现出色！
            </Text>
            
            <View style={{
              width: '100%',
              backgroundColor: '#F3F4F6',
              borderRadius: 12,
              padding: 20,
              marginBottom: 24
            }}>
              <Text style={{ fontSize: 18, fontWeight: '600', color: '#111827', marginBottom: 16, textAlign: 'center' }}>
                测验结果
              </Text>
              <View style={{
                flexDirection: 'row',
                justifyContent: 'space-around',
                marginBottom: 16
              }}>
                <View style={{ alignItems: 'center' }}>
                  <Text style={{ fontSize: 32, fontWeight: '600', color: '#2DBBA1' }}>
                    {quizScore}
                  </Text>
                  <Text style={{ fontSize: 14, color: '#6B7280' }}>
                    得分
                  </Text>
                </View>
                <View style={{ alignItems: 'center' }}>
                  <Text style={{ fontSize: 32, fontWeight: '600', color: '#2DBBA1' }}>
                    {quizQuestions.length}
                  </Text>
                  <Text style={{ fontSize: 14, color: '#6B7280' }}>
                    总题数
                  </Text>
                </View>
                <View style={{ alignItems: 'center' }}>
                  <Text style={{ fontSize: 32, fontWeight: '600', color: '#2DBBA1' }}>
                    {Math.round((quizScore / quizQuestions.length) * 100)}
                  </Text>
                  <Text style={{ fontSize: 14, color: '#6B7280' }}>
                    正确率 %
                  </Text>
                </View>
              </View>
              
              <View style={{
                height: 8,
                backgroundColor: '#E5E7EB',
                borderRadius: 4,
                overflow: 'hidden',
                marginBottom: 8
              }}>
                <View style={{
                  height: '100%',
                  width: `${(quizScore / quizQuestions.length) * 100}%`,
                  backgroundColor: '#2DBBA1',
                  borderRadius: 4
                }} />
              </View>
              <Text style={{ fontSize: 12, color: '#6B7280', textAlign: 'center' }}>
                {quizScore}/{quizQuestions.length} 道题正确
              </Text>

              {/* 等级标签 */}
              {(() => {
                const rate = Math.round((quizScore / quizQuestions.length) * 100);
                let label = '不及格';
                let labelColor = '#EF4444';
                let labelBg = '#FEE2E2';
                if (rate >= 90) { label = '优秀'; labelColor = '#1F5E52'; labelBg = '#D1FAE5'; }
                else if (rate >= 70) { label = '良好'; labelColor = '#92400E'; labelBg = '#FEF3C7'; }
                else if (rate >= 60) { label = '及格'; labelColor = '#1F5E52'; labelBg = '#D1FAE5'; }
                return (
                  <View style={{
                    marginTop: 12,
                    paddingHorizontal: 16,
                    paddingVertical: 6,
                    borderRadius: 20,
                    backgroundColor: labelBg,
                    alignSelf: 'center'
                  }}>
                    <Text style={{ fontSize: 14, fontWeight: '600', color: labelColor }}>{label}</Text>
                  </View>
                );
              })()}
            </View>

            {/* 错题回顾 */}
            {wrongQuestions.length > 0 && (
              <View style={{
                backgroundColor: '#FFFFFF',
                borderRadius: 16,
                padding: 16,
                marginBottom: 16,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.06,
                shadowRadius: 3.84,
                elevation: 2
              }}>
                <Text style={{ fontSize: 16, fontWeight: '600', color: '#111827', marginBottom: 12 }}>
                  错题回顾 ({wrongQuestions.length} 题)
                </Text>
                {wrongQuestions.map((item, index) => (
                  <View key={index} style={{
                    backgroundColor: '#FEF2F2',
                    borderRadius: 8,
                    padding: 12,
                    marginBottom: 8,
                    borderLeftWidth: 3,
                    borderLeftColor: '#EF4444'
                  }}>
                    <Text style={{ fontSize: 14, fontWeight: '500', color: '#111827', marginBottom: 8 }}>
                      {item.question.questionText}
                    </Text>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                      <Text style={{ fontSize: 12, color: '#EF4444' }}>
                        你的答案：{item.userAnswers.map(a => String.fromCharCode(65 + a)).join('、')}
                      </Text>
                      <Text style={{ fontSize: 12, color: '#10B981' }}>
                        正确答案：{(Array.isArray(item.question.correctAnswer)
                          ? item.question.correctAnswer
                          : [item.question.correctAnswer])
                          .map(a => String.fromCharCode(65 + a)).join('、')}
                      </Text>
                    </View>
                  </View>
                ))}
              </View>
            )}
            
            <TouchableOpacity
              style={{
                backgroundColor: '#2DBBA1',
                borderRadius: 12,
                paddingHorizontal: 32,
                paddingVertical: 16,
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 12
              }}
              onPress={resetQuiz}
            >
              <Text style={{ fontSize: 16, fontWeight: '600', color: '#FFFFFF' }}>
                重新测验
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: 12,
                paddingHorizontal: 32,
                paddingVertical: 16,
                alignItems: 'center',
                justifyContent: 'center',
                borderWidth: 2,
                borderColor: '#2DBBA1'
              }}
              onPress={() => setIsQuizMode(false)}
            >
              <Text style={{ fontSize: 16, fontWeight: '600', color: '#2DBBA1' }}>
                返回题库
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      ) : (
        // 测验模式
        <ScrollView contentContainerStyle={{ padding: 16 }}>
          <View style={{
            backgroundColor: '#FFFFFF',
            borderRadius: 12,
            padding: 16,
            marginBottom: 16,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.06,
            shadowRadius: 3.84,
            elevation: 2
          }}>
            <View style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 16
            }}>
              <Text style={{ fontSize: 16, fontWeight: '500', color: '#6B7280' }}>
                第 {currentQuestionIndex + 1} 题 / 共 {quizQuestions.length} 题
              </Text>
              <View style={{
                height: 8,
                width: 120,
                backgroundColor: '#E5E7EB',
                borderRadius: 4,
                overflow: 'hidden'
              }}>
                <View style={{
                  height: '100%',
                  width: `${((currentQuestionIndex + 1) / quizQuestions.length) * 100}%`,
                  backgroundColor: '#2DBBA1',
                  borderRadius: 4
                }} />
              </View>
            </View>
            
            <Text style={{ fontSize: 18, fontWeight: '600', color: '#111827', marginBottom: 20 }}>
              {quizQuestions[currentQuestionIndex].questionText}
            </Text>
            
            <View style={{ gap: 12, marginBottom: 24 }}>
              {quizQuestions[currentQuestionIndex].options.map((option, optionIndex) => {
                const isSelected = selectedAnswers.includes(optionIndex);
                const correctArr = Array.isArray(quizQuestions[currentQuestionIndex].correctAnswer)
                  ? quizQuestions[currentQuestionIndex].correctAnswer
                  : [quizQuestions[currentQuestionIndex].correctAnswer];
                const isCorrectAnswer = correctArr.includes(optionIndex);
                let optionStyle: any = {
                  backgroundColor: '#F3F4F6',
                  borderColor: '#E5E7EB'
                };
                let indicatorStyle: any = {
                  borderWidth: 2,
                  borderColor: '#D1D5DB',
                  backgroundColor: 'transparent'
                };

                if (showFeedback) {
                  // 反馈阶段：正确答案绿色，错误选择红色
                  if (isCorrectAnswer) {
                    optionStyle = { backgroundColor: '#D1FAE5', borderColor: '#10B981' };
                    indicatorStyle = { backgroundColor: '#10B981', borderColor: '#10B981' };
                  } else if (isSelected && !isCorrectAnswer) {
                    optionStyle = { backgroundColor: '#FEE2E2', borderColor: '#EF4444' };
                    indicatorStyle = { backgroundColor: '#EF4444', borderColor: '#EF4444' };
                  }
                } else if (isSelected) {
                  optionStyle = { backgroundColor: '#E6F7F3', borderColor: '#2DBBA1' };
                  indicatorStyle = { backgroundColor: '#2DBBA1', borderColor: '#2DBBA1' };
                }

                return (
                <TouchableOpacity
                  key={optionIndex}
                  style={[
                    {
                      flexDirection: 'row',
                      alignItems: 'center',
                      padding: 16,
                      borderRadius: 8,
                      borderWidth: 2
                    },
                    optionStyle
                  ]}
                  onPress={() => !showFeedback && toggleAnswer(optionIndex)}
                  disabled={showFeedback}
                >
                  <View style={[
                    {
                      width: 28,
                      height: 28,
                      marginRight: 16,
                      justifyContent: 'center',
                      alignItems: 'center',
                      borderRadius: isMultipleChoice(quizQuestions[currentQuestionIndex].questionType) ? 8 : 14
                    },
                    indicatorStyle
                  ]}>
                    {(isSelected || (showFeedback && isCorrectAnswer)) && (
                      <Text style={{ fontSize: 16, color: '#FFFFFF', fontWeight: '600' }}>
                        {showFeedback && isCorrectAnswer && !isSelected ? '✓' :
                         showFeedback && isSelected && !isCorrectAnswer ? '✗' : '✓'}
                      </Text>
                    )}
                  </View>
                  <Text style={[
                    {
                      fontSize: 16,
                      color: '#111827',
                      flex: 1
                    },
                    (isSelected || (showFeedback && isCorrectAnswer)) && {
                      fontWeight: '600'
                    }
                  ]}>
                    {String.fromCharCode(65 + optionIndex)}. {option}
                  </Text>
                </TouchableOpacity>
                );
              })}
            </View>

            {/* 答题反馈区 */}
            {showFeedback && (
              <View style={{
                backgroundColor: lastAnswerCorrect ? '#D1FAE5' : '#FEE2E2',
                borderRadius: 12,
                padding: 16,
                marginBottom: 16,
                borderWidth: 1,
                borderColor: lastAnswerCorrect ? '#10B981' : '#EF4444'
              }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
                  <Text style={{ fontSize: 20, marginRight: 8 }}>
                    {lastAnswerCorrect ? <Ionicons name="checkmark-circle" size={14} color="#22C55E" /> : <Ionicons name="close-circle" size={14} color="#EF4444" />}
                  </Text>
                  <Text style={{
                    fontSize: 16,
                    fontWeight: '600',
                    color: lastAnswerCorrect ? '#1F5E52' : '#991B1B'
                  }}>
                    {lastAnswerCorrect ? '回答正确！' : '回答错误'}
                  </Text>
                </View>
                {!lastAnswerCorrect && (
                  <Text style={{ fontSize: 14, color: '#4B5563', lineHeight: 20 }}>
                    正确答案：{(Array.isArray(quizQuestions[currentQuestionIndex].correctAnswer)
                      ? quizQuestions[currentQuestionIndex].correctAnswer
                      : [quizQuestions[currentQuestionIndex].correctAnswer])
                      .map(idx => String.fromCharCode(65 + idx))
                      .join('、')}
                  </Text>
                )}
              </View>
            )}
            
            <TouchableOpacity
              style={{
                backgroundColor: showFeedback
                  ? '#2DBBA1'
                  : (selectedAnswers.length === 0 ? '#D1D5DB' : '#2DBBA1'),
                borderRadius: 12,
                padding: 16,
                alignItems: 'center',
                justifyContent: 'center'
              }}
              onPress={showFeedback ? nextQuestion : submitAnswer}
              disabled={!showFeedback && selectedAnswers.length === 0}
            >
              <Text style={{ fontSize: 16, fontWeight: '600', color: '#FFFFFF' }}>
                {showFeedback
                  ? (currentQuestionIndex < quizQuestions.length - 1 ? '下一题' : '查看结果')
                  : (currentQuestionIndex < quizQuestions.length - 1 ? '提交答案' : '提交答案')}
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      )}
    </View>
  );
};

export default QuestionBankScreen;