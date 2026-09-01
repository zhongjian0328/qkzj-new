import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, ActivityIndicator, TouchableOpacity, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Header from '../components/Header';
import { styles } from '../styles';
import { environmentApi } from '../services/api';

interface EnvironmentAlert {
  id: string;
  recordId: string;
  farmName: string;
  recordDate: string;
  alertType: string;
  alertValue: number;
  threshold: number;
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

const ALERT_FILTERS = [
  { key: 'ALL', label: '全部' },
  { key: 'HIGH_TEMP', label: '高温超标' },
  { key: 'LOW_TEMP', label: '低温预警' },
  { key: 'HIGH_HUMIDITY', label: '湿度过高' },
  { key: 'HIGH_AMMONIA', label: '氨气超标' },
  { key: 'HIGH_CO2', label: 'CO2超标' },
  { key: 'HIGH_PM25', label: 'PM2.5超标' },
  { key: 'HIGH_PM10', label: 'PM10超标' },
];

const getAlertColor = (alertType: string) => {
  switch (alertType) {
    case 'HIGH_TEMP':
    case 'HIGH_AMMONIA':
    case 'HIGH_CO2':
      return { bg: '#FEF3C7', text: '#92400E', border: '#F59E0B' };
    case 'HIGH_HUMIDITY':
    case 'HIGH_PM25':
    case 'HIGH_PM10':
      return { bg: '#FEE2E2', text: '#991B1B', border: '#EF4444' };
    case 'LOW_TEMP':
      return { bg: '#DBEAFE', text: '#1E40AF', border: '#3B82F6' };
    default:
      return { bg: '#FEF3C7', text: '#92400E', border: '#F59E0B' };
  }
};

const EnvironmentAlertScreen: React.FC = () => {
  const navigation = useNavigation<any>();

  const [alerts, setAlerts] = useState<EnvironmentAlert[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedFilter, setSelectedFilter] = useState<string>('ALL');

  useEffect(() => {
    fetchAlerts();
  }, [selectedFilter]);

  const fetchAlerts = async () => {
    setLoading(true);
    setError(null);
    try {
      const params: any = {};
      if (selectedFilter !== 'ALL') {
        params.alertType = selectedFilter;
      }
      const response = await environmentApi.getAlerts(params);
      setAlerts(response.data || []);
    } catch (err: any) {
      console.error('获取环境预警失败:', err);
      setError(err?.response?.data?.message || '获取预警数据失败，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  const renderAlertItem = ({ item }: { item: EnvironmentAlert }) => {
    const colors = getAlertColor(item.alertType);

    return (
      <View
        style={{
          backgroundColor: '#FFFFFF',
          borderRadius: 12,
          padding: 16,
          marginBottom: 12,
          borderLeftWidth: 4,
          borderLeftColor: colors.border,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.06,
          shadowRadius: 4,
          elevation: 2,
        }}
      >
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
          <Text style={{ fontSize: 16, fontWeight: '600', color: '#1F2937' }}>{item.farmName}</Text>
          <View style={{ backgroundColor: colors.bg, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 }}>
            <Text style={{ fontSize: 12, color: colors.text, fontWeight: '500' }}>
              {ALERT_TYPE_MAP[item.alertType] || item.alertType}
            </Text>
          </View>
        </View>

        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <Text style={{ fontSize: 14, color: '#6B7280' }}>{item.recordDate}</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
            <View style={{ alignItems: 'center' }}>
              <Text style={{ fontSize: 12, color: '#9CA3AF' }}>检测值</Text>
              <Text style={{ fontSize: 16, fontWeight: '600', color: colors.text }}>{item.alertValue}</Text>
            </View>
            <View style={{ alignItems: 'center' }}>
              <Text style={{ fontSize: 12, color: '#9CA3AF' }}>阈值</Text>
              <Text style={{ fontSize: 16, fontWeight: '600', color: '#6B7280' }}>{item.threshold}</Text>
            </View>
          </View>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Header
        title="环境预警"
        showBackButton
        onBack={() => navigation.goBack()}
      />

      {/* 预警类型筛选 */}
      <View style={{ padding: 16, paddingBottom: 8 }}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {ALERT_FILTERS.map((filter) => (
            <TouchableOpacity
              key={filter.key}
              style={[
                {
                  paddingHorizontal: 16,
                  paddingVertical: 8,
                  borderRadius: 20,
                  marginRight: 8,
                  borderWidth: 1,
                  borderColor: '#E5E7EB',
                  backgroundColor: '#F3F4F6',
                },
                selectedFilter === filter.key && {
                  backgroundColor: '#1F5E52',
                  borderColor: '#1F5E52',
                },
              ]}
              onPress={() => setSelectedFilter(filter.key)}
            >
              <Text
                style={{
                  fontSize: 14,
                  color: '#6B7280',
                  fontWeight: '500',
                }}
              >
                {filter.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {error && (
        <View style={{ padding: 16, backgroundColor: '#FEF2F2', margin: 16, borderRadius: 8 }}>
          <Text style={{ color: '#EF4444', fontSize: 14 }}>{error}</Text>
        </View>
      )}

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#2DBBA1" />
        </View>
      ) : (
        <FlatList
          data={alerts}
          renderItem={renderAlertItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ padding: 16, paddingTop: 8 }}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>暂无环境预警</Text>
              <Text style={{ fontSize: 14, color: '#9CA3AF' }}>当前筛选条件下没有预警信息</Text>
            </View>
          }
        />
      )}
    </View>
  );
};

export default EnvironmentAlertScreen;
