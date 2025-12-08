

import React from 'react';
import { View, Text, TouchableOpacity, Image, ScrollView, Modal } from 'react-native';
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

interface CustomerDetailPanelProps {
  visible: boolean;
  customer: Customer | null;
  onClose: () => void;
}

const CustomerDetailPanel: React.FC<CustomerDetailPanelProps> = ({
  visible,
  customer,
  onClose,
}) => {
  if (!customer) return null;

  const handleEditPress = () => {
    // TODO: 实现编辑客户功能
  };

  const handleViewAllOrders = () => {
    // TODO: 实现查看全部订单功能
  };

  const handleViewAllDiagnosis = () => {
    // TODO: 实现查看全部诊断记录功能
  };

  const handleAddInteraction = () => {
    // TODO: 实现添加互动记录功能
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case '小散户':
        return { backgroundColor: '#DCFCE7', color: '#16A34A' };
      case '合作社':
        return { backgroundColor: '#DBEAFE', color: '#2563EB' };
      case '养殖企业':
        return { backgroundColor: '#F3E8FF', color: '#9333EA' };
      default:
        return { backgroundColor: '#F3F4F6', color: '#6B7280' };
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case '活跃':
        return { backgroundColor: '#DBEAFE', color: '#2563EB' };
      case 'VIP':
        return { backgroundColor: '#DCFCE7', color: '#16A34A' };
      case '待跟进':
        return { backgroundColor: '#FED7AA', color: '#EA580C' };
      case '休眠':
        return { backgroundColor: '#F3F4F6', color: '#6B7280' };
      default:
        return { backgroundColor: '#F3F4F6', color: '#6B7280' };
    }
  };

  const typeStyle = getTypeColor(customer.type);
  const statusStyle = getStatusColor(customer.status);

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="overFullScreen"
      transparent
    >
      <View style={styles.overlay}>
        <View style={styles.panel}>
          {/* 头部 */}
          <View style={styles.header}>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <FontAwesome6 name="arrow-left" size={20} color="#FFFFFF" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>客户详情</Text>
            <TouchableOpacity style={styles.editButton} onPress={handleEditPress}>
              <FontAwesome6 name="pen" size={20} color="#FFFFFF" />
            </TouchableOpacity>
          </View>

          {/* 内容区域 */}
          <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
            {/* 基本信息 */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>基本信息</Text>
              <View style={styles.basicInfoCard}>
                <View style={styles.customerHeader}>
                  <Image source={{ uri: customer.avatar }} style={styles.detailAvatar} />
                  <View style={styles.customerHeaderInfo}>
                    <Text style={styles.detailName}>{customer.name}</Text>
                    <View style={styles.detailTags}>
                      <View style={[styles.detailTag, { backgroundColor: typeStyle.backgroundColor }]}>
                        <Text style={[styles.detailTagText, { color: typeStyle.color }]}>{customer.type}</Text>
                      </View>
                      <View style={[styles.detailTag, { backgroundColor: statusStyle.backgroundColor }]}>
                        <Text style={[styles.detailTagText, { color: statusStyle.color }]}>{customer.status}</Text>
                      </View>
                    </View>
                  </View>
                </View>
                <View style={styles.infoList}>
                  <View style={styles.infoItem}>
                    <Text style={styles.infoLabel}>联系电话</Text>
                    <Text style={styles.infoValue}>{customer.phone.replace(/\*/g, '')}</Text>
                  </View>
                  <View style={styles.infoItem}>
                    <Text style={styles.infoLabel}>地址</Text>
                    <Text style={styles.infoValue}>{customer.address}</Text>
                  </View>
                  <View style={styles.infoItem}>
                    <Text style={styles.infoLabel}>养殖规模</Text>
                    <Text style={styles.infoValue}>{customer.scale}</Text>
                  </View>
                  <View style={styles.infoItem}>
                    <Text style={styles.infoLabel}>注册时间</Text>
                    <Text style={styles.infoValue}>{customer.registerTime}</Text>
                  </View>
                </View>
              </View>
            </View>

            {/* 历史订单 */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>历史订单</Text>
                <TouchableOpacity onPress={handleViewAllOrders}>
                  <Text style={styles.viewAllText}>查看全部</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.ordersList}>
                <View style={styles.orderItem}>
                  <View style={styles.orderHeader}>
                    <Text style={styles.orderNumber}>订单 #20240115001</Text>
                    <Text style={styles.orderStatus}>已完成</Text>
                  </View>
                  <View style={styles.orderDetails}>
                    <Text style={styles.orderProduct}>阿莫西林 10盒</Text>
                    <Text style={styles.orderPrice}>¥280</Text>
                  </View>
                  <Text style={styles.orderDate}>2024-01-15</Text>
                </View>
                <View style={styles.orderItem}>
                  <View style={styles.orderHeader}>
                    <Text style={styles.orderNumber}>订单 #20240110002</Text>
                    <Text style={styles.orderStatus}>已完成</Text>
                  </View>
                  <View style={styles.orderDetails}>
                    <Text style={styles.orderProduct}>禽流感疫苗 50瓶</Text>
                    <Text style={styles.orderPrice}>¥1,250</Text>
                  </View>
                  <Text style={styles.orderDate}>2024-01-10</Text>
                </View>
              </View>
            </View>

            {/* 诊断记录 */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>诊断记录</Text>
                <TouchableOpacity onPress={handleViewAllDiagnosis}>
                  <Text style={styles.viewAllText}>查看全部</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.diagnosisList}>
                <View style={styles.diagnosisItem}>
                  <View style={styles.diagnosisHeader}>
                    <Text style={styles.diagnosisName}>新城疫</Text>
                    <Text style={styles.diagnosisStatus}>已处理</Text>
                  </View>
                  <Text style={styles.diagnosisConfidence}>置信度：95%</Text>
                  <Text style={styles.diagnosisDate}>2024-01-15 14:30</Text>
                </View>
                <View style={styles.diagnosisItem}>
                  <View style={styles.diagnosisHeader}>
                    <Text style={styles.diagnosisName}>呼吸道感染</Text>
                    <Text style={styles.diagnosisStatus}>已治愈</Text>
                  </View>
                  <Text style={styles.diagnosisConfidence}>置信度：88%</Text>
                  <Text style={styles.diagnosisDate}>2024-01-08 10:15</Text>
                </View>
              </View>
            </View>

            {/* 互动记录 */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>互动记录</Text>
                <TouchableOpacity style={styles.addInteractionButton} onPress={handleAddInteraction}>
                  <FontAwesome6 name="plus" size={12} color="#FFFFFF" />
                  <Text style={styles.addInteractionText}>添加记录</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.interactionList}>
                <View style={styles.interactionItem}>
                  <View style={styles.interactionHeader}>
                    <Text style={styles.interactionType}>电话咨询</Text>
                    <Text style={styles.interactionTime}>2024-01-15 16:20</Text>
                  </View>
                  <Text style={styles.interactionContent}>
                    客户咨询新城疫治疗方案，已提供详细用药建议
                  </Text>
                </View>
                <View style={styles.interactionItem}>
                  <View style={styles.interactionHeader}>
                    <Text style={styles.interactionType}>在线诊疗</Text>
                    <Text style={styles.interactionTime}>2024-01-14 09:30</Text>
                  </View>
                  <Text style={styles.interactionContent}>
                    通过AI诊断功能为客户提供远程诊疗服务
                  </Text>
                </View>
              </View>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

export default CustomerDetailPanel;

