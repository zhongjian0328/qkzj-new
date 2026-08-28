import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../context/UserContext';
import Header from '../components/Header';
import { styles } from '../styles';

const ProfileScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const { state, logout } = useAuth();
  const user = state.user;

  // 菜单项配置
  const menuItems = [
    {
      title: '个人信息',
      icon: '👤',
      onPress: () => navigation.navigate('Profile'),
      visible: true
    },
    {
      title: '我的认证',
      icon: '✅',
      onPress: () => navigation.navigate('AuthCertification', { role: user?.roleType }),
      visible: true
    },
    {
      title: '设置',
      icon: '⚙️',
      onPress: () => {
        // 设置页暂不存在，提示用户
        console.log('设置页开发中');
      },
      visible: false
    },
    {
      title: '关于我们',
      icon: 'ℹ️',
      onPress: () => {
        // 关于页暂不存在，提示用户
        console.log('关于页开发中');
      },
      visible: false
    },
    {
      title: '帮助与反馈',
      icon: '❓',
      onPress: () => {
        // 帮助页暂不存在，提示用户
        console.log('帮助页开发中');
      },
      visible: false
    },
    {
      title: '退出登录',
      icon: '🚪',
      onPress: logout,
      visible: true
    }
  ];

  return (
    <View style={styles.container}>
      <Header 
        title="我的" 
        showBackButton={false} 
      />
      
      <ScrollView contentContainerStyle={[styles.scrollContent, { paddingBottom: 100 }]}>
        {/* 用户信息卡片 */}
        <View style={styles.profileUserCard}>
          <View style={styles.profileUserInfo}>
            <View style={styles.profileUserAvatar}>
              <Text style={{ fontSize: 48 }}>{user?.roleType === 'FARMER' ? '🌾' :
               user?.roleType === 'INSTITUTION' ? '🏢' :
               user?.roleType === 'STUDENT' ? '🎓' :
               user?.roleType === 'TEACHER' ? '👨‍🏫' : '👤'}</Text>
            </View>
            <View style={styles.profileUserDetails}>
              <Text style={styles.profileUserName}>{user?.nickname || '未登录用户'}</Text>
              <Text style={styles.profileUserRole}>
                {user?.roleType === 'FARMER' ? '养殖户' :
                 user?.roleType === 'INSTITUTION' ? '疫控机构' :
                 user?.roleType === 'STUDENT' ? '学生' :
                 user?.roleType === 'TEACHER' ? '教师' : '未知角色'}
              </Text>
            </View>
          </View>
        </View>
        
        {/* 菜单区域 */}
        <View style={styles.profileMenuSection}>
          {menuItems.filter(item => item.visible).map((item, index) => (
            <TouchableOpacity 
              key={index} 
              style={styles.profileMenuItem} 
              onPress={item.onPress}
              activeOpacity={0.9}
            >
              <View style={styles.profileMenuItemIcon}>
                <Text style={{ fontSize: 24 }}>{item.icon}</Text>
              </View>
              <Text style={styles.profileMenuItemText}>{item.title}</Text>
              <Text style={styles.profileMenuArrow}>→</Text>
            </TouchableOpacity>
          ))}
        </View>
        
        {/* 版本信息 */}
        <View style={styles.profileVersionInfo}>
          <Text style={styles.profileVersionText}>禽康智检 v1.0.0</Text>
          <Text style={styles.profileCopyrightText}>© 2024 禽康智检 版权所有</Text>
        </View>
      </ScrollView>
    </View>
  );
};

export default ProfileScreen;
