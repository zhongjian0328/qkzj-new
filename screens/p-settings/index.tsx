

import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Switch, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { FontAwesome5, FontAwesome6 } from '@expo/vector-icons';
import styles from './styles';

const SettingsScreen = () => {
  const router = useRouter();
  
  // 通知设置状态
  const [isPushNotificationEnabled, setIsPushNotificationEnabled] = useState(true);
  const [isDiagnosisResultEnabled, setIsDiagnosisResultEnabled] = useState(true);
  const [isSystemMessageEnabled, setIsSystemMessageEnabled] = useState(true);
  
  // 弹窗状态
  const [isClearCacheModalVisible, setIsClearCacheModalVisible] = useState(false);
  const [isSuccessToastVisible, setIsSuccessToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  
  // 缓存大小状态
  const [cacheSize, setCacheSize] = useState('128 MB');

  const handleBackPress = () => {
    if (router.canGoBack()) {
      router.back();
    }
  };

  const showToast = (message: string) => {
    setToastMessage(message);
    setIsSuccessToastVisible(true);
    setTimeout(() => {
      setIsSuccessToastVisible(false);
    }, 3000);
  };

  const handlePushNotificationToggle = (value: boolean) => {
    setIsPushNotificationEnabled(value);
    showToast(value ? '推送通知已开启' : '推送通知已关闭');
  };

  const handleDiagnosisResultToggle = (value: boolean) => {
    setIsDiagnosisResultEnabled(value);
    showToast(value ? '诊断结果通知已开启' : '诊断结果通知已关闭');
  };

  const handleSystemMessageToggle = (value: boolean) => {
    setIsSystemMessageEnabled(value);
    showToast(value ? '系统消息已开启' : '系统消息已关闭');
  };

  const handlePrivacySettingsPress = () => {
    showToast('隐私设置功能开发中');
  };

  const handleAccountSecurityPress = () => {
    showToast('账户安全功能开发中');
  };

  const handleClearCachePress = () => {
    setIsClearCacheModalVisible(true);
  };

  const handleCancelClearCache = () => {
    setIsClearCacheModalVisible(false);
  };

  const handleConfirmClearCache = () => {
    setIsClearCacheModalVisible(false);
    setTimeout(() => {
      setCacheSize('0 MB');
      showToast('缓存已清除');
    }, 1000);
  };

  const handleAboutUsPress = () => {
    showToast('关于我们功能开发中');
  };

  const handleVersionInfoPress = () => {
    showToast('当前已是最新版本');
  };

  const handleCheckUpdatePress = () => {
    showToast('正在检查更新...');
    setTimeout(() => {
      showToast('当前已是最新版本');
    }, 2000);
  };

  const renderSettingItem = (
    icon: string,
    iconColor: string,
    iconBgColor: string,
    title: string,
    subtitle: string,
    rightComponent: React.ReactNode,
    onPress?: () => void
  ) => (
    <TouchableOpacity
      style={styles.settingItem}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.settingItemLeft}>
        <View style={[styles.iconContainer, { backgroundColor: iconBgColor }]}>
          <FontAwesome6 name={icon} size={16} color={iconColor} />
        </View>
        <View style={styles.settingItemText}>
          <Text style={styles.settingItemTitle}>{title}</Text>
          <Text style={styles.settingItemSubtitle}>{subtitle}</Text>
        </View>
      </View>
      {rightComponent}
    </TouchableOpacity>
  );

  const renderToggleSwitch = (value: boolean, onValueChange: (value: boolean) => void) => (
    <Switch
      value={value}
      onValueChange={onValueChange}
      trackColor={{ false: '#ccc', true: '#3BCCA5' }}
      thumbColor={'#ffffff'}
    />
  );

  const renderChevronIcon = () => (
    <FontAwesome6 name="chevron-right" size={14} color="#6B7280" />
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* 顶部导航栏 */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={handleBackPress}
          activeOpacity={0.7}
        >
          <FontAwesome6 name="arrow-left" size={20} color="#6B7280" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>设置</Text>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* 通知设置 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>通知设置</Text>
          <View style={styles.card}>
            {renderSettingItem(
              'bell',
              '#2563EB',
              '#DBEAFE',
              '推送通知',
              '接收诊断结果和系统消息',
              renderToggleSwitch(isPushNotificationEnabled, handlePushNotificationToggle)
            )}
            <View style={styles.separator} />
            {renderSettingItem(
              'stethoscope',
              '#059669',
              '#D1FAE5',
              '诊断结果通知',
              'AI诊断完成后通知',
              renderToggleSwitch(isDiagnosisResultEnabled, handleDiagnosisResultToggle)
            )}
            <View style={styles.separator} />
            {renderSettingItem(
              'envelope',
              '#7C3AED',
              '#EDE9FE',
              '系统消息',
              '接收系统更新和重要公告',
              renderToggleSwitch(isSystemMessageEnabled, handleSystemMessageToggle)
            )}
          </View>
        </View>

        {/* 隐私与安全 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>隐私与安全</Text>
          <View style={styles.card}>
            {renderSettingItem(
              'shield-alt',
              '#EA580C',
              '#FED7AA',
              '隐私设置',
              '管理个人信息和数据权限',
              renderChevronIcon(),
              handlePrivacySettingsPress
            )}
            <View style={styles.separator} />
            {renderSettingItem(
              'lock',
              '#DC2626',
              '#FEE2E2',
              '账户安全',
              '密码修改和安全验证',
              renderChevronIcon(),
              handleAccountSecurityPress
            )}
          </View>
        </View>

        {/* 存储与缓存 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>存储与缓存</Text>
          <View style={styles.card}>
            {renderSettingItem(
              'broom',
              '#CA8A04',
              '#FEF3C7',
              '清除缓存',
              '清理临时文件，释放存储空间',
              <Text style={styles.cacheSize}>{cacheSize}</Text>,
              handleClearCachePress
            )}
          </View>
        </View>

        {/* 关于应用 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>关于应用</Text>
          <View style={styles.card}>
            {renderSettingItem(
              'info-circle',
              '#4F46E5',
              '#E0E7FF',
              '关于我们',
              '了解禽康智检团队和愿景',
              renderChevronIcon(),
              handleAboutUsPress
            )}
            <View style={styles.separator} />
            {renderSettingItem(
              'code-branch',
              '#0D9488',
              '#CCFBF1',
              '版本信息',
              '当前版本和更新日志',
              <Text style={styles.versionText}>v1.2.3</Text>,
              handleVersionInfoPress
            )}
            <View style={styles.separator} />
            {renderSettingItem(
              'download',
              '#0891B2',
              '#CFFAFE',
              '检查更新',
              '查看是否有新版本可用',
              renderChevronIcon(),
              handleCheckUpdatePress
            )}
          </View>
        </View>
      </ScrollView>

      {/* 清除缓存确认弹窗 */}
      <Modal
        visible={isClearCacheModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={handleCancelClearCache}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalIconContainer}>
              <FontAwesome6 name="broom" size={24} color="#CA8A04" />
            </View>
            <Text style={styles.modalTitle}>清除缓存</Text>
            <Text style={styles.modalMessage}>
              确定要清除所有缓存数据吗？这将释放 {cacheSize} 存储空间。
            </Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={handleCancelClearCache}
                activeOpacity={0.7}
              >
                <Text style={styles.cancelButtonText}>取消</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.confirmButton}
                onPress={handleConfirmClearCache}
                activeOpacity={0.7}
              >
                <Text style={styles.confirmButtonText}>确认清除</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* 成功提示弹窗 */}
      {isSuccessToastVisible && (
        <View style={styles.toastContainer}>
          <View style={styles.toast}>
            <FontAwesome5 name="check-circle" size={16} color="#ffffff" />
            <Text style={styles.toastText}>{toastMessage}</Text>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
};

export default SettingsScreen;

