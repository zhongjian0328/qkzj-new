

import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  TextInput,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { FontAwesome6 } from '@expo/vector-icons';
import styles from './styles';

interface PublishModalProps {
  visible: boolean;
  onClose: () => void;
  onPublish: (policyData: { title: string; content: string; scope: string }) => void;
}

const PublishModal: React.FC<PublishModalProps> = ({ visible, onClose, onPublish }) => {
  const [policyTitle, setPolicyTitle] = useState('');
  const [policyContent, setPolicyContent] = useState('');
  const [policyScope, setPolicyScope] = useState('all');

  const handleClose = useCallback(() => {
    setPolicyTitle('');
    setPolicyContent('');
    setPolicyScope('all');
    onClose();
  }, [onClose]);

  const handlePublish = useCallback(() => {
    if (!policyTitle.trim() || !policyContent.trim()) {
      Alert.alert('提示', '请填写必填项');
      return;
    }

    onPublish({
      title: policyTitle.trim(),
      content: policyContent.trim(),
      scope: policyScope,
    });

    setPolicyTitle('');
    setPolicyContent('');
    setPolicyScope('all');
  }, [policyTitle, policyContent, policyScope, onPublish]);

  const getScopeOptions = () => [
    { label: '全部用户', value: 'all' },
    { label: '养殖户', value: 'farmers' },
    { label: '养殖企业', value: 'enterprises' },
    { label: '学生', value: 'students' },
  ];

  const getSelectedScopeLabel = () => {
    const option = getScopeOptions().find(opt => opt.value === policyScope);
    return option ? option.label : '全部用户';
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={handleClose}
    >
      <View style={styles.overlay}>
        <TouchableOpacity style={styles.overlayTouchable} onPress={handleClose} />
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardAvoidingView}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>发布新政策</Text>
                <TouchableOpacity style={styles.closeButton} onPress={handleClose}>
                  <FontAwesome6 name="xmark" size={18} color="#6B7280" />
                </TouchableOpacity>
              </View>

              <View style={styles.formContainer}>
                <View style={styles.formGroup}>
                  <Text style={styles.formLabel}>政策标题 *</Text>
                  <TextInput
                    style={styles.textInput}
                    placeholder="请输入政策标题"
                    value={policyTitle}
                    onChangeText={setPolicyTitle}
                    placeholderTextColor="#9CA3AF"
                  />
                </View>

                <View style={styles.formGroup}>
                  <Text style={styles.formLabel}>政策内容 *</Text>
                  <TextInput
                    style={[styles.textInput, styles.textArea]}
                    placeholder="请输入政策详细内容"
                    value={policyContent}
                    onChangeText={setPolicyContent}
                    multiline
                    numberOfLines={6}
                    textAlignVertical="top"
                    placeholderTextColor="#9CA3AF"
                  />
                </View>

                <View style={styles.formGroup}>
                  <Text style={styles.formLabel}>下发范围</Text>
                  <View style={styles.scopeSelector}>
                    <Text style={styles.scopeSelectorText}>{getSelectedScopeLabel()}</Text>
                    <FontAwesome6 name="chevron-down" size={12} color="#6B7280" />
                  </View>
                </View>

                <View style={styles.buttonContainer}>
                  <TouchableOpacity style={styles.cancelButton} onPress={handleClose}>
                    <Text style={styles.cancelButtonText}>取消</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.publishButton} onPress={handlePublish}>
                    <Text style={styles.publishButtonText}>发布</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
};

export default PublishModal;

