

import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, Modal, Alert, Image, } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { FontAwesome6 } from '@expo/vector-icons';
import styles from './styles';

interface GroupData {
  id: string;
  name: string;
  description: string;
  memberCount: string;
  fileCount: string;
  discussionCount: string;
  avatarColor: string;
  avatarIcon: string;
  iconColor: string;
  lastActivity: string;
  latestUpdate: string;
  updateTime: string;
}

interface MemberData {
  id: string;
  name: string;
  title: string;
  avatar: string;
  status: 'online' | 'offline';
}

interface FileData {
  id: string;
  name: string;
  author: string;
  uploadTime: string;
  fileType: 'pdf' | 'excel' | 'image';
}

interface DiscussionData {
  id: string;
  author: string;
  avatar: string;
  content: string;
  time: string;
  borderColor: string;
}

const ResearchCollabScreen = () => {
  const router = useRouter();
  
  // 页面状态
  const [isShowingGroupDetail, setIsShowingGroupDetail] = useState(false);
  const [selectedGroupId, setSelectedGroupId] = useState<string>('');
  
  // 模态框状态
  const [isCreateGroupModalVisible, setIsCreateGroupModalVisible] = useState(false);
  const [isInviteMemberModalVisible, setIsInviteMemberModalVisible] = useState(false);
  
  // 表单状态
  const [groupNameInput, setGroupNameInput] = useState('');
  const [groupDescriptionInput, setGroupDescriptionInput] = useState('');
  const [memberEmailInput, setMemberEmailInput] = useState('');
  const [inviteMessageInput, setInviteMessageInput] = useState('您好，我想邀请您加入我们的科研协作群组。');
  const [messageInput, setMessageInput] = useState('');
  
  // 模拟数据
  const groupsData: GroupData[] = [
    {
      id: 'group-001',
      name: '禽流感研究协作组',
      description: '专注于禽流感病毒的研究与防控技术开发',
      memberCount: '5名成员',
      fileCount: '12个文件',
      discussionCount: '8条讨论',
      avatarColor: '#DBEAFE',
      avatarIcon: 'flask',
      iconColor: '#2563EB',
      lastActivity: '今日活跃',
      latestUpdate: '张教授上传了新的病例标注',
      updateTime: '2小时前',
    },
    {
      id: 'group-002',
      name: '新城疫数据分析组',
      description: '新城疫流行病学数据收集与分析研究',
      memberCount: '3名成员',
      fileCount: '8个文件',
      discussionCount: '5条讨论',
      avatarColor: '#D1FAE5',
      avatarIcon: 'microscope',
      iconColor: '#059669',
      lastActivity: '3天前活跃',
      latestUpdate: '李博士分享了研究报告',
      updateTime: '3天前',
    },
    {
      id: 'group-003',
      name: '禽病AI模型优化',
      description: '基于深度学习的禽病诊断模型优化研究',
      memberCount: '7名成员',
      fileCount: '15个文件',
      discussionCount: '12条讨论',
      avatarColor: '#E9D5FF',
      avatarIcon: 'dna',
      iconColor: '#7C3AED',
      lastActivity: '1周前活跃',
      latestUpdate: '王研究员发起了讨论',
      updateTime: '1周前',
    },
  ];

  const membersData: MemberData[] = [
    {
      id: 'member-001',
      name: '张教授',
      title: '组长 · 农业大学',
      avatar: 'https://s.coze.cn/image/lTJX8vnFmLU/',
      status: 'online',
    },
    {
      id: 'member-002',
      name: '李博士',
      title: '成员 · 兽医研究所',
      avatar: 'https://s.coze.cn/image/ZmYswsTXLx8/',
      status: 'offline',
    },
    {
      id: 'member-003',
      name: '王研究员',
      title: '成员 · 动物疫病中心',
      avatar: 'https://s.coze.cn/image/r1cjVQbkTso/',
      status: 'online',
    },
  ];

  const filesData: FileData[] = [
    {
      id: 'file-001',
      name: '禽流感病毒检测方法.pdf',
      author: '张教授',
      uploadTime: '2小时前',
      fileType: 'pdf',
    },
    {
      id: 'file-002',
      name: '2024年第一季度病例数据.xlsx',
      author: '李博士',
      uploadTime: '1天前',
      fileType: 'excel',
    },
    {
      id: 'file-003',
      name: '典型病例图谱合集.zip',
      author: '王研究员',
      uploadTime: '3天前',
      fileType: 'image',
    },
  ];

  const discussionsData: DiscussionData[] = [
    {
      id: 'discussion-001',
      author: '张教授',
      avatar: 'https://s.coze.cn/image/Zgy2sXG4EP4/',
      content: '各位，我刚上传了最新的禽流感检测方法研究，大家可以看看有什么建议。',
      time: '2小时前',
      borderColor: '#3BCCA5',
    },
    {
      id: 'discussion-002',
      author: '李博士',
      avatar: 'https://s.coze.cn/image/8OmkcFrbE_E/',
      content: '很好的研究！我觉得可以增加一些实际案例的数据对比。',
      time: '1小时前',
      borderColor: '#60A5FA',
    },
    {
      id: 'discussion-003',
      author: '王研究员',
      avatar: 'https://s.coze.cn/image/yXglvRa-Vt8/',
      content: '同意李博士的建议，我这里有一些临床数据可以补充。',
      time: '30分钟前',
      borderColor: '#4ADE80',
    },
  ];

  const selectedGroupData = groupsData.find(group => group.id === selectedGroupId) || groupsData[0];

  const handleBackPress = () => {
    if (router.canGoBack()) {
      router.back();
    }
  };

  const handleCreateGroupPress = () => {
    setIsCreateGroupModalVisible(true);
  };

  const handleCancelCreateGroup = () => {
    setIsCreateGroupModalVisible(false);
    setGroupNameInput('');
    setGroupDescriptionInput('');
  };

  const handleConfirmCreateGroup = () => {
    if (groupNameInput.trim()) {
      console.log('创建群组:', { groupName: groupNameInput, groupDescription: groupDescriptionInput });
      setIsCreateGroupModalVisible(false);
      setGroupNameInput('');
      setGroupDescriptionInput('');
      Alert.alert('成功', '群组创建成功！');
    }
  };

  const handleGroupItemPress = (groupId: string) => {
    setSelectedGroupId(groupId);
    setIsShowingGroupDetail(true);
  };

  const handleBackToGroups = () => {
    setIsShowingGroupDetail(false);
    setSelectedGroupId('');
  };

  const handleInviteMemberPress = () => {
    setIsInviteMemberModalVisible(true);
  };

  const handleCancelInviteMember = () => {
    setIsInviteMemberModalVisible(false);
    setMemberEmailInput('');
    setInviteMessageInput('您好，我想邀请您加入我们的科研协作群组。');
  };

  const handleConfirmInviteMember = () => {
    if (memberEmailInput.trim()) {
      console.log('发送邀请:', { memberEmail: memberEmailInput, inviteMessage: inviteMessageInput });
      setIsInviteMemberModalVisible(false);
      setMemberEmailInput('');
      setInviteMessageInput('您好，我想邀请您加入我们的科研协作群组。');
      Alert.alert('成功', '邀请已发送！');
    }
  };

  const handleUploadFilePress = () => {
    console.log('需要调用第三方接口实现文件上传功能');
    Alert.alert('提示', '文件上传功能需要调用第三方接口实现');
  };

  const handleSendMessagePress = () => {
    if (messageInput.trim()) {
      console.log('发送消息:', messageInput);
      setMessageInput('');
      Alert.alert('成功', '消息发送成功！');
    }
  };

  const handleDownloadFile = (fileId: string) => {
    console.log('下载文件:', fileId);
    Alert.alert('提示', '文件下载功能需要调用第三方接口实现');
  };

  const getFileIcon = (fileType: string) => {
    switch (fileType) {
      case 'pdf':
        return { name: 'file-pdf', color: '#DC2626' };
      case 'excel':
        return { name: 'file-excel', color: '#059669' };
      case 'image':
        return { name: 'file-image', color: '#059669' };
      default:
        return { name: 'file', color: '#6B7280' };
    }
  };

  const renderGroupItem = (group: GroupData) => (
    <TouchableOpacity
      key={group.id}
      style={styles.groupItem}
      onPress={() => handleGroupItemPress(group.id)}
      activeOpacity={0.7}
    >
      <View style={styles.groupItemContent}>
        <View style={styles.groupItemLeft}>
          <View style={[styles.groupAvatar, { backgroundColor: group.avatarColor }]}>
            <FontAwesome6 name={group.avatarIcon} size={20} color={group.iconColor} />
          </View>
          <View style={styles.groupInfo}>
            <Text style={styles.groupName}>{group.name}</Text>
            <Text style={styles.groupMembers}>{group.memberCount} · {group.lastActivity}</Text>
            <Text style={styles.groupLatestUpdate}>最新：{group.latestUpdate}</Text>
          </View>
        </View>
        <View style={styles.groupItemRight}>
          <Text style={styles.groupUpdateTime}>{group.updateTime}</Text>
          <FontAwesome6 name="chevron-right" size={14} color="#6B7280" />
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderMemberItem = (member: MemberData) => (
    <View key={member.id} style={styles.memberItem}>
      <View style={styles.memberLeft}>
        <Image source={{ uri: member.avatar }} style={styles.memberAvatar} />
        <View style={styles.memberInfo}>
          <Text style={styles.memberName}>{member.name}</Text>
          <Text style={styles.memberTitle}>{member.title}</Text>
        </View>
      </View>
      <View style={[
        styles.memberStatus,
        { backgroundColor: member.status === 'online' ? '#D3F8EE' : '#F3F4F6' }
      ]}>
        <Text style={[
          styles.memberStatusText,
          { color: member.status === 'online' ? '#3BCCA5' : '#6B7280' }
        ]}>
          {member.status === 'online' ? '在线' : '离线'}
        </Text>
      </View>
    </View>
  );

  const renderFileItem = (file: FileData) => {
    const fileIcon = getFileIcon(file.fileType);
    
    return (
      <View key={file.id} style={styles.fileItem}>
        <View style={styles.fileLeft}>
          <View style={[styles.fileIcon, { backgroundColor: `${fileIcon.color}20` }]}>
            <FontAwesome6 name={fileIcon.name} size={16} color={fileIcon.color} />
          </View>
          <View style={styles.fileInfo}>
            <Text style={styles.fileName}>{file.name}</Text>
            <Text style={styles.fileAuthor}>{file.author} · {file.uploadTime}</Text>
          </View>
        </View>
        <TouchableOpacity onPress={() => handleDownloadFile(file.id)}>
          <FontAwesome6 name="download" size={16} color="#3BCCA5" />
        </TouchableOpacity>
      </View>
    );
  };

  const renderDiscussionItem = (discussion: DiscussionData) => (
    <View key={discussion.id} style={styles.discussionItem}>
      <View style={[styles.discussionBorder, { backgroundColor: discussion.borderColor }]} />
      <View style={styles.discussionContent}>
        <View style={styles.discussionHeader}>
          <Image source={{ uri: discussion.avatar }} style={styles.discussionAvatar} />
          <Text style={styles.discussionAuthor}>{discussion.author}</Text>
          <Text style={styles.discussionTime}>{discussion.time}</Text>
        </View>
        <Text style={styles.discussionText}>{discussion.content}</Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* 顶部导航栏 */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity style={styles.backButton} onPress={handleBackPress}>
            <FontAwesome6 name="arrow-left" size={20} color="#6B7280" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>科研协作</Text>
        </View>
        <TouchableOpacity style={styles.createButton} onPress={handleCreateGroupPress}>
          <FontAwesome6 name="plus" size={12} color="#FFFFFF" />
          <Text style={styles.createButtonText}>创建群组</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {!isShowingGroupDetail ? (
          /* 群组列表 */
          <View style={styles.groupsSection}>
            <Text style={styles.sectionTitle}>我的科研群组</Text>
            <View style={styles.groupsList}>
              {groupsData.map(renderGroupItem)}
            </View>
          </View>
        ) : (
          /* 群组详情 */
          <View style={styles.groupDetailSection}>
            <View style={styles.groupDetailHeader}>
              <TouchableOpacity style={styles.backButton} onPress={handleBackToGroups}>
                <FontAwesome6 name="arrow-left" size={20} color="#6B7280" />
              </TouchableOpacity>
              <Text style={styles.sectionTitle}>群组详情</Text>
              <TouchableOpacity style={styles.settingsButton}>
                <FontAwesome6 name="gear" size={20} color="#6B7280" />
              </TouchableOpacity>
            </View>

            {/* 群组信息 */}
            <View style={styles.groupInfoCard}>
              <View style={styles.groupInfoHeader}>
                <View style={[styles.groupDetailAvatar, { backgroundColor: selectedGroupData.avatarColor }]}>
                  <FontAwesome6 name={selectedGroupData.avatarIcon} size={24} color={selectedGroupData.iconColor} />
                </View>
                <View style={styles.groupDetailInfo}>
                  <Text style={styles.groupDetailName}>{selectedGroupData.name}</Text>
                  <Text style={styles.groupDetailDescription}>{selectedGroupData.description}</Text>
                </View>
              </View>
              <View style={styles.groupStats}>
                <View style={styles.groupStat}>
                  <FontAwesome6 name="users" size={12} color="#6B7280" />
                  <Text style={styles.groupStatText}>{selectedGroupData.memberCount}</Text>
                </View>
                <View style={styles.groupStat}>
                  <FontAwesome6 name="file-lines" size={12} color="#6B7280" />
                  <Text style={styles.groupStatText}>{selectedGroupData.fileCount}</Text>
                </View>
                <View style={styles.groupStat}>
                  <FontAwesome6 name="comments" size={12} color="#6B7280" />
                  <Text style={styles.groupStatText}>{selectedGroupData.discussionCount}</Text>
                </View>
              </View>
            </View>

            {/* 成员列表 */}
            <View style={styles.membersSection}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>成员</Text>
                <TouchableOpacity onPress={handleInviteMemberPress}>
                  <View style={styles.inviteButton}>
                    <FontAwesome6 name="user-plus" size={12} color="#3BCCA5" />
                    <Text style={styles.inviteButtonText}>邀请成员</Text>
                  </View>
                </TouchableOpacity>
              </View>
              <View style={styles.membersList}>
                {membersData.map(renderMemberItem)}
              </View>
            </View>

            {/* 共享文件 */}
            <View style={styles.filesSection}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>共享文件</Text>
                <TouchableOpacity onPress={handleUploadFilePress}>
                  <View style={styles.uploadButton}>
                    <FontAwesome6 name="upload" size={12} color="#3BCCA5" />
                    <Text style={styles.uploadButtonText}>上传文件</Text>
                  </View>
                </TouchableOpacity>
              </View>
              <View style={styles.filesList}>
                {filesData.map(renderFileItem)}
              </View>
            </View>

            {/* 讨论区 */}
            <View style={styles.discussionsSection}>
              <Text style={styles.sectionTitle}>讨论</Text>
              <View style={styles.discussionsList}>
                {discussionsData.map(renderDiscussionItem)}
              </View>

              {/* 发送消息 */}
              <View style={styles.sendMessageCard}>
                <View style={styles.sendMessageContent}>
                  <Image 
                    source={{ uri: 'https://s.coze.cn/image/vlduHoL792I/' }} 
                    style={styles.sendMessageAvatar} 
                  />
                  <View style={styles.sendMessageInputWrapper}>
                    <TextInput
                      style={styles.sendMessageInput}
                      placeholder="输入讨论内容..."
                      value={messageInput}
                      onChangeText={setMessageInput}
                      multiline
                    />
                    <TouchableOpacity 
                      style={styles.sendMessageButton} 
                      onPress={handleSendMessagePress}
                    >
                      <FontAwesome6 name="paper-plane" size={14} color="#FFFFFF" />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </View>
          </View>
        )}
      </ScrollView>

      {/* 创建群组弹窗 */}
      <Modal
        visible={isCreateGroupModalVisible}
        transparent
        animationType="slide"
        onRequestClose={handleCancelCreateGroup}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>创建科研群组</Text>
            </View>
            <View style={styles.modalForm}>
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>群组名称</Text>
                <TextInput
                  style={styles.formInput}
                  placeholder="请输入群组名称"
                  value={groupNameInput}
                  onChangeText={setGroupNameInput}
                />
              </View>
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>群组描述</Text>
                <TextInput
                  style={[styles.formInput, styles.formTextArea]}
                  placeholder="请输入群组描述"
                  value={groupDescriptionInput}
                  onChangeText={setGroupDescriptionInput}
                  multiline
                  numberOfLines={3}
                />
              </View>
              <View style={styles.modalButtons}>
                <TouchableOpacity 
                  style={styles.modalCancelButton} 
                  onPress={handleCancelCreateGroup}
                >
                  <Text style={styles.modalCancelButtonText}>取消</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={styles.modalConfirmButton} 
                  onPress={handleConfirmCreateGroup}
                >
                  <Text style={styles.modalConfirmButtonText}>创建</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </Modal>

      {/* 邀请成员弹窗 */}
      <Modal
        visible={isInviteMemberModalVisible}
        transparent
        animationType="slide"
        onRequestClose={handleCancelInviteMember}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>邀请成员</Text>
            </View>
            <View style={styles.modalForm}>
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>邮箱地址</Text>
                <TextInput
                  style={styles.formInput}
                  placeholder="请输入成员邮箱"
                  value={memberEmailInput}
                  onChangeText={setMemberEmailInput}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>邀请信息</Text>
                <TextInput
                  style={[styles.formInput, styles.formTextArea]}
                  placeholder="请输入邀请信息"
                  value={inviteMessageInput}
                  onChangeText={setInviteMessageInput}
                  multiline
                  numberOfLines={2}
                />
              </View>
              <View style={styles.modalButtons}>
                <TouchableOpacity 
                  style={styles.modalCancelButton} 
                  onPress={handleCancelInviteMember}
                >
                  <Text style={styles.modalCancelButtonText}>取消</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={styles.modalConfirmButton} 
                  onPress={handleConfirmInviteMember}
                >
                  <Text style={styles.modalConfirmButtonText}>发送邀请</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default ResearchCollabScreen;

