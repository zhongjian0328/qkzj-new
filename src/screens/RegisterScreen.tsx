import React, { useState } from 'react';
import { View, Text, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../context/UserContext';
import { Ionicons } from '@expo/vector-icons';
import Button from '../components/Button';
import Input from '../components/Input';
import Card from '../components/Card';
import { styles } from '../styles';
import { authApi } from '../services/api';

const RegisterScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const { state } = useAuth();
  // 注册功能将通过API直接调用，而不是通过context提供的方法
  
  const [phoneNumber, setPhoneNumber] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [nickname, setNickname] = useState('');
  const [roleType, setRoleType] = useState<'FARMER' | 'STUDENT' | 'VETERINARIAN'>('FARMER');
  const [countdown, setCountdown] = useState(0);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    
    if (!phoneNumber) {
      newErrors.phoneNumber = '请输入手机号';
    } else if (!/^1[3-9]\d{9}$/.test(phoneNumber)) {
      newErrors.phoneNumber = '请输入正确的手机号';
    }
    
    if (!verificationCode) {
      newErrors.verificationCode = '请输入验证码';
    } else if (verificationCode.length !== 6) {
      newErrors.verificationCode = '请输入6位验证码';
    }
    
    if (!password) {
      newErrors.password = '请输入密码';
    } else if (password.length < 6) {
      newErrors.password = '密码长度不能少于6位';
    }
    
    if (!confirmPassword) {
      newErrors.confirmPassword = '请确认密码';
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = '两次输入的密码不一致';
    }
    
    if (!nickname) {
      newErrors.nickname = '请输入昵称';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSendCode = async () => {
    if (!phoneNumber || !/^1[3-9]\d{9}$/.test(phoneNumber)) {
      setErrors({ phoneNumber: '请输入正确的手机号' });
      return;
    }
    
    try {
      setLoading(true);
      // 调用发送验证码API
      // await api.sendVerificationCode(phoneNumber);
      
      // 模拟倒计时
      setCountdown(60);
      const timer = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      
      setErrors({});
    } catch (error) {
      setErrors({ general: '发送验证码失败，请稍后重试' });
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async () => {
    if (!validateForm()) {
      return;
    }
    
    try {
      setLoading(true);
      
      // 调用注册API
      const response = await authApi.register({
        phoneNumber,
        password,
        roleType,
        subRole: 'SMALL' // 默认子角色，根据实际情况调整
      });
      
      // 注册成功，导航到登录页面
      navigation.navigate('Login');
    } catch (error) {
      setErrors({ general: '注册失败，请稍后重试' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Logo和产品名称 */}
        <View style={[styles.loginLogoSection, { marginBottom: 24 }]}>
          <View style={styles.loginLogoContainer}>
            <Ionicons name="medical-outline" size={48} color="#2DBBA1" />
          </View>
          <Text style={styles.loginAppTitle}>禽康智检</Text>
          <Text style={styles.loginAppSubtitle}>AI赋能禽类健康诊断</Text>
        </View>
        
        <Card style={styles.registerCard}>
          <Text style={styles.cardTitle}>用户注册</Text>
          
          {/* 手机号输入 */}
          <Input
            label="手机号"
            value={phoneNumber}
            onChangeText={setPhoneNumber}
            keyboardType="phone-pad"
            placeholder="请输入手机号"
            error={errors.phoneNumber}
            style={styles.input}
          />
          
          {/* 验证码输入 */}
          <View style={styles.verificationContainer}>
            <Input
              label="验证码"
              value={verificationCode}
              onChangeText={setVerificationCode}
              keyboardType="number-pad"
              placeholder="请输入验证码"
              error={errors.verificationCode}
              style={styles.verificationInput}
            />
            <TouchableOpacity 
              style={[
                styles.codeButton, 
                countdown > 0 && styles.codeButtonDisabled
              ]}
              onPress={handleSendCode}
              disabled={countdown > 0}
            >
              <Text style={styles.codeButtonText}>
                {countdown > 0 ? `${countdown}s后重发` : '获取验证码'}
              </Text>
            </TouchableOpacity>
          </View>
          
          {/* 密码输入 */}
          <Input
            label="密码"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            placeholder="请设置密码"
            error={errors.password}
            style={styles.input}
          />
          
          {/* 确认密码输入 */}
          <Input
            label="确认密码"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
            placeholder="请确认密码"
            error={errors.confirmPassword}
            style={styles.input}
          />
          
          {/* 昵称输入 */}
          <Input
            label="昵称"
            value={nickname}
            onChangeText={setNickname}
            placeholder="请输入昵称"
            error={errors.nickname}
            style={styles.input}
          />
          
          {/* 角色选择 */}
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>用户角色</Text>
            <View style={styles.roleContainer}>
              <TouchableOpacity 
                style={[
                  styles.roleButton, 
                  roleType === 'FARMER' && styles.roleButtonActive
                ]}
                onPress={() => setRoleType('FARMER')}
              >
                <Text 
                  style={[
                    styles.roleButtonText, 
                    roleType === 'FARMER' && styles.roleButtonTextActive
                  ]}
                >
                  养殖户
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[
                  styles.roleButton, 
                  roleType === 'STUDENT' && styles.roleButtonActive
                ]}
                onPress={() => setRoleType('STUDENT')}
              >
                <Text 
                  style={[
                    styles.roleButtonText, 
                    roleType === 'STUDENT' && styles.roleButtonTextActive
                  ]}
                >
                  学生
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[
                  styles.roleButton, 
                  roleType === 'VETERINARIAN' && styles.roleButtonActive
                ]}
                onPress={() => setRoleType('VETERINARIAN')}
              >
                <Text 
                  style={[
                    styles.roleButtonText, 
                    roleType === 'VETERINARIAN' && styles.roleButtonTextActive
                  ]}
                >
                  兽医
                </Text>
              </TouchableOpacity>
            </View>
          </View>
          
          {/* 错误提示 */}
          {errors.general && (
            <Text style={styles.errorText}>{errors.general}</Text>
          )}
          
          {/* 注册按钮 */}
          <Button 
            title="注册" 
            onPress={handleRegister} 
            loading={loading}
            style={styles.registerButton}
            variant="primary"
            size="large"
          />
          
          {/* 已有账号，去登录 */}
          <View style={styles.loginLinkContainer}>
            <Text style={styles.loginLinkText}>已有账号？</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
              <Text style={styles.loginLink}>
                立即登录
              </Text>
            </TouchableOpacity>
          </View>
        </Card>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default RegisterScreen;
