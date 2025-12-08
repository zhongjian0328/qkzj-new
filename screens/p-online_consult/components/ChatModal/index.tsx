

import React, { useState, useRef, useCallback } from 'react';
import { View, Text, TouchableOpacity, Modal, Image, TextInput, ScrollView, KeyboardAvoidingView, Platform, } from 'react-native';
import { FontAwesome6 } from '@expo/vector-icons';
import { ChatModalProps } from '../../types';
import styles from './styles';

interface ChatMessage {
  id: string;
  text: string;
  isOwn: boolean;
  timestamp: Date;
}

const ChatModal: React.FC<ChatModalProps> = ({
  visible,
  consultation,
  onClose,
}) => {
  const [messageInputText, setMessageInputText] = useState('');
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      text: '您好，我的鸡群出现了一些问题...',
      isOwn: false,
      timestamp: new Date(),
    },
    {
      id: '2',
      text: '请详细描述一下症状',
      isOwn: true,
      timestamp: new Date(),
    },
  ]);

  const scrollViewRef = useRef<ScrollView>(null);
  const textInputRef = useRef<TextInput>(null);

  if (!consultation) return null;

  const { user } = consultation;

  const handleSendMessage = useCallback(() => {
    if (messageInputText.trim()) {
      const newMessage: ChatMessage = {
        id: Date.now().toString(),
        text: messageInputText.trim(),
        isOwn: true,
        timestamp: new Date(),
      };

      setChatMessages(prevMessages => [...prevMessages, newMessage]);
      setMessageInputText('');
      textInputRef.current?.blur();

      // 滚动到底部
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messageInputText]);

  const handleBackPress = useCallback(() => {
    onClose();
  }, [onClose]);

  const renderMessage = useCallback((message: ChatMessage) => (
    <View
      key={message.id}
      style={[
        styles.messageContainer,
        message.isOwn ? styles.ownMessageContainer : styles.otherMessageContainer,
      ]}
    >
      <View
        style={[
          styles.messageBubble,
          message.isOwn ? styles.ownMessageBubble : styles.otherMessageBubble,
        ]}
      >
        <Text
          style={[
            styles.messageText,
            message.isOwn ? styles.ownMessageText : styles.otherMessageText,
          ]}
        >
          {message.text}
        </Text>
      </View>
    </View>
  ), []);

  return (
    <Modal
      visible={visible}
      transparent={false}
      animationType="slide"
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        {/* 聊天头部 */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={handleBackPress}>
            <FontAwesome6 name="arrow-left" size={20} color="#6B7280" />
          </TouchableOpacity>
          <Image source={{ uri: user.avatar }} style={styles.userAvatar} />
          <View style={styles.userInfo}>
            <Text style={styles.userName}>{user.name}</Text>
            <Text style={styles.userStatus}>在线</Text>
          </View>
        </View>

        {/* 聊天消息区域 */}
        <ScrollView
          ref={scrollViewRef}
          style={styles.messagesContainer}
          contentContainerStyle={styles.messagesContent}
          showsVerticalScrollIndicator={false}
        >
          {chatMessages.map(renderMessage)}
        </ScrollView>

        {/* 输入区域 */}
        <View style={styles.inputContainer}>
          <View style={styles.inputWrapper}>
            <TextInput
              ref={textInputRef}
              style={styles.textInput}
              placeholder="输入消息..."
              placeholderTextColor="#9CA3AF"
              value={messageInputText}
              onChangeText={setMessageInputText}
              multiline
              onSubmitEditing={handleSendMessage}
              returnKeyType="send"
            />
            <TouchableOpacity style={styles.sendButton} onPress={handleSendMessage}>
              <FontAwesome6 name="paper-plane" size={16} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

export default ChatModal;

