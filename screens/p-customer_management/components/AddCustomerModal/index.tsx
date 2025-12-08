

import React, { useState } from 'react';
import { View, Text, Modal, TouchableOpacity, TextInput, Alert, ScrollView, } from 'react-native';
import { FontAwesome6 } from '@expo/vector-icons';
import styles from './styles';

interface Customer {
  id: string;
  name: string;
  phone: string;
  avatar: string;
  type: string;
  status: string;
  lastInteraction: string;
  address?: string;
  scale?: string;
  registerTime?: string;
}

interface AddCustomerModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (customer: Omit<Customer, 'id'>) => void;
}

const AddCustomerModal: React.FC<AddCustomerModalProps> = ({
  visible,
  onClose,
  onSubmit,
}) => {
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerType, setCustomerType] = useState('');
  const [customerAddress, setCustomerAddress] = useState('');
  const [customerScale, setCustomerScale] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const customerTypeOptions = [
    { label: '小散户', value: 'small' },
    { label: '合作社', value: 'cooperative' },
    { label: '养殖企业', value: 'enterprise' },
  ];

  const getTypeLabel = (value: string) => {
    const option = customerTypeOptions.find(opt => opt.value === value);
    return option ? option.label : '';
  };

  const handleSubmit = async () => {
    if (!customerName.trim() || !customerPhone.trim() || !customerType) {
      Alert.alert('提示', '请填写必填字段');
      return;
    }

    setIsSubmitting(true);
    
    try {
      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newCustomer = {
        name: customerName.trim(),
        phone: customerPhone.trim(),
        avatar: 'https://s.coze.cn/image/default-avatar.jpg', // 默认头像
        type: getTypeLabel(customerType),
        status: '活跃',
        lastInteraction: new Date().toISOString().split('T')[0],
        address: customerAddress.trim(),
        scale: customerScale.trim(),
        registerTime: new Date().toISOString().split('T')[0],
      };
      
      onSubmit(newCustomer);
      
      // 清空表单
      setCustomerName('');
      setCustomerPhone('');
      setCustomerType('');
      setCustomerAddress('');
      setCustomerScale('');
    } catch (error) {
      Alert.alert('错误', '添加客户失败，请重试');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    // 清空表单
    setCustomerName('');
    setCustomerPhone('');
    setCustomerType('');
    setCustomerAddress('');
    setCustomerScale('');
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      transparent
    >
      <View style={styles.overlay}>
        <View style={styles.modal}>
          {/* 头部 */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>添加客户</Text>
            <TouchableOpacity style={styles.closeButton} onPress={handleClose}>
              <FontAwesome6 name="xmark" size={20} color="#6B7280" />
            </TouchableOpacity>
          </View>

          {/* 表单内容 */}
          <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
            <View style={styles.form}>
              <View style={styles.formGroup}>
                <Text style={styles.label}>客户姓名/企业名称 *</Text>
                <TextInput
                  style={styles.input}
                  placeholder="请输入客户姓名或企业名称"
                  value={customerName}
                  onChangeText={setCustomerName}
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.label}>联系电话 *</Text>
                <TextInput
                  style={styles.input}
                  placeholder="请输入联系电话"
                  value={customerPhone}
                  onChangeText={setCustomerPhone}
                  keyboardType="phone-pad"
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.label}>客户类型 *</Text>
                <View style={styles.typeSelector}>
                  {customerTypeOptions.map((option) => (
                    <TouchableOpacity
                      key={option.value}
                      style={[
                        styles.typeOption,
                        customerType === option.value && styles.typeOptionSelected,
                      ]}
                      onPress={() => setCustomerType(option.value)}
                    >
                      <Text
                        style={[
                          styles.typeOptionText,
                          customerType === option.value && styles.typeOptionTextSelected,
                        ]}
                      >
                        {option.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.label}>地址</Text>
                <TextInput
                  style={styles.input}
                  placeholder="请输入地址"
                  value={customerAddress}
                  onChangeText={setCustomerAddress}
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.label}>养殖规模</Text>
                <TextInput
                  style={styles.input}
                  placeholder="如：约5000只肉鸡"
                  value={customerScale}
                  onChangeText={setCustomerScale}
                />
              </View>
            </View>
          </ScrollView>

          {/* 底部按钮 */}
          <View style={styles.footer}>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={handleClose}
              disabled={isSubmitting}
            >
              <Text style={styles.cancelButtonText}>取消</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.submitButton, isSubmitting && styles.submitButtonDisabled]}
              onPress={handleSubmit}
              disabled={isSubmitting}
            >
              <Text style={styles.submitButtonText}>
                {isSubmitting ? '添加中...' : '添加客户'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default AddCustomerModal;

