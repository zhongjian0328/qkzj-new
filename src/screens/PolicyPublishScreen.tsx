import { colors } from '../theme';
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
          <Text style={{ fontSize: 14, fontWeight: '600', color: colors.textPrimary, marginBottom: 8 }}>
            政策标题
          </Text>
          <TextInput
            style={{
              backgroundColor: colors.surface,
              borderWidth: 1,
              borderColor: colors.border,
              borderRadius: 8,
              padding: 12,
              fontSize: 16,
              color: colors.textPrimary,
            }}
            placeholder="请输入政策标题"
            placeholderTextColor={colors.textDisabled}
            value={title}
            onChangeText={setTitle}
          />
        </View>

        {/* 内容输入 */}
        <View style={{ marginBottom: 16 }}>
          <Text style={{ fontSize: 14, fontWeight: '600', color: colors.textPrimary, marginBottom: 8 }}>
            政策内容
          </Text>
          <TextInput
            style={{
              backgroundColor: colors.surface,
              borderWidth: 1,
              borderColor: colors.border,
              borderRadius: 8,
              padding: 12,
              fontSize: 14,
              color: colors.textSecondary,
              minHeight: 200,
              textAlignVertical: 'top',
            }}
            placeholder="请输入政策详细内容..."
            placeholderTextColor={colors.textDisabled}
            value={content}
            onChangeText={setContent}
            multiline
          />
        </View>

        {/* 目标角色选择 */}
        <View style={{ marginBottom: 16 }}>
          <Text style={{ fontSize: 14, fontWeight: '600', color: colors.textPrimary, marginBottom: 8 }}>
            推送对象（不选则全员）
          </Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
            {roleOptions.map(role => (
              <TouchableOpacity
                key={role.value}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  backgroundColor: selectedRoles.includes(role.value) ? colors.primary : colors.surface,
                  borderWidth: 1,
                  borderColor: selectedRoles.includes(role.value) ? colors.primary : colors.border,
                  borderRadius: 20,
                  paddingHorizontal: 14,
                  paddingVertical: 8,
                  gap: 6,
                }}
                onPress={() => toggleRole(role.value)}
              >
                <Ionicons name={role.icon} size={14} color={selectedRoles.includes(role.value) ? colors.surface : colors.textTertiary} />
                <Text style={{
                  fontSize: 13,
                  fontWeight: '500',
                  color: selectedRoles.includes(role.value) ? colors.surface : colors.textTertiary,
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
            backgroundColor: colors.successLight,
            borderRadius: 12,
            padding: 16,
            marginBottom: 16,
            borderWidth: 1,
            borderColor: colors.successLight,
          }}>
            <Text style={{ fontSize: 12, fontWeight: '600', color: colors.successText, marginBottom: 8 }}>
              预览效果
            </Text>
            <Text style={{ fontSize: 16, fontWeight: '600', color: colors.textPrimary, marginBottom: 4 }}>
              [政策通知] {title || '政策标题'}
            </Text>
            <Text style={{ fontSize: 14, color: colors.textSecondary, lineHeight: 22 }}>
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
        backgroundColor: colors.surface,
        padding: 16,
        borderTopWidth: 1,
        borderTopColor: colors.border,
      }}>
        <TouchableOpacity
          style={{
            backgroundColor: colors.primary,
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
            <ActivityIndicator size="small" color={colors.surface} />
          ) : (
            <Ionicons name="paper-plane" size={18} color={colors.surface} />
          )}
          <Text style={{ fontSize: 16, fontWeight: '600', color: colors.surface }}>
            {publishing ? '发布中...' : '发布政策通知'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default PolicyPublishScreen;
