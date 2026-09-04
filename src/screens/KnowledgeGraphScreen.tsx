import { colors } from '../theme';
import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, TouchableOpacity, ScrollView, TextInput, ActivityIndicator, Modal, Dimensions, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import Header from '../components/Header';
import { styles } from '../styles';
import { knowledgeApi } from '../services/api';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const GRID_GAP = 12;
const GRID_ITEM_WIDTH = (SCREEN_WIDTH - 32 - GRID_GAP) / 2;

// 疾病分类配置——对齐后端 KnowledgeGraph.category 枚举
const CATEGORY_CONFIG: Record<string, { icon: string; color: string; bg: string; label: string }> = {
  viral: { icon: 'bug', color: colors.error, bg: colors.errorLight, label: '病毒病' },
  bacterial: { icon: 'flask', color: colors.warning, bg: colors.warningLight, label: '细菌病' },
  other_microbial: { icon: 'magnet', color: colors.accent.purple, bg: colors.accent.indigoLight, label: '其他微生物' },
  parasitic: { icon: 'bug-outline', color: colors.accent.pink, bg: colors.accent.pinkLight, label: '寄生虫病' },
  non_infectious: { icon: 'restaurant', color: colors.accent.cyan, bg: colors.accent.cyanLight, label: '普通病' },
  general: { icon: 'book', color: colors.success, bg: colors.successLight, label: '总论' },
};

// 分类筛选Tab
const CATEGORY_TABS = [
  { key: 'all', label: '全部', icon: 'grid', color: colors.textTertiary },
  { key: 'viral', label: '病毒病', icon: 'bug', color: colors.error },
  { key: 'bacterial', label: '细菌病', icon: 'flask', color: colors.warning },
  { key: 'other_microbial', label: '其他微生物', icon: 'magnet', color: colors.accent.purple },
  { key: 'parasitic', label: '寄生虫病', icon: 'bug-outline', color: colors.accent.pink },
  { key: 'non_infectious', label: '普通病', icon: 'restaurant', color: colors.accent.cyan },
  { key: 'general', label: '总论', icon: 'book', color: colors.success },
];

// 知识点列表项数据
interface KnowledgeNode {
  _id: string;
  diseaseName: string;
  category: string;
  description: string;
  chapterNumber?: number;
  difficultyLevel?: string;
  views?: number;
}

// 疾病详情数据（含六段内容）
interface DiseaseDetail extends KnowledgeNode {
  pathogen: string;
  epidemiology: string;
  symptoms: string;
  pathologicalChanges: string;
  diagnosis: string;
  prevention: string;
  immunizationSchedule: string;
  differentialDiagnosis: string;
  medicationNotes: string;
  symptomTags: string[];
  lesionTags: string[];
  relatedDiseases: Array<{
    diseaseId: string;
    similarity: number;
    diseaseName: string;
    category: string;
    description: string;
  }>;
}

const KnowledgeGraphScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [knowledgeNodes, setKnowledgeNodes] = useState<KnowledgeNode[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 详情Modal
  const [detailVisible, setDetailVisible] = useState(false);
  const [detailData, setDetailData] = useState<DiseaseDetail | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await knowledgeApi.getKnowledgeGraphs({
        searchTerm: searchQuery || undefined,
        category: activeCategory !== 'all' ? activeCategory : undefined,
      });
      const graphs = response.data?.graphs || response.data || [];
      setKnowledgeNodes(graphs.map((g: any) => ({
        _id: g._id || g.id,
        diseaseName: g.diseaseName || g.title,
        category: g.category || 'general',
        description: g.description || '',
        chapterNumber: g.chapterNumber,
        difficultyLevel: g.difficultyLevel,
        views: g.views,
      })));
    } catch (err) {
      console.error('获取知识点失败:', err);
      setError('加载知识点失败，请稍后重试');
    } finally {
      setLoading(false);
    }
  }, [searchQuery, activeCategory]);

  useEffect(() => { fetchData(); }, [fetchData]);

  // 打开疾病详情
  const openDetail = async (node: KnowledgeNode) => {
    setDetailVisible(true);
    setDetailLoading(true);
    setDetailData(null);
    try {
      const response = await knowledgeApi.getKnowledgeGraphDetail(node._id);
      const graph = response.data?.graph;
      if (graph) {
        setDetailData({
          ...graph,
          diseaseName: graph.diseaseName || node.diseaseName,
          category: graph.category || node.category,
          description: graph.description || node.description,
        });
      }
    } catch (err) {
      console.error('获取疾病详情失败:', err);
    } finally {
      setDetailLoading(false);
    }
  };

  const getCategoryConfig = (category: string) => CATEGORY_CONFIG[category] || CATEGORY_CONFIG.general;

  // 过滤知识点
  const filteredNodes = knowledgeNodes.filter(node => {
    const matchesCategory = activeCategory === 'all' || node.category === activeCategory;
    return matchesCategory;
  });

  // 难度标签
  const getDifficultyLabel = (level?: string) => {
    switch (level) {
      case 'BEGINNER': return { text: '入门', color: colors.success };
      case 'INTERMEDIATE': return { text: '进阶', color: colors.warning };
      case 'ADVANCED': return { text: '高级', color: colors.error };
      default: return null;
    }
  };

  // 六段内容配置
  const SECTIONS = [
    { key: 'pathogen', title: '病原', icon: 'search' },
    { key: 'epidemiology', title: '流行病学', icon: 'stats-chart' },
    { key: 'symptoms', title: '症状', icon: 'pulse' },
    { key: 'pathologicalChanges', title: '病理变化', icon: 'cut' },
    { key: 'diagnosis', title: '诊断', icon: 'analytics' },
    { key: 'prevention', title: '防制', icon: 'shield-checkmark' },
  ] as const;

  return (
    <View style={styles.container}>
      <Header title="知识图谱" showBackButton onBack={() => navigation.goBack()} />

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>正在加载知识点...</Text>
        </View>
      ) : error ? (
        <View style={styles.loadingContainer}>
          <Ionicons name="alert-circle-outline" size={48} color={colors.textDisabled} />
          <Text style={{ fontSize: 16, color: colors.textTertiary, marginTop: 12, marginBottom: 16 }}>{error}</Text>
          <TouchableOpacity style={{ backgroundColor: colors.primary, borderRadius: 8, paddingHorizontal: 24, paddingVertical: 10 }} onPress={() => fetchData()}>
            <Text style={{ color: colors.surface, fontSize: 16, fontWeight: '600' }}>重试</Text>
          </TouchableOpacity>
        </View>
      ) : knowledgeNodes.length === 0 ? (
        <View style={styles.loadingContainer}>
          <Ionicons name="folder-open-outline" size={48} color={colors.textDisabled} />
          <Text style={{ fontSize: 16, color: colors.textTertiary, marginTop: 12 }}>暂无知识点数据</Text>
        </View>
      ) : (
        <>
          {/* 搜索栏 */}
          <View style={{ paddingHorizontal: 16, paddingTop: 8, paddingBottom: 4 }}>
            <View style={{
              flexDirection: 'row',
              alignItems: 'center',
              backgroundColor: colors.surfaceMuted,
              borderRadius: 8,
              paddingHorizontal: 12,
              paddingVertical: 8,
            }}>
              <Ionicons name="search" size={18} color={colors.textDisabled} style={{ marginRight: 8 }} />
              <TextInput
                style={{ flex: 1, fontSize: 16, color: colors.textPrimary }}
                placeholder="搜索疾病名称、症状..."
                placeholderTextColor={colors.textDisabled}
                value={searchQuery}
                onChangeText={setSearchQuery}
                onSubmitEditing={() => fetchData()}
                returnKeyType="search"
              />
              {searchQuery !== '' && (
                <TouchableOpacity onPress={() => { setSearchQuery(''); }}>
                  <Ionicons name="close-circle" size={18} color={colors.textDisabled} />
                </TouchableOpacity>
              )}
            </View>
          </View>

          {/* 分类筛选 */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ paddingHorizontal: 12, marginBottom: 8, paddingBottom: 8 }}>
            <View style={{ flexDirection: 'row', gap: 8 }}>
              {CATEGORY_TABS.map(tab => (
                <TouchableOpacity
                  key={tab.key}
                  style={{
                    paddingHorizontal: 14,
                    paddingVertical: 6,
                    borderRadius: 16,
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 4,
                    backgroundColor: activeCategory === tab.key ? colors.primary : colors.surfaceMuted,
                  }}
                  onPress={() => setActiveCategory(tab.key)}
                >
                  <Ionicons name={tab.icon as any} size={13} color={activeCategory === tab.key ? colors.surface : colors.textTertiary} />
                  <Text style={{
                    fontSize: 13,
                    fontWeight: '500',
                    color: activeCategory === tab.key ? colors.surface : colors.textTertiary,
                  }}>
                    {tab.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>

          {/* 知识点网格 */}
          <FlatList
            data={filteredNodes}
            keyExtractor={item => item._id}
            numColumns={2}
            contentContainerStyle={{ padding: 16, gap: GRID_GAP }}
            columnWrapperStyle={{ gap: GRID_GAP }}
            renderItem={({ item: node }) => {
              const catConfig = getCategoryConfig(node.category);
              const diff = getDifficultyLabel(node.difficultyLevel);
              return (
                <TouchableOpacity
                  style={{
                    width: GRID_ITEM_WIDTH,
                    backgroundColor: colors.surface,
                    borderRadius: 12,
                    padding: 14,
                    borderWidth: 1,
                    borderColor: colors.surfaceMuted,
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 1 },
                    shadowOpacity: 0.05,
                    shadowRadius: 3,
                    elevation: 1,
                  }}
                  onPress={() => openDetail(node)}
                >
                  <View style={{
                    width: 40, height: 40, borderRadius: 20,
                    backgroundColor: catConfig.bg,
                    justifyContent: 'center', alignItems: 'center',
                    marginBottom: 10,
                  }}>
                    <Ionicons name={catConfig.icon as any} size={20} color={catConfig.color} />
                  </View>
                  <Text style={{
                    fontSize: 14,
                    fontWeight: '600',
                    color: colors.textPrimary,
                    marginBottom: 4,
                  }} numberOfLines={2}>
                    {node.diseaseName}
                  </Text>
                  <View style={{ flexDirection: 'row', gap: 6, alignItems: 'center', flexWrap: 'wrap' }}>
                    <View style={{
                      backgroundColor: catConfig.bg,
                      paddingHorizontal: 6, paddingVertical: 2,
                      borderRadius: 6,
                    }}>
                      <Text style={{ fontSize: 10, color: catConfig.color, fontWeight: '500' }}>
                        {catConfig.label}
                      </Text>
                    </View>
                    {diff && (
                      <View style={{
                        backgroundColor: colors.surfaceSoft,
                        paddingHorizontal: 6, paddingVertical: 2,
                        borderRadius: 6,
                        borderWidth: 1,
                        borderColor: colors.border,
                      }}>
                        <Text style={{ fontSize: 10, color: diff.color, fontWeight: '500' }}>
                          {diff.text}
                        </Text>
                      </View>
                    )}
                  </View>
                </TouchableOpacity>
              );
            }}
            ListEmptyComponent={
              <View style={{ flex: 1, alignItems: 'center', paddingVertical: 64 }}>
                <Ionicons name="search-outline" size={48} color={colors.textDisabled} />
                <Text style={{ fontSize: 16, color: colors.textTertiary, marginTop: 12 }}>未找到相关疾病</Text>
              </View>
            }
          />
        </>
      )}

      {/* 疾病详情Modal */}
      <Modal visible={detailVisible} transparent animationType="slide" onRequestClose={() => setDetailVisible(false)}>
        <TouchableOpacity style={{ flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.5)' }} activeOpacity={1} onPress={() => setDetailVisible(false)}>
          <View style={{ backgroundColor: colors.surface, borderTopLeftRadius: 20, borderTopRightRadius: 20, maxHeight: '85%' }} onStartShouldSetResponder={() => true}>
            <View style={{ width: 36, height: 4, backgroundColor: colors.borderStrong, borderRadius: 2, alignSelf: 'center', marginTop: 12, marginBottom: 8 }} />

            {detailLoading ? (
              <View style={{ padding: 40, alignItems: 'center' }}>
                <ActivityIndicator size="large" color={colors.primary} />
                <Text style={{ fontSize: 14, color: colors.textTertiary, marginTop: 12 }}>加载疾病详情...</Text>
              </View>
            ) : detailData ? (() => {
              const catConfig = getCategoryConfig(detailData.category);
              return (
                <>
                  {/* 标题区 */}
                  <View style={{ paddingHorizontal: 16, paddingBottom: 12 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                      <View style={{
                        width: 48, height: 48, borderRadius: 24,
                        backgroundColor: catConfig.bg,
                        justifyContent: 'center', alignItems: 'center',
                      }}>
                        <Ionicons name={catConfig.icon as any} size={24} color={catConfig.color} />
                      </View>
                      <View style={{ flex: 1 }}>
                        <Text style={{ fontSize: 18, fontWeight: '700', color: colors.textPrimary }}>{detailData.diseaseName}</Text>
                        <View style={{ flexDirection: 'row', gap: 6, marginTop: 4 }}>
                          <View style={{ backgroundColor: catConfig.bg, paddingHorizontal: 8, paddingVertical: 2, borderRadius: 8 }}>
                            <Text style={{ fontSize: 11, color: catConfig.color, fontWeight: '600' }}>{catConfig.label}</Text>
                          </View>
                          {detailData.chapterNumber && (
                            <Text style={{ fontSize: 11, color: colors.textDisabled }}>第{detailData.chapterNumber}章</Text>
                          )}
                        </View>
                      </View>
                    </View>
                    <Text style={{ fontSize: 13, color: colors.textTertiary, marginTop: 8, lineHeight: 18 }}>{detailData.description}</Text>
                  </View>

                  <ScrollView style={{ paddingHorizontal: 16, paddingBottom: 34 }} showsVerticalScrollIndicator={false}>
                    {/* 六段结构化内容 */}
                    {SECTIONS.map(section => {
                      const content = (detailData as any)[section.key];
                      if (!content) return null;
                      return (
                        <View key={section.key} style={{ marginBottom: 14 }}>
                          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                            <Ionicons name={section.icon as any} size={16} color={colors.primary} />
                            <Text style={{ fontSize: 15, fontWeight: '600', color: colors.textPrimary }}>{section.title}</Text>
                          </View>
                          <View style={{ backgroundColor: colors.surfaceSoft, borderRadius: 8, padding: 12 }}>
                            <Text style={{ fontSize: 13, color: colors.textSecondary, lineHeight: 20 }}>{content}</Text>
                          </View>
                        </View>
                      );
                    })}

                    {/* 免疫程序 */}
                    {detailData.immunizationSchedule && (
                      <View style={{ marginBottom: 14 }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                          <Ionicons name="medkit" size={16} color={colors.success} />
                          <Text style={{ fontSize: 15, fontWeight: '600', color: colors.textPrimary }}>免疫程序</Text>
                        </View>
                        <View style={{ backgroundColor: colors.successLight, borderRadius: 8, padding: 12 }}>
                          <Text style={{ fontSize: 13, color: colors.successText, lineHeight: 20 }}>{detailData.immunizationSchedule}</Text>
                        </View>
                      </View>
                    )}

                    {/* 鉴别诊断 */}
                    {detailData.differentialDiagnosis && (
                      <View style={{ marginBottom: 14 }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                          <Ionicons name="git-compare" size={16} color={colors.warning} />
                          <Text style={{ fontSize: 15, fontWeight: '600', color: colors.textPrimary }}>鉴别诊断</Text>
                        </View>
                        <View style={{ backgroundColor: colors.warningLight, borderRadius: 8, padding: 12 }}>
                          <Text style={{ fontSize: 13, color: colors.warningText, lineHeight: 20 }}>{detailData.differentialDiagnosis}</Text>
                        </View>
                      </View>
                    )}

                    {/* 用药要点 */}
                    {detailData.medicationNotes && (
                      <View style={{ marginBottom: 14 }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                          <Ionicons name="medkit" size={16} color={colors.error} />
                          <Text style={{ fontSize: 15, fontWeight: '600', color: colors.textPrimary }}>用药要点</Text>
                        </View>
                        <View style={{ backgroundColor: colors.errorLight, borderRadius: 8, padding: 12 }}>
                          <Text style={{ fontSize: 13, color: colors.errorText, lineHeight: 20 }}>{detailData.medicationNotes}</Text>
                        </View>
                      </View>
                    )}

                    {/* 症状/病变标签 */}
                    {(detailData.symptomTags?.length > 0 || detailData.lesionTags?.length > 0) && (
                      <View style={{ marginBottom: 14 }}>
                        <Text style={{ fontSize: 15, fontWeight: '600', color: colors.textPrimary, marginBottom: 6 }}>关键词</Text>
                        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6 }}>
                          {detailData.symptomTags.map(tag => (
                            <View key={`s-${tag}`} style={{ backgroundColor: colors.errorLight, paddingHorizontal: 8, paddingVertical: 3, borderRadius: 10 }}>
                              <Text style={{ fontSize: 11, color: colors.error, fontWeight: '500' }}>{tag}</Text>
                            </View>
                          ))}
                          {detailData.lesionTags.map(tag => (
                            <View key={`l-${tag}`} style={{ backgroundColor: colors.infoLight, paddingHorizontal: 8, paddingVertical: 3, borderRadius: 10 }}>
                              <Text style={{ fontSize: 11, color: colors.info, fontWeight: '500' }}>{tag}</Text>
                            </View>
                          ))}
                        </View>
                      </View>
                    )}

                    {/* 关联疾病 */}
                    {detailData.relatedDiseases?.length > 0 && (
                      <View style={{ marginBottom: 14 }}>
                        <Text style={{ fontSize: 15, fontWeight: '600', color: colors.textPrimary, marginBottom: 8 }}>关联疾病</Text>
                        <View style={{ gap: 8 }}>
                          {detailData.relatedDiseases.map((rel, idx) => {
                            const relCat = getCategoryConfig(rel.category);
                            return (
                              <TouchableOpacity
                                key={idx}
                                style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: colors.surfaceMuted, borderRadius: 8, padding: 10 }}
                                onPress={() => {
                                  // 跳转查看关联疾病详情
                                  openDetail({ _id: rel.diseaseId, diseaseName: rel.diseaseName, category: rel.category, description: rel.description });
                                }}
                              >
                                <View style={{
                                  width: 32, height: 32, borderRadius: 16,
                                  backgroundColor: relCat.bg,
                                  justifyContent: 'center', alignItems: 'center',
                                  marginRight: 10,
                                }}>
                                  <Ionicons name={relCat.icon as any} size={16} color={relCat.color} />
                                </View>
                                <View style={{ flex: 1 }}>
                                  <Text style={{ fontSize: 14, fontWeight: '500', color: colors.textPrimary }}>{rel.diseaseName}</Text>
                                  <Text style={{ fontSize: 11, color: colors.textTertiary }}>
                                    {relCat.label} · 相似度 {rel.similarity}%
                                  </Text>
                                </View>
                                <Ionicons name="chevron-forward" size={16} color={colors.textDisabled} />
                              </TouchableOpacity>
                            );
                          })}
                        </View>
                      </View>
                    )}
                  </ScrollView>
                </>
              );
            })() : (
              <View style={{ padding: 40, alignItems: 'center' }}>
                <Ionicons name="alert-circle-outline" size={36} color={colors.textDisabled} />
                <Text style={{ fontSize: 14, color: colors.textTertiary, marginTop: 8 }}>加载详情失败</Text>
              </View>
            )}
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

export default KnowledgeGraphScreen;
