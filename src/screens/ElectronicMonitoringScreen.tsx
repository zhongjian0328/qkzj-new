import React, { useState, useEffect, useRef, useMemo } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { LineChart } from 'react-native-chart-kit';
import Header from '../components/Header';
import { styles } from '../styles';
import { Ionicons } from '@expo/vector-icons';

const screenWidth = Dimensions.get('window').width;

// ============ 养殖区域配置 ============
// 区/舍两级层级：每个区域类型下分若干「区」，每个区下分若干「舍」
interface AreaType {
  id: string;
  name: string;
  zoneCount: number;
}

const AREA_TYPES: AreaType[] = [
  { id: 'linxia', name: '林下散养区', zoneCount: 10 },
  { id: 'longyang', name: '笼养区', zoneCount: 6 },
  { id: 'yuchu', name: '育雏区', zoneCount: 4 },
  { id: 'yucheng', name: '育成区', zoneCount: 5 },
];

// 中文数字转换（一区 ~ 十区）
const CN_NUM = ['一', '二', '三', '四', '五', '六', '七', '八', '九', '十'];

const HOUSES_PER_ZONE = 3; // 每个区下默认 3 个舍

// 区号生成：返回「一区」~「十区」
const buildZoneLabels = (count: number): string[] => {
  return Array.from({ length: count }, (_, i) => `${CN_NUM[i] || String(i + 1)}区`);
};

// 舍号生成：返回「1舍」~「N舍」
const buildHouseLabels = (count: number): string[] => {
  return Array.from({ length: count }, (_, i) => `${i + 1}舍`);
};

// ============ 用电量数据模拟 ============
// 以 [区域-区-舍] 为键存储每小时用电量（kWh）
// 真实场景应由后端提供，此处用确定性伪随机保证同一切换回来看数据一致
const dataStoreRef: Record<string, number[]> = {};

const seedFor = (areaId: string, zoneIdx: number, houseIdx: number) => {
  let h = 0;
  const s = `${areaId}-${zoneIdx}-${houseIdx}`;
  for (let i = 0; i < s.length; i++) {
    h = (h * 31 + s.charCodeAt(i)) & 0xffff;
  }
  return h;
};

// 生成某舍 0~当前小时 的用电量序列（kWh），每小时一个点
const buildInitialSeries = (areaId: string, zoneIdx: number, houseIdx: number): number[] => {
  const key = `${areaId}-${zoneIdx}-${houseIdx}`;
  if (dataStoreRef[key]) return dataStoreRef[key];

  const seed = seedFor(areaId, zoneIdx, houseIdx);
  const currentHour = new Date().getHours();
  const series: number[] = [];
  for (let h = 0; h <= currentHour; h++) {
    // 用电量基线 3~8 kWh，叠加昼夜波动（白天偏高）
    const dayFactor = h >= 5 && h <= 19 ? 1.0 : 0.6;
    const base = 3 + (seed % 5);
    const noise = ((seed * (h + 7)) % 30) / 10;
    const value = Math.round((base * dayFactor + noise) * 10) / 10;
    series.push(Math.max(0.5, value));
  }
  dataStoreRef[key] = series;
  return series;
};

// 生成下一个小时的用电量点
const nextPoint = (areaId: string, zoneIdx: number, houseIdx: number, hour: number): number => {
  const seed = seedFor(areaId, zoneIdx, houseIdx);
  const dayFactor = hour >= 5 && hour <= 19 ? 1.0 : 0.6;
  const base = 3 + (seed % 5);
  const noise = ((seed * (hour + 13)) % 30) / 10;
  const value = Math.round((base * dayFactor + noise) * 10) / 10;
  return Math.max(0.5, value);
};

