import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, FlatList, Modal, TextInput, ActivityIndicator, Alert, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Header from '../components/Header';
import { styles } from '../styles';
import { productionApi } from '../services/api';

interface Employee {
  id: string;
  name: string;
  role: string;
  permissions: string[];
  status: string;
}

const EmployeeManagementScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  
  // 权限选项
  const permissionOptions = [
    '批次管理',
    '死淘/耗料记录',
    '员工权限管理',
    '数据查看',
    '报表生成'
  ];
  
  // 表单数据
  const [formData, setFormData] = useState({
    name: '',
    role: '',
    permissions: [] as string[]
  });

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    setLoading(true);
    try {
      // 调用API获取员工列表
      const response = await productionApi.getEmployees();
      setEmployees(response.data || []);
    } catch (error) {
      console.error('获取员工列表失败:', error);
      Alert.alert('错误', '获取员工列表失败');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateEmployee = async () => {
    if (!formData.name || !formData.role) {
      Alert.alert('提示', '请填写完整信息');
      return;
    }

    setLoading(true);
    try {
      await productionApi.createEmployee({
        name: formData.name,
        role: formData.role,
        permissions: formData.permissions
      });
      
      Alert.alert('成功', '员工创建成功');
      resetForm();
      setModalVisible(false);
      fetchEmployees();
    } catch (error) {
      console.error('创建员工失败:', error);
      Alert.alert('错误', '创建员工失败');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePermission = async () => {
    if (!editingEmployee) return;
    
    setLoading(true);
    try {
      await productionApi.updateEmployeePermission(editingEmployee.id, {
        role: formData.role,
        permissions: formData.permissions
      });
      
      Alert.alert('成功', '员工权限更新成功');
      resetForm();
      setModalVisible(false);
      fetchEmployees();
    } catch (error) {
      console.error('更新员工权限失败:', error);
      Alert.alert('错误', '更新员工权限失败');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      role: '',
      permissions: []
    });
    setEditingEmployee(null);
  };

  const togglePermission = (permission: string) => {
    setFormData(prev => {
      if (prev.permissions.includes(permission)) {
        return {
          ...prev,
          permissions: prev.permissions.filter(p => p !== permission)
        };
      } else {
        return {
          ...prev,
          permissions: [...prev.permissions, permission]
        };
      }
    });
  };

  const renderEmployeeItem = ({ item }: { item: Employee }) => {
    return (
      <View style={styles.employeeItem}>
        <View style={styles.employeeItemHeader}>
          <Text style={styles.employeeItemName}>{item.name}</Text>
          <Text style={styles.employeeItemRole}>{item.role}</Text>
        </View>
        <View style={styles.employeeItemContent}>
          <Text style={styles.employeeItemPermissionsTitle}>权限:</Text>
          <View style={styles.employeePermissionsContainer}>
            {item.permissions.map((permission, index) => (
              <View key={index} style={styles.employeePermissionTag}>
                <Text style={styles.employeePermissionTagText}>{permission}</Text>
              </View>
            ))}
          </View>
        </View>
        <View style={styles.employeeItemActions}>
          <TouchableOpacity
            style={[styles.actionButton, styles.editButton]}
            onPress={() => {
              setEditingEmployee(item);
              setFormData({
                name: item.name,
                role: item.role,
                permissions: item.permissions
              });
              setModalVisible(true);
            }}
          >
            <Text style={styles.actionButtonText}>编辑权限</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Header 
        title="员工权限管理" 
        showBackButton 
        onBack={() => navigation.goBack()} 
        rightComponent={
          <TouchableOpacity onPress={() => setModalVisible(true)}>
            <Text style={{ color: '#2DBBA1', fontSize: 16 }}>新增员工</Text>
          </TouchableOpacity>
        }
      />
      
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#2DBBA1" />
        </View>
      ) : (
        <FlatList
          data={employees}
          renderItem={renderEmployeeItem}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.employeeList}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>暂无员工信息</Text>
              <TouchableOpacity 
                style={styles.addFirstEmployeeButton}
                onPress={() => setModalVisible(true)}
              >
                <Text style={styles.addFirstEmployeeText}>添加第一个员工</Text>
              </TouchableOpacity>
            </View>
          }
        />
      )}
      
      {/* 新增/编辑员工模态框 */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {editingEmployee ? '编辑员工权限' : '新增员工'}
              </Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Text style={styles.modalCloseButton}>×</Text>
              </TouchableOpacity>
            </View>
            
            <ScrollView style={styles.modalBody}>
              {!editingEmployee && (
                <View style={styles.formGroup}>
                  <Text style={styles.formLabel}>员工姓名</Text>
                  <TextInput
                    style={styles.formInput}
                    placeholder="请输入员工姓名"
                    value={formData.name}
                    onChangeText={(value) => setFormData({ ...formData, name: value })}
                  />
                </View>
              )}
              
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>角色</Text>
                <TextInput
                  style={styles.formInput}
                  placeholder="请输入角色"
                  value={formData.role}
                  onChangeText={(value) => setFormData({ ...formData, role: value })}
                />
              </View>
              
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>权限设置</Text>
                <View style={styles.permissionOptionsContainer}>
                  {permissionOptions.map((permission) => (
                    <TouchableOpacity 
                      key={permission}
                      style={[
                        styles.permissionOptionItem,
                        formData.permissions.includes(permission) && styles.permissionOptionItemSelected
                      ]}
                      onPress={() => togglePermission(permission)}
                    >
                      <Text 
                        style={[
                          styles.permissionOptionText,
                          formData.permissions.includes(permission) && styles.permissionOptionTextSelected
                        ]}
                      >
                        {permission}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </ScrollView>
            
            <View style={styles.modalFooter}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.modalButtonText}>取消</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.submitButton]}
                onPress={editingEmployee ? handleUpdatePermission : handleCreateEmployee}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="#FFFFFF" />
                ) : (
                  <Text style={styles.modalButtonText}>
                    {editingEmployee ? '更新权限' : '创建员工'}
                  </Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default EmployeeManagementScreen;