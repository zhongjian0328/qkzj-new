import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../context/UserContext';
import { Ionicons } from '@expo/vector-icons';
import Header from '../components/Header';
import { styles } from '../styles';

const DiagnosisHomeScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const { state } = useAuth();
  const { user } = state;

  // 根据用户角色获取诊断模式标题
  const getDiagnosisTitle = () => {
    if (!user) return "选择AI诊断模式";
    
    switch (user.roleType) {
      case 'STUDENT':
        return "学生专用AI诊断";
      case 'TEACHER':
        return "教师专用AI诊断";
      case 'FARMER':
        return "养殖户AI诊断";
      case 'INSTITUTION':
        return "机构专用AI诊断";
      default:
        return "选择AI诊断模式";
    }
  };

  return (
    <View style={styles.container}>
      <Header 
        title={getDiagnosisTitle()} 
        showBackButton={true} 
        onBack={() => navigation.goBack()} 
        backgroundColor="#FFFFFF"
        elevation={2}
      />
      
      <ScrollView contentContainerStyle={[styles.scrollContent, { paddingBottom: 100 }]}>
        {/* 模式选择说明 */}
        <View style={styles.diagnosisHomeIntroSection}>
          <View style={styles.diagnosisHomeIntroCard}>
            <Text style={styles.diagnosisHomeIntroTitle}>
              {user?.roleType === 'STUDENT' 
                ? '请选择您的实习诊断模式' 
                : '请选择适合您的AI诊断模式'
              }
            </Text>
            <Text style={styles.diagnosisHomeIntroText}>
              {user?.roleType === 'STUDENT' 
                ? '根据您的实习需求选择不同的诊断模式，系统将为您提供专业的AI诊断服务，并帮助您记录实习过程。' 
                : '根据您的需求选择不同的诊断模式，系统将为您提供相应的诊断服务'
              }
            </Text>
          </View>
        </View>
        
        {/* 模式选择卡片 */}
        <View style={styles.diagnosisHomeModeCardsSection}>
          {/* 对话问诊模式卡片 */}
          <TouchableOpacity 
            style={styles.diagnosisHomeModeCard} 
            onPress={() => navigation.navigate('ChatDiagnosis')}
            activeOpacity={0.95}
          >
            <View style={styles.diagnosisHomeModeCardContent}>
              <View style={styles.diagnosisHomeModeCardIcon}>
                <Ionicons name="chatbubbles-outline" size={28} color="#2DBBA1" />
              </View>
              <View style={styles.diagnosisHomeModeCardInfo}>
                <Text style={styles.diagnosisHomeModeCardTitle}>
                  {user?.roleType === 'STUDENT' ? '实习对话问诊' : '对话问诊模式'}
                </Text>
                <Text style={styles.diagnosisHomeModeCardDescription}>
                  {user?.roleType === 'STUDENT' 
                    ? '直接用文字描述症状，上传图片，采用对话模式，可以支持多轮对话，获取初步诊断建议，并自动记录到实习日志。' 
                    : '直接用文字描述症状，上传图片，采用对话模式，可以支持多轮对话，获取初步诊断建议'
                  }
                </Text>
                <View style={styles.diagnosisHomeModeCardBadge}>
                  <Ionicons name="checkmark-circle-outline" size={16} color="#2DBBA1" />
                  <Text style={styles.diagnosisHomeModeCardBadgeText}>
                    {user?.roleType === 'STUDENT' 
                      ? '适合实习初期，学习如何描述症状' 
                      : '适合描述清晰、症状明确的情况'
                    }
                  </Text>
                </View>
              </View>
            </View>
          </TouchableOpacity>
          
          {/* AI兽医模式卡片 */}
          <TouchableOpacity 
            style={styles.diagnosisHomeModeCard} 
            onPress={() => navigation.navigate('VeterinaryDiagnosis')}
            activeOpacity={0.95}
          >
            <View style={styles.diagnosisHomeModeCardContent}>
              <View style={styles.diagnosisHomeModeCardIcon}>
                <Ionicons name="medical-outline" size={28} color="#2DBBA1" />
              </View>
              <View style={styles.diagnosisHomeModeCardInfo}>
                <Text style={styles.diagnosisHomeModeCardTitle}>
                  {user?.roleType === 'STUDENT' ? '实习AI兽医诊断' : 'AI兽医模式'}
                </Text>
                <Text style={styles.diagnosisHomeModeCardDescription}>
                  {user?.roleType === 'STUDENT' 
                    ? '通过标准化诊断流程，分阶段录入基础信息、临床表现等数据，获取AI初诊和确诊报告，并支持导师点评和评分。' 
                    : '通过标准化诊断流程，分阶段录入基础信息、临床表现等数据，获取AI初诊和确诊报告'
                  }
                </Text>
                <View style={styles.diagnosisHomeModeCardBadge}>
                  <Ionicons name="checkmark-circle-outline" size={16} color="#2DBBA1" />
                  <Text style={styles.diagnosisHomeModeCardBadgeText}>
                    {user?.roleType === 'STUDENT' 
                      ? '适合实习进阶，学习标准化诊断流程' 
                      : '适合需要详细诊断、分阶段录入数据的情况'
                    }
                  </Text>
                </View>
              </View>
            </View>
          </TouchableOpacity>
          
          {/* 学生专用模式卡片 */}
          {user?.roleType === 'STUDENT' && (
            <TouchableOpacity 
              style={styles.diagnosisHomeModeCard} 
              onPress={() => navigation.navigate('VeterinaryDiagnosis')}
              activeOpacity={0.95}
            >
              <View style={styles.diagnosisHomeModeCardContent}>
                <View style={styles.diagnosisHomeModeCardIcon}>
                  <Ionicons name="book-outline" size={28} color="#2DBBA1" />
                </View>
                <View style={styles.diagnosisHomeModeCardInfo}>
                  <Text style={styles.diagnosisHomeModeCardTitle}>实习诊断练习</Text>
                  <Text style={styles.diagnosisHomeModeCardDescription}>
                    基于真实病例的模拟诊断练习，系统提供病例信息，您可以进行诊断并获得评分和反馈，帮助您提升诊断能力。
                  </Text>
                  <View style={styles.diagnosisHomeModeCardBadge}>
                    <Ionicons name="checkmark-circle-outline" size={16} color="#2DBBA1" />
                    <Text style={styles.diagnosisHomeModeCardBadgeText}>适合实习练习，提升诊断能力</Text>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          )}
        </View>
        
        {/* 注意事项 */}
        <View style={styles.diagnosisHomeNotesSection}>
          <View style={styles.diagnosisHomeNotesCard}>
            <View style={styles.diagnosisHomeNotesContent}>
              <Ionicons name="information-circle-outline" size={24} color="#3182CE" style={styles.diagnosisHomeNotesIcon} />
              <View style={styles.diagnosisHomeNotesInfo}>
                <Text style={styles.diagnosisHomeNotesTitle}>
                  {user?.roleType === 'STUDENT' ? '实习提示' : '温馨提示'}
                </Text>
                <Text style={styles.diagnosisHomeNotesText}>
                  {user?.roleType === 'STUDENT' 
                    ? '所有诊断记录将自动保存到您的实习日志中，您可以在实习日志中查看和管理这些记录。建议您在导师的指导下进行诊断练习。' 
                    : '无论选择哪种模式，系统都会为您提供专业的AI诊断服务。如果您不确定如何描述症状，建议选择AI兽医模式，按照标准化流程进行诊断。'
                  }
                </Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default DiagnosisHomeScreen;
