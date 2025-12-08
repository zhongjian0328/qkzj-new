

import React, { useState, useRef } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Alert, TextInput, Platform, } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { FontAwesome6 } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import styles from './styles';

interface ExportType {
  id: string;
  name: string;
  icon: string;
  color: string;
}

interface TimeRange {
  id: string;
  name: string;
}

interface ExportHistoryItem {
  id: string;
  type: string;
  title: string;
  dateRange: string;
  timestamp: string;
  fileName: string;
  fileType: string;
}

const DataExportScreen = () => {
  const router = useRouter();
  
  // 状态管理
  const [selectedExportType, setSelectedExportType] = useState('production');
  const [selectedTimeRange, setSelectedTimeRange] = useState('today');
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);
  const [showCustomDatePicker, setShowCustomDatePicker] = useState(false);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  
  // 导出类型配置
  const exportTypes: ExportType[] = [
    { id: 'production', name: '生产数据', icon: 'chart-line', color: 'green' },
    { id: 'customer', name: '客户数据', icon: 'users', color: 'blue' },
    { id: 'internship', name: '实习报告', icon: 'graduation-cap', color: 'purple' },
    { id: 'diagnosis', name: '诊断记录', icon: 'stethoscope', color: 'orange' },
  ];
  
  // 时间范围配置
  const timeRanges: TimeRange[] = [
    { id: 'today', name: '今天' },
    { id: 'week', name: '近7天' },
    { id: 'month', name: '近30天' },
    { id: 'quarter', name: '近3月' },
    { id: 'year', name: '近1年' },
    { id: 'custom', name: '自定义' },
  ];
  
  // 历史记录状态
  const [exportHistory, setExportHistory] = useState<ExportHistoryItem[]>([
    {
      id: '1',
      type: 'production',
      title: '生产数据报表',
      dateRange: '2024-01-01 至 2024-01-15',
      timestamp: '2024-01-15 14:30',
      fileName: 'production_20240115.xlsx',
      fileType: 'xlsx',
    },
    {
      id: '2',
      type: 'customer',
      title: '客户数据汇总',
      dateRange: '2024-01-01 至 2024-01-14',
      timestamp: '2024-01-14 09:15',
      fileName: 'customer_20240114.csv',
      fileType: 'csv',
    },
    {
      id: '3',
      type: 'internship',
      title: '实习报告合集',
      dateRange: '2024-01-01 至 2024-01-13',
      timestamp: '2024-01-13 16:45',
      fileName: 'internship_20240113.pdf',
      fileType: 'pdf',
    },
    {
      id: '4',
      type: 'diagnosis',
      title: '诊断记录统计',
      dateRange: '2024-01-01 至 2024-01-12',
      timestamp: '2024-01-12 11:20',
      fileName: 'diagnosis_20240112.xlsx',
      fileType: 'xlsx',
    },
  ]);
  
  // 定时器引用
  const exportTimerRef = useRef<number | null>(null);
  
  // 返回按钮处理
  const handleBackPress = () => {
    if (router.canGoBack()) {
      router.back();
    }
  };
  
  // 导出类型选择
  const handleExportTypeSelect = (typeId: string) => {
    setSelectedExportType(typeId);
  };
  
  // 时间范围选择
  const handleTimeRangeSelect = (rangeId: string) => {
    setSelectedTimeRange(rangeId);
    setShowCustomDatePicker(rangeId === 'custom');
  };
  
  // 开始导出
  const handleStartExport = () => {
    // 验证自定义日期
    if (selectedTimeRange === 'custom') {
      if (!startDate || !endDate) {
        Alert.alert('提示', '请选择完整的日期范围');
        return;
      }
      
      if (new Date(startDate) > new Date(endDate)) {
        Alert.alert('提示', '开始日期不能晚于结束日期');
        return;
      }
    }
    
    // 开始导出流程
    setIsExporting(true);
    setExportProgress(0);
    simulateExportProcess();
  };
  
  // 模拟导出过程
  const simulateExportProcess = () => {
    let progress = 0;
    
    exportTimerRef.current = setInterval(() => {
      progress += Math.random() * 15;
      
      if (progress >= 100) {
        progress = 100;
        if (exportTimerRef.current) {
          clearInterval(exportTimerRef.current);
        }
        
        // 导出完成
        setTimeout(() => {
          setIsExporting(false);
          addToExportHistory();
          Alert.alert('成功', '数据导出成功！');
        }, 500);
      }
      
      setExportProgress(progress);
    }, 200) as unknown as number;
  };
  
  // 添加到历史记录
  const addToExportHistory = () => {
    const exportType = exportTypes.find(type => type.id === selectedExportType);
    const now = new Date();
    const timestamp = now.getTime();
    const fileName = `${selectedExportType}_${timestamp}.${getExportFileType(exportType?.id || '')}`;
    
    const newHistoryItem: ExportHistoryItem = {
      id: timestamp.toString(),
      type: selectedExportType,
      title: getExportTitle(exportType?.id || ''),
      dateRange: getDateRangeText(),
      timestamp: now.toLocaleString('zh-CN'),
      fileName,
      fileType: getExportFileType(exportType?.id || ''),
    };
    
    setExportHistory(prev => [newHistoryItem, ...prev]);
  };
  
  // 获取导出标题
  const getExportTitle = (typeId: string): string => {
    const titles: { [key: string]: string } = {
      'production': '生产数据报表',
      'customer': '客户数据汇总',
      'internship': '实习报告合集',
      'diagnosis': '诊断记录统计',
    };
    return titles[typeId] || '数据报表';
  };
  
  // 获取导出文件类型
  const getExportFileType = (typeId: string): string => {
    const fileTypes: { [key: string]: string } = {
      'production': 'xlsx',
      'customer': 'csv',
      'internship': 'pdf',
      'diagnosis': 'xlsx',
    };
    return fileTypes[typeId] || 'xlsx';
  };
  
  // 获取日期范围文本
  const getDateRangeText = (): string => {
    if (selectedTimeRange === 'custom') {
      return `${startDate} 至 ${endDate}`;
    }
    
    const ranges: { [key: string]: string } = {
      'today': '今天',
      'week': '近7天',
      'month': '近30天',
      'quarter': '近3月',
      'year': '近1年',
    };
    
    return ranges[selectedTimeRange] || '';
  };
  
  // 下载历史文件
  const handleDownloadHistoryFile = (fileName: string) => {
    Alert.alert('下载', `正在下载文件: ${fileName}`);
  };
  
  // 清空历史记录
  const handleClearHistory = () => {
    Alert.alert(
      '确认',
      '确定要清空所有导出历史吗？',
      [
        { text: '取消', style: 'cancel' },
        { 
          text: '确定', 
          onPress: () => setExportHistory([])
        },
      ]
    );
  };
  
  // 获取导出类型图标
  const getExportTypeIcon = (fileType: string): string => {
    switch (fileType) {
      case 'xlsx':
        return 'file-excel';
      case 'csv':
        return 'file-csv';
      case 'pdf':
        return 'file-pdf';
      default:
        return 'file-excel';
    }
  };
  
  // 获取导出类型颜色
  const getExportTypeColor = (typeId: string): string => {
    const exportType = exportTypes.find(type => type.id === typeId);
    return exportType?.color || 'green';
  };
  
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
        <Text style={styles.headerTitle}>数据导出</Text>
      </View>
      
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* 导出配置区域 */}
        <View style={styles.exportConfigSection}>
          <Text style={styles.sectionTitle}>导出配置</Text>
          
          {/* 导出类型选择 */}
          <View style={styles.exportTypeSection}>
            <Text style={styles.subSectionTitle}>导出类型</Text>
            <View style={styles.exportTypeGrid}>
              {exportTypes.map((type) => (
                <TouchableOpacity
                  key={type.id}
                  style={[
                    styles.exportTypeButton,
                    selectedExportType === type.id 
                      ? styles.exportTypeButtonActive 
                      : styles.exportTypeButtonInactive
                  ]}
                  onPress={() => handleExportTypeSelect(type.id)}
                  activeOpacity={0.8}
                >
                  <FontAwesome6 
                    name={type.icon} 
                    size={14} 
                    color={selectedExportType === type.id ? '#FFFFFF' : '#6B7280'} 
                    style={styles.exportTypeIcon}
                  />
                  <Text style={[
                    styles.exportTypeText,
                    selectedExportType === type.id 
                      ? styles.exportTypeTextActive 
                      : styles.exportTypeTextInactive
                  ]}>
                    {type.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
          
          {/* 时间范围选择 */}
          <View style={styles.timeRangeSection}>
            <Text style={styles.subSectionTitle}>时间范围</Text>
            <View style={styles.timeRangeGrid}>
              {timeRanges.map((range) => (
                <TouchableOpacity
                  key={range.id}
                  style={[
                    styles.timeRangeButton,
                    selectedTimeRange === range.id 
                      ? styles.timeRangeButtonActive 
                      : styles.timeRangeButtonInactive
                  ]}
                  onPress={() => handleTimeRangeSelect(range.id)}
                  activeOpacity={0.8}
                >
                  <Text style={[
                    styles.timeRangeText,
                    selectedTimeRange === range.id 
                      ? styles.timeRangeTextActive 
                      : styles.timeRangeTextInactive
                  ]}>
                    {range.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
          
          {/* 自定义时间选择器 */}
          {showCustomDatePicker && (
            <View style={styles.customDatePicker}>
              <View style={styles.dateInputRow}>
                <View style={styles.dateInputWrapper}>
                  <Text style={styles.dateInputLabel}>开始日期</Text>
                  <TextInput
                    style={styles.dateInput}
                    value={startDate}
                    onChangeText={setStartDate}
                    placeholder="YYYY-MM-DD"
                    placeholderTextColor="#9CA3AF"
                  />
                </View>
                <View style={styles.dateInputWrapper}>
                  <Text style={styles.dateInputLabel}>结束日期</Text>
                  <TextInput
                    style={styles.dateInput}
                    value={endDate}
                    onChangeText={setEndDate}
                    placeholder="YYYY-MM-DD"
                    placeholderTextColor="#9CA3AF"
                  />
                </View>
              </View>
            </View>
          )}
          
          {/* 导出按钮 */}
          <TouchableOpacity 
            style={styles.exportButtonContainer}
            onPress={handleStartExport}
            activeOpacity={0.8}
            disabled={isExporting}
          >
            <LinearGradient
              colors={['#D3F8EE', '#3BCCA5']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.exportButton}
            >
              <FontAwesome6 name="download" size={16} color="#2B6A5A" style={styles.exportButtonIcon} />
              <Text style={styles.exportButtonText}>开始导出</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
        
        {/* 导出进度 */}
        {isExporting && (
          <View style={styles.exportProgressSection}>
            <View style={styles.progressCard}>
              <View style={styles.progressHeader}>
                <Text style={styles.progressTitle}>正在导出数据...</Text>
                <View style={styles.loadingSpinner} />
              </View>
              <View style={styles.progressBarContainer}>
                <View style={[styles.progressBar, { width: `${exportProgress}%` }]} />
              </View>
              <Text style={styles.progressText}>{Math.round(exportProgress)}%</Text>
            </View>
          </View>
        )}
        
        {/* 导出历史记录 */}
        <View style={styles.exportHistorySection}>
          <View style={styles.historyHeader}>
            <Text style={styles.sectionTitle}>导出历史</Text>
            <TouchableOpacity 
              style={styles.clearHistoryButton}
              onPress={handleClearHistory}
              activeOpacity={0.7}
            >
              <FontAwesome6 name="trash-can" size={12} color="#6B7280" style={styles.clearHistoryIcon} />
              <Text style={styles.clearHistoryText}>清空</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.historyList}>
            {exportHistory.length > 0 ? (
              exportHistory.map((item) => (
                <View key={item.id} style={styles.historyItem}>
                  <View style={styles.historyItemContent}>
                    <View style={[
                      styles.historyItemIcon,
                      { backgroundColor: `${getExportTypeColor(item.type)}1A` }
                    ]}>
                      <FontAwesome6 
                        name={getExportTypeIcon(item.fileType)} 
                        size={16} 
                        color={getExportTypeColor(item.type)} 
                      />
                    </View>
                    <View style={styles.historyItemInfo}>
                      <Text style={styles.historyItemTitle}>{item.title}</Text>
                      <Text style={styles.historyItemDateRange}>{item.dateRange}</Text>
                      <Text style={styles.historyItemTimestamp}>{item.timestamp}</Text>
                    </View>
                  </View>
                  <TouchableOpacity 
                    style={styles.historyItemDownloadButton}
                    onPress={() => handleDownloadHistoryFile(item.fileName)}
                    activeOpacity={0.7}
                  >
                    <FontAwesome6 name="download" size={16} color="#3BCCA5" />
                  </TouchableOpacity>
                </View>
              ))
            ) : (
              <View style={styles.emptyHistoryContainer}>
                <Text style={styles.emptyHistoryText}>暂无导出历史</Text>
              </View>
            )}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default DataExportScreen;

