/**
 * 语义化设计令牌（Design Tokens）
 *
 * 全项目唯一的设计事实来源。所有组件与屏幕应引用本文件导出的令牌，
 * 禁止在样式文件中直接使用字面 hex 色值。
 *
 * 品牌主色沿用已确认的 #2DBBA1（青色），深色强调 #1F5E52（深青绿）。
 */

// ── 色彩（Color）────────────────────────────────────────────
export const colors = {
  // 品牌
  primary: '#2DBBA1',
  primaryDark: '#1F5E52',
  primaryLight: '#E6F7F3',
  primaryLighter: '#F0FAF7',
  primaryGradient: ['#3BCCA5', '#2DBBA1'] as const,

  // 文字
  textPrimary: '#111827',
  textSecondary: '#4B5563',
  textTertiary: '#6B7280',
  textDisabled: '#9CA3AF',
  textOnPrimary: '#FFFFFF',
  textOnDark: '#FFFFFF',

  // 表面
  background: '#F6F8F7',
  surface: '#FFFFFF',
  surfaceMuted: '#F3F4F6',
  surfaceSoft: '#F9FAFB',

  // 边框
  border: '#E5E7EB',
  borderLight: '#F3F4F6',
  borderStrong: '#D1D5DB',

  // 语义状态
  success: '#10B981',
  successLight: '#D1FAE5',
  successText: '#047857',
  warning: '#F59E0B',
  warningLight: '#FEF3C7',
  warningText: '#92400E',
  error: '#EF4444',
  errorLight: '#FEE2E2',
  errorText: '#B91C1C',
  info: '#3B82F6',
  infoLight: '#DBEAFE',
  infoText: '#1D4ED8',

  // 图表
  chart1: '#2DBBA1',
  chart2: '#F59E0B',
  chart3: '#3B82F6',
  chart4: '#EF4444',
  chart5: '#8B5CF6',
  chartPalette: ['#2DBBA1', '#F59E0B', '#3B82F6', '#EF4444', '#8B5CF6', '#10B981'] as const,

  // 语义强调色（知识图谱分类 / 风险等级等系统色，成对出现：主色 + 浅底色）
  accent: {
    purple: '#8B5CF6',
    purpleLight: '#F3E8FF',
    indigo: '#6366F1',
    indigoLight: '#EDE9FE',
    pink: '#EC4899',
    pinkLight: '#FCE7F3',
    cyan: '#06B6D4',
    cyanLight: '#CFFAFE',
    orange: '#F97316',
    orangeLight: '#FFF3E0',
    lime: '#84CC16',
  } as const,

  // 遮罩
  overlay: 'rgba(0, 0, 0, 0.5)',
  overlayLight: 'rgba(0, 0, 0, 0.4)',
} as const;

// ── 间距（Spacing，8pt 网格）────────────────────────────────
export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
  huge: 40,
} as const;

// ── 圆角（Radius）───────────────────────────────────────────
export const radii = {
  xs: 6,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  full: 9999,
} as const;

// ── 字体（Typography）───────────────────────────────────────
export const typography = {
  size: {
    caption: 12,
    small: 13,
    body: 14,
    bodyLarge: 16,
    subtitle: 18,
    title: 20,
    heading: 24,
    display: 28,
    hero: 32,
  },
  weight: {
    regular: '400' as const,
    medium: '500' as const,
    semibold: '600' as const,
    bold: '700' as const,
  },
  lineHeight: {
    tight: 18,
    normal: 20,
    relaxed: 22,
    loose: 24,
    display: 28,
  },
} as const;

// ── 阴影（Elevation）────────────────────────────────────────
export const shadows = {
  none: {
    shadowColor: 'transparent',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
  sm: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  md: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  lg: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  primary: {
    shadowColor: '#2DBBA1',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 4,
  },
} as const;

// ── 尺寸（组件规格）─────────────────────────────────────────
export const component = {
  buttonHeight: {
    small: 36,
    medium: 44,
    large: 48,
  },
  inputHeight: {
    small: 40,
    medium: 48,
    large: 56,
  },
  headerHeight: 56,
  tabBarHeight: 60,
  touchTargetMin: 44,
} as const;

// 汇总导出（便于 `import { theme } from '../theme'` 一次性引入）
export const theme = {
  colors,
  spacing,
  radii,
  typography,
  shadows,
  component,
} as const;

export default theme;
