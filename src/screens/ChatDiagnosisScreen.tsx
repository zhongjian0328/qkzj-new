import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, Image, KeyboardAvoidingView, Platform, ActivityIndicator, ScrollView, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../context/UserContext';
import Header from '../components/Header';
import { styles } from '../styles';
import { aiDiagnosisApi } from '../services/api';
import * as ImagePicker from 'expo-image-picker';

interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  message: string;
  timestamp: Date;
  imageUrls?: string[];
}

const ChatDiagnosisScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const { state } = useAuth();
  const { user } = state;
  
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'ai',
      message: '您好！我是禽康智检的AI助手，很高兴为您服务。请描述您遇到的问题，或者上传病禽图片，我会尽力为您提供诊断建议。',
      timestamp: new Date()
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    // 滚动到底部
    flatListRef.current?.scrollToEnd({ animated: true });
  }, [messages]);

  const sendMessage = async () => {
    if (!inputText.trim() && imageUrls.length === 0) return;
    
    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      message: inputText.trim(),
      timestamp: new Date(),
      imageUrls: [...imageUrls]
    };
    
    setMessages(prev => [...prev, newMessage]);
    setInputText('');
    setImageUrls([]);
    setLoading(true);
    
    try {
      // 调用AI聊天诊断API
      const response = await aiDiagnosisApi.chatDiagnosis({
        message: inputText.trim(),
        imageUrls: imageUrls,
        history: messages.map(m => ({
          sender: m.sender,
          message: m.message,
          timestamp: m.timestamp
        }))
      });
      
      // 模拟AI思考过程，提升用户体验
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const aiResponse: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        message: typeof response === 'string' ? response : response.data.result || JSON.stringify(response.data),
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, aiResponse]);
    } catch (error: any) {
      console.error('聊天诊断失败:', error);
      let errorMessageText = '抱歉，诊断服务暂时不可用，请稍后重试。';
      
      // 更详细的错误提示
      if (error.response?.data?.message) {
        errorMessageText = error.response.data.message;
      } else if (error.message) {
        errorMessageText = error.message;
      }
      
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        message: errorMessageText,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const renderMessage = ({ item }: { item: ChatMessage }) => {
    const isUser = item.sender === 'user';
    
    return (
      <View style={[styles.chatMessageRow, isUser ? styles.chatUserMessageRow : styles.chatAiMessageRow]}>
        {!isUser && (
          <View style={styles.chatAiAvatar}>
            <Text style={{ fontSize: 24 }}>🤖</Text>
          </View>
        )}
        <View style={[styles.chatMessageBubble, isUser ? styles.chatUserMessageBubble : styles.chatAiMessageBubble]}>
          {!isUser && (
            <View style={styles.chatAiHeader}>
              <Text style={styles.chatAiName}>AI助手</Text>
            </View>
          )}
          {item.imageUrls && item.imageUrls.length > 0 && (
            <View style={styles.chatMessageImages}>
              {item.imageUrls.map((url, index) => (
                <Image 
                  key={index} 
                  source={{ uri: url }} 
                  style={styles.chatMessageImage}
                  resizeMode="cover"
                />
              ))}
            </View>
          )}
          <Text style={[styles.chatMessageText, isUser ? styles.chatUserMessageText : styles.chatAiMessageText]}>
            {item.message}
          </Text>
          <Text style={styles.chatMessageTimestamp}>
            {new Date(item.timestamp).toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })}
          </Text>
        </View>
        {isUser && (
          <View style={styles.chatUserAvatar}>
            <Text style={{ fontSize: 24 }}>👤</Text>
          </View>
        )}
      </View>
    );
  };

  const pickImage = async () => {
    // 请求权限
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (status !== 'granted') {
      Alert.alert('权限不足', '需要访问相册权限才能上传图片');
      return;
    }
    
    // 打开图片选择器
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });
    
    if (!result.canceled && result.assets[0]) {
      setImageUrls(prev => [...prev, result.assets[0].uri]);
    }
  };

  const removeImage = (index: number) => {
    setImageUrls(prev => prev.filter((_, i) => i !== index));
  };

  const toggleVoiceInput = () => {
    // 实现语音输入逻辑
    console.log('语音输入');
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <Header title="AI对话问诊" />
      
      {/* 聊天内容 */}
      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderMessage}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.chatMessagesContainer}
        showsVerticalScrollIndicator={false}
      />
      
      {/* 图像预览 */}
      {imageUrls.length > 0 && (
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={styles.chatImagePreviewContainer}
          contentContainerStyle={styles.chatImagePreviewList}
        >
          {imageUrls.map((url, index) => (
            <View key={index} style={styles.chatImagePreviewWrapper}>
              <Image 
                source={{ uri: url }} 
                style={styles.chatImagePreview}
                resizeMode="cover"
              />
              <TouchableOpacity 
                style={styles.chatRemoveImageButton}
                onPress={() => removeImage(index)}
              >
                <Text style={styles.chatRemoveImageText}>×</Text>
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>
      )}
      
      {/* 输入区域 */}
      <View style={styles.chatInputArea}>
        {/* 功能按钮 */}
        <View style={styles.chatFunctionButtons}>
          {/* 图片上传按钮 */}
          <TouchableOpacity 
            style={styles.chatFunctionButton} 
            onPress={pickImage}
          >
            <Text style={styles.chatFunctionButtonIcon}>📷</Text>
          </TouchableOpacity>
          
          {/* 语音输入按钮 */}
          <TouchableOpacity 
            style={styles.chatFunctionButton} 
            onPress={toggleVoiceInput}
          >
            <Text style={styles.chatFunctionButtonIcon}>🎤</Text>
          </TouchableOpacity>
        </View>
        
        {/* 消息输入框 */}
        <TextInput
          style={styles.chatMessageInput}
          value={inputText}
          onChangeText={setInputText}
          placeholder="请描述症状或输入问题..."
          multiline
          maxLength={500}
          textAlignVertical="bottom"
        />
        
        {/* 发送按钮 */}
        <TouchableOpacity 
          style={styles.chatSendButton} 
          onPress={sendMessage}
          disabled={(!inputText.trim() && imageUrls.length === 0) || loading}
        >
          {loading ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <Text style={styles.chatSendButtonIcon}>➤</Text>
          )}
        </TouchableOpacity>
      </View>
      
      {loading && (
        <View style={styles.chatTypingIndicator}>
          <ActivityIndicator size="small" color="#2DBBA1" />
          <Text style={styles.chatTypingText}>AI正在思考...</Text>
        </View>
      )}
    </KeyboardAvoidingView>
  );
};

export default ChatDiagnosisScreen;
