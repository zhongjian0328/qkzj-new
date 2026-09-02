import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Alert, ActivityIndicator, RefreshControl } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Header from '../components/Header';
import { styles } from '../styles';
import { knowledgeApi } from '../services/api';

// 题目数据结构
interface Question {
  id: string;
  question: string;
  options: string[];
  correctAnswers: number[];
  type: 'single' | 'multiple';
  category: string;
  difficulty: 'easy' | 'medium' | 'hard';
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
  const [refreshing, setRefreshing] = useState(false);

  const fetchQuestions = useCallback(async (isRefresh = false) => {
    try {
      if (isRefresh) setRefreshing(true); else setLoading(true);
      const response = await knowledgeApi.getQuestionBank({
        knowledgePoint: activeCategory !== 'all' ? activeCategory : undefined,
        difficulty: activeDifficulty !== 'all' ? activeDifficulty : undefined,
      });
      const data = response.data?.questions || response.data || [];
      setQuestions(data.map((q: any) => ({
        id: q._id || q.id,
        question: q.question || q.stem || '',
        options: q.options || q.choices || [],
        correctAnswers: q.correctAnswers || q.correctOptionIndices || [],
        type: q.type || (q.correctAnswers?.length > 1 ? 'multiple' : 'single'),
        category: q.category || q.knowledgePoint || 'general',
        difficulty: q.difficulty || 'easy',
      })));
    } catch (error) {
      console.error('获取题库失败:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [activeCategory, activeDifficulty]);

  useEffect(() => { fetchQuestions(); }, [fetchQuestions]);

  // 模拟题目数据
  // 分类列表
  const categories = [
    { id: 'all', name: '全部' },
    { id: 'disease', name: '疾病知识' },
    { id: 'prevention', name: '预防措施' },
    { id: 'control', name: '防控策略' },
    { id: 'treatment', name: '治疗方法' }
  ];

  // 难度列表
  const difficulties = [
    { id: 'all', name: '全部' },
    { id: 'easy', name: '简单' },
    { id: 'medium', name: '中等' },
    { id: 'hard', name: '困难' }
  ];

  // 过滤题目
  const filteredQuestions = questions.filter(question => {
    const matchesCategory = activeCategory === 'all' || question.category === activeCategory;
    const matchesDifficulty = activeDifficulty === 'all' || question.difficulty === activeDifficulty;
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
  };

  // 提交答案
  const submitAnswer = () => {
    const currentQuestion = quizQuestions[currentQuestionIndex];
    let isCorrect = false;
    
    if (currentQuestion.type === 'single') {
      isCorrect = selectedAnswers.length === 1 && selectedAnswers[0] === currentQuestion.correctAnswers[0];
    } else {
      // 多选题比较答案是否完全一致
      isCorrect = selectedAnswers.length === currentQuestion.correctAnswers.length &&
                 selectedAnswers.every(answer => currentQuestion.correctAnswers.includes(answer)) &&
                 currentQuestion.correctAnswers.every(answer => selectedAnswers.includes(answer));
    }
    
    if (isCorrect) {
      setQuizScore(prev => prev + 1);
    }
    
    // 下一题或结束测验
    if (currentQuestionIndex < quizQuestions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedAnswers([]);
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
  };

  // 切换答案选择
  const toggleAnswer = (index: number) => {
    const currentQuestion = quizQuestions[currentQuestionIndex];
    if (currentQuestion.type === 'single') {
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
      case 'easy': return '简单';
      case 'medium': return '中等';
      case 'hard': return '困难';
      default: return '全部';
    }
  };

  return (
    <View style={styles.container}>
      <Header 
        title="题库与测验" 
        showBackButton 
        onBack={() => navigation.goBack()} 
      />
      
      {!isQuizMode ? (
        // 题库模式
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
              <View key={question.id} style={{
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
                    {index + 1}. {question.type === 'single' ? '单选题' : '多选题'}
                  </Text>
                  <View style={{
                    flexDirection: 'row',
                    gap: 8
                  }}>
                    <View style={{
                      paddingHorizontal: 8,
                      paddingVertical: 4,
                      borderRadius: 12,
                      backgroundColor: '#E6F7F3',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <Text style={{ fontSize: 12, fontWeight: '500', color: '#1F5E52' }}>
                        {question.category === 'disease' ? '疾病' :
                         question.category === 'prevention' ? '预防' :
                         question.category === 'control' ? '防控' : '治疗'}
                      </Text>
                    </View>
                    <View style={{
                      paddingHorizontal: 8,
                      paddingVertical: 4,
                      borderRadius: 12,
                      backgroundColor: question.difficulty === 'easy' ? '#D1FAE5' :
                                       question.difficulty === 'medium' ? '#FEF3C7' : '#FEE2E2',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <Text style={{ fontSize: 12, fontWeight: '500', color: question.difficulty === 'easy' ? '#1F5E52' :
                                       question.difficulty === 'medium' ? '#92400E' : '#991B1B' }}>
                        {getDifficultyText(question.difficulty)}
                      </Text>
                    </View>
                  </View>
                </View>
                <Text style={{ fontSize: 16, color: '#111827', marginBottom: 12 }}>
                  {question.question}
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
                        borderRadius: question.type === 'single' ? 12 : 8,
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
            <Text style={{ fontSize: 48, marginBottom: 16 }}>🎉</Text>
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
            </View>
            
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
              {quizQuestions[currentQuestionIndex].question}
            </Text>
            
            <View style={{ gap: 12, marginBottom: 24 }}>
              {quizQuestions[currentQuestionIndex].options.map((option, optionIndex) => (
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
                    selectedAnswers.includes(optionIndex) ? {
                      backgroundColor: '#E6F7F3',
                      borderColor: '#2DBBA1'
                    } : {
                      backgroundColor: '#F3F4F6',
                      borderColor: '#E5E7EB'
                    }
                  ]}
                  onPress={() => toggleAnswer(optionIndex)}
                >
                  <View style={[
                    {
                      width: 28,
                      height: 28,
                      marginRight: 16,
                      justifyContent: 'center',
                      alignItems: 'center'
                    },
                    selectedAnswers.includes(optionIndex) ? {
                      backgroundColor: '#2DBBA1',
                      borderRadius: quizQuestions[currentQuestionIndex].type === 'single' ? 14 : 8
                    } : {
                      borderWidth: 2,
                      borderColor: '#D1D5DB',
                      borderRadius: quizQuestions[currentQuestionIndex].type === 'single' ? 14 : 8
                    }
                  ]}>
                    {selectedAnswers.includes(optionIndex) && (
                      <Text style={{ fontSize: 16, color: '#FFFFFF', fontWeight: '600' }}>
                        {quizQuestions[currentQuestionIndex].type === 'single' ? '✓' : '✓'}
                      </Text>
                    )}
                  </View>
                  <Text style={[
                    {
                      fontSize: 16,
                      color: '#111827',
                      flex: 1
                    },
                    selectedAnswers.includes(optionIndex) && {
                      fontWeight: '600'
                    }
                  ]}>
                    {option}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            
            <TouchableOpacity
              style={{
                backgroundColor: selectedAnswers.length === 0 ? '#D1D5DB' : '#2DBBA1',
                borderRadius: 12,
                padding: 16,
                alignItems: 'center',
                justifyContent: 'center'
              }}
              onPress={submitAnswer}
              disabled={selectedAnswers.length === 0}
            >
              <Text style={{ fontSize: 16, fontWeight: '600', color: '#FFFFFF' }}>
                {currentQuestionIndex < quizQuestions.length - 1 ? '下一题' : '提交答案'}
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      )}
    </View>
  );
};

export default QuestionBankScreen;