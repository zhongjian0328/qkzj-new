import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../App';
import { StackNavigationProp } from '@react-navigation/stack';
import { useAuth } from '../context/UserContext';
import { styles } from '../styles';

// 定义导航类型
type ExperienceRoleScreenNavigationProp = StackNavigationProp<RootStackParamList, 'ExperienceRole'>;

const ExperienceRoleScreen: React.FC = () => {
  const navigation = useNavigation<ExperienceRoleScreenNavigationProp>();
  const { experienceLogin } = useAuth();
  
  // 状态管理
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  
  // 体验角色数据
  const experienceRoles = [
    {
      id: 'farmer-small',
      title: '养殖户（小散户）',
      description: '小规模养殖，个人或家庭经营',
      icon: '🌾',
      backgroundColor: '#E6F7F3',
      textColor: '#2DBBA1'
    },
    {
      id: 'farmer-enterprise',
      title: '养殖户（企业）',
      description: '规模化养殖企业，专业管理团队',
      icon: '🏭',
      backgroundColor: '#E6F7F3',
      textColor: '#2DBBA1'
    },
    {
      id: 'institution-cdc',
      title: '疫控机构',
      description: '负责疫情监测、预警和防控',
      icon: '🛡️',
      backgroundColor: '#EBF5FF',
      textColor: '#3B82F6'
    },
    {
      id: 'student-internship',
      title: '学生（实习）',
      description: '顶岗实习，实践技能提升',
      icon: '🎓',
      backgroundColor: '#F3E8FF',
      textColor: '#8B5CF6'
    }
  ];
  
  // 处理角色选择
  const handleRoleSelect = (roleId: string) => {
    setSelectedRole(roleId);
  };
  
  // 处理开始体验
  const handleStartExperience = async () => {
    if (!selectedRole) {
      Alert.alert('提示', '请选择要体验的角色');
      return;
    }
    
    try {
      // 角色映射：将体验角色ID映射为对应的UserRole和UserSubRole
      let roleType: 'FARMER' | 'INSTITUTION' | 'STUDENT';
      let subRole: string;

      switch (selectedRole) {
        case 'farmer-small':
          roleType = 'FARMER';
          subRole = 'SMALL';
          break;
        case 'farmer-enterprise':
          roleType = 'FARMER';
          subRole = 'ENTERPRISE';
          break;
        case 'institution-cdc':
          roleType = 'INSTITUTION';
          subRole = 'CDC';
          break;
        case 'student-internship':
          roleType = 'STUDENT';
          subRole = 'COGNITIVE_INTERN';
          break;
        default:
          roleType = 'FARMER';
          subRole = 'SMALL';
      }

      // 调用后端体验登录接口
      await experienceLogin(roleType, subRole);
      
      // 登录成功，跳转到Main页面
      navigation.reset({
        index: 0,
        routes: [{ name: 'Main' }],
      });
    } catch (error) {
      Alert.alert('登录失败', '体验登录失败，请稍后重试');
      console.error('体验登录失败:', error);
    }
  };
  
  return (
    <View style={styles.container}>
      {/* 顶部导航栏 */}
      <View style={styles.loginHeader}>
        <TouchableOpacity 
          style={styles.loginBackButton} 
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.loginBackButtonText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.loginHeaderTitle}>体验角色选择</Text>
        <View style={styles.loginHeaderRight} />
      </View>
      
      <ScrollView contentContainerStyle={styles.roleSelectScrollContent}>
        {/* 体验说明 */}
        <View style={styles.experienceInfoCard}>
          <View style={styles.experienceInfoContent}>
            <View style={styles.experienceInfoIcon}>
              <Text style={{ fontSize: 20 }}>ℹ️</Text>
            </View>
            <View style={styles.experienceInfoText}>
              <Text style={styles.experienceInfoTitle}>体验说明</Text>
              <Text style={styles.experienceInfoDescription}>
                您可以选择以下角色体验APP功能，每个设备最多可体验3次不同角色，每次体验时长不超过24小时。
              </Text>
            </View>
          </View>
        </View>
        
        {/* 角色选择区域 */}
        <View style={styles.experienceRolesSection}>
          <Text style={styles.experienceRolesTitle}>请选择要体验的角色</Text>
          
          <View style={styles.experienceRolesContainer}>
            {experienceRoles.map(role => (
              <TouchableOpacity
                key={role.id}
                style={[
                  styles.experienceRoleCard,
                  selectedRole === role.id && styles.experienceRoleCardSelected
                ]}
                onPress={() => handleRoleSelect(role.id)}
              >
                <View style={styles.experienceRoleContent}>
                  <View 
                    style={[
                      styles.experienceRoleIcon,
                      { backgroundColor: role.backgroundColor }
                    ]}
                  >
                    <Text style={{ fontSize: 32 }}>{role.icon}</Text>
                  </View>
                  <View style={styles.experienceRoleInfo}>
                    <Text style={styles.experienceRoleTitle}>{role.title}</Text>
                    <Text style={styles.experienceRoleDescription}>{role.description}</Text>
                  </View>
                  <View style={styles.experienceRoleArrow}>
                    <Text style={styles.experienceRoleArrowText}>→</Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>
      
      {/* 底部按钮 */}
      <View style={styles.roleSelectBottomButtonContainer}>
        <TouchableOpacity
          style={[
            styles.roleSelectNextButton,
            !selectedRole && styles.roleSelectNextButtonDisabled
          ]}
          onPress={handleStartExperience}
          disabled={!selectedRole}
        >
          <Text style={styles.roleSelectNextButtonText}>开始体验</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ExperienceRoleScreen;