import { colors } from '../theme';
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Header from '../components/Header';
import { useAuth } from '../context/UserContext';
import { authApi } from '../services/api';
import { styles } from '../styles';

const EditProfileScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const { state, updateUser } = useAuth();
  const user = state.user;

  const [nickname, setNickname] = useState(user?.nickname || '');
  const [avatar, setAvatar] = useState(user?.avatar || '');
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!nickname.trim()) {
      Alert.alert('提示', '昵称不能为空');
      return;
    }
    setSaving(true);
    try {
      await authApi.updateUser({ nickname: nickname.trim(), avatar: avatar.trim() });
      updateUser({ nickname: nickname.trim(), avatar: avatar.trim() });
      Alert.alert('成功', '个人信息已更新', [
        { text: '确定', onPress: () => navigation.goBack() }
      ]);
    } catch (error) {
      Alert.alert('错误', '更新失败，请稍后重试');
    } finally {
      setSaving(false);
    }
  };

  return (
    <View style={styles.container}>
      <Header title="编辑个人信息" />
      <ScrollView contentContainerStyle={[styles.scrollContent, { paddingBottom: 100 }]}>
        <View style={styles.profileEditSection}>
          <Text style={styles.profileEditLabel}>昵称</Text>
          <TextInput
            style={styles.profileEditInput}
            value={nickname}
            onChangeText={setNickname}
            placeholder="请输入昵称"
            maxLength={20}
          />
        </View>
        <View style={styles.profileEditSection}>
          <Text style={styles.profileEditLabel}>头像URL</Text>
          <TextInput
            style={[styles.profileEditInput, { height: 80 }]}
            value={avatar}
            onChangeText={setAvatar}
            placeholder="请输入头像图片地址"
            multiline
          />
        </View>
        <View style={styles.profileEditInfoCard}>
          <Text style={styles.profileEditInfoText}>
            手机号：{user?.phoneNumber || '未知'}（不可修改）
          </Text>
          <Text style={styles.profileEditInfoText}>
            角色：{user?.roleType === 'FARMER' ? '养殖户' :
              user?.roleType === 'INSTITUTION' ? '机构' :
              user?.roleType === 'STUDENT' ? '学生' :
              user?.roleType === 'TEACHER' ? '教师' : '未知'}
          </Text>
        </View>
      </ScrollView>
      <View style={styles.profileEditBottomButtonContainer}>
        <TouchableOpacity
          style={[styles.profileEditSaveButton, saving && styles.profileEditSaveButtonDisabled]}
          onPress={handleSave}
          disabled={saving}
        >
          {saving ? (
            <ActivityIndicator color={colors.surface} />
          ) : (
            <Text style={styles.profileEditSaveButtonText}>保存</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default EditProfileScreen;
