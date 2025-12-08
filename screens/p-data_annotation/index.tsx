

import React, { useState, useRef } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, Image, Alert, Dimensions, } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { FontAwesome6 } from '@expo/vector-icons';
import styles from './styles';
import CaseItem from './components/CaseItem';
import AnnotationTool from './components/AnnotationTool';

interface CaseData {
  id: string;
  title: string;
  diagnosis: string;
  status: 'annotated' | 'pending' | 'in-progress';
  date: string;
  image: string;
}

const DataAnnotationScreen = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'list' | 'annotation'>('list');
  const [searchText, setSearchText] = useState('');
  const [selectedCase, setSelectedCase] = useState<CaseData | null>(null);

  const casesData: CaseData[] = [
    {
      id: 'case1',
      title: '新城疫 - 典型症状',
      diagnosis: 'AI诊断：新城疫 (95%)',
      status: 'annotated',
      date: '2024-01-15',
      image: 'https://s.coze.cn/image/7rhsn6jvZ-8/',
    },
    {
      id: 'case2',
      title: '禽流感疑似病例',
      diagnosis: 'AI诊断：禽流感 (88%)',
      status: 'pending',
      date: '2024-01-14',
      image: 'https://s.coze.cn/image/wML2VcSuOFI/',
    },
    {
      id: 'case3',
      title: '传染性支气管炎',
      diagnosis: 'AI诊断：传染性支气管炎 (92%)',
      status: 'in-progress',
      date: '2024-01-13',
      image: 'https://s.coze.cn/image/IxtLN0C-0HY/',
    },
    {
      id: 'case4',
      title: '混合感染案例',
      diagnosis: 'AI诊断：新城疫+禽流感 (78%)',
      status: 'pending',
      date: '2024-01-12',
      image: 'https://s.coze.cn/image/HYFSKWVxR-E/',
    },
  ];

  const filteredCases = casesData.filter(
    (caseItem) =>
      caseItem.title.toLowerCase().includes(searchText.toLowerCase()) ||
      caseItem.diagnosis.toLowerCase().includes(searchText.toLowerCase())
  );

  const handleBackPress = () => {
    if (router.canGoBack()) {
      router.back();
    }
  };

  const handleResearchCollabPress = () => {
    router.push('/p-research_collab');
  };

  const handleTabPress = (tab: 'list' | 'annotation') => {
    setActiveTab(tab);
  };

  const handleCasePress = (caseItem: CaseData) => {
    setSelectedCase(caseItem);
    setActiveTab('annotation');
  };

  const handleFilterPress = () => {
    Alert.alert('筛选', '筛选功能开发中');
  };

  const handleDownloadOriginal = () => {
    Alert.alert('下载', '图片已下载');
  };

  const handleSaveAnnotation = () => {
    Alert.alert('保存', '标注已保存');
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* 顶部导航栏 */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity style={styles.backButton} onPress={handleBackPress}>
            <FontAwesome6 name="arrow-left" size={20} color="#6B7280" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>数据标注</Text>
        </View>
        <TouchableOpacity
          style={styles.researchButton}
          onPress={handleResearchCollabPress}
        >
          <FontAwesome6 name="users" size={20} color="#6B7280" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* 标签页切换 */}
        <View style={styles.tabSwitcher}>
          <TouchableOpacity
            style={[
              styles.tabButton,
              activeTab === 'list' && styles.activeTabButton,
            ]}
            onPress={() => handleTabPress('list')}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === 'list' && styles.activeTabText,
              ]}
            >
              病例列表
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.tabButton,
              activeTab === 'annotation' && styles.activeTabButton,
            ]}
            onPress={() => handleTabPress('annotation')}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === 'annotation' && styles.activeTabText,
              ]}
            >
              标注工具
            </Text>
          </TouchableOpacity>
        </View>

        {/* 病例列表视图 */}
        {activeTab === 'list' && (
          <View style={styles.listView}>
            {/* 搜索和筛选 */}
            <View style={styles.searchFilter}>
              <View style={styles.searchInputWrapper}>
                <FontAwesome6
                  name="magnifying-glass"
                  size={16}
                  color="#6B7280"
                  style={styles.searchIcon}
                />
                <TextInput
                  style={styles.searchInput}
                  placeholder="搜索病例..."
                  value={searchText}
                  onChangeText={setSearchText}
                />
              </View>
              <TouchableOpacity
                style={styles.filterButton}
                onPress={handleFilterPress}
              >
                <FontAwesome6 name="filter" size={16} color="#FFFFFF" />
              </TouchableOpacity>
            </View>

            {/* 病例列表 */}
            <View style={styles.caseList}>
              {filteredCases.map((caseItem) => (
                <CaseItem
                  key={caseItem.id}
                  caseData={caseItem}
                  onPress={() => handleCasePress(caseItem)}
                />
              ))}
            </View>
          </View>
        )}

        {/* 标注工具视图 */}
        {activeTab === 'annotation' && (
          <AnnotationTool
            selectedCase={selectedCase}
            onDownloadOriginal={handleDownloadOriginal}
            onSaveAnnotation={handleSaveAnnotation}
          />
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default DataAnnotationScreen;

