import React, { useState, useRef } from 'react';
import { View, Text, TouchableOpacity, ScrollView, TextInput, Image, Alert, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../App';
import * as ImagePicker from 'expo-image-picker';
import PickerModal from '../components/PickerModal';
import { styles } from '../styles';
import { authApi } from '../services/api';
import { useAuth } from '../context/UserContext';

// 定义导航类型
type AuthCertificationScreenNavigationProp = StackNavigationProp<RootStackParamList, 'AuthCertification'>;

const AuthCertificationScreen: React.FC = () => {
  const navigation = useNavigation<AuthCertificationScreenNavigationProp>();
  const route = useRoute<any>();
  
  // 获取角色参数，默认企业角色
  const userRole = route.params?.role || 'farmer_enterprise';
  
  // 状态管理
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [licenseImage, setLicenseImage] = useState<string | null>(null);
  const [qualificationImage, setQualificationImage] = useState<string | null>(null);
  const [pickerVisible, setPickerVisible] = useState(false);
  const [pickerConfig, setPickerConfig] = useState<{title: string; field: keyof typeof formData; options: {label: string; value: string}[]}>({ title: '', field: 'enterpriseType', options: [] });

  const ENTERPRISE_TYPE_OPTIONS = [
    { label: '养殖合作社', value: '养殖合作社' },
    { label: '养殖企业', value: '养殖企业' },
    { label: '养殖场', value: '养殖场' },
  ];
  const INSTITUTION_TYPE_OPTIONS = [
    { label: '疫控机构', value: '疫控机构' },
    { label: '科研院所', value: '科研院所' },
    { label: '服务商', value: '服务商' },
  ];
  
  // 表单数据
  const [formData, setFormData] = useState({
    enterpriseName: '',
    enterpriseType: '',
    contactPerson: '',
    contactPhone: '',
    schoolName: '',
    studentId: '',
    mentorCode: '',
    institutionName: '',
    institutionType: '',
  });
  
  // 处理表单输入变化
  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };
  
  // 处理图片选择
  const handleImagePicker = async (type: 'license' | 'qualification') => {
    // 请求权限
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (status !== 'granted') {
      Alert.alert('权限不足', '需要访问相册权限才能上传图片');
      return;
    }
    
    // 打开图片选择器
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    
    if (!result.canceled && result.assets[0]) {
      if (type === 'license') {
        setLicenseImage(result.assets[0].uri);
      } else {
        setQualificationImage(result.assets[0].uri);
      }
    }
  };
  
  // 处理图片拍摄
  const handleImageCapture = async (type: 'license' | 'qualification') => {
    // 请求权限
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    
    if (status !== 'granted') {
      Alert.alert('权限不足', '需要访问相机权限才能拍摄图片');
      return;
    }
    
    // 打开相机
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    
    if (!result.canceled && result.assets[0]) {
      if (type === 'license') {
        setLicenseImage(result.assets[0].uri);
      } else {
        setQualificationImage(result.assets[0].uri);
      }
    }
  };
  
  // 删除图片
  const handleRemoveImage = (type: 'license' | 'qualification') => {
    if (type === 'license') {
      setLicenseImage(null);
    } else {
      setQualificationImage(null);
    }
  };
  
  // 表单验证
  const validateForm = (): boolean => {
    if (userRole.includes('farmer')) {
      // 企业认证验证
      if (!formData.enterpriseName.trim()) {
        Alert.alert('提示', '请输入企业全称');
        return false;
      }
      if (!formData.enterpriseType) {
        Alert.alert('提示', '请选择企业类型');
        return false;
      }
      if (!formData.contactPerson.trim()) {
        Alert.alert('提示', '请输入联系人姓名');
        return false;
      }
      if (!formData.contactPhone.trim()) {
        Alert.alert('提示', '请输入联系电话');
        return false;
      } else if (!/^1[3-9]\d{9}$/.test(formData.contactPhone)) {
        Alert.alert('提示', '请输入正确的联系电话');
        return false;
      }
      if (!licenseImage) {
        Alert.alert('提示', '请上传营业执照');
        return false;
      }
    } else if (userRole.includes('student')) {
      // 学生认证验证
      if (!formData.schoolName.trim()) {
        Alert.alert('提示', '请输入学校名称');
        return false;
      }
      if (!formData.studentId.trim()) {
        Alert.alert('提示', '请输入学号');
        return false;
      }
    } else if (userRole.includes('institution')) {
      // 机构认证验证
      if (!formData.institutionName.trim()) {
        Alert.alert('提示', '请输入机构名称');
        return false;
      }
      if (!formData.institutionType) {
        Alert.alert('提示', '请选择机构类型');
        return false;
      }
      if (!qualificationImage) {
        Alert.alert('提示', '请上传资质证书');
        return false;
      }
    }
    
    return true;
  };
  
  // 处理表单提交
  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // 根据角色类型构造认证数据
      let certificationType = 'enterprise';
      let documents: any[] = [];
      let additionalInfo: any = {};

      if (userRole.includes('farmer')) {
        certificationType = 'enterprise';
        documents = licenseImage ? [{ type: 'license', url: licenseImage }] : [];
        additionalInfo = {
          enterpriseName: formData.enterpriseName,
          enterpriseType: formData.enterpriseType,
          contactPerson: formData.contactPerson,
          contactPhone: formData.contactPhone,
        };
      } else if (userRole.includes('student')) {
        certificationType = 'student';
        additionalInfo = {
          schoolName: formData.schoolName,
          studentId: formData.studentId,
          mentorCode: formData.mentorCode,
        };
      } else if (userRole.includes('institution')) {
        certificationType = 'institution';
        documents = qualificationImage ? [{ type: 'qualification', url: qualificationImage }] : [];
        additionalInfo = {
          institutionName: formData.institutionName,
          institutionType: formData.institutionType,
        };
      }

      await authApi.certify({ certificationType, documents, additionalInfo });

      Alert.alert(
        '提交成功',
        '您的认证申请已提交，我们将在1-3个工作日内完成审核，请耐心等待',
        [
          {
            text: '确定',
            onPress: () => navigation.navigate('Main')
          }
        ]
      );
    } catch (error) {
      Alert.alert('提交失败', error instanceof Error ? error.message : '认证提交失败，请稍后重试');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // 获取认证类型信息
  const getAuthTypeInfo = () => {
    if (userRole.includes('farmer')) {
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
    } else if (userRole.includes('student')) {
      return {
        title: '学生认证',
        description: '绑定学校信息，开启实习之旅',
        benefits: [
          '实习日志记录与管理',
          '导师指导与批注',
          '实习报告生成',
          '知识学习与测验'
        ]
      };
    } else if (userRole.includes('institution')) {
      return {
        title: '机构认证',
        description: '上传资质证书，获得机构权限',
        benefits: [
          '疫情监测与预警',
          '数据标注与科研协作',
          '客户管理与营销',
          '在线诊疗服务'
        ]
      };
    }
    
    return {
      title: '身份认证',
      description: '上传相关材料，获得更多功能权限',
      benefits: []
    };
  };
  
  const authTypeInfo = getAuthTypeInfo();
  
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
        <Text style={styles.loginHeaderTitle}>身份认证</Text>
        <View style={styles.loginHeaderRight} />
      </View>
      
      <ScrollView contentContainerStyle={[styles.scrollContent, { paddingBottom: 100 }]}>
        {/* 认证类型说明 */}
        <View style={styles.authTypeInfoCard}>
          <View style={styles.authTypeInfoContent}>
            <View style={styles.authTypeInfoIcon}>
              <Ionicons name="shield-checkmark" size={24} color="#2DBBA1" />
            </View>
            <View style={styles.authTypeInfoText}>
              <Text style={styles.authTypeInfoTitle}>{authTypeInfo.title}</Text>
              <Text style={styles.authTypeInfoDescription}>{authTypeInfo.description}</Text>
            </View>
          </View>
          
          <View style={styles.authBenefits}>
            <Text style={styles.authBenefitsTitle}>认证后可享受：</Text>
            {authTypeInfo.benefits.map((benefit, index) => (
              <View key={index} style={styles.authBenefitItem}>
                <Ionicons name="checkmark-circle" size={16} color="#2DBBA1" />
                <Text style={styles.authBenefitText}>{benefit}</Text>
              </View>
            ))}
          </View>
        </View>
        
        {/* 企业认证表单 */}
        {userRole.includes('farmer') && (
          <View style={styles.authFormCard}>
            <Text style={styles.authFormTitle}>企业信息</Text>
            
            <View style={styles.authFormGroup}>
              <Text style={styles.authFormLabel}>企业名称 *</Text>
              <TextInput
                style={styles.authFormInput}
                placeholder="请输入企业全称"
                value={formData.enterpriseName}
                onChangeText={(value) => handleInputChange('enterpriseName', value)}
              />
            </View>
            
            <View style={styles.authFormGroup}>
              <Text style={styles.authFormLabel}>企业类型 *</Text>
              <TouchableOpacity
                style={styles.pickerField}
                onPress={() => {
                  setPickerConfig({ title: '选择企业类型', field: 'enterpriseType', options: ENTERPRISE_TYPE_OPTIONS });
                  setPickerVisible(true);
                }}
              >
                <Text style={[styles.pickerFieldText, !formData.enterpriseType && { color: '#9CA3AF' }]}>
                  {formData.enterpriseType || '请选择企业类型'}
                </Text>
                <Ionicons name="chevron-down" size={20} color="#9CA3AF" />
              </TouchableOpacity>
            </View>
            
            <View style={styles.authFormGroup}>
              <Text style={styles.authFormLabel}>联系人 *</Text>
              <TextInput
                style={styles.authFormInput}
                placeholder="请输入联系人姓名"
                value={formData.contactPerson}
                onChangeText={(value) => handleInputChange('contactPerson', value)}
              />
            </View>
            
            <View style={styles.authFormGroup}>
              <Text style={styles.authFormLabel}>联系电话 *</Text>
              <TextInput
                style={styles.authFormInput}
                placeholder="请输入联系电话"
                value={formData.contactPhone}
                onChangeText={(value) => handleInputChange('contactPhone', value)}
                keyboardType="phone-pad"
              />
            </View>
            
            <View style={styles.authFormGroup}>
              <Text style={styles.authFormLabel}>营业执照上传 *</Text>
              {!licenseImage ? (
                <TouchableOpacity 
                  style={styles.authUploadArea}
                  onPress={() => {
                    Alert.alert(
                      '上传营业执照',
                      '',
                      [
                        { text: '拍照', onPress: () => handleImageCapture('license') },
                        { text: '从相册选择', onPress: () => handleImagePicker('license') },
                        { text: '取消', style: 'cancel' }
                      ]
                    );
                  }}
                >
                  <Ionicons name="document-attach" size={32} color="#9CA3AF" />
                  <Text style={styles.authUploadText}>点击上传营业执照照片</Text>
                  <Text style={styles.authUploadSubtext}>支持 JPG、PNG 格式，文件不超过 5MB</Text>
                </TouchableOpacity>
              ) : (
                <View style={styles.authUploadPreview}>
                  <Image source={{ uri: licenseImage }} style={styles.authUploadPreviewImage} />
                  <View style={styles.authUploadPreviewButtons}>
                    <TouchableOpacity 
                      style={styles.authUploadPreviewButton}
                      onPress={() => {
                        Alert.alert(
                          '重新上传',
                          '',
                          [
                            { text: '拍照', onPress: () => handleImageCapture('license') },
                            { text: '从相册选择', onPress: () => handleImagePicker('license') },
                            { text: '取消', style: 'cancel' }
                          ]
                        );
                      }}
                    >
                      <Text style={styles.authUploadPreviewButtonText}>重新上传</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                      style={[styles.authUploadPreviewButton, styles.authUploadPreviewButtonDelete]}
                      onPress={() => setLicenseImage(null)}
                    >
                      <Text style={[styles.authUploadPreviewButtonText, styles.authUploadPreviewButtonTextDelete]}>删除</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}
            </View>
          </View>
        )}
        
        {/* 学生认证表单 */}
        {userRole.includes('student') && (
          <View style={styles.authFormCard}>
            <Text style={styles.authFormTitle}>学生信息</Text>
            
            <View style={styles.authFormGroup}>
              <Text style={styles.authFormLabel}>学校名称 *</Text>
              <TextInput
                style={styles.authFormInput}
                placeholder="请输入学校全称"
                value={formData.schoolName}
                onChangeText={(value) => handleInputChange('schoolName', value)}
              />
            </View>
            
            <View style={styles.authFormGroup}>
              <Text style={styles.authFormLabel}>学号 *</Text>
              <TextInput
                style={styles.authFormInput}
                placeholder="请输入学号"
                value={formData.studentId}
                onChangeText={(value) => handleInputChange('studentId', value)}
              />
            </View>
            
            <View style={styles.authFormGroup}>
              <Text style={styles.authFormLabel}>导师邀请码（可选）</Text>
              <TextInput
                style={styles.authFormInput}
                placeholder="请输入导师邀请码"
                value={formData.mentorCode}
                onChangeText={(value) => handleInputChange('mentorCode', value)}
              />
            </View>
          </View>
        )}
        
        {/* 机构认证表单 */}
        {userRole.includes('institution') && (
          <View style={styles.authFormCard}>
            <Text style={styles.authFormTitle}>机构信息</Text>
            
            <View style={styles.authFormGroup}>
              <Text style={styles.authFormLabel}>机构名称 *</Text>
              <TextInput
                style={styles.authFormInput}
                placeholder="请输入机构全称"
                value={formData.institutionName}
                onChangeText={(value) => handleInputChange('institutionName', value)}
              />
            </View>
            
            <View style={styles.authFormGroup}>
              <Text style={styles.authFormLabel}>机构类型 *</Text>
              <TouchableOpacity
                style={styles.pickerField}
                onPress={() => {
                  setPickerConfig({ title: '选择机构类型', field: 'institutionType', options: INSTITUTION_TYPE_OPTIONS });
                  setPickerVisible(true);
                }}
              >
                <Text style={[styles.pickerFieldText, !formData.institutionType && { color: '#9CA3AF' }]}>
                  {formData.institutionType || '请选择机构类型'}
                </Text>
                <Ionicons name="chevron-down" size={20} color="#9CA3AF" />
              </TouchableOpacity>
            </View>
            
            <View style={styles.authFormGroup}>
              <Text style={styles.authFormLabel}>资质证书上传 *</Text>
              {!qualificationImage ? (
                <TouchableOpacity 
                  style={styles.authUploadArea}
                  onPress={() => {
                    Alert.alert(
                      '上传资质证书',
                      '',
                      [
                        { text: '拍照', onPress: () => handleImageCapture('qualification') },
                        { text: '从相册选择', onPress: () => handleImagePicker('qualification') },
                        { text: '取消', style: 'cancel' }
                      ]
                    );
                  }}
                >
                  <Ionicons name="document-text" size={32} color="#9CA3AF" />
                  <Text style={styles.authUploadText}>点击上传资质证书</Text>
                  <Text style={styles.authUploadSubtext}>兽医资格证、经营许可证等</Text>
                </TouchableOpacity>
              ) : (
                <View style={styles.authUploadPreview}>
                  <Image source={{ uri: qualificationImage }} style={styles.authUploadPreviewImage} />
                  <View style={styles.authUploadPreviewButtons}>
                    <TouchableOpacity 
                      style={styles.authUploadPreviewButton}
                      onPress={() => {
                        Alert.alert(
                          '重新上传',
                          '',
                          [
                            { text: '拍照', onPress: () => handleImageCapture('qualification') },
                            { text: '从相册选择', onPress: () => handleImagePicker('qualification') },
                            { text: '取消', style: 'cancel' }
                          ]
                        );
                      }}
                    >
                      <Text style={styles.authUploadPreviewButtonText}>重新上传</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                      style={[styles.authUploadPreviewButton, styles.authUploadPreviewButtonDelete]}
                      onPress={() => setQualificationImage(null)}
                    >
                      <Text style={[styles.authUploadPreviewButtonText, styles.authUploadPreviewButtonTextDelete]}>删除</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}
            </View>
          </View>
        )}
        
        {/* 提交按钮 */}
        <TouchableOpacity 
          style={styles.authSubmitButton}
          onPress={handleSubmit}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <ActivityIndicator color="#1F5E52" />
          ) : (
            <>
              <Ionicons name="cloud-upload" size={16} color="#1F5E52" style={{ marginRight: 8 }} />
              <Text style={{ color: '#1F5E52', fontSize: 16 }}>提交审核</Text>
            </>
          )}
        </TouchableOpacity>
        
        <Text style={styles.authSubmitNote}>
          提交后我们将在1-3个工作日内完成审核，请耐心等待
        </Text>
      </ScrollView>

      <PickerModal
        visible={pickerVisible}
        title={pickerConfig.title}
        options={pickerConfig.options}
        selectedValue={formData[pickerConfig.field]}
        onSelect={(value) => handleInputChange(pickerConfig.field, value)}
        onClose={() => setPickerVisible(false)}
      />
    </View>
  );
};

export default AuthCertificationScreen;