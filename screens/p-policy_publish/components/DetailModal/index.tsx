

import React from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
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

interface DetailModalProps {
  visible: boolean;
  policy: Policy | null;
  onClose: () => void;
  onEdit: () => void;
  onDelete: () => void;
  getScopeText: (scope: Policy['scope']) => string;
}

const DetailModal: React.FC<DetailModalProps> = ({
  visible,
  policy,
  onClose,
  onEdit,
  onDelete,
  getScopeText,
}) => {
  if (!policy) return null;

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
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <TouchableOpacity style={styles.overlayTouchable} onPress={onClose} />
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>政策详情</Text>
              <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                <FontAwesome6 name="xmark" size={18} color="#6B7280" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.contentContainer} showsVerticalScrollIndicator={false}>
              <View style={styles.policyContent}>
                <Text style={styles.policyTitle}>{policy.title}</Text>
                <Text style={styles.policyText}>{policy.content}</Text>
              </View>

              <View style={styles.divider} />

              <View style={styles.metaContainer}>
                <View style={styles.metaRow}>
                  <Text style={styles.metaLabel}>发布时间：</Text>
                  <Text style={styles.metaValue}>{policy.publishTime}</Text>
                </View>
                <View style={styles.metaRow}>
                  <Text style={styles.metaLabel}>下发范围：</Text>
                  <Text style={styles.metaValue}>{getScopeText(policy.scope)}</Text>
                </View>
                <View style={styles.metaRow}>
                  <Text style={styles.metaLabel}>查看次数：</Text>
                  <Text style={styles.metaValue}>{formatViews(policy.views)} 次</Text>
                </View>
                <View style={styles.metaRow}>
                  <Text style={styles.metaLabel}>状态：</Text>
                  <View style={[styles.statusBadge, getStatusStyle(policy.status)]}>
                    <Text style={styles.statusText}>{getStatusText(policy.status)}</Text>
                  </View>
                </View>
              </View>
            </ScrollView>

            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.editButton} onPress={onEdit}>
                <Text style={styles.editButtonText}>编辑</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.deleteButton} onPress={onDelete}>
                <Text style={styles.deleteButtonText}>删除</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default DetailModal;

