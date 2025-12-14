import React, { createContext, useContext, useReducer, ReactNode, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// 主题类型
export type Theme = 'light' | 'dark' | 'system';

// 语言类型
export type Language = 'zh-CN' | 'en-US';

// 主题状态类型
interface ThemeState {
  theme: Theme;
  language: Language;
  fontSize: 'small' | 'medium' | 'large';
}

// 操作类型
type ThemeAction =
  | { type: 'SET_THEME'; payload: Theme }
  | { type: 'SET_LANGUAGE'; payload: Language }
  | { type: 'SET_FONT_SIZE'; payload: 'small' | 'medium' | 'large' }
  | { type: 'LOAD_THEME_FROM_STORAGE'; payload: Partial<ThemeState> };

// 初始状态
const initialState: ThemeState = {
  theme: 'light',
  language: 'zh-CN',
  fontSize: 'medium',
};

// Reducer函数
const themeReducer = (state: ThemeState, action: ThemeAction): ThemeState => {
  switch (action.type) {
    case 'SET_THEME':
      return {
        ...state,
        theme: action.payload,
      };
    case 'SET_LANGUAGE':
      return {
        ...state,
        language: action.payload,
      };
    case 'SET_FONT_SIZE':
      return {
        ...state,
        fontSize: action.payload,
      };
    case 'LOAD_THEME_FROM_STORAGE':
      return {
        ...state,
        ...action.payload,
      };
    default:
      return state;
  }
};

// Context类型
interface ThemeContextType {
  state: ThemeState;
  setTheme: (theme: Theme) => void;
  setLanguage: (language: Language) => void;
  setFontSize: (fontSize: 'small' | 'medium' | 'large') => void;
}

// 创建Context
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// Provider组件
interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(themeReducer, initialState);

  // 从AsyncStorage加载主题设置
  useEffect(() => {
    const loadThemeFromStorage = async () => {
      try {
        const theme = await AsyncStorage.getItem('theme');
        const language = await AsyncStorage.getItem('language');
        const fontSize = await AsyncStorage.getItem('fontSize');
        
        const loadedSettings: Partial<ThemeState> = {};
        if (theme) loadedSettings.theme = theme as Theme;
        if (language) loadedSettings.language = language as Language;
        if (fontSize) loadedSettings.fontSize = fontSize as 'small' | 'medium' | 'large';
        
        if (Object.keys(loadedSettings).length > 0) {
          dispatch({ type: 'LOAD_THEME_FROM_STORAGE', payload: loadedSettings });
        }
      } catch (error) {
        console.error('Failed to load theme settings:', error);
      }
    };
    
    loadThemeFromStorage();
  }, []);

  // 设置主题
  const setTheme = async (theme: Theme) => {
    dispatch({ type: 'SET_THEME', payload: theme });
    try {
      await AsyncStorage.setItem('theme', theme);
    } catch (error) {
      console.error('Failed to save theme to storage:', error);
    }
  };

  // 设置语言
  const setLanguage = async (language: Language) => {
    dispatch({ type: 'SET_LANGUAGE', payload: language });
    try {
      await AsyncStorage.setItem('language', language);
    } catch (error) {
      console.error('Failed to save language to storage:', error);
    }
  };

  // 设置字体大小
  const setFontSize = async (fontSize: 'small' | 'medium' | 'large') => {
    dispatch({ type: 'SET_FONT_SIZE', payload: fontSize });
    try {
      await AsyncStorage.setItem('fontSize', fontSize);
    } catch (error) {
      console.error('Failed to save fontSize to storage:', error);
    }
  };

  const contextValue: ThemeContextType = {
    state,
    setTheme,
    setLanguage,
    setFontSize,
  };

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
};

// 自定义Hook，用于访问Context
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};