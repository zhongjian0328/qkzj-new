import { colors } from '../theme';
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Image, ActivityIndicator, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../context/UserContext';
import Button from '../components/Button';
import Header from '../components/Header';
import Input from '../components/Input';
import PickerModal from '../components/PickerModal';
import { styles } from '../styles';
import { aiDiagnosisApi } from '../services/api';
import * as ImagePicker from 'expo-image-picker';

const VeterinaryDiagnosisScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const { state } = useAuth();
  const { user } = state;
  
  // 基本信息
  const [basicInfo, setBasicInfo] = useState({
    farmLocation: '',
    chickenBreed: '',
    ageDays: '',
    stockQuantity: '',
    onsetTime: '',
    mortalityRate: ''
  });
  
  // 临床症状
  const [clinicalSymptoms, setClinicalSymptoms] = useState({
    symptoms: [] as string[],
    averageTemperature: '',
    respiratoryRate: '',
    mortalityRate: '',
    feedDecrease: ''
  });
  
  // 病理变化
  const [pathologicalChanges, setPathologicalChanges] = useState({
    lesions: [] as string[],
    description: ''
  });
  
  // 快速检测结果
  const [rapidTestResults, setRapidTestResults] = useState({
    aivTest: '',
    ndvTest: '',
    ibvTest: ''
  });
  
  // 采样信息
  const [samplingInfo, setSamplingInfo] = useState({
    sampleCount: '',
    preservationCondition: '',
    samplingSites: [] as string[]
  });
  
  // 实验数据
  const [experimentalData, setExperimentalData] = useState({
    bloodRoutine: {
      wbcCount: '',
      rbcCount: ''
    },
    biochemical: {
      altLevel: '',
      astLevel: ''
    },
    description: ''
  });
  
  // 学生诊断输入
  const [studentDiagnosisInput, setStudentDiagnosisInput] = useState('');
  
  // 图像URLs
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  
  // 加载状态
  const [loading, setLoading] = useState(false);
  
  // 当前激活的标签页
  const [activeTab, setActiveTab] = useState<string>('basic');
  
  // 当前阶段
  const [currentStage, setCurrentStage] = useState(1);
  
  // 诊断结果
  const [diagnosisResult, setDiagnosisResult] = useState<any>(null);
  
  // 学生诊断提交状态
  const [studentDiagnosisSubmitted, setStudentDiagnosisSubmitted] = useState(false);
  
  // 学生诊断评分
  const [studentDiagnosisScore, setStudentDiagnosisScore] = useState<number | null>(null);
  
  // 导师点评
  const [mentorComments, setMentorComments] = useState<string>('');

  // Picker 状态
  const [pickerVisible, setPickerVisible] = useState(false);
  const [pickerTitle, setPickerTitle] = useState('');
  const [pickerOptions, setPickerOptions] = useState<{label: string; value: string}[]>([]);
  const [pickerField, setPickerField] = useState<{section: string; field: string; subField?: string} | null>(null);

  // 枚举选项
  const BREED_OPTIONS = [
    { label: '白羽肉鸡', value: '白羽肉鸡' },
    { label: '黄羽肉鸡', value: '黄羽肉鸡' },
    { label: '蛋鸡（海兰）', value: '蛋鸡（海兰）' },
    { label: '蛋鸡（罗曼）', value: '蛋鸡（罗曼）' },
    { label: '土鸡/散养鸡', value: '土鸡/散养鸡' },
    { label: '乌鸡', value: '乌鸡' },
    { label: '其他', value: '其他' },
  ];
  const TEST_RESULT_OPTIONS = [
    { label: '阳性', value: 'positive' },
    { label: '阴性', value: 'negative' },
    { label: '疑似', value: 'suspected' },
    { label: '未检测', value: 'not_tested' },
  ];
  const PRESERVATION_OPTIONS = [
    { label: '冷藏（2-8°C）', value: '冷藏（2-8°C）' },
    { label: '冷冻（-20°C）', value: '冷冻（-20°C）' },
    { label: '常温', value: '常温' },
  ];

  const openPicker = (title: string, options: {label: string; value: string}[], section: string, field: string, subField?: string) => {
    setPickerTitle(title);
    setPickerOptions(options);
    setPickerField({ section, field, subField });
    setPickerVisible(true);
  };

  const handlePickerSelect = (value: string) => {
    if (pickerField) {
      handleInputChange(pickerField.section, pickerField.field, value, pickerField.subField);
    }
  };

  const getPickerSelectedValue = (): string => {
    if (!pickerField) return '';
    const { section, field, subField } = pickerField;
    switch (section) {
      case 'basicInfo': return (basicInfo as any)[field] || '';
      case 'rapidTestResults': return (rapidTestResults as any)[field] || '';
      case 'samplingInfo': return (samplingInfo as any)[field] || '';
      default: return '';
    }
  };

  const handleInputChange = (section: string, field: string, value: string, subField?: string) => {
    switch (section) {
      case 'basicInfo':
        setBasicInfo(prev => ({ ...prev, [field]: value }));
        break;
      case 'clinicalSymptoms':
        setClinicalSymptoms(prev => ({ ...prev, [field]: value }));
        break;
      case 'pathologicalChanges':
        setPathologicalChanges(prev => ({ ...prev, [field]: value }));
        break;
      case 'rapidTestResults':
        setRapidTestResults(prev => ({ ...prev, [field]: value }));
        break;
      case 'samplingInfo':
        setSamplingInfo(prev => ({ ...prev, [field]: value }));
        break;
      case 'experimentalData':
        if (subField) {
          setExperimentalData(prev => {
            const currentFieldData = prev[field as keyof typeof prev];
            return {
              ...prev,
              [field]: {
                ...(typeof currentFieldData === 'object' && currentFieldData !== null ? currentFieldData : {}),
                [subField]: value
              }
            };
          });
        } else {
          setExperimentalData(prev => ({ ...prev, [field]: value }));
        }
        break;
      default:
        break;
    }
  };

  const toggleSymptom = (symptom: string) => {
    setClinicalSymptoms(prev => {
      if (prev.symptoms.includes(symptom)) {
        return {
          ...prev,
          symptoms: prev.symptoms.filter(s => s !== symptom)
        };
      } else {
        return {
          ...prev,
          symptoms: [...prev.symptoms, symptom]
        };
      }
    });
  };

  const togglePathologicalChange = (change: string) => {
    setPathologicalChanges(prev => {
      if (prev.lesions.includes(change)) {
        return {
          ...prev,
          lesions: prev.lesions.filter(c => c !== change)
        };
      } else {
        return {
          ...prev,
          lesions: [...prev.lesions, change]
        };
      }
    });
  };

  const toggleSamplingSite = (site: string) => {
    setSamplingInfo(prev => {
      if (prev.samplingSites.includes(site)) {
        return {
          ...prev,
          samplingSites: prev.samplingSites.filter(s => s !== site)
        };
      } else {
        return {
          ...prev,
          samplingSites: [...prev.samplingSites, site]
        };
      }
    });
  };

  const pickImage = async () => {
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
      quality: 0.8,
    });
    
    if (!result.canceled && result.assets[0]) {
      setImageUrls(prev => [...prev, result.assets[0].uri]);
    }
  };

  const removeImage = (index: number) => {
    setImageUrls(prev => prev.filter((_, i) => i !== index));
  };

  const submitDiagnosis = async () => {
    setLoading(true);
    
    try {
      // 准备符合API格式的数据
      const formattedData = {
        basicInfo: {
          farmLocation: basicInfo.farmLocation,
          chickenBreed: basicInfo.chickenBreed,
          ageDays: parseInt(basicInfo.ageDays) || 0,
          stockQuantity: parseInt(basicInfo.stockQuantity) || 0,
          onsetTime: basicInfo.onsetTime
        },
        clinicalSymptoms: {
          symptoms: clinicalSymptoms.symptoms,
          mortalityRate: parseFloat(basicInfo.mortalityRate) || 0,
          // 使用symptomDescription作为描述
          description: '',
          averageTemperature: parseFloat(clinicalSymptoms.averageTemperature) || 0,
          respiratoryRate: parseFloat(clinicalSymptoms.respiratoryRate) || 0,
          feedDecrease: parseFloat(clinicalSymptoms.feedDecrease) || 0
        },
        pathologicalChanges: {
          lesions: pathologicalChanges.lesions,
          description: pathologicalChanges.description
        },
        rapidTestResults: {
          // 根据实际检测类型映射到API预期的字段
          aivTest: rapidTestResults.aivTest,
          ndvTest: rapidTestResults.ndvTest,
          ibvTest: rapidTestResults.ibvTest
        },
        samplingInfo: {
          sampleCount: parseInt(samplingInfo.sampleCount) || 0,
          preservationCondition: samplingInfo.preservationCondition,
          samplingSites: samplingInfo.samplingSites
        },
        experimentalData: {
          experiments: [],
          // 根据数据类型映射到相应的检测结果字段
          bloodRoutine: {
            wbcCount: parseFloat(experimentalData.bloodRoutine.wbcCount) || 0,
            rbcCount: parseFloat(experimentalData.bloodRoutine.rbcCount) || 0
          },
          biochemical: {
            altLevel: parseFloat(experimentalData.biochemical.altLevel) || 0,
            astLevel: parseFloat(experimentalData.biochemical.astLevel) || 0
          },
          description: experimentalData.description
        },
        imageUrls,
        studentDiagnosisInput: user?.roleType === 'STUDENT' ? studentDiagnosisInput : ''
      };
      
      // 调用兽医模式诊断API
    const response = await aiDiagnosisApi.vetDiagnosis(formattedData);
    
    // 诊断成功，导航到诊断报告页面
    if (response.data?.diagnosisId) {
      navigation.navigate('DiagnosisReport', { diagnosisId: response.data.diagnosisId });
    }
    } catch (error: any) {
      console.error('兽医模式诊断失败:', error);
      // 显示错误信息
      Alert.alert(
        '诊断失败',
        error.response?.data?.message || '请检查网络连接后重试'
      );
    } finally {
      setLoading(false);
    }
  };

  const renderStageIndicator = () => {
    return (
      <View style={styles.stageIndicatorContainer}>
        <View style={styles.stageIndicator}>
          <View 
            style={[
              styles.stageItem, 
              currentStage === 1 && styles.stageActive
            ]}
          >
            <View style={[styles.stageCircle, currentStage === 1 && styles.stageActive]}>
              <Text style={[styles.stageCircleText, currentStage === 1 && styles.stageActiveText]}>1</Text>
            </View>
            <Text style={[styles.stageText, currentStage === 1 && styles.stageActiveText]}>基础信息</Text>
          </View>
          <View style={[styles.stageLine, currentStage === 2 && styles.stageActive]} />
          <View 
            style={[
              styles.stageItem, 
              currentStage === 2 && styles.stageActive
            ]}
          >
            <View style={[styles.stageCircle, currentStage === 2 && styles.stageActive]}>
              <Text style={[styles.stageCircleText, currentStage === 2 && styles.stageActiveText]}>2</Text>
            </View>
            <Text style={[styles.stageText, currentStage === 2 && styles.stageActiveText]}>综合数据</Text>
          </View>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* 顶部导航栏 */}
      <Header 
        title="AI兽医诊断" 
        showBackButton 
        onBack={() => navigation.goBack()} 
      />
      
      {/* 主要内容区域 */}
      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 16 }}>
        {/* 阶段指示器 */}
        {renderStageIndicator()}
        
        {/* 数据录入标签页 */}
        <View style={styles.tabContainer}>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            style={styles.tabScrollView}
          >
            <TouchableOpacity
              style={[
                styles.tabButton,
                activeTab === 'basic' && styles.tabActive
              ]}
              onPress={() => setActiveTab('basic')}
            >
              <Text style={[
                styles.tabButtonText,
                activeTab === 'basic' && styles.tabButtonTextActive
              ]}>
                基础信息
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[
                styles.tabButton,
                activeTab === 'clinical' && styles.tabActive
              ]}
              onPress={() => setActiveTab('clinical')}
            >
              <Text style={[
                styles.tabButtonText,
                activeTab === 'clinical' && styles.tabButtonTextActive
              ]}>
                临床表现
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[
                styles.tabButton,
                activeTab === 'pathological' && styles.tabActive
              ]}
              onPress={() => setActiveTab('pathological')}
            >
              <Text style={[
                styles.tabButtonText,
                activeTab === 'pathological' && styles.tabButtonTextActive
              ]}>
                病理变化
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[
                styles.tabButton,
                activeTab === 'rapidTest' && styles.tabActive
              ]}
              onPress={() => setActiveTab('rapidTest')}
            >
              <Text style={[
                styles.tabButtonText,
                activeTab === 'rapidTest' && styles.tabButtonTextActive
              ]}>
                快速检测
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[
                styles.tabButton,
                activeTab === 'sampling' && styles.tabActive
              ]}
              onPress={() => setActiveTab('sampling')}
            >
              <Text style={[
                styles.tabButtonText,
                activeTab === 'sampling' && styles.tabButtonTextActive
              ]}>
                采样信息
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[
                styles.tabButton,
                activeTab === 'experiment' && styles.tabActive
              ]}
              onPress={() => setActiveTab('experiment')}
            >
              <Text style={[
                styles.tabButtonText,
                activeTab === 'experiment' && styles.tabButtonTextActive
              ]}>
                实验数据
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
        
        {/* 基础信息标签页内容 */}
        {activeTab === 'basic' && (
          <View style={styles.tabContent}>
            <Input
              label="场址"
              value={basicInfo.farmLocation}
              onChangeText={(value) => handleInputChange('basicInfo', 'farmLocation', value)}
              placeholder="请输入养殖场地址"
            />
            
            <Text style={styles.formLabel}>鸡只品种</Text>
            <TouchableOpacity
              style={styles.pickerField}
              onPress={() => openPicker('选择品种', BREED_OPTIONS, 'basicInfo', 'chickenBreed')}
            >
              <Text style={[styles.pickerFieldText, !basicInfo.chickenBreed && { color: colors.textDisabled }]}>
                {basicInfo.chickenBreed || '请选择品种'}
              </Text>
              <Ionicons name="chevron-down" size={20} color={colors.textDisabled} />
            </TouchableOpacity>
            
            <View style={styles.formGrid}>
              <Input
                label="日龄"
                value={basicInfo.ageDays}
                onChangeText={(value) => handleInputChange('basicInfo', 'ageDays', value)}
                placeholder="如：45"
                keyboardType="numeric"
                style={styles.gridItem}
              />
              
              <Input
                label="存栏量"
                value={basicInfo.stockQuantity}
                onChangeText={(value) => handleInputChange('basicInfo', 'stockQuantity', value)}
                placeholder="如：5000"
                keyboardType="numeric"
                style={styles.gridItem}
              />
            </View>
            
            <Input
              label="发病时间"
              value={basicInfo.onsetTime}
              onChangeText={(value) => handleInputChange('basicInfo', 'onsetTime', value)}
              placeholder="请输入发病时间"
            />
            
            <Input
              label="死亡率 (%)"
              value={basicInfo.mortalityRate}
              onChangeText={(value) => handleInputChange('basicInfo', 'mortalityRate', value)}
              placeholder="如：2.5"
              keyboardType="numeric"
            />
          </View>
        )}
        
        {/* 临床表现标签页内容 */}
        {activeTab === 'clinical' && (
          <View style={styles.tabContent}>
            <Text style={styles.sectionTitle}>核心症状（可多选）</Text>
            <View style={styles.symptomGrid}>
              {['发热', '咳嗽', '腹泻', '精神沉郁', '呼吸困难', '采食量下降'].map((symptom) => (
                <TouchableOpacity 
                  key={symptom}
                  style={[
                    styles.symptomItem,
                    clinicalSymptoms.symptoms.includes(symptom) && styles.symptomItemSelected
                  ]}
                  onPress={() => toggleSymptom(symptom)}
                >
                  <Text 
                    style={[
                      styles.symptomItemText,
                      clinicalSymptoms.symptoms.includes(symptom) && styles.symptomItemTextSelected
                    ]}
                  >
                    {symptom}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            
            <View style={styles.formGrid}>
              <Input
                label="平均体温 (°C)"
                value={clinicalSymptoms.averageTemperature}
                onChangeText={(value) => handleInputChange('clinicalSymptoms', 'averageTemperature', value)}
                placeholder="如：41.5"
                keyboardType="numeric"
                style={styles.gridItem}
              />
              
              <Input
                label="呼吸频率 (次/分)"
                value={clinicalSymptoms.respiratoryRate}
                onChangeText={(value) => handleInputChange('clinicalSymptoms', 'respiratoryRate', value)}
                placeholder="如：35"
                keyboardType="numeric"
                style={styles.gridItem}
              />
            </View>
            
            <Input
              label="采食量下降 (%)"
              value={clinicalSymptoms.feedDecrease}
              onChangeText={(value) => handleInputChange('clinicalSymptoms', 'feedDecrease', value)}
              placeholder="如：20"
              keyboardType="numeric"
            />
          </View>
        )}
        
        {/* 病理变化标签页内容 */}
        {activeTab === 'pathological' && (
          <View style={styles.tabContent}>
            <Text style={styles.sectionTitle}>特征病变部位（可多选）</Text>
            <View style={styles.symptomGrid}>
              {['肺部', '肝脏', '肾脏', '肠道', '心脏', '脾脏'].map((lesion) => (
                <TouchableOpacity 
                  key={lesion}
                  style={[
                    styles.symptomItem,
                    pathologicalChanges.lesions.includes(lesion) && styles.symptomItemSelected
                  ]}
                  onPress={() => togglePathologicalChange(lesion)}
                >
                  <Text 
                    style={[
                      styles.symptomItemText,
                      pathologicalChanges.lesions.includes(lesion) && styles.symptomItemTextSelected
                    ]}
                  >
                    {lesion}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            
            <Input
              label="病变描述"
              value={pathologicalChanges.description}
              onChangeText={(value) => handleInputChange('pathologicalChanges', 'description', value)}
              placeholder="请描述观察到的病理变化..."
              multiline
              numberOfLines={4}
            />
          </View>
        )}
        
        {/* 快速检测结果标签页内容 */}
        {activeTab === 'rapidTest' && (
          <View style={styles.tabContent}>
            <Text style={styles.sectionTitle}>病原检测项目</Text>
            
            <View style={styles.testResultItem}>
              <Text style={styles.testResultLabel}>禽流感病毒 (AIV)</Text>
              <TouchableOpacity
                style={styles.pickerField}
                onPress={() => openPicker('AIV检测结果', TEST_RESULT_OPTIONS, 'rapidTestResults', 'aivTest')}
              >
                <Text style={[styles.pickerFieldText, !rapidTestResults.aivTest && { color: colors.textDisabled }]}>
                  {TEST_RESULT_OPTIONS.find(o => o.value === rapidTestResults.aivTest)?.label || '请选择检测结果'}
                </Text>
                <Ionicons name="chevron-down" size={20} color={colors.textDisabled} />
              </TouchableOpacity>
            </View>

            <View style={styles.testResultItem}>
              <Text style={styles.testResultLabel}>新城疫病毒 (NDV)</Text>
              <TouchableOpacity
                style={styles.pickerField}
                onPress={() => openPicker('NDV检测结果', TEST_RESULT_OPTIONS, 'rapidTestResults', 'ndvTest')}
              >
                <Text style={[styles.pickerFieldText, !rapidTestResults.ndvTest && { color: colors.textDisabled }]}>
                  {TEST_RESULT_OPTIONS.find(o => o.value === rapidTestResults.ndvTest)?.label || '请选择检测结果'}
                </Text>
                <Ionicons name="chevron-down" size={20} color={colors.textDisabled} />
              </TouchableOpacity>
            </View>

            <View style={styles.testResultItem}>
              <Text style={styles.testResultLabel}>传染性支气管炎 (IBV)</Text>
              <TouchableOpacity
                style={styles.pickerField}
                onPress={() => openPicker('IBV检测结果', TEST_RESULT_OPTIONS, 'rapidTestResults', 'ibvTest')}
              >
                <Text style={[styles.pickerFieldText, !rapidTestResults.ibvTest && { color: colors.textDisabled }]}>
                  {TEST_RESULT_OPTIONS.find(o => o.value === rapidTestResults.ibvTest)?.label || '请选择检测结果'}
                </Text>
                <Ionicons name="chevron-down" size={20} color={colors.textDisabled} />
              </TouchableOpacity>
            </View>
          </View>
        )}
        
        {/* 采样信息标签页内容 */}
        {activeTab === 'sampling' && (
          <View style={styles.tabContent}>
            <View style={styles.formGrid}>
              <Input
                label="样本总数"
                value={samplingInfo.sampleCount}
                onChangeText={(value) => handleInputChange('samplingInfo', 'sampleCount', value)}
                placeholder="如：10"
                keyboardType="numeric"
                style={styles.gridItem}
              />
              
              <TouchableOpacity
                style={[styles.pickerField, styles.gridItem]}
                onPress={() => openPicker('保存条件', PRESERVATION_OPTIONS, 'samplingInfo', 'preservationCondition')}
              >
                <Text style={[styles.pickerFieldText, !samplingInfo.preservationCondition && { color: colors.textDisabled }]}>
                  {samplingInfo.preservationCondition || '请选择'}
                </Text>
                <Ionicons name="chevron-down" size={20} color={colors.textDisabled} />
              </TouchableOpacity>
            </View>
            
            <Text style={styles.sectionTitle}>采样部位（可多选）</Text>
            <View style={styles.symptomGrid}>
              {['咽喉拭子', '泄殖腔拭子', '组织样本', '血液样本'].map((site) => (
                <TouchableOpacity 
                  key={site}
                  style={[
                    styles.symptomItem,
                    samplingInfo.samplingSites.includes(site) && styles.symptomItemSelected
                  ]}
                  onPress={() => toggleSamplingSite(site)}
                >
                  <Text 
                    style={[
                      styles.symptomItemText,
                      samplingInfo.samplingSites.includes(site) && styles.symptomItemTextSelected
                    ]}
                  >
                    {site}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}
        
        {/* 实验数据标签页内容 */}
        {activeTab === 'experiment' && (
          <View style={styles.tabContent}>
            <Text style={styles.sectionTitle}>实验项目</Text>
            
            {/* 血常规检查 */}
            <View style={styles.experimentItem}>
              <Text style={styles.experimentItemTitle}>血常规检查</Text>
              <View style={styles.formGrid}>
                <Input
                  label="白细胞计数 (WBC)"
                  value={experimentalData.bloodRoutine.wbcCount}
                  onChangeText={(value) => handleInputChange('experimentalData', 'bloodRoutine', value, 'wbcCount')}
                  placeholder="如：25.0"
                  keyboardType="numeric"
                  style={styles.gridItem}
                />
                
                <Input
                  label="红细胞计数 (RBC)"
                  value={experimentalData.bloodRoutine.rbcCount}
                  onChangeText={(value) => handleInputChange('experimentalData', 'bloodRoutine', value, 'rbcCount')}
                  placeholder="如：3.5"
                  keyboardType="numeric"
                  style={styles.gridItem}
                />
              </View>
            </View>
            
            {/* 生化检查 */}
            <View style={styles.experimentItem}>
              <Text style={styles.experimentItemTitle}>生化检查</Text>
              <View style={styles.formGrid}>
                <Input
                  label="谷丙转氨酶 (ALT)"
                  value={experimentalData.biochemical.altLevel}
                  onChangeText={(value) => handleInputChange('experimentalData', 'biochemical', value, 'altLevel')}
                  placeholder="如：45.0"
                  keyboardType="numeric"
                  style={styles.gridItem}
                />
                
                <Input
                  label="谷草转氨酶 (AST)"
                  value={experimentalData.biochemical.astLevel}
                  onChangeText={(value) => handleInputChange('experimentalData', 'biochemical', value, 'astLevel')}
                  placeholder="如：60.0"
                  keyboardType="numeric"
                  style={styles.gridItem}
                />
              </View>
            </View>
            
            <Input
              label="实验数据补充说明"
              value={experimentalData.description}
              onChangeText={(value) => handleInputChange('experimentalData', 'description', value)}
              placeholder="请补充说明实验数据..."
              multiline
              numberOfLines={2}
            />
          </View>
        )}
        
        {/* 图片上传区域 */}
        <View style={styles.tabContent}>
          <Text style={styles.sectionTitle}>上传病禽图片</Text>
          
          <View style={styles.imageUploadGrid}>
            {imageUrls.map((url, index) => (
              <View key={index} style={styles.uploadedImageWrapper}>
                <Image 
                  source={{ uri: url }} 
                  style={styles.uploadedImage}
                  resizeMode="cover"
                />
                <TouchableOpacity 
                  style={styles.removeImageButton}
                  onPress={() => removeImage(index)}
                >
                  <Text style={styles.removeImageText}>×</Text>
                </TouchableOpacity>
              </View>
            ))}
            
            {/* 拍照上传按钮 */}
            <TouchableOpacity 
              style={styles.uploadButton}
              onPress={pickImage}
            >
              <Ionicons name="camera" size={24} color={colors.textDisabled} />
              <Text style={styles.uploadButtonText}>拍照上传</Text>
            </TouchableOpacity>
            
            {/* 选择图片按钮 */}
            <TouchableOpacity 
              style={styles.uploadButton}
              onPress={pickImage}
            >
              <Ionicons name="folder-open" size={24} color={colors.textDisabled} />
              <Text style={styles.uploadButtonText}>选择图片</Text>
            </TouchableOpacity>
          </View>
        </View>
        
        {/* 学生诊断输入 */}
        {user?.roleType === 'STUDENT' && (
          <View style={styles.tabContent}>
            <Text style={styles.sectionTitle}>学生初步诊断</Text>
            
            <Input
              label="请输入您的诊断判断"
              value={studentDiagnosisInput}
              onChangeText={(value) => setStudentDiagnosisInput(value)}
              placeholder="请描述您的诊断思路和结果..."
              multiline
              numberOfLines={4}
            />
            
            {/* 学生诊断评分 */}
            {studentDiagnosisScore !== null && (
              <View style={styles.diagnosisSummary}>
                <Text style={styles.summaryTitle}>诊断评分：{studentDiagnosisScore}/100</Text>
                <View style={{
                  height: 8,
                  backgroundColor: colors.border,
                  borderRadius: 4,
                  marginTop: 8,
                  overflow: 'hidden'
                }}>
                  <View style={{
                    height: '100%',
                    backgroundColor: studentDiagnosisScore >= 80 ? colors.success : studentDiagnosisScore >= 60 ? colors.warning : colors.error,
                    width: `${studentDiagnosisScore}%`,
                    borderRadius: 4
                  }} />
                </View>
              </View>
            )}
            
            {/* 导师点评 */}
            {mentorComments && (
              <View style={styles.diagnosisSummary}>
                <Text style={styles.summaryTitle}>导师点评</Text>
                <Text style={styles.summaryText}>{mentorComments}</Text>
              </View>
            )}
          </View>
        )}
        
        {/* 提交诊断按钮 */}
        <Button
          title={user?.roleType === 'STUDENT' ? "提交诊断并获取AI反馈" : "开始AI诊断"}
          onPress={submitDiagnosis}
          variant="primary"
          size="large"
          fullWidth
          style={{ marginVertical: 16 }}
        />
        
        {loading && (
          <View style={styles.loadingOverlay}>
            <ActivityIndicator size="large" color={colors.primary} />
            <Text style={styles.loadingText}>AI正在分析中，请稍候...</Text>
          </View>
        )}
      </ScrollView>

      <PickerModal
        visible={pickerVisible}
        title={pickerTitle}
        options={pickerOptions}
        selectedValue={getPickerSelectedValue()}
        onSelect={handlePickerSelect}
        onClose={() => setPickerVisible(false)}
      />
    </View>
  );
};

export default VeterinaryDiagnosisScreen;