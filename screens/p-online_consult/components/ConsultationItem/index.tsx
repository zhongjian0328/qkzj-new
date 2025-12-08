

import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { FontAwesome6 } from '@expo/vector-icons';
import { ConsultationItemProps } from '../../types';
import styles from './styles';

const ConsultationItem: React.FC<ConsultationItemProps> = ({
  consultation,
  onAccept,
  onViewDetail,
  onChat,
  onVideo,
}) => {
  const { user, symptoms, submitTime, status, completionTime } = consultation;

  const getStatusStyle = () => {
    switch (status) {
      case 'pending':
        return styles.statusPending;
      case 'processing':
        return styles.statusProcessing;
      case 'completed':
        return styles.statusCompleted;
      case 'cancelled':
        return styles.statusCancelled;
      default:
        return styles.statusPending;
    }
  };

  const getStatusText = () => {
    switch (status) {
      case 'pending':
        return '待处理';
      case 'processing':
        return '处理中';
      case 'completed':
        return '已完成';
      case 'cancelled':
        return '已取消';
      default:
        return '待处理';
    }
  };

  const renderActionButtons = () => {
    switch (status) {
      case 'pending':
        return (
          <TouchableOpacity
            style={styles.acceptButton}
            onPress={() => onAccept(consultation.id)}
          >
            <Text style={styles.acceptButtonText}>接单</Text>
          </TouchableOpacity>
        );
      case 'processing':
        return (
          <View style={styles.actionButtonsRow}>
            <TouchableOpacity
              style={styles.chatButton}
              onPress={() => onChat(consultation)}
            >
              <FontAwesome6 name="comments" size={12} color="#FFFFFF" />
              <Text style={styles.chatButtonText}>聊天</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.videoButton}
              onPress={() => onVideo(consultation.id)}
            >
              <FontAwesome6 name="video" size={12} color="#FFFFFF" />
              <Text style={styles.videoButtonText}>视频</Text>
            </TouchableOpacity>
          </View>
        );
      case 'completed':
        return (
          <TouchableOpacity
            style={styles.detailButton}
            onPress={() => onViewDetail(consultation)}
          >
            <Text style={styles.detailButtonText}>查看详情</Text>
          </TouchableOpacity>
        );
      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.userInfo}>
          <Image source={{ uri: user.avatar }} style={styles.avatar} />
          <View style={styles.userDetails}>
            <Text style={styles.userName}>{user.name}</Text>
            <Text style={styles.userPhone}>{user.phone}</Text>
          </View>
        </View>
        <View style={[styles.statusBadge, getStatusStyle()]}>
          <Text style={styles.statusText}>{getStatusText()}</Text>
        </View>
      </View>

      <View style={styles.symptomsSection}>
        <Text style={styles.symptomsLabel}>症状描述</Text>
        <Text style={styles.symptomsText}>{symptoms}</Text>
      </View>

      <View style={styles.footer}>
        <View style={styles.metaInfo}>
          <View style={styles.metaItem}>
            <FontAwesome6 name="clock" size={12} color="#6B7280" />
            <Text style={styles.metaText}>{submitTime}</Text>
          </View>
          <View style={styles.metaItem}>
            <FontAwesome6 name="location-dot" size={12} color="#6B7280" />
            <Text style={styles.metaText}>{user.location}</Text>
          </View>
          {completionTime && (
            <View style={styles.metaItem}>
              <FontAwesome6 name="circle-check" size={12} color="#6B7280" />
              <Text style={styles.metaText}>{completionTime}</Text>
            </View>
          )}
        </View>
        {renderActionButtons()}
      </View>
    </View>
  );
};

export default ConsultationItem;

