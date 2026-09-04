import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, TextInput, Alert, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import Header from '../components/Header';
import { styles } from '../styles';
import { epidemicApi } from '../services/api';

const PolicyPublishScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);
  const [publishing, setPublishing] = useState(false);

  const roleOptions = [
    { value: 'FARMER', label: '养殖户', icon: 'leaf' as const },
    { value: 'INSTITUTION', label: '机构用户', icon: 'business' as const },
    { value: 'STUDENT', label: '学生', icon: 'school' as const },
    { value: 'TEACHER', label: '教师', icon: 'people' as const },
  ];

  const toggleRole = (role: string) => {
    setSelectedRoles(prev =>
      prev.includes(role) ? prev.filter(r => r !== role) : [...prev, role]
    );
  };

  const handlePublish = async () => {
    if (!title.trim()) {
      Alert.alert('提示', '请输入政策标题');
      return;
    }
    if (!content.trim()) {
      Alert.alert('提示', '请输入政策内容');
      return;
    }

    setPublishing(true);
    try {
      const response = await epidemicApi.publishPolicy({
        title: title.trim(),
        content: content.trim(),
        targetRoles: selectedRoles.length > 0 ? selectedRoles : undefined,
      });
      const recipientCount = response.data?.recipientCount || 0;
      Alert.alert('发布成功', `政策通知已发送给 ${recipientCount} 位用户`);
      navigation.goBack();
    } catch (err) {
      Alert.alert('错误', '政策发布失败，请重试');
    } finally {
      setPublishing(false);
    }
  };

  return (
    <View style={styles.container}>
      <Header title="政策下发" showBackButton onBack={() => navigation.goBack()} />

      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 100 }}>
        {/* 标题输入 */}
        <View style={{ marginBottom: 16 }}>
          <Text style={{ fontSize: 14, fontWeight: '600', color: '#111827', marginBottom: 8 }}>
            政策标题
          </Text>
          <TextInput
            style={{
              backgroundColor: '#FFFFFF',
              borderWidth: 1,
              borderColor: '#E5E7EB',
              borderRadius: 8,
              padding: 12,
              fontSize: 16,
              color: '#111827',
            }}
            placeholder="请输入政策标题"
            placeholderTextColor="#9CA3AF"
            value={title}
            onChangeText={setTitle}
          />
        </View>

        {/* 内容输入 */}
        <View style={{ marginBottom: 16 }}>
          <Text style={{ fontSize: 14, fontWeight: '600', color: '#111827', marginBottom: 8 }}>
            政策内容
          </Text>
          <TextInput
            style={{
              backgroundColor: '#FFFFFF',
              borderWidth: 1,
              borderColor: '#E5E7EB',
              borderRadius: 8,
              padding: 12,
              fontSize: 14,
              color: '#4B5563',
              minHeight: 200,
              textAlignVertical: 'top',
            }}
            placeholder="请输入政策详细内容..."
            placeholderTextColor="#9CA3AF"
            value={content}
            onChangeText={setContent}
            multiline
          />
        </View>

        {/* 目标角色选择 */}
        <View style={{ marginBottom: 16 }}>
          <Text style={{ fontSize: 14, fontWeight: '600', color: '#111827', marginBottom: 8 }}>
            推送对象（不选则全员）
          </Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
            {roleOptions.map(role => (
              <TouchableOpacity
                key={role.value}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  backgroundColor: selectedRoles.includes(role.value) ? '#2DBBA1' : '#FFFFFF',
                  borderWidth: 1,
                  borderColor: selectedRoles.includes(role.value) ? '#2DBBA1' : '#E5E7EB',
                  borderRadius: 20,
                  paddingHorizontal: 14,
                  paddingVertical: 8,
                  gap: 6,
                }}
                onPress={() => toggleRole(role.value)}
              >
                <Ionicons name={role.icon} size={14} color={selectedRoles.includes(role.value) ? '#FFFFFF' : '#6B7280'} />
                <Text style={{
                  fontSize: 13,
                  fontWeight: '500',
                  color: selectedRoles.includes(role.value) ? '#FFFFFF' : '#6B7280',
                }}>
                  {role.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* 预览 */}
        {(title || content) && (
          <View style={{
            backgroundColor: '#F0FDF4',
            borderRadius: 12,
            padding: 16,
            marginBottom: 16,
            borderWidth: 1,
            borderColor: '#BBF7D0',
          }}>
            <Text style={{ fontSize: 12, fontWeight: '600', color: '#15803D', marginBottom: 8 }}>
              预览效果
            </Text>
            <Text style={{ fontSize: 16, fontWeight: '600', color: '#111827', marginBottom: 4 }}>
              [政策通知] {title || '政策标题'}
            </Text>
            <Text style={{ fontSize: 14, color: '#4B5563', lineHeight: 22 }}>
              {content || '政策内容预览...'}
            </Text>
          </View>
        )}
      </ScrollView>

      {/* 发布按钮 */}
      <View style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: '#FFFFFF',
        padding: 16,
        borderTopWidth: 1,
        borderTopColor: '#E5E7EB',
      }}>
        <TouchableOpacity
          style={{
            backgroundColor: '#2DBBA1',
            borderRadius: 12,
            padding: 16,
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'row',
            gap: 8,
          }}
          onPress={handlePublish}
          disabled={publishing}
        >
          {publishing ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <Ionicons name="paper-plane" size={18} color="#FFFFFF" />
          )}
          <Text style={{ fontSize: 16, fontWeight: '600', color: '#FFFFFF' }}>
            {publishing ? '发布中...' : '发布政策通知'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default PolicyPublishScreen;
