

import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { FontAwesome6 } from '@expo/vector-icons';
import styles from './styles';

interface Policy {
  id: string;
  title: string;
  summary: string;
  content: string;
  publishTime: string;
  views: number;
  status: 'published' | 'draft' | 'expired';
  scope: 'all' | 'farmers' | 'enterprises' | 'students';
}

interface PolicyItemProps {
  policy: Policy;
  onPress: () => void;
  getScopeText: (scope: Policy['scope']) => string;
}

const PolicyItem: React.FC<PolicyItemProps> = ({ policy, onPress, getScopeText }) => {
  const getStatusStyle = (status: Policy['status']) => {
    switch (status) {
      case 'published':
        return styles.statusPublished;
      case 'draft':
        return styles.statusDraft;
      case 'expired':
        return styles.statusExpired;
      default:
        return styles.statusPublished;
    }
  };

  const getStatusText = (status: Policy['status']) => {
    switch (status) {
      case 'published':
        return '已发布';
      case 'draft':
        return '草稿';
      case 'expired':
        return '已过期';
      default:
        return '已发布';
    }
  };

  const formatViews = (views: number) => {
    if (views >= 1000) {
      return `${(views / 1000).toFixed(1)}k`;
    }
    return views.toString();
  };

  return (
    <TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.content}>
        <View style={styles.mainContent}>
          <Text style={styles.title} numberOfLines={2}>
            {policy.title}
          </Text>
          <Text style={styles.summary} numberOfLines={2}>
            {policy.summary}
          </Text>
        </View>
        <View style={[styles.statusBadge, getStatusStyle(policy.status)]}>
          <Text style={styles.statusText}>{getStatusText(policy.status)}</Text>
        </View>
      </View>
      
      <View style={styles.footer}>
        <View style={styles.metaInfo}>
          <View style={styles.metaItem}>
            <FontAwesome6 name="calendar-days" size={12} color="#6B7280" />
            <Text style={styles.metaText}>{policy.publishTime}</Text>
          </View>
          <View style={styles.metaItem}>
            <FontAwesome6 name="eye" size={12} color="#6B7280" />
            <Text style={styles.metaText}>{formatViews(policy.views)} 次查看</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.detailButton} onPress={onPress}>
          <FontAwesome6 name="chevron-right" size={14} color="#3BCCA5" />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

export default PolicyItem;

