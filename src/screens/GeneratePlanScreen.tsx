import React, { useState } from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import Header from '../components/Header';
import { controlPlanApi } from '../services/api';
import { styles } from '../styles';

const SEVERITY_OPTIONS = [
  { key: 'low', label: '低风险', color: '#22C55E' },
  { key: 'medium', label: '中风险', color: '#F59E0B' },
  { key: 'high', label: '高风险', color: '#EF4444' },
  { key: 'critical', label: '极高风险', color: '#991B1B' },
];

export default function GeneratePlanScreen() {
  const navigation = useNavigation<any>();
  const [diseaseName, setDiseaseName] = useState('');
  const [severity, setSeverity] = useState('medium');
  const [symptoms, setSymptoms] = useState('');
  const [environment, setEnvironment] = useState('');
  const [generating, setGenerating] = useState(false);

  const handleGenerate = async () => {
    if (!diseaseName.trim()) {
      Alert.alert('提示', '请输入疾病名称');
      return;
    }
    setGenerating(true);
    try {
      const res = await controlPlanApi.generatePlan({
        diseaseName: diseaseName.trim(),
        severity,
        symptoms: symptoms.trim(),
        environment: environment.trim(),
      });
      if (res?.data) {
        Alert.alert('成功', '防控预案已生成', [
          { text: '查看预案', onPress: () => navigation.replace('ControlPlanDetail', { planId: res.data._id }) },
        ]);
      }
    } catch (e: any) {
      Alert.alert('错误', e.message || '生成预案失败，请稍后重试');
    } finally {
      setGenerating(false);
    }
  };

  return (
    <View style={styles.container}>
      <Header title="生成防控预案" showBackButton onBack={() => navigation.goBack()} />
      <ScrollView style={{ padding: 16 }}>
        {/* 疾病名称 */}
        <View style={styles.formGroup}>
          <Text style={styles.formLabel}>疾病名称 *</Text>
          <TextInput
            style={styles.formInput}
            placeholder="如：新城疫、传染性支气管炎"
            value={diseaseName}
            onChangeText={setDiseaseName}
          />
        </View>

        {/* 严重程度 */}
        <View style={styles.formGroup}>
          <Text style={styles.formLabel}>严重程度</Text>
          <View style={{ flexDirection: 'row', gap: 8, flexWrap: 'wrap' }}>
            {SEVERITY_OPTIONS.map(opt => (
              <TouchableOpacity
                key={opt.key}
                style={{
                  paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20,
                  backgroundColor: severity === opt.key ? opt.color + '20' : '#F3F4F6',
                  borderWidth: 1,
                  borderColor: severity === opt.key ? opt.color : '#E5E7EB',
                }}
                onPress={() => setSeverity(opt.key)}
              >
                <Text style={{ fontSize: 14, fontWeight: '500', color: severity === opt.key ? opt.color : '#6B7280' }}>
                  {opt.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* 临床症状 */}
        <View style={styles.formGroup}>
          <Text style={styles.formLabel}>临床症状（可选）</Text>
          <TextInput
            style={[styles.formInput, { minHeight: 80, textAlignVertical: 'top' }]}
            placeholder="描述当前症状，有助于AI生成更精准的预案"
            value={symptoms}
            onChangeText={setSymptoms}
            multiline
          />
        </View>

        {/* 环境条件 */}
        <View style={styles.formGroup}>
          <Text style={styles.formLabel}>环境条件（可选）</Text>
          <TextInput
            style={[styles.formInput, { minHeight: 60, textAlignVertical: 'top' }]}
            placeholder="如：温度28°C、湿度75%、通风不良"
            value={environment}
            onChangeText={setEnvironment}
            multiline
          />
        </View>
      </ScrollView>

      {/* 生成按钮 */}
      <View style={{ padding: 16, backgroundColor: '#FFFFFF', borderTopWidth: 1, borderTopColor: '#E5E7EB' }}>
        <TouchableOpacity
          style={[styles.primaryButton, generating && { opacity: 0.6 }]}
          onPress={handleGenerate}
          disabled={generating}
        >
          {generating ? (
            <>
              <ActivityIndicator size="small" color="#FFFFFF" />
              <Text style={[styles.primaryButtonText, { marginLeft: 8 }]}>AI生成中...</Text>
            </>
          ) : (
            <>
              <Ionicons name="sparkles" size={20} color="#FFFFFF" />
              <Text style={[styles.primaryButtonText, { marginLeft: 8 }]}>AI生成预案</Text>
            </>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}
