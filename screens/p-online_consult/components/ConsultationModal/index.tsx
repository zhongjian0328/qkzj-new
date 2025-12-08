

import React from 'react';
import { View, Text, TouchableOpacity, Modal, Image, ScrollView } from 'react-native';
import { FontAwesome6 } from '@expo/vector-icons';
import { ConsultationModalProps } from '../../types';
import styles from './styles';

const ConsultationModal: React.FC<ConsultationModalProps> = ({
  visible,
  consultation,
  onClose,
  onAccept,
}) => {
  if (!consultation) return null;

  const { user, symptoms } = consultation;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
            <View style={styles.header}>
              <Text style={styles.title}>诊疗请求详情</Text>
              <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                <FontAwesome6 name="xmark" size={20} color="#6B7280" />
              </TouchableOpacity>
            </View>

            <View style={styles.content}>
              {/* 用户信息 */}
              <View style={styles.userInfoSection}>
                <Image source={{ uri: user.avatar }} style={styles.userAvatar} />
                <View style={styles.userDetails}>
                  <Text style={styles.userName}>{user.name}</Text>
                  <Text style={styles.userPhone}>{user.phone}</Text>
                  <Text style={styles.userLocation}>{user.location}</Text>
                </View>
              </View>

              {/* 症状描述 */}
              <View style={styles.symptomsSection}>
                <Text style={styles.sectionLabel}>详细症状</Text>
                <View style={styles.symptomsContainer}>
                  <Text style={styles.symptomsText}>{symptoms}</Text>
                </View>
              </View>

              {/* 图片展示（预留） */}
              {/* <View style={styles.imagesSection}>
                <Text style={styles.sectionLabel}>症状图片</Text>
                <View style={styles.imagesContainer}>
                  <Text style={styles.placeholderText}>暂无图片</Text>
                </View>
              </View> */}

              {/* 诊断历史（预留） */}
              {/* <View style={styles.historySection}>
                <Text style={styles.sectionLabel}>近期诊断历史</Text>
                <View style={styles.historyContainer}>
                  <Text style={styles.placeholderText}>暂无诊断历史</Text>
                </View>
              </View> */}
            </View>
          </ScrollView>

          <View style={styles.footer}>
            <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
              <Text style={styles.cancelButtonText}>取消</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.acceptButton} onPress={onAccept}>
              <Text style={styles.acceptButtonText}>接单处理</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default ConsultationModal;

