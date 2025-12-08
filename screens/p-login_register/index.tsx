

import React, { useState, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert, Platform, } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { FontAwesome6 } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import styles from './styles';
import { loginApi, registerApi, sendCodeApi, saveUserInfo } from '../../src/services/api';

interface FormData {
  phone: string;
  code: string;
  password: string;
  confirmPassword: string;
}

const LoginRegisterScreen = () => {
  const router = useRouter();
  
  // 表单状态
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');
  const [loginFormData, setLoginFormData] = useState<FormData>({
    phone: '',
    code: '',
    password: '',
    confirmPassword: '',
  });
  const [registerFormData, setRegisterFormData] = useState<FormData>({
    phone: '',
    code: '',
    password: '',
    confirmPassword: '',
  });
  
  // UI状态
  const [isRegisterPasswordVisible, setIsRegisterPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState(false);
  const [isToastVisible, setIsToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  // 验证码倒计时状态
  const [loginCountdown, setLoginCountdown] = useState(0);
  const [registerCountdown, setRegisterCountdown] = useState(0);
  const loginTimerRef = useRef<number | null>(null);
  const registerTimerRef = useRef<number | null>(null);

  // 显示Toast消息
  const showToast = (message: string) => {
    setToastMessage(message);
    setIsToastVisible(true);
    setTimeout(() => {
      setIsToastVisible(false);
    }, 3000);
  };

  // 验证手机号
  const validatePhone = (phone: string): boolean => {
    const phoneRegex = /^1[3-9]\d{9}$/;
    return phoneRegex.test(phone);
  };

  // 验证密码
  const validatePassword = (password: string): boolean => {
    return password.length >= 6 && password.length <= 20;
  };

  // 验证验证码
  const validateCode = (code: string): boolean => {
    return code.length === 6 && /^\d{6}$/.test(code);
  };

  // 开始验证码倒计时
  const startCountdown = (type: 'login' | 'register') => {
    const countdownState = type === 'login' ? setLoginCountdown : setRegisterCountdown;
    const timerRef = type === 'login' ? loginTimerRef : registerTimerRef;
    
    countdownState(60);
    
    timerRef.current = setInterval(() => {
      countdownState((prev) => {
        if (prev <= 1) {
          if (timerRef.current) {
            clearInterval(timerRef.current);
            timerRef.current = null;
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  // 发送验证码
  const handleSendCode = async (type: 'login' | 'register') => {
    const phone = type === 'login' ? loginFormData.phone : registerFormData.phone;
    
    if (!validatePhone(phone)) {
      showToast('手机号格式不正确');
      return;
    }
    
    try {
      const response = await sendCodeApi({ phone, type });
      if (response.success) {
        startCountdown(type);
        showToast('验证码已发送');
      } else {
        showToast(response.message || '验证码发送失败');
      }
    } catch (error) {
      showToast('验证码发送失败，请稍后重试');
    }
  };

  // 处理登录
  const handleLogin = async () => {
    if (!validatePhone(loginFormData.phone)) {
      showToast('手机号格式不正确');
      return;
    }
    
    if (!validateCode(loginFormData.code)) {
      showToast('请输入6位数字验证码');
      return;
    }
    
    try {
      setIsLoading(true);
      const response = await loginApi({
        phone: loginFormData.phone,
        code: loginFormData.code,
      });
      
      if (response.success && response.data) {
        await saveUserInfo(response.data);
        showToast('登录成功');
        setTimeout(() => {
          router.replace('/p-home_farmer_small');
        }, 1000);
      } else {
        showToast(response.message || '登录失败');
      }
    } catch (error) {
      showToast('登录失败，请稍后重试');
    } finally {
      setIsLoading(false);
    }
  };

  // 处理注册
  const handleRegister = async () => {
    if (!validatePhone(registerFormData.phone)) {
      showToast('手机号格式不正确');
      return;
    }
    
    if (!validateCode(registerFormData.code)) {
      showToast('请输入6位数字验证码');
      return;
    }
    
    if (!validatePassword(registerFormData.password)) {
      showToast('密码长度应为6-20位');
      return;
    }
    
    if (registerFormData.password !== registerFormData.confirmPassword) {
      showToast('两次输入的密码不一致');
      return;
    }
    
    try {
      setIsLoading(true);
      const response = await registerApi({
        phone: registerFormData.phone,
        code: registerFormData.code,
        password: registerFormData.password,
      });
      
      if (response.success && response.data) {
        await saveUserInfo(response.data);
        showToast('注册成功');
        setTimeout(() => {
          router.replace('/p-role_select');
        }, 1000);
      } else {
        showToast(response.message || '注册失败');
      }
    } catch (error) {
      showToast('注册失败，请稍后重试');
    } finally {
      setIsLoading(false);
    }
  };

  // 处理忘记密码
  const handleForgotPassword = () => {
    showToast('忘记密码功能开发中');
  };

  // 处理用户协议
  const handleUserAgreement = () => {
    showToast('用户协议页面开发中');
  };

  // 处理隐私政策
  const handlePrivacyPolicy = () => {
    showToast('隐私政策页面开发中');
  };

  // 切换标签
  const handleTabSwitch = (tab: 'login' | 'register') => {
    setActiveTab(tab);
  };

  // 切换密码可见性
  const togglePasswordVisibility = (type: 'register' | 'confirm') => {
    if (type === 'register') {
      setIsRegisterPasswordVisible(!isRegisterPasswordVisible);
    } else {
      setIsConfirmPasswordVisible(!isConfirmPasswordVisible);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Logo和产品名称 */}
        <LinearGradient
          colors={['#D3F8EE', '#3BCCA5']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.logoSection}
        >
          <View style={styles.logoContainer}>
            <View style={styles.logoIcon}>
              <FontAwesome6 name="dove" size={32} color="#2B6A5A" />
            </View>
            <Text style={styles.appTitle}>禽康智检</Text>
            <Text style={styles.appSubtitle}>AI赋能禽类健康管理</Text>
          </View>
        </LinearGradient>

        {/* 登录注册表单 */}
        <View style={styles.formContainer}>
          <View style={styles.formCard}>
            {/* 切换标签 */}
            <View style={styles.tabSwitcher}>
              <TouchableOpacity
                style={[styles.tabButton, activeTab === 'login' && styles.tabButtonActive]}
                onPress={() => handleTabSwitch('login')}
              >
                <Text style={[styles.tabText, activeTab === 'login' && styles.tabTextActive]}>
                  登录
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.tabButton, activeTab === 'register' && styles.tabButtonActive]}
                onPress={() => handleTabSwitch('register')}
              >
                <Text style={[styles.tabText, activeTab === 'register' && styles.tabTextActive]}>
                  注册
                </Text>
              </TouchableOpacity>
            </View>

            {/* 登录表单 */}
            {activeTab === 'login' && (
              <View style={styles.formContent}>
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>手机号</Text>
                  <TextInput
                    style={styles.textInput}
                    placeholder="请输入手机号"
                    value={loginFormData.phone}
                    onChangeText={(text) => setLoginFormData({ ...loginFormData, phone: text })}
                    keyboardType="phone-pad"
                    maxLength={11}
                  />
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>验证码</Text>
                  <View style={styles.codeInputWrapper}>
                    <TextInput
                      style={styles.codeInput}
                      placeholder="请输入验证码"
                      value={loginFormData.code}
                      onChangeText={(text) => setLoginFormData({ ...loginFormData, code: text })}
                      keyboardType="number-pad"
                      maxLength={6}
                    />
                    <TouchableOpacity
                      style={[
                        styles.codeButton,
                        loginCountdown > 0 && styles.codeButtonDisabled,
                      ]}
                      onPress={() => handleSendCode('login')}
                      disabled={loginCountdown > 0}
                    >
                      <Text style={[
                        styles.codeButtonText,
                        loginCountdown > 0 && styles.codeButtonTextDisabled,
                      ]}>
                        {loginCountdown > 0 ? `${loginCountdown}秒后重发` : '获取验证码'}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>

                <TouchableOpacity style={styles.submitButton} onPress={handleLogin} disabled={isLoading}>
                  <LinearGradient
                    colors={['#D3F8EE', '#3BCCA5']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={[styles.submitButtonGradient, isLoading && styles.submitButtonDisabled]}
                  >
                    {isLoading ? (
                      <FontAwesome6 name="spinner" size={18} color="#2B6A5A" style={{ marginRight: 8 }} />
                    ) : null}
                    <Text style={styles.submitButtonText}>{isLoading ? '登录中...' : '登录'}</Text>
                  </LinearGradient>
                </TouchableOpacity>

                <View style={styles.forgotPasswordContainer}>
                  <TouchableOpacity onPress={handleForgotPassword}>
                    <Text style={styles.forgotPasswordText}>忘记密码？</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}

            {/* 注册表单 */}
            {activeTab === 'register' && (
              <View style={styles.formContent}>
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>手机号</Text>
                  <TextInput
                    style={styles.textInput}
                    placeholder="请输入手机号"
                    value={registerFormData.phone}
                    onChangeText={(text) => setRegisterFormData({ ...registerFormData, phone: text })}
                    keyboardType="phone-pad"
                    maxLength={11}
                  />
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>验证码</Text>
                  <View style={styles.codeInputWrapper}>
                    <TextInput
                      style={styles.codeInput}
                      placeholder="请输入验证码"
                      value={registerFormData.code}
                      onChangeText={(text) => setRegisterFormData({ ...registerFormData, code: text })}
                      keyboardType="number-pad"
                      maxLength={6}
                    />
                    <TouchableOpacity
                      style={[
                        styles.codeButton,
                        registerCountdown > 0 && styles.codeButtonDisabled,
                      ]}
                      onPress={() => handleSendCode('register')}
                      disabled={registerCountdown > 0}
                    >
                      <Text style={[
                        styles.codeButtonText,
                        registerCountdown > 0 && styles.codeButtonTextDisabled,
                      ]}>
                        {registerCountdown > 0 ? `${registerCountdown}秒后重发` : '获取验证码'}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>设置密码</Text>
                  <View style={styles.passwordInputWrapper}>
                    <TextInput
                      style={styles.passwordInput}
                      placeholder="请设置6-20位密码"
                      value={registerFormData.password}
                      onChangeText={(text) => setRegisterFormData({ ...registerFormData, password: text })}
                      secureTextEntry={!isRegisterPasswordVisible}
                    />
                    <TouchableOpacity
                      style={styles.passwordToggleButton}
                      onPress={() => togglePasswordVisibility('register')}
                    >
                      <FontAwesome6
                        name={isRegisterPasswordVisible ? 'eye-slash' : 'eye'}
                        size={16}
                        color="#6B7280"
                      />
                    </TouchableOpacity>
                  </View>
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>确认密码</Text>
                  <View style={styles.passwordInputWrapper}>
                    <TextInput
                      style={styles.passwordInput}
                      placeholder="请再次输入密码"
                      value={registerFormData.confirmPassword}
                      onChangeText={(text) => setRegisterFormData({ ...registerFormData, confirmPassword: text })}
                      secureTextEntry={!isConfirmPasswordVisible}
                    />
                    <TouchableOpacity
                      style={styles.passwordToggleButton}
                      onPress={() => togglePasswordVisibility('confirm')}
                    >
                      <FontAwesome6
                        name={isConfirmPasswordVisible ? 'eye-slash' : 'eye'}
                        size={16}
                        color="#6B7280"
                      />
                    </TouchableOpacity>
                  </View>
                </View>

                <TouchableOpacity style={styles.submitButton} onPress={handleRegister} disabled={isLoading}>
                  <LinearGradient
                    colors={['#D3F8EE', '#3BCCA5']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={[styles.submitButtonGradient, isLoading && styles.submitButtonDisabled]}
                  >
                    {isLoading ? (
                      <FontAwesome6 name="spinner" size={18} color="#2B6A5A" style={{ marginRight: 8 }} />
                    ) : null}
                    <Text style={styles.submitButtonText}>{isLoading ? '注册中...' : '注册'}</Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            )}

            {/* 用户协议 */}
            <View style={styles.agreementSection}>
              <Text style={styles.agreementText}>
                登录即表示同意
                <Text style={styles.agreementLink} onPress={handleUserAgreement}>
                  《用户协议》
                </Text>
                和
                <Text style={styles.agreementLink} onPress={handlePrivacyPolicy}>
                  《隐私政策》
                </Text>
              </Text>
            </View>
          </View>
          
          {/* 体验APP按钮 */}
          <View style={styles.experienceSection}>
            <TouchableOpacity style={styles.experienceButton} onPress={() => router.push('/p-experience_role')}>
              <FontAwesome6 name="play-circle" size={16} color="#3BCCA5" style={styles.buttonIcon} />
              <Text style={styles.experienceButtonText}>体验APP</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* Toast消息 */}
      {isToastVisible && (
        <View style={styles.toastContainer}>
          <View style={styles.toast}>
            <Text style={styles.toastText}>{toastMessage}</Text>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
};

export default LoginRegisterScreen;

