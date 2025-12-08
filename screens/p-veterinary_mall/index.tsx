

import React, { useState, useCallback } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, Modal, Alert, RefreshControl, } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { FontAwesome6 } from '@expo/vector-icons';
import styles from './styles';
import ProductCard from './components/ProductCard';
import ProductDetailModal from './components/ProductDetailModal';

interface Product {
  id: string;
  name: string;
  price: string;
  image: string;
  category: string;
  sales: string;
  description?: string;
  specifications?: string;
  stock?: number;
}

interface Category {
  id: string;
  name: string;
}

const VeterinaryMallScreen: React.FC = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
  
  const [searchKeyword, setSearchKeyword] = useState<string>('');
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('all');
  const [isProductDetailModalVisible, setIsProductDetailModalVisible] = useState<boolean>(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const categories: Category[] = [
    { id: 'all', name: '全部' },
    { id: 'vaccine', name: '疫苗' },
    { id: 'drug', name: '兽药' },
    { id: 'feed', name: '饲料' },
    { id: 'equipment', name: '设备' },
  ];

  const [products] = useState<Product[]>([
    {
      id: 'prod001',
      name: '新城疫灭活疫苗 (La Sota株)',
      price: '¥18.5',
      image: 'https://s.coze.cn/image/yfqAoYHwFgs/',
      category: 'vaccine',
      sales: '月销1200+',
      description: '预防新城疫，适用于各年龄段鸡群，免疫期长，安全性高。',
      specifications: '1000羽份/瓶，50瓶/箱',
      stock: 234,
    },
    {
      id: 'prod002',
      name: '阿莫西林可溶性粉 100g/袋',
      price: '¥12.8',
      image: 'https://s.coze.cn/image/XkaSr80kztg/',
      category: 'drug',
      sales: '月销856+',
      description: '广谱抗生素，用于治疗革兰氏阳性菌和阴性菌感染。',
      specifications: '100g/袋，100袋/箱',
      stock: 456,
    },
    {
      id: 'prod003',
      name: '蛋鸡专用配合饲料 20kg/袋',
      price: '¥68.0',
      image: 'https://s.coze.cn/image/Ta2B4L6H4VQ/',
      category: 'feed',
      sales: '月销432+',
      description: '蛋鸡专用配合饲料，营养均衡，提高产蛋率。',
      specifications: '20kg/袋，10袋/吨',
      stock: 123,
    },
    {
      id: 'prod004',
      name: '禽流感H5+H7二价灭活疫苗',
      price: '¥25.0',
      image: 'https://s.coze.cn/image/6QjsH8p2sSo/',
      category: 'vaccine',
      sales: '月销678+',
      description: '预防禽流感H5和H7亚型，安全性高，免疫效果好。',
      specifications: '500羽份/瓶，20瓶/箱',
      stock: 189,
    },
    {
      id: 'prod005',
      name: '恩诺沙星溶液 100ml/瓶',
      price: '¥15.6',
      image: 'https://s.coze.cn/image/gHluCgXnt3E/',
      category: 'drug',
      sales: '月销543+',
      description: '广谱抗菌药，用于治疗畜禽细菌性感染。',
      specifications: '100ml/瓶，50瓶/箱',
      stock: 321,
    },
    {
      id: 'prod006',
      name: '自动饮水器 鸡用乳头式',
      price: '¥35.0',
      image: 'https://s.coze.cn/image/GZfJ3mCxc1U/',
      category: 'equipment',
      sales: '月销234+',
      description: '自动饮水器，鸡用乳头式，节水卫生。',
      specifications: '10个/包，100包/箱',
      stock: 89,
    },
    {
      id: 'prod007',
      name: '肉鸡育肥期配合饲料 40kg/袋',
      price: '¥120.0',
      image: 'https://s.coze.cn/image/vu1b332Mer4/',
      category: 'feed',
      sales: '月销189+',
      description: '肉鸡育肥期配合饲料，促进生长，提高饲料转化率。',
      specifications: '40kg/袋，25袋/吨',
      stock: 67,
    },
    {
      id: 'prod008',
      name: '传染性法氏囊病活疫苗',
      price: '¥10.0',
      image: 'https://s.coze.cn/image/ZHZk9WFDYnY/',
      category: 'vaccine',
      sales: '月销756+',
      description: '预防传染性法氏囊病，适用于雏鸡。',
      specifications: '2000羽份/瓶，50瓶/箱',
      stock: 201,
    },
  ]);

  const filteredProducts = products.filter(product => {
    const matchesCategory = selectedCategoryId === 'all' || product.category === selectedCategoryId;
    const matchesSearch = searchKeyword === '' || 
      product.name.toLowerCase().includes(searchKeyword.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleBackPress = useCallback(() => {
    if (router.canGoBack()) {
      router.back();
    }
  }, [router]);

  const handleSearchSubmit = useCallback(() => {
    // 搜索逻辑已在filteredProducts中实现
  }, []);

  const handleCategoryPress = useCallback((categoryId: string) => {
    setSelectedCategoryId(categoryId);
  }, []);

  const handleProductPress = useCallback((product: Product) => {
    setSelectedProduct(product);
    setIsProductDetailModalVisible(true);
  }, []);

  const handleAddToCart = useCallback((productId: string) => {
    setIsLoading(true);
    // 模拟加入购物车API调用
    setTimeout(() => {
      setIsLoading(false);
      Alert.alert('成功', '已成功加入购物车');
    }, 1000);
  }, []);

  const handleBuyNow = useCallback((productId: string) => {
    setIsLoading(true);
    // 模拟立即购买API调用
    setTimeout(() => {
      setIsLoading(false);
      Alert.alert('提示', '跳转到订单确认页面');
    }, 1000);
  }, []);

  const handleCloseProductDetail = useCallback(() => {
    setIsProductDetailModalVisible(false);
    setSelectedProduct(null);
  }, []);

  const handleRefresh = useCallback(() => {
    setIsRefreshing(true);
    // 模拟刷新数据
    setTimeout(() => {
      setIsRefreshing(false);
    }, 1500);
  }, []);

  const renderCategoryItem = useCallback(({ item }: { item: Category }) => {
    const isSelected = item.id === selectedCategoryId;
    return (
      <TouchableOpacity
        style={[
          styles.categoryButton,
          isSelected ? styles.categoryButtonActive : styles.categoryButtonInactive,
        ]}
        onPress={() => handleCategoryPress(item.id)}
        activeOpacity={0.7}
      >
        <Text
          style={[
            styles.categoryButtonText,
            isSelected ? styles.categoryButtonTextActive : styles.categoryButtonTextInactive,
          ]}
        >
          {item.name}
        </Text>
      </TouchableOpacity>
    );
  }, [selectedCategoryId, handleCategoryPress]);

  const renderProductItem = useCallback(({ item }: { item: Product }) => (
    <ProductCard
      product={item}
      onPress={() => handleProductPress(item)}
      onAddToCart={() => handleAddToCart(item.id)}
      isLoading={isLoading}
    />
  ), [handleProductPress, handleAddToCart, isLoading]);

  const renderHeader = useCallback(() => (
    <View>
      {/* 搜索栏 */}
      <View style={styles.searchSection}>
        <View style={styles.searchInputWrapper}>
          <FontAwesome6 name="magnifying-glass" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="搜索兽药、饲料、疫苗..."
            placeholderTextColor="#6B7280"
            value={searchKeyword}
            onChangeText={setSearchKeyword}
            onSubmitEditing={handleSearchSubmit}
            returnKeyType="search"
          />
        </View>
      </View>

      {/* 商品分类导航 */}
      <View style={styles.categorySection}>
        <FlatList
          data={categories}
          renderItem={renderCategoryItem}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoryListContainer}
        />
      </View>

      {/* 商品列表标题 */}
      <View style={styles.productListHeader}>
        <Text style={styles.productListTitle}>商品列表</Text>
        <Text style={styles.productCount}>共{filteredProducts.length}件商品</Text>
      </View>
    </View>
  ), [searchKeyword, categories, filteredProducts.length, renderCategoryItem]);

  return (
    <SafeAreaView style={styles.container}>
      {/* 顶部导航栏 */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={handleBackPress}
          activeOpacity={0.7}
        >
          <FontAwesome6 name="arrow-left" style={styles.backIcon} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>兽药商城</Text>
      </View>

      {/* 主要内容 */}
      <FlatList
        data={filteredProducts}
        renderItem={renderProductItem}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={styles.productRow}
        ListHeaderComponent={renderHeader}
        contentContainerStyle={styles.productListContainer}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={handleRefresh}
            colors={['#3BCCA5']}
            tintColor="#3BCCA5"
          />
        }
      />

      {/* 商品详情弹窗 */}
      <ProductDetailModal
        visible={isProductDetailModalVisible}
        product={selectedProduct}
        onClose={handleCloseProductDetail}
        onAddToCart={handleAddToCart}
        onBuyNow={handleBuyNow}
        isLoading={isLoading}
      />
    </SafeAreaView>
  );
};

export default VeterinaryMallScreen;

