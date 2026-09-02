/**
 * 多模态融合诊断服务
 *
 * 将百度图像理解结果、用户文本症状和环境数据融合为结构化诊断输入，
 * 供 aiService.diagnose() 使用。纯函数，不涉及 API 调用。
 */

// ===========================================================================
// 类型定义
// ===========================================================================

/** 图像分析中的视觉发现 */
export interface VisualFinding {
  keyword: string;
  score: number;
  description?: string;
}

/** 图像分析结果 */
export interface ImageAnalysisResult {
  description?: string;
  keywords?: string[];
  visualFindings?: VisualFinding[];
  result?: Array<{
    keyword?: string;
    score?: number;
    baike_info?: { description?: string };
  }>;
}

/** 图像 + 文本融合结果 */
export interface FusedImageText {
  visualSymptoms: string[];
  reportedSymptoms: string[];
  confidence: number;
  fusedDescription: string;
}

/** 完整诊断输入 */
export interface DiagnosisInput {
  symptoms: string[];
  visualFindings: string[];
  environmentalFactors: string[];
  fullContext: string;
}

// ===========================================================================
// 症状关键词词库（用于图像描述中的症状提取）
// ===========================================================================

const SYMPTOM_KEYWORDS = [
  // 外观类
  '鸡冠发紫', '鸡冠苍白', '肉髯肿胀', '头部水肿', '眼睑肿胀',
  '羽毛蓬乱', '羽毛脱落', '翅膀下垂', '消瘦', '脱水',
  '脚鳞出血', '关节肿胀', '皮肤痘疹', '痘痂', '结痂',
  // 行为类
  '精神沉郁', '精神萎靡', '蹲伏', '扎堆', '扭颈', '转圈',
  '瘫痪', '跛行', '劈叉姿势', '伸颈张口', '甩头', '甩鼻',
  // 呼吸类
  '呼吸困难', '咳嗽', '啰音', '喷嚏', '喘气', '气管炎症',
  '气囊浑浊', '气囊炎',
  // 消化类
  '腹泻', '稀粪', '绿色稀粪', '白色稀粪', '血便', '红色稀粪',
  '食欲废绝', '食欲减退', '饮水增加',
  // 眼部类
  '流泪', '眼泡沫', '虹膜褪色', '瞳孔不规则', '失明', '灰眼',
  // 病理类
  '出血', '肠道出血', '盲肠出血', '肝脏肿瘤', '脾脏肿大',
  '肾肿大', '花斑肾', '法氏囊肿大', '腺胃出血', '胰腺坏死',
  // 产蛋类
  '产蛋下降', '软壳蛋', '畸形蛋', '沙壳蛋', '褪色蛋',
  // 环境类
  '潮湿', '拥挤', '粪便堆积', '通风不良', '脏乱'
];

// ===========================================================================
// 融合函数
// ===========================================================================

/**
 * 将百度图像理解返回的结构化结果与用户输入症状融合
 *
 * @param imageAnalysis   — 百度图像分析结果（description / keywords / visualFindings / result）
 * @param symptoms        — 用户文本输入的症状（字符串或字符串数组）
 * @returns 融合结果 { visualSymptoms[], reportedSymptoms[], confidence, fusedDescription }
 */
