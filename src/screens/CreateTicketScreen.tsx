import React, { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, TextInput,
  ActivityIndicator, Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Header from '../components/Header';
import { serviceTicketApi } from '../services/api';
import { StyleSheet } from 'react-native';

const COLORS = {
  primary: '#2DBBA1',
  primaryDark: '#1F5E52',
  bgLight: '#E6F7F3',
  text: '#1F2937',
  textSecondary: '#6B7280',
  border: '#E5E7EB',
  danger: '#EF4444',
  warning: '#F59E0B',
};

const CATEGORIES = [
  { key: 'equipment', label: '设备维修' },
  { key: 'environment', label: '环境调控' },
  { key: 'disease', label: '疾病排查' },
  { key: 'nutrition', label: '营养饲喂' },
  { key: 'other', label: '其他' },
];

const PRIORITIES = [
  { key: 'low', label: '低', color: '#9CA3AF' },
  { key: 'medium', label: '中', color: '#3B82F6' },
  { key: 'high', label: '高', color: COLORS.warning },
  { key: 'urgent', label: '紧急', color: COLORS.danger },
];

export default function CreateTicketScreen() {
  const navigation = useNavigation<any>();
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [priority, setPriority] = useState('medium');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [scheduledDateStr, setScheduledDateStr] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const validate = (): boolean => {
    if (!title.trim()) { Alert.alert('提示', '请输入工单标题'); return false; }
    if (!category) { Alert.alert('提示', '请选择工单分类'); return false; }
    if (!description.trim()) { Alert.alert('提示', '请输入详细描述'); return false; }
    return true;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setSubmitting(true);
    try {
      await serviceTicketApi.createTicket({
        title: title.trim(),
        description: description.trim(),
        category,
        priority,
        location: location.trim() || undefined,
        scheduledDate: scheduledDateStr || undefined,
      });
      Alert.alert('成功', '工单已创建', [
        { text: '确定', onPress: () => navigation.navigate('TicketList') },
      ]);
    } catch (e: any) {
      Alert.alert('错误', e.message || '创建工单失败');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <View style={styles.container}>
      <Header title="创建工单" showBackButton onBack={() => navigation.goBack()} />

      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
        {/* 标题 */}
        <View style={styles.section}>
          <Text style={styles.label}>工单标题 <Text style={styles.required}>*</Text></Text>
          <TextInput
            style={styles.input}
            placeholder="请简要描述工单内容"
            value={title}
            onChangeText={setTitle}
            maxLength={100}
          />
        </View>

        {/* 分类选择 */}
        <View style={styles.section}>
          <Text style={styles.label}>工单分类 <Text style={styles.required}>*</Text></Text>
          <View style={styles.optionGrid}>
            {CATEGORIES.map(cat => (
              <TouchableOpacity
                key={cat.key}
                style={[
                  styles.optionChip,
                  category === cat.key && styles.optionChipSelected,
                ]}
                onPress={() => setCategory(cat.key)}
              >
                <Text style={[
                  styles.optionChipText,
                  category === cat.key && styles.optionChipTextSelected,
                ]}>
                  {cat.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* 优先级选择 */}
        <View style={styles.section}>
          <Text style={styles.label}>优先级</Text>
          <View style={styles.optionGrid}>
            {PRIORITIES.map(p => (
              <TouchableOpacity
                key={p.key}
                style={[
                  styles.optionChip,
                  priority === p.key && { borderColor: p.color, backgroundColor: p.color + '15' },
                ]}
                onPress={() => setPriority(p.key)}
              >
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                  <View style={[styles.priorityDot, { backgroundColor: p.color }]} />
                  <Text style={[styles.optionChipText, { color: priority === p.key ? p.color : COLORS.textSecondary }]}>
                    {p.label}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* 详细描述 */}
        <View style={styles.section}>
          <Text style={styles.label}>详细描述 <Text style={styles.required}>*</Text></Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="请详细描述问题情况、症状表现等"
            value={description}
            onChangeText={setDescription}
            multiline
            maxLength={1000}
            textAlignVertical="top"
          />
          <Text style={styles.charCount}>{description.length}/1000</Text>
        </View>

        {/* 服务地点 */}
        <View style={styles.section}>
          <Text style={styles.label}>服务地点</Text>
          <TextInput
            style={styles.input}
            placeholder="例如：3号鸡舍"
            value={location}
            onChangeText={setLocation}
          />
        </View>

        {/* 预约时间 */}
        <View style={styles.section}>
          <Text style={styles.label}>预约时间</Text>
          <TextInput
            style={[styles.input, { justifyContent: 'center' }]}
            placeholder="输入预约时间（如：2026-09-05 14:00，可选）"
            placeholderTextColor="#9CA3AF"
            value={scheduledDateStr}
            onChangeText={setScheduledDateStr}
          />
        </View>
      </ScrollView>

      {/* 底部提交按钮 */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.submitButton, submitting && styles.submitButtonDisabled]}
          onPress={handleSubmit}
          disabled={submitting}
        >
          {submitting ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.submitButtonText}>提交工单</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB' },
  scroll: { flex: 1 },
  scrollContent: { padding: 12, paddingBottom: 100 },
  section: { backgroundColor: '#FFFFFF', borderRadius: 12, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: COLORS.border },
  label: { fontSize: 14, fontWeight: '600', color: COLORS.text, marginBottom: 10 },
  required: { color: COLORS.danger },
  input: {
    borderWidth: 1, borderColor: COLORS.border, borderRadius: 8,
    paddingHorizontal: 12, paddingVertical: 10, fontSize: 14,
    backgroundColor: '#FAFAFA', color: COLORS.text,
  },
  textArea: { minHeight: 100, paddingTop: 10 },
  charCount: { fontSize: 12, color: COLORS.textSecondary, textAlign: 'right', marginTop: 4 },
  optionGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  optionChip: {
    paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20,
    borderWidth: 1, borderColor: COLORS.border, backgroundColor: '#FAFAFA',
  },
  optionChipSelected: { borderColor: COLORS.primary, backgroundColor: COLORS.bgLight },
  optionChipText: { fontSize: 13, fontWeight: '500', color: COLORS.textSecondary },
  optionChipTextSelected: { color: COLORS.primaryDark },
  priorityDot: { width: 8, height: 8, borderRadius: 4 },
  placeholderText: { fontSize: 14, color: '#9CA3AF' },
  dateText: { fontSize: 14, color: COLORS.text },
  footer: { padding: 16, backgroundColor: '#FFFFFF', borderTopWidth: 1, borderTopColor: COLORS.border },
  submitButton: { backgroundColor: COLORS.primary, borderRadius: 8, paddingVertical: 14, alignItems: 'center' },
  submitButtonDisabled: { opacity: 0.6 },
  submitButtonText: { fontSize: 16, fontWeight: '600', color: '#FFFFFF' },
});
