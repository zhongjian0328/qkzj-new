import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { FontAwesome6 } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import styles from './styles';
import { useAuth } from '../../src/contexts/AuthContext';

interface ExperienceRole {
  id: string;
  name: string;
  desc: string;
  icon: string;
  iconColor: string;
  iconBgColor: string;
  example: string;
  homeRoute: string;
}

const experienceRoles: ExperienceRole[] = [
  {
    id: 'farmer-small',
    name: '养殖户（小散户）',
    desc: '从事小规模禽类养殖的个人',
    icon: 'seedling',
    iconColor: '#3BCCA5',
    iconBgColor: 'rgba(59, 204, 165, 0.1)',
    example: '查看AI诊断功能、获取治疗方案',
    homeRoute: '/p-home_farmer_small'
  },
  {
    id: 'farmer-enterprise',
    name: '养殖户（企业）',
    desc: '从事规模化禽类养殖的企业',
    icon: 'building',
    iconColor: '#2563EB',
    iconBgColor: 'rgba(37, 99, 235, 0.1)',
    example: '管理养殖批次、查看生产数据',
    homeRoute: '/p-home_farmer_enterprise'
  },
  {
    id: 'institution-cdc',
    name: '机构（疫控）',
    desc: '负责动物疫病预防控制的机构',
    icon: 'shield-halved',
    iconColor: '#DC2626',
    iconBgColor: 'rgba(220, 38, 38, 0.1)',
    example: '查看疫情热力图、接收异常报警',
    homeRoute: '/p-home_institution_cdc'
  },
  {
    id: 'student-learning',
    name: '学生（学习）',
    desc: '学习禽类养殖和疾病诊断的学生',
    icon: 'graduation-cap',
    iconColor: '#7C3AED',
    iconBgColor: 'rgba(124, 58, 237, 0.1)',
    example: '浏览病理图谱、进行知识测验',
    homeRoute: '/p-home_student_learning'
  },
  {
    id: 'student-internship',
    name: '学生（实习）',
    desc: '进行禽类养殖实习的学生',
    icon: 'briefcase',
    iconColor: '#F59E0B',
    iconBgColor: 'rgba(245, 158, 11, 0.1)',
    example: '记录实习日志、查看导师批注',
    homeRoute: '/p-home_student_internship'
  }
];

