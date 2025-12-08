

import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { FontAwesome6 } from '@expo/vector-icons';
import styles from './styles';
import { getCurrentUser, saveUserInfo } from '../../src/services/api';

interface SubRole {
  id: string;
  name: string;
  desc: string;
}

interface MainRole {
  id: string;
  name: string;
  desc: string;
  icon: string;
  iconColor: string;
  iconBgColor: string;
  count: string;
  countIcon: string;
  subRoles: SubRole[];
}

const roleSelectData: MainRole[] = [
  {
    id: 'farmer',
    name: '养殖户',
    desc: '从事禽类养殖的个人或企业',
    icon: 'seedling',
    iconColor: '#3BCCA5',
    iconBgColor: 'rgba(59, 204, 165, 0.1)',
    count: '12,580 人',
    countIcon: 'users',
    subRoles: [
      { id: 'small', name: '小散户', desc: '个体养殖户，小规模养殖' },
      { id: 'cooperative', name: '合作社', desc: '养殖合作社成员' },
      { id: 'enterprise', name: '养殖企业', desc: '规模化养殖企业' }
    ]
  },
  {
    id: 'institution',
    name: '机构',
    desc: '疫控机构、科研院所、服务商等',
    icon: 'building',
    iconColor: '#2563EB',
    iconBgColor: 'rgba(37, 99, 235, 0.1)',
    count: '286 家',
    countIcon: 'building',
    subRoles: [
      { id: 'cdc', name: '疫控机构', desc: '动物疫病预防控制机构' },
      { id: 'research', name: '科研院所', desc: '农业科研机构' },
      { id: 'service', name: '服务商', desc: '兽药、饲料、疫苗供应商' }
    ]
  },
  {
    id: 'student',
    name: '学生',
    desc: '农业院校相关专业学生',
    icon: 'graduation-cap',
    iconColor: '#7C3AED',
    iconBgColor: 'rgba(124, 58, 237, 0.1)',
    count: '3,245 人',
    countIcon: 'graduation-cap',
    subRoles: [
      { id: 'learning', name: '学习阶段', desc: '在校学习的学生' },
      { id: 'cognitive', name: '认知实习', desc: '认知实习阶段' },
      { id: 'advanced', name: '顶岗实习', desc: '顶岗实习阶段' }
    ]
  }
];

