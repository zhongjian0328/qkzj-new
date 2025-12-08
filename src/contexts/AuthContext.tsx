import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import { UserInfo, getCurrentUser, saveUserInfo, clearUserInfo } from '../services/api';

// 认证上下文类型
interface AuthContextType {
  user: UserInfo | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (userInfo: UserInfo) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (userInfo: Partial<UserInfo>) => Promise<void>;
  setUser: (userInfo: UserInfo | null) => void;
}

// 创建认证上下文
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

// 认证提供者组件的属性类型
interface AuthProviderProps {
  children: ReactNode;
}

// 认证提供者组件
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<UserInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // 初始化时检查用户登录状态
  useEffect(() => {
    checkAuthStatus();
  }, []);
  
  // 检查用户登录状态
  const checkAuthStatus = async () => {
    try {
      const currentUser = await getCurrentUser();
      setUser(currentUser);
    } catch (error) {
      console.error('检查认证状态失败:', error);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };
  
  // 登录函数
  const login = async (userInfo: UserInfo) => {
    try {
      await saveUserInfo(userInfo);
      setUser(userInfo);
    } catch (error) {
      console.error('登录失败:', error);
      throw error;
    }
  };
  
  // 登出函数
  const logout = async () => {
    try {
      await clearUserInfo();
      setUser(null);
    } catch (error) {
      console.error('登出失败:', error);
      throw error;
    }
  };
  
  // 更新用户信息
  const updateUser = async (updatedData: Partial<UserInfo>) => {
    try {
      if (!user) {
        throw new Error('用户未登录');
      }
      
      const updatedUser = { ...user, ...updatedData };
      await saveUserInfo(updatedUser);
      setUser(updatedUser);
    } catch (error) {
      console.error('更新用户信息失败:', error);
      throw error;
    }
  };
  
  // 认证状态
  const isAuthenticated = !!user;
  
  // 上下文值
  const contextValue: AuthContextType = {
    user,
    isLoading,
    isAuthenticated,
    login,
    logout,
    updateUser,
    setUser,
  };
  
  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

// 自定义钩子，用于访问认证上下文
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
