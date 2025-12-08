

import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
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
}

interface CustomerListItemProps {
  customer: Customer;
  onPress: () => void;
}

const CustomerListItem: React.FC<CustomerListItemProps> = ({ customer, onPress }) => {
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
    <TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.content}>
        <View style={styles.leftSection}>
          <Image source={{ uri: customer.avatar }} style={styles.avatar} />
          <View style={styles.customerInfo}>
            <Text style={styles.customerName}>{customer.name}</Text>
            <Text style={styles.customerPhone}>{customer.phone}</Text>
            <View style={styles.tagsContainer}>
              <View style={[styles.tag, { backgroundColor: typeStyle.backgroundColor }]}>
                <Text style={[styles.tagText, { color: typeStyle.color }]}>{customer.type}</Text>
              </View>
              <View style={[styles.tag, { backgroundColor: statusStyle.backgroundColor }]}>
                <Text style={[styles.tagText, { color: statusStyle.color }]}>{customer.status}</Text>
              </View>
            </View>
          </View>
        </View>
        <View style={styles.rightSection}>
          <Text style={styles.interactionLabel}>最近互动</Text>
          <Text style={styles.interactionTime}>{customer.lastInteraction}</Text>
          <FontAwesome6 name="chevron-right" size={14} color="#6B7280" style={styles.chevron} />
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default CustomerListItem;

