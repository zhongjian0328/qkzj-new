import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import Header from '../components/Header';
import { styles } from '../styles';

const DiagnosisReportScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { diagnosisId } = route.params || {};
  
  // 模拟诊断报告数据
  const reportData = {
    reportId: 'AI-20240601-0001-FINAL',
    reportTime: '2024-06-01 15:45',
    diagnosisMode: 'AI兽医模式',
    basicInfo: {
      farmLocation: '北京市昌平区某养殖场',
      chickenBreed: '肉鸡',
      ageDays: '45天',
      stockQuantity: '5000只',
      onsetTime: '2024-05-30',
      mortalityRate: '2.5%',
      coreSymptoms: ['发热', '咳嗽', '呼吸困难', '采食量下降']
    },
    finalConclusion: {
      diagnosis: '混合感染：禽流感病毒 (H9N2) + 新城疫病毒',
      basis: [
        '临床症状：发热、咳嗽、呼吸困难、采食量下降',
        '病理变化：肺部病变、消化道病变',
        '快速检测结果：AIV阳性、NDV阳性',
        '实验数据：血常规异常、生化指标异常'
      ]
    },
    emergencyPlan: {
      '0-24小时': [
        {
          title: '分类隔离',
          description: '立即隔离病禽，将健康禽群转移至安全区域，避免交叉感染'
        },
        {
          title: '紧急免疫',
          description: '对健康禽群进行紧急疫苗接种，推荐使用H9亚型禽流感疫苗和新城疫疫苗'
        },
        {
          title: '综合用药',
          description: '使用抗病毒药物（如奥司他韦）和广谱抗生素控制继发感染'
        },
        {
          title: '环境消毒',
          description: '对养殖场进行全面消毒，建议使用醛类消毒剂，重点消毒鸡舍、器具和运输工具'
        }
      ],
      '1-7天': [
        {
          title: '对症治疗',
          description: '根据临床症状进行针对性治疗，缓解呼吸道症状'
        },
        {
          title: '营养支持',
          description: '提供高能量饲料，添加维生素和电解质'
        },
        {
          title: '监测评估',
          description: '定期监测鸡群健康状况，评估治疗效果'
        }
      ],
      '生物安全': [
        {
          title: '无害化处理',
          description: '严格按照规范处理病死禽只，避免病毒扩散'
        },
        {
          title: '消毒防控',
          description: '建立定期消毒制度，使用有效消毒剂'
        },
        {
          title: '人员/物资管理',
          description: '严格控制人员和物资流动，防止交叉感染'
        }
      ]
    },
    biosafetyOptimization: [
      {
        title: '养殖场布局优化',
        description: '建议重新规划养殖场布局，设置明确的功能分区，包括生产区、隔离区、消毒区等，减少交叉感染风险。',
        color: 'blue'
      },
      {
        title: '免疫程序优化',
        description: '根据当地疫情流行情况，制定科学的免疫程序，定期进行疫苗接种和抗体监测。',
        color: 'green'
      },
      {
        title: '监测预警体系',
        description: '建立完善的监测预警体系，定期检测鸡群健康状况，及时发现异常情况。',
        color: 'purple'
      },
      {
        title: '人员培训',
        description: '加强员工生物安全意识培训，提高其对疫情的识别和应对能力。',
        color: 'orange'
      }
    ]
  };
  
  // 当前激活的应急方案标签
  const [activePlanTab, setActivePlanTab] = useState<'0-24小时' | '1-7天' | '生物安全'>('0-24小时');
  
  const handleSaveReport = () => {
    // 实现保存报告功能
    alert('确诊报告已保存');
  };
  
  const handleShareReport = () => {
    // 实现分享报告功能
    alert('报告分享功能暂未实现');
  };
  
  return (
    <View style={styles.container}>
      <Header 
        title="AI确诊报告" 
        showBackButton 
        onBack={() => navigation.goBack()} 
      />
      
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        {/* 报告头部信息 */}
        <View style={styles.reportHeader}>
          <View style={styles.reportHeaderContent}>
            <View>
              <Text style={styles.reportTitle}>确诊报告</Text>
              <Text style={styles.reportNumber}>报告编号：{reportData.reportId}</Text>
            </View>
            <View style={styles.reportTimeInfo}>
              <Text style={styles.reportTime}>确诊时间：{reportData.reportTime}</Text>
              <Text style={styles.reportTime}>诊断模式：{reportData.diagnosisMode}</Text>
            </View>
          </View>
        </View>
        
        {/* 发病基本情况 */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>
            <Text style={styles.sectionIcon}>ℹ️</Text>
            发病基本情况
          </Text>
          
          <View style={styles.infoGrid}>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>场址</Text>
              <Text style={styles.infoValue}>{reportData.basicInfo.farmLocation}</Text>
            </View>
            
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>鸡只品种</Text>
              <Text style={styles.infoValue}>{reportData.basicInfo.chickenBreed}</Text>
            </View>
            
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>日龄</Text>
              <Text style={styles.infoValue}>{reportData.basicInfo.ageDays}</Text>
            </View>
            
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>存栏量</Text>
              <Text style={styles.infoValue}>{reportData.basicInfo.stockQuantity}</Text>
            </View>
            
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>发病时间</Text>
              <Text style={styles.infoValue}>{reportData.basicInfo.onsetTime}</Text>
            </View>
            
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>死亡率</Text>
              <Text style={styles.infoValue}>{reportData.basicInfo.mortalityRate}</Text>
            </View>
          </View>
          
          <View style={styles.symptomsSection}>
            <Text style={styles.infoLabel}>核心症状</Text>
            <View style={styles.symptomsList}>
              {reportData.basicInfo.coreSymptoms.map((symptom, index) => (
                <View key={index} style={styles.symptomTag}>
                  <Text style={styles.symptomTagText}>{symptom}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>
        
        {/* AI确诊结论 */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>
            <Text style={styles.sectionIcon}>🤖</Text>
            AI确诊结论
          </Text>
          
          <View style={styles.conclusionCard}>
            <Text style={styles.conclusionTitle}>{reportData.finalConclusion.diagnosis}</Text>
            <Text style={styles.conclusionDescription}>基于完整的数据（基础信息、临床表现、病理变化、快速检测结果、采样信息及实验数据），AI综合分析得出确诊结论。</Text>
          </View>
          
          <View style={styles.basisSection}>
            <Text style={styles.basisTitle}>确诊依据：</Text>
            <View style={styles.basisList}>
              {reportData.finalConclusion.basis.map((item, index) => (
                <Text key={index} style={styles.basisItem}>• {item}</Text>
              ))}
            </View>
          </View>
        </View>
        
        {/* 应急防治方案 */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>
            <Text style={styles.sectionIcon}>⚠️</Text>
            应急防治方案
          </Text>
          
          <View style={styles.planTabs}>
            <TouchableOpacity 
              style={[
                styles.planTab,
                activePlanTab === '0-24小时' && styles.planTabActive
              ]}
              onPress={() => setActivePlanTab('0-24小时')}
            >
              <Text 
                style={[
                  styles.planTabText,
                  activePlanTab === '0-24小时' && styles.planTabTextActive
                ]}
              >
                0-24小时
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[
                styles.planTab,
                activePlanTab === '1-7天' && styles.planTabActive
              ]}
              onPress={() => setActivePlanTab('1-7天')}
            >
              <Text 
                style={[
                  styles.planTabText,
                  activePlanTab === '1-7天' && styles.planTabTextActive
                ]}
              >
                1-7天
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[
                styles.planTab,
                activePlanTab === '生物安全' && styles.planTabActive
              ]}
              onPress={() => setActivePlanTab('生物安全')}
            >
              <Text 
                style={[
                  styles.planTabText,
                  activePlanTab === '生物安全' && styles.planTabTextActive
                ]}
              >
                生物安全
              </Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.planContent}>
            {reportData.emergencyPlan[activePlanTab].map((item, index) => (
              <View key={index} style={styles.planItem}>
                <Text style={styles.planItemIcon}>✓</Text>
                <View>
                  <Text style={styles.planItemTitle}>{item.title}</Text>
                  <Text style={styles.planItemDescription}>{item.description}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>
        
        {/* 生物安全体系优化方案 */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>
            <Text style={styles.sectionIcon}>🛡️</Text>
            生物安全体系优化方案
          </Text>
          
          <View style={styles.optimizationList}>
            {reportData.biosafetyOptimization.map((item, index) => (
              <View key={index} style={styles.optimizationItem}>
                <Text style={styles.optimizationTitle}>{item.title}</Text>
                <Text style={styles.optimizationDescription}>{item.description}</Text>
              </View>
            ))}
          </View>
        </View>
        
        {/* 操作按钮 */}
        <TouchableOpacity 
          style={styles.saveButton}
          onPress={handleSaveReport}
        >
          <Text style={styles.saveButtonIcon}>💾</Text>
          <Text style={styles.saveButtonText}>保存确诊报告</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.shareButton}
          onPress={handleShareReport}
        >
          <Text style={styles.shareButtonIcon}>🔗</Text>
          <Text style={styles.shareButtonText}>分享确诊报告</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

export default DiagnosisReportScreen;