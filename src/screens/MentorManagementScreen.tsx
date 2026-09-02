import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Alert, ActivityIndicator, RefreshControl } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Header from '../components/Header';
import { styles } from '../styles';
import { internshipApi } from '../services/api';

// 导师数据结构
interface Mentor {
  id: string;
  name: string;
  title: string;
  department: string;
  expertise: string[];
  avatar: string;
  rating: number;
  bio: string;
  contact: string;
  internCount: number;
}

// 实习项目数据结构
interface InternshipProgram {
  id: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  mentorId: string;
  mentorName: string;
  internCount: number;
  status: 'recruiting' | 'ongoing' | 'completed';
}

const MentorManagementScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const [activeTab, setActiveTab] = useState<'mentors' | 'programs'>('mentors');
  const [selectedMentor, setSelectedMentor] = useState<Mentor | null>(null);
  const [selectedProgram, setSelectedProgram] = useState<InternshipProgram | null>(null);
  const [mentors, setMentors] = useState<Mentor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const fetchMentors = useCallback(async (isRefresh = false) => {
    try {
      if (isRefresh) setRefreshing(true); else setLoading(true);
      setError(null);
      const response = await internshipApi.getStudents({});
      const data = response.data?.students || response.data || [];
      setMentors(data.map((s: any) => ({
        id: s._id || s.id,
        name: s.nickname || s.name || '导师',
        title: s.title || '指导教师',
        department: s.department || '',
        expertise: s.expertise || [],
        avatar: s.avatar || '👨‍⚕️',
        rating: s.rating || 0,
        bio: s.bio || '',
        contact: s.phoneNumber || s.contact || '',
        internCount: s.internCount || 0,
      })));
    } catch (err) {
      console.error('获取导师列表失败:', err);
      setError('加载导师列表失败，请稍后重试');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => { fetchMentors(); }, [fetchMentors]);

  // 实习项目数据（静态展示，如需动态可后续接入 API）
  const internshipPrograms: InternshipProgram[] = [
    {
      id: '1',
      title: 'AI诊断系统实习项目',
      description: '参与AI诊断系统的开发和优化，学习图像识别和自然语言处理技术在禽类健康诊断中的应用。',
      startDate: '2024-01-01',
      endDate: '2024-06-30',
      mentorId: '2',
      mentorName: '李导师',
      internCount: 8,
      status: 'ongoing'
    },
    {
      id: '2',
      title: '禽类疾病诊断实习',
      description: '跟随资深兽医师学习禽类疾病的诊断和治疗，参与实际病例分析。',
      startDate: '2024-03-01',
      endDate: '2024-08-31',
      mentorId: '1',
      mentorName: '张导师',
      internCount: 10,
      status: 'recruiting'
    },
    {
      id: '3',
      title: '生产管理优化项目',
      description: '学习现代化禽类生产管理技术，参与生产流程优化和数据分析。',
      startDate: '2024-02-01',
      endDate: '2024-07-31',
      mentorId: '3',
      mentorName: '王导师',
      internCount: 6,
      status: 'ongoing'
    }
  ];

  // 获取项目状态文本
  const getProgramStatusText = (status: string) => {
    switch (status) {
      case 'recruiting': return '招募中';
      case 'ongoing': return '进行中';
      case 'completed': return '已完成';
      default: return '未知';
    }
  };

  // 获取项目状态样式
  const getProgramStatusStyle = (status: string) => {
    switch (status) {
      case 'recruiting': return { backgroundColor: '#D1FAE5', color: '#1F5E52' };
      case 'ongoing': return { backgroundColor: '#FEF3C7', color: '#92400E' };
      case 'completed': return { backgroundColor: '#E5E7EB', color: '#6B7280' };
      default: return { backgroundColor: '#E5E7EB', color: '#6B7280' };
    }
  };

  // 选择导师
  const handleSelectMentor = (mentor: Mentor) => {
    setSelectedMentor(mentor);
    setSelectedProgram(null);
  };

  // 选择实习项目
  const handleSelectProgram = (program: InternshipProgram) => {
    setSelectedProgram(program);
    setSelectedMentor(null);
  };

  // 查看导师详情
  const handleViewMentorDetails = (mentor: Mentor) => {
    Alert.alert(
      mentor.name,
      `职称：${mentor.title}\n部门：${mentor.department}\n联系方式：${mentor.contact}\n\n${mentor.bio}`
    );
  };

  // 查看项目详情
  const handleViewProgramDetails = (program: InternshipProgram) => {
    Alert.alert(
      program.title,
      `导师：${program.mentorName}\n时间：${program.startDate} 至 ${program.endDate}\n状态：${getProgramStatusText(program.status)}\n\n${program.description}`
    );
  };

  // 申请实习
  const handleApplyInternship = (program: InternshipProgram) => {
    Alert.alert(
      '申请实习',
      `确定要申请"${program.title}"实习项目吗？`,
      [
        { text: '取消', style: 'cancel' },
        {
          text: '申请',
          onPress: () => {
            Alert.alert('成功', '实习申请已提交，等待导师审核');
          }
        }
      ]
    );
  };

  return (
    <View style={styles.container}>
      <Header 
        title="导师管理" 
        showBackButton 
        onBack={() => navigation.goBack()} 
      />
      
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#2DBBA1" />
          <Text style={styles.loadingText}>正在加载导师列表...</Text>
        </View>
      ) : error ? (
        <View style={styles.loadingContainer}>
          <Text style={{ fontSize: 48, marginBottom: 12 }}>⚠️</Text>
          <Text style={{ fontSize: 16, color: '#6B7280', marginBottom: 16 }}>{error}</Text>
          <TouchableOpacity style={{ backgroundColor: '#2DBBA1', borderRadius: 8, paddingHorizontal: 24, paddingVertical: 10 }} onPress={() => fetchMentors()}>
            <Text style={{ color: '#FFFFFF', fontSize: 16, fontWeight: '600' }}>重试</Text>
          </TouchableOpacity>
        </View>
      ) : activeTab === 'mentors' && mentors.length === 0 ? (
        <View style={styles.loadingContainer}>
          <Text style={{ fontSize: 48, marginBottom: 12 }}>📭</Text>
          <Text style={{ fontSize: 16, color: '#6B7280' }}>暂无导师数据</Text>
        </View>
      ) : (
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        {/* 标签切换 */}
        <View style={{
          flexDirection: 'row',
          backgroundColor: '#F3F4F6',
          borderRadius: 12,
          padding: 4,
          marginBottom: 16
        }}>
          <TouchableOpacity
            style={[
              {
                flex: 1,
                paddingVertical: 12,
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 8
              },
              activeTab === 'mentors' && {
                backgroundColor: '#FFFFFF',
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.06,
                shadowRadius: 3.84,
                elevation: 2
              }
            ]}
            onPress={() => setActiveTab('mentors')}
          >
            <Text style={[
              {
                fontSize: 16,
                fontWeight: '500',
                color: '#6B7280'
              },
              activeTab === 'mentors' && {
                color: '#2DBBA1',
                fontWeight: '600'
              }
            ]}>
              导师列表
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[
              {
                flex: 1,
                paddingVertical: 12,
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 8
              },
              activeTab === 'programs' && {
                backgroundColor: '#FFFFFF',
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.06,
                shadowRadius: 3.84,
                elevation: 2
              }
            ]}
            onPress={() => setActiveTab('programs')}
          >
            <Text style={[
              {
                fontSize: 16,
                fontWeight: '500',
                color: '#6B7280'
              },
              activeTab === 'programs' && {
                color: '#2DBBA1',
                fontWeight: '600'
              }
            ]}>
              实习项目
            </Text>
          </TouchableOpacity>
        </View>

        {/* 导师列表 */}
        {activeTab === 'mentors' && (
          <View>
            <Text style={{ fontSize: 18, fontWeight: '600', color: '#111827', marginBottom: 12 }}>
              导师列表 ({mentors.length} 位)
            </Text>
            
            {mentors.map(mentor => (
              <TouchableOpacity
                key={mentor.id}
                style={[
                  {
                    backgroundColor: '#FFFFFF',
                    borderRadius: 12,
                    padding: 16,
                    marginBottom: 12,
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.06,
                    shadowRadius: 3.84,
                    elevation: 2,
                    flexDirection: 'row',
                    alignItems: 'flex-start'
                  },
                  selectedMentor?.id === mentor.id && {
                    borderWidth: 2,
                    borderColor: '#2DBBA1',
                    backgroundColor: '#E6F7F3'
                  }
                ]}
                onPress={() => handleSelectMentor(mentor)}
              >
                <View style={{
                  width: 64,
                  height: 64,
                  borderRadius: 32,
                  backgroundColor: '#E6F7F3',
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginRight: 16,
                  flexShrink: 0
                }}>
                  <Text style={{ fontSize: 32 }}>{mentor.avatar}</Text>
                </View>
                
                <View style={{ flex: 1 }}>
                  <View style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: 4
                  }}>
                    <Text style={[
                      {
                        fontSize: 18,
                        fontWeight: '600',
                        color: '#111827'
                      },
                      selectedMentor?.id === mentor.id && {
                        color: '#1F5E52'
                      }
                    ]}>
                      {mentor.name}
                    </Text>
                    <View style={{
                      flexDirection: 'row',
                      alignItems: 'center'
                    }}>
                      {[...Array(5)].map((_, index) => (
                        <Text key={index} style={{ fontSize: 16, color: index < mentor.rating ? '#FBBF24' : '#D1D5DB' }}>
                          ⭐
                        </Text>
                      ))}
                      <Text style={{ fontSize: 14, fontWeight: '500', color: '#6B7280', marginLeft: 8 }}>
                        {mentor.rating.toFixed(1)}
                      </Text>
                    </View>
                  </View>
                  
                  <Text style={{ fontSize: 14, color: '#6B7280', marginBottom: 8 }}>
                    {mentor.title} | {mentor.department}
                  </Text>
                  
                  <View style={{
                    flexDirection: 'row',
                    flexWrap: 'wrap',
                    marginBottom: 12
                  }}>
                    {mentor.expertise.map((skill, index) => (
                      <View key={index} style={{
                        backgroundColor: '#E6F7F3',
                        paddingHorizontal: 12,
                        paddingVertical: 4,
                        borderRadius: 16,
                        marginRight: 8,
                        marginBottom: 8,
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        <Text style={{ fontSize: 12, fontWeight: '500', color: '#1F5E52' }}>
                          {skill}
                        </Text>
                      </View>
                    ))}
                  </View>
                  
                  <View style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}>
                    <Text style={{ fontSize: 14, color: '#6B7280' }}>
                      指导实习生：{mentor.internCount} 人
                    </Text>
                    <TouchableOpacity
                      style={{
                        backgroundColor: '#2DBBA1',
                        borderRadius: 8,
                        paddingHorizontal: 16,
                        paddingVertical: 8,
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                      onPress={() => handleViewMentorDetails(mentor)}
                    >
                      <Text style={{ fontSize: 14, fontWeight: '500', color: '#FFFFFF' }}>
                        查看详情
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* 实习项目列表 */}
        {activeTab === 'programs' && (
          <View>
            <Text style={{ fontSize: 18, fontWeight: '600', color: '#111827', marginBottom: 12 }}>
              实习项目 ({internshipPrograms.length} 个)
            </Text>
            
            {internshipPrograms.map(program => (
              <TouchableOpacity
                key={program.id}
                style={[
                  {
                    backgroundColor: '#FFFFFF',
                    borderRadius: 12,
                    padding: 16,
                    marginBottom: 12,
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.06,
                    shadowRadius: 3.84,
                    elevation: 2
                  },
                  selectedProgram?.id === program.id && {
                    borderWidth: 2,
                    borderColor: '#2DBBA1',
                    backgroundColor: '#E6F7F3'
                  }
                ]}
                onPress={() => handleSelectProgram(program)}
              >
                <View style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  marginBottom: 8
                }}>
                  <Text style={[
                    {
                      fontSize: 18,
                      fontWeight: '600',
                      color: '#111827',
                      flex: 1
                    },
                    selectedProgram?.id === program.id && {
                      color: '#1F5E52'
                    }
                  ]}>
                    {program.title}
                  </Text>
                  <View style={[
                    {
                      paddingHorizontal: 12,
                      paddingVertical: 6,
                      borderRadius: 16,
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginLeft: 8
                    },
                    getProgramStatusStyle(program.status)
                  ]}>
                    <Text style={[
                      {
                        fontSize: 12,
                        fontWeight: '500'
                      },
                      { color: getProgramStatusStyle(program.status).color }
                    ]}>
                      {getProgramStatusText(program.status)}
                    </Text>
                  </View>
                </View>
                
                <Text style={{ fontSize: 14, color: '#6B7280', marginBottom: 8 }}>
                  导师：{program.mentorName} | 已有 {program.internCount} 人参与
                </Text>
                
                <Text style={{ fontSize: 14, color: '#4B5563', lineHeight: 22, marginBottom: 12 }}>
                  {program.description}
                </Text>
                
                <View style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <Text style={{ fontSize: 14, color: '#6B7280' }}>
                    {program.startDate} 至 {program.endDate}
                  </Text>
                  
                  <View style={{
                    flexDirection: 'row',
                    gap: 8
                  }}>
                    <TouchableOpacity
                      style={{
                        backgroundColor: '#F3F4F6',
                        borderRadius: 8,
                        paddingHorizontal: 16,
                        paddingVertical: 8,
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                      onPress={() => handleViewProgramDetails(program)}
                    >
                      <Text style={{ fontSize: 14, fontWeight: '500', color: '#6B7280' }}>
                        查看详情
                      </Text>
                    </TouchableOpacity>
                    
                    {program.status === 'recruiting' && (
                      <TouchableOpacity
                        style={{
                          backgroundColor: '#2DBBA1',
                          borderRadius: 8,
                          paddingHorizontal: 16,
                          paddingVertical: 8,
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                        onPress={() => handleApplyInternship(program)}
                      >
                        <Text style={{ fontSize: 14, fontWeight: '500', color: '#FFFFFF' }}>
                          申请实习
                        </Text>
                      </TouchableOpacity>
                    )}
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </ScrollView>
      )}
    </View>
  );
};

export default MentorManagementScreen;