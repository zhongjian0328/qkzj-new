import React, { createContext, useContext, useReducer, ReactNode } from 'react';

// 用户角色类型
export type UserRole = 'FARMER' | 'INSTITUTION' | 'STUDENT' | 'TEACHER';
export type UserSubRole = 
  | 'SMALL' | 'COOPERATIVE' | 'ENTERPRISE' // 养殖户子角色
  | 'CDC' | 'RESEARCH_INSTITUTE' | 'SERVICE_PROVIDER' // 机构子角色
  | 'LEARNING_STUDENT' | 'COGNITIVE_INTERN' | 'ADVANCED_INTERN'; // 学生子角色

// 用户信息类型
interface User {
  id: string;
  phoneNumber: string;
  nickname: string;
  avatar: string;
  roleType: UserRole;
  subRole: UserSubRole;
  organizationId?: string;
  authStatus: 'UNVERIFIED' | 'PENDING' | 'VERIFIED';
  schoolId?: string;
  studentId?: string;
  mentorId?: string;
  registrationDate: string;
  lastLoginDate: string;
}

// 认证状态类型
interface AuthState {
  isLoggedIn: boolean;
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
}

// 操作类型
type AuthAction =
  | { type: 'LOGIN_REQUEST' }
  | { type: 'LOGIN_SUCCESS'; payload: { user: User; token: string } }
  | { type: 'LOGIN_FAILURE'; payload: string }
  | { type: 'LOGOUT' }
  | { type: 'UPDATE_USER'; payload: Partial<User> }
  | { type: 'CLEAR_ERROR' };

// 初始状态
const initialState: AuthState = {
  isLoggedIn: false,
  user: null,
  token: null,
  loading: false,
  error: null,
};

// Reducer函数
const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'LOGIN_REQUEST':
      return {
        ...state,
        loading: true,
        error: null,
      };
    case 'LOGIN_SUCCESS':
      return {
        ...state,
        isLoggedIn: true,
        user: action.payload.user,
        token: action.payload.token,
        loading: false,
        error: null,
      };
    case 'LOGIN_FAILURE':
      return {
        ...state,
        isLoggedIn: false,
        user: null,
        token: null,
        loading: false,
        error: action.payload,
      };
    case 'LOGOUT':
      return {
        ...state,
        isLoggedIn: false,
        user: null,
        token: null,
      };
    case 'UPDATE_USER':
      return {
        ...state,
        user: state.user ? { ...state.user, ...action.payload } : null,
      };
    case 'CLEAR_ERROR':
      return {
        ...state,
        error: null,
      };
    default:
      return state;
  }
};

// Context类型
interface AuthContextType {
  state: AuthState;
  login: (phoneNumber: string, codeOrRoleType: string, subRole?: any) => Promise<void>;
  register: (phoneNumber: string, verificationCode: string, password: string) => Promise<void>;
  sendVerificationCode: (phoneNumber: string) => Promise<void>;
  logout: () => void;
  updateUser: (userData: Partial<User>) => void;
  clearError: () => void;
}

