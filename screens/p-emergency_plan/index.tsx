import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, Alert, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { FontAwesome6 } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import styles from './styles';

interface EmergencyMeasure {
  title: string;
  items: string[];
  icon?: string;
}

interface TreatmentDrug {
  id: string;
  name: string;
  dosage: string;
  course: string;
  imageUrl: string;
}

interface EmergencyPlanData {
  diagnosisId: string;
  coreThreat: string;
  measures: {
    emergency: EmergencyMeasure[];
    shortTerm: EmergencyMeasure[];
    biosecurity: EmergencyMeasure[];
  };
  recommendedDrugs: TreatmentDrug[];
}

// 模拟数据
const mockEmergencyPlan: EmergencyPlanData = {
  diagnosisId: '12345',
  coreThreat: '本次诊断结果显示，病禽主要感染了禽流感病毒（H5亚型），置信度为85%，同时伴有大肠杆菌混合感染，置信度为60%。该情况属于高风险混合感染，如不及时采取措施，可能导致大规模死亡。',
  measures: {
    emergency: [
      {
        title: '分类隔离',
        icon: 'user-shield',
        items: [
          '立即将病禽与健康禽只严格隔离，使用物理屏障分开饲养区域',
          '对隔离区域进行标识，禁止人员和设备交叉使用',
          '安排专人负责隔离区域的饲养和管理',
          '每日观察并记录病禽的健康状况变化'
        ]
      },
      {
        title: '紧急免疫',
        icon: 'syringe',
        items: [
          '立即对健康禽只接种禽流感H5+H7二价灭活疫苗',
          '严格按照疫苗说明书进行接种，确保接种剂量和操作规范',
          '记录接种时间、疫苗批次和接种人员信息',
          '接种后密切观察禽只的反应，如有异常及时处理'
        ]
      },
      {
        title: '综合用药',
        icon: 'pill',
        items: [
          '对病禽使用抗病毒药物（如奥司他韦）和抗菌药物（如氟苯尼考）联合治疗',
          '按照体重计算药物剂量，确保用药准确',
          '选择合适的给药方式（饮水、拌料或注射）',
          '严格遵守休药期规定，避免药物残留'
        ]
      },
      {
        title: '环境调控',
        icon: 'fan',
        items: [
          '提高鸡舍温度2-3℃，保持温度稳定',
          '加强通风换气，确保空气质量良好',
          '保持鸡舍干燥，控制相对湿度在60-70%',
          '提供充足的清洁饮水和营养均衡的饲料'
        ]
      }
    ],
    shortTerm: [
      {
        title: '对症治疗',
        icon: 'stethoscope',
        items: [
          '继续使用抗病毒药物和抗菌药物，根据病情调整用药方案',
          '对有呼吸道症状的禽只使用止咳平喘药物',
          '对发热的禽只使用解热药物',
          '补充维生素和矿物质，增强禽只免疫力'
        ]
      },
      {
        title: '营养支持',
        icon: 'utensils',
        items: [
          '提供高能量、高蛋白的饲料，促进禽只恢复',
          '在饲料中添加益生菌，改善肠道健康',
          '确保饮水充足，并可添加电解多维',
          '根据禽只采食量调整饲料配方'
        ]
      },
      {
        title: '监测评估',
        icon: 'chart-line',
        items: [
          '每日监测禽只的死亡率、发病率和采食量',
          '定期采集样本进行实验室检测，评估治疗效果',
          '记录治疗过程中的各项数据，建立完整的治疗档案',
          '根据监测结果及时调整防控策略'
        ]
      }
    ],
    biosecurity: [
      {
        title: '无害化处理',
        icon: 'trash',
        items: [
          '对病死禽只进行无害化处理，可选择焚烧、深埋或化制等方式',
          '处理过程中严格遵守生物安全规定，防止病原扩散',
          '对处理场地进行彻底消毒',
          '记录无害化处理的数量、时间和方式'
        ]
      },
      {
        title: '消毒防控',
        icon: 'spray-can',
        items: [
          '对鸡舍内外环境进行彻底消毒，每日至少1次',
          '使用有效的消毒剂，如过氧乙酸、氢氧化钠等',
          '对人员和车辆进出进行严格消毒',
          '定期更换消毒剂种类，防止病原产生耐药性'
        ]
      },
      {
        title: '人员/物资管理',
        icon: 'user-cog',
        items: [
          '加强人员生物安全意识培训，严格遵守防疫制度',
          '进入鸡舍前更换工作服、鞋靴，并进行消毒',
          '对饲料、兽药等物资进行严格管理，防止交叉污染',
          '建立人员和物资的进出登记制度'
        ]
      }
    ]
  },
  recommendedDrugs: [
    {
      id: '1',
      name: '禽流感H5+H7二价灭活疫苗',
      dosage: '0.5ml/只，肌肉注射',
      course: '一次接种，免疫期6个月',
      imageUrl: 'https://via.placeholder.com/80'
    },
    {
      id: '2',
      name: '奥司他韦可溶性粉',
      dosage: '1g/10kg水，饮水给药',
      course: '连用5-7天',
      imageUrl: 'https://via.placeholder.com/80'
    },
    {
      id: '3',
      name: '氟苯尼考可溶性粉',
      dosage: '1g/10kg水，饮水给药',
      course: '连用3-5天',
      imageUrl: 'https://via.placeholder.com/80'
    }
  ]
};

