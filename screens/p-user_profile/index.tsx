

import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { FontAwesome6 } from '@expo/vector-icons';
import styles from './styles';

const UserProfileScreen = () => {
  const router = useRouter();
  const [isLogoutModalVisible, setIsLogoutModalVisible] = useState(false);

  const handleSettingsPress = () => {
    router.push('/p-settings');
  };

  const handleUserAvatarPress = () => {
    console.log('需要调用第三方接口实现头像上传功能');
    // 注释：此功能需要调用设备相机或相册API，在原型阶段仅做UI展示
  };

  const handleMyDiagnosisPress = () => {
    console.log('查看诊断历史记录');
    // 注释：此功能需要跳转到诊断历史页面，暂未在PRD中明确定义
  };

  const handleMyOrdersPress = () => {
    console.log('查看历史订单');
    // 注释：此功能需要跳转到订单历史页面，暂未在PRD中明确定义
  };

  const handleMyFavoritesPress = () => {
    console.log('查看收藏内容');
    // 注释：此功能需要跳转到收藏页面，暂未在PRD中明确定义
  };

  const handleAccountSecurityPress = () => {
    console.log('跳转到账户安全设置');
    // 注释：此功能需要跳转到账户安全设置页面，暂未在PRD中明确定义
  };

  const handlePrivacySettingsPress = () => {
    console.log('跳转到隐私设置');
    // 注释：此功能需要跳转到隐私设置页面，暂未在PRD中明确定义
  };

  const handleHelpCenterPress = () => {
    console.log('跳转到帮助中心');
    // 注释：此功能需要跳转到帮助中心页面，暂未在PRD中明确定义
  };

  const handleFeedbackPress = () => {
    console.log('跳转到意见反馈');
    // 注释：此功能需要跳转到意见反馈页面，暂未在PRD中明确定义
  };

  const handleAboutUsPress = () => {
    console.log('跳转到关于我们');
    // 注释：此功能需要跳转到关于我们页面，暂未在PRD中明确定义
  };

  const handleLogoutPress = () => {
    setIsLogoutModalVisible(true);
  };

  const handleCancelLogout = () => {
    setIsLogoutModalVisible(false);
  };

  const handleConfirmLogout = () => {
    setIsLogoutModalVisible(false);
    router.replace('/p-login_register');
  };

  const handleModalOverlayPress = () => {
    setIsLogoutModalVisible(false);
  };

  const renderFunctionItem = (
    icon: string,
    iconColor: string,
    iconBgColor: string,
    title: string,
    subtitle: string,
    onPress: () => void
  ) => (
    <TouchableOpacity style={styles.functionItem} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.functionItemContent}>
        <View style={[styles.functionIconContainer, { backgroundColor: iconBgColor }]}>
          <FontAwesome6 name={icon} style={[styles.functionIcon, { color: iconColor }]} />
        </View>
        <View style={styles.functionTextContainer}>
          <Text style={styles.functionTitle}>{title}</Text>
          <Text style={styles.functionSubtitle}>{subtitle}</Text>
        </View>
      </View>
      <FontAwesome6 name="chevron-right" style={styles.chevronIcon} />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* 顶部导航栏 */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>个人中心</Text>
        <TouchableOpacity style={styles.settingsButton} onPress={handleSettingsPress}>
          <FontAwesome6 name="gear" style={styles.settingsIcon} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* 用户信息卡片 */}
        <View style={styles.userInfoSection}>
          <View style={styles.userInfoCard}>
            <View style={styles.userInfoContent}>
              <TouchableOpacity style={styles.userAvatarButton} onPress={handleUserAvatarPress}>
                <Image
                  source={{ uri: 'https://s.coze.cn/image/ehTECo6q3oY/' }}
                  style={styles.userAvatar}
                />
                <View style={styles.cameraIconContainer}>
                  <FontAwesome6 name="camera" style={styles.cameraIcon} />
                </View>
              </TouchableOpacity>
              <View style={styles.userDetails}>
                <Text style={styles.userNickname}>王养殖户</Text>
                <Text style={styles.userRole}>小散户</Text>
                <View style={styles.userStats}>
                  <View style={styles.statItem}>
                    <Text style={styles.statValue}>12</Text>
                    <Text style={styles.statLabel}>诊断次数</Text>
                  </View>
                  <View style={styles.statItem}>
                    <Text style={styles.statValue}>89</Text>
                    <Text style={styles.statLabel}>连续登录</Text>
                  </View>
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* 功能列表 */}
        <View style={styles.functionList}>
          {/* 我的服务 */}
          <View style={styles.functionGroup}>
            <Text style={styles.groupTitle}>我的服务</Text>
            <View style={styles.groupContent}>
              {renderFunctionItem(
                'stethoscope',
                '#3BCCA5',
                'rgba(59, 204, 165, 0.1)',
                '我的诊断',
                '查看诊断历史记录',
                handleMyDiagnosisPress
              )}
              <View style={styles.functionDivider} />
              {renderFunctionItem(
                'bag-shopping',
                '#2563EB',
                'rgba(37, 99, 235, 0.1)',
                '我的订单',
                '查看历史订单',
                handleMyOrdersPress
              )}
              <View style={styles.functionDivider} />
              {renderFunctionItem(
                'star',
                '#D97706',
                'rgba(217, 119, 6, 0.1)',
                '我的收藏',
                '收藏的内容',
                handleMyFavoritesPress
              )}
            </View>
          </View>

          {/* 账户管理 */}
          <View style={styles.functionGroup}>
            <Text style={styles.groupTitle}>账户管理</Text>
            <View style={styles.groupContent}>
              {renderFunctionItem(
                'shield-halved',
                '#7C3AED',
                'rgba(124, 58, 237, 0.1)',
                '账户安全',
                '密码、手机号等',
                handleAccountSecurityPress
              )}
              <View style={styles.functionDivider} />
              {renderFunctionItem(
                'user-secret',
                '#059669',
                'rgba(5, 150, 105, 0.1)',
                '隐私设置',
                '数据隐私管理',
                handlePrivacySettingsPress
              )}
            </View>
          </View>

          {/* 帮助与反馈 */}
          <View style={styles.functionGroup}>
            <Text style={styles.groupTitle}>帮助与反馈</Text>
            <View style={styles.groupContent}>
              {renderFunctionItem(
                'circle-question',
                '#EA580C',
                'rgba(234, 88, 12, 0.1)',
                '帮助中心',
                '常见问题解答',
                handleHelpCenterPress
              )}
              <View style={styles.functionDivider} />
              {renderFunctionItem(
                'comment-dots',
                '#DC2626',
                'rgba(220, 38, 38, 0.1)',
                '意见反馈',
                '告诉我们您的建议',
                handleFeedbackPress
              )}
              <View style={styles.functionDivider} />
              {renderFunctionItem(
                'circle-info',
                '#4F46E5',
                'rgba(79, 70, 229, 0.1)',
                '关于我们',
                '了解禽康智检',
                handleAboutUsPress
              )}
            </View>
          </View>

          {/* 退出登录 */}
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogoutPress} activeOpacity={0.7}>
            <View style={styles.logoutContent}>
              <FontAwesome6 name="right-from-bracket" style={styles.logoutIcon} />
              <Text style={styles.logoutText}>退出登录</Text>
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* 退出登录确认弹窗 */}
      <Modal
        visible={isLogoutModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={handleCancelLogout}
      >
        <TouchableOpacity 
          style={styles.modalOverlay} 
          activeOpacity={1} 
          onPress={handleModalOverlayPress}
        >
          <View style={styles.modalContainer}>
            <TouchableOpacity activeOpacity={1} style={styles.modalContent}>
              <View style={styles.modalIconContainer}>
                <FontAwesome6 name="right-from-bracket" style={styles.modalIcon} />
              </View>
              <Text style={styles.modalTitle}>确认退出登录</Text>
              <Text style={styles.modalSubtitle}>退出后需要重新登录才能使用</Text>
              <View style={styles.modalButtons}>
                <TouchableOpacity 
                  style={styles.cancelButton} 
                  onPress={handleCancelLogout}
                  activeOpacity={0.7}
                >
                  <Text style={styles.cancelButtonText}>取消</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={styles.confirmButton} 
                  onPress={handleConfirmLogout}
                  activeOpacity={0.7}
                >
                  <Text style={styles.confirmButtonText}>确认退出</Text>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  );
};

export default UserProfileScreen;

