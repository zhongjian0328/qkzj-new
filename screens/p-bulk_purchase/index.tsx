

import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, Modal, FlatList, } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { FontAwesome6 } from '@expo/vector-icons';
import styles from './styles';

interface Product {
  id: string;
  name: string;
  spec: string;
  price: string;
  unit: string;
  minOrder: string;
  stock: string;
  image: string;
  category: string;
}

interface Category {
  id: string;
  name: string;
  value: string;
}

const BulkPurchaseScreen = () => {
  const router = useRouter();
  
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isInquiryModalVisible, setIsInquiryModalVisible] = useState(false);

  const categories: Category[] = [
    { id: 'all', name: '全部商品', value: 'all' },
    { id: 'vaccine', name: '疫苗', value: 'vaccine' },
    { id: 'drug', name: '兽药', value: 'drug' },
    { id: 'feed', name: '饲料', value: 'feed' },
    { id: 'equipment', name: '养殖设备', value: 'equipment' },
  ];

  const products: Product[] = [
    {
      id: 'bulk-001',
      name: '新城疫灭活疫苗',
      spec: '规格：100ml/瓶 × 10瓶/箱',
      price: '¥1,200',
      unit: '/箱',
      minOrder: '起订量：10箱',
      stock: '库存：1,200箱',
      image: 'https://s.coze.cn/image/2tWVwwaqmlY/',
      category: 'vaccine',
    },
    {
      id: 'bulk-002',
      name: '蛋鸡专用饲料',
      spec: '规格：25kg/袋 × 40袋/吨',
      price: '¥3,200',
      unit: '/吨',
      minOrder: '起订量：5吨',
      stock: '库存：500吨',
      image: 'https://s.coze.cn/image/ErVel9CQ8B0/',
      category: 'feed',
    },
    {
      id: 'bulk-003',
      name: '广谱抗生素',
      spec: '规格：500g/袋 × 20袋/箱',
      price: '¥2,800',
      unit: '/箱',
      minOrder: '起订量：20箱',
      stock: '库存：300箱',
      image: 'https://s.coze.cn/image/QuY0SO22ILY/',
      category: 'drug',
    },
    {
      id: 'bulk-004',
      name: '自动饮水系统',
      spec: '规格：100米/套',
      price: '¥8,500',
      unit: '/套',
      minOrder: '起订量：1套',
      stock: '库存：50套',
      image: 'https://s.coze.cn/image/5cMagbkBRpQ/',
      category: 'equipment',
    },
    {
      id: 'bulk-005',
      name: '禽流感H5N1疫苗',
      spec: '规格：50ml/瓶 × 20瓶/箱',
      price: '¥1,800',
      unit: '/箱',
      minOrder: '起订量：15箱',
      stock: '库存：800箱',
      image: 'https://s.coze.cn/image/x-RrLXZYcPs/',
      category: 'vaccine',
    },
  ];

  const filteredProducts = selectedCategory === 'all' 
    ? products 
    : products.filter(product => product.category === selectedCategory);

  const handleBackPress = () => {
    if (router.canGoBack()) {
      router.back();
    }
  };

  const handleCategoryPress = (categoryValue: string) => {
    setSelectedCategory(categoryValue);
  };

  const handleProductPress = (productId: string) => {
    console.log('查看商品详情:', productId);
    // 这里可以跳转到商品详情页，但PRD中没有定义详情页
  };

  const handleInquiryPress = (productId: string) => {
    console.log('询价商品:', productId);
    setIsInquiryModalVisible(true);
  };

  const handleCloseModal = () => {
    setIsInquiryModalVisible(false);
  };

  const renderCategoryItem = ({ item }: { item: Category }) => (
    <TouchableOpacity
      style={[
        styles.categoryTab,
        selectedCategory === item.value ? styles.categoryActive : styles.categoryInactive,
      ]}
      onPress={() => handleCategoryPress(item.value)}
      activeOpacity={0.7}
    >
      <Text
        style={[
          styles.categoryTabText,
          selectedCategory === item.value ? styles.categoryActiveText : styles.categoryInactiveText,
        ]}
      >
        {item.name}
      </Text>
    </TouchableOpacity>
  );

  const renderProductItem = ({ item }: { item: Product }) => (
    <TouchableOpacity
      style={styles.productCard}
      onPress={() => handleProductPress(item.id)}
      activeOpacity={0.95}
    >
      <View style={styles.productContent}>
        <Image source={{ uri: item.image }} style={styles.productImage} />
        <View style={styles.productInfo}>
          <Text style={styles.productName}>{item.name}</Text>
          <Text style={styles.productSpec}>{item.spec}</Text>
          <View style={styles.productPriceRow}>
            <View style={styles.priceContainer}>
              <Text style={styles.productPrice}>{item.price}</Text>
              <Text style={styles.productUnit}>{item.unit}</Text>
            </View>
            <View style={styles.minOrderBadge}>
              <Text style={styles.minOrderText}>{item.minOrder}</Text>
            </View>
          </View>
          <View style={styles.productFooter}>
            <Text style={styles.productStock}>{item.stock}</Text>
            <TouchableOpacity
              style={styles.inquiryButton}
              onPress={() => handleInquiryPress(item.id)}
              activeOpacity={0.8}
            >
              <Text style={styles.inquiryButtonText}>询价</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

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
        <Text style={styles.headerTitle}>大宗采购</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* 商品分类导航 */}
        <View style={styles.categorySection}>
          <FlatList
            data={categories}
            renderItem={renderCategoryItem}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoryList}
          />
        </View>

        {/* 商品列表 */}
        <View style={styles.productSection}>
          <FlatList
            data={filteredProducts}
            renderItem={renderProductItem}
            keyExtractor={(item) => item.id}
            scrollEnabled={false}
            contentContainerStyle={styles.productList}
          />
        </View>
      </ScrollView>

      {/* 询价成功提示模态框 */}
      <Modal
        visible={isInquiryModalVisible}
        transparent
        animationType="fade"
        onRequestClose={handleCloseModal}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={handleCloseModal}
        >
          <View style={styles.modalContent}>
            <View style={styles.successIcon}>
              <FontAwesome6 name="check" size={24} color="#10B981" />
            </View>
            <Text style={styles.modalTitle}>询价已提交</Text>
            <Text style={styles.modalMessage}>
              我们将在24小时内与您联系，请注意查收消息
            </Text>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={handleCloseModal}
              activeOpacity={0.8}
            >
              <Text style={styles.modalButtonText}>确定</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  );
};

export default BulkPurchaseScreen;

