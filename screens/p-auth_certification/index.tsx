

import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, Alert, Platform, } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { FontAwesome5, FontAwesome6 } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import styles from './styles';
import { verifyMentorCodeApi, associateMentorApi } from '../../src/services/api';

interface AuthFormData {
  enterpriseName: string;
  contactPerson: string;
  contactPhone: string;
  enterpriseAddress: string;
  schoolName: string;
  studentId: string;
  mentorCode: string;
  institutionName: string;
  institutionType: string;
  institutionContact: string;
  institutionPhone: string;
}

interface UploadedFiles {
  license?: string;
  cert?: string;
  permit?: string;
}

type AuthStatus = 'pending' | 'approved' | 'rejected';
type UserRole = 'FARMER_ENTERPRISE' | 'STUDENT_INTERNSHIP' | 'INSTITUTION_CDC' | 'INSTITUTION_SERVICE';

const AuthCertificationScreen: React.FC = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
  
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [authStatus, setAuthStatus] = useState<AuthStatus | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFiles>({});
  
  const [formData, setFormData] = useState<AuthFormData>({
    enterpriseName: '',
    contactPerson: '',
    contactPhone: '',
    enterpriseAddress: '',
    schoolName: '',
    studentId: '',
    mentorCode: '',
    institutionName: '',
    institutionType: '',
    institutionContact: '',
    institutionPhone: '',
  });

  const userRole: UserRole = (params.role as UserRole) || 'FARMER_ENTERPRISE';
  const userId = params.userId || 'user123';

  useEffect(() => {
    updateStepProgress();
  }, [formData, uploadedFiles]);

  const handleBackPress = () => {
    if (router.canGoBack()) {
      router.back();
    }
  };

  const updateStepProgress = () => {
    const formComplete = checkFormCompletion();
    const uploadComplete = checkUploadCompletion();

    if (formComplete && uploadComplete) {
      setCurrentStep(3);
    } else if (formComplete) {
      setCurrentStep(2);
    } else {
      setCurrentStep(1);
    }
  };

  const checkFormCompletion = (): boolean => {
    const requiredFields = getRequiredFields();
    
    for (const field of requiredFields) {
      if (!formData[field as keyof AuthFormData]?.trim()) {
        return false;
      }
    }
    return true;
  };

  const checkUploadCompletion = (): boolean => {
    const requiredUploads = getRequiredUploads();
    
    if (requiredUploads.length === 0) {
      return true;
    }

    for (const upload of requiredUploads) {
      if (!uploadedFiles[upload]) {
        return false;
      }
    }
    return true;
  };

  const getRequiredFields = (): string[] => {
    switch (userRole) {
      case 'FARMER_ENTERPRISE':
        return ['enterpriseName', 'contactPerson', 'contactPhone', 'enterpriseAddress'];
      case 'STUDENT_INTERNSHIP':
        return ['schoolName', 'studentId'];
      case 'INSTITUTION_CDC':
      case 'INSTITUTION_SERVICE':
        return ['institutionName', 'institutionType', 'institutionContact', 'institutionPhone'];
      default:
        return [];
    }
  };

  const getRequiredUploads = (): (keyof UploadedFiles)[] => {
    switch (userRole) {
      case 'FARMER_ENTERPRISE':
        return ['license'];
      case 'INSTITUTION_CDC':
      case 'INSTITUTION_SERVICE':
        return ['cert', 'permit'];
      default:
        return [];
    }
  };

  const handleInputChange = (field: keyof AuthFormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleImageUpload = async (type: keyof UploadedFiles) => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (status !== 'granted') {
        Alert.alert('权限不足', '需要访问相册权限才能上传图片');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        const asset = result.assets[0];
        
        if (asset.fileSize && asset.fileSize > 5 * 1024 * 1024) {
          Alert.alert('文件过大', '文件大小不能超过5MB');
          return;
        }

        setUploadedFiles(prev => ({
          ...prev,
          [type]: asset.uri,
        }));
      }
    } catch (error) {
      Alert.alert('上传失败', '图片上传时发生错误，请重试');
    }
  };

  const handleRemoveFile = (type: keyof UploadedFiles) => {
    setUploadedFiles(prev => {
      const newFiles = { ...prev };
      delete newFiles[type];
      return newFiles;
    });
  };

  // 导师信息状态
  const [mentorInfo, setMentorInfo] = useState<{ name: string | null; school: string | null }>({ 
    name: null, 
    school: null 
  });
  const [isVerifyingMentorCode, setIsVerifyingMentorCode] = useState(false);
  const [mentorCodeError, setMentorCodeError] = useState('');

  // 验证导师邀请码
  const verifyMentorCode = async () => {
    if (!formData.mentorCode.trim()) {
      setMentorCodeError('');
      setMentorInfo({ name: null, school: null });
      return;
    }

    setIsVerifyingMentorCode(true);
    setMentorCodeError('');

    try {
      // 调用导师邀请码验证API
      const response = await verifyMentorCodeApi(formData.mentorCode);
      if (response.success && response.data) {
        setMentorInfo({ 
          name: response.data.name, 
          school: response.data.school 
        });
        setMentorCodeError('');
      } else {
        setMentorCodeError(response.message || '无效的导师邀请码');
        setMentorInfo({ name: null, school: null });
      }
    } catch (error) {
      setMentorCodeError('验证失败，请稍后重试');
      setMentorInfo({ name: null, school: null });
    } finally {
      setIsVerifyingMentorCode(false);
    }
  };

  // 导师邀请码输入变化处理
  const handleMentorCodeChange = (value: string) => {
    handleInputChange('mentorCode', value);
    if (value.trim() === '') {
      setMentorCodeError('');
      setMentorInfo({ name: null, school: null });
    }
  };

  // 导师邀请码输入完成处理
  const handleMentorCodeSubmit = () => {
    if (formData.mentorCode.trim()) {
      verifyMentorCode();
    }
  };

  const handleSubmit = async () => {
    if (!checkFormCompletion() || !checkUploadCompletion()) {
      Alert.alert('信息不完整', '请完成所有必填项');
      return;
    }

    // 额外的表单验证
    if (userRole === 'FARMER_ENTERPRISE' && formData.contactPhone.length !== 11) {
      Alert.alert('信息有误', '请输入有效的联系电话');
      return;
    }

    if (userRole === 'INSTITUTION_CDC' || userRole === 'INSTITUTION_SERVICE') {
      if (formData.institutionPhone.length !== 11) {
        Alert.alert('信息有误', '请输入有效的联系电话');
        return;
      }
    }

    // 学生认证时，如果填写了导师邀请码，需要验证通过
    if (userRole === 'STUDENT_INTERNSHIP' && formData.mentorCode.trim() && !mentorInfo.name) {
      Alert.alert('信息有误', '请验证导师邀请码');
      return;
    }

    setIsSubmitting(true);

    try {
      // 模拟提交过程
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // 如果是学生认证且填写了导师邀请码，关联导师
      if (userRole === 'STUDENT_INTERNSHIP' && formData.mentorCode.trim() && mentorInfo.name) {
        await associateMentorApi({
          studentId: formData.studentId,
          mentorCode: formData.mentorCode
        });
      }
      
      // 模拟随机审核结果（实际应用中应根据后端返回结果设置）
      const randomResult = Math.random();
      if (randomResult > 0.7) {
        setAuthStatus('approved');
      } else if (randomResult > 0.3) {
        setAuthStatus('pending');
      } else {
        setAuthStatus('rejected');
      }
    } catch (error) {
      Alert.alert('提交失败', '提交时发生错误，请检查网络连接后重试');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCheckStatus = () => {
    Alert.alert('审核中', '您的认证材料正在审核中，请耐心等待...');
  };

  const handleCancelAuth = () => {
    Alert.alert(
      '取消认证',
      '确定要取消认证吗？',
      [
        { text: '取消', style: 'cancel' },
        { 
          text: '确定', 
          onPress: () => router.push('/p-role_select')
        },
      ]
    );
  };

  const handleContinue = () => {
    switch (userRole) {
      case 'FARMER_ENTERPRISE':
        router.push('/p-home_farmer_enterprise');
        break;
      case 'STUDENT_INTERNSHIP':
        router.push('/p-home_student_internship');
        break;
      case 'INSTITUTION_CDC':
        router.push('/p-home_institution_cdc');
        break;
      case 'INSTITUTION_SERVICE':
        router.push('/p-home_institution_service');
        break;
      default:
        router.push('/p-home_farmer_small');
    }
  };

  const handleRetry = () => {
    setAuthStatus(null);
    setFormData({
      enterpriseName: '',
      contactPerson: '',
      contactPhone: '',
      enterpriseAddress: '',
      schoolName: '',
      studentId: '',
      mentorCode: '',
      institutionName: '',
      institutionType: '',
      institutionContact: '',
      institutionPhone: '',
    });
    setUploadedFiles({});
  };

  const renderStepIndicator = () => (
    <View style={styles.stepIndicatorContainer}>
      <View style={styles.stepWrapper}>
        <View style={[
          styles.stepCircle,
          currentStep >= 1 ? styles.stepCompleted : styles.stepPending
        ]}>
          {currentStep > 1 ? (
            <FontAwesome6 name="check" size={12} color="#2B6A5A" />
          ) : (
            <Text style={[
              styles.stepText,
              currentStep === 1 ? styles.stepActiveText : styles.stepPendingText
            ]}>1</Text>
          )}
        </View>
        <Text style={styles.stepLabel}>填写信息</Text>
      </View>

      <View style={styles.stepProgressContainer}>
        <View style={[
          styles.stepProgress,
          { width: currentStep > 1 ? '100%' : '0%' }
        ]} />
      </View>

      <View style={styles.stepWrapper}>
        <View style={[
          styles.stepCircle,
          currentStep >= 2 ? styles.stepCompleted : styles.stepPending
        ]}>
          {currentStep > 2 ? (
            <FontAwesome6 name="check" size={12} color="#2B6A5A" />
          ) : (
            <Text style={[
              styles.stepText,
              currentStep === 2 ? styles.stepActiveText : styles.stepPendingText
            ]}>2</Text>
          )}
        </View>
        <Text style={styles.stepLabel}>上传材料</Text>
      </View>

      <View style={styles.stepProgressContainer}>
        <View style={[
          styles.stepProgress,
          { width: currentStep > 2 ? '100%' : '0%' }
        ]} />
      </View>

      <View style={styles.stepWrapper}>
        <View style={[
          styles.stepCircle,
          currentStep >= 3 ? styles.stepCompleted : styles.stepPending
        ]}>
          {authStatus === 'approved' ? (
            <FontAwesome6 name="check" size={12} color="#2B6A5A" />
          ) : (
            <Text style={[
              styles.stepText,
              currentStep === 3 ? styles.stepActiveText : styles.stepPendingText
            ]}>3</Text>
          )}
        </View>
        <Text style={styles.stepLabel}>审核完成</Text>
      </View>
    </View>
  );

  const renderAuthTypeInfo = () => {
    const getAuthInfo = () => {
      switch (userRole) {
        case 'FARMER_ENTERPRISE':
          return {
            title: '养殖企业认证',
            description: '上传营业执照，解锁企业管理功能',
            benefits: [
              '批次管理与生产数据分析',
              '员工权限管理',
              '大宗采购优惠',
              '数据导出与报表功能'
            ]
          };
        case 'STUDENT_INTERNSHIP':
          return {
            title: '学生认证',
            description: '绑定学校信息，开启实习之旅',
            benefits: [
              '实习日志管理',
              '导师指导功能',
              '学习资源访问',
              '实习考核评估'
            ]
          };
        case 'INSTITUTION_CDC':
          return {
            title: '疫控机构认证',
            description: '上传相关资质，获得疫情监测权限',
            benefits: [
              '疫情数据监测',
              '疫情预警功能',
              '政策下发管理',
              '区域疫情分析'
            ]
          };
        case 'INSTITUTION_SERVICE':
          return {
            title: '服务商认证',
            description: '上传经营资质，开启商业服务功能',
            benefits: [
              '客户管理系统',
              '服务订单管理',
              '广告投放功能',
              '在线诊疗服务'
            ]
          };
        default:
          return {
            title: '身份认证',
            description: '完成认证，解锁更多功能',
            benefits: []
          };
      }
    };

    const authInfo = getAuthInfo();

    return (
      <View style={styles.authTypeCard}>
        <View style={styles.authTypeHeader}>
          <View style={styles.authIconContainer}>
            <FontAwesome5 name="shield-alt" size={20} color="#3BCCA5" />
          </View>
          <View style={styles.authTypeTextContainer}>
            <Text style={styles.authTypeTitle}>{authInfo.title}</Text>
            <Text style={styles.authTypeDescription}>{authInfo.description}</Text>
          </View>
        </View>
        <View style={styles.authBenefitsContainer}>
          <Text style={styles.authBenefitsTitle}>认证后可享受：</Text>
          {authInfo.benefits.map((benefit, index) => (
            <View key={index} style={styles.benefitItem}>
              <FontAwesome6 name="check" size={12} color="#3BCCA5" style={styles.benefitIcon} />
              <Text style={styles.benefitText}>{benefit}</Text>
            </View>
          ))}
        </View>
      </View>
    );
  };

  const renderFormSection = () => {
    const renderEnterpriseForm = () => (
      <View style={styles.formSection}>
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>企业名称 *</Text>
          <TextInput
            style={styles.textInput}
            placeholder="请输入企业全称"
            value={formData.enterpriseName}
            onChangeText={(value) => handleInputChange('enterpriseName', value)}
            placeholderTextColor="#9CA3AF"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>联系人 *</Text>
          <TextInput
            style={styles.textInput}
            placeholder="请输入联系人姓名"
            value={formData.contactPerson}
            onChangeText={(value) => handleInputChange('contactPerson', value)}
            placeholderTextColor="#9CA3AF"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>联系电话 *</Text>
          <TextInput
            style={styles.textInput}
            placeholder="请输入联系电话"
            value={formData.contactPhone}
            onChangeText={(value) => handleInputChange('contactPhone', value)}
            keyboardType="phone-pad"
            placeholderTextColor="#9CA3AF"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>企业地址 *</Text>
          <TextInput
            style={[styles.textInput, styles.textArea]}
            placeholder="请输入企业详细地址"
            value={formData.enterpriseAddress}
            onChangeText={(value) => handleInputChange('enterpriseAddress', value)}
            multiline
            numberOfLines={3}
            textAlignVertical="top"
            placeholderTextColor="#9CA3AF"
          />
        </View>
      </View>
    );

    const renderStudentForm = () => (
      <View style={styles.formSection}>
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>学校名称 *</Text>
          <TextInput
            style={styles.textInput}
            placeholder="请输入学校全称"
            value={formData.schoolName}
            onChangeText={(value) => handleInputChange('schoolName', value)}
            placeholderTextColor="#9CA3AF"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>学号 *</Text>
          <TextInput
            style={styles.textInput}
            placeholder="请输入学号"
            value={formData.studentId}
            onChangeText={(value) => handleInputChange('studentId', value)}
            placeholderTextColor="#9CA3AF"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>导师邀请码</Text>
          <View style={styles.mentorCodeContainer}>
            <TextInput
              style={styles.mentorCodeInput}
              placeholder="请输入导师邀请码（可选）"
              value={formData.mentorCode}
              onChangeText={handleMentorCodeChange}
              onSubmitEditing={handleMentorCodeSubmit}
              returnKeyType="done"
              placeholderTextColor="#9CA3AF"
            />
            <TouchableOpacity
              style={[styles.verifyButton, isVerifyingMentorCode && styles.verifyButtonDisabled]}
              onPress={verifyMentorCode}
              disabled={!formData.mentorCode.trim() || isVerifyingMentorCode}
            >
              <Text style={styles.verifyButtonText}>
                {isVerifyingMentorCode ? '验证中...' : '验证'}
              </Text>
            </TouchableOpacity>
          </View>
          {mentorCodeError ? (
            <Text style={styles.errorText}>{mentorCodeError}</Text>
          ) : null}
          {mentorInfo.name ? (
            <View style={styles.mentorInfoContainer}>
              <FontAwesome6 name="check-circle" size={16} color="#10B981" style={styles.mentorInfoIcon} />
              <Text style={styles.mentorInfoText}>
                导师：{mentorInfo.name}（{mentorInfo.school}）
              </Text>
            </View>
          ) : null}
        </View>
      </View>
    );

    const renderInstitutionForm = () => {
    const institutionTypes = ['疫控机构', '科研院所', '服务商'];
    
    return (
      <View style={styles.formSection}>
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>机构名称 *</Text>
          <TextInput
            style={styles.textInput}
            placeholder="请输入机构全称"
            value={formData.institutionName}
            onChangeText={(value) => handleInputChange('institutionName', value)}
            placeholderTextColor="#9CA3AF"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>机构类型 *</Text>
          <View style={styles.selectContainer}>
            {institutionTypes.map((type, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.selectItem,
                  formData.institutionType === type && styles.selectItemSelected
                ]}
                onPress={() => handleInputChange('institutionType', type)}
              >
                <Text style={[
                  styles.selectItemText,
                  formData.institutionType === type && styles.selectItemTextSelected
                ]}>
                  {type}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>联系人 *</Text>
          <TextInput
            style={styles.textInput}
            placeholder="请输入联系人姓名"
            value={formData.institutionContact}
            onChangeText={(value) => handleInputChange('institutionContact', value)}
            placeholderTextColor="#9CA3AF"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>联系电话 *</Text>
          <TextInput
            style={styles.textInput}
            placeholder="请输入联系电话"
            value={formData.institutionPhone}
            onChangeText={(value) => handleInputChange('institutionPhone', value)}
            keyboardType="phone-pad"
            placeholderTextColor="#9CA3AF"
          />
        </View>
      </View>
    );
  };

    // 根据用户角色返回不同的表单
    switch (userRole) {
      case 'FARMER_ENTERPRISE':
        return renderEnterpriseForm();
      case 'STUDENT_INTERNSHIP':
        return renderStudentForm();
      case 'INSTITUTION_CDC':
      case 'INSTITUTION_SERVICE':
        return renderInstitutionForm();
      default:
        return null;
    }
  };

  const renderUploadSection = () => {
    const renderUploadItem = (
      type: keyof UploadedFiles,
      label: string,
      uploadText: string
    ) => (
      <View style={styles.uploadItem}>
        <Text style={styles.uploadLabel}>{label} *</Text>
        <TouchableOpacity
          style={styles.uploadArea}
          onPress={() => handleImageUpload(type)}
          activeOpacity={0.7}
        >
          {uploadedFiles[type] ? (
            <View style={styles.uploadPreview}>
              <View style={styles.previewImage}>
                <FontAwesome6 name="image" size={24} color="#3BCCA5" />
              </View>
              <TouchableOpacity
                style={styles.removeButton}
                onPress={() => handleRemoveFile(type)}
              >
                <FontAwesome6 name="trash" size={12} color="#EF4444" />
                <Text style={styles.removeButtonText}>删除</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.uploadContent}>
              <FontAwesome6 name="cloud-arrow-up" size={32} color="#3BCCA5" />
              <Text style={styles.uploadText}>{uploadText}</Text>
              <Text style={styles.uploadSubtext}>支持 JPG、PNG 格式，文件不超过 5MB</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>
    );

    const requiredUploads = getRequiredUploads();
    
    if (requiredUploads.length === 0) {
      return null;
    }

    return (
      <View style={styles.uploadSection}>
        <Text style={styles.uploadSectionTitle}>上传认证材料</Text>
        
        {userRole === 'FARMER_ENTERPRISE' && (
          renderUploadItem('license', '营业执照', '点击上传营业执照')
        )}
        
        {(userRole === 'INSTITUTION_CDC' || userRole === 'INSTITUTION_SERVICE') && (
          <>
            {renderUploadItem('cert', '兽医资格证', '点击上传兽医资格证')}
            {renderUploadItem('permit', '经营许可证', '点击上传经营许可证')}
          </>
        )}
      </View>
    );
  };

  const renderAuthStatus = () => {
    if (!authStatus) {
      return null;
    }

    const renderPendingStatus = () => (
      <View style={styles.statusContainer}>
        <View style={styles.statusIconContainer}>
          <FontAwesome6 name="clock" size={24} color="#F59E0B" />
        </View>
        <Text style={styles.statusTitle}>审核中</Text>
        <Text style={styles.statusDescription}>
          您的认证材料已提交，我们将在 1-3 个工作日内完成审核
        </Text>
        <View style={styles.statusButtonsContainer}>
          <TouchableOpacity style={styles.statusButton} onPress={handleCheckStatus}>
            <Text style={styles.statusButtonText}>查看进度</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.statusButtonSecondary} onPress={handleCancelAuth}>
            <Text style={styles.statusButtonSecondaryText}>取消认证</Text>
          </TouchableOpacity>
        </View>
      </View>
    );

    const renderApprovedStatus = () => (
      <View style={styles.statusContainer}>
        <View style={[styles.statusIconContainer, styles.approvedIcon]}>
          <FontAwesome6 name="check" size={24} color="#10B981" />
        </View>
        <Text style={styles.statusTitle}>认证通过</Text>
        <Text style={styles.statusDescription}>
          恭喜！您的身份认证已通过，现在可以享受更多功能
        </Text>
        <TouchableOpacity style={styles.continueButton} onPress={handleContinue}>
          <Text style={styles.continueButtonText}>继续使用</Text>
        </TouchableOpacity>
      </View>
    );

    const renderRejectedStatus = () => (
      <View style={styles.statusContainer}>
        <View style={[styles.statusIconContainer, styles.rejectedIcon]}>
          <FontAwesome6 name="xmark" size={24} color="#EF4444" />
        </View>
        <Text style={styles.statusTitle}>认证失败</Text>
        <Text style={styles.statusDescription}>
          您的认证材料未能通过审核，请检查材料后重新提交
        </Text>
        <TouchableOpacity style={styles.retryButton} onPress={handleRetry}>
          <Text style={styles.retryButtonText}>重新提交</Text>
        </TouchableOpacity>
      </View>
    );

    switch (authStatus) {
      case 'pending':
        return renderPendingStatus();
      case 'approved':
        return renderApprovedStatus();
      case 'rejected':
        return renderRejectedStatus();
      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* 顶部导航栏 */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleBackPress}>
          <FontAwesome6 name="arrow-left" size={20} color="#6B7280" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>身份认证</Text>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* 认证步骤指示器 */}
        {renderStepIndicator()}

        {/* 认证类型说明 */}
        {renderAuthTypeInfo()}

        {/* 认证状态显示 */}
        {authStatus ? (
          renderAuthStatus()
        ) : (
          <>
            {/* 认证表单 */}
            {renderFormSection()}

            {/* 图片上传区域 */}
            {renderUploadSection()}

            {/* 提交按钮 */}
            <View style={styles.submitSection}>
              <TouchableOpacity
                style={[
                  styles.submitButton,
                  (!checkFormCompletion() || !checkUploadCompletion() || isSubmitting) && styles.submitButtonDisabled
                ]}
                onPress={handleSubmit}
                disabled={!checkFormCompletion() || !checkUploadCompletion() || isSubmitting}
                activeOpacity={0.8}
              >
                <Text style={styles.submitButtonText}>
                  {isSubmitting ? '提交中...' : '提交审核'}
                </Text>
              </TouchableOpacity>
              <Text style={styles.submitNote}>
                提交后我们将在 1-3 个工作日内完成审核，请耐心等待
              </Text>
            </View>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default AuthCertificationScreen;

