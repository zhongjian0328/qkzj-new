

import React from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from 'react-native';
import { FontAwesome6 } from '@expo/vector-icons';
import styles from './styles';

interface DeleteModalProps {
  visible: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

const DeleteModal: React.FC<DeleteModalProps> = ({
  visible,
  onConfirm,
  onCancel,
}) => {
  const handleBackdropPress = () => {
    onCancel();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onCancel}
    >
      <TouchableWithoutFeedback onPress={handleBackdropPress}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback>
            <View style={styles.modalContainer}>
              <View style={styles.iconContainer}>
                <FontAwesome6 name="triangle-exclamation" size={32} color="#DC2626" />
              </View>
              
              <Text style={styles.title}>确认删除</Text>
              <Text style={styles.message}>删除后将无法恢复，确定要删除这个批次吗？</Text>
              
              <View style={styles.actionButtons}>
                <TouchableOpacity style={styles.cancelButton} onPress={onCancel}>
                  <Text style={styles.cancelButtonText}>取消</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.confirmButton} onPress={onConfirm}>
                  <Text style={styles.confirmButtonText}>删除</Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

export default DeleteModal;

