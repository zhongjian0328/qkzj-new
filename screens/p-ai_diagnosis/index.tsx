

import React, { useState, useRef } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, TextInput, Alert, Platform, } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { FontAwesome6 } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { LinearGradient } from 'expo-linear-gradient';
import styles from './styles';
import { aiDiagnosisApi, saveDiagnosisApi, DiagnosisResult, getConfirmationPlanApi, ConfirmationPlan, getMixedInfectionRiskApi, MixedInfectionRisk, getEmergencyPlanApi, EmergencyPlan } from '../../src/services/api';
import { useAuth } from '../../src/contexts/AuthContext';

type UserRole = 'FARMER' | 'STUDENT' | 'INSTITUTION';
type BodyPart = '眼睛' | '羽毛' | '粪便' | '呼吸道' | '腿部' | '其他' | null;

const AiDiagnosisScreen: React.FC = () => {
  const router = useRouter();
  const { user } = useAuth();
  
  // 从用户数据中获取角色（实际应用中从AuthContext获取）
  const userRole = (user?.role?.startsWith('STUDENT') ? 'STUDENT' : user?.role?.startsWith('INSTITUTION') ? 'INSTITUTION' : 'FARMER') as UserRole;
  
  // 状态管理
  const [uploadedImageUri, setUploadedImageUri] = useState<string | null>(null);
  const [selectedBodyPart, setSelectedBodyPart] = useState<BodyPart>(null);
  const [studentDiagnosisText, setStudentDiagnosisText] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loadingProgress, setLoadingProgress] = useState<number>(0);
  const [showDiagnosisResult, setShowDiagnosisResult] = useState<boolean>(false);
  const [showError, setShowError] = useState<boolean>(false);
  const [showBodyPartSection, setShowBodyPartSection] = useState<boolean>(false);
  const [showDiagnosisSection, setShowDiagnosisSection] = useState<boolean>(false);
  const [showStudentInputSection, setShowStudentInputSection] = useState<boolean>(false);
  const [diagnosisResult, setDiagnosisResult] = useState<DiagnosisResult | null>(null);
  const [showConfirmationPlan, setShowConfirmationPlan] = useState<boolean>(false);
  const [confirmationPlans, setConfirmationPlans] = useState<ConfirmationPlan[]>([]);
  const [isLoadingConfirmationPlan, setIsLoadingConfirmationPlan] = useState<boolean>(false);
  const [showMixedInfectionRisk, setShowMixedInfectionRisk] = useState<boolean>(false);
  const [mixedInfectionRisks, setMixedInfectionRisks] = useState<MixedInfectionRisk[]>([]);
  const [isLoadingMixedRisk, setIsLoadingMixedRisk] = useState<boolean>(false);
  const [showEmergencyPlan, setShowEmergencyPlan] = useState<boolean>(false);
  const [emergencyPlans, setEmergencyPlans] = useState<EmergencyPlan[]>([]);
  const [isLoadingEmergencyPlan, setIsLoadingEmergencyPlan] = useState<boolean>(false);
  const [diagnosisId, setDiagnosisId] = useState<string | null>(null);

  const loadingIntervalRef = useRef<number | null>(null);

  // 病禽部位数据
  const bodyParts = [
    { key: '眼睛' as BodyPart, icon: 'eye', color: '#3B82F6' },
    { key: '羽毛' as BodyPart, icon: 'feather', color: '#10B981' },
    { key: '粪便' as BodyPart, icon: 'dumpster', color: '#F59E0B' },
    { key: '呼吸道' as BodyPart, icon: 'lungs', color: '#8B5CF6' },
    { key: '腿部' as BodyPart, icon: 'person-running', color: '#F97316' },
    { key: '其他' as BodyPart, icon: 'ellipsis', color: '#6B7280' },
  ];

  // 返回按钮处理
  const handleBackPress = () => {
    if (router.canGoBack()) {
      router.back();
    }
  };

  // 图片上传处理
  const handleImageUpload = async () => {
    try {
      // 弹出选择菜单，让用户选择拍照或从相册选择
      Alert.alert(
        '选择图片',
        '请选择获取图片的方式',
        [
          {
            text: '取消',
            style: 'cancel',
          },
          {
            text: '拍照',
            onPress: async () => {
              // 请求相机权限
              const { status } = await ImagePicker.requestCameraPermissionsAsync();
              if (status !== 'granted') {
                Alert.alert('权限不足', '需要相机权限才能拍照');
                return;
              }

              // 启动相机
              const result = await ImagePicker.launchCameraAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [4, 3],
                quality: 0.8, // 降低图片质量，提高上传速度
              });

              if (!result.canceled && result.assets[0]) {
                setUploadedImageUri(result.assets[0].uri);
                setShowBodyPartSection(false); // 先不显示部位选择，让用户确认图片
              }
            },
          },
          {
            text: '从相册选择',
            onPress: async () => {
              // 请求相册权限
              const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
              if (status !== 'granted') {
                Alert.alert('权限不足', '需要相册权限才能选择图片');
                return;
              }

              // 从相册选择图片
              const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [4, 3],
                quality: 0.8, // 降低图片质量，提高上传速度
              });

              if (!result.canceled && result.assets[0]) {
                setUploadedImageUri(result.assets[0].uri);
                setShowBodyPartSection(false); // 先不显示部位选择，让用户确认图片
              }
            },
          },
        ],
        { cancelable: true }
      );
    } catch (error) {
      Alert.alert('错误', '获取图片失败，请重试');
    }
  };

  // 重新上传图片
  const handleRetryUpload = () => {
    setUploadedImageUri(null);
    resetAllSections();
  };

  // 确认使用图片
  const handleConfirmImage = () => {
    setShowBodyPartSection(true);
  };

  // 选择病禽部位
  const handleBodyPartSelect = (bodyPart: BodyPart) => {
    setSelectedBodyPart(bodyPart);
    setShowDiagnosisSection(true);
  };

  // 开始诊断
  const handleStartDiagnosis = () => {
    if (userRole === 'STUDENT') {
      setShowStudentInputSection(true);
    } else {
      startAIDiagnosis();
    }
  };

  // 提交学生诊断
  const handleSubmitStudentDiagnosis = () => {
    if (!studentDiagnosisText.trim()) {
      Alert.alert('提示', '请输入您的诊断判断');
      return;
    }
    setShowStudentInputSection(false);
    startAIDiagnosis();
  };

  // 开始AI诊断
  const startAIDiagnosis = async () => {
    if (!uploadedImageUri || !selectedBodyPart) {
      Alert.alert('提示', '请上传图片并选择病禽部位');
      return;
    }
    
    setIsLoading(true);
    setLoadingProgress(0);
    
    // 模拟进度更新
    const progressInterval = setInterval(() => {
      setLoadingProgress(prev => {
        if (prev >= 90) return 90;
        return prev + Math.random() * 10;
      });
    }, 200);
    
    try {
      // 调用AI诊断API
      const response = await aiDiagnosisApi({
        imageUri: uploadedImageUri,
        bodyPart: selectedBodyPart,
        studentDiagnosis: userRole === 'STUDENT' ? studentDiagnosisText : undefined,
      });
      
      if (response.success && response.data) {
        setDiagnosisResult(response.data);
        setShowDiagnosisResult(true);
      } else {
        setShowError(true);
        Alert.alert('诊断失败', response.message || 'AI诊断失败，请重试');
      }
    } catch (error) {
      setShowError(true);
      Alert.alert('诊断失败', '网络异常，请检查网络连接后重试');
    } finally {
      clearInterval(progressInterval);
      setLoadingProgress(100);
      setIsLoading(false);
    }
  };

  // 查看治疗方案
  const handleViewTreatmentPlan = () => {
    router.push('/p-treatment_plan?diagnosisId=12345');
  };

  // 保存诊断结果
  const handleSaveDiagnosis = async () => {
    if (!diagnosisResult) {
      Alert.alert('提示', '没有可保存的诊断结果');
      return;
    }
    
    try {
      const response = await saveDiagnosisApi(diagnosisResult);
      if (response.success && response.data?.id) {
        setDiagnosisId(response.data.id);
        Alert.alert('成功', response.message || '诊断结果已保存');
      } else {
        Alert.alert('保存失败', response.message || '保存诊断结果失败，请重试');
      }
    } catch (error) {
      Alert.alert('保存失败', '网络异常，请检查网络连接后重试');
    }
  };

  // 获取确诊方案推荐
  const handleGetConfirmationPlan = async () => {
    if (!diagnosisId) {
      Alert.alert('提示', '请先保存诊断结果');
      return;
    }
    
    setIsLoadingConfirmationPlan(true);
    
    try {
      const response = await getConfirmationPlanApi(diagnosisId);
      if (response.success && response.data) {
        setConfirmationPlans(response.data);
        setShowConfirmationPlan(true);
      } else {
        Alert.alert('获取失败', response.message || '获取确诊方案推荐失败，请重试');
      }
    } catch (error) {
      Alert.alert('获取失败', '网络异常，请检查网络连接后重试');
    } finally {
      setIsLoadingConfirmationPlan(false);
    }
  };

  // 获取混合感染风险评估
  const handleGetMixedInfectionRisk = async () => {
    if (!diagnosisId) {
      Alert.alert('提示', '请先保存诊断结果');
      return;
    }
    
    setIsLoadingMixedRisk(true);
    
    try {
      const response = await getMixedInfectionRiskApi(diagnosisId);
      if (response.success && response.data) {
        setMixedInfectionRisks(response.data);
        setShowMixedInfectionRisk(true);
      } else {
        Alert.alert('获取失败', response.message || '获取混合感染风险评估失败，请重试');
      }
    } catch (error) {
      Alert.alert('获取失败', '网络异常，请检查网络连接后重试');
    } finally {
      setIsLoadingMixedRisk(false);
    }
  };

  // 获取应急防控方案
  const handleGetEmergencyPlan = async () => {
    if (!diagnosisId) {
      Alert.alert('提示', '请先保存诊断结果');
      return;
    }
    
    setIsLoadingEmergencyPlan(true);
    
    try {
      const response = await getEmergencyPlanApi(diagnosisId);
      if (response.success && response.data) {
        setEmergencyPlans(response.data);
        setShowEmergencyPlan(true);
      } else {
        Alert.alert('获取失败', response.message || '获取应急防控方案失败，请重试');
      }
    } catch (error) {
      Alert.alert('获取失败', '网络异常，请检查网络连接后重试');
    } finally {
      setIsLoadingEmergencyPlan(false);
    }
  };

  // 重新诊断
  const handleRetryDiagnosis = () => {
    resetAllSections();
    setUploadedImageUri(null);
    setSelectedBodyPart(null);
    setStudentDiagnosisText('');
    setShowError(false);
    setDiagnosisResult(null);
  };

  // 重置所有区域
  const resetAllSections = () => {
    setShowBodyPartSection(false);
    setShowDiagnosisSection(false);
    setShowStudentInputSection(false);
    setShowDiagnosisResult(false);
    setIsLoading(false);
    setLoadingProgress(0);
  };

  // 渲染上传区域
  const renderUploadSection = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>上传病禽图片</Text>
      
      <View style={styles.uploadArea}>
        {!uploadedImageUri ? (
          <View style={styles.uploadPlaceholder}>
            <View style={styles.uploadIcon}>
              <FontAwesome6 name="camera" size={24} color="#3BCCA5" />
            </View>
            <View style={styles.uploadTextContainer}>
              <Text style={styles.uploadText}>拍照或选择图片</Text>
              <Text style={styles.uploadDescription}>
                请拍摄病禽的症状部位，如眼睛、羽毛、粪便等
              </Text>
            </View>
            <TouchableOpacity style={styles.uploadButton} onPress={handleImageUpload}>
              <FontAwesome6 name="camera" size={16} color="#FFFFFF" style={styles.buttonIcon} />
              <Text style={styles.uploadButtonText}>拍照上传</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.uploadPreview}>
            <Image source={{ uri: uploadedImageUri }} style={styles.previewImage} />
            <View style={styles.uploadActions}>
              <TouchableOpacity style={styles.retryButton} onPress={handleRetryUpload}>
                <FontAwesome6 name="arrow-rotate-right" size={16} color="#6B7280" style={styles.buttonIcon} />
                <Text style={styles.retryButtonText}>重新上传</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.confirmButton} onPress={handleConfirmImage}>
                <FontAwesome6 name="check" size={16} color="#FFFFFF" style={styles.buttonIcon} />
                <Text style={styles.confirmButtonText}>确认使用</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>
    </View>
  );

  // 渲染病禽部位选择
  const renderBodyPartSection = () => {
    if (!showBodyPartSection) return null;

    return (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>选择病禽部位</Text>
        
        <View style={styles.bodyPartGrid}>
          {bodyParts.map((part) => (
            <TouchableOpacity
              key={part.key}
              style={[
                styles.bodyPartButton,
                selectedBodyPart === part.key && styles.bodyPartButtonSelected,
              ]}
              onPress={() => handleBodyPartSelect(part.key)}
            >
              <View style={[styles.bodyPartIcon, { backgroundColor: `${part.color}20` }]}>
                <FontAwesome6 name={part.icon} size={20} color={part.color} />
              </View>
              <Text style={styles.bodyPartText}>{part.key}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    );
  };

  // 渲染开始诊断按钮
  const renderDiagnosisSection = () => {
    if (!showDiagnosisSection) return null;

    return (
      <View style={styles.section}>
        <TouchableOpacity style={styles.startDiagnosisButton} onPress={handleStartDiagnosis}>
          <LinearGradient
            colors={['#D3F8EE', '#3BCCA5']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.gradientButton}
          >
            <FontAwesome6 name="stethoscope" size={18} color="#2B6A5A" style={styles.buttonIcon} />
            <Text style={styles.startDiagnosisButtonText}>开始AI诊断</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    );
  };

  // 渲染学生输入区域
  const renderStudentInputSection = () => {
    if (!showStudentInputSection || userRole !== 'STUDENT') return null;

    return (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>请输入您的诊断判断</Text>
        
        <View style={styles.studentInputCard}>
          <TextInput
            style={styles.studentInput}
            placeholder="请描述您观察到的症状和初步诊断..."
            placeholderTextColor="#9CA3AF"
            multiline
            maxLength={200}
            value={studentDiagnosisText}
            onChangeText={setStudentDiagnosisText}
          />
          <View style={styles.studentInputActions}>
            <Text style={styles.charCount}>{studentDiagnosisText.length}/200</Text>
            <TouchableOpacity style={styles.submitStudentButton} onPress={handleSubmitStudentDiagnosis}>
              <Text style={styles.submitStudentButtonText}>提交诊断</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  // 渲染加载区域
  const renderLoadingSection = () => {
    if (!isLoading) return null;

    return (
      <View style={styles.section}>
        <View style={styles.loadingCard}>
          <View style={styles.loadingSpinner} />
          <Text style={styles.loadingTitle}>AI正在分析中</Text>
          <Text style={styles.loadingDescription}>请稍候，AI正在分析图片内容...</Text>
          <View style={styles.progressContainer}>
            <View style={styles.progressBarBackground}>
              <View style={[styles.progressBar, { width: `${loadingProgress}%` }]} />
            </View>
            <Text style={styles.progressText}>{Math.round(loadingProgress)}%</Text>
          </View>
        </View>
      </View>
    );
  };

  // 渲染诊断结果
  const renderResultSection = () => {
    if (!showDiagnosisResult || !diagnosisResult) return null;

    return (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>诊断结果</Text>
        
        <View style={styles.resultCard}>
          {/* 学生诊断对比 */}
          {userRole === 'STUDENT' && (
            <View style={styles.studentComparison}>
              <Text style={styles.comparisonTitle}>诊断对比</Text>
              <View style={styles.comparisonContent}>
                <View style={styles.comparisonRow}>
                  <Text style={styles.comparisonLabel}>您的诊断：</Text>
                  <Text style={styles.comparisonValue}>{studentDiagnosisText}</Text>
                </View>
                <View style={styles.comparisonRow}>
                  <Text style={styles.comparisonLabel}>AI诊断：</Text>
                  <Text style={[styles.comparisonValue, styles.aiDiagnosisText]}>
                    {diagnosisResult.mainDisease.name}（置信度{diagnosisResult.mainDisease.confidence}%）
                  </Text>
                </View>
              </View>
              <View style={styles.completionBadge}>
                <FontAwesome6 name="circle-check" size={16} color="#059669" style={styles.buttonIcon} />
                <Text style={styles.completionText}>分析完成</Text>
              </View>
            </View>
          )}

          {/* 主要诊断结果 */}
          <View style={styles.mainDiagnosis}>
            <View style={styles.mainDiagnosisHeader}>
              <Text style={styles.mainDiagnosisTitle}>主要诊断</Text>
              <View style={styles.confidenceBadge}>
                <Text style={styles.confidenceText}>
                  置信度：{diagnosisResult.mainDisease.confidence}%
                </Text>
              </View>
            </View>
            
            <View style={styles.diseaseInfo}>
              <Image source={{ uri: diagnosisResult.mainDisease.imageUrl }} style={styles.diseaseImage} />
              <View style={styles.diseaseDetails}>
                <Text style={styles.diseaseName}>{diagnosisResult.mainDisease.name}</Text>
                <Text style={styles.diseaseSummary}>{diagnosisResult.mainDisease.summary}</Text>
              </View>
            </View>
          </View>

          {/* 其他可能疾病 */}
          <View style={styles.otherDiseases}>
            <Text style={styles.otherDiseasesTitle}>其他可能疾病</Text>
            <View style={styles.otherDiseasesList}>
              {diagnosisResult.otherDiseases.map((disease, index) => (
                <View key={index} style={styles.otherDiseaseItem}>
                  <Text style={styles.otherDiseaseName}>{disease.name}</Text>
                  <Text style={styles.otherDiseaseConfidence}>置信度：{disease.confidence}%</Text>
                </View>
              ))}
            </View>
          </View>

          {/* 操作按钮 */}
          <View style={styles.resultActions}>
            <TouchableOpacity style={styles.treatmentButton} onPress={handleViewTreatmentPlan}>
              <FontAwesome6 name="prescription-bottle" size={16} color="#FFFFFF" style={styles.buttonIcon} />
              <Text style={styles.treatmentButtonText}>查看治疗方案</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.emergencyButton} onPress={handleGetEmergencyPlan}>
              <FontAwesome6 name="shield-halved" size={16} color="#FFFFFF" style={styles.buttonIcon} />
              <Text style={styles.emergencyButtonText}>应急防控</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.riskButton} onPress={handleGetMixedInfectionRisk}>
              <FontAwesome6 name="triangle-exclamation" size={16} color="#FFFFFF" style={styles.buttonIcon} />
              <Text style={styles.riskButtonText}>混合感染风险</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.confirmationButton} onPress={handleGetConfirmationPlan}>
              <FontAwesome6 name="microscope" size={16} color="#FFFFFF" style={styles.buttonIcon} />
              <Text style={styles.confirmationButtonText}>查看确诊方案</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.saveButton} onPress={handleSaveDiagnosis}>
              <FontAwesome6 name="floppy-disk" size={16} color="#6B7280" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  // 渲染错误区域
  const renderErrorSection = () => {
    if (!showError) return null;

    return (
      <View style={styles.section}>
        <View style={styles.errorCard}>
          <View style={styles.errorIcon}>
            <FontAwesome6 name="triangle-exclamation" size={24} color="#DC2626" />
          </View>
          <Text style={styles.errorTitle}>诊断失败</Text>
          <Text style={styles.errorDescription}>
            图片质量不佳或无法识别，请重新上传清晰的图片
          </Text>
          <TouchableOpacity style={styles.retryDiagnosisButton} onPress={handleRetryDiagnosis}>
            <FontAwesome6 name="arrow-rotate-right" size={16} color="#FFFFFF" style={styles.buttonIcon} />
            <Text style={styles.retryDiagnosisButtonText}>重新诊断</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  // 渲染确诊方案推荐
  const renderConfirmationPlanSection = () => {
    if (!showConfirmationPlan || confirmationPlans.length === 0) return null;

    return (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>确诊方案推荐</Text>
        
        <View style={styles.confirmationCard}>
          {isLoadingConfirmationPlan ? (
            <View style={styles.loadingContainer}>
              <View style={styles.loadingSpinner} />
              <Text style={styles.loadingText}>加载中...</Text>
            </View>
          ) : (
            <ScrollView showsVerticalScrollIndicator={false}>
              {confirmationPlans.map((plan, index) => (
                <View key={index} style={styles.planSection}>
                  <View style={[styles.planHeader, {
                    backgroundColor: plan.level === '紧急' ? '#FEE2E2' : 
                                    plan.level === '重要' ? '#FEF3C7' : '#DBEAFE'
                  }]}>
                    <View style={[styles.planLevelBadge, {
                      backgroundColor: plan.level === '紧急' ? '#EF4444' : 
                                      plan.level === '重要' ? '#F59E0B' : '#3B82F6'
                    }]}>
                      <Text style={styles.planLevelText}>{plan.level}</Text>
                    </View>
                    <View style={styles.planHeaderContent}>
                      <Text style={styles.planName}>{plan.name}</Text>
                      <Text style={styles.planDescription}>{plan.description}</Text>
                    </View>
                  </View>
                  
                  <View style={styles.planItems}>
                    {plan.items.map((item, itemIndex) => (
                      <View key={itemIndex} style={styles.planItem}>
                        <Text style={styles.planItemName}>{item.name}</Text>
                        <View style={styles.planItemDetails}>
                          <View style={styles.detailRow}>
                            <FontAwesome6 name="vial" size={12} color="#6B7280" />
                            <Text style={styles.detailText}>方法：{item.method}</Text>
                          </View>
                          <View style={styles.detailRow}>
                            <FontAwesome6 name="clock" size={12} color="#6B7280" />
                            <Text style={styles.detailText}>时间节点：{item.timeNode}</Text>
                          </View>
                          <View style={styles.detailRow}>
                            <FontAwesome6 name="test-tube" size={12} color="#6B7280" />
                            <Text style={styles.detailText}>样本要求：{item.sampleRequirement}</Text>
                          </View>
                        </View>
                      </View>
                    ))}
                  </View>
                </View>
              ))}
            </ScrollView>
          )}
        </View>
      </View>
    );
  };

  // 渲染混合感染风险评估
  const renderMixedInfectionRiskSection = () => {
    if (!showMixedInfectionRisk || mixedInfectionRisks.length === 0) return null;

    return (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>混合感染风险评估</Text>
        
        <View style={styles.riskCard}>
          {isLoadingMixedRisk ? (
            <View style={styles.loadingContainer}>
              <View style={styles.loadingSpinner} />
              <Text style={styles.loadingText}>加载中...</Text>
            </View>
          ) : (
            <ScrollView showsVerticalScrollIndicator={false}>
              {mixedInfectionRisks.map((risk, index) => {
                // 根据风险等级获取对应的颜色
                const getRiskColor = () => {
                  switch (risk.riskLevel) {
                    case '极高':
                      return { background: '#FEE2E2', badge: '#EF4444', text: '#991B1B' };
                    case '高':
                      return { background: '#FEEBC8', badge: '#F59E0B', text: '#92400E' };
                    case '中':
                      return { background: '#EFF6FF', badge: '#3B82F6', text: '#1E40AF' };
                    default:
                      return { background: '#ECFDF5', badge: '#10B981', text: '#065F46' };
                  }
                };
                
                const colors = getRiskColor();
                
                return (
                  <View key={index} style={styles.riskSection}>
                    <View style={[styles.riskHeader, { backgroundColor: colors.background }]}>
                      <View style={[styles.riskLevelBadge, { backgroundColor: colors.badge }]}>
                        <Text style={styles.riskLevelText}>{risk.riskLevel}</Text>
                      </View>
                      <View style={styles.riskHeaderContent}>
                        <Text style={[styles.infectionCombination, { color: colors.text }]}>
                          {risk.infectionCombination}
                        </Text>
                        <View style={styles.probabilityContainer}>
                          <FontAwesome6 name="gauge-simple-high" size={12} color={colors.badge} />
                          <Text style={[styles.probabilityText, { color: colors.text }]}>
                            概率：{risk.probability}%
                          </Text>
                        </View>
                      </View>
                    </View>
                    
                    <View style={styles.riskDetails}>
                      <View style={styles.riskItem}>
                        <Text style={styles.riskItemTitle}>风险描述：</Text>
                        <Text style={styles.riskItemContent}>{risk.description}</Text>
                      </View>
                      <View style={styles.riskItem}>
                        <Text style={styles.riskItemTitle}>推荐操作：</Text>
                        <Text style={styles.riskItemContent}>{risk.recommendedAction}</Text>
                      </View>
                    </View>
                  </View>
                );
              })}
            </ScrollView>
          )}
        </View>
      </View>
    );
  };

  // 渲染应急防控方案
  const renderEmergencyPlanSection = () => {
    if (!showEmergencyPlan || emergencyPlans.length === 0) return null;

    return (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>应急防控方案</Text>
        
        <View style={styles.emergencyCard}>
          {isLoadingEmergencyPlan ? (
            <View style={styles.loadingContainer}>
              <View style={styles.loadingSpinner} />
              <Text style={styles.loadingText}>加载中...</Text>
            </View>
          ) : (
            <ScrollView showsVerticalScrollIndicator={false}>
              {emergencyPlans.map((plan, index) => {
                // 根据时间阶段获取对应的颜色
                const getTimePeriodColor = () => {
                  switch (plan.timePeriod) {
                    case '0-24小时':
                      return { background: '#FEE2E2', badge: '#EF4444' };
                    case '1-7天':
                      return { background: '#FEEBC8', badge: '#F59E0B' };
                    default:
                      return { background: '#ECFDF5', badge: '#10B981' };
                  }
                };
                
                const colors = getTimePeriodColor();
                
                return (
                  <View key={index} style={styles.emergencySection}>
                    <View style={[styles.emergencyHeader, { backgroundColor: colors.background }]}>
                      <View style={[styles.timePeriodBadge, { backgroundColor: colors.badge }]}>
                        <Text style={styles.timePeriodText}>{plan.timePeriod}</Text>
                      </View>
                      <View style={styles.emergencyHeaderContent}>
                        <Text style={styles.emergencyTitle}>{plan.title}</Text>
                        <Text style={styles.emergencyDescription}>{plan.description}</Text>
                      </View>
                    </View>
                    
                    <View style={styles.emergencyMeasures}>
                      {plan.measures.map((measure, measureIndex) => (
                        <View key={measureIndex} style={styles.measureCategory}>
                          <Text style={styles.measureCategoryTitle}>{measure.category}</Text>
                          <View style={styles.measureItems}>
                            {measure.items.map((item, itemIndex) => (
                              <View key={itemIndex} style={styles.measureItem}>
                                <View style={styles.measureItemHeader}>
                                  <FontAwesome6 name="circle-check" size={14} color="#3BCCA5" />
                                  <Text style={styles.measureItemName}>{item.name}</Text>
                                </View>
                                <Text style={styles.measureItemDetails}>{item.details}</Text>
                              </View>
                            ))}
                          </View>
                        </View>
                      ))}
                    </View>
                  </View>
                );
              })}
            </ScrollView>
          )}
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* 顶部导航栏 */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleBackPress}>
          <FontAwesome6 name="arrow-left" size={20} color="#6B7280" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>AI诊断</Text>
      </View>

      {/* 主要内容区域 */}
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {renderUploadSection()}
        {renderBodyPartSection()}
        {renderDiagnosisSection()}
        {renderStudentInputSection()}
        {renderLoadingSection()}
        {renderResultSection()}
        {renderEmergencyPlanSection()}
        {renderMixedInfectionRiskSection()}
        {renderConfirmationPlanSection()}
        {renderErrorSection()}
      </ScrollView>
    </SafeAreaView>
  );
};

export default AiDiagnosisScreen;

