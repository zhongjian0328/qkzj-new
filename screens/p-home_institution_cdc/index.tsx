

import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, Modal, Alert, } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { FontAwesome5, FontAwesome6 } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import styles from './styles';

interface AlertModalData {
  area: string;
  cases: string;
  riskLevel: string;
  suggestion: string;
}

const HomeInstitutionCdcScreen = () => {
  const router = useRouter();
  const [isAlertModalVisible, setIsAlertModalVisible] = useState(false);
  const [alertModalData, setAlertModalData] = useState<AlertModalData>({
    area: '',
    cases: '',
    riskLevel: '',
    suggestion: '',
  });

  const handleNotificationPress = () => {
    console.log('显示通知列表');
    // 这里可以显示通知弹窗或跳转到通知页面
  };

  const handleProfilePress = () => {
    router.push('/p-user_profile');
  };

  const handleViewFullMap = () => {
    router.push('/p-epidemic_heatmap');
  };

  const handleViewAllAlerts = () => {
    router.push('/p-epidemic_heatmap');
  };

  const handlePolicyPublishPress = () => {
    router.push('/p-policy_publish');
  };

  const handleEpidemicReportPress = () => {
    console.log('生成疫情报告');
    // 这里可以跳转到报告生成页面或显示报告
  };

  const handleEmergencyContactPress = () => {
    console.log('紧急联系功能');
    // 这里可以显示联系列表或拨打电话
  };

  const handleResourceManagementPress = () => {
    console.log('物资管理功能');
    // 这里可以跳转到物资管理页面
  };

  const showAlertModal = (area: string, cases: string) => {
    let riskLevel = '一般';
    let suggestion = '密切关注，加强监测';
    
    if (parseInt(cases) >= 5) {
      riskLevel = '高风险';
      suggestion = '立即隔离病禽，进行实验室检测，全面消毒';
    } else if (parseInt(cases) >= 3) {
      riskLevel = '中风险';
      suggestion = '加强隔离措施，安排兽医检查';
    }
    
    setAlertModalData({
      area,
      cases: cases + '例',
      riskLevel,
      suggestion,
    });
    setIsAlertModalVisible(true);
  };

  const hideAlertModal = () => {
    setIsAlertModalVisible(false);
  };

  const handleModalIgnore = () => {
    hideAlertModal();
  };

  const handleModalHandle = () => {
    console.log('处理报警');
    hideAlertModal();
    // 这里可以跳转到处理页面或执行处理逻辑
  };

  const handleAlertMarkerPress = (area: string, cases: string) => {
    showAlertModal(area, cases);
  };

  const handleAlertActionPress = (area: string, cases: string) => {
    showAlertModal(area, cases);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* 顶部导航栏 */}
      <View style={styles.header}>
        <View style={styles.userInfo}>
          <Image
            source={{ uri: 'https://s.coze.cn/image/4r3pOJZ8MFg/' }}
            style={styles.userAvatar}
          />
          <View>
            <Text style={styles.userGreeting}>早上好，李医生</Text>
            <Text style={styles.userRole}>疫控机构</Text>
          </View>
        </View>
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.notificationButton} onPress={handleNotificationPress}>
            <FontAwesome6 name="bell" size={20} color="#6B7280" />
            <View style={styles.alertBadge} />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleProfilePress}>
            <FontAwesome5 name="user-circle" size={20} color="#6B7280" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* 疫情概览 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>疫情概览</Text>
          
          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <View style={styles.statContent}>
                <View>
                  <Text style={styles.statLabel}>今日病例</Text>
                  <Text style={styles.statValueOrange}>12</Text>
                </View>
                <View style={styles.statIconOrange}>
                  <FontAwesome6 name="triangle-exclamation" size={20} color="#EA580C" />
                </View>
              </View>
            </View>

            <View style={styles.statCard}>
              <View style={styles.statContent}>
                <View>
                  <Text style={styles.statLabel}>待处理报警</Text>
                  <Text style={styles.statValueRed}>3</Text>
                </View>
                <View style={styles.statIconRed}>
                  <FontAwesome6 name="bell" size={20} color="#DC2626" />
                </View>
              </View>
            </View>

            <View style={styles.statCard}>
              <View style={styles.statContent}>
                <View>
                  <Text style={styles.statLabel}>受影响区域</Text>
                  <Text style={styles.statValueBlue}>8</Text>
                </View>
                <View style={styles.statIconBlue}>
                  <FontAwesome6 name="location-dot" size={20} color="#2563EB" />
                </View>
              </View>
            </View>

            <View style={styles.statCard}>
              <View style={styles.statContent}>
                <View>
                  <Text style={styles.statLabel}>控制率</Text>
                  <Text style={styles.statValueGreen}>92%</Text>
                </View>
                <View style={styles.statIconGreen}>
                  <FontAwesome6 name="shield-halved" size={20} color="#059669" />
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* 疫情热力图 */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>疫情热力图</Text>
            <TouchableOpacity onPress={handleViewFullMap}>
              <Text style={styles.viewDetailText}>查看详情</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.mapContainer}>
            {/* 地图背景 */}
            <View style={styles.mapBackground}>
              <FontAwesome6 name="map" size={40} color="#60A5FA" />
              <Text style={styles.mapLabel}>辖区疫情分布</Text>
            </View>

            {/* 热力图覆盖层 */}
            <View style={[styles.heatmapOverlay, styles.heatmap1]} />
            <View style={[styles.heatmapOverlay, styles.heatmap2]} />
            <View style={[styles.heatmapOverlay, styles.heatmap3]} />

            {/* 报警标记点 */}
            <TouchableOpacity
              style={[styles.alertMarker, styles.alertMarker1]}
              onPress={() => handleAlertMarkerPress('东区养殖场', '5')}
            />
            <TouchableOpacity
              style={[styles.alertMarker, styles.alertMarker2]}
              onPress={() => handleAlertMarkerPress('南区合作社', '3')}
            />
            <TouchableOpacity
              style={[styles.alertMarker, styles.alertMarker3]}
              onPress={() => handleAlertMarkerPress('西区养殖基地', '4')}
            />

            {/* 正常标记点 */}
            <View style={[styles.normalMarker, styles.normalMarker1]} />
            <View style={[styles.normalMarker, styles.normalMarker2]} />
            <View style={[styles.normalMarker, styles.normalMarker3]} />
            <View style={[styles.normalMarker, styles.normalMarker4]} />
          </View>
        </View>

        {/* 最新报警信息 */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>最新报警</Text>
            <TouchableOpacity onPress={handleViewAllAlerts}>
              <Text style={styles.viewDetailText}>查看全部</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.alertsList}>
            <View style={[styles.alertItem, styles.alertItemHigh]}>
              <View style={styles.alertContent}>
                <View style={styles.alertHeader}>
                  <FontAwesome6 name="circle-exclamation" size={16} color="#EF4444" />
                  <Text style={styles.alertLevelHigh}>高风险报警</Text>
                </View>
                <Text style={styles.alertTitle}>东区养殖场爆发疑似禽流感</Text>
                <Text style={styles.alertDescription}>检测到5例疑似病例，建议立即隔离</Text>
                <View style={styles.alertMeta}>
                  <View style={styles.alertMetaItem}>
                    <FontAwesome6 name="location-dot" size={10} color="#6B7280" />
                    <Text style={styles.alertMetaText}>东区养殖场</Text>
                  </View>
                  <View style={styles.alertMetaItem}>
                    <FontAwesome6 name="clock" size={10} color="#6B7280" />
                    <Text style={styles.alertMetaText}>2小时前</Text>
                  </View>
                </View>
              </View>
              <TouchableOpacity
                style={styles.alertActionButton}
                onPress={() => handleAlertActionPress('东区养殖场', '5')}
              >
                <Text style={styles.alertActionText}>处理</Text>
              </TouchableOpacity>
            </View>

            <View style={[styles.alertItem, styles.alertItemMedium]}>
              <View style={styles.alertContent}>
                <View style={styles.alertHeader}>
                  <FontAwesome6 name="triangle-exclamation" size={16} color="#F97316" />
                  <Text style={styles.alertLevelMedium}>中风险报警</Text>
                </View>
                <Text style={styles.alertTitle}>南区合作社异常死亡增加</Text>
                <Text style={styles.alertDescription}>死淘率较往日上升15%，需关注</Text>
                <View style={styles.alertMeta}>
                  <View style={styles.alertMetaItem}>
                    <FontAwesome6 name="location-dot" size={10} color="#6B7280" />
                    <Text style={styles.alertMetaText}>南区合作社</Text>
                  </View>
                  <View style={styles.alertMetaItem}>
                    <FontAwesome6 name="clock" size={10} color="#6B7280" />
                    <Text style={styles.alertMetaText}>4小时前</Text>
                  </View>
                </View>
              </View>
              <TouchableOpacity
                style={styles.alertActionButtonMedium}
                onPress={() => handleAlertActionPress('南区合作社', '3')}
              >
                <Text style={styles.alertActionTextMedium}>查看</Text>
              </TouchableOpacity>
            </View>

            <View style={[styles.alertItem, styles.alertItemLow]}>
              <View style={styles.alertContent}>
                <View style={styles.alertHeader}>
                  <FontAwesome6 name="circle-info" size={16} color="#EAB308" />
                  <Text style={styles.alertLevelLow}>一般提醒</Text>
                </View>
                <Text style={styles.alertTitle}>西区养殖基地疫苗接种提醒</Text>
                <Text style={styles.alertDescription}>定期疫苗接种时间已到，建议安排</Text>
                <View style={styles.alertMeta}>
                  <View style={styles.alertMetaItem}>
                    <FontAwesome6 name="location-dot" size={10} color="#6B7280" />
                    <Text style={styles.alertMetaText}>西区养殖基地</Text>
                  </View>
                  <View style={styles.alertMetaItem}>
                    <FontAwesome6 name="clock" size={10} color="#6B7280" />
                    <Text style={styles.alertMetaText}>6小时前</Text>
                  </View>
                </View>
              </View>
              <TouchableOpacity
                style={styles.alertActionButtonLow}
                onPress={() => handleAlertActionPress('西区养殖基地', '4')}
              >
                <Text style={styles.alertActionTextLow}>安排</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* 快捷功能 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>快捷功能</Text>
          
          <View style={styles.functionsGrid}>
            <TouchableOpacity style={styles.functionCard} onPress={handlePolicyPublishPress}>
              <View style={styles.functionContent}>
                <View style={styles.functionIconBlue}>
                  <FontAwesome6 name="bullhorn" size={20} color="#2563EB" />
                </View>
                <View>
                  <Text style={styles.functionTitle}>政策下发</Text>
                  <Text style={styles.functionDescription}>发布防疫通知</Text>
                </View>
              </View>
            </TouchableOpacity>

            <TouchableOpacity style={styles.functionCard} onPress={handleEpidemicReportPress}>
              <View style={styles.functionContent}>
                <View style={styles.functionIconPurple}>
                  <FontAwesome6 name="chart-line" size={20} color="#7C3AED" />
                </View>
                <View>
                  <Text style={styles.functionTitle}>疫情报告</Text>
                  <Text style={styles.functionDescription}>生成统计报告</Text>
                </View>
              </View>
            </TouchableOpacity>

            <TouchableOpacity style={styles.functionCard} onPress={handleEmergencyContactPress}>
              <View style={styles.functionContent}>
                <View style={styles.functionIconRed}>
                  <FontAwesome6 name="phone" size={20} color="#DC2626" />
                </View>
                <View>
                  <Text style={styles.functionTitle}>紧急联系</Text>
                  <Text style={styles.functionDescription}>快速联系专家</Text>
                </View>
              </View>
            </TouchableOpacity>

            <TouchableOpacity style={styles.functionCard} onPress={handleResourceManagementPress}>
              <View style={styles.functionContent}>
                <View style={styles.functionIconGreen}>
                  <FontAwesome6 name="warehouse" size={20} color="#059669" />
                </View>
                <View>
                  <Text style={styles.functionTitle}>物资管理</Text>
                  <Text style={styles.functionDescription}>疫苗药品库存</Text>
                </View>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* 报警详情弹窗 */}
      <Modal
        visible={isAlertModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={hideAlertModal}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={hideAlertModal}
        >
          <TouchableOpacity
            style={styles.modalContent}
            activeOpacity={1}
            onPress={() => {}}
          >
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>报警详情</Text>
              <TouchableOpacity onPress={hideAlertModal}>
                <FontAwesome6 name="xmark" size={20} color="#6B7280" />
              </TouchableOpacity>
            </View>
            
            <View style={styles.modalBody}>
              <View style={styles.modalItem}>
                <Text style={styles.modalLabel}>区域</Text>
                <Text style={styles.modalValue}>{alertModalData.area}</Text>
              </View>
              <View style={styles.modalItem}>
                <Text style={styles.modalLabel}>病例数</Text>
                <Text style={styles.modalValueOrange}>{alertModalData.cases}</Text>
              </View>
              <View style={styles.modalItem}>
                <Text style={styles.modalLabel}>风险等级</Text>
                <Text style={[
                  styles.modalValue,
                  alertModalData.riskLevel === '高风险' && styles.modalValueRed,
                  alertModalData.riskLevel === '中风险' && styles.modalValueOrange,
                  alertModalData.riskLevel === '一般' && styles.modalValueYellow,
                ]}>
                  {alertModalData.riskLevel}
                </Text>
              </View>
              <View style={styles.modalItem}>
                <Text style={styles.modalLabel}>建议措施</Text>
                <Text style={styles.modalSuggestion}>{alertModalData.suggestion}</Text>
              </View>
            </View>
            
            <View style={styles.modalActions}>
              <TouchableOpacity style={styles.modalButtonIgnore} onPress={handleModalIgnore}>
                <Text style={styles.modalButtonIgnoreText}>忽略</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalButtonHandle} onPress={handleModalHandle}>
                <Text style={styles.modalButtonHandleText}>处理</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  );
};

export default HomeInstitutionCdcScreen;

