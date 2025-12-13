import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Image, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Header from '../components/Header';
import { styles } from '../styles';

const DiagnosisHistoryScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  
  // 模拟诊断历史数据
  const [diagnosisHistory, setDiagnosisHistory] = useState([
    {
      id: 'AI-20240601-0001-FINAL',
      date: '2024-06-01',
      time: '15:45',
      mode: 'AI兽医模式',
      result: '混合感染：禽流感病毒 (H9N2) + 新城疫病毒',
      status: '已确诊',
      imageUrl: 'https://via.placeholder.com/100',
      symptoms: ['发热', '咳嗽', '呼吸困难', '采食量下降']
    },
    {
      id: 'AI-20240528-0002-PRE',
      date: '2024-05-28',
      time: '09:20',
      mode: '对话问诊',
      result: '初步诊断：疑似禽流感病毒感染',
      status: '初步诊断',
      imageUrl: 'https://via.placeholder.com/100',
      symptoms: ['发热', '咳嗽', '采食量下降']
    },
    {
      id: 'AI-20240520-0003-FINAL',
      date: '2024-05-20',
      time: '14:30',
      mode: 'AI兽医模式',
      result: '确诊：新城疫病毒感染',
      status: '已确诊',
      imageUrl: 'https://via.placeholder.com/100',
      symptoms: ['呼吸困难', '神经症状', '死亡率高']
    },
    {
      id: 'AI-20240515-0004-PRE',
      date: '2024-05-15',
      time: '11:15',
      mode: '对话问诊',
      result: '初步诊断：疑似传染性支气管炎',
      status: '初步诊断',
      imageUrl: 'https://via.placeholder.com/100',
      symptoms: ['呼吸道症状', '产蛋量下降', '蛋品质下降']
    },
    {
      id: 'AI-20240508-0005-FINAL',
      date: '2024-05-08',
      time: '16:50',
      mode: 'AI兽医模式',
      result: '确诊：大肠杆菌病',
      status: '已确诊',
      imageUrl: 'https://via.placeholder.com/100',
      symptoms: ['腹泻', '呼吸困难', '精神沉郁']
    }
  ]);
  
  const handleViewReport = (diagnosisId: string) => {
    navigation.navigate('DiagnosisReport', { diagnosisId });
  };
  
  const handleDeleteRecord = (id: string) => {
    setDiagnosisHistory(prev => prev.filter(item => item.id !== id));
  };
  
  return (
    <View style={styles.container}>
      <Header 
        title="诊断历史" 
        showBackButton 
        onBack={() => navigation.goBack()} 
      />
      
      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 100 }}>
        {/* 诊断历史列表 */}
        <View style={styles.diagnosisHistoryList}>
          {diagnosisHistory.length > 0 ? (
            diagnosisHistory.map((record, index) => (
              <View key={index} style={styles.diagnosisHistoryItem}>
                <View style={styles.diagnosisHistoryItemContent}>
                  {/* 左侧图片 */}
                  <View style={styles.diagnosisHistoryItemImage}>
                    <Image 
                      source={{ uri: record.imageUrl }} 
                      style={{ width: 80, height: 80, borderRadius: 8 }} 
                      resizeMode="cover"
                    />
                  </View>
                  
                  {/* 右侧内容 */}
                  <View style={styles.diagnosisHistoryItemInfo}>
                    <View style={styles.diagnosisHistoryItemHeader}>
                      <Text style={styles.diagnosisHistoryItemId}>{record.id}</Text>
                      <Text style={[styles.diagnosisHistoryItemStatus, 
                        record.status === '已确诊' ? styles.statusConfirmed : styles.statusPreDiagnosis
                      ]}>
                        {record.status}
                      </Text>
                    </View>
                    
                    <Text style={styles.diagnosisHistoryItemDate}>
                      {record.date} {record.time}
                    </Text>
                    
                    <Text style={styles.diagnosisHistoryItemMode}>
                      诊断模式：{record.mode}
                    </Text>
                    
                    <Text style={styles.diagnosisHistoryItemResult}>
                      {record.result}
                    </Text>
                    
                    <View style={styles.diagnosisHistoryItemSymptoms}>
                      {record.symptoms.slice(0, 3).map((symptom, symIndex) => (
                        <Text key={symIndex} style={styles.diagnosisHistoryItemSymptomTag}>
                          {symptom}
                        </Text>
                      ))}
                      {record.symptoms.length > 3 && (
                        <Text style={styles.diagnosisHistoryItemSymptomMore}>
                          +{record.symptoms.length - 3}个症状
                        </Text>
                      )}
                    </View>
                  </View>
                </View>
                
                {/* 操作按钮 */}
                <View style={styles.diagnosisHistoryItemActions}>
                  <TouchableOpacity 
                    style={styles.diagnosisHistoryItemActionButton}
                    onPress={() => handleViewReport(record.id)}
                  >
                    <Text style={styles.diagnosisHistoryItemActionText}>查看报告</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity 
                    style={[styles.diagnosisHistoryItemActionButton, styles.deleteButton]}
                    onPress={() => handleDeleteRecord(record.id)}
                  >
                    <Text style={[styles.diagnosisHistoryItemActionText, styles.deleteButtonText]}>删除</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))
          ) : (
            <View style={styles.emptyHistoryContainer}>
              <Text style={styles.emptyHistoryIcon}>📋</Text>
              <Text style={styles.emptyHistoryTitle}>暂无诊断历史</Text>
              <Text style={styles.emptyHistoryText}>开始您的第一次AI诊断，记录将保存在这里</Text>
              <TouchableOpacity 
                style={styles.emptyHistoryButton}
                onPress={() => navigation.navigate('DiagnosisHome')}
              >
                <Text style={styles.emptyHistoryButtonText}>开始AI诊断</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

export default DiagnosisHistoryScreen;
