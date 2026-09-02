import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, TouchableOpacity, ScrollView, TextInput, ActivityIndicator, Modal, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import Header from '../components/Header';
import { styles } from '../styles';
import { knowledgeApi } from '../services/api';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const GRID_GAP = 12;
const GRID_ITEM_WIDTH = (SCREEN_WIDTH - 32 - GRID_GAP) / 2;

// 知识点数据结构
interface KnowledgeNode {
  id: string;
  title: string;
  category: string;
  description: string;
  relatedNodes: string[];
  iconName: string;
}

const CATEGORY_CONFIG: Record<string, { icon: string; color: string; bg: string }> = {
  disease: { icon: 'bug', color: '#EF4444', bg: '#FEE2E2' },
  prevention: { icon: 'shield-checkmark', color: '#22C55E', bg: '#DCFCE7' },
  control: { icon: 'construct', color: '#3B82F6', bg: '#DBEAFE' },
};

const KnowledgeGraphScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedNode, setSelectedNode] = useState<KnowledgeNode | null>(null);
  const [activeCategory, setActiveCategory] = useState('all');
  const [knowledgeNodes, setKnowledgeNodes] = useState<KnowledgeNode[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await knowledgeApi.getKnowledgeGraphs({ searchTerm: searchQuery || undefined });
      const graphs = response.data?.graphs || response.data || [];
      setKnowledgeNodes(graphs.map((g: any) => ({
        id: g._id || g.id,
        title: g.diseaseName || g.title,
        category: g.category || 'disease',
        description: g.description || g.summary || '',
        relatedNodes: g.relatedDiseases || g.relatedNodes || [],
        iconName: g.icon || 'bug',
      })));
    } catch (err) {
      console.error('获取知识点失败:', err);
      setError('加载知识点失败，请稍后重试');
    } finally {
      setLoading(false);
    }
  }, [searchQuery]);

  useEffect(() => { fetchData(); }, [fetchData]);

  // 分类列表
  const categories = [
    { id: 'all', name: '全部', icon: 'grid', color: '#6B7280' },
    { id: 'disease', name: '疾病', icon: 'bug', color: '#EF4444' },
    { id: 'prevention', name: '预防', icon: 'shield-checkmark', color: '#22C55E' },
    { id: 'control', name: '控制', icon: 'construct', color: '#3B82F6' },
  ];

  // 过滤知识点
  const filteredNodes = knowledgeNodes.filter(node => {
    const matchesSearch = node.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         node.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === 'all' || node.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  // 获取相关知识点
  const getRelatedNodes = (nodeId: string) => {
    return knowledgeNodes.filter(node => node.id === nodeId || node.relatedNodes.includes(nodeId));
  };

  const getCategoryConfig = (category: string) => CATEGORY_CONFIG[category] || CATEGORY_CONFIG.disease;

  return (
    <View style={styles.container}>
      <Header title="知识图谱" showBackButton onBack={() => navigation.goBack()} />

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#2DBBA1" />
          <Text style={styles.loadingText}>正在加载知识点...</Text>
        </View>
      ) : error ? (
        <View style={styles.loadingContainer}>
          <Ionicons name="alert-circle-outline" size={48} color="#9CA3AF" />
          <Text style={{ fontSize: 16, color: '#6B7280', marginTop: 12, marginBottom: 16 }}>{error}</Text>
          <TouchableOpacity style={{ backgroundColor: '#2DBBA1', borderRadius: 8, paddingHorizontal: 24, paddingVertical: 10 }} onPress={() => fetchData()}>
            <Text style={{ color: '#FFFFFF', fontSize: 16, fontWeight: '600' }}>重试</Text>
          </TouchableOpacity>
        </View>
      ) : knowledgeNodes.length === 0 ? (
        <View style={styles.loadingContainer}>
          <Ionicons name="folder-open-outline" size={48} color="#9CA3AF" />
          <Text style={{ fontSize: 16, color: '#6B7280', marginTop: 12 }}>暂无知识点数据</Text>
        </View>
      ) : (
        <ScrollView contentContainerStyle={{ padding: 16 }}>
          {/* 搜索栏 */}
          <View style={{ marginBottom: 16 }}>
            <View style={{
              flexDirection: 'row',
              alignItems: 'center',
              backgroundColor: '#F3F4F6',
              borderRadius: 8,
              paddingHorizontal: 12,
              paddingVertical: 8,
            }}>
              <Ionicons name="search" size={18} color="#9CA3AF" style={{ marginRight: 8 }} />
              <TextInput
                style={{ flex: 1, fontSize: 16, color: '#111827' }}
                placeholder="搜索知识点..."
                placeholderTextColor="#9CA3AF"
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
              {searchQuery !== '' && (
                <TouchableOpacity onPress={() => setSearchQuery('')}>
                  <Ionicons name="close-circle" size={18} color="#9CA3AF" />
                </TouchableOpacity>
              )}
            </View>
          </View>

          {/* 分类筛选 */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 16, paddingBottom: 8 }}>
            <View style={{ flexDirection: 'row' }}>
              {categories.map(category => (
                <TouchableOpacity
                  key={category.id}
                  style={{
                    paddingHorizontal: 16,
                    paddingVertical: 8,
                    borderRadius: 20,
                    marginRight: 8,
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 4,
                    backgroundColor: activeCategory === category.id ? '#2DBBA1' : '#F3F4F6',
                  }}
                  onPress={() => setActiveCategory(category.id)}
                >
                  <Ionicons name={category.icon as any} size={14} color={activeCategory === category.id ? '#FFFFFF' : '#6B7280'} />
                  <Text style={{
                    fontSize: 14,
                    fontWeight: '500',
                    color: activeCategory === category.id ? '#FFFFFF' : '#6B7280',
                  }}>
                    {category.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>

          {/* 2列网格 */}
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: GRID_GAP }}>
            {(selectedNode ? getRelatedNodes(selectedNode.id) : filteredNodes).map(node => {
              const catConfig = getCategoryConfig(node.category);
              const isSelected = selectedNode?.id === node.id;
              return (
                <TouchableOpacity
                  key={node.id}
                  style={{
                    width: GRID_ITEM_WIDTH,
                    backgroundColor: '#FFFFFF',
                    borderRadius: 12,
                    padding: 16,
                    borderWidth: 2,
                    borderColor: isSelected ? '#2DBBA1' : '#F3F4F6',
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 1 },
                    shadowOpacity: 0.05,
                    shadowRadius: 3,
                    elevation: 1,
                  }}
                  onPress={() => setSelectedNode(node)}
                >
                  <View style={{
                    width: 44, height: 44, borderRadius: 22,
                    backgroundColor: catConfig.bg,
                    justifyContent: 'center', alignItems: 'center',
                    marginBottom: 12,
                  }}>
                    <Ionicons name={catConfig.icon as any} size={22} color={catConfig.color} />
                  </View>
                  <Text style={{
                    fontSize: 14,
                    fontWeight: '600',
                    color: '#111827',
                    marginBottom: 4,
                  }} numberOfLines={2}>
                    {node.title}
                  </Text>
                  <View style={{
                    backgroundColor: catConfig.bg,
                    paddingHorizontal: 8, paddingVertical: 3,
                    borderRadius: 8,
                    alignSelf: 'flex-start',
                  }}>
                    <Text style={{ fontSize: 11, color: catConfig.color, fontWeight: '500' }}>
                      {node.category === 'disease' ? '疾病' : node.category === 'prevention' ? '预防' : '控制'}
                    </Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>

          {selectedNode && (
            <TouchableOpacity
              style={{ marginTop: 16, alignItems: 'center', padding: 12, backgroundColor: '#F3F4F6', borderRadius: 8 }}
              onPress={() => setSelectedNode(null)}
            >
              <Text style={{ fontSize: 14, fontWeight: '500', color: '#6B7280' }}>查看完整图谱</Text>
            </TouchableOpacity>
          )}
        </ScrollView>
      )}

      {/* 底部详情 Sheet */}
      <Modal visible={!!selectedNode} transparent animationType="slide" onRequestClose={() => setSelectedNode(null)}>
        <TouchableOpacity style={{ flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.4)' }} activeOpacity={1} onPress={() => setSelectedNode(null)}>
          <View style={{ backgroundColor: '#FFFFFF', borderTopLeftRadius: 20, borderTopRightRadius: 20, paddingHorizontal: 16, paddingBottom: 34, maxHeight: '70%' }} onStartShouldSetResponder={() => true}>
            <View style={{ width: 36, height: 4, backgroundColor: '#D1D5DB', borderRadius: 2, alignSelf: 'center', marginTop: 12, marginBottom: 16 }} />

            {selectedNode && (() => {
              const catConfig = getCategoryConfig(selectedNode.category);
              return (
                <>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                    <View style={{
                      width: 48, height: 48, borderRadius: 24,
                      backgroundColor: catConfig.bg,
                      justifyContent: 'center', alignItems: 'center',
                    }}>
                      <Ionicons name={catConfig.icon as any} size={24} color={catConfig.color} />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={{ fontSize: 18, fontWeight: '600', color: '#111827' }}>{selectedNode.title}</Text>
                      <View style={{ backgroundColor: catConfig.bg, paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8, alignSelf: 'flex-start', marginTop: 4 }}>
                        <Text style={{ fontSize: 12, color: catConfig.color, fontWeight: '500' }}>
                          {selectedNode.category === 'disease' ? '疾病' : selectedNode.category === 'prevention' ? '预防' : '控制'}
                        </Text>
                      </View>
                    </View>
                  </View>

                  <ScrollView style={{ maxHeight: 300 }}>
                    <View style={{ backgroundColor: '#F9FAFB', borderRadius: 8, padding: 16, marginBottom: 16 }}>
                      <Text style={{ fontSize: 14, color: '#4B5563', lineHeight: 22 }}>{selectedNode.description || '暂无详细描述'}</Text>
                    </View>

                    {/* 相关知识点 */}
                    {selectedNode.relatedNodes.length > 0 && (
                      <View>
                        <Text style={{ fontSize: 16, fontWeight: '600', color: '#111827', marginBottom: 12 }}>相关知识点</Text>
                        <View style={{ gap: 8 }}>
                          {selectedNode.relatedNodes.map(nodeId => {
                            const relatedNode = knowledgeNodes.find(n => n.id === nodeId);
                            if (!relatedNode) return null;
                            const relCat = getCategoryConfig(relatedNode.category);
                            return (
                              <TouchableOpacity
                                key={relatedNode.id}
                                style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#F3F4F6', borderRadius: 8, padding: 12 }}
                                onPress={() => setSelectedNode(relatedNode)}
                              >
                                <View style={{
                                  width: 36, height: 36, borderRadius: 18,
                                  backgroundColor: relCat.bg,
                                  justifyContent: 'center', alignItems: 'center',
                                  marginRight: 12,
                                }}>
                                  <Ionicons name={relCat.icon as any} size={18} color={relCat.color} />
                                </View>
                                <View style={{ flex: 1 }}>
                                  <Text style={{ fontSize: 14, fontWeight: '500', color: '#111827' }}>{relatedNode.title}</Text>
                                  <Text style={{ fontSize: 12, color: '#6B7280' }}>
                                    {relatedNode.category === 'disease' ? '疾病' : relatedNode.category === 'prevention' ? '预防' : '控制'}
                                  </Text>
                                </View>
                                <Ionicons name="chevron-forward" size={16} color="#9CA3AF" />
                              </TouchableOpacity>
                            );
                          })}
                        </View>
                      </View>
                    )}
                  </ScrollView>
                </>
              );
            })()}
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

export default KnowledgeGraphScreen;