export function fuseImageAndText(
  imageAnalysis: ImageAnalysisResult | null | undefined,
  symptoms: string | string[]
): FusedImageText {
  // --- 1. 提取视觉症状 ---
  const visualSymptoms: string[] = [];

  if (imageAnalysis) {
    // 从 description 中提取症状关键词
    if (imageAnalysis.description) {
      SYMPTOM_KEYWORDS.forEach(keyword => {
        if (imageAnalysis!.description!.includes(keyword) && !visualSymptoms.includes(keyword)) {
          visualSymptoms.push(keyword);
        }
      });
    }

    // 从 keywords 数组中提取
    if (imageAnalysis.keywords && Array.isArray(imageAnalysis.keywords)) {
      imageAnalysis.keywords.forEach(kw => {
        const matched = SYMPTOM_KEYWORDS.find(sk => kw.includes(sk) || sk.includes(kw));
        if (matched && !visualSymptoms.includes(matched)) {
          visualSymptoms.push(matched);
        }
      });
    }

    // 从 visualFindings 中提取
    if (imageAnalysis.visualFindings && Array.isArray(imageAnalysis.visualFindings)) {
      imageAnalysis.visualFindings.forEach(vf => {
        if (vf.keyword && !visualSymptoms.includes(vf.keyword)) {
          visualSymptoms.push(vf.keyword);
        }
        // 也从 description 中再提取一轮
        if (vf.description) {
          SYMPTOM_KEYWORDS.forEach(keyword => {
            if (vf.description!.includes(keyword) && !visualSymptoms.includes(keyword)) {
              visualSymptoms.push(keyword);
            }
          });
        }
      });
    }

    // 兼容百度图像分析 result 格式
    if (imageAnalysis.result && Array.isArray(imageAnalysis.result)) {
      imageAnalysis.result.forEach(item => {
        if (item.keyword && !visualSymptoms.includes(item.keyword)) {
          visualSymptoms.push(item.keyword);
        }
        if (item.baike_info?.description) {
          SYMPTOM_KEYWORDS.forEach(keyword => {
            if (item.baike_info!.description!.includes(keyword) && !visualSymptoms.includes(keyword)) {
              visualSymptoms.push(keyword);
            }
          });
        }
      });
    }
  }

  // --- 2. 提取用户报告症状 ---
  const reportedSymptoms: string[] = normalizeSymptomArray(symptoms);

  // --- 3. 去重合并，计算综合置信度 ---
  const visualSet = new Set(visualSymptoms);
  const reportedSet = new Set(reportedSymptoms);

  // 视觉独有症状
  const visualOnly = visualSymptoms.filter(s => !reportedSet.has(s));
  // 报告独有症状
  const reportedOnly = reportedSymptoms.filter(s => !visualSet.has(s));
  // 交叉验证症状（视觉和报告都提到，置信度最高）
  const overlap = visualSymptoms.filter(s => reportedSet.has(s));

  // 综合置信度计算：
  // - 交叉验证症状权重 0.9
  // - 仅视觉症状权重 0.6
  // - 仅报告症状权重 0.5
  const totalWeight =
    overlap.length * 0.9 +
    visualOnly.length * 0.6 +
    reportedOnly.length * 0.5;
  const totalSymptoms = overlap.length + visualOnly.length + reportedOnly.length;
  const confidence = totalSymptoms > 0
    ? Math.min(totalWeight / totalSymptoms, 1.0)
    : 0;

  // --- 4. 生成融合描述 ---
  const allSymptoms = [...new Set([...visualSymptoms, ...reportedSymptoms])];
  const fusedDescription = generateFusedDescription({
    visualSymptoms,
    reportedSymptoms,
    overlap,
    visualOnly,
    reportedOnly,
    allSymptoms,
    confidence
  });

  return {
    visualSymptoms,
    reportedSymptoms,
    confidence: parseFloat(confidence.toFixed(3)),
    fusedDescription
  };
}

/**
 * 整合图像分析 + 文本症状 + 环境数据，生成结构化诊断输入
 *
 * @param imageResults   — 图像分析结果数组
 * @param symptoms       — 用户文本输入的症状
 * @param environment    — 环境数据（键值对或描述字符串）
 * @returns 结构化诊断输入 { symptoms[], visualFindings[], environmentalFactors[], fullContext }
 */
export function prepareDiagnosisInput(
  imageResults: (ImageAnalysisResult | null | undefined)[] | null | undefined,
  symptoms: string | string[],
  environment: Record<string, unknown> | string | null | undefined
): DiagnosisInput {
  // --- 1. 融合所有图像结果 ---
  const allVisualSymptoms: string[] = [];
  const allVisualDescriptions: string[] = [];

  if (imageResults && Array.isArray(imageResults)) {
    imageResults.forEach(img => {
      const fused = fuseImageAndText(img || null, []);
      allVisualSymptoms.push(...fused.visualSymptoms);
      if (img?.description) allVisualDescriptions.push(img.description);
    });
  }

  const uniqueVisualSymptoms = [...new Set(allVisualSymptoms)];

  // --- 2. 处理用户症状 ---
  const userSymptoms = normalizeSymptomArray(symptoms);

  // --- 3. 处理环境数据 ---
  const environmentalFactors = normalizeEnvironment(environment);

  // --- 4. 合并去重症状 ---
  const allSymptoms = [...new Set([...userSymptoms, ...uniqueVisualSymptoms])];

  // --- 5. 生成完整上下文描述 ---
  const fullContext = buildFullContext(allSymptoms, uniqueVisualSymptoms, environmentalFactors);

  return {
    symptoms: allSymptoms,
    visualFindings: uniqueVisualSymptoms,
    environmentalFactors,
    fullContext
  };
}

// ===========================================================================
// 内部工具函数
// ===========================================================================

/**
 * 将症状输入规范化为字符串数组
 */
