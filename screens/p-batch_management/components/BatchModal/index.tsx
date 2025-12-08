

import React, { useState, useEffect } from 'react';
import { View, Text, Modal, TouchableOpacity, TextInput, TouchableWithoutFeedback, Alert, } from 'react-native';
import { FontAwesome6 } from '@expo/vector-icons';
import styles from './styles';

interface BatchData {
  id: string;
  name: string;
  species: string;
  initialQuantity: number;
  currentQuantity: number;
  daysOld: number;
  entryDate: string;
  status: 'active' | 'completed';
  icon: string;
}

interface BatchModalProps {
  visible: boolean;
  isEditMode: boolean;
  batch: BatchData | null;
  onClose: () => void;
  onSave: (batchData: Omit<BatchData, 'id'>) => void;
}

const BatchModal: React.FC<BatchModalProps> = ({
  visible,
  isEditMode,
  batch,
  onClose,
  onSave,
}) => {
  const [batchName, setBatchName] = useState('');
  const [species, setSpecies] = useState('');
  const [initialQuantity, setInitialQuantity] = useState('');
  const [entryDate, setEntryDate] = useState('');

  const speciesOptions = ['白羽肉鸡', '黄羽肉鸡', '蛋鸡', '鸭', '鹅'];

  useEffect(() => {
    if (isEditMode && batch) {
      setBatchName(batch.name);
      setSpecies(batch.species);
      setInitialQuantity(batch.initialQuantity.toString());
      setEntryDate(batch.entryDate);
    } else {
      resetForm();
    }
  }, [isEditMode, batch, visible]);

  const resetForm = () => {
    setBatchName('');
    setSpecies('');
    setInitialQuantity('');
    setEntryDate(new Date().toISOString().split('T')[0]);
  };

  const handleSave = () => {
    if (!batchName.trim()) {
      Alert.alert('错误', '请输入批次名称');
      return;
    }
    if (!species) {
      Alert.alert('错误', '请选择禽类品种');
      return;
    }
    if (!initialQuantity || parseInt(initialQuantity) <= 0) {
      Alert.alert('错误', '请输入有效的初始数量');
      return;
    }
    if (!entryDate) {
      Alert.alert('错误', '请选择入栏日期');
      return;
    }

    const batchData: Omit<BatchData, 'id'> = {
      name: batchName.trim(),
      species,
      initialQuantity: parseInt(initialQuantity),
      currentQuantity: parseInt(initialQuantity),
      daysOld: 0,
      entryDate,
      status: 'active',
      icon: getIconForSpecies(species),
    };

    onSave(batchData);
  };

  const getIconForSpecies = (species: string): string => {
    if (species.includes('蛋鸡')) return 'egg';
    if (species.includes('鸭')) return 'water';
    return 'drumstick-bite';
  };

  const handleBackdropPress = () => {
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={handleBackdropPress}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback>
            <View style={styles.modalContainer}>
              {/* 弹窗头部 */}
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>
                  {isEditMode ? '编辑批次' : '新建批次'}
                </Text>
                <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                  <FontAwesome6 name="xmark" size={20} color="#6B7280" />
                </TouchableOpacity>
              </View>

              {/* 表单内容 */}
              <View style={styles.formContainer}>
                <View style={styles.formGroup}>
                  <Text style={styles.formLabel}>批次名称 *</Text>
                  <TextInput
                    style={styles.formInput}
                    placeholder="请输入批次名称"
                    value={batchName}
                    onChangeText={setBatchName}
                  />
                </View>

                <View style={styles.formGroup}>
                  <Text style={styles.formLabel}>禽类品种 *</Text>
                  <View style={styles.speciesContainer}>
                    <TextInput
                      style={styles.speciesInput}
                      placeholder="请选择品种"
                      value={species}
                      editable={false}
                      pointerEvents="none"
                    />
                    <View style={styles.speciesOptions}>
                      {speciesOptions.map(option => (
                        <TouchableOpacity
                          key={option}
                          style={[
                            styles.speciesOption,
                            species === option && styles.speciesOptionActive
                          ]}
                          onPress={() => setSpecies(option)}
                        >
                          <Text style={[
                            styles.speciesOptionText,
                            species === option && styles.speciesOptionTextActive
                          ]}>
                            {option}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  </View>
                </View>

                <View style={styles.formGroup}>
                  <Text style={styles.formLabel}>初始数量 *</Text>
                  <TextInput
                    style={styles.formInput}
                    placeholder="请输入初始数量"
                    value={initialQuantity}
                    onChangeText={setInitialQuantity}
                    keyboardType="numeric"
                  />
                </View>

                <View style={styles.formGroup}>
                  <Text style={styles.formLabel}>入栏日期 *</Text>
                  <TextInput
                    style={styles.formInput}
                    placeholder="YYYY-MM-DD"
                    value={entryDate}
                    onChangeText={setEntryDate}
                  />
                </View>

                {/* 操作按钮 */}
                <View style={styles.actionButtons}>
                  <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
                    <Text style={styles.cancelButtonText}>取消</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                    <Text style={styles.saveButtonText}>保存</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

export default BatchModal;