// ============ 主组件 ============
const ElectronicMonitoringScreen: React.FC = () => {
  const navigation = useNavigation<any>();

  // 选择状态
  const [areaId, setAreaId] = useState<string>(AREA_TYPES[0].id);
  const [zoneIdx, setZoneIdx] = useState<number>(0); // 0-based
  const [houseIdx, setHouseIdx] = useState<number>(0); // 0-based

  const area = useMemo(() => AREA_TYPES.find((a) => a.id === areaId)!, [areaId]);
  const zoneLabels = useMemo(() => buildZoneLabels(area.zoneCount), [area]);
  const houseLabels = useMemo(() => buildHouseLabels(HOUSES_PER_ZONE), []);

  // 切换区域时重置区/舍索引，避免越界
  useEffect(() => {
    setZoneIdx(0);
    setHouseIdx(0);
  }, [areaId]);

  // 左上角动态标题：选择什么显示什么
  const currentTitle = `${area.name}·${zoneLabels[zoneIdx]}·${houseLabels[houseIdx]}`;

  // 用电量数据
  const [powerSeries, setPowerSeries] = useState<number[]>([]);
  const lastUpdatedHourRef = useRef<number>(new Date().getHours());

  // 切换区/舍时重新加载该舍的数据
  useEffect(() => {
    const series = buildInitialSeries(areaId, zoneIdx, houseIdx);
    setPowerSeries([...series]);
    lastUpdatedHourRef.current = new Date().getHours();
  }, [areaId, zoneIdx, houseIdx]);

  // 每小时更新一次：只更新当前小时的用电量并延长曲线
  useEffect(() => {
    const tick = () => {
      const nowHour = new Date().getHours();
      // 跨过整点才追加新点（只更新这一个小时）
      if (nowHour !== lastUpdatedHourRef.current) {
        const key = `${areaId}-${zoneIdx}-${houseIdx}`;
        const point = nextPoint(areaId, zoneIdx, houseIdx, nowHour);
        // 写回 store 并刷新视图
        const existing = dataStoreRef[key] || [];
        // 若跨了多个小时，补齐中间缺失的小时
        while (existing.length <= nowHour) {
          const fillHour = existing.length;
          existing.push(fillHour === nowHour ? point : nextPoint(areaId, zoneIdx, houseIdx, fillHour));
        }
        dataStoreRef[key] = existing;
        setPowerSeries([...existing]);
        lastUpdatedHourRef.current = nowHour;
      }
    };

    // 每 60 秒检查一次是否跨过整点（轻量轮询，整点才真正更新）
    const timer = setInterval(tick, 60 * 1000);
    return () => clearInterval(timer);
  }, [areaId, zoneIdx, houseIdx]);

  // 图表 labels：0时 ~ N时
  const chartLabels = useMemo(() => {
    return powerSeries.map((_, i) => `${i}时`);
  }, [powerSeries]);

  const totalToday = useMemo(
    () => Math.round(powerSeries.reduce((s, v) => s + v, 0) * 10) / 10,
    [powerSeries],
  );
  const peakValue = useMemo(
    () => (powerSeries.length ? Math.max(...powerSeries) : 0),
    [powerSeries],
  );
  const avgValue = useMemo(
    () => (powerSeries.length ? Math.round((totalToday / powerSeries.length) * 10) / 10 : 0),
    [powerSeries, totalToday],
  );

  return (
    <View style={styles.container}>
      <Header
        title="电子监控"
        showBackButton
        onBack={() => navigation.goBack()}
      />

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: 32 }}
        showsVerticalScrollIndicator={false}
      >
        {/* ============ 左上角：动态标题（选择什么显示什么） ============ */}
        <View style={local.titleBar}>
          <View style={local.titleBarLeft}>
            <Ionicons name="location-outline" size={18} color="#2DBBA1" />
            <Text style={local.currentTitle}>{currentTitle}</Text>
          </View>
          <View style={[local.liveTag, { backgroundColor: '#E6F7F3' }]}>
            <View style={local.liveDot} />
            <Text style={local.liveText}>实时</Text>
          </View>
        </View>

        {/* ============ 区域类型选择按钮 ============ */}
        <Text style={local.sectionLabel}>养殖区域</Text>
        <View style={local.optionRow}>
          {AREA_TYPES.map((a) => {
            const active = a.id === areaId;
            return (
              <TouchableOpacity
                key={a.id}
                style={[local.optionBtn, active && local.optionBtnActive]}
                onPress={() => setAreaId(a.id)}
                activeOpacity={0.8}
              >
                <Text style={[local.optionText, active && local.optionTextActive]}>
                  {a.name}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* ============ 区号选择按钮 ============ */}
        <Text style={local.sectionLabel}>
          区（{area.name} 共 {area.zoneCount} 个区）
        </Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={local.zoneScroll}>
          {zoneLabels.map((label, idx) => {
            const active = idx === zoneIdx;
            return (
              <TouchableOpacity
                key={label}
                style={[local.zoneBtn, active && local.zoneBtnActive]}
                onPress={() => setZoneIdx(idx)}
                activeOpacity={0.8}
              >
                <Text style={[local.zoneText, active && local.zoneTextActive]}>{label}</Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* ============ 舍号选择按钮 ============ */}
        <Text style={local.sectionLabel}>舍</Text>
        <View style={local.optionRow}>
          {houseLabels.map((label, idx) => {
            const active = idx === houseIdx;
            return (
              <TouchableOpacity
                key={label}
                style={[local.optionBtn, active && local.optionBtnActive]}
                onPress={() => setHouseIdx(idx)}
                activeOpacity={0.8}
              >
                <Text style={[local.optionText, active && local.optionTextActive]}>{label}</Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* ============ 用电量统计卡片 ============ */}
        <View style={local.statsRow}>
          <View style={local.statCard}>
            <Text style={local.statLabel}>今日累计</Text>
            <Text style={local.statValue}>{totalToday}<Text style={local.statUnit}> kWh</Text></Text>
          </View>
          <View style={local.statCard}>
            <Text style={local.statLabel}>峰值</Text>
            <Text style={local.statValue}>{Math.round(peakValue * 10) / 10}<Text style={local.statUnit}> kWh</Text></Text>
          </View>
          <View style={local.statCard}>
            <Text style={local.statLabel}>小时均值</Text>
            <Text style={local.statValue}>{avgValue}<Text style={local.statUnit}> kWh</Text></Text>
          </View>
        </View>

        {/* ============ 禽舍用电量分析曲线 ============ */}
        <View style={local.chartCard}>
          <View style={local.chartHeader}>
            <Text style={local.chartTitle}>禽舍用电量分析</Text>
            <Text style={local.chartHint}>每小时更新 · 自动延长</Text>
          </View>
          {powerSeries.length > 0 ? (
            <LineChart
              data={{
                labels: chartLabels,
                datasets: [
                  {
                    data: powerSeries,
                    color: () => '#2DBBA1',
                    strokeWidth: 2,
                  },
                ],
              }}
              width={screenWidth - 48}
              height={240}
              yAxisSuffix="kWh"
              chartConfig={{
                backgroundColor: '#FFFFFF',
                backgroundGradientFrom: '#FFFFFF',
                backgroundGradientTo: '#FFFFFF',
                decimalPlaces: 1,
                color: (opacity = 1) => `rgba(45, 187, 161, ${opacity})`,
                labelColor: (opacity = 1) => `rgba(107, 114, 128, ${opacity})`,
                propsForDots: {
                  r: '4',
                  strokeWidth: '2',
                  stroke: '#2DBBA1',
                },
                formatYLabel: (val) => String(Math.round(Number(val))),
              }}
              bezier
              style={{
                marginVertical: 8,
                borderRadius: 12,
              }}
            />
          ) : (
            <Text style={local.emptyText}>暂无数据</Text>
          )}
          <Text style={local.chartFooter}>
            已覆盖 0 时 ~ {powerSeries.length - 1} 时，下一个整点自动追加并延长曲线
          </Text>
        </View>
      </ScrollView>
    </View>
  );
};

const local = StyleSheet.create({
  titleBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 8,
  },
  titleBarLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flexShrink: 1,
  },
  currentTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#111827',
    marginLeft: 6,
  },
  liveTag: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#EF4444',
    marginRight: 4,
  },
  liveText: {
    fontSize: 12,
    color: '#1F5E52',
    fontWeight: '600',
  },
  sectionLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    paddingHorizontal: 16,
    marginTop: 12,
    marginBottom: 8,
  },
  optionRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 12,
    gap: 8,
  },
  optionBtn: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: '#F3F4F6',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  optionBtnActive: {
    backgroundColor: '#E6F7F3',
    borderColor: '#2DBBA1',
  },
  optionText: {
    fontSize: 13,
    color: '#6B7280',
  },
  optionTextActive: {
    color: '#1F5E52',
    fontWeight: '600',
  },
  zoneScroll: {
    paddingHorizontal: 12,
  },
  zoneBtn: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: '#F3F4F6',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginRight: 8,
  },
  zoneBtnActive: {
    backgroundColor: '#2DBBA1',
    borderColor: '#2DBBA1',
  },
  zoneText: {
    fontSize: 14,
    color: '#6B7280',
  },
  zoneTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  statsRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginTop: 16,
    gap: 8,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#F3F4F6',
    elevation: 1,
  },
  statLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 4,
  },
  statValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
  },
  statUnit: {
    fontSize: 12,
    color: '#9CA3AF',
    fontWeight: '400',
  },
  chartCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 16,
    marginTop: 16,
    borderWidth: 1,
    borderColor: '#F3F4F6',
    elevation: 2,
  },
  chartHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
  },
  chartHint: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  emptyText: {
    textAlign: 'center',
    color: '#9CA3AF',
    paddingVertical: 40,
  },
  chartFooter: {
    fontSize: 11,
    color: '#9CA3AF',
    marginTop: 8,
    textAlign: 'center',
  },
});

export default ElectronicMonitoringScreen;
