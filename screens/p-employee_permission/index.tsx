

import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Modal, TextInput, Alert, Image, } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { FontAwesome6 } from '@expo/vector-icons';
import styles from './styles';
import { getEmployeeListApi, addEmployeeApi, getEmployeePermissionsApi, updateEmployeePermissionsApi, Employee, Permissions } from '../../src/services/api';

const EmployeePermissionScreen = () => {
  const router = useRouter();

  // 员工列表数据
  const [employeeList, setEmployeeList] = useState<Employee[]>([
    {
      id: 'emp001',
      name: '张场长',
      role: '场长',
      phone: '138****5678',
      avatar: 'https://s.coze.cn/image/0aZUPbwJ-lo/',
      status: '在职',
    },
    {
      id: 'emp002',
      name: '李饲养员',
      role: '饲养员',
      phone: '139****9012',
      avatar: 'https://s.coze.cn/image/Vd85bEicSXg/',
      status: '在职',
    },
    {
      id: 'emp003',
      name: '王技术员',
      role: '技术员',
      phone: '137****3456',
      avatar: 'https://s.coze.cn/image/tm75ot0-zBM/',
      status: '在职',
    },
    {
      id: 'emp004',
      name: '陈管理员',
      role: '管理员',
      phone: '136****7890',
      avatar: 'https://s.coze.cn/image/cHHh-hwP3vk/',
      status: '在职',
    },
  ]);

  // 弹窗状态
  const [isAddEmployeeModalVisible, setIsAddEmployeeModalVisible] = useState(false);
  const [isEmployeeDetailModalVisible, setIsEmployeeDetailModalVisible] = useState(false);

  // 添加员工表单数据
  const [newEmployeeData, setNewEmployeeData] = useState({
    name: '',
    phone: '',
    role: '',
  });

  // 选中的员工详情
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [employeePermissions, setEmployeePermissions] = useState<Permissions>({
    viewData: false,
    enterData: false,
    manageBatch: false,
    manageEmployee: false,
    exportData: false,
  });

  // 返回按钮处理
  const handleBackPress = () => {
    if (router.canGoBack()) {
      router.back();
    }
  };

  // 打开添加员工弹窗
  const handleOpenAddEmployeeModal = () => {
    setIsAddEmployeeModalVisible(true);
  };

  // 关闭添加员工弹窗
  const handleCloseAddEmployeeModal = () => {
    setIsAddEmployeeModalVisible(false);
    setNewEmployeeData({ name: '', phone: '', role: '' });
  };

  // 确认添加员工
  const handleConfirmAddEmployee = () => {
    if (!newEmployeeData.name || !newEmployeeData.phone || !newEmployeeData.role) {
      Alert.alert('提示', '请填写完整的员工信息');
      return;
    }

    const roleMap: { [key: string]: string } = {
      manager: '场长',
      breeder: '饲养员',
      technician: '技术员',
      admin: '管理员',
    };

    const newEmployee: Employee = {
      id: `emp${Date.now()}`,
      name: newEmployeeData.name,
      role: roleMap[newEmployeeData.role] || newEmployeeData.role,
      phone: newEmployeeData.phone,
      avatar: 'https://s.coze.cn/image/HUU_tz5Y8fY/', // 默认头像
      status: '在职',
    };

    setEmployeeList(prevList => [...prevList, newEmployee]);
    handleCloseAddEmployeeModal();
    Alert.alert('成功', '员工添加成功');
  };

  // 打开员工详情弹窗
  const handleOpenEmployeeDetail = (employee: Employee) => {
    setSelectedEmployee(employee);
    const permissions = getDefaultPermissionsByRole(employee.role);
    setEmployeePermissions(permissions);
    setIsEmployeeDetailModalVisible(true);
  };

  // 根据角色获取默认权限
  const getDefaultPermissionsByRole = (role: string): Permissions => {
    switch (role) {
      case '场长':
      case '管理员':
        return {
          viewData: true,
          enterData: true,
          manageBatch: true,
          manageEmployee: true,
          exportData: true,
        };
      case '饲养员':
        return {
          viewData: true,
          enterData: true,
          manageBatch: false,
          manageEmployee: false,
          exportData: false,
        };
      case '技术员':
        return {
          viewData: true,
          enterData: true,
          manageBatch: true,
          manageEmployee: false,
          exportData: true,
        };
      default:
        return {
          viewData: false,
          enterData: false,
          manageBatch: false,
          manageEmployee: false,
          exportData: false,
        };
    }
  };

  // 关闭员工详情弹窗
  const handleCloseEmployeeDetailModal = () => {
    setIsEmployeeDetailModalVisible(false);
    setSelectedEmployee(null);
  };

  // 保存权限设置
  const handleSavePermissionSettings = () => {
    console.log('保存权限设置:', employeePermissions);
    handleCloseEmployeeDetailModal();
    Alert.alert('成功', '权限设置已保存');
  };

  // 渲染员工列表项
  const renderEmployeeItem = (employee: Employee) => (
    <TouchableOpacity
      key={employee.id}
      style={styles.employeeItem}
      onPress={() => handleOpenEmployeeDetail(employee)}
      activeOpacity={0.7}
    >
      <View style={styles.employeeItemContent}>
        <View style={styles.employeeInfo}>
          <Image source={{ uri: employee.avatar }} style={styles.employeeAvatar} />
          <View style={styles.employeeDetails}>
            <Text style={styles.employeeName}>{employee.name}</Text>
            <Text style={styles.employeeRole}>{employee.role}</Text>
            <Text style={styles.employeePhone}>{employee.phone}</Text>
          </View>
        </View>
        <View style={styles.employeeActions}>
          <View style={styles.statusBadge}>
            <Text style={styles.statusText}>{employee.status}</Text>
          </View>
          <FontAwesome6 name="chevron-right" size={16} color="#6B7280" />
        </View>
      </View>
    </TouchableOpacity>
  );

  // 渲染权限开关
  const renderPermissionSwitch = (
    label: string,
    value: boolean,
    onValueChange: (value: boolean) => void
  ) => (
    <View style={styles.permissionItem}>
      <Text style={styles.permissionLabel}>{label}</Text>
      <TouchableOpacity
        style={[styles.switchContainer, value && styles.switchContainerActive]}
        onPress={() => onValueChange(!value)}
        activeOpacity={0.8}
      >
        <View style={[styles.switchThumb, value && styles.switchThumbActive]} />
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* 顶部导航栏 */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={handleBackPress}
          activeOpacity={0.7}
        >
          <FontAwesome6 name="arrow-left" size={20} color="#6B7280" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>员工权限管理</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* 添加员工按钮 */}
        <View style={styles.addEmployeeSection}>
          <TouchableOpacity
            style={styles.addEmployeeButton}
            onPress={handleOpenAddEmployeeModal}
            activeOpacity={0.8}
          >
            <FontAwesome6 name="plus" size={16} color="#FFFFFF" />
            <Text style={styles.addEmployeeButtonText}>添加员工</Text>
          </TouchableOpacity>
        </View>

        {/* 员工列表 */}
        <View style={styles.employeeListSection}>
          <Text style={styles.sectionTitle}>员工列表</Text>
          <View style={styles.employeeList}>
            {employeeList.map(renderEmployeeItem)}
          </View>
        </View>
      </ScrollView>

      {/* 添加员工弹窗 */}
      <Modal
        visible={isAddEmployeeModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={handleCloseAddEmployeeModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>添加员工</Text>

              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>员工姓名</Text>
                <TextInput
                  style={styles.formInput}
                  placeholder="请输入员工姓名"
                  value={newEmployeeData.name}
                  onChangeText={(text) => setNewEmployeeData(prev => ({ ...prev, name: text }))}
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>手机号码</Text>
                <TextInput
                  style={styles.formInput}
                  placeholder="请输入手机号码"
                  keyboardType="phone-pad"
                  value={newEmployeeData.phone}
                  onChangeText={(text) => setNewEmployeeData(prev => ({ ...prev, phone: text }))}
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>角色</Text>
                <View style={styles.roleSelector}>
                  {[
                    { value: 'manager', label: '场长' },
                    { value: 'breeder', label: '饲养员' },
                    { value: 'technician', label: '技术员' },
                    { value: 'admin', label: '管理员' },
                  ].map((role) => (
                    <TouchableOpacity
                      key={role.value}
                      style={[
                        styles.roleOption,
                        newEmployeeData.role === role.value && styles.roleOptionSelected,
                      ]}
                      onPress={() => setNewEmployeeData(prev => ({ ...prev, role: role.value }))}
                      activeOpacity={0.7}
                    >
                      <Text
                        style={[
                          styles.roleOptionText,
                          newEmployeeData.role === role.value && styles.roleOptionTextSelected,
                        ]}
                      >
                        {role.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <View style={styles.modalActions}>
                <TouchableOpacity
                  style={styles.cancelButton}
                  onPress={handleCloseAddEmployeeModal}
                  activeOpacity={0.7}
                >
                  <Text style={styles.cancelButtonText}>取消</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.confirmButton}
                  onPress={handleConfirmAddEmployee}
                  activeOpacity={0.8}
                >
                  <Text style={styles.confirmButtonText}>确认添加</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </Modal>

      {/* 员工详情弹窗 */}
      <Modal
        visible={isEmployeeDetailModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={handleCloseEmployeeDetailModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>员工详情</Text>

              {selectedEmployee && (
                <View style={styles.employeeDetailContent}>
                  <View style={styles.employeeDetailHeader}>
                    <Image
                      source={{ uri: selectedEmployee.avatar }}
                      style={styles.employeeDetailAvatar}
                    />
                    <View style={styles.employeeDetailInfo}>
                      <Text style={styles.employeeDetailName}>{selectedEmployee.name}</Text>
                      <Text style={styles.employeeDetailPhone}>{selectedEmployee.phone}</Text>
                      <Text style={styles.employeeDetailRole}>{selectedEmployee.role}</Text>
                    </View>
                  </View>

                  <View style={styles.permissionSection}>
                    <Text style={styles.permissionSectionTitle}>权限设置</Text>
                    <View style={styles.permissionList}>
                      {renderPermissionSwitch(
                        '查看生产数据',
                        employeePermissions.viewData,
                        (value) =>
                          setEmployeePermissions(prev => ({ ...prev, viewData: value }))
                      )}
                      {renderPermissionSwitch(
                        '录入生产数据',
                        employeePermissions.enterData,
                        (value) =>
                          setEmployeePermissions(prev => ({ ...prev, enterData: value }))
                      )}
                      {renderPermissionSwitch(
                        '管理批次',
                        employeePermissions.manageBatch,
                        (value) =>
                          setEmployeePermissions(prev => ({ ...prev, manageBatch: value }))
                      )}
                      {renderPermissionSwitch(
                        '管理员工',
                        employeePermissions.manageEmployee,
                        (value) =>
                          setEmployeePermissions(prev => ({ ...prev, manageEmployee: value }))
                      )}
                      {renderPermissionSwitch(
                        '数据导出',
                        employeePermissions.exportData,
                        (value) =>
                          setEmployeePermissions(prev => ({ ...prev, exportData: value }))
                      )}
                    </View>
                  </View>

                  <View style={styles.modalActions}>
                    <TouchableOpacity
                      style={styles.cancelButton}
                      onPress={handleCloseEmployeeDetailModal}
                      activeOpacity={0.7}
                    >
                      <Text style={styles.cancelButtonText}>取消</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.confirmButton}
                      onPress={handleSavePermissionSettings}
                      activeOpacity={0.8}
                    >
                      <Text style={styles.confirmButtonText}>保存设置</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default EmployeePermissionScreen;