const EmergencyPlanScreen: React.FC = () => {
  const router = useRouter();
  const { diagnosisId } = useLocalSearchParams();
  
  // 状态管理
  const [activeTab, setActiveTab] = useState<'emergency' | 'shortTerm' | 'biosecurity'>('emergency');
  const [selectedDrug, setSelectedDrug] = useState<TreatmentDrug | null>(null);
  
  // 模拟获取应急防控方案数据
  const emergencyPlan = mockEmergencyPlan;
  
  // 返回诊断结果
  const handleBackToDiagnosis = () => {
    router.back();
  };
  
  // 前往商城购买
  const handleGoToMall = () => {
    if (selectedDrug) {
      router.push(`/p-veterinary_mall?drugId=${selectedDrug.id}`);
    } else {
      router.push('/p-veterinary_mall');
    }
  };
  
  // 渲染措施列表
  const renderMeasures = (measures: EmergencyMeasure[]) => {
    return measures.map((measure, index) => (
      <View key={index} style={styles.measureCard}>
        <View style={styles.measureHeader}>
          {measure.icon && (
            <FontAwesome6 
              name={measure.icon} 
              size={20} 
              color="#3BCCA5" 
              style={styles.measureIcon} 
            />
          )}
          <Text style={styles.measureTitle}>{measure.title}</Text>
        </View>
        <View style={styles.measureItems}>
          {measure.items.map((item, itemIndex) => (
            <View key={itemIndex} style={styles.measureItem}>
              <FontAwesome6 
                name="check-circle" 
                size={16} 
                color="#3BCCA5" 
                style={styles.itemIcon} 
              />
              <Text style={styles.itemText}>{item}</Text>
            </View>
          ))}
        </View>
      </View>
    ));
  };
  
  return (
    <SafeAreaView style={styles.container}>
      {/* 顶部导航栏 */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleBackToDiagnosis}>
          <FontAwesome6 name="arrow-left" size={20} color="#6B7280" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>应急防控方案</Text>
        <View style={styles.headerRight}>
          <TouchableOpacity onPress={handleGoToMall}>
            <FontAwesome6 name="shopping-cart" size={20} color="#3BCCA5" />
          </TouchableOpacity>
        </View>
      </View>
      
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* 初诊结论摘要 */}
        <View style={styles.summarySection}>
          <View style={styles.summaryCard}>
            <View style={styles.summaryHeader}>
              <FontAwesome6 name="triangle-exclamation" size={20} color="#DC2626" />
              <Text style={styles.summaryTitle}>核心威胁提示</Text>
            </View>
            <Text style={styles.summaryText}>{emergencyPlan.coreThreat}</Text>
          </View>
        </View>
        
        {/* 时段选择标签 */}
        <View style={styles.tabSection}>
          <View style={styles.tabContainer}>
            <TouchableOpacity 
              style={[
                styles.tabButton, 
                activeTab === 'emergency' && styles.tabButtonActive
              ]}
              onPress={() => setActiveTab('emergency')}
            >
              <Text style={[
                styles.tabText, 
                activeTab === 'emergency' && styles.tabTextActive
              ]}>
                0-24小时（紧急）
              </Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[
                styles.tabButton, 
                activeTab === 'shortTerm' && styles.tabButtonActive
              ]}
              onPress={() => setActiveTab('shortTerm')}
            >
              <Text style={[
                styles.tabText, 
                activeTab === 'shortTerm' && styles.tabTextActive
              ]}>
                1-7天（短期）
              </Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[
                styles.tabButton, 
                activeTab === 'biosecurity' && styles.tabButtonActive
              ]}
              onPress={() => setActiveTab('biosecurity')}
            >
              <Text style={[
                styles.tabText, 
                activeTab === 'biosecurity' && styles.tabTextActive
              ]}>
                生物安全措施
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        
        {/* 措施内容 */}
        <View style={styles.contentSection}>
          {activeTab === 'emergency' && (
            renderMeasures(emergencyPlan.measures.emergency)
          )}
          {activeTab === 'shortTerm' && (
            renderMeasures(emergencyPlan.measures.shortTerm)
          )}
          {activeTab === 'biosecurity' && (
            renderMeasures(emergencyPlan.measures.biosecurity)
          )}
        </View>
        
        {/* 推荐药物 */}
        <View style={styles.drugsSection}>
          <Text style={styles.sectionTitle}>推荐药物</Text>
          <View style={styles.drugsContainer}>
            {emergencyPlan.recommendedDrugs.map((drug) => (
              <TouchableOpacity 
                key={drug.id} 
                style={[
                  styles.drugCard, 
                  selectedDrug?.id === drug.id && styles.drugCardSelected
                ]}
                onPress={() => setSelectedDrug(selectedDrug?.id === drug.id ? null : drug)}
              >
                <Image source={{ uri: drug.imageUrl }} style={styles.drugImage} />
                <View style={styles.drugInfo}>
                  <Text style={styles.drugName}>{drug.name}</Text>
                  <Text style={styles.drugDosage}>剂量：{drug.dosage}</Text>
                  <Text style={styles.drugCourse}>疗程：{drug.course}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>
        
        {/* 底部按钮 */}
        <View style={styles.bottomButtons}>
          <TouchableOpacity 
            style={styles.backButtonLarge} 
            onPress={handleBackToDiagnosis}
          >
            <FontAwesome6 
              name="arrow-left" 
              size={18} 
              color="#6B7280" 
              style={styles.buttonIcon} 
            />
            <Text style={styles.backButtonText}>返回诊断结果</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.mallButton} 
            onPress={handleGoToMall}
          >
            <LinearGradient
              colors={['#D3F8EE', '#3BCCA5']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.mallButtonGradient}
            >
              <FontAwesome6 
                name="shopping-cart" 
                size={18} 
                color="#2B6A5A" 
                style={styles.buttonIcon} 
              />
              <Text style={styles.mallButtonText}>前往商城购买</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default EmergencyPlanScreen;
