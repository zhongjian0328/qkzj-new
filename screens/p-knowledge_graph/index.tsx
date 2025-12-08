

import React, { useState, useCallback } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, Modal, ScrollView, Image, RefreshControl, } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { FontAwesome6 } from '@expo/vector-icons';
import styles from './styles';

interface DiseaseData {
  id: string;
  name: string;
  category: 'viral' | 'bacterial' | 'parasitic' | 'metabolic';
  description: string;
  symptoms: string[];
  images: string[];
  relatedDiseases: string[];
}

interface CategoryItem {
  id: string;
  label: string;
  value: 'all' | 'viral' | 'bacterial' | 'parasitic' | 'metabolic';
}

const KnowledgeGraphScreen: React.FC = () => {
  const router = useRouter();
  
  // 状态管理
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [currentCategory, setCurrentCategory] = useState<string>('all');
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [selectedDisease, setSelectedDisease] = useState<DiseaseData | null>(null);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

  // 模拟疾病数据
  const diseaseData: DiseaseData[] = [
    {
      id: 'disease-001',
      name: '新城疫',
      category: 'viral',
      description: '新城疫是由新城疫病毒引起的一种急性、高度接触性传染病，主要感染鸡、鸭、鹅等禽类。临床表现为呼吸困难、腹泻、神经症状等。',
      symptoms: ['呼吸困难', '腹泻', '神经症状', '产蛋下降', '头部肿胀'],
      images: [
        'https://s.coze.cn/image/1PW8GUJMbV0/',
        'https://s.coze.cn/image/_bBxV_KnFjs/'
      ],
      relatedDiseases: ['禽流感', '传染性支气管炎']
    },
    {
      id: 'disease-002',
      name: '禽流感',
      category: 'viral',
      description: '禽流感是由A型流感病毒引起的禽类传染病，可分为高致病性和低致病性两种。高致病性禽流感死亡率极高。',
      symptoms: ['突然死亡', '呼吸困难', '头部水肿', '冠髯发紫', '产蛋异常'],
      images: [
        'https://s.coze.cn/image/PQjLtsyqiko/',
        'https://s.coze.cn/image/07zP2Bbn7b0/'
      ],
      relatedDiseases: ['新城疫', '传染性喉气管炎']
    },
    {
      id: 'disease-003',
      name: '大肠杆菌病',
      category: 'bacterial',
      description: '大肠杆菌病是由致病性大肠杆菌引起的一种细菌性传染病，可引起禽类的多种病症。',
      symptoms: ['腹泻', '气囊炎', '心包炎', '肝周炎', '脐炎'],
      images: [
        'https://s.coze.cn/image/fZBv2Wz2dVE/',
        'https://s.coze.cn/image/Cu74ULWGOfg/'
      ],
      relatedDiseases: ['沙门氏菌病', '巴氏杆菌病']
    },
    {
      id: 'disease-004',
      name: '球虫病',
      category: 'parasitic',
      description: '球虫病是由艾美耳球虫引起的肠道寄生虫病，主要危害幼禽，可导致严重的肠道损伤。',
      symptoms: ['血便', '消瘦', '贫血', '生长迟缓', '死亡率高'],
      images: [
        'https://s.coze.cn/image/ePnoNJA4CKY/',
        'https://s.coze.cn/image/GlI5FvvTpvE/'
      ],
      relatedDiseases: ['蛔虫病', '绦虫病']
    },
    {
      id: 'disease-005',
      name: '痛风',
      category: 'metabolic',
      description: '痛风是由于蛋白质代谢障碍引起的一种代谢性疾病，表现为尿酸盐在关节和内脏沉积。',
      symptoms: ['关节肿胀', '运动障碍', '尿酸盐沉积', '消瘦', '死亡率高'],
      images: [
        'https://s.coze.cn/image/haCsBJHLfl8/',
        'https://s.coze.cn/image/vg_VaUT3v9M/'
      ],
      relatedDiseases: ['脂肪肝', '佝偻病']
    }
  ];

  // 分类数据
  const categoryData: CategoryItem[] = [
    { id: 'all', label: '全部', value: 'all' },
    { id: 'viral', label: '病毒性疾病', value: 'viral' },
    { id: 'bacterial', label: '细菌性疾病', value: 'bacterial' },
    { id: 'parasitic', label: '寄生虫病', value: 'parasitic' },
    { id: 'metabolic', label: '代谢性疾病', value: 'metabolic' },
  ];

  // 获取分类中文名称
  const getCategoryName = useCallback((category: string): string => {
    const categoryNames = {
      'viral': '病毒性疾病',
      'bacterial': '细菌性疾病',
      'parasitic': '寄生虫病',
      'metabolic': '代谢性疾病'
    };
    return categoryNames[category as keyof typeof categoryNames] || '其他';
  }, []);

  // 过滤疾病数据
  const filteredDiseases = diseaseData.filter(disease => {
    const categoryMatch = currentCategory === 'all' || disease.category === currentCategory;
    const searchMatch = !searchQuery || 
      disease.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      disease.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      disease.symptoms.some(symptom => symptom.toLowerCase().includes(searchQuery.toLowerCase()));
    
    return categoryMatch && searchMatch;
  });

  // 处理返回按钮
  const handleBackPress = useCallback(() => {
    if (router.canGoBack()) {
      router.back();
    }
  }, [router]);

  // 处理分类选择
  const handleCategoryPress = useCallback((categoryValue: string) => {
    setCurrentCategory(categoryValue);
  }, []);

  // 处理疾病卡片点击
  const handleDiseasePress = useCallback((disease: DiseaseData) => {
    setSelectedDisease(disease);
    setIsModalVisible(true);
  }, []);

  // 处理相关疾病点击
  const handleRelatedDiseasePress = useCallback((diseaseName: string) => {
    const relatedDisease = diseaseData.find(d => d.name === diseaseName);
    if (relatedDisease) {
      setSelectedDisease(relatedDisease);
    }
  }, [diseaseData]);

  // 关闭模态框
  const handleCloseModal = useCallback(() => {
    setIsModalVisible(false);
    setSelectedDisease(null);
  }, []);

  // 下拉刷新
  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    // 模拟刷新延迟
    setTimeout(() => {
      setIsRefreshing(false);
    }, 1000);
  }, []);

  // 渲染分类按钮
  const renderCategoryItem = useCallback(({ item }: { item: CategoryItem }) => {
    const isActive = currentCategory === item.value;
    return (
      <TouchableOpacity
        style={[
          styles.categoryButton,
          isActive ? styles.categoryButtonActive : styles.categoryButtonInactive
        ]}
        onPress={() => handleCategoryPress(item.value)}
        activeOpacity={0.7}
      >
        <Text style={[
          styles.categoryButtonText,
          isActive ? styles.categoryButtonTextActive : styles.categoryButtonTextInactive
        ]}>
          {item.label}
        </Text>
      </TouchableOpacity>
    );
  }, [currentCategory, handleCategoryPress]);

  // 渲染疾病卡片
  const renderDiseaseItem = useCallback(({ item }: { item: DiseaseData }) => {
    return (
      <TouchableOpacity
        style={styles.diseaseCard}
        onPress={() => handleDiseasePress(item)}
        activeOpacity={0.8}
      >
        <View style={styles.diseaseCardContent}>
          <Image 
            source={{ uri: item.images[0] }} 
            style={styles.diseaseCardImage}
            resizeMode="cover"
          />
          <View style={styles.diseaseCardInfo}>
            <Text style={styles.diseaseCardTitle}>{item.name}</Text>
            <Text style={styles.diseaseCardDescription} numberOfLines={2}>
              {item.description}
            </Text>
            <View style={styles.diseaseCardCategoryContainer}>
              <Text style={styles.diseaseCardCategory}>
                {getCategoryName(item.category)}
              </Text>
            </View>
          </View>
          <FontAwesome6 name="chevron-right" style={styles.diseaseCardArrow} />
        </View>
      </TouchableOpacity>
    );
  }, [handleDiseasePress, getCategoryName]);

  // 渲染空状态
  const renderEmptyState = useCallback(() => {
    return (
      <View style={styles.emptyStateContainer}>
        <FontAwesome6 name="magnifying-glass" style={styles.emptyStateIcon} />
        <Text style={styles.emptyStateText}>未找到相关疾病</Text>
      </View>
    );
  }, []);

  // 渲染模态框内容
  const renderModalContent = useCallback(() => {
    if (!selectedDisease) return null;

    return (
      <ScrollView style={styles.modalScrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.modalContent}>
          {/* 疾病名称 */}
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>{selectedDisease.name}</Text>
            <View style={styles.modalCategoryContainer}>
              <Text style={styles.modalCategory}>
                {getCategoryName(selectedDisease.category)}
              </Text>
            </View>
          </View>

          {/* 病理图片 */}
          <View style={styles.modalSection}>
            <Text style={styles.modalSectionTitle}>病理图片</Text>
            <View style={styles.modalImagesContainer}>
              {selectedDisease.images.map((image, index) => (
                <Image
                  key={index}
                  source={{ uri: image }}
                  style={styles.modalImage}
                  resizeMode="cover"
                />
              ))}
            </View>
          </View>

          {/* 疾病描述 */}
          <View style={styles.modalSection}>
            <Text style={styles.modalSectionTitle}>疾病描述</Text>
            <Text style={styles.modalDescription}>{selectedDisease.description}</Text>
          </View>

          {/* 主要症状 */}
          <View style={styles.modalSection}>
            <Text style={styles.modalSectionTitle}>主要症状</Text>
            <View style={styles.modalSymptomsContainer}>
              {selectedDisease.symptoms.map((symptom, index) => (
                <View key={index} style={styles.modalSymptomTag}>
                  <Text style={styles.modalSymptomText}>{symptom}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* 相关疾病 */}
          {selectedDisease.relatedDiseases.length > 0 && (
            <View style={styles.modalSection}>
              <Text style={styles.modalSectionTitle}>相关疾病</Text>
              <View style={styles.modalRelatedDiseasesContainer}>
                {selectedDisease.relatedDiseases.map((relatedDiseaseName, index) => {
                  const relatedDisease = diseaseData.find(d => d.name === relatedDiseaseName);
                  if (!relatedDisease) return null;
                  
                  return (
                    <TouchableOpacity
                      key={index}
                      style={styles.modalRelatedDiseaseItem}
                      onPress={() => handleRelatedDiseasePress(relatedDiseaseName)}
                      activeOpacity={0.7}
                    >
                      <Image
                        source={{ uri: relatedDisease.images[0] }}
                        style={styles.modalRelatedDiseaseImage}
                        resizeMode="cover"
                      />
                      <View style={styles.modalRelatedDiseaseInfo}>
                        <Text style={styles.modalRelatedDiseaseName}>{relatedDisease.name}</Text>
                        <Text style={styles.modalRelatedDiseaseCategory}>
                          {getCategoryName(relatedDisease.category)}
                        </Text>
                      </View>
                      <FontAwesome6 name="chevron-right" style={styles.modalRelatedDiseaseArrow} />
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          )}
        </View>
      </ScrollView>
    );
  }, [selectedDisease, diseaseData, getCategoryName, handleRelatedDiseasePress]);

  return (
    <SafeAreaView style={styles.container}>
      {/* 顶部导航栏 */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={handleBackPress}
          activeOpacity={0.7}
        >
          <FontAwesome6 name="arrow-left" style={styles.backButtonIcon} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>图谱百科</Text>
      </View>

      {/* 主要内容区域 */}
      <View style={styles.mainContent}>
        {/* 搜索框 */}
        <View style={styles.searchSection}>
          <View style={styles.searchInputContainer}>
            <FontAwesome6 name="magnifying-glass" style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="搜索疾病名称..."
              placeholderTextColor="#6B7280"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
        </View>

        {/* 疾病分类导航 */}
        <View style={styles.categorySection}>
          <FlatList
            data={categoryData}
            renderItem={renderCategoryItem}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoryListContainer}
          />
        </View>

        {/* 图谱列表 */}
        <View style={styles.graphListSection}>
          <Text style={styles.listTitle}>疾病图谱</Text>
          <FlatList
            data={filteredDiseases}
            renderItem={renderDiseaseItem}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.graphListContainer}
            ListEmptyComponent={renderEmptyState}
            refreshControl={
              <RefreshControl
                refreshing={isRefreshing}
                onRefresh={handleRefresh}
                colors={['#3BCCA5']}
                tintColor="#3BCCA5"
              />
            }
          />
        </View>
      </View>

      {/* 图谱详情模态框 */}
      <Modal
        visible={isModalVisible}
        transparent
        animationType="slide"
        onRequestClose={handleCloseModal}
      >
        <View style={styles.modalOverlay}>
          <TouchableOpacity
            style={styles.modalOverlayTouchable}
            onPress={handleCloseModal}
            activeOpacity={1}
          />
          <View style={styles.modalContainer}>
            <View style={styles.modalHandle} />
            {renderModalContent()}
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default KnowledgeGraphScreen;

