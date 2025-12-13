import React, { createContext, useContext, useReducer, ReactNode } from 'react';

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
  | { type: 'SET_FONT_SIZE'; payload: 'small' | 'medium' | 'large' };

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

  // 设置主题
  const setTheme = (theme: Theme) => {
    dispatch({ type: 'SET_THEME', payload: theme });
    // 这里可以保存主题到本地存储
    localStorage.setItem('theme', theme);
  };

  // 设置语言
  const setLanguage = (language: Language) => {
    dispatch({ type: 'SET_LANGUAGE', payload: language });
    // 这里可以保存语言到本地存储
    localStorage.setItem('language', language);
  };

  // 设置字体大小
  const setFontSize = (fontSize: 'small' | 'medium' | 'large') => {
    dispatch({ type: 'SET_FONT_SIZE', payload: fontSize });
    // 这里可以保存字体大小到本地存储
    localStorage.setItem('fontSize', fontSize);
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