// 创建Context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider组件
interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);
  const [verificationCodes, setVerificationCodes] = React.useState<{ [key: string]: { code: string; expiresAt: number } }>({});

  // 发送验证码函数
  const sendVerificationCode = async (phoneNumber: string) => {
    dispatch({ type: 'LOGIN_REQUEST' });
    try {
      // 这里应该调用API发送验证码
      // 模拟生成验证码
      const code = Math.floor(100000 + Math.random() * 900000).toString();
      
      // 模拟API延迟
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // 保存验证码到状态中，有效期5分钟
      setVerificationCodes(prev => ({
        ...prev,
        [phoneNumber]: {
          code,
          expiresAt: Date.now() + 5 * 60 * 1000,
        },
      }));
      
      // 清除之前的错误
      dispatch({ type: 'CLEAR_ERROR' });
      
      // 显示验证码到控制台，方便测试
      console.log(`验证码已发送到 ${phoneNumber}，验证码：${code}`);
      // 触发toast提示
      throw new Error(`验证码已发送，验证码：${code}`);
    } catch (error) {
      // 为了在测试环境中让用户看到验证码，我们将验证码作为错误消息返回
      // 实际生产环境中应移除这个逻辑
      const errorMessage = error instanceof Error ? error.message : '发送验证码失败，请稍后重试';
      dispatch({ type: 'LOGIN_FAILURE', payload: errorMessage });
    }
  };

  // 登录函数
  const login = async (phoneNumber: string, codeOrRoleType: string, subRole?: any) => {
    dispatch({ type: 'LOGIN_REQUEST' });
    try {
      // 检查是否是体验角色登录
      const isExperienceLogin = codeOrRoleType === 'FARMER' || 
                               codeOrRoleType === 'INSTITUTION' || 
                               codeOrRoleType === 'STUDENT';
      
      if (isExperienceLogin) {
        // 体验角色登录
        const roleType = codeOrRoleType as 'FARMER' | 'INSTITUTION' | 'STUDENT';
        
        // 模拟API调用
        const mockUser: User = {
          id: `experience-${Date.now()}`,
          phoneNumber: `experience-${phoneNumber}`,
          nickname: getRoleNickname(roleType, subRole as UserSubRole),
          avatar: 'https://s.coze.cn/image/rFqxc53MSiw/',
          roleType,
          subRole: subRole as UserSubRole,
          authStatus: 'VERIFIED',
          registrationDate: new Date().toISOString(),
          lastLoginDate: new Date().toISOString(),
        };
        const mockToken = 'mock-jwt-token';
        
        // 模拟API延迟
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // 保存token到本地存储
        localStorage.setItem('token', mockToken);
        
        dispatch({ type: 'LOGIN_SUCCESS', payload: { user: mockUser, token: mockToken } });
      } else {
        // 普通验证码登录
        // 验证验证码
        const verificationCode = codeOrRoleType;
        const storedCode = verificationCodes[phoneNumber];
        if (!storedCode || storedCode.code !== verificationCode || storedCode.expiresAt < Date.now()) {
          throw new Error('验证码无效或已过期');
        }
        
        // 模拟API调用
        const mockUser: User = {
          id: '1',
          phoneNumber,
          nickname: '测试用户',
          avatar: 'https://s.coze.cn/image/rFqxc53MSiw/',
          roleType: 'FARMER',
          subRole: 'SMALL',
          authStatus: 'VERIFIED',
          registrationDate: new Date().toISOString(),
          lastLoginDate: new Date().toISOString(),
        };
        const mockToken = 'mock-jwt-token';
        
        // 模拟API延迟
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // 保存token到本地存储
        localStorage.setItem('token', mockToken);
        
        dispatch({ type: 'LOGIN_SUCCESS', payload: { user: mockUser, token: mockToken } });
      }
    } catch (error) {
      dispatch({ type: 'LOGIN_FAILURE', payload: error instanceof Error ? error.message : '登录失败，请稍后重试' });
    }
  };
  
  // 根据角色生成昵称
  const getRoleNickname = (roleType: UserRole, subRole: UserSubRole): string => {
    switch (roleType) {
      case 'FARMER':
        return subRole === 'SMALL' ? '小散户养殖户' : '企业养殖户';
      case 'INSTITUTION':
        return '疫控机构用户';
      case 'STUDENT':
        return '实习学生';
      default:
        return '体验用户';
    }
  };

  // 注册函数
  const register = async (phoneNumber: string, verificationCode: string, password: string) => {
    dispatch({ type: 'LOGIN_REQUEST' });
    try {
      // 这里应该调用API进行注册
      // 验证验证码
      const storedCode = verificationCodes[phoneNumber];
      if (!storedCode || storedCode.code !== verificationCode || storedCode.expiresAt < Date.now()) {
        throw new Error('验证码无效或已过期');
      }
      
      // 模拟API调用
      const mockUser: User = {
        id: '1',
        phoneNumber,
        nickname: '测试用户',
        avatar: 'https://s.coze.cn/image/rFqxc53MSiw/',
        roleType: 'FARMER',
        subRole: 'SMALL',
        authStatus: 'UNVERIFIED',
        registrationDate: new Date().toISOString(),
        lastLoginDate: new Date().toISOString(),
      };
      const mockToken = 'mock-jwt-token';
      
      // 模拟API延迟
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // 保存token到本地存储
      localStorage.setItem('token', mockToken);
      
      dispatch({ type: 'LOGIN_SUCCESS', payload: { user: mockUser, token: mockToken } });
    } catch (error) {
      dispatch({ type: 'LOGIN_FAILURE', payload: '注册失败，验证码无效或已过期' });
    }
  };

  // 登出函数
  const logout = () => {
    // 清除本地存储的token
    localStorage.removeItem('token');
    dispatch({ type: 'LOGOUT' });
  };

  // 更新用户信息
  const updateUser = (userData: Partial<User>) => {
    dispatch({ type: 'UPDATE_USER', payload: userData });
  };

  // 清除错误
  const clearError = () => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

  const contextValue: AuthContextType = {
    state,
    login,
    register,
    sendVerificationCode,
    logout,
    updateUser,
    clearError,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

// 自定义Hook，用于访问Context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};