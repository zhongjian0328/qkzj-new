import React, { useState } from 'react';
import { View, Text, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../context/UserContext';
import { Ionicons } from '@expo/vector-icons';
import Button from '../components/Button';
import Input from '../components/Input';
import { styles } from '../styles';

const LoginScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const { login, register, sendVerificationCode } = useAuth();

  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');
  const [loginMode, setLoginMode] = useState<'verification' | 'password'>('password');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
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
    
    if (activeTab === 'login') {
      if (loginMode === 'verification') {
        if (!verificationCode) {
          newErrors.verificationCode = '请输入验证码';
        } else if (verificationCode.length !== 6) {
          newErrors.verificationCode = '请输入6位验证码';
        }
      } else {
        if (!password) {
          newErrors.password = '请输入密码';
        } else if (password.length < 6 || password.length > 20) {
          newErrors.password = '密码长度应为6-20位';
        }
      }
    } else {
      if (!verificationCode) {
        newErrors.verificationCode = '请输入验证码';
      } else if (verificationCode.length !== 6) {
        newErrors.verificationCode = '请输入6位验证码';
      }
      
      if (!password) {
        newErrors.password = '请设置密码';
      } else if (password.length < 6 || password.length > 20) {
        newErrors.password = '请设置6-20位密码';
      }
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
      // 登录模式用 login 类型，注册模式用 register 类型
      const codeType = activeTab === 'login' ? 'login' : 'register';
      await sendVerificationCode(phoneNumber, codeType as any);
      
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

  const handleLogin = async () => {
    if (!validateForm()) {
      return;
    }
    
    try {
      setLoading(true);
      
      // 调用登录API，根据登录模式传递不同参数
      await login(phoneNumber, loginMode === 'verification' ? verificationCode : password, loginMode);
      
      // 登录成功，导航到角色选择页面
      navigation.reset({
        index: 0,
        routes: [{ name: 'RoleSelect' }],
      });
    } catch (error) {
      setErrors({ general: '登录失败，请稍后重试' });
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
      await register(phoneNumber, verificationCode, password);
      
      // 注册成功，导航到角色选择页面
      navigation.reset({
        index: 0,
        routes: [{ name: 'RoleSelect' }],
      });
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
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        {/* Logo和产品名称 */}
        <View style={styles.loginLogoSection}>
          <View style={styles.loginLogoContainer}>
            <Ionicons name="medical-outline" size={48} color="#2DBBA1" />
          </View>
          <Text style={styles.loginAppTitle}>禽康智检</Text>
          <Text style={styles.loginAppSubtitle}>AI赋能禽类健康诊断</Text>
        </View>
        
        {/* 登录注册表单 */}
        <View style={styles.loginFormSection}>
          {/* 登录/注册切换标签 */}
          <View style={styles.loginTabSwitcher}>
            <TouchableOpacity 
              style={[
                styles.loginTabButton, 
                activeTab === 'login' && styles.loginTabActive
              ]}
              onPress={() => setActiveTab('login')}
            >
              <Text 
                style={[
                  styles.loginTabText, 
                  activeTab === 'login' && styles.loginTabTextActive
                ]}
              >
                登录
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[
                styles.loginTabButton, 
                activeTab === 'register' && styles.loginTabActive
              ]}
              onPress={() => setActiveTab('register')}
            >
              <Text 
                style={[
                  styles.loginTabText, 
                  activeTab === 'register' && styles.loginTabTextActive
                ]}
              >
                注册
              </Text>
            </TouchableOpacity>
          </View>
          
          {/* 登录表单 */}
          {activeTab === 'login' ? (
            <View style={styles.loginForm}>
              {/* 手机号输入 */}
              <View style={styles.loginFormGroup}>
                <Input
                  label="手机号"
                  value={phoneNumber}
                  onChangeText={setPhoneNumber}
                  keyboardType="phone-pad"
                  placeholder="请输入手机号"
                  error={errors.phoneNumber}
                  variant="outline"
                  size="medium"
                />
              </View>
              
              {/* 登录模式切换 */}
              <View style={styles.loginModeSwitcher}>
                <TouchableOpacity 
                  style={[
                    styles.loginModeButton, 
                    loginMode === 'verification' && styles.loginModeActive
                  ]}
                  onPress={() => setLoginMode('verification')}
                >
                  <Text 
                    style={[
                      styles.loginModeText, 
                      loginMode === 'verification' && styles.loginModeTextActive
                    ]}
                  >
                    验证码登录
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[
                    styles.loginModeButton, 
                    loginMode === 'password' && styles.loginModeActive
                  ]}
                  onPress={() => setLoginMode('password')}
                >
                  <Text 
                    style={[
                      styles.loginModeText, 
                      loginMode === 'password' && styles.loginModeTextActive
                    ]}
                  >
                    密码登录
                  </Text>
                </TouchableOpacity>
              </View>
              
              {/* 验证码或密码输入 */}
              <View style={styles.loginFormGroup}>
                {loginMode === 'verification' ? (
                  <View style={styles.loginVerificationContainer}>
                    <Input
                      label="验证码"
                      value={verificationCode}
                      onChangeText={setVerificationCode}
                      keyboardType="number-pad"
                      placeholder="请输入验证码"
                      error={errors.verificationCode}
                      variant="outline"
                      size="medium"
                      style={{ flex: 1, width: '100%' }}
                    />
                    <TouchableOpacity 
                      style={[
                        styles.loginCodeButton, 
                        countdown > 0 && styles.loginCodeButtonDisabled
                      ]}
                      onPress={handleSendCode}
                      disabled={countdown > 0}
                    >
                      <Text style={styles.loginCodeButtonText}>
                        {countdown > 0 ? `${countdown}s后重试` : '获取验证码'}
                      </Text>
                    </TouchableOpacity>
                  </View>
                ) : (
                  <Input
                    label="密码"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                    placeholder="请输入密码"
                    error={errors.password}
                    variant="outline"
                    size="medium"
                    type="password"
                  />
                )}
              </View>
              
              {/* 登录按钮 */}
              <Button 
                title="登录" 
                onPress={handleLogin} 
                loading={loading}
                style={styles.loginSubmitButton}
                variant="primary"
                size="large"
                fullWidth
              />
              
              {/* 忘记密码 */}
              <View style={styles.loginForgotPassword}>
                <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')}>
                  <Text style={styles.loginForgotPasswordText}>忘记密码？</Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            /* 注册表单 */
            <View style={styles.loginForm}>
              {/* 手机号输入 */}
              <View style={styles.loginFormGroup}>
                <Input
                  label="手机号"
                  value={phoneNumber}
                  onChangeText={setPhoneNumber}
                  keyboardType="phone-pad"
                  placeholder="请输入手机号"
                  error={errors.phoneNumber}
                  variant="outline"
                  size="medium"
                />
              </View>
              
              {/* 验证码输入 */}
              <View style={styles.loginFormGroup}>
                <View style={styles.loginVerificationContainer}>
                  <Input
                    label="验证码"
                    value={verificationCode}
                    onChangeText={setVerificationCode}
                    keyboardType="number-pad"
                    placeholder="请输入验证码"
                    error={errors.verificationCode}
                  variant="outline"
                  size="medium"
                  style={{ flex: 1, width: '100%' }}
                />
                  <TouchableOpacity 
                    style={[
                      styles.loginCodeButton, 
                      countdown > 0 && styles.loginCodeButtonDisabled
                    ]}
                    onPress={handleSendCode}
                    disabled={countdown > 0}
                  >
                    <Text style={styles.loginCodeButtonText}>
                      {countdown > 0 ? `${countdown}s后重试` : '获取验证码'}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
              
              {/* 密码输入 */}
              <View style={styles.loginFormGroup}>
                <Input
                  label="设置密码"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry
                  placeholder="请设置6-20位密码"
                  error={errors.password}
                  variant="outline"
                  size="medium"
                  type="password"
                />
              </View>
              
              {/* 注册按钮 */}
              <Button 
                title="注册" 
                onPress={handleRegister} 
                loading={loading}
                style={styles.loginSubmitButton}
                variant="primary"
                size="large"
                fullWidth
              />
            </View>
          )}
          
          {/* 错误信息 */}
          {errors.general && (
            <Text style={[styles.loginErrorText, { textAlign: 'center', marginTop: 10 }]}>
              {errors.general}
            </Text>
          )}
        </View>
        
        {/* 体验APP按钮 */}
        <View style={styles.loginAgreementSection}>
          <Text style={styles.loginAgreementText}>
            登录即表示同意
            <Text style={styles.loginAgreementLink} onPress={() => {}}>《用户协议》</Text>
            和
            <Text style={styles.loginAgreementLink} onPress={() => {}}>《隐私政策》</Text>
          </Text>
        </View>
        
        <View style={styles.loginExperienceSection}>
          <Button 
            onPress={() => navigation.reset({ index: 0, routes: [{ name: 'ExperienceRole' }] })}
            variant="outline"
            size="large"
            fullWidth
          >
            <Ionicons name="play-outline" size={16} color="#2DBBA1" style={{ marginRight: 8 }} />
            <Text style={{ color: '#2DBBA1', fontSize: 16 }}>体验APP</Text>
          </Button>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default LoginScreen;
