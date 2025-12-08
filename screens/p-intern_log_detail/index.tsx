

import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity, Alert, Modal, Image, Platform, } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { FontAwesome6 } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import styles from './styles';

interface LogData {
  date: string;
  content: string;
  studentDiagnosis: string;
  status: string;
  images: string[];
  mentorComment?: {
    name: string;
    avatar: string;
    content: string;
    time: string;
  };
}

interface SuccessModalProps {
  visible: boolean;
  title: string;
  message: string;
  onClose: () => void;
}

const SuccessModal: React.FC<SuccessModalProps> = ({ visible, title, message, onClose }) => {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalIconContainer}>
            <FontAwesome6 name="check" size={24} color="#10B981" />
          </View>
          <Text style={styles.modalTitle}>{title}</Text>
          <Text style={styles.modalMessage}>{message}</Text>
          <TouchableOpacity style={styles.modalButton} onPress={onClose}>
            <Text style={styles.modalButtonText}>确定</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const InternLogDetailScreen: React.FC = () => {
  const router = useRouter();
  const { logId } = useLocalSearchParams<{ logId?: string }>();

  // 状态管理
  const [logDate, setLogDate] = useState<string>('');
  const [internshipContent, setInternshipContent] = useState<string>('');
  const [studentDiagnosis, setStudentDiagnosis] = useState<string>('');
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [logStatus, setLogStatus] = useState<string>('草稿');
  const [aiDiagnosisText, setAiDiagnosisText] = useState<string>('点击"获取AI诊断"按钮，上传图片后可获得AI辅助诊断建议');
  const [mentorComment, setMentorComment] = useState<LogData['mentorComment']>(undefined);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [isGeneratingReport, setIsGeneratingReport] = useState<boolean>(false);
  const [isGettingAiDiagnosis, setIsGettingAiDiagnosis] = useState<boolean>(false);
  const [isSuccessModalVisible, setIsSuccessModalVisible] = useState<boolean>(false);
  const [modalTitle, setModalTitle] = useState<string>('');
  const [modalMessage, setModalMessage] = useState<string>('');

  // 模拟日志数据
  const mockLogs: Record<string, LogData> = {
    'log1': {
      date: '2024-01-15',
      content: '今天跟随导师在养鸡场进行实践学习，主要观察了鸡群的健康状况。发现几只鸡出现呼吸道症状，羽毛蓬松，精神不振。在导师指导下，学习了如何进行初步诊断和采样。',
      studentDiagnosis: '根据症状观察，初步判断可能是新城疫，表现为呼吸道症状和精神萎靡。需要进一步实验室检测确认。',
      status: '已提交',
      images: [
        'https://s.coze.cn/image/cYzixtViExo/',
        'https://s.coze.cn/image/KV7bcHUj8NU/'
      ],
      mentorComment: {
        name: '张教授',
        avatar: 'https://s.coze.cn/image/o_A3b7feAUw/',
        content: '诊断判断基本正确，观察仔细。建议在描述中增加更多细节，如体温、粪便状况等。继续保持！',
        time: '2024-01-15 16:30'
      }
    },
    'log2': {
      date: '2024-01-14',
      content: '今天学习了禽类常见疾病的鉴别诊断方法，重点研究了禽流感和新城疫的区别。',
      studentDiagnosis: '通过学习，我掌握了禽流感和新城疫的主要鉴别要点：禽流感通常伴有消化道症状，而新城疫以呼吸道症状为主。',
      status: '草稿',
      images: [],
      mentorComment: undefined
    }
  };

  // 初始化页面数据
  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    
    if (logId && mockLogs[logId]) {
      const log = mockLogs[logId];
      setLogDate(log.date);
      setInternshipContent(log.content);
      setStudentDiagnosis(log.studentDiagnosis);
      setLogStatus(log.status);
      setUploadedImages(log.images);
      setMentorComment(log.mentorComment);
    } else {
      setLogDate(today);
    }
  }, [logId]);

  // 返回按钮处理
  const handleBackPress = () => {
    if (router.canGoBack()) {
      router.back();
    }
  };

  // 图片上传处理
  const handleImageUpload = async () => {
    if (uploadedImages.length >= 6) {
      Alert.alert('提示', '最多只能上传6张图片');
      return;
    }

    try {
      // 请求媒体库权限
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('权限不足', '需要访问相册权限才能上传图片');
        return;
      }

      // 选择图片
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsMultipleSelection: true,
        quality: 0.8,
        selectionLimit: 6 - uploadedImages.length,
      });

      if (!result.canceled && result.assets) {
        const newImages = result.assets.map(asset => asset.uri);
        setUploadedImages(prev => [...prev, ...newImages]);
      }
    } catch (error) {
      Alert.alert('错误', '上传图片失败，请重试');
    }
  };

  // 拍照处理
  const handleTakePhoto = async () => {
    if (uploadedImages.length >= 6) {
      Alert.alert('提示', '最多只能上传6张图片');
      return;
    }

    try {
      // 请求相机权限
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('权限不足', '需要访问相机权限才能拍照');
        return;
      }

      // 拍照
      const result = await ImagePicker.launchCameraAsync({
        quality: 0.8,
      });

      if (!result.canceled && result.assets) {
        const newImages = result.assets.map(asset => asset.uri);
        setUploadedImages(prev => [...prev, ...newImages]);
      }
    } catch (error) {
      Alert.alert('错误', '拍照失败，请重试');
    }
  };

  // 图片上传区域点击处理
  const handleUploadAreaPress = () => {
    Alert.alert(
      '选择图片',
      '请选择获取图片的方式',
      [
        { text: '取消', style: 'cancel' },
        { text: '拍照', onPress: handleTakePhoto },
        { text: '从相册选择', onPress: handleImageUpload },
      ]
    );
  };

  // 删除图片
  const handleRemoveImage = (imageUrl: string) => {
    setUploadedImages(prev => prev.filter(url => url !== imageUrl));
  };

  // 获取AI诊断
  const handleGetAiDiagnosis = async () => {
    if (uploadedImages.length === 0) {
      Alert.alert('提示', '请先上传病例图片');
      return;
    }

    setIsGettingAiDiagnosis(true);
    
    try {
      // 模拟AI诊断过程
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const aiResult = 'AI诊断结果：新城疫（置信度95%）。建议：立即隔离病禽，进行紧急免疫接种，加强消毒措施。';
      setAiDiagnosisText(aiResult);
      
      showSuccessModal('AI诊断完成', '已为您生成AI辅助诊断建议');
    } catch (error) {
      Alert.alert('错误', 'AI诊断失败，请重试');
    } finally {
      setIsGettingAiDiagnosis(false);
    }
  };

  // 提交日志
  const handleSubmitLog = async () => {
    if (!internshipContent.trim()) {
      Alert.alert('提示', '请填写实习内容');
      return;
    }

    if (!studentDiagnosis.trim()) {
      Alert.alert('提示', '请填写诊断判断');
      return;
    }

    setIsSubmitting(true);

    try {
      // 模拟提交过程
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setLogStatus('已提交');
      showSuccessModal('提交成功', '日志已成功提交给导师', () => {
        router.back();
      });
    } catch (error) {
      Alert.alert('错误', '提交失败，请重试');
    } finally {
      setIsSubmitting(false);
    }
  };

  // 保存草稿
  const handleSaveDraft = async () => {
    setIsSaving(true);

    try {
      // 模拟保存过程
      await new Promise(resolve => setTimeout(resolve, 1000));
      showSuccessModal('保存成功', '草稿已保存');
    } catch (error) {
      Alert.alert('错误', '保存失败，请重试');
    } finally {
      setIsSaving(false);
    }
  };

  // 生成实习报告
  const handleGenerateReport = async () => {
    setIsGeneratingReport(true);

    try {
      // 模拟生成报告过程
      await new Promise(resolve => setTimeout(resolve, 2000));
      showSuccessModal('报告生成成功', '实习报告已生成，可在"我的报告"中查看');
    } catch (error) {
      Alert.alert('错误', '生成报告失败，请重试');
    } finally {
      setIsGeneratingReport(false);
    }
  };

  // 显示成功模态框
  const showSuccessModal = (title: string, message: string, callback?: () => void) => {
    setModalTitle(title);
    setModalMessage(message);
    setIsSuccessModalVisible(true);
    
    if (callback) {
      setTimeout(() => {
        setIsSuccessModalVisible(false);
        callback();
      }, 1500);
    }
  };

  // 关闭模态框
  const handleCloseModal = () => {
    setIsSuccessModalVisible(false);
  };

  // 获取状态样式
  const getStatusStyle = (status: string) => {
    switch (status) {
      case '已提交':
        return styles.statusSubmitted;
      case '已批注':
        return styles.statusApproved;
      default:
        return styles.statusDraft;
    }
  };

  // 获取状态文本样式
  const getStatusTextStyle = (status: string) => {
    switch (status) {
      case '已提交':
        return styles.statusSubmittedText;
      case '已批注':
        return styles.statusApprovedText;
      default:
        return styles.statusDraftText;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* 顶部导航栏 */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleBackPress}>
          <FontAwesome6 name="arrow-left" size={20} color="#6B7280" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>实习日志详情</Text>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* 日志基本信息 */}
        <View style={styles.section}>
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardLabel}>实习日期</Text>
              <View style={[styles.statusBadge, getStatusStyle(logStatus)]}>
                <Text style={[styles.statusText, getStatusTextStyle(logStatus)]}>{logStatus}</Text>
              </View>
            </View>
            <TextInput
              style={styles.dateInput}
              value={logDate}
              onChangeText={setLogDate}
              placeholder="选择日期"
              placeholderTextColor="#9CA3AF"
            />
          </View>
        </View>

        {/* 实习内容 */}
        <View style={styles.section}>
          <View style={styles.card}>
            <Text style={styles.cardLabel}>实习内容</Text>
            <TextInput
              style={styles.textArea}
              value={internshipContent}
              onChangeText={setInternshipContent}
              placeholder="请详细描述今天的实习内容、观察到的病例情况、学习到的知识等..."
              placeholderTextColor="#9CA3AF"
              multiline
              numberOfLines={6}
              textAlignVertical="top"
            />
          </View>
        </View>

        {/* 病例图片上传 */}
        <View style={styles.section}>
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardLabel}>病例图片</Text>
              <Text style={styles.imageCount}>{uploadedImages.length}/6</Text>
            </View>

            {/* 图片预览 */}
            {uploadedImages.length > 0 && (
              <View style={styles.imagePreviewContainer}>
                {uploadedImages.map((imageUrl, index) => (
                  <View key={index} style={styles.imagePreviewWrapper}>
                    <Image source={{ uri: imageUrl }} style={styles.imagePreview} />
                    <TouchableOpacity
                      style={styles.removeImageButton}
                      onPress={() => handleRemoveImage(imageUrl)}
                    >
                      <FontAwesome6 name="xmark" size={12} color="#FFFFFF" />
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            )}

            {/* 上传区域 */}
            {uploadedImages.length < 6 && (
              <TouchableOpacity style={styles.uploadArea} onPress={handleUploadAreaPress}>
                <View style={styles.uploadIconContainer}>
                  <FontAwesome6 name="camera" size={20} color="#3BCCA5" />
                </View>
                <Text style={styles.uploadText}>点击上传图片</Text>
                <Text style={styles.uploadSubText}>支持拍照或从相册选择，最多6张</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* 学生诊断判断 */}
        <View style={styles.section}>
          <View style={styles.card}>
            <Text style={styles.cardLabel}>我的诊断判断</Text>
            <TextInput
              style={styles.textArea}
              value={studentDiagnosis}
              onChangeText={setStudentDiagnosis}
              placeholder="根据观察到的症状，你的初步诊断是什么？"
              placeholderTextColor="#9CA3AF"
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
          </View>
        </View>

        {/* AI参考诊断 */}
        <View style={styles.section}>
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardLabel}>AI参考诊断</Text>
              <TouchableOpacity
                onPress={handleGetAiDiagnosis}
                disabled={isGettingAiDiagnosis}
              >
                <Text style={styles.aiButtonText}>
                  {isGettingAiDiagnosis ? 'AI分析中...' : '获取AI诊断'}
                </Text>
              </TouchableOpacity>
            </View>
            <View style={styles.aiDiagnosisContainer}>
              <View style={styles.aiDiagnosisHeader}>
                <FontAwesome6 name="robot" size={16} color="#3BCCA5" />
                <Text style={styles.aiDiagnosisTitle}>AI诊断结果</Text>
              </View>
              <Text style={styles.aiDiagnosisText}>{aiDiagnosisText}</Text>
            </View>
          </View>
        </View>

        {/* 导师批注区 */}
        <View style={styles.section}>
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardLabel}>导师批注</Text>
              <Text style={styles.commentStatus}>
                {mentorComment ? '已批注' : '待批注'}
              </Text>
            </View>
            {mentorComment ? (
              <View style={styles.mentorCommentContainer}>
                <View style={styles.mentorInfo}>
                  <Image source={{ uri: mentorComment.avatar }} style={styles.mentorAvatar} />
                  <View style={styles.mentorDetails}>
                    <Text style={styles.mentorName}>{mentorComment.name}</Text>
                    <Text style={styles.commentTime}>{mentorComment.time}</Text>
                  </View>
                </View>
                <Text style={styles.commentText}>{mentorComment.content}</Text>
              </View>
            ) : (
              <View style={styles.emptyCommentContainer}>
                <Text style={styles.emptyCommentText}>导师尚未进行批注</Text>
              </View>
            )}
          </View>
        </View>

        {/* 操作按钮区 */}
        <View style={styles.actionButtonsContainer}>
          <TouchableOpacity
            style={styles.submitButton}
            onPress={handleSubmitLog}
            disabled={isSubmitting}
          >
            <FontAwesome6 name="paper-plane" size={16} color="#FFFFFF" />
            <Text style={styles.submitButtonText}>
              {isSubmitting ? '提交中...' : '提交日志'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.saveButton}
            onPress={handleSaveDraft}
            disabled={isSaving}
          >
            <FontAwesome6 name="floppy-disk" size={16} color="#1F2937" />
            <Text style={styles.saveButtonText}>
              {isSaving ? '保存中...' : '保存草稿'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.reportButton}
            onPress={handleGenerateReport}
            disabled={isGeneratingReport}
          >
            <FontAwesome6 name="file-lines" size={16} color="#FFFFFF" />
            <Text style={styles.reportButtonText}>
              {isGeneratingReport ? '生成中...' : '生成实习报告'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* 成功提示模态框 */}
      <SuccessModal
        visible={isSuccessModalVisible}
        title={modalTitle}
        message={modalMessage}
        onClose={handleCloseModal}
      />
    </SafeAreaView>
  );
};

export default InternLogDetailScreen;

