import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  RefreshControl,
  TextInput,
  StyleSheet,
  Image,
} from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import Header from '../components/Header';
import { knowledgeApi } from '../services/api';
import { styles } from '../styles';

// 设计系统颜色
const COLORS = {
  primary: '#2DBBA1',
  primaryDark: '#1F5E52',
  bgLight: '#E6F7F3',
  text: '#1F2937',
  textSecondary: '#6B7280',
  border: '#E5E7EB',
  white: '#FFFFFF',
  bgGray: '#F3F4F6',
};

const CATEGORIES = [
  { key: 'all', label: '全部' },
  { key: 'disease_prevention', label: '疾病防控' },
  { key: 'breeding_technology', label: '养殖技术' },
  { key: 'nutrition_feeding', label: '营养饲喂' },
  { key: 'farm_management', label: '场区管理' },
  { key: 'policy_regulation', label: '政策法规' },
  { key: 'case_study', label: '案例分享' },
];

const CATEGORY_LABELS: Record<string, string> = {
  disease_prevention: '疾病防控',
  breeding_technology: '养殖技术',
  nutrition_feeding: '营养饲喂',
  farm_management: '场区管理',
  policy_regulation: '政策法规',
  case_study: '案例分享',
};

interface Article {
  _id: string;
  title: string;
  summary: string;
  coverImage?: string;
  category: string;
  views: number;
  likes: number;
  createdAt: string;
  author?: string;
}

