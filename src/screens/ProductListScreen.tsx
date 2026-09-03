import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, TouchableOpacity, ScrollView, ActivityIndicator, RefreshControl, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import Header from '../components/Header';
import { styles } from '../styles';
import { businessApi } from '../services/api';

const ProductListScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const categories = [
    { value: 'all', label: '全部', icon: 'grid-outline' as const },
    { value: 'medicine', label: '兽药', icon: 'medkit-outline' as const },
    { value: 'vaccine', label: '疫苗', icon: 'fitness-outline' as const },
    { value: 'disinfectant', label: '消毒剂', icon: 'sparkles-outline' as const },
    { value: 'equipment', label: '器械', icon: 'construct-outline' as const },
  ];

  const fetchProducts = useCallback(async (isRefresh = false) => {
    try {
      if (isRefresh) setRefreshing(true); else setLoading(true);
      setError(null);
      const params: any = { page: 1, limit: 50 };
      if (activeCategory !== 'all') params.category = activeCategory;
      if (searchTerm.trim()) params.searchTerm = searchTerm.trim();
      const response = await businessApi.getProducts(params);
      const data = response.data?.products || [];
      setProducts(data);
    } catch (err) {
      console.error('获取商品列表失败:', err);
      setError('加载商品列表失败，请稍后重试');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [activeCategory, searchTerm]);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'medicine': return '#3B82F6';
      case 'vaccine': return '#10B981';
      case 'disinfectant': return '#8B5CF6';
      case 'equipment': return '#F59E0B';
      default: return '#6B7280';
    }
  };

  const getCategoryLabel = (category: string) => {
    const found = categories.find(c => c.value === category);
    return found ? found.label : category;
  };

  return (
    <View style={styles.container}>
      <Header title="兽药商城" showBackButton onBack={() => navigation.goBack()} />

      {/* 搜索栏 */}
      <View style={{ padding: 16, paddingBottom: 8 }}>
        <View style={{
          flexDirection: 'row',
          alignItems: 'center',
          backgroundColor: '#FFFFFF',
          borderRadius: 12,
          paddingHorizontal: 12,
          borderWidth: 1,
          borderColor: '#E5E7EB',
        }}>
          <Ionicons name="search" size={18} color="#9CA3AF" />
          <TextInput
            style={{ flex: 1, paddingVertical: 10, paddingHorizontal: 8, fontSize: 14, color: '#111827' }}
            placeholder="搜索商品名称..."
            placeholderTextColor="#9CA3AF"
            value={searchTerm}
            onChangeText={setSearchTerm}
            onSubmitEditing={() => fetchProducts()}
            returnKeyType="search"
          />
          {searchTerm ? (
            <TouchableOpacity onPress={() => { setSearchTerm(''); }}>
              <Ionicons name="close-circle" size={18} color="#9CA3AF" />
            </TouchableOpacity>
          ) : null}
        </View>
      </View>

      {/* 分类标签 */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ paddingHorizontal: 16, marginBottom: 8 }}>
        {categories.map(cat => (
          <TouchableOpacity
            key={cat.value}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              backgroundColor: activeCategory === cat.value ? '#2DBBA1' : '#FFFFFF',
              borderWidth: 1,
              borderColor: activeCategory === cat.value ? '#2DBBA1' : '#E5E7EB',
              borderRadius: 20,
              paddingHorizontal: 14,
              paddingVertical: 8,
              marginRight: 8,
              gap: 4,
            }}
            onPress={() => setActiveCategory(cat.value)}
          >
            <Ionicons name={cat.icon} size={14} color={activeCategory === cat.value ? '#FFFFFF' : '#6B7280'} />
            <Text style={{ fontSize: 13, fontWeight: '500', color: activeCategory === cat.value ? '#FFFFFF' : '#6B7280' }}>
              {cat.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#2DBBA1" />
          <Text style={styles.loadingText}>正在加载商品...</Text>
        </View>
      ) : error ? (
        <View style={styles.loadingContainer}>
          <Ionicons name="alert-circle-outline" size={48} color="#9CA3AF" />
          <Text style={{ fontSize: 16, color: '#6B7280', marginBottom: 16 }}>{error}</Text>
          <TouchableOpacity style={{ backgroundColor: '#2DBBA1', borderRadius: 8, paddingHorizontal: 24, paddingVertical: 10 }} onPress={() => fetchProducts()}>
            <Text style={{ color: '#FFFFFF', fontSize: 16, fontWeight: '600' }}>重试</Text>
          </TouchableOpacity>
        </View>
      ) : products.length === 0 ? (
        <View style={styles.loadingContainer}>
          <Ionicons name="cart-outline" size={48} color="#9CA3AF" />
          <Text style={{ fontSize: 16, color: '#6B7280' }}>暂无商品</Text>
        </View>
      ) : (
        <ScrollView
          contentContainerStyle={{ padding: 16 }}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => fetchProducts(true)} colors={['#2DBBA1']} />}
        >
          <Text style={{ fontSize: 14, color: '#6B7280', marginBottom: 12 }}>
            共 {products.length} 件商品
          </Text>

          {products.map(product => (
            <TouchableOpacity
              key={product._id || product.id}
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: 12,
                padding: 16,
                marginBottom: 12,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.06,
                shadowRadius: 3.84,
                elevation: 2,
              }}
              onPress={() => navigation.navigate('CreateTicket', {
                title: `咨询: ${product.name}`,
                category: 'consultation',
              })}
            >
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <Text style={{ fontSize: 16, fontWeight: '600', color: '#111827', flex: 1 }}>
                  {product.name}
                </Text>
                <View style={{ backgroundColor: getCategoryColor(product.category) + '1A', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 }}>
                  <Text style={{ fontSize: 12, fontWeight: '500', color: getCategoryColor(product.category) }}>
                    {getCategoryLabel(product.category)}
                  </Text>
                </View>
              </View>

              {product.description && (
                <Text style={{ fontSize: 14, color: '#4B5563', marginBottom: 8, lineHeight: 20 }} numberOfLines={2}>
                  {product.description}
                </Text>
              )}

              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <Text style={{ fontSize: 18, fontWeight: '700', color: '#DC2626' }}>
                  ¥{product.price?.toFixed(2) || '咨询'}
                </Text>
                {product.stock > 0 ? (
                  <Text style={{ fontSize: 12, color: '#10B981' }}>库存 {product.stock}</Text>
                ) : (
                  <Text style={{ fontSize: 12, color: '#9CA3AF' }}>暂无库存</Text>
                )}
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}
    </View>
  );
};

export default ProductListScreen;
