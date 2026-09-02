import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, TouchableOpacity, ScrollView, TextInput, ActivityIndicator, RefreshControl } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Header from '../components/Header';
import { styles } from '../styles';
import { knowledgeApi } from '../services/api';

// 知识点数据结构
interface KnowledgeNode {
  id: string;
  title: string;
  category: string;
  description: string;
  relatedNodes: string[];
  icon: string;
}

const KnowledgeGraphScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedNode, setSelectedNode] = useState<KnowledgeNode | null>(null);
  const [activeCategory, setActiveCategory] = useState('all');
  const [knowledgeNodes, setKnowledgeNodes] = useState<KnowledgeNode[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [refreshing, setRefreshing] = useState(false);

  const fetchData = useCallback(async (isRefresh = false) => {
    try {
      if (isRefresh) setRefreshing(true); else setLoading(true);
      setError(null);
      const response = await knowledgeApi.getKnowledgeGraphs({ searchTerm: searchQuery || undefined });
      const graphs = response.data?.graphs || response.data || [];
      setKnowledgeNodes(graphs.map((g: any) => ({
        id: g._id || g.id,
        title: g.diseaseName || g.title,
        category: g.category || 'disease',
        description: g.description || g.summary || '',
        relatedNodes: g.relatedDiseases || g.relatedNodes || [],
        icon: g.icon || '🦠'
      })));
    } catch (err) {
      console.error('获取知识点失败:', err);
      setError('加载知识点失败，请稍后重试');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [searchQuery]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // 分类列表
  const categories = [
    { id: 'all', name: '全部' },
    { id: 'disease', name: '疾病' },
    { id: 'prevention', name: '预防' },
    { id: 'control', name: '控制' }
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

  return (
    <View style={styles.container}>
      <Header 
        title="知识图谱" 
        showBackButton 
        onBack={() => navigation.goBack()} 
      />
      
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#2DBBA1" />
          <Text style={styles.loadingText}>正在加载知识点...</Text>
        </View>
      ) : error ? (
        <View style={styles.loadingContainer}>
          <Text style={{ fontSize: 48, marginBottom: 12 }}>⚠️</Text>
          <Text style={{ fontSize: 16, color: '#6B7280', marginBottom: 16 }}>{error}</Text>
          <TouchableOpacity style={{ backgroundColor: '#2DBBA1', borderRadius: 8, paddingHorizontal: 24, paddingVertical: 10 }} onPress={() => fetchData()}>
            <Text style={{ color: '#FFFFFF', fontSize: 16, fontWeight: '600' }}>重试</Text>
          </TouchableOpacity>
        </View>
      ) : knowledgeNodes.length === 0 ? (
        <View style={styles.loadingContainer}>
          <Text style={{ fontSize: 48, marginBottom: 12 }}>📭</Text>
          <Text style={{ fontSize: 16, color: '#6B7280' }}>暂无知识点数据</Text>
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
              paddingVertical: 8
            }}>
              <Text style={{ marginRight: 8, fontSize: 18 }}>🔍</Text>
              <TextInput
                style={{
                  flex: 1,
                  fontSize: 16,
                  color: '#111827'
                }}
                placeholder="搜索知识点..."
                placeholderTextColor="#9CA3AF"
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
              {searchQuery !== '' && (
                <TouchableOpacity onPress={() => setSearchQuery('')}>
                  <Text style={{ fontSize: 18, color: '#9CA3AF' }}>✕</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>

          {/* 分类筛选 */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 16, paddingBottom: 8 }}>
          <View style={{
            flexDirection: 'row',
          }}>
            {categories.map(category => (
              <TouchableOpacity
                key={category.id}
                style={[
                  {
                    paddingHorizontal: 16,
                    paddingVertical: 8,
                    borderRadius: 20,
                    marginRight: 8,
                    backgroundColor: activeCategory === category.id ? '#2DBBA1' : '#F3F4F6'
                  }
                ]}
                onPress={() => setActiveCategory(category.id)}
              >
                <Text style={[
                  {
                    fontSize: 14,
                    fontWeight: '500',
                    color: activeCategory === category.id ? '#FFFFFF' : '#6B7280'
                  }
                ]}>
                  {category.name}
                </Text>
              </TouchableOpacity>
          ))}
          </View>
        </ScrollView>

        {/* 知识图谱展示 */}
          <View style={{
            backgroundColor: '#FFFFFF',
            borderRadius: 12,
            padding: 16,
            marginBottom: 16,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.06,
            shadowRadius: 3.84,
            elevation: 2
          }}>
            <Text style={{
              fontSize: 18,
              fontWeight: '600',
              color: '#111827',
              marginBottom: 16
            }}>
              {selectedNode ? `${selectedNode.title} 相关知识点` : '知识点图谱'}
            </Text>
            
            {/* 知识点节点列表 */}
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={{ flexDirection: 'row', gap: 16, paddingVertical: 8 }}>
                {(selectedNode ? getRelatedNodes(selectedNode.id) : filteredNodes).map(node => (
                  <TouchableOpacity
                    key={node.id}
                    style={[
                      {
                        width: 120,
                        backgroundColor: selectedNode?.id === node.id ? '#E6F7F3' : '#F3F4F6',
                        borderRadius: 12,
                        padding: 16,
                        alignItems: 'center',
                        borderWidth: 2,
                        borderColor: selectedNode?.id === node.id ? '#2DBBA1' : 'transparent'
                      }
                    ]}
                    onPress={() => setSelectedNode(node)}
                  >
                    <Text style={{ fontSize: 32, marginBottom: 8 }}>{node.icon}</Text>
                    <Text style={{
                      fontSize: 14,
                      fontWeight: '600',
                      color: '#111827',
                      textAlign: 'center',
                      marginBottom: 4
                    }}>
                      {node.title}
                    </Text>
                    <Text style={{
                      fontSize: 12,
                      color: '#6B7280',
                      textAlign: 'center',
                      opacity: 0.8
                    }}>
                      {node.category === 'disease' ? '疾病' : 
                       node.category === 'prevention' ? '预防' : '控制'}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
          </View>

          {/* 知识点详情 */}
          {selectedNode && (
            <View style={{
              backgroundColor: '#FFFFFF',
              borderRadius: 12,
              padding: 16,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.06,
              shadowRadius: 3.84,
              elevation: 2
            }}>
              <Text style={{
                fontSize: 18,
                fontWeight: '600',
                color: '#111827',
                marginBottom: 12
              }}>
                知识点详情
              </Text>
              
              <View style={{
                backgroundColor: '#F9FAFB',
                borderRadius: 8,
                padding: 16,
                marginBottom: 16
              }}>
                <Text style={{
                  fontSize: 16,
                  fontWeight: '600',
                  color: '#111827',
                  marginBottom: 8
                }}>
                  {selectedNode.title}
                </Text>
                <Text style={{
                  fontSize: 14,
                  color: '#4B5563',
                  lineHeight: 20
                }}>
                  {selectedNode.description}
                </Text>
              </View>
              
              {/* 相关知识点 */}
              <View>
                <Text style={{
                  fontSize: 16,
                  fontWeight: '600',
                  color: '#111827',
                  marginBottom: 12
                }}>
                  相关知识点
                </Text>
                
                <View style={{ gap: 8 }}>
                  {selectedNode.relatedNodes.map(nodeId => {
                    const relatedNode = knowledgeNodes.find(n => n.id === nodeId);
                    if (relatedNode) {
                      return (
                        <TouchableOpacity
                          key={relatedNode.id}
                          style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            backgroundColor: '#F3F4F6',
                            borderRadius: 8,
                            padding: 12
                          }}
                          onPress={() => setSelectedNode(relatedNode)}
                        >
                          <Text style={{ fontSize: 24, marginRight: 12 }}>{relatedNode.icon}</Text>
                          <View style={{ flex: 1 }}>
                            <Text style={{
                              fontSize: 14,
                              fontWeight: '500',
                              color: '#111827'
                            }}>
                              {relatedNode.title}
                            </Text>
                            <Text style={{
                              fontSize: 12,
                              color: '#6B7280'
                            }}>
                              {relatedNode.category === 'disease' ? '疾病' : 
                               relatedNode.category === 'prevention' ? '预防' : '控制'}
                            </Text>
                          </View>
                          <Text style={{ fontSize: 16, color: '#9CA3AF' }}>→</Text>
                        </TouchableOpacity>
                      );
                    }
                    return null;
                  })}
                </View>
              </View>
              
              {/* 重置按钮 */}
              <TouchableOpacity
                style={{
                  marginTop: 16,
                  alignItems: 'center',
                  padding: 12,
                  backgroundColor: '#F3F4F6',
                  borderRadius: 8
                }}
                onPress={() => setSelectedNode(null)}
              >
                <Text style={{
                  fontSize: 14,
                  fontWeight: '500',
                  color: '#6B7280'
                }}>
                  查看完整图谱
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </ScrollView>
      )}
    </View>
  );
};

export default KnowledgeGraphScreen;