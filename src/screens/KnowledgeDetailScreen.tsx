import { colors } from '../theme';
import React, { useState, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  StyleSheet,
  Image,
  Alert,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import Header from '../components/Header';
import { knowledgeApi } from '../services/api';
import { styles } from '../styles';

// 设计系统颜色
const COLORS = {
  primary: colors.primary,
  primaryDark: colors.primaryDark,
  bgLight: colors.primaryLight,
  text: colors.textPrimary,
  textSecondary: colors.textTertiary,
  border: colors.border,
  white: colors.surface,
  bgGray: colors.surfaceMuted,
  danger: colors.error,
};

const CATEGORY_LABELS: Record<string, string> = {
  disease: '疾病防控',
  farming: '养殖技术',
  nutrition: '营养饲喂',
  management: '场区管理',
  policy: '政策法规',
  case: '案例分享',
};

interface Article {
  _id: string;
  title: string;
  content: string;
  coverImage?: string;
  category: string;
  author?: string;
  views: number;
  likes: number;
  createdAt: string;
  tags?: string[];
}

export default function KnowledgeDetailScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { articleId } = route.params as { articleId: string };

  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const [isLiked, setIsLiked] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);

  const fetchArticle = useCallback(async () => {
    try {
      const res = await knowledgeApi.getKnowledgeArticleById(articleId);
      const data = res?.data;
      setArticle(data);
      setIsLiked(data?.isLiked || false);
      setIsFavorited(data?.isFavorited || false);
    } catch (e: any) {
      console.error('获取文章详情失败:', e.message);
      Alert.alert('加载失败', '无法加载文章内容，请稍后重试');
    } finally {
      setLoading(false);
    }
  }, [articleId]);

  useEffect(() => {
    fetchArticle();
  }, [fetchArticle]);

  const handleToggleLike = async () => {
    try {
      await knowledgeApi.toggleKnowledgeLike(articleId);
      setIsLiked((prev) => !prev);
      setArticle((prev) =>
        prev ? { ...prev, likes: prev.likes + (isLiked ? -1 : 1) } : prev
      );
    } catch (e: any) {
      console.error('切换点赞失败:', e.message);
    }
  };

  const handleToggleFavorite = async () => {
    try {
      await knowledgeApi.toggleKnowledgeFavorite(articleId);
      setIsFavorited((prev) => !prev);
    } catch (e: any) {
      console.error('切换收藏失败:', e.message);
      Alert.alert('操作失败', '收藏操作失败，请稍后重试');
    }
  };

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  if (!article) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={{ fontSize: 16, color: COLORS.textSecondary }}>文章不存在</Text>
        <TouchableOpacity
          style={{ marginTop: 16, paddingVertical: 8, paddingHorizontal: 24, backgroundColor: COLORS.primary, borderRadius: 8 }}
          onPress={() => navigation.goBack()}
        >
          <Text style={{ color: COLORS.white, fontSize: 14 }}>返回</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header
        title="文章详情"
        showBackButton
        onBack={() => navigation.goBack()}
      />

      <ScrollView contentContainerStyle={detailStyles.scrollContent}>
        {/* 封面图 */}
        {article.coverImage && (
          <Image source={{ uri: article.coverImage }} style={detailStyles.coverImage} resizeMode="cover" />
        )}

        {/* 标题 */}
        <Text style={detailStyles.title}>{article.title}</Text>

        {/* 元信息 */}
        <View style={detailStyles.metaContainer}>
          {article.author && (
            <View style={detailStyles.metaItem}>
              <Ionicons name="person-outline" size={14} color={COLORS.textSecondary} />
              <Text style={detailStyles.metaText}>{article.author}</Text>
            </View>
          )}
          <View style={detailStyles.metaItem}>
            <Ionicons name="time-outline" size={14} color={COLORS.textSecondary} />
            <Text style={detailStyles.metaText}>
              {new Date(article.createdAt).toLocaleDateString('zh-CN')}
            </Text>
          </View>
          <View style={detailStyles.metaItem}>
            <View style={detailStyles.categoryBadge}>
              <Text style={detailStyles.categoryBadgeText}>
                {CATEGORY_LABELS[article.category] || article.category}
              </Text>
            </View>
          </View>
          <View style={detailStyles.metaRow}>
            <View style={detailStyles.metaItem}>
              <Ionicons name="eye-outline" size={14} color={COLORS.textSecondary} />
              <Text style={detailStyles.metaText}>{article.views}</Text>
            </View>
            <View style={detailStyles.metaItem}>
              <Ionicons name="heart-outline" size={14} color={COLORS.textSecondary} />
              <Text style={detailStyles.metaText}>{article.likes}</Text>
            </View>
          </View>
        </View>

        <View style={detailStyles.divider} />

        {/* 正文内容 */}
        <View style={detailStyles.contentWrapper}>
          {article.content.split('\n').map((line, idx) => {
            const trimmed = line.trim();
            if (!trimmed) return <View key={idx} style={{ height: 8 }} />;
            if (trimmed.startsWith('# ')) {
              return (
                <Text key={idx} style={detailStyles.h1}>
                  {trimmed.replace(/^#\s+/, '')}
                </Text>
              );
            }
            if (trimmed.startsWith('## ')) {
              return (
                <Text key={idx} style={detailStyles.h2}>
                  {trimmed.replace(/^##\s+/, '')}
                </Text>
              );
            }
            if (trimmed.startsWith('### ')) {
              return (
                <Text key={idx} style={detailStyles.h3}>
                  {trimmed.replace(/^###\s+/, '')}
                </Text>
              );
            }
            if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
              return (
                <Text key={idx} style={detailStyles.listItem}>
                  {'• '}{trimmed.replace(/^[-*]\s+/, '')}
                </Text>
              );
            }
            return (
              <Text key={idx} style={detailStyles.paragraph}>
                {trimmed}
              </Text>
            );
          })}
        </View>

        {/* 底部间距，避免被操作栏遮挡 */}
        <View style={{ height: 72 }} />
      </ScrollView>

      {/* 底部操作栏 */}
      <View style={detailStyles.actionBar}>
        <TouchableOpacity
          style={[detailStyles.actionButton, isLiked && detailStyles.actionButtonActive]}
          onPress={handleToggleLike}
          activeOpacity={0.7}
        >
          <Ionicons
            name={isLiked ? 'heart' : 'heart-outline'}
            size={22}
            color={isLiked ? COLORS.danger : COLORS.textSecondary}
          />
          <Text
            style={[
              detailStyles.actionText,
              isLiked && detailStyles.actionTextActive,
            ]}
          >
            {isLiked ? '已赞' : '点赞'} ({article.likes})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[detailStyles.actionButton, isFavorited && detailStyles.actionButtonActive]}
          onPress={handleToggleFavorite}
          activeOpacity={0.7}
        >
          <Ionicons
            name={isFavorited ? 'bookmark' : 'bookmark-outline'}
            size={22}
            color={isFavorited ? COLORS.primary : COLORS.textSecondary}
          />
          <Text
            style={[
              detailStyles.actionText,
              isFavorited && detailStyles.actionTextActive,
            ]}
          >
            {isFavorited ? '已收藏' : '收藏'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const detailStyles = StyleSheet.create({
  scrollContent: {
    padding: 16,
  },
  coverImage: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    marginBottom: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 12,
    lineHeight: 30,
  },
  metaContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 8,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaRow: {
    flexDirection: 'row',
    gap: 16,
  },
  metaText: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  categoryBadge: {
    backgroundColor: COLORS.bgLight,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },
  categoryBadgeText: {
    fontSize: 11,
    fontWeight: '500',
    color: COLORS.primaryDark,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginVertical: 16,
  },
  contentWrapper: {
    flex: 1,
  },
  h1: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.text,
    marginTop: 20,
    marginBottom: 8,
  },
  h2: {
    fontSize: 17,
    fontWeight: '600',
    color: COLORS.text,
    marginTop: 16,
    marginBottom: 6,
  },
  h3: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.text,
    marginTop: 12,
    marginBottom: 4,
  },
  paragraph: {
    fontSize: 15,
    color: COLORS.text,
    lineHeight: 24,
    marginBottom: 4,
  },
  listItem: {
    fontSize: 15,
    color: COLORS.text,
    lineHeight: 24,
    marginLeft: 12,
    marginBottom: 4,
  },
  actionBar: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    backgroundColor: COLORS.white,
    paddingVertical: 12,
    paddingHorizontal: 24,
    gap: 24,
    justifyContent: 'center',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: COLORS.bgGray,
  },
  actionButtonActive: {
    backgroundColor: COLORS.bgLight,
  },
  actionText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
  actionTextActive: {
    color: COLORS.primaryDark,
    fontWeight: '600',
  },
});