const ExperienceRoleScreen: React.FC = () => {
  const router = useRouter();
  const { setUser } = useAuth();
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [experienceCount, setExperienceCount] = useState<number>(0);

  // 从本地存储获取体验次数
  useEffect(() => {
    const getExperienceCount = async () => {
      try {
        const count = await AsyncStorage.getItem('experienceCount');
        if (count) {
          setExperienceCount(parseInt(count, 10));
        } else {
          setExperienceCount(0);
        }
      } catch (error) {
        console.error('获取体验次数失败:', error);
      }
    };
    getExperienceCount();
  }, []);

  // 返回按钮处理
  const handleBackPress = () => {
    if (router.canGoBack()) {
      router.back();
    }
  };

  // 选择角色
  const handleRoleSelect = (roleId: string) => {
    setSelectedRole(roleId);
  };

  // 开始体验
  const handleStartExperience = async () => {
    if (!selectedRole) {
      Alert.alert('提示', '请选择要体验的角色');
      return;
    }

    // 检查体验次数限制
    if (experienceCount >= 3) {
      Alert.alert('提示', '每个设备最多可体验3次不同角色，请注册登录后继续使用');
      router.push('/p-login_register');
      return;
    }

    try {
      // 保存体验记录
      const updatedCount = experienceCount + 1;
      await AsyncStorage.setItem('experienceCount', updatedCount.toString());
      
      // 设置体验模式用户
      const experienceUser = {
        id: `experience-${Date.now()}`,
        phone: '13800138000',
        name: '体验用户',
        role: selectedRole.toUpperCase().replace('-', '_'),
        token: `mock-experience-token-${Date.now()}`,
        isExperience: true
      };
      
      await setUser(experienceUser);
      
      // 根据选择的角色跳转到对应的首页
      const role = experienceRoles.find(r => r.id === selectedRole);
      if (role) {
        router.push(role.homeRoute as any);
      } else {
        router.push('/p-home_farmer_small');
      }
    } catch (error) {
      console.error('开始体验失败:', error);
      Alert.alert('错误', '开始体验失败，请稍后重试');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* 顶部Logo和标题 */}
        <LinearGradient
          colors={['#D3F8EE', '#3BCCA5']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.logoSection}
        >
          <View style={styles.logoContainer}>
            <View style={styles.logoIcon}>
              <FontAwesome6 name="dove" size={32} color="#2B6A5A" />
            </View>
            <Text style={styles.appTitle}>禽康智检</Text>
            <Text style={styles.appSubtitle}>AI赋能禽类健康管理</Text>
          </View>
        </LinearGradient>

        {/* 页面说明 */}
        <View style={styles.descriptionSection}>
          <View style={styles.descriptionCard}>
            <View style={styles.descriptionIconContainer}>
              <FontAwesome6 name="info-circle" size={16} color="#3BCCA5" />
            </View>
            <View style={styles.descriptionContent}>
              <Text style={styles.descriptionTitle}>角色体验说明</Text>
              <Text style={styles.descriptionText}>
                您可以选择以下角色进行体验，每个设备最多可体验3次不同角色。体验期间，您可以访问该角色的核心功能，但部分高级功能可能受限。
              </Text>
              <View style={styles.experienceCountContainer}>
                <Text style={styles.experienceCountLabel}>已体验次数：</Text>
                <Text style={styles.experienceCountValue}>{experienceCount}/3</Text>
              </View>
            </View>
          </View>
        </View>

        {/* 角色选择 */}
        <View style={styles.rolesSection}>
          <Text style={styles.sectionTitle}>请选择要体验的角色</Text>
          
          <View style={styles.rolesContainer}>
            {experienceRoles.map((role) => (
              <TouchableOpacity
                key={role.id}
                style={[
                  styles.roleCard,
                  selectedRole === role.id && styles.roleCardSelected
                ]}
                onPress={() => handleRoleSelect(role.id)}
              >
                <View style={styles.roleContent}>
                  <View style={[styles.roleIconContainer, { backgroundColor: role.iconBgColor }]}>
                    <FontAwesome6 name={role.icon} size={24} color={role.iconColor} />
                  </View>
                  <View style={styles.roleInfo}>
                    <Text style={styles.roleName}>{role.name}</Text>
                    <Text style={styles.roleDesc}>{role.desc}</Text>
                    <View style={styles.roleExample}>
                      <FontAwesome6 name="lightbulb" size={12} color="#6B7280" />
                      <Text style={styles.roleExampleText}>{role.example}</Text>
                    </View>
                  </View>
                  <View style={styles.roleRadio}>
                    <View style={[
                      styles.roleRadioInner,
                      selectedRole === role.id && styles.roleRadioSelected
                    ]} />
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* 底部间距 */}
        <View style={styles.bottomSpacing} />
      </ScrollView>

      {/* 底部按钮 */}
      <View style={styles.bottomAction}>
        <TouchableOpacity
          style={[
            styles.startButton,
            !selectedRole && styles.startButtonDisabled
          ]}
          onPress={handleStartExperience}
          disabled={!selectedRole}
        >
          <LinearGradient
            colors={['#D3F8EE', '#3BCCA5']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={[styles.startButtonGradient, !selectedRole && styles.startButtonGradientDisabled]}
          >
            <FontAwesome6 name="play" size={18} color="#2B6A5A" style={styles.buttonIcon} />
            <Text style={styles.startButtonText}>开始体验</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default ExperienceRoleScreen;
