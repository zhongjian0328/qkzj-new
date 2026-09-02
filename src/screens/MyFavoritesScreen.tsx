import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  Image,
  RefreshControl,
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
  danger: '#EF4444',
};

const CATEGORY_LABELS: Record<string, string> = {
  disease: '疾病防控',
  farming: '养殖技术',
  nutrition: '营养饲喂',
  management: '场区管理',
  policy: '政策法规',
  case: '案例分享',
};

interface FavoriteArticle {
  _id: string;
  title: string;
  summary: string;
  coverImage?: string;
  category: string;
  views: number;
  likes: number;
  createdAt: string;
  favoritedAt: string;
}

export default function MyFavoritesScreen() {
  const navigation = useNavigation<any>();
  const [favorites, setFavorites] = useState<FavoriteArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchFavorites = useCallback(async () => {
    try {
      const res = await knowledgeApi.getMyKnowledgeFavorites();
      setFavorites(res?.data || []);
    } catch (e: any) {
      console.error('获取收藏列表失败:', e.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useFocusEffect(useCallback(() => { fetchFavorites(); }, [fetchFavorites]));

  const onRefresh = () => {
    setRefreshing(true);
    fetchFavorites();
  };

  const handleUnfavorite = async (articleId: string) => {
    try {
      await knowledgeApi.toggleKnowledgeFavorite(articleId);
      setFavorites((prev) => prev.filter((item) => item._id !== articleId));
    } catch (e: any) {
      console.error('取消收藏失败:', e.message);
    }
  };

  const renderArticle = ({ item }: { item: FavoriteArticle }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate('KnowledgeDetail', { articleId: item._id })}
    >
      {item.coverImage && (
        <Image source={{ uri: item.coverImage }} style={favStyles.coverImage} resizeMode="cover" />
      )}
      <View style={favStyles.cardContent}>
        <View style={favStyles.titleRow}>
          <Text style={favStyles.title} numberOfLines={2}>{item.title}</Text>
          <TouchableOpacity
            style={favStyles.unfavButton}
            onPress={() => handleUnfavorite(item._id)}
          >
            <Ionicons name="bookmark" size={18} color={COLORS.danger} />
          </TouchableOpacity>
        </View>
        <Text style={favStyles.summary} numberOfLines={2}>{item.summary}</Text>
        <View style={favStyles.metaRow}>
          <View style={favStyles.categoryTag}>
            <Text style={favStyles.categoryText}>
              {CATEGORY_LABELS[item.category] || item.category}
            </Text>
          </View>
          <View style={favStyles.statsRow}>
            <View style={favStyles.statItem}>
              <Ionicons name="eye-outline" size={14} color={COLORS.textSecondary} />
              <Text style={favStyles.statText}>{item.views}</Text>
            </View>
            <View style={favStyles.statItem}>
              <Ionicons name="heart-outline" size={14} color={COLORS.textSecondary} />
              <Text style={favStyles.statText}>{item.likes}</Text>
            </View>
          </View>
        </View>
        <Text style={favStyles.dateText}>
          {new Date(item.createdAt).toLocaleDateString('zh-CN')}
        </Text>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header
        title="我的收藏"
        showBackButton
        onBack={() => navigation.goBack()}
      />

      <FlatList
        data={favorites}
        renderItem={renderArticle}
        keyExtractor={(item) => item._id}
        contentContainerStyle={{ padding: 12, gap: 12 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[COLORS.primary]} />
        }
        ListEmptyComponent={
          <View style={{ alignItems: 'center', paddingVertical: 80 }}>
            <Ionicons name="bookmark-outline" size={56} color="#9CA3AF" />
            <Text style={{ fontSize: 16, fontWeight: '600', color: COLORS.text, marginBottom: 8 }}>
              暂无收藏
            </Text>
            <Text style={{ fontSize: 14, color: COLORS.textSecondary, textAlign: 'center', paddingHorizontal: 32 }}>
              浏览科普文章并点击收藏，这里会展示您收藏的文章
            </Text>
            <TouchableOpacity
              style={favStyles.emptyButton}
              onPress={() => navigation.navigate('KnowledgeList')}
            >
              <Text style={favStyles.emptyButtonText}>去浏览文章</Text>
            </TouchableOpacity>
          </View>
        }
      />
    </View>
  );
}

const favStyles = StyleSheet.create({
  coverImage: {
    width: '100%',
    height: 120,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  cardContent: {
    padding: 12,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  title: {
    flex: 1,
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.text,
    marginRight: 8,
    marginBottom: 6,
  },
  unfavButton: {
    padding: 4,
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
  emptyButton: {
    marginTop: 16,
    backgroundColor: COLORS.primary,
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  emptyButtonText: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: '600',
  },
});