const RoleSelectScreen: React.FC = () => {
  const router = useRouter();
  const [selectedMainRoleId, setSelectedMainRoleId] = useState<string | null>(null);
  const [selectedSubRoleId, setSelectedSubRoleId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleBackPress = () => {
    if (router.canGoBack()) {
      router.back();
    }
  };

  const handleMainRoleSelect = (roleId: string) => {
    setSelectedMainRoleId(roleId);
    setSelectedSubRoleId(null);
  };

  const handleSubRoleSelect = (subRoleId: string) => {
    setSelectedSubRoleId(subRoleId);
  };

  const handleNextPress = async () => {
    if (!selectedMainRoleId || !selectedSubRoleId) {
      Alert.alert('提示', '请选择您的身份');
      return;
    }

    try {
      setIsLoading(true);
      const roleKey = `${selectedMainRoleId}-${selectedSubRoleId}`;
      
      // 获取当前用户信息
      const currentUser = await getCurrentUser();
      if (currentUser) {
        // 更新用户角色信息
        const updatedUser = {
          ...currentUser,
          role: roleKey
        };
        // 保存到本地存储
        await saveUserInfo(updatedUser);
      }
      
      switch (roleKey) {
        case 'farmer-small':
          router.push('/p-home_farmer_small');
          break;
        case 'farmer-cooperative':
        case 'farmer-enterprise':
        case 'institution-cdc':
        case 'institution-research':
        case 'institution-service':
        case 'student-cognitive':
        case 'student-advanced':
          router.push(`/p-auth_certification?role=${roleKey}`);
          break;
        case 'student-learning':
          router.push('/p-home_student_learning');
          break;
        default:
          Alert.alert('错误', '未知角色，请重新选择');
      }
    } catch (error) {
      Alert.alert('错误', '保存角色信息失败，请重试');
    } finally {
      setIsLoading(false);
    }
  };

  const selectedMainRole = roleSelectData.find(role => role.id === selectedMainRoleId);
  const isNextButtonEnabled = selectedMainRoleId && selectedSubRoleId;

  return (
    <SafeAreaView style={styles.container}>
      {/* 顶部导航栏 */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleBackPress}>
          <FontAwesome6 name="arrow-left" size={20} color="#6B7280" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>选择身份</Text>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* 页面说明 */}
        <View style={styles.descriptionSection}>
          <View style={styles.descriptionCard}>
            <View style={styles.descriptionIconContainer}>
              <FontAwesome6 name="user-check" size={16} color="#3BCCA5" />
            </View>
            <View style={styles.descriptionContent}>
              <Text style={styles.descriptionTitle}>选择您的身份角色</Text>
              <Text style={styles.descriptionText}>
                根据您的身份选择相应角色，我们将为您提供个性化的服务和功能
              </Text>
            </View>
          </View>
        </View>

        {/* 主角色选择 */}
        <View style={styles.mainRolesSection}>
          <Text style={styles.sectionTitle}>请选择主角色</Text>
          
          <View style={styles.mainRolesContainer}>
            {roleSelectData.map((role) => (
              <TouchableOpacity
                key={role.id}
                style={[
                  styles.mainRoleCard,
                  selectedMainRoleId === role.id && styles.mainRoleCardSelected
                ]}
                onPress={() => handleMainRoleSelect(role.id)}
              >
                <View style={styles.mainRoleContent}>
                  <View style={[styles.mainRoleIconContainer, { backgroundColor: role.iconBgColor }]}>
                    <FontAwesome6 name={role.icon} size={24} color={role.iconColor} />
                  </View>
                  <View style={styles.mainRoleInfo}>
                    <Text style={styles.mainRoleName}>{role.name}</Text>
                    <Text style={styles.mainRoleDesc}>{role.desc}</Text>
                    <View style={styles.mainRoleCount}>
                      <FontAwesome6 name={role.countIcon} size={10} color="#6B7280" />
                      <Text style={styles.mainRoleCountText}>已加入 {role.count}</Text>
                    </View>
                  </View>
                  <View style={styles.mainRoleRadio}>
                    <View style={[
                      styles.mainRoleRadioInner,
                      selectedMainRoleId === role.id && styles.mainRoleRadioSelected
                    ]} />
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* 子角色选择 */}
        {selectedMainRole && (
          <View style={styles.subRolesSection}>
            <Text style={styles.sectionTitle}>请选择具体身份</Text>
            
            <View style={styles.subRolesContainer}>
              {selectedMainRole.subRoles.map((subRole) => (
                <TouchableOpacity
                  key={subRole.id}
                  style={[
                    styles.subRoleCard,
                    selectedSubRoleId === subRole.id && styles.subRoleCardSelected
                  ]}
                  onPress={() => handleSubRoleSelect(subRole.id)}
                >
                  <View style={styles.subRoleContent}>
                    <View style={styles.subRoleIconContainer}>
                      <FontAwesome6 name="user" size={16} color="#3BCCA5" />
                    </View>
                    <View style={styles.subRoleInfo}>
                      <Text style={styles.subRoleName}>{subRole.name}</Text>
                      <Text style={styles.subRoleDesc}>{subRole.desc}</Text>
                    </View>
                    <View style={styles.subRoleRadio}>
                      <View style={[
                        styles.subRoleRadioInner,
                        selectedSubRoleId === subRole.id && styles.subRoleRadioSelected
                      ]} />
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {/* 底部间距 */}
        <View style={styles.bottomSpacing} />
      </ScrollView>

      {/* 底部按钮 */}
      <View style={styles.bottomAction}>
        <TouchableOpacity
          style={[
            styles.nextButton,
            isNextButtonEnabled ? styles.nextButtonEnabled : styles.nextButtonDisabled
          ]}
          onPress={handleNextPress}
          disabled={!isNextButtonEnabled}
        >
          <Text style={[
            styles.nextButtonText,
            isNextButtonEnabled ? styles.nextButtonTextEnabled : styles.nextButtonTextDisabled
          ]}>
            下一步
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default RoleSelectScreen;

