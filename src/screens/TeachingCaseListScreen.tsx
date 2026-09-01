import React, { useState, useCallback } from 'react';
import { View, Text, TouchableOpacity, FlatList, TextInput, ActivityIndicator, RefreshControl } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import Header from '../components/Header';
import { teachingCaseApi } from '../services/api';
import { StyleSheet } from 'react-native';

const COLORS = {
  primary: '#2DBBA1',
  primaryDark: '#1F5E52',
  bgLight: '#E6F7F3',
  text: '#1F2937',
  textSecondary: '#6B7280',
  border: '#E5E7EB',
  danger: '#EF4444',
  warning: '#F59E0B',
};

const STATUS_CONFIG: Record<string, { color: string; label: string }> = {
  draft: { color: '#9CA3AF', label: '草稿' },
  pending_review: { color: COLORS.warning, label: '待审核' },
  approved: { color: '#22C55E', label: '已通过' },
  rejected: { color: COLORS.danger, label: '已驳回' },
};

const DISEASE_TYPES = ['全部', '新城疫', '禽流感', '传染性支气管炎', '传染性法氏囊', '马立克氏病', '其他'];

export default function TeachingCaseListScreen() {
  const navigation = useNavigation<any>();
  const [searchText, setSearchText] = useState('');
  const [diseaseFilter, setDiseaseFilter] = useState('全部');
  const [cases, setCases] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchCases = useCallback(async () => {
    try {
      const params: any = { page: 1, limit: 50 };
      if (diseaseFilter !== '全部') params.diseaseType = diseaseFilter;
      if (searchText.trim()) params.searchTerm = searchText.trim();

      const res = await teachingCaseApi.getAllCases(params);
      setCases(res?.data || []);
    } catch (e: any) {
      console.error('获取教学案例列表失败:', e.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [diseaseFilter, searchText]);

  useFocusEffect(useCallback(() => { fetchCases(); }, [fetchCases]));

  const onRefresh = () => { setRefreshing(true); fetchCases(); };

  const renderCase = ({ item }: { item: any }) => {
    const status = item.status ? (STATUS_CONFIG[item.status] || STATUS_CONFIG.draft) : null;

    return (
      <TouchableOpacity
        style={cardStyles.card}
        onPress={() => navigation.navigate('TeachingCaseDetail', { caseId: item._id })}
      >
        <Text style={cardStyles.title} numberOfLines={2}>{item.title}</Text>
        <View style={cardStyles.metaRow}>
          <View style={[cardStyles.tag, { backgroundColor: COLORS.bgLight }]}>
            <Text style={[cardStyles.tagText, { color: COLORS.primaryDark }]}>{item.diseaseType || '未分类'}</Text>
          </View>
          {status && (
            <View style={[cardStyles.tag, { backgroundColor: status.color + '20' }]}>
              <Text style={[cardStyles.tagText, { color: status.color }]}>{status.label}</Text>
            </View>
          )}
        </View>
        {item.keyFindings && (
          <Text style={cardStyles.findings} numberOfLines={2}>
            关键发现：{item.keyFindings}
          </Text>
        )}
        <View style={cardStyles.footer}>
          <Text style={cardStyles.author}>
            {item.authorName || item.author || '匿名'}
          </Text>
          <Text style={cardStyles.views}>
            <Ionicons name="eye-outline" size={14} color="#9CA3AF" /> {item.viewCount || 0}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Header title="教学案例" showBackButton onBack={() => navigation.goBack()} />
        <View style={{ justifyContent: 'center', alignItems: 'center', flex: 1 }}>
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header
        title="教学案例"
        showBackButton
        onBack={() => navigation.goBack()}
        rightComponent={
          <TouchableOpacity style={{ padding: 8 }} onPress={() => navigation.navigate('TeachingCaseDetail', { caseId: 'new' })}>
            <Ionicons name="add-circle" size={24} color={COLORS.primary} />
          </TouchableOpacity>
        }
      />

      {/* 搜索栏 */}
      <View style={styles.searchContainer}>
        <View style={styles.searchInputWrapper}>
          <Ionicons name="search-outline" size={18} color="#9CA3AF" />
          <TextInput
            style={styles.searchInput}
            placeholder="搜索案例标题..."
            value={searchText}
            onChangeText={(text) => { setSearchText(text); }}
            onSubmitEditing={fetchCases}
          />
          {searchText.length > 0 && (
            <TouchableOpacity onPress={() => { setSearchText(''); fetchCases(); }}>
              <Ionicons name="close-circle" size={18} color="#9CA3AF" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* 疾病类型筛选 */}
      <FlatList
        data={DISEASE_TYPES}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={item => item}
        contentContainerStyle={styles.filterScroll}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.filterChip, diseaseFilter === item && styles.filterChipActive]}
            onPress={() => setDiseaseFilter(item)}
          >
            <Text style={[styles.filterChipText, diseaseFilter === item && styles.filterChipTextActive]}>
              {item}
            </Text>
          </TouchableOpacity>
        )}
      />

      <FlatList
        data={cases}
        renderItem={renderCase}
        keyExtractor={(item) => item._id}
        contentContainerStyle={cardStyles.listContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[COLORS.primary]} />}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>📚</Text>
            <Text style={styles.emptyTitle}>暂无教学案例</Text>
            <Text style={styles.emptyDesc}>创建案例，记录禽病诊断经验</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB' },
  searchContainer: { paddingHorizontal: 12, paddingVertical: 8 },
  searchInputWrapper: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    backgroundColor: '#FFFFFF', borderRadius: 10, paddingHorizontal: 12, paddingVertical: 8,
    borderWidth: 1, borderColor: COLORS.border,
  },
  searchInput: { flex: 1, fontSize: 14, color: COLORS.text },
  filterScroll: { paddingHorizontal: 12, paddingVertical: 4, gap: 8 },
  filterChip: { paddingHorizontal: 14, paddingVertical: 6, borderRadius: 16, borderWidth: 1, borderColor: COLORS.border, backgroundColor: '#FFFFFF' },
  filterChipActive: { backgroundColor: COLORS.bgLight, borderColor: COLORS.primary },
  filterChipText: { fontSize: 13, color: COLORS.textSecondary },
  filterChipTextActive: { color: COLORS.primaryDark, fontWeight: '600' },
  emptyContainer: { alignItems: 'center', paddingVertical: 64 },
  emptyIcon: { fontSize: 48, marginBottom: 16 },
  emptyTitle: { fontSize: 16, fontWeight: '600', color: COLORS.text, marginBottom: 8 },
  emptyDesc: { fontSize: 14, color: COLORS.textSecondary, textAlign: 'center', paddingHorizontal: 32 },
});

const cardStyles = StyleSheet.create({
  listContent: { padding: 12, gap: 12 },
  card: { backgroundColor: '#FFFFFF', borderRadius: 12, padding: 14, borderWidth: 1, borderColor: COLORS.border },
  title: { fontSize: 15, fontWeight: '600', color: COLORS.text, marginBottom: 8 },
  metaRow: { flexDirection: 'row', gap: 8, marginBottom: 8 },
  tag: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 10 },
  tagText: { fontSize: 12, fontWeight: '500' },
  findings: { fontSize: 13, color: COLORS.textSecondary, marginBottom: 8, lineHeight: 18 },
  footer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  author: { fontSize: 12, color: COLORS.textSecondary },
  views: { fontSize: 12, color: '#9CA3AF', flexDirection: 'row', alignItems: 'center', gap: 2 },
});
