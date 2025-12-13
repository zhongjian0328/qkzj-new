import React, { useState } from 'react';
import { View, TextInput, Text, StyleSheet, TextInputProps, TouchableOpacity } from 'react-native';

export type InputVariant = 'primary' | 'outline';
export type InputSize = 'small' | 'medium' | 'large';
export type InputType = 'text' | 'password' | 'number' | 'email' | 'phone';

interface InputProps extends TextInputProps {
  label?: string;
  placeholder?: string;
  variant?: InputVariant;
  size?: InputSize;
  type?: InputType;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  containerStyle?: any;
  inputStyle?: any;
  labelStyle?: any;
}

const Input: React.FC<InputProps> = ({
  label,
  placeholder,
  variant = 'primary',
  size = 'medium',
  type = 'text',
  error,
  helperText,
  leftIcon,
  rightIcon,
  containerStyle,
  inputStyle,
  labelStyle,
  secureTextEntry,
  ...props
}) => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const isPassword = type === 'password';
  const showPasswordToggle = isPassword;

  const containerStyles = [
    styles.container,
    error && styles.containerError,
    containerStyle,
  ];

  const inputContainerStyles = [
    styles.inputContainer,
    styles[variant],
    styles[size],
    error && styles.inputError,
  ];

  const inputStyles = [
    styles.input,
    styles[`${size}Input`],
    inputStyle,
  ];

  const labelStyles = [
    styles.label,
    error && styles.labelError,
    labelStyle,
  ];

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  return (
    <View style={containerStyles}>
      {label && <Text style={labelStyles}>{label}</Text>}
      <View style={inputContainerStyles}>
        {leftIcon && <View style={styles.leftIcon}>{leftIcon}</View>}
        <TextInput
          style={inputStyles}
          placeholder={placeholder}
          placeholderTextColor="#9CA3AF"
          secureTextEntry={isPassword ? !isPasswordVisible : secureTextEntry}
          keyboardType={
            type === 'number' ? 'numeric' :
            type === 'email' ? 'email-address' :
            type === 'phone' ? 'phone-pad' :
            'default'
          }
          {...props}
        />
        <View style={styles.rightIconContainer}>
          {showPasswordToggle && (
            <TouchableOpacity
              onPress={togglePasswordVisibility}
              style={styles.passwordToggle}
            >
              <Text style={styles.passwordToggleText}>
                {isPasswordVisible ? '隐藏' : '显示'}
              </Text>
            </TouchableOpacity>
          )}
          {rightIcon && !showPasswordToggle && rightIcon}
        </View>
      </View>
      {error && <Text style={styles.errorText}>{error}</Text>}
      {helperText && !error && <Text style={styles.helperText}>{helperText}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  containerError: {
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  input: {
    flex: 1,
    color: '#111827',
    fontSize: 16,
  },
  // Variants
  primary: {
    backgroundColor: '#F3F4F6',
    borderWidth: 0,
  },
  outline: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  // Sizes
  small: {
    height: 40,
    borderRadius: 6,
    paddingHorizontal: 12,
  },
  medium: {
    height: 48,
    borderRadius: 8,
    paddingHorizontal: 16,
  },
  large: {
    height: 56,
    borderRadius: 10,
    paddingHorizontal: 20,
  },
  // Input sizes
  smallInput: {
    fontSize: 14,
  },
  mediumInput: {
    fontSize: 16,
  },
  largeInput: {
    fontSize: 18,
  },
  // Icons
  leftIcon: {
    marginRight: 12,
  },
  rightIconContainer: {
    marginLeft: 12,
  },
  passwordToggle: {
    padding: 4,
  },
  passwordToggleText: {
    fontSize: 14,
    color: '#2DBBA1',
    fontWeight: '500',
  },
  // Label
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#111827',
    marginBottom: 8,
  },
  // Error states
  inputError: {
    borderColor: '#EF4444',
    backgroundColor: '#FEF2F2',
  },
  labelError: {
    color: '#EF4444',
  },
  errorText: {
    fontSize: 12,
    color: '#EF4444',
    marginTop: 4,
  },
  // Helper text
  helperText: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 4,
  },
});

export default Input;