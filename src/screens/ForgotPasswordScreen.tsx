import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import Button from '../components/Button';
import Input from '../components/Input';
import { styles } from '../styles';
import { authApi } from '../services/api';

const ForgotPasswordScreen: React.FC = () => {
  const navigation = useNavigation<any>();

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [countdown, setCountdown] = useState(0);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // 倒计时定时器
  useEffect(() => {
    if (countdown <= 0) return;
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [countdown > 0]);

  const validatePhone = (): boolean => {
    if (!phoneNumber) {
      setErrors({ phoneNumber: '请输入手机号' });
      return false;
    }
    if (!/^1[3-9]\d{9}$/.test(phoneNumber)) {
      setErrors({ phoneNumber: '请输入正确的手机号' });
      return false;
    }
    setErrors({});
    return true;
  };

  const validateCode = (): boolean => {
    const newErrors: { [key: string]: string } = {};
    if (!verificationCode) {
      newErrors.verificationCode = '请输入验证码';
    } else if (verificationCode.length !== 6) {
      newErrors.verificationCode = '请输入6位验证码';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validatePassword = (): boolean => {
    const newErrors: { [key: string]: string } = {};
    if (!newPassword) {
      newErrors.newPassword = '请输入新密码';
    } else if (newPassword.length < 6 || newPassword.length > 20) {
      newErrors.newPassword = '密码长度应为6-20位';
    }
    if (!confirmPassword) {
      newErrors.confirmPassword = '请确认密码';
    } else if (newPassword !== confirmPassword) {
      newErrors.confirmPassword = '两次输入的密码不一致';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // 步骤1 -> 步骤2：发送验证码
  const handleSendCode = async () => {
    if (!validatePhone()) return;

    try {
      setLoading(true);
      await authApi.getVerificationCode(phoneNumber);
      setCountdown(60);
      setStep(2);
      setErrors({});
    } catch (error) {
      setErrors({ general: '发送验证码失败，请稍后重试' });
    } finally {
      setLoading(false);
    }
  };

  // 步骤2 -> 步骤3：验证验证码
  const handleVerifyCode = async () => {
    if (!validateCode()) return;

    try {
      setLoading(true);
      await authApi.verifyCode({ phoneNumber, code: verificationCode });
      setStep(3);
      setErrors({});
    } catch (error) {
      setErrors({ general: '验证码错误，请重新输入' });
    } finally {
      setLoading(false);
    }
  };

  // 重新获取验证码（步骤2中）
  const handleResendCode = async () => {
    if (countdown > 0) return;

    try {
      setLoading(true);
      await authApi.getVerificationCode(phoneNumber);
      setCountdown(60);
      setErrors({});
    } catch (error) {
      setErrors({ general: '发送验证码失败，请稍后重试' });
    } finally {
      setLoading(false);
    }
  };

  // 步骤3提交：重置密码
  const handleResetPassword = async () => {
    if (!validatePassword()) return;

    try {
      setLoading(true);
      await authApi.forgotPassword({
        phoneNumber,
        code: verificationCode,
        newPassword,
      });
      Alert.alert(
        '密码重置成功',
        '请使用新密码登录',
        [
          {
            text: '确定',
            onPress: () => {
              navigation.navigate('Login');
            },
          },
        ]
      );
    } catch (error) {
      setErrors({ general: '密码重置失败，请稍后重试' });
    } finally {
      setLoading(false);
    }
  };

  // 步骤指示器
  const renderStepIndicator = () => (
    <View style={styles.stageIndicatorContainer}>
      <View style={styles.stageIndicator}>
        {/* 步骤1 */}
        <View style={styles.stageItem}>
          <View style={[
            styles.stageCircle,
            step >= 1 && styles.stageActive,
          ]}>
            <Text style={[
              styles.stageCircleText,
              step >= 1 && styles.stageActiveText,
            ]}>
              {step > 1 ? '✓' : '1'}
            </Text>
          </View>
          <Text style={[
            styles.stageText,
            step >= 1 && styles.stageActiveText,
          ]}>
            手机号
          </Text>
        </View>
        <View style={styles.stageLine} />
        {/* 步骤2 */}
        <View style={styles.stageItem}>
          <View style={[
            styles.stageCircle,
            step >= 2 && styles.stageActive,
          ]}>
            <Text style={[
              styles.stageCircleText,
              step >= 2 && styles.stageActiveText,
            ]}>
              {step > 2 ? '✓' : '2'}
            </Text>
          </View>
          <Text style={[
            styles.stageText,
            step >= 2 && styles.stageActiveText,
          ]}>
            验证码
          </Text>
        </View>
        <View style={styles.stageLine} />
        {/* 步骤3 */}
        <View style={styles.stageItem}>
          <View style={[
            styles.stageCircle,
            step >= 3 && styles.stageActive,
          ]}>
            <Text style={[
              styles.stageCircleText,
              step >= 3 && styles.stageActiveText,
            ]}>
              3
            </Text>
          </View>
          <Text style={[
            styles.stageText,
            step >= 3 && styles.stageActiveText,
          ]}>
            重置密码
          </Text>
        </View>
      </View>
    </View>
  );

  // 步骤1：输入手机号
  const renderStep1 = () => (
    <View>
      <Text style={[styles.stepTitle, { textAlign: 'center', marginBottom: 8 }]}>
        找回密码
      </Text>
      <Text style={{ textAlign: 'center', color: '#6B7280', fontSize: 14, marginBottom: 32 }}>
        请输入注册时使用的手机号
      </Text>

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

      <Button
        title="下一步"
        onPress={handleSendCode}
        loading={loading}
        style={{ marginTop: 24 }}
        variant="primary"
        size="large"
        fullWidth
      />
    </View>
  );

  // 步骤2：输入验证码
  const renderStep2 = () => (
    <View>
      <Text style={[styles.stepTitle, { textAlign: 'center', marginBottom: 8 }]}>
        验证身份
      </Text>
      <Text style={{ textAlign: 'center', color: '#6B7280', fontSize: 14, marginBottom: 8 }}>
        已向 {phoneNumber.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2')} 发送验证码
      </Text>

      <View style={styles.verificationContainer}>
        <Input
          label="验证码"
          value={verificationCode}
          onChangeText={setVerificationCode}
          keyboardType="number-pad"
          placeholder="请输入6位验证码"
          error={errors.verificationCode}
          style={styles.verificationInput}
        />
        <TouchableOpacity
          style={[
            styles.codeButton,
            countdown > 0 && styles.codeButtonDisabled,
          ]}
          onPress={handleResendCode}
          disabled={countdown > 0}
        >
          <Text style={styles.codeButtonText}>
            {countdown > 0 ? `${countdown}s后重发` : '获取验证码'}
          </Text>
        </TouchableOpacity>
      </View>

      <Button
        title="验证"
        onPress={handleVerifyCode}
        loading={loading}
        style={{ marginTop: 24 }}
        variant="primary"
        size="large"
        fullWidth
      />
    </View>
  );

  // 步骤3：重置密码
  const renderStep3 = () => (
    <View>
      <Text style={[styles.stepTitle, { textAlign: 'center', marginBottom: 8 }]}>
        重置密码
      </Text>
      <Text style={{ textAlign: 'center', color: '#6B7280', fontSize: 14, marginBottom: 32 }}>
        请设置新密码
      </Text>

      <Input
        label="新密码"
        value={newPassword}
        onChangeText={setNewPassword}
        secureTextEntry
        placeholder="请设置6-20位新密码"
        error={errors.newPassword}
        variant="outline"
        size="medium"
        type="password"
      />

      <Input
        label="确认密码"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
        placeholder="请再次输入新密码"
        error={errors.confirmPassword}
        variant="outline"
        size="medium"
        type="password"
      />

      <Button
        title="重置密码"
        onPress={handleResetPassword}
        loading={loading}
        style={{ marginTop: 24 }}
        variant="primary"
        size="large"
        fullWidth
      />
    </View>
  );

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* 返回按钮 */}
        <TouchableOpacity
          style={{ padding: 8, marginBottom: 16, alignSelf: 'flex-start' }}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#1F5E52" />
        </TouchableOpacity>

        {/* Logo */}
        <View style={[styles.loginLogoSection, { marginBottom: 24, flex: undefined, paddingVertical: 20 }]}>
          <View style={styles.loginLogoContainer}>
            <Ionicons name="lock-closed-outline" size={48} color="#2DBBA1" />
          </View>
          <Text style={styles.loginAppTitle}>禽康智检</Text>
        </View>

        {/* 步骤指示器 */}
        {renderStepIndicator()}

        {/* 各步骤内容 */}
        {step === 1 && renderStep1()}
        {step === 2 && renderStep2()}
        {step === 3 && renderStep3()}

        {/* 错误提示 */}
        {errors.general && (
          <Text style={[styles.errorText, { marginTop: 16 }]}>
            {errors.general}
          </Text>
        )}

        {/* 返回登录 */}
        <View style={[styles.loginLinkContainer, { marginTop: 32 }]}>
          <Text style={styles.loginLinkText}>想起密码了？</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text style={styles.loginLink}>
              返回登录
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default ForgotPasswordScreen;
