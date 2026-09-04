/**
 * 语义化设计令牌（Design Tokens）
 *
 * 全项目唯一的设计事实来源。所有组件与屏幕应引用本文件导出的令牌，
 * 禁止在样式文件中直接使用字面 hex 色值。
 *
 * 品牌主色为「生物安全绿」#0A7A52，智能高亮为「琥珀金」#E89A2B，
 * 并单独建立「疫情风险色阶」risk 令牌（低 → 中 → 高 → 极高）。
 */

// ── 色彩（Color）────────────────────────────────────────────
export const colors = {
  // 品牌（生物安全绿）
  primary: '#0A7A52',
  primaryDark: '#075C3E',
  primaryLight: '#E3F4EC',
  primaryLighter: '#F0F9F5',
  primaryGradient: ['#0E8A5E', '#0A7A52'] as const,

  // 辅助（琥珀金 = AI 智能高亮）
  gold: '#E89A2B',
  goldDark: '#B47114',
  goldLight: '#FBF0DC',
  onGold: '#3A2500',

  // 文字（暖调中性）
  textPrimary: '#1F2A24',
  textSecondary: '#4A5650',
  textTertiary: '#7A857F',
  textDisabled: '#B4BCB8',
  textOnPrimary: '#FFFFFF',
  textOnDark: '#FFFFFF',

  // 表面
  background: '#F6F8F6',
  surface: '#FFFFFF',
  surfaceMuted: '#F0F2F0',
  surfaceSoft: '#FAFBF9',

  // 边框
  border: '#E3E7E4',
  borderLight: '#F0F2F0',
  borderStrong: '#C9CFCB',

  // 语义状态
  success: '#1A9E6B',
  successLight: '#E1F5EA',
  successText: '#0A6B4B',
  warning: '#E8910F',
  warningLight: '#FDF1D9',
  warningText: '#7A4A03',
  error: '#E0343A',
  errorLight: '#FDE8E8',
  errorText: '#A31218',
  info: '#2E6FE0',
  infoLight: '#E6EFFC',
  infoText: '#1B4FA8',

  // 疫情风险色阶（低 → 中 → 高 → 极高）
  risk: {
    low: '#1A9E6B',
    lowLight: '#E1F5EA',
    lowText: '#0A6B4B',
    medium: '#E8910F',
    mediumLight: '#FDF1D9',
    mediumText: '#7A4A03',
    high: '#E8671B',
    highLight: '#FDEAD9',
    highText: '#8A3A08',
    critical: '#E0343A',
    criticalLight: '#FDE8E8',
    criticalText: '#A31218',
  } as const,

  // 图表
  chart1: '#0A7A52',
  chart2: '#E8910F',
  chart3: '#2E6FE0',
  chart4: '#E0343A',
  chart5: '#7C5CE0',
  chartPalette: ['#0A7A52', '#E8910F', '#2E6FE0', '#E0343A', '#7C5CE0', '#0E9AA7'] as const,

  // 语义强调色（知识图谱分类等系统色，成对出现：主色 + 浅底色）
  accent: {
    purple: '#8B5CF6',
    purpleLight: '#F3E8FF',
    indigo: '#6366F1',
    indigoLight: '#EDE9FE',
    pink: '#EC4899',
    pinkLight: '#FCE7F3',
    cyan: '#0E9AA7',
    cyanLight: '#DDF5F6',
    orange: '#E8671B',
    orangeLight: '#FDEAD9',
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
    shadowColor: '#0A7A52',
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