export default function KnowledgeListScreen() {
  const navigation = useNavigation<any>();
  const [articles, setArticles] = useState<Article[]>([]);
  const [activeTab, setActiveTab] = useState<string>('all');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchInput, setSearchInput] = useState('');

  const fetchArticles = useCallback(async (pageNum: number, append: boolean = false) => {
    try {
      const params: any = { page: pageNum, limit: 20 };
      if (activeTab !== 'all') params.category = activeTab;
      if (searchTerm) params.searchTerm = searchTerm;
      const res = await knowledgeApi.getKnowledgeArticles(params);
      const data = res?.data || [];
      if (append) {
        setArticles((prev) => [...prev, ...data]);
      } else {
        setArticles(data);
      }
      setHasMore(data.length >= 20);
    } catch (e: any) {
      console.error('获取科普文章列表失败:', e.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [activeTab, searchTerm]);

  useFocusEffect(
    useCallback(() => {
      setPage(1);
      fetchArticles(1, false);
    }, [fetchArticles])
  );

  const onRefresh = () => {
    setRefreshing(true);
    setPage(1);
    fetchArticles(1, false);
  };

  const onLoadMore = () => {
    if (!hasMore || loading) return;
    const nextPage = page + 1;
    setPage(nextPage);
    fetchArticles(nextPage, true);
  };

  const handleSearch = () => {
    setSearchTerm(searchInput);
    setPage(1);
    setArticles([]);
    fetchArticles(1, false);
  };

  const renderArticle = ({ item }: { item: Article }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate('KnowledgeDetail', { articleId: item._id })}
    >
      {item.coverImage && (
        <Image source={{ uri: item.coverImage }} style={articleStyles.coverImage} resizeMode="cover" />
      )}
      <View style={articleStyles.cardContent}>
        <Text style={articleStyles.title} numberOfLines={2}>{item.title}</Text>
        <Text style={articleStyles.summary} numberOfLines={2}>{item.summary}</Text>
        <View style={articleStyles.metaRow}>
          <View style={articleStyles.categoryTag}>
            <Text style={articleStyles.categoryText}>
              {CATEGORY_LABELS[item.category] || item.category}
            </Text>
          </View>
          <View style={articleStyles.statsRow}>
            <View style={articleStyles.statItem}>
              <Ionicons name="eye-outline" size={14} color={COLORS.textSecondary} />
              <Text style={articleStyles.statText}>{item.views}</Text>
            </View>
            <View style={articleStyles.statItem}>
              <Ionicons name="heart-outline" size={14} color={COLORS.textSecondary} />
              <Text style={articleStyles.statText}>{item.likes}</Text>
            </View>
          </View>
        </View>
        <Text style={articleStyles.dateText}>
          {new Date(item.createdAt).toLocaleDateString('zh-CN')}
        </Text>
      </View>
    </TouchableOpacity>
  );

  if (loading && articles.length === 0) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header
        title="科普知识"
        showBackButton
        onBack={() => navigation.goBack()}
        rightComponent={
          <TouchableOpacity
            onPress={() => navigation.navigate('MyFavorites')}
            style={{ padding: 8 }}
          >
            <Ionicons name="bookmark-outline" size={22} color={COLORS.primary} />
          </TouchableOpacity>
        }
      />

      {/* 搜索栏 */}
      <View style={articleStyles.searchBar}>
        <Ionicons name="search-outline" size={20} color={COLORS.textSecondary} style={{ marginRight: 8 }} />
        <TextInput
          style={articleStyles.searchInput}
          placeholder="搜索科普文章..."
          placeholderTextColor={COLORS.textSecondary}
          value={searchInput}
          onChangeText={setSearchInput}
          onSubmitEditing={handleSearch}
          returnKeyType="search"
        />
        {searchInput.length > 0 && (
          <TouchableOpacity onPress={() => { setSearchInput(''); setSearchTerm(''); }}>
            <Ionicons name="close-circle" size={18} color={COLORS.textSecondary} />
          </TouchableOpacity>
        )}
      </View>

      {/* 分类 Tab 横向滚动 */}
      <View style={articleStyles.tabContainer}>
        <FlatList
          data={CATEGORIES}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item.key}
          contentContainerStyle={{ paddingHorizontal: 12, gap: 8 }}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                articleStyles.tabItem,
                activeTab === item.key && articleStyles.tabItemActive,
              ]}
              onPress={() => {
                setActiveTab(item.key);
                setPage(1);
                setArticles([]);
                fetchArticles(1, false);
              }}
            >
              <Text
                style={[
                  articleStyles.tabText,
                  activeTab === item.key && articleStyles.tabTextActive,
                ]}
              >
                {item.label}
              </Text>
            </TouchableOpacity>
          )}
        />
      </View>

      {/* 文章列表 */}
      <FlatList
        data={articles}
        renderItem={renderArticle}
        keyExtractor={(item) => item._id}
        contentContainerStyle={{ padding: 12, gap: 12 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[COLORS.primary]} />
        }
        onEndReached={onLoadMore}
        onEndReachedThreshold={0.2}
        ListEmptyComponent={
          <View style={{ alignItems: 'center', paddingVertical: 64 }}>
            <Ionicons name="book-outline" size={48} color="#9CA3AF" />
            <Text style={{ fontSize: 16, fontWeight: '600', color: COLORS.text, marginBottom: 8 }}>
              暂无文章
            </Text>
            <Text style={{ fontSize: 14, color: COLORS.textSecondary, textAlign: 'center', paddingHorizontal: 32 }}>
              {searchTerm ? '未找到相关文章，请更换关键词' : '暂无科普文章，请稍后再来'}
            </Text>
          </View>
        }
        ListFooterComponent={
          loading && articles.length > 0 ? (
            <ActivityIndicator size="small" color={COLORS.primary} style={{ marginVertical: 16 }} />
          ) : null
        }
      />
    </View>
  );
}

const articleStyles = StyleSheet.create({
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.bgGray,
    marginHorizontal: 12,
    marginTop: 8,
    marginBottom: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: COLORS.text,
  },
  tabContainer: {
    height: 44,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  tabItem: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: COLORS.bgGray,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabItemActive: {
    backgroundColor: COLORS.bgLight,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.textSecondary,
  },
  tabTextActive: {
    color: COLORS.primaryDark,
    fontWeight: '600',
  },
  coverImage: {
    width: '100%',
    height: 140,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  cardContent: {
    padding: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 6,
  },
  summary: {
    fontSize: 13,
    color: COLORS.textSecondary,
    marginBottom: 8,
    lineHeight: 18,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  categoryTag: {
    backgroundColor: COLORS.bgLight,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  categoryText: {
    fontSize: 11,
    fontWeight: '500',
    color: COLORS.primaryDark,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  statText: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  dateText: {
    fontSize: 11,
    color: COLORS.textSecondary,
  },
});
