import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, FlatList, Modal, TextInput, ActivityIndicator, Alert, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Header from '../components/Header';
import { styles } from '../styles';
import { environmentApi } from '../services/api';
import { useAuth } from '../context/UserContext';

interface EnvironmentRecord {
  id: string;
  farmName: string;
  temperature?: number;
  humidity?: number;
  ammonia?: number;
  co2?: number;
  pm25?: number;
  pm10?: number;
  batchId?: string;
  recordDate: string;
  recorder?: string;
  notes?: string;
  alerts?: Array<{ alertType: string; alertValue: number; threshold: number }>;
}

const ALERT_TYPE_MAP: Record<string, string> = {
  HIGH_TEMP: '高温超标',
  LOW_TEMP: '低温预警',
  HIGH_HUMIDITY: '湿度过高',
  HIGH_AMMONIA: '氨气超标',
  HIGH_CO2: 'CO2超标',
  HIGH_PM25: 'PM2.5超标',
  HIGH_PM10: 'PM10超标',
};

const getTodayDateString = () => {
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, '0');
  const dd = String(today.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
};

const EnvironmentRecordScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const { state } = useAuth();
  const { user } = state;

  const [records, setRecords] = useState<EnvironmentRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    farmName: '',
    recordDate: getTodayDateString(),
    temperature: '',
    humidity: '',
    ammonia: '',
    co2: '',
    pm25: '',
    pm10: '',
    notes: '',
  });

  useEffect(() => {
    fetchRecords();
  }, []);

  const fetchRecords = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await environmentApi.getRecords({ limit: 10 });
      setRecords(response.data || []);
    } catch (err: any) {
      console.error('获取环境记录失败:', err);
      setError(err?.response?.data?.message || '获取记录失败，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      farmName: '',
      recordDate: getTodayDateString(),
      temperature: '',
      humidity: '',
      ammonia: '',
      co2: '',
      pm25: '',
      pm10: '',
      notes: '',
    });
  };

  const handleSubmit = async () => {
    if (!formData.farmName.trim()) {
      Alert.alert('提示', '请填写养殖场名称');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const payload: any = {
        farmName: formData.farmName.trim(),
        recordDate: formData.recordDate || undefined,
        recorder: user?.nickname || undefined,
      };

      if (formData.temperature) payload.temperature = parseFloat(formData.temperature);
      if (formData.humidity) payload.humidity = parseFloat(formData.humidity);
      if (formData.ammonia) payload.ammonia = parseFloat(formData.ammonia);
      if (formData.co2) payload.co2 = parseFloat(formData.co2);
      if (formData.pm25) payload.pm25 = parseFloat(formData.pm25);
      if (formData.pm10) payload.pm10 = parseFloat(formData.pm10);
      if (formData.notes.trim()) payload.notes = formData.notes.trim();

      await environmentApi.createRecord(payload);

      Alert.alert('成功', '环境记录创建成功');
      resetForm();
      setModalVisible(false);
      fetchRecords();
    } catch (err: any) {
      console.error('创建环境记录失败:', err);
      setError(err?.response?.data?.message || '创建记录失败，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  const renderRecordItem = ({ item }: { item: EnvironmentRecord }) => {
    const hasAlerts = item.alerts && item.alerts.length > 0;

    return (
      <View style={styles.deathFeedItem}>
        <View style={styles.deathFeedItemHeader}>
          <Text style={styles.deathFeedItemDate}>{item.recordDate}</Text>
          <Text style={styles.deathFeedItemBatch}>{item.farmName}</Text>
        </View>
        <View style={styles.deathFeedItemContent}>
          <View style={styles.deathFeedItemStats}>
            {item.temperature !== undefined && item.temperature !== null && (
              <View style={styles.statItem}>
                <Text style={styles.statItemLabel}>温度</Text>
                <Text style={styles.statItemValue}>{item.temperature}°C</Text>
              </View>
            )}
            {item.humidity !== undefined && item.humidity !== null && (
              <View style={styles.statItem}>
                <Text style={styles.statItemLabel}>湿度</Text>
                <Text style={styles.statItemValue}>{item.humidity}%</Text>
              </View>
            )}
            {item.ammonia !== undefined && item.ammonia !== null && (
              <View style={styles.statItem}>
                <Text style={styles.statItemLabel}>氨气</Text>
                <Text style={styles.statItemValue}>{item.ammonia}ppm</Text>
              </View>
            )}
            {item.co2 !== undefined && item.co2 !== null && (
              <View style={styles.statItem}>
                <Text style={styles.statItemLabel}>CO2</Text>
                <Text style={styles.statItemValue}>{item.co2}ppm</Text>
              </View>
            )}
          </View>
          <View style={{ ...styles.deathFeedItemStats, marginTop: 8 }}>
            {item.pm25 !== undefined && item.pm25 !== null && (
              <View style={styles.statItem}>
                <Text style={styles.statItemLabel}>PM2.5</Text>
                <Text style={styles.statItemValue}>{item.pm25}mg/m³</Text>
              </View>
            )}
            {item.pm10 !== undefined && item.pm10 !== null && (
              <View style={styles.statItem}>
                <Text style={styles.statItemLabel}>PM10</Text>
                <Text style={styles.statItemValue}>{item.pm10}mg/m³</Text>
              </View>
            )}
          </View>
          {item.notes && (
            <View style={{ marginTop: 8, padding: 8, backgroundColor: '#F9FAFB', borderRadius: 8 }}>
              <Text style={{ fontSize: 12, color: '#6B7280' }}>备注: {item.notes}</Text>
            </View>
          )}
        </View>
        {hasAlerts && (
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 8 }}>
            {item.alerts!.map((alert, idx) => (
              <View
                key={idx}
                style={{
                  backgroundColor: '#FEF3C7',
                  paddingHorizontal: 10,
                  paddingVertical: 4,
                  borderRadius: 12,
                }}
              >
                <Text style={{ fontSize: 12, color: '#92400E', fontWeight: '500' }}>
                  {ALERT_TYPE_MAP[alert.alertType] || alert.alertType}
                </Text>
              </View>
            ))}
          </View>
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Header
        title="环境数据"
        showBackButton
        onBack={() => navigation.goBack()}
        rightComponent={
          <TouchableOpacity onPress={() => { resetForm(); setModalVisible(true); }}>
            <Text style={{ color: '#2DBBA1', fontSize: 16 }}>新增记录</Text>
          </TouchableOpacity>
        }
      />

      {error && (
        <View style={{ padding: 16, backgroundColor: '#FEF2F2', margin: 16, borderRadius: 8 }}>
          <Text style={{ color: '#EF4444', fontSize: 14 }}>{error}</Text>
        </View>
      )}

      {loading && records.length === 0 ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#2DBBA1" />
        </View>
      ) : (
        <FlatList
          data={records}
          renderItem={renderRecordItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.recordList}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>暂无环境记录</Text>
              <TouchableOpacity
                style={styles.addFirstRecordButton}
                onPress={() => { resetForm(); setModalVisible(true); }}
              >
                <Text style={styles.addFirstRecordText}>添加第一条记录</Text>
              </TouchableOpacity>
            </View>
          }
        />
      )}

      {/* 新增记录模态框 */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>新增环境检测记录</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Text style={styles.modalCloseButton}>×</Text>
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalBody}>
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>养殖场名称 *</Text>
                <TextInput
                  style={styles.formInput}
                  placeholder="请输入养殖场名称"
                  value={formData.farmName}
                  onChangeText={(value) => setFormData({ ...formData, farmName: value })}
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>记录日期</Text>
                <TextInput
                  style={styles.formInput}
                  placeholder="YYYY-MM-DD"
                  value={formData.recordDate}
                  onChangeText={(value) => setFormData({ ...formData, recordDate: value })}
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>温度 (°C)</Text>
                <TextInput
                  style={styles.formInput}
                  placeholder="如：25.5"
                  value={formData.temperature}
                  onChangeText={(value) => setFormData({ ...formData, temperature: value })}
                  keyboardType="decimal-pad"
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>湿度 (%)</Text>
                <TextInput
                  style={styles.formInput}
                  placeholder="如：65"
                  value={formData.humidity}
                  onChangeText={(value) => setFormData({ ...formData, humidity: value })}
                  keyboardType="decimal-pad"
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>氨气 (ppm)</Text>
                <TextInput
                  style={styles.formInput}
                  placeholder="如：15"
                  value={formData.ammonia}
                  onChangeText={(value) => setFormData({ ...formData, ammonia: value })}
                  keyboardType="decimal-pad"
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>CO2 (ppm)</Text>
                <TextInput
                  style={styles.formInput}
                  placeholder="如：500"
                  value={formData.co2}
                  onChangeText={(value) => setFormData({ ...formData, co2: value })}
                  keyboardType="decimal-pad"
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>PM2.5 (mg/m³)</Text>
                <TextInput
                  style={styles.formInput}
                  placeholder="如：0.05"
                  value={formData.pm25}
                  onChangeText={(value) => setFormData({ ...formData, pm25: value })}
                  keyboardType="decimal-pad"
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>PM10 (mg/m³)</Text>
                <TextInput
                  style={styles.formInput}
                  placeholder="如：0.1"
                  value={formData.pm10}
                  onChangeText={(value) => setFormData({ ...formData, pm10: value })}
                  keyboardType="decimal-pad"
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>备注</Text>
                <TextInput
                  style={[styles.formInput, { minHeight: 80, textAlignVertical: 'top' }]}
                  placeholder="可选填写备注信息"
                  value={formData.notes}
                  onChangeText={(value) => setFormData({ ...formData, notes: value })}
                  multiline
                  numberOfLines={3}
                />
              </View>
            </ScrollView>

            <View style={styles.modalFooter}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.modalButtonText}>取消</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.submitButton]}
                onPress={handleSubmit}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="#FFFFFF" />
                ) : (
                  <Text style={styles.modalButtonText}>保存</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default EnvironmentRecordScreen;
