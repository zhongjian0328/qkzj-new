import { colors } from '../theme';
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../App';
import { StackNavigationProp } from '@react-navigation/stack';
import { styles } from '../styles';
import { authApi } from '../services/api';
import { useAuth } from '../context/UserContext';

// 定义导航类型
type RoleSelectScreenNavigationProp = StackNavigationProp<RootStackParamList, 'RoleSelect'>;

const RoleSelectScreen: React.FC = () => {
  const navigation = useNavigation<RoleSelectScreenNavigationProp>();
  const { state, updateUser } = useAuth();

  // 状态管理
  const [selectedMainRole, setSelectedMainRole] = useState<string | null>(null);
  const [selectedSubRole, setSelectedSubRole] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  
  // 主角色数据
  const mainRoles = [
    {
      id: 'farmer',
      title: '养殖户',
      description: '从事禽类养殖生产',
      icon: 'leaf' as const,
      backgroundColor: colors.primaryLight,
      textColor: colors.primary
    },
    {
      id: 'institution',
      title: '机构',
      description: '疫控、科研、服务机构',
      icon: 'business' as const,
      backgroundColor: colors.infoLight,
      textColor: colors.info
    },
    {
      id: 'student',
      title: '学生',
      description: '学习禽类养殖相关专业',
      icon: 'school' as const,
      backgroundColor: colors.accent.purpleLight,
      textColor: colors.accent.purple
    },
    {
      id: 'teacher',
      title: '教师',
      description: '教学指导与实习管理',
      icon: 'person' as const,
      backgroundColor: colors.accent.orangeLight,
      textColor: colors.warning
    }
  ];
  
  // 子角色数据
  const subRoles = {
    farmer: [
      {
        id: 'small',
        title: '小散户',
        description: '小规模养殖，个人或家庭经营'
      },
      {
        id: 'cooperative',
        title: '合作社',
        description: '养殖户联合组织，统一管理'
      },
      {
        id: 'enterprise',
        title: '养殖企业',
        description: '规模化养殖企业，专业管理团队'
      }
    ],
    institution: [
      {
        id: 'cdc',
        title: '疫控机构',
        description: '负责疫情监测、预警和防控'
      },
      {
        id: 'research',
        title: '科研院所',
        description: '从事禽类疾病研究和技术开发'
      },
      {
        id: 'service',
        title: '服务商',
        description: '提供兽药、饲料、技术服务等'
      }
    ],
    student: [
      {
        id: 'learning',
        title: '学习阶段',
        description: '理论学习，知识巩固'
      },
      {
        id: 'cognitive',
        title: '认知实习',
        description: '参观学习，初步实践'
      },
      {
        id: 'advanced',
        title: '顶岗实习',
        description: '深入实践，技能提升'
      }
    ],
    teacher: [
      {
        id: 'mentor',
        title: '指导教师',
        description: '负责学生实习指导与批阅'
      },
      {
        id: 'clinical',
        title: '临床教师',
        description: '负责临床诊疗教学'
      },
      {
        id: 'research-teacher',
        title: '科研导师',
        description: '负责科研项目管理与指导'
      }
    ]
  };
  
  // 处理主角色选择
  const handleMainRoleSelect = (roleId: string) => {
    setSelectedMainRole(roleId);
    setSelectedSubRole(null);
  };
  
  // 处理子角色选择
  const handleSubRoleSelect = (subRoleId: string) => {
    setSelectedSubRole(subRoleId);
  };
  
  // 处理下一步
  const handleNext = async () => {
    if (!selectedMainRole || !selectedSubRole) {
      Alert.alert('提示', '请选择完整的角色信息');
      return;
    }

    // 映射为后端角色类型
    const roleTypeMap: { [key: string]: string } = {
      farmer: 'FARMER',
      institution: 'INSTITUTION',
      student: 'STUDENT',
      teacher: 'TEACHER',
    };
    const subRoleMap: { [key: string]: string } = {
      small: 'SMALL',
      cooperative: 'COOPERATIVE',
      enterprise: 'ENTERPRISE',
      cdc: 'CDC',
      research: 'RESEARCH_INSTITUTE',
      service: 'SERVICE_PROVIDER',
      learning: 'LEARNING_STUDENT',
      cognitive: 'COGNITIVE_INTERN',
      advanced: 'ADVANCED_INTERN',
      mentor: 'MENTOR',
      clinical: 'CLINICAL_TEACHER',
      'research-teacher': 'RESEARCH_TEACHER',
    };

    const roleType = roleTypeMap[selectedMainRole];
    const subRole = subRoleMap[selectedSubRole];

    setSubmitting(true);
    try {
      // 使用专用角色选择端点持久化角色到后端
      await authApi.selectRole({ roleType, subRole } as any);
      // 同步更新本地状态
      updateUser({ roleType: roleType as any, subRole: subRole as any });

      // 根据角色判断是否需要认证
      const requiresAuth = checkIfRequiresAuth(selectedMainRole, selectedSubRole);

      if (requiresAuth) {
        navigation.navigate('AuthCertification', { role: `${selectedMainRole}_${selectedSubRole}` });
      } else {
        navigation.reset({ index: 0, routes: [{ name: 'Main' }] });
      }
    } catch (error) {
      Alert.alert('提示', '角色保存失败，请稍后重试');
    } finally {
      setSubmitting(false);
    }
  };
  
  // 检查是否需要认证
  const checkIfRequiresAuth = (mainRole: string, subRole: string): boolean => {
    const authRequiredRoles = [
      { main: 'farmer', sub: 'enterprise' },
      { main: 'institution', sub: 'cdc' },
      { main: 'institution', sub: 'research' },
      { main: 'institution', sub: 'service' },
      { main: 'student', sub: 'advanced' },
      { main: 'teacher', sub: 'mentor' },
      { main: 'teacher', sub: 'clinical' },
      { main: 'teacher', sub: 'research-teacher' }
    ];
    
    return authRequiredRoles.some(role => 
      role.main === mainRole && role.sub === subRole
    );
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
        <Text style={styles.loginHeaderTitle}>选择您的身份</Text>
        <View style={styles.loginHeaderRight} />
      </View>
      
      <ScrollView contentContainerStyle={styles.roleSelectScrollContent}>
        {/* 主角色选择区域 */}
        <View style={styles.roleSelectSection}>
          <Text style={styles.roleSelectSectionTitle}>请选择主角色</Text>
          
          <View style={styles.roleSelectMainRolesContainer}>
            {mainRoles.map(role => (
              <TouchableOpacity
                key={role.id}
                style={[
                  styles.roleSelectMainRoleCard,
                  selectedMainRole === role.id && styles.roleSelectMainRoleCardSelected
                ]}
                onPress={() => handleMainRoleSelect(role.id)}
              >
                <View style={styles.roleSelectMainRoleContent}>
                  <View 
                    style={[
                      styles.roleSelectMainRoleIcon,
                      { backgroundColor: role.backgroundColor }
                    ]}
                  >
                    <Ionicons name={role.icon} size={32} color={role.textColor} />
                  </View>
                  <View style={styles.roleSelectMainRoleInfo}>
                    <Text style={styles.roleSelectMainRoleTitle}>{role.title}</Text>
                    <Text style={styles.roleSelectMainRoleDescription}>{role.description}</Text>
                  </View>
                  <View style={styles.roleSelectMainRoleArrow}>
                    <Text style={styles.roleSelectMainRoleArrowText}>→</Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>
        
        {/* 子角色选择区域 */}
        {selectedMainRole && (
          <View style={styles.roleSelectSection}>
            <Text style={styles.roleSelectSectionTitle}>请选择具体身份</Text>
            
            <View style={styles.roleSelectSubRolesContainer}>
              {subRoles[selectedMainRole as keyof typeof subRoles].map(subRole => (
                <TouchableOpacity
                  key={subRole.id}
                  style={[
                    styles.roleSelectSubRoleCard,
                    selectedSubRole === subRole.id && styles.roleSelectSubRoleCardSelected
                  ]}
                  onPress={() => handleSubRoleSelect(subRole.id)}
                >
                  <Text style={styles.roleSelectSubRoleTitle}>{subRole.title}</Text>
                  <Text style={styles.roleSelectSubRoleDescription}>{subRole.description}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}
        
        {/* 角色说明 */}
        <View style={styles.roleSelectDescriptionCard}>
          <View style={styles.roleSelectDescriptionContent}>
            <View style={styles.roleSelectDescriptionIcon}>
              <Ionicons name="information-circle-outline" size={20} color={colors.primary} />
            </View>
            <View style={styles.roleSelectDescriptionInfo}>
              <Text style={styles.roleSelectDescriptionTitle}>温馨提示</Text>
              <Text style={styles.roleSelectDescriptionText}>
                请根据您的实际身份选择，不同角色将获得不同的功能服务。选择后可在个人中心修改。
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
      
      {/* 底部按钮 */}
      <View style={styles.roleSelectBottomButtonContainer}>
        <TouchableOpacity
          style={[
            styles.roleSelectNextButton,
            !(selectedMainRole && selectedSubRole) && styles.roleSelectNextButtonDisabled
          ]}
          onPress={handleNext}
          disabled={!(selectedMainRole && selectedSubRole)}
        >
          <Text style={styles.roleSelectNextButtonText}>下一步</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default RoleSelectScreen;