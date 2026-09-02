import React, { createContext, useContext, useReducer, ReactNode, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { authApi, on, off } from '../services/api';

// 用户角色类型
export type UserRole = 'FARMER' | 'INSTITUTION' | 'STUDENT' | 'TEACHER' | 'VETERINARIAN' | 'RESEARCHER' | 'ADMIN';
export type UserSubRole =
  | 'SMALL' | 'COOPERATIVE' | 'ENTERPRISE' // 养殖户子角色
  | 'CDC' | 'RESEARCH_INSTITUTE' | 'SERVICE_PROVIDER' // 机构子角色
  | 'LEARNING_STUDENT' | 'COGNITIVE_INTERN' | 'ADVANCED_INTERN' // 学生子角色
  | 'GENERAL' | 'SPECIALIST' // 兽医子角色
  | 'RESEARCHER_GENERAL' | 'LAB_RESEARCHER' // 科研人员子角色
  | 'SYSTEM'; // 管理员子角色

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
  logout: () => Promise<void>;
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
  
  // 初始化：从 AsyncStorage 加载 accessToken 和 refreshToken
  useEffect(() => {
    const loadToken = async () => {
      try {
        const storedAccessToken = await AsyncStorage.getItem('accessToken');
        if (storedAccessToken) {
          // 兼容旧格式：如果只有 'token' key，也加载
          const storedToken = storedAccessToken;
          const defaultUser: User = {
            id: 'default-user-id',
            phoneNumber: '',
            nickname: '',
            avatar: '',
            roleType: 'FARMER',
            subRole: 'SMALL',
            authStatus: 'UNVERIFIED',
            registrationDate: new Date().toISOString(),
            lastLoginDate: new Date().toISOString(),
          };
          dispatch({
            type: 'LOGIN_SUCCESS',
            payload: {
              user: defaultUser,
              token: storedToken,
            },
          });
        }
      } catch (error) {
        console.error('Failed to load token from AsyncStorage:', error);
      }
    };

    loadToken();

    // 监听 token 过期事件，触发登出
    const handleTokenExpired = () => {
      dispatch({ type: 'LOGOUT' });
    };
    on('TOKEN_EXPIRED', handleTokenExpired);

    return () => {
      off('TOKEN_EXPIRED', handleTokenExpired);
    };
  }, []);

  // 发送验证码函数
  const sendVerificationCode = async (phoneNumber: string) => {
    dispatch({ type: 'LOGIN_REQUEST' });
    try {
      // 调用后端 API 发送验证码
      await authApi.getVerificationCode(phoneNumber);
      // 保存验证码状态标记（前端不再生成/存储验证码，由后端管理）
      setVerificationCodes(prev => ({
        ...prev,
        [phoneNumber]: {
          code: '__sent_by_backend__',
          expiresAt: Date.now() + 5 * 60 * 1000,
        },
      }));
      dispatch({ type: 'CLEAR_ERROR' });
    } catch (error) {
      dispatch({
        type: 'LOGIN_FAILURE',
        payload: error instanceof Error ? error.message : '发送验证码失败，请稍后重试',
      });
    }
  };

  // 登录函数
  const login = async (phoneNumber: string, codeOrRoleType: string, subRole?: any) => {
    dispatch({ type: 'LOGIN_REQUEST' });
    try {
      // 体验角色登录：仍需走真实后端 API
      const isExperienceLogin = codeOrRoleType === 'FARMER' ||
                               codeOrRoleType === 'INSTITUTION' ||
                               codeOrRoleType === 'STUDENT' ||
                               codeOrRoleType === 'TEACHER';

      if (isExperienceLogin) {
        // 体验角色使用默认密码走后端登录接口
        const response: any = await authApi.login({
          phoneNumber,
          password: 'experience123',
        });

        const backendUser = response.data?.user;
        // 兼容新旧格式：优先 accessToken，回退 token
        const accessToken = response.data?.accessToken || response.data?.token;

        if (!accessToken) {
          throw new Error('登录失败：未获取到有效 token');
        }

        const refreshToken = response.data?.refreshToken || null;

        const user: User = {
          id: backendUser?._id || backendUser?.id || `experience-${Date.now()}`,
          phoneNumber: backendUser?.phoneNumber || phoneNumber,
          nickname: backendUser?.nickname || getRoleNickname(codeOrRoleType as UserRole, subRole as UserSubRole),
          avatar: backendUser?.avatar || 'https://s.coze.cn/image/rFqxc53MSiw/',
          roleType: (backendUser?.roleType || codeOrRoleType) as UserRole,
          subRole: (backendUser?.subRole || subRole) as UserSubRole,
          authStatus: (backendUser?.authStatus || 'VERIFIED') as User['authStatus'],
          registrationDate: backendUser?.createdAt || new Date().toISOString(),
          lastLoginDate: backendUser?.lastLoginAt || new Date().toISOString(),
        };

        await AsyncStorage.setItem('accessToken', accessToken);
        if (refreshToken) {
          await AsyncStorage.setItem('refreshToken', refreshToken);
        }
        dispatch({ type: 'LOGIN_SUCCESS', payload: { user, token: accessToken } });
      } else {
        // 普通验证码登录：调用后端登录接口（手机号+密码模式）
        const response: any = await authApi.login({
          phoneNumber,
          password: codeOrRoleType,
        });

        const backendUser = response.data?.user;
        // 兼容新旧格式：优先 accessToken，回退 token
        const accessToken = response.data?.accessToken || response.data?.token;

        if (!accessToken) {
          throw new Error('登录失败：未获取到有效 token');
        }

        const refreshToken = response.data?.refreshToken || null;

        const user: User = {
          id: backendUser?._id || backendUser?.id || '1',
          phoneNumber: backendUser?.phoneNumber || phoneNumber,
          nickname: backendUser?.nickname || '用户',
          avatar: backendUser?.avatar || 'https://s.coze.cn/image/rFqxc53MSiw/',
          roleType: (backendUser?.roleType || 'FARMER') as UserRole,
          subRole: (backendUser?.subRole || 'SMALL') as UserSubRole,
          authStatus: (backendUser?.authStatus || 'UNVERIFIED') as User['authStatus'],
          registrationDate: backendUser?.createdAt || new Date().toISOString(),
          lastLoginDate: backendUser?.lastLoginAt || new Date().toISOString(),
        };

        await AsyncStorage.setItem('accessToken', accessToken);
        if (refreshToken) {
          await AsyncStorage.setItem('refreshToken', refreshToken);
        }
        dispatch({ type: 'LOGIN_SUCCESS', payload: { user, token: accessToken } });
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
      case 'TEACHER':
        return '指导教师';
      default:
        return '体验用户';
    }
  };

  // 注册函数
  const register = async (phoneNumber: string, verificationCode: string, password: string) => {
    dispatch({ type: 'LOGIN_REQUEST' });
    try {
      // 调用后端注册接口
      const response: any = await authApi.register({
        phoneNumber,
        password,
        roleType: 'FARMER',
        subRole: 'SMALL',
      });

      const backendUser = response.data?.user;
      // 兼容新旧格式：优先 accessToken，回退 token
      const accessToken = response.data?.accessToken || response.data?.token;

      if (!accessToken) {
        throw new Error('注册失败：未获取到有效 token');
      }

      const refreshToken = response.data?.refreshToken || null;

      const user: User = {
        id: backendUser?._id || backendUser?.id || '1',
        phoneNumber: backendUser?.phoneNumber || phoneNumber,
        nickname: backendUser?.nickname || '用户',
        avatar: backendUser?.avatar || 'https://s.coze.cn/image/rFqxc53MSiw/',
        roleType: (backendUser?.roleType || 'FARMER') as UserRole,
        subRole: (backendUser?.subRole || 'SMALL') as UserSubRole,
        authStatus: (backendUser?.authStatus || 'UNVERIFIED') as User['authStatus'],
        registrationDate: backendUser?.createdAt || new Date().toISOString(),
        lastLoginDate: backendUser?.lastLoginAt || new Date().toISOString(),
      };

      await AsyncStorage.setItem('accessToken', accessToken);
      if (refreshToken) {
        await AsyncStorage.setItem('refreshToken', refreshToken);
      }
      dispatch({ type: 'LOGIN_SUCCESS', payload: { user, token: accessToken } });
    } catch (error) {
      dispatch({ type: 'LOGIN_FAILURE', payload: error instanceof Error ? error.message : '注册失败，请稍后重试' });
    }
  };

  // 登出函数
  const logout = async () => {
    // 清除 AsyncStorage 中的 accessToken 和 refreshToken
    try {
      await AsyncStorage.multiRemove(['accessToken', 'refreshToken']);
    } catch (error) {
      console.error('Failed to remove tokens from AsyncStorage:', error);
    }
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