function normalizeSymptomArray(symptoms: string | string[]): string[] {
  if (!symptoms) return [];
  if (Array.isArray(symptoms)) {
    return symptoms
      .map(s => s.trim())
      .filter(Boolean);
  }
  if (typeof symptoms === 'string') {
    // 尝试按逗号、顿号、分号分割
    return symptoms
      .split(/[,、;，；\s]+/)
      .map(s => s.trim())
      .filter(Boolean);
  }
  return [];
}

/**
 * 将环境数据规范化为描述字符串数组
 */
function normalizeEnvironment(
  environment: Record<string, unknown> | string | null | undefined
): string[] {
  if (!environment) return [];
  if (typeof environment === 'string') {
    return environment ? [environment] : [];
  }
  if (typeof environment === 'object') {
    const factors: string[] = [];
    const entries = Object.entries(environment);

    for (const [key, value] of entries) {
      if (value === null || value === undefined || value === '') continue;

      const label = ENV_LABEL_MAP[key] || key;

      if (typeof value === 'number') {
        const unit = ENV_UNIT_MAP[key] || '';
        factors.push(`${label}: ${value}${unit}`);
      } else if (typeof value === 'boolean') {
        factors.push(`${label}: ${value ? '是' : '否'}`);
      } else if (Array.isArray(value)) {
        value.forEach(v => {
          if (v) factors.push(`${label}: ${String(v)}`);
        });
      } else {
        factors.push(`${label}: ${String(value)}`);
      }
    }

    return factors;
  }

  return [];
}

/** 环境指标中文标签映射 */
const ENV_LABEL_MAP: Record<string, string> = {
  temperature: '温度',
  humidity: '湿度',
  ammonia: '氨气浓度',
  co2: '二氧化碳浓度',
  pm25: 'PM2.5',
  pm10: 'PM10',
  ventilation: '通风状况',
  density: '饲养密度',
  lightIntensity: '光照强度',
  noise: '噪音',
  waterQuality: '水质',
  feedQuality: '饲料质量',
  hygiene: '卫生状况',
  temperatureFluctuation: '温差'
};

/** 环境指标单位映射 */
const ENV_UNIT_MAP: Record<string, string> = {
  temperature: '°C',
  humidity: '%',
  ammonia: 'ppm',
  co2: 'ppm',
  pm25: 'μg/m³',
  pm10: 'μg/m³',
  lightIntensity: 'lux',
  noise: 'dB'
};

/**
 * 生成融合描述文本
 */
function generateFusedDescription(data: {
  visualSymptoms: string[];
  reportedSymptoms: string[];
  overlap: string[];
  visualOnly: string[];
  reportedOnly: string[];
  allSymptoms: string[];
  confidence: number;
}): string {
  const parts: string[] = [];

  // 总体描述
  parts.push(`共收集到 ${data.allSymptoms.length} 项症状信息。`);

  // 交叉验证
  if (data.overlap.length > 0) {
    parts.push(`图像分析与用户描述交叉验证症状（${data.overlap.length} 项）：${data.overlap.join('、')}。`);
  }

  // 仅视觉发现
  if (data.visualOnly.length > 0) {
    parts.push(`图像额外发现（${data.visualOnly.length} 项）：${data.visualOnly.join('、')}。`);
  }

  // 仅用户报告
  if (data.reportedOnly.length > 0) {
    parts.push(`用户报告但图像未直接观察到的症状（${data.reportedOnly.length} 项）：${data.reportedOnly.join('、')}。`);
  }

  // 置信度评级
  const level = data.confidence >= 0.7
    ? '高（图像与报告高度一致）'
    : data.confidence >= 0.4
      ? '中（部分症状交叉验证）'
      : '低（信息有限，建议补充观察）';
  parts.push(`综合置信度：${(data.confidence * 100).toFixed(1)}%，评级：${level}。`);

  return parts.join('');
}

/**
 * 生成完整上下文描述
 */
function buildFullContext(
  symptoms: string[],
  visualFindings: string[],
  environmentalFactors: string[]
): string {
  const parts: string[] = [];

  // 症状概览
  parts.push(`【症状汇总】共 ${symptoms.length} 项：${symptoms.join('、')}。`);

  // 视觉发现
  if (visualFindings.length > 0) {
    parts.push(`【视觉发现】${visualFindings.length} 项：${visualFindings.join('、')}。`);
  }

  // 环境因素
  if (environmentalFactors.length > 0) {
    parts.push(`【环境因素】${environmentalFactors.join('；')}。`);
  }

  return parts.join('\n');
}
