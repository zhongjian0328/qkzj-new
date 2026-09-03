import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Alert, ActivityIndicator, RefreshControl } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import Header from '../components/Header';
import { styles } from '../styles';
import { internshipApi } from '../services/api';

const MentorManagementScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const [activeTab, setActiveTab] = useState<'mentors' | 'programs'>('mentors');
  const [selectedMentor, setSelectedMentor] = useState<any | null>(null);
  const [mentors, setMentors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [programs, setPrograms] = useState<any[]>([]);
  const [programsLoading, setProgramsLoading] = useState(true);
  const [programsError, setProgramsError] = useState<string | null>(null);

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
        avatar: s.avatar || 'person',
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

  // 实习项目数据：基于日志聚合生成
  const fetchPrograms = useCallback(async () => {
    try {
      setProgramsLoading(true);
      setProgramsError(null);
      const response = await internshipApi.getInternLogs({ limit: 50 });
      const logs = response.data?.logs || [];
      // 按导师分组，构建"实习项目"视图
      const mentorMap = new Map<string, any>();
      logs.forEach((log: any) => {
        const mentorId = log.mentorId?._id || log.mentorId || 'unknown';
        const mentorName = log.mentorId?.nickname || '未知导师';
        if (!mentorMap.has(mentorId)) {
          mentorMap.set(mentorId, {
            id: mentorId,
            title: `${mentorName}指导项目`,
            mentorName,
            logCount: 0,
            pendingCount: 0,
            latestDate: log.logDate,
            status: 'ongoing' as const,
          });
        }
        const proj = mentorMap.get(mentorId);
        proj.logCount++;
        if (log.status === 'PENDING') proj.pendingCount++;
        if (new Date(log.logDate) > new Date(proj.latestDate)) proj.latestDate = log.logDate;
      });
      setPrograms(Array.from(mentorMap.values()));
    } catch (err) {
      console.error('获取实习项目失败:', err);
      setProgramsError('加载实习项目失败');
    } finally {
      setProgramsLoading(false);
    }
  }, []);

  useEffect(() => { fetchMentors(); fetchPrograms(); }, [fetchMentors, fetchPrograms]);

  // 选择导师
  const handleSelectMentor = (mentor: any) => {
    setSelectedMentor(mentor);
  };

  // 查看导师详情
  const handleViewMentorDetails = (mentor: any) => {
    Alert.alert(
      mentor.name,
      `职称：${mentor.title}\n部门：${mentor.department}\n联系方式：${mentor.contact}\n\n${mentor.bio}`
    );
  };

  // 查看项目详情（跳转到日志列表）
  const handleViewProgramDetails = (program: any) => {
    Alert.alert(
      program.title,
      `导师：${program.mentorName}\n日志数：${program.logCount} 篇\n待批注：${program.pendingCount} 篇\n最近活动：${new Date(program.latestDate).toLocaleDateString('zh-CN')}`
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
          <Ionicons name="alert-circle-outline" size={48} color="#9CA3AF" />
          <Text style={{ fontSize: 16, color: '#6B7280', marginBottom: 16 }}>{error}</Text>
          <TouchableOpacity style={{ backgroundColor: '#2DBBA1', borderRadius: 8, paddingHorizontal: 24, paddingVertical: 10 }} onPress={() => fetchMentors()}>
            <Text style={{ color: '#FFFFFF', fontSize: 16, fontWeight: '600' }}>重试</Text>
          </TouchableOpacity>
        </View>
      ) : activeTab === 'mentors' && mentors.length === 0 ? (
        <View style={styles.loadingContainer}>
          <Ionicons name="folder-open-outline" size={48} color="#9CA3AF" />
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
                          <Ionicons name="star" size={14} color="#F59E0B" />
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
                    {mentor.expertise.map((skill: string, index: number) => (
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
              实习项目 ({programs.length} 个)
            </Text>

            {programsLoading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#2DBBA1" />
                <Text style={styles.loadingText}>正在加载实习项目...</Text>
              </View>
            ) : programsError ? (
              <View style={styles.loadingContainer}>
                <Ionicons name="alert-circle-outline" size={48} color="#9CA3AF" />
                <Text style={{ fontSize: 16, color: '#6B7280', marginBottom: 16 }}>{programsError}</Text>
                <TouchableOpacity style={{ backgroundColor: '#2DBBA1', borderRadius: 8, paddingHorizontal: 24, paddingVertical: 10 }} onPress={() => fetchPrograms()}>
                  <Text style={{ color: '#FFFFFF', fontSize: 16, fontWeight: '600' }}>重试</Text>
                </TouchableOpacity>
              </View>
            ) : programs.length === 0 ? (
              <View style={styles.loadingContainer}>
                <Ionicons name="folder-open-outline" size={48} color="#9CA3AF" />
                <Text style={{ fontSize: 16, color: '#6B7280' }}>暂无实习项目数据</Text>
              </View>
            ) : (
            programs.map(program => (
              <TouchableOpacity
                key={program.id}
                style={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: 12,
                  padding: 16,
                  marginBottom: 12,
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.06,
                  shadowRadius: 3.84,
                  elevation: 2,
                  borderLeftWidth: 4,
                  borderLeftColor: program.pendingCount > 0 ? '#F59E0B' : '#10B981',
                }}
                onPress={() => handleViewProgramDetails(program)}
              >
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                  <Text style={{ fontSize: 16, fontWeight: '600', color: '#111827', flex: 1 }}>
                    {program.title}
                  </Text>
                  {program.pendingCount > 0 && (
                    <View style={{ backgroundColor: '#FEF3C7', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 }}>
                      <Text style={{ fontSize: 12, fontWeight: '600', color: '#92400E' }}>
                        {program.pendingCount}篇待批注
                      </Text>
                    </View>
                  )}
                </View>

                <Text style={{ fontSize: 14, color: '#6B7280', marginBottom: 4 }}>
                  导师：{program.mentorName} | 日志：{program.logCount} 篇
                </Text>
                <Text style={{ fontSize: 12, color: '#9CA3AF' }}>
                  最近活动：{new Date(program.latestDate).toLocaleDateString('zh-CN')}
                </Text>
              </TouchableOpacity>
            ))
            )}
          </View>
        )}
      </ScrollView>
      )}
    </View>
  );
};

export default MentorManagementScreen;