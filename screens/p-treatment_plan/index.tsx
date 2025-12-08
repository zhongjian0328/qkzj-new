

import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert, ActivityIndicator, } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { FontAwesome6 } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import styles from './styles';
import { getTreatmentPlanApi } from '../../src/services/api';

interface MedicationItem {
  id: string;
  name: string;
  type: string;
  dosage: {
    amount: string;
    route: string;
    frequency: string;
    course: string;
  };
  description: string;
  sideEffects: string;
}

interface PrecautionItem {
  id: string;
  title: string;
  description: string;
}

interface TreatmentPlan {
  diseaseName: string;
  confidence: string;
  severity: string;
  description: string;
  medications: MedicationItem[];
  precautions: PrecautionItem[];
}

const TreatmentPlanScreen: React.FC = () => {
  const router = useRouter();
  const { diagnosisId } = useLocalSearchParams<{ diagnosisId: string }>();
  
  const [treatmentPlan, setTreatmentPlan] = useState<TreatmentPlan>({
    diseaseName: '新城疫',
    confidence: '95%',
    severity: '高风险',
    description: '新城疫是由新城疫病毒引起的一种高度接触性传染病，主要感染鸡、鸭、鹅等禽类。临床表现为呼吸困难、腹泻、神经症状等，死亡率较高。',
    medications: [
      {
        id: '1',
        name: '利巴韦林注射液',
        type: '抗病毒药物',
        dosage: {
          amount: '0.1ml/kg体重',
          route: '肌肉注射',
          frequency: '每日2次',
          course: '连续3-5天',
        },
        description: '广谱抗病毒药物，对RNA病毒有较强抑制作用，能有效抑制新城疫病毒复制。',
        sideEffects: '偶见注射部位疼痛，过量使用可能引起贫血。',
      },
      {
        id: '2',
        name: '阿莫西林可溶性粉',
        type: '抗生素',
        dosage: {
          amount: '100g/1000kg饲料',
          route: '混饲',
          frequency: '每日1次',
          course: '连续5-7天',
        },
        description: '半合成青霉素类抗生素，对革兰氏阳性菌和部分革兰氏阴性菌有良好抗菌作用。',
        sideEffects: '少数禽只可能出现过敏反应，长期使用可能导致耐药性。',
      },
      {
        id: '3',
        name: '维生素C可溶性粉',
        type: '维生素补充剂',
        dosage: {
          amount: '50g/1000L水',
          route: '饮水',
          frequency: '每日1次',
          course: '连续7-10天',
        },
        description: '维生素补充剂，能增强机体免疫力，促进病后恢复，减轻应激反应。',
        sideEffects: '过量使用可能引起尿酸盐沉积。',
      },
    ],
    precautions: [
      {
        id: '1',
        title: '隔离病禽',
        description: '立即将病禽与健康禽群隔离，避免病毒传播。',
      },
      {
        id: '2',
        title: '加强消毒',
        description: '对鸡舍、器具进行彻底消毒，每日至少1次。',
      },
      {
        id: '3',
        title: '监测病情',
        description: '密切观察病禽状况，如症状加重应及时咨询兽医。',
      },
      {
        id: '4',
        title: '停药期',
        description: '用药期间及停药后5天内，禁止出售或食用病禽。',
      },
    ],
  });
  
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (diagnosisId) {
      fetchTreatmentPlan(diagnosisId);
    }
  }, [diagnosisId]);

  // 获取治疗方案
  const fetchTreatmentPlan = async (id: string) => {
    setIsLoading(true);
    try {
      // 调用API获取治疗方案
      const response = await getTreatmentPlanApi(id);
      if (response.success && response.data) {
        // 这里需要根据实际API返回的数据结构来调整
        // 由于当前API返回的是简单的plan字符串，我们暂时使用模拟数据
        // 实际项目中，需要根据API返回的数据结构来构建treatmentPlan对象
        console.log('治疗方案API返回:', response.data);
      }
    } catch (error) {
      Alert.alert('网络错误', '获取治疗方案失败，请检查网络连接');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackPress = () => {
    if (router.canGoBack()) {
      router.back();
    }
  };

  const handleMedicationDetailPress = (medication: MedicationItem) => {
    Alert.alert(
      medication.name,
      `功效：${medication.description}\n\n注意事项：${medication.sideEffects}`,
      [{ text: '确定', style: 'default' }]
    );
  };

  const handleGoToMallPress = () => {
    router.push(`/p-veterinary_mall?disease=${encodeURIComponent(treatmentPlan.diseaseName)}`);
  };

  const getSeverityStyle = (severity: string) => {
    switch (severity) {
      case '高风险':
        return styles.severityHigh;
      case '中风险':
        return styles.severityMedium;
      case '低风险':
        return styles.severityLow;
      default:
        return styles.severityMedium;
    }
  };

  const renderMedicationItem = (medication: MedicationItem) => (
    <View key={medication.id} style={styles.medicationItem}>
      <View style={styles.medicationHeader}>
        <View style={styles.medicationInfo}>
          <Text style={styles.medicationName}>{medication.name}</Text>
          <Text style={styles.medicationType}>{medication.type}</Text>
        </View>
        <TouchableOpacity
          style={styles.detailButton}
          onPress={() => handleMedicationDetailPress(medication)}
          activeOpacity={0.7}
        >
          <FontAwesome6 name="circle-info" size={12} color="#3BCCA5" />
          <Text style={styles.detailButtonText}>详情</Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.dosageInfo}>
        <Text style={styles.dosageTitle}>用法用量</Text>
        <View style={styles.dosageList}>
          <View style={styles.dosageItem}>
            <Text style={styles.dosageLabel}>剂量：</Text>
            <Text style={styles.dosageValue}>{medication.dosage.amount}</Text>
          </View>
          <View style={styles.dosageItem}>
            <Text style={styles.dosageLabel}>途径：</Text>
            <Text style={styles.dosageValue}>{medication.dosage.route}</Text>
          </View>
          <View style={styles.dosageItem}>
            <Text style={styles.dosageLabel}>频率：</Text>
            <Text style={styles.dosageValue}>{medication.dosage.frequency}</Text>
          </View>
          <View style={styles.dosageItem}>
            <Text style={styles.dosageLabel}>疗程：</Text>
            <Text style={styles.dosageValue}>{medication.dosage.course}</Text>
          </View>
        </View>
      </View>
    </View>
  );

  const renderPrecautionItem = (precaution: PrecautionItem) => (
    <View key={precaution.id} style={styles.precautionItem}>
      <View style={styles.precautionContent}>
        <FontAwesome6 name="triangle-exclamation" size={16} color="#F59E0B" style={styles.precautionIcon} />
        <View style={styles.precautionText}>
          <Text style={styles.precautionTitle}>{precaution.title}</Text>
          <Text style={styles.precautionDescription}>{precaution.description}</Text>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* 顶部导航栏 */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={handleBackPress}
          activeOpacity={0.7}
        >
          <FontAwesome6 name="arrow-left" size={20} color="#6B7280" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>治疗方案</Text>
      </View>

      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#3BCCA5" />
          <Text style={styles.loadingText}>加载治疗方案中...</Text>
        </View>
      ) : (
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          {/* 诊断结果摘要 */}
          <View style={styles.section}>
            <View style={styles.diagnosisCard}>
              <View style={styles.diagnosisHeader}>
                <View style={styles.diagnosisInfo}>
                  <Text style={styles.diseaseName}>{treatmentPlan.diseaseName}</Text>
                  <Text style={styles.diagnosisConfidence}>AI诊断置信度：{treatmentPlan.confidence}</Text>
                </View>
                <View style={[styles.severityLevel, getSeverityStyle(treatmentPlan.severity)]}>
                  <Text style={styles.severityText}>{treatmentPlan.severity}</Text>
                </View>
              </View>
              
              <View style={styles.diseaseDescription}>
                <Text style={styles.descriptionTitle}>疾病概述</Text>
                <Text style={styles.descriptionText}>{treatmentPlan.description}</Text>
              </View>
            </View>
          </View>

          {/* 推荐用药方案 */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>推荐用药方案</Text>
            <View style={styles.medicationList}>
              {treatmentPlan.medications.map(renderMedicationItem)}
            </View>
          </View>

          {/* 注意事项 */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>注意事项</Text>
            <View style={styles.precautionsCard}>
              <View style={styles.precautionList}>
                {treatmentPlan.precautions.map(renderPrecautionItem)}
              </View>
            </View>
          </View>

          {/* 治疗效果评估 */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>治疗效果评估</Text>
            <View style={styles.evaluationCard}>
              <View style={styles.expectedOutcomes}>
                <View style={styles.outcomeItem}>
                  <View style={styles.outcomeContent}>
                    <Text style={styles.outcomeTitle}>预期效果</Text>
                    <Text style={styles.outcomeDescription}>用药3-5天后症状明显改善</Text>
                  </View>
                  <FontAwesome6 name="circle-check" size={20} color="#10B981" />
                </View>

                <View style={styles.outcomeItem}>
                  <View style={styles.outcomeContent}>
                    <Text style={styles.outcomeTitle}>复诊建议</Text>
                    <Text style={styles.outcomeDescription}>用药结束后建议再次诊断确认</Text>
                  </View>
                  <FontAwesome6 name="stethoscope" size={20} color="#F59E0B" />
                </View>

                <View style={styles.outcomeItem}>
                  <View style={styles.outcomeContent}>
                    <Text style={styles.outcomeTitle}>预防措施</Text>
                    <Text style={styles.outcomeDescription}>康复后及时接种新城疫疫苗</Text>
                  </View>
                  <FontAwesome6 name="syringe" size={20} color="#3B82F6" />
                </View>
              </View>
            </View>
          </View>

          {/* 前往商城购买按钮 */}
          <View style={styles.purchaseSection}>
            <TouchableOpacity
              style={styles.goToMallButton}
              onPress={handleGoToMallPress}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={['#D3F8EE', '#3BCCA5']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.gradientButton}
              >
                <FontAwesome6 name="cart-shopping" size={18} color="#2B6A5A" />
                <Text style={styles.goToMallButtonText}>前往商城购买相关药品</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </ScrollView>
      )}
    </SafeAreaView>
  );
};

export default TreatmentPlanScreen;

