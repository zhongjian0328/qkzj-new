import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/UserContext';
import Header from '../components/Header';
import { styles } from '../styles';

const ProductionManagementScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const { state } = useAuth();
  const { user } = state;

  const productionModules = [
    {
      id: 'batch',
      title: '批次管理',
      description: '管理养殖批次信息',
      icon: 'clipboard-outline',
      backgroundColor: '#E6F7F3',
      textColor: '#2DBBA1'
    },
    {
      id: 'deathFeed',
      title: '死淘/耗料记录',
      description: '记录死淘和耗料情况',
      icon: 'bar-chart-outline',
      backgroundColor: '#EBF5FF',
      textColor: '#3B82F6'
    },
    {
      id: 'employee',
      title: '员工权限管理',
      description: '管理员工权限',
      icon: 'people-outline',
      backgroundColor: '#F3E8FF',
      textColor: '#8B5CF6'
    }
  ];

  const handleModulePress = (moduleId: string) => {
    switch (moduleId) {
      case 'batch':
        navigation.navigate('BatchManagement');
        break;
      case 'deathFeed':
        navigation.navigate('DeathFeedRecord');
        break;
      case 'employee':
        navigation.navigate('EmployeeManagement');
        break;
      default:
        break;
    }
  };

  return (
    <View style={styles.container}>
      <Header title="生产管理" />
      
      <ScrollView style={{ flex: 1 }} contentContainerStyle={styles.scrollContent}>
        <View style={styles.productionModulesContainer}>
          {productionModules.map(module => (
            <TouchableOpacity
              key={module.id}
              style={styles.productionModuleCard}
              onPress={() => handleModulePress(module.id)}
              activeOpacity={0.95}
            >
              <View 
                style={[
                  styles.productionModuleIcon,
                  { backgroundColor: module.backgroundColor }
                ]}
              >
                <Ionicons name={module.icon as any} size={32} color={module.textColor} />
              </View>
              <View style={styles.productionModuleContent}>
                <Text style={styles.productionModuleTitle}>{module.title}</Text>
                <Text style={styles.productionModuleDescription}>{module.description}</Text>
              </View>
              <View style={styles.productionModuleArrow}>
                <Text style={styles.productionModuleArrowText}>→</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

export default ProductionManagementScreen;