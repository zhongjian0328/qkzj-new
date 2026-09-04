import { colors } from '../theme';
import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, TouchableOpacity, ScrollView, TextInput, Alert, ActivityIndicator, RefreshControl } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import Header from '../components/Header';
import { styles } from '../styles';
import { internshipApi } from '../services/api';

// 日志数据结构
interface InternLog {
  id: string;
  title: string;
  content: string;
  date: string;
  status: 'draft' | 'submitted' | 'approved' | 'rejected';
  mentorComments?: string;
  mentorName?: string;
  rating?: number;
}

const InternLogScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const [activeStatus, setActiveStatus] = useState('all');
  const [selectedLog, setSelectedLog] = useState<InternLog | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState('');
  const [editContent, setEditContent] = useState('');
  const [showAddLog, setShowAddLog] = useState(false);
  const [newLogTitle, setNewLogTitle] = useState('');
  const [newLogContent, setNewLogContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const fetchLogs = useCallback(async (isRefresh = false) => {
    try {
      if (isRefresh) setRefreshing(true); else setLoading(true);
      setError(null);
      const params: any = {};
      if (activeStatus !== 'all') params.status = activeStatus;
      const response = await internshipApi.getInternLogs(params);
      const data = response.data?.logs || response.data || [];
      setLogs(data.map((log: any) => ({
        id: log._id || log.id,
        title: log.title || log.logDate ? `实习日志-${log.logDate}` : '实习日志',
        content: log.content || '',
        date: log.logDate || log.createdAt || '',
        status: log.status || 'draft',
        mentorComments: log.mentorComment?.comment || log.mentorComments,
        mentorName: log.mentorComment?.mentorName || log.mentorName,
        rating: log.rating,
      })));
    } catch (err) {
      console.error('获取实习日志失败:', err);
      setError('加载实习日志失败，请稍后重试');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [activeStatus]);

  useEffect(() => { fetchLogs(); }, [fetchLogs]);

  // 模拟日志数据
  const [logs, setLogs] = useState<InternLog[]>([]);

  // 状态筛选选项
  const statusOptions = [
    { id: 'all', name: '全部' },
    { id: 'draft', name: '草稿' },
    { id: 'submitted', name: '已提交' },
    { id: 'approved', name: '已通过' },
    { id: 'rejected', name: '已驳回' }
  ];

  // 过滤日志
  const filteredLogs = logs.filter(log => {
    if (activeStatus === 'all') return true;
    return log.status === activeStatus;
  });

  // 获取状态文本
  const getStatusText = (status: string) => {
    switch (status) {
      case 'draft': return '草稿';
      case 'submitted': return '已提交';
      case 'approved': return '已通过';
      case 'rejected': return '已驳回';
      default: return '未知';
    }
  };

  // 获取状态样式
  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'draft': return { backgroundColor: colors.border, color: colors.textTertiary };
      case 'submitted': return { backgroundColor: colors.warningLight, color: colors.warningText };
      case 'approved': return { backgroundColor: colors.successLight, color: colors.primaryDark };
      case 'rejected': return { backgroundColor: colors.errorLight, color: colors.errorText };
      default: return { backgroundColor: colors.border, color: colors.textTertiary };
    }
  };

  // 选择日志
  const handleSelectLog = (log: InternLog) => {
    setSelectedLog(log);
    setIsEditing(false);
  };

  // 开始编辑日志
  const handleStartEdit = () => {
    if (selectedLog) {
      setEditTitle(selectedLog.title);
      setEditContent(selectedLog.content);
      setIsEditing(true);
    }
  };

  // 保存编辑
  const handleSaveEdit = () => {
    if (selectedLog) {
      const updatedLogs = logs.map(log => {
        if (log.id === selectedLog.id) {
          return {
            ...log,
            title: editTitle,
            content: editContent
          };
        }
        return log;
      });
      setLogs(updatedLogs as InternLog[]);
      setSelectedLog({
        ...selectedLog,
        title: editTitle,
        content: editContent
      });
      setIsEditing(false);
      Alert.alert('成功', '日志已更新');
    }
  };

  // 删除日志
  const handleDeleteLog = () => {
    if (selectedLog) {
      Alert.alert(
        '确认删除',
        '确定要删除这篇日志吗？',
        [
          { text: '取消', style: 'cancel' },
          {
            text: '删除',
            style: 'destructive',
            onPress: () => {
              const updatedLogs = logs.filter(log => log.id !== selectedLog.id);
              setLogs(updatedLogs);
              setSelectedLog(null);
              setIsEditing(false);
              Alert.alert('成功', '日志已删除');
            }
          }
        ]
      );
    }
  };

  // 提交日志
  const handleSubmitLog = () => {
    if (selectedLog) {
      const updatedLogs = logs.map(log => {
        if (log.id === selectedLog.id) {
          return {
            ...log,
            status: 'submitted' as const
          };
        }
        return log;
      });
      setLogs(updatedLogs);
      setSelectedLog({
        ...selectedLog,
        status: 'submitted' as const
      });
      Alert.alert('成功', '日志已提交');
    }
  };

  // 添加新日志
  const handleAddLog = () => {
    if (!newLogTitle.trim() || !newLogContent.trim()) {
      Alert.alert('提示', '请填写日志标题和内容');
      return;
    }

    const newLog: InternLog = {
      id: Date.now().toString(),
      title: newLogTitle,
      content: newLogContent,
      date: new Date().toISOString().split('T')[0],
      status: 'draft'
    };

    setLogs([newLog, ...logs]);
    setNewLogTitle('');
    setNewLogContent('');
    setShowAddLog(false);
    Alert.alert('成功', '日志已创建');
  };

  return (
    <View style={styles.container}>
      <Header 
        title="实习日志" 
        showBackButton 
        onBack={() => navigation.goBack()} 
      />
      
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>正在加载实习日志...</Text>
        </View>
      ) : error ? (
        <View style={styles.loadingContainer}>
          <Ionicons name="alert-circle-outline" size={48} color={colors.textDisabled} />
          <Text style={{ fontSize: 16, color: colors.textTertiary, marginBottom: 16 }}>{error}</Text>
          <TouchableOpacity style={{ backgroundColor: colors.primary, borderRadius: 8, paddingHorizontal: 24, paddingVertical: 10 }} onPress={() => fetchLogs()}>
            <Text style={{ color: colors.surface, fontSize: 16, fontWeight: '600' }}>重试</Text>
          </TouchableOpacity>
        </View>
      ) : logs.length === 0 ? (
        <View style={styles.loadingContainer}>
          <Ionicons name="folder-open-outline" size={48} color={colors.textDisabled} />
          <Text style={{ fontSize: 16, color: colors.textTertiary }}>暂无实习日志记录</Text>
        </View>
      ) : (
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        {/* 筛选条件 */}
        <View style={{ marginBottom: 16 }}>
          <Text style={{ fontSize: 16, fontWeight: '600', color: colors.textPrimary, marginBottom: 8 }}>
            日志状态
          </Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={{ flexDirection: 'row', gap: 8 }}>
              {statusOptions.map(option => (
                <TouchableOpacity
                  key={option.id}
                  style={[
                    {
                      paddingHorizontal: 16,
                      paddingVertical: 8,
                      borderRadius: 20,
                      backgroundColor: activeStatus === option.id ? colors.primary : colors.surfaceMuted
                    }
                  ]}
                  onPress={() => setActiveStatus(option.id)}
                >
                  <Text style={[
                    {
                      fontSize: 14,
                      fontWeight: '500',
                      color: activeStatus === option.id ? colors.surface : colors.textTertiary
                    }
                  ]}>
                    {option.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </View>

        {/* 添加日志按钮 */}
        <TouchableOpacity
          style={{
            backgroundColor: colors.primary,
            borderRadius: 12,
            padding: 16,
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 16,
            flexDirection: 'row',
            gap: 8
          }}
          onPress={() => setShowAddLog(true)}
        >
          <Ionicons name="create" size={18} color={colors.primary} />
          <Text style={{ fontSize: 16, fontWeight: '600', color: colors.surface }}>
            撰写新日志
          </Text>
        </TouchableOpacity>

        {/* 添加日志表单 */}
        {showAddLog && (
          <View style={{
            backgroundColor: colors.surface,
            borderRadius: 12,
            padding: 16,
            marginBottom: 16,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.06,
            shadowRadius: 3.84,
            elevation: 2
          }}>
            <Text style={{ fontSize: 18, fontWeight: '600', color: colors.textPrimary, marginBottom: 16 }}>
              撰写新日志
            </Text>
            
            <TextInput
              style={{
                fontSize: 16,
                fontWeight: '600',
                color: colors.textPrimary,
                marginBottom: 12,
                padding: 12,
                borderBottomWidth: 2,
                borderBottomColor: colors.border
              }}
              placeholder="日志标题"
              placeholderTextColor={colors.textDisabled}
              value={newLogTitle}
              onChangeText={setNewLogTitle}
            />
            
            <TextInput
              style={{
                fontSize: 14,
                color: colors.textSecondary,
                marginBottom: 16,
                padding: 12,
                borderWidth: 2,
                borderColor: colors.border,
                borderRadius: 8,
                minHeight: 120,
                textAlignVertical: 'top'
              }}
              placeholder="日志内容"
              placeholderTextColor={colors.textDisabled}
              value={newLogContent}
              onChangeText={setNewLogContent}
              multiline
            />
            
            <View style={{
              flexDirection: 'row',
              gap: 12
            }}>
              <TouchableOpacity
                style={{
                  flex: 1,
                  backgroundColor: colors.surface,
                  borderWidth: 2,
                  borderColor: colors.border,
                  borderRadius: 8,
                  padding: 12,
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
                onPress={() => setShowAddLog(false)}
              >
                <Text style={{ fontSize: 14, fontWeight: '500', color: colors.textTertiary }}>
                  取消
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={{
                  flex: 1,
                  backgroundColor: colors.primary,
                  borderRadius: 8,
                  padding: 12,
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
                onPress={handleAddLog}
              >
                <Text style={{ fontSize: 14, fontWeight: '500', color: colors.surface }}>
                  保存草稿
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* 日志详情 */}
        {selectedLog && (
          <View style={{
            backgroundColor: colors.surface,
            borderRadius: 12,
            padding: 16,
            marginBottom: 16,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.06,
            shadowRadius: 3.84,
            elevation: 2
          }}>
            {isEditing ? (
              // 编辑模式
              <View>
                <Text style={{ fontSize: 18, fontWeight: '600', color: colors.textPrimary, marginBottom: 16 }}>
                  编辑日志
                </Text>
                
                <TextInput
                  style={{
                    fontSize: 16,
                    fontWeight: '600',
                    color: colors.textPrimary,
                    marginBottom: 12,
                    padding: 12,
                    borderBottomWidth: 2,
                    borderBottomColor: colors.border
                  }}
                  placeholder="日志标题"
                  placeholderTextColor={colors.textDisabled}
                  value={editTitle}
                  onChangeText={setEditTitle}
                />
                
                <TextInput
                  style={{
                    fontSize: 14,
                    color: colors.textSecondary,
                    marginBottom: 16,
                    padding: 12,
                    borderWidth: 2,
                    borderColor: colors.border,
                    borderRadius: 8,
                    minHeight: 120,
                    textAlignVertical: 'top'
                  }}
                  placeholder="日志内容"
                  placeholderTextColor={colors.textDisabled}
                  value={editContent}
                  onChangeText={setEditContent}
                  multiline
                />
                
                <View style={{
                  flexDirection: 'row',
                  gap: 12
                }}>
                  <TouchableOpacity
                    style={{
                      flex: 1,
                      backgroundColor: colors.surface,
                      borderWidth: 2,
                      borderColor: colors.border,
                      borderRadius: 8,
                      padding: 12,
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                    onPress={() => setIsEditing(false)}
                  >
                    <Text style={{ fontSize: 14, fontWeight: '500', color: colors.textTertiary }}>
                      取消
                    </Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity
                    style={{
                      flex: 1,
                      backgroundColor: colors.primary,
                      borderRadius: 8,
                      padding: 12,
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                    onPress={handleSaveEdit}
                  >
                    <Text style={{ fontSize: 14, fontWeight: '500', color: colors.surface }}>
                      保存
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            ) : (
              // 查看模式
              <View>
                <View style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: 8
                }}>
                  <Text style={{ fontSize: 18, fontWeight: '600', color: colors.textPrimary }}>
                    {selectedLog.title}
                  </Text>
                  <View style={[
                    {
                      paddingHorizontal: 12,
                      paddingVertical: 6,
                      borderRadius: 16,
                      alignItems: 'center',
                      justifyContent: 'center'
                    },
                    getStatusStyle(selectedLog.status)
                  ]}>
                    <Text style={[
                      {
                        fontSize: 12,
                        fontWeight: '500'
                      },
                      { color: getStatusStyle(selectedLog.status).color }
                    ]}>
                      {getStatusText(selectedLog.status)}
                    </Text>
                  </View>
                </View>
                
                <Text style={{ fontSize: 14, color: colors.textTertiary, marginBottom: 16 }}>
                  {selectedLog.date}
                </Text>
                
                <Text style={{ fontSize: 14, color: colors.textSecondary, lineHeight: 22, marginBottom: 20 }}>
                  {selectedLog.content}
                </Text>
                
                {/* 导师批注 */}
                {selectedLog.status === 'approved' || selectedLog.status === 'rejected' ? (
                  <View style={{
                    backgroundColor: colors.surfaceMuted,
                    borderRadius: 8,
                    padding: 16,
                    marginBottom: 16
                  }}>
                    <Text style={{ fontSize: 16, fontWeight: '600', color: colors.textPrimary, marginBottom: 12 }}>
                      导师批注
                    </Text>
                    
                    {selectedLog.rating && (
                      <View style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        marginBottom: 12
                      }}>
                        <Text style={{ fontSize: 14, fontWeight: '500', color: colors.textSecondary, marginRight: 8 }}>
                          评分：
                        </Text>
                        <View style={{ flexDirection: 'row' }}>
                          {[...Array(5)].map((_, index) => (
                            <Text key={index} style={{ fontSize: 16, color: index < (selectedLog.rating ?? 0) ? colors.warning : colors.borderStrong }}>
                              <Ionicons name="star" size={14} color={colors.warning} />
                            </Text>
                          ))}
                        </View>
                      </View>
                    )}
                    
                    <Text style={{ fontSize: 14, color: colors.textSecondary, lineHeight: 22 }}>
                      {selectedLog.mentorComments || '暂无批注'}
                    </Text>
                    
                    {selectedLog.mentorName && (
                      <Text style={{ fontSize: 14, fontWeight: '500', color: colors.textTertiary, marginTop: 8, textAlign: 'right' }}>
                        —— {selectedLog.mentorName}
                      </Text>
                    )}
                  </View>
                ) : null}
                
                {/* 操作按钮 */}
                <View style={{
                  flexDirection: 'row',
                  gap: 12
                }}>
                  <TouchableOpacity
                    style={{
                      flex: 1,
                      backgroundColor: colors.surface,
                      borderWidth: 2,
                      borderColor: colors.border,
                      borderRadius: 8,
                      padding: 12,
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                    onPress={handleStartEdit}
                  >
                    <Text style={{ fontSize: 14, fontWeight: '500', color: colors.textTertiary }}>
                      编辑
                    </Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity
                    style={{
                      flex: 1,
                      backgroundColor: colors.error,
                      borderRadius: 8,
                      padding: 12,
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                    onPress={handleDeleteLog}
                  >
                    <Text style={{ fontSize: 14, fontWeight: '500', color: colors.surface }}>
                      删除
                    </Text>
                  </TouchableOpacity>
                  
                  {selectedLog.status === 'draft' && (
                    <TouchableOpacity
                      style={{
                        flex: 1,
                        backgroundColor: colors.primary,
                        borderRadius: 8,
                        padding: 12,
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                      onPress={handleSubmitLog}
                    >
                      <Text style={{ fontSize: 14, fontWeight: '500', color: colors.surface }}>
                        提交
                      </Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            )}
          </View>
        )}

        {/* 日志列表 */}
        <View>
          <Text style={{ fontSize: 18, fontWeight: '600', color: colors.textPrimary, marginBottom: 12 }}>
            日志列表 ({filteredLogs.length} 篇)
          </Text>
          
          {filteredLogs.map(log => (
            <TouchableOpacity
              key={log.id}
              style={[
                {
                  backgroundColor: colors.surface,
                  borderRadius: 12,
                  padding: 16,
                  marginBottom: 12,
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.06,
                  shadowRadius: 3.84,
                  elevation: 2
                },
                selectedLog?.id === log.id && {
                  borderWidth: 2,
                  borderColor: colors.primary,
                  backgroundColor: colors.primaryLight
                }
              ]}
              onPress={() => handleSelectLog(log)}
            >
              <View style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                marginBottom: 8
              }}>
                <Text style={[
                  {
                    fontSize: 16,
                    fontWeight: '600',
                    color: colors.textPrimary,
                    flex: 1
                  },
                  selectedLog?.id === log.id && {
                    color: colors.primaryDark
                  }
                ]}>
                  {log.title}
                </Text>
                <View style={[
                  {
                    paddingHorizontal: 10,
                    paddingVertical: 4,
                    borderRadius: 12,
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginLeft: 8
                  },
                  getStatusStyle(log.status)
                ]}>
                  <Text style={[
                    {
                      fontSize: 12,
                      fontWeight: '500'
                    },
                    { color: getStatusStyle(log.status).color }
                  ]}>
                    {getStatusText(log.status)}
                  </Text>
                </View>
              </View>
              
              <Text style={{ fontSize: 14, color: colors.textTertiary, marginBottom: 8 }}>
                {log.date}
              </Text>
              
              <Text style={{ fontSize: 14, color: colors.textDisabled, lineHeight: 20 }} numberOfLines={2}>
                {log.content}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
      )}
    </View>
  );
};

export default InternLogScreen;