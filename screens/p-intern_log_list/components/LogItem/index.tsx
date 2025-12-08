

import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { FontAwesome6 } from '@expo/vector-icons';
import styles from './styles';

interface LogData {
  id: string;
  title: string;
  date: string;
  time: string;
  content: string;
  status: 'draft' | 'submitted' | 'reviewed';
  imageCount: number;
  hasComment?: boolean;
}

interface LogItemProps {
  log: LogData;
  onPress: () => void;
}

const LogItem: React.FC<LogItemProps> = ({ log, onPress }) => {
  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'draft':
        return styles.statusDraft;
      case 'submitted':
        return styles.statusSubmitted;
      case 'reviewed':
        return styles.statusReviewed;
      default:
        return styles.statusDraft;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'draft':
        return '草稿';
      case 'submitted':
        return '已提交';
      case 'reviewed':
        return '已批阅';
      default:
        return '草稿';
    }
  };

  const getStatusTextStyle = (status: string) => {
    switch (status) {
      case 'draft':
        return styles.statusTextDraft;
      case 'submitted':
        return styles.statusTextSubmitted;
      case 'reviewed':
        return styles.statusTextReviewed;
      default:
        return styles.statusTextDraft;
    }
  };

  const renderStatusInfo = () => {
    if (log.status === 'draft') {
      return (
        <View style={styles.statusInfoItem}>
          <FontAwesome6 name="pen-to-square" size={10} color="#D97706" />
          <Text style={styles.statusInfoTextDraft}>可编辑</Text>
        </View>
      );
    } else if (log.status === 'submitted') {
      return (
        <View style={styles.statusInfoItem}>
          <FontAwesome6 name="clock" size={10} color="#6B7280" />
          <Text style={styles.statusInfoText}>待批阅</Text>
        </View>
      );
    } else if (log.status === 'reviewed' && log.hasComment) {
      return (
        <View style={styles.statusInfoItem}>
          <FontAwesome6 name="comment" size={10} color="#6B7280" />
          <Text style={styles.statusInfoText}>导师已批注</Text>
        </View>
      );
    }
    return null;
  };

  return (
    <TouchableOpacity 
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.95}
    >
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.title} numberOfLines={1}>
            {log.title}
          </Text>
          <Text style={styles.date}>{log.date}</Text>
        </View>
        <View style={[styles.statusBadge, getStatusStyle(log.status)]}>
          <Text style={[styles.statusText, getStatusTextStyle(log.status)]}>
            {getStatusText(log.status)}
          </Text>
        </View>
      </View>

      <Text style={styles.content} numberOfLines={2}>
        {log.content}
      </Text>

      <View style={styles.footer}>
        <View style={styles.footerLeft}>
          <View style={styles.statusInfoItem}>
            <FontAwesome6 name="images" size={10} color="#6B7280" />
            <Text style={styles.statusInfoText}>
              {log.imageCount}张图片
            </Text>
          </View>
          {renderStatusInfo()}
        </View>
        <Text style={styles.time}>{log.time}</Text>
      </View>
    </TouchableOpacity>
  );
};

export default LogItem;

