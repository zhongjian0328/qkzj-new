// API服务文件，用于处理所有API请求

import AsyncStorage from '@react-native-async-storage/async-storage';

// API基础URL
const API_BASE_URL = 'https://api.example.com';

// API响应类型
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  code?: number;
}

// 用户信息类型
export interface UserInfo {
  id: string;
  phone: string;
  name: string;
  role: string;
  token: string;
}

// 登录请求参数
interface LoginParams {
  phone: string;
  code: string;
}

// 注册请求参数
interface RegisterParams {
  phone: string;
  code: string;
  password: string;
}

// 发送验证码请求参数
interface SendCodeParams {
  phone: string;
  type: 'login' | 'register';
}

// 通用请求方法
const request = async <T>(url: string, options: RequestInit = {}): Promise<ApiResponse<T>> => {
  try {
    const token = await AsyncStorage.getItem('userToken');
    
    const headers = {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),
      ...options.headers,
    };

    const response = await fetch(`${API_BASE_URL}${url}`, {
      ...options,
      headers,
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('API请求错误:', error);
    return {
      success: false,
      message: '网络请求失败，请稍后重试',
    };
  }
};

// 登录API
export const loginApi = async (params: LoginParams): Promise<ApiResponse<UserInfo>> => {
  // 模拟API调用，实际项目中替换为真实API请求
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        data: {
          id: '123456',
          phone: params.phone,
          name: '测试用户',
          role: 'FARMER',
          token: 'mock-token-123456',
        },
        message: '登录成功',
      });
    }, 500);
  });
  
  // 实际API请求示例
  // return request<UserInfo>('/auth/login', {
  //   method: 'POST',
  //   body: JSON.stringify(params),
  // });
};

// 注册API
export const registerApi = async (params: RegisterParams): Promise<ApiResponse<UserInfo>> => {
  // 模拟API调用，实际项目中替换为真实API请求
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        data: {
          id: '123456',
          phone: params.phone,
          name: '新用户',
          role: '',
          token: 'mock-token-123456',
        },
        message: '注册成功',
      });
    }, 500);
  });
  
  // 实际API请求示例
  // return request<UserInfo>('/auth/register', {
  //   method: 'POST',
  //   body: JSON.stringify(params),
  // });
};

// 发送验证码API
export const sendCodeApi = async (params: SendCodeParams): Promise<ApiResponse<null>> => {
  // 模拟API调用，实际项目中替换为真实API请求
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        message: '验证码发送成功',
      });
    }, 300);
  });
  
  // 实际API请求示例
  // return request<null>('/auth/send-code', {
  //   method: 'POST',
  //   body: JSON.stringify(params),
  // });
};

// 获取当前用户信息
export const getCurrentUser = async (): Promise<UserInfo | null> => {
  try {
    const userInfoStr = await AsyncStorage.getItem('userInfo');
    if (userInfoStr) {
      return JSON.parse(userInfoStr);
    }
    return null;
  } catch (error) {
    console.error('获取用户信息失败:', error);
    return null;
  }
};

// 保存用户信息
export const saveUserInfo = async (userInfo: UserInfo): Promise<void> => {
  try {
    await AsyncStorage.setItem('userInfo', JSON.stringify(userInfo));
    await AsyncStorage.setItem('userToken', userInfo.token);
  } catch (error) {
    console.error('保存用户信息失败:', error);
  }
};

// AI诊断请求参数
interface AIDiagnosisParams {
  imageUri: string;
  bodyPart: string;
  studentDiagnosis?: string;
}

// 诊断结果类型
export interface DiagnosisResult {
  mainDisease: {
    name: string;
    summary: string;
    confidence: number;
    imageUrl: string;
  };
  otherDiseases: Array<{
    name: string;
    confidence: number;
  }>;
}

// AI诊断API
export const aiDiagnosisApi = async (params: AIDiagnosisParams): Promise<ApiResponse<DiagnosisResult>> => {
  // 模拟API调用，实际项目中替换为真实API请求
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        data: {
          mainDisease: {
            name: '新城疫',
            summary: '一种高度传染性的病毒性疾病，主要影响禽类的呼吸系统和神经系统。',
            confidence: 95,
            imageUrl: 'https://s.coze.cn/image/c6EqBdTyktM/',
          },
          otherDiseases: [
            { name: '禽流感', confidence: 68 },
            { name: '传染性支气管炎', confidence: 45 },
          ],
        },
        message: '诊断成功',
      });
    }, 1500);
  });
  
  // 实际API请求示例
  // const formData = new FormData();
  // formData.append('image', {
  //   uri: params.imageUri,
  //   type: 'image/jpeg',
  //   name: 'diagnosis.jpg',
  // });
  // formData.append('bodyPart', params.bodyPart);
  // if (params.studentDiagnosis) {
  //   formData.append('studentDiagnosis', params.studentDiagnosis);
  // }
  // 
  // return request<DiagnosisResult>('/ai/diagnosis', {
  //   method: 'POST',
  //   body: formData,
  //   headers: {
  //     'Content-Type': 'multipart/form-data',
  //   },
  // });
};

// 保存诊断结果API
export const saveDiagnosisApi = async (diagnosisResult: DiagnosisResult): Promise<ApiResponse<{ id: string }>> => {
  // 模拟API调用，实际项目中替换为真实API请求
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        data: { id: `diagnosis-${Date.now()}` },
        message: '诊断结果已保存',
      });
    }, 500);
  });
  
  // 实际API请求示例
  // return request<{ id: string }>('/diagnosis/save', {
  //   method: 'POST',
  //   body: JSON.stringify(diagnosisResult),
  // });
};

// 诊断历史记录类型
export interface DiagnosisHistoryItem {
  id: string;
  diagnosisTime: string;
  mainDisease: string;
  confidence: number;
  bodyPart: string;
  imageUrl: string;
  status: string;
}

// 获取诊断历史记录API
export const getDiagnosisHistoryApi = async (): Promise<ApiResponse<DiagnosisHistoryItem[]>> => {
  // 模拟API调用，实际项目中替换为真实API请求
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        data: [
          {
            id: 'diagnosis-20240115-001',
            diagnosisTime: '2024-01-15 14:30',
            mainDisease: '新城疫',
            confidence: 95,
            bodyPart: '呼吸道',
            imageUrl: 'https://s.coze.cn/image/c6EqBdTyktM/',
            status: '已诊断',
          },
          {
            id: 'diagnosis-20240114-001',
            diagnosisTime: '2024-01-14 09:15',
            mainDisease: '禽流感',
            confidence: 88,
            bodyPart: '羽毛',
            imageUrl: 'https://s.coze.cn/image/c6EqBdTyktM/',
            status: '已诊断',
          },
          {
            id: 'diagnosis-20240113-001',
            diagnosisTime: '2024-01-13 16:45',
            mainDisease: '传染性支气管炎',
            confidence: 75,
            bodyPart: '呼吸道',
            imageUrl: 'https://s.coze.cn/image/c6EqBdTyktM/',
            status: '已诊断',
          },
        ],
        message: '获取诊断历史记录成功',
      });
    }, 800);
  });
  
  // 实际API请求示例
  // return request<DiagnosisHistoryItem[]>('/diagnosis/history', {
  //   method: 'GET',
  // });
};

// 获取诊断详情API
export const getDiagnosisDetailApi = async (diagnosisId: string): Promise<ApiResponse<DiagnosisResult>> => {
  // 模拟API调用，实际项目中替换为真实API请求
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        data: {
          mainDisease: {
            name: '新城疫',
            summary: '一种高度传染性的病毒性疾病，主要影响禽类的呼吸系统和神经系统。',
            confidence: 95,
            imageUrl: 'https://s.coze.cn/image/c6EqBdTyktM/',
          },
          otherDiseases: [
            { name: '禽流感', confidence: 68 },
            { name: '传染性支气管炎', confidence: 45 },
          ],
        },
        message: '获取诊断详情成功',
      });
    }, 500);
  });
  
  // 实际API请求示例
  // return request<DiagnosisResult>(`/diagnosis/detail/${diagnosisId}`, {
  //   method: 'GET',
  // });
};

// 获取治疗方案API
export const getTreatmentPlanApi = async (diagnosisId: string): Promise<ApiResponse<{ plan: string }>> => {
  // 模拟API调用，实际项目中替换为真实API请求
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        data: {
          plan: '1. 立即隔离病禽\n2. 使用抗病毒药物\n3. 加强环境消毒\n4. 接种疫苗',
        },
        message: '获取治疗方案成功',
      });
    }, 500);
  });
  
  // 实际API请求示例
  // return request<{ plan: string }>(`/treatment/plan/${diagnosisId}`, {
  //   method: 'GET',
  // });
};

// 确诊方案推荐类型
export interface ConfirmationPlan {
  level: '紧急' | '重要' | '深入';
  name: string;
  description: string;
  items: Array<{
    name: string;
    method: string;
    timeNode: string;
    sampleRequirement: string;
  }>;
}

// 获取确诊方案推荐API
export const getConfirmationPlanApi = async (diagnosisId: string): Promise<ApiResponse<ConfirmationPlan[]>> => {
  // 模拟API调用，实际项目中替换为真实API请求
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        data: [
          {
            level: '紧急',
            name: '快速检测方案',
            description: '用于快速初步确认主要病原体，适合现场检测',
            items: [
              {
                name: '新城疫病毒抗原检测',
                method: '胶体金试纸条',
                timeNode: '2小时内',
                sampleRequirement: '呼吸道拭子、粪便样本'
              },
              {
                name: '禽流感病毒抗原检测',
                method: '胶体金试纸条',
                timeNode: '2小时内',
                sampleRequirement: '呼吸道拭子、泄殖腔拭子'
              }
            ]
          },
          {
            level: '重要',
            name: '实验室检测方案',
            description: '用于实验室精确检测，确认具体病原类型和血清型',
            items: [
              {
                name: 'RT-PCR检测',
                method: '实时荧光定量PCR',
                timeNode: '12小时内',
                sampleRequirement: '新鲜病料（肺、肾、脑等）'
              },
              {
                name: '病毒分离鉴定',
                method: '鸡胚接种',
                timeNode: '3-5天',
                sampleRequirement: '新鲜病料，保存于冰盒中'
              }
            ]
          },
          {
            level: '深入',
            name: '分子生物学检测方案',
            description: '用于深入研究病原体的分子特征和变异情况',
            items: [
              {
                name: '基因测序',
                method: '高通量测序',
                timeNode: '7-10天',
                sampleRequirement: '纯化病毒样本'
              },
              {
                name: '血清学检测',
                method: 'ELISA',
                timeNode: '5-7天',
                sampleRequirement: '血清样本'
              }
            ]
          }
        ],
        message: '获取确诊方案推荐成功',
      });
    }, 500);
  });
  
  // 实际API请求示例
  // return request<ConfirmationPlan[]>(`/diagnosis/confirmation-plan/${diagnosisId}`, {
  //   method: 'GET',
  // });
};

// 混合感染风险评估类型
export interface MixedInfectionRisk {
  riskLevel: '低' | '中' | '高' | '极高';
  infectionCombination: string;
  probability: number;
  description: string;
  recommendedAction: string;
}

// 获取混合感染风险评估API
export const getMixedInfectionRiskApi = async (diagnosisId: string): Promise<ApiResponse<MixedInfectionRisk[]>> => {
  // 模拟API调用，实际项目中替换为真实API请求
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        data: [
          {
            riskLevel: '极高',
            infectionCombination: '新城疫 + 禽流感',
            probability: 85,
            description: '两种高度传染性疾病混合感染，死亡率极高，传播速度快',
            recommendedAction: '立即隔离所有病禽，紧急消毒，联系当地疫控部门'
          },
          {
            riskLevel: '高',
            infectionCombination: '新城疫 + 传染性支气管炎',
            probability: 75,
            description: '呼吸系统双重感染，症状严重，治疗难度大',
            recommendedAction: '强化呼吸道药物治疗，提高免疫力，加强通风'
          },
          {
            riskLevel: '中',
            infectionCombination: '禽流感 + 大肠杆菌',
            probability: 60,
            description: '病毒与细菌混合感染，易引发败血症',
            recommendedAction: '联合使用抗病毒和抗菌药物，注意环境卫生'
          }
        ],
        message: '获取混合感染风险评估成功',
      });
    }, 500);
  });
  
  // 实际API请求示例
  // return request<MixedInfectionRisk[]>(`/diagnosis/mixed-infection-risk/${diagnosisId}`, {
  //   method: 'GET',
  // });
};

// 应急防控方案类型
export interface EmergencyPlan {
  timePeriod: '0-24小时' | '1-7天' | '长期防控';
  title: string;
  description: string;
  measures: Array<{
    category: string;
    items: Array<{
      name: string;
      details: string;
    }>;
  }>;
}

// 获取应急防控方案API
export const getEmergencyPlanApi = async (diagnosisId: string): Promise<ApiResponse<EmergencyPlan[]>> => {
  // 模拟API调用，实际项目中替换为真实API请求
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        data: [
          {
            timePeriod: '0-24小时',
            title: '紧急控制措施',
            description: '发病初期的紧急处理，防止疫情扩散',
            measures: [
              {
                category: '隔离措施',
                items: [
                  {
                    name: '病禽隔离',
                    details: '立即将病禽隔离到单独的隔离舍，与健康禽群完全分开'
                  },
                  {
                    name: '人员隔离',
                    details: '限制人员进出养殖场，对进出人员进行严格消毒'
                  },
                  {
                    name: '区域隔离',
                    details: '对养殖场进行分区管理，设置警示标识'
                  }
                ]
              },
              {
                category: '消毒措施',
                items: [
                  {
                    name: '环境消毒',
                    details: '使用0.5%过氧乙酸溶液对养殖场环境进行全面喷洒消毒'
                  },
                  {
                    name: '设备消毒',
                    details: '对饲喂设备、饮水设备等进行彻底清洗和消毒'
                  },
                  {
                    name: '车辆消毒',
                    details: '对进出养殖场的车辆进行严格的喷雾消毒'
                  }
                ]
              },
              {
                category: '紧急治疗',
                items: [
                  {
                    name: '抗病毒治疗',
                    details: '使用干扰素和抗病毒药物进行紧急治疗'
                  },
                  {
                    name: '对症治疗',
                    details: '根据症状使用退烧药、止咳药等进行对症治疗'
                  }
                ]
              }
            ]
          },
          {
            timePeriod: '1-7天',
            title: '短期治疗方案',
            description: '发病初期的治疗和防控，控制病情发展',
            measures: [
              {
                category: '药物治疗',
                items: [
                  {
                    name: '抗病毒治疗',
                    details: '继续使用抗病毒药物，连续用药5-7天'
                  },
                  {
                    name: '抗菌治疗',
                    details: '根据病情使用抗生素预防继发感染'
                  },
                  {
                    name: '免疫增强',
                    details: '添加维生素C、电解质等增强免疫力'
                  }
                ]
              },
              {
                category: '饲养管理',
                items: [
                  {
                    name: '饲料调整',
                    details: '提供易消化、营养丰富的饲料，增加蛋白质和维生素含量'
                  },
                  {
                    name: '饮水管理',
                    details: '确保充足的清洁饮水，可添加电解多维'
                  },
                  {
                    name: '环境控制',
                    details: '保持适宜的温度、湿度和通风条件'
                  }
                ]
              },
              {
                category: '监测措施',
                items: [
                  {
                    name: '临床观察',
                    details: '每天观察禽群精神状态、采食情况、粪便情况等'
                  },
                  {
                    name: '死亡统计',
                    details: '记录每日死亡数量，分析死亡原因'
                  },
                  {
                    name: '采样检测',
                    details: '采集样本进行实验室检测，确定病原类型'
                  }
                ]
              }
            ]
          },
          {
            timePeriod: '长期防控',
            title: '生物安全措施',
            description: '长期的防控措施，防止疫情再次发生',
            measures: [
              {
                category: '免疫接种',
                items: [
                  {
                    name: '疫苗接种',
                    details: '制定合理的疫苗接种计划，按时接种相关疫苗'
                  },
                  {
                    name: '抗体监测',
                    details: '定期监测抗体水平，评估免疫效果'
                  }
                ]
              },
              {
                category: '生物安全',
                items: [
                  {
                    name: '养殖场管理',
                    details: '严格执行生物安全制度，防止病原传入'
                  },
                  {
                    name: '人员管理',
                    details: '对养殖场人员进行生物安全培训'
                  },
                  {
                    name: '车辆管理',
                    details: '对进出养殖场的车辆进行严格消毒'
                  }
                ]
              },
              {
                category: '监测预警',
                items: [
                  {
                    name: '日常监测',
                    details: '加强日常监测，及时发现异常情况'
                  },
                  {
                    name: '疫情报告',
                    details: '发现疫情及时向当地疫控部门报告'
                  }
                ]
              }
            ]
          }
        ],
        message: '获取应急防控方案成功',
      });
    }, 500);
  });
  
  // 实际API请求示例
  // return request<EmergencyPlan[]>(`/diagnosis/emergency-plan/${diagnosisId}`, {
  //   method: 'GET',
  // });
};

// 疫情热点类型
export interface HeatPoint {
  id: string;
  level: 'low' | 'medium' | 'high' | 'alert';
  disease: string;
  count: number;
  top: string;
  left: string;
  size: number;
}

// 疫情报警类型
export interface AlertItem {
  id: string;
  title: string;
  level: 'high' | 'medium' | 'low';
  description: string;
  location: string;
  time: string;
  count: number;
}

// 疫情统计数据类型
export interface EpidemicStats {
  totalCases: number;
  alertCount: number;
  newCasesToday: number;
  highRiskCount: number;
  mediumRiskCount: number;
  lowRiskCount: number;
}

// 获取疫情热力图数据API
export const getEpidemicHeatmapApi = async (params: { timeRange: string; diseaseType: string }): Promise<ApiResponse<{
  heatPoints: HeatPoint[];
  alerts: AlertItem[];
  stats: EpidemicStats;
}>> => {
  // 模拟API调用，实际项目中替换为真实API请求
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        data: {
          heatPoints: [
            { id: '1', level: 'alert', disease: '禽流感', count: 8, top: '30%', left: '20%', size: 16 },
            { id: '2', level: 'high', disease: '新城疫', count: 5, top: '60%', left: '35%', size: 12 },
            { id: '3', level: 'medium', disease: '传染性支气管炎', count: 3, top: '45%', left: '70%', size: 8 },
            { id: '4', level: 'low', disease: '传染性法氏囊病', count: 2, top: '75%', left: '85%', size: 8 },
            { id: '5', level: 'medium', disease: '禽流感', count: 4, top: '25%', left: '65%', size: 12 },
            { id: '6', level: 'low', disease: '新城疫', count: 1, top: '55%', left: '15%', size: 8 },
            { id: '7', level: 'high', disease: '禽流感', count: 6, top: '65%', left: '60%', size: 14 },
            { id: '8', level: 'medium', disease: '传染性支气管炎', count: 3, top: '35%', left: '45%', size: 10 },
            { id: '9', level: 'low', disease: '传染性法氏囊病', count: 2, top: '85%', left: '25%', size: 8 },
          ],
          alerts: [
            {
              id: '1',
              title: '禽流感聚集性疫情',
              level: 'high',
              description: '检测到某区域禽流感病例异常增多，建议立即采取防控措施',
              location: 'XX市XX区',
              time: '2小时前',
              count: 8,
            },
            {
              id: '2',
              title: '新城疫散发疫情',
              level: 'medium',
              description: '监测到新城疫病例，建议加强免疫和消毒工作',
              location: 'XX县XX镇',
              time: '5小时前',
              count: 3,
            },
            {
              id: '3',
              title: '常规疫情监测',
              level: 'low',
              description: '区域疫情稳定，未发现异常情况',
              location: 'XX市辖区',
              time: '1天前',
              count: 1,
            },
          ],
          stats: {
            totalCases: 12,
            alertCount: 3,
            newCasesToday: 5,
            highRiskCount: 2,
            mediumRiskCount: 3,
            lowRiskCount: 7,
          }
        },
        message: '获取疫情热力图数据成功',
      });
    }, 800);
  });
  
  // 实际API请求示例
  // return request<{
  //   heatPoints: HeatPoint[];
  //   alerts: AlertItem[];
  //   stats: EpidemicStats;
  // }>('/epidemic/heatmap', {
  //   method: 'GET',
  //   params,
  // });
};

// 员工类型
export interface Employee {
  id: string;
  name: string;
  role: string;
  phone: string;
  avatar: string;
  status: string;
}

// 权限类型
export interface Permissions {
  viewData: boolean;
  enterData: boolean;
  manageBatch: boolean;
  manageEmployee: boolean;
  exportData: boolean;
}

// 获取员工列表API
export const getEmployeeListApi = async (): Promise<ApiResponse<Employee[]>> => {
  // 模拟API调用，实际项目中替换为真实API请求
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        data: [
          {
            id: 'emp001',
            name: '张场长',
            role: '场长',
            phone: '138****5678',
            avatar: 'https://s.coze.cn/image/0aZUPbwJ-lo/',
            status: '在职',
          },
          {
            id: 'emp002',
            name: '李饲养员',
            role: '饲养员',
            phone: '139****9012',
            avatar: 'https://s.coze.cn/image/Vd85bEicSXg/',
            status: '在职',
          },
          {
            id: 'emp003',
            name: '王技术员',
            role: '技术员',
            phone: '137****3456',
            avatar: 'https://s.coze.cn/image/tm75ot0-zBM/',
            status: '在职',
          },
          {
            id: 'emp004',
            name: '陈管理员',
            role: '管理员',
            phone: '136****7890',
            avatar: 'https://s.coze.cn/image/cHHh-hwP3vk/',
            status: '在职',
          },
        ],
        message: '获取员工列表成功',
      });
    }, 500);
  });
  
  // 实际API请求示例
  // return request<Employee[]>('/employee/list', {
  //   method: 'GET',
  // });
};

// 添加员工API
export const addEmployeeApi = async (params: {
  name: string;
  phone: string;
  role: string;
}): Promise<ApiResponse<Employee>> => {
  // 模拟API调用，实际项目中替换为真实API请求
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        data: {
          id: `emp${Date.now()}`,
          name: params.name,
          role: params.role === 'manager' ? '场长' : 
                params.role === 'breeder' ? '饲养员' :
                params.role === 'technician' ? '技术员' : '管理员',
          phone: params.phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2'),
          avatar: 'https://s.coze.cn/image/HUU_tz5Y8fY/',
          status: '在职',
        },
        message: '员工添加成功',
      });
    }, 500);
  });
  
  // 实际API请求示例
  // return request<Employee>('/employee/add', {
  //   method: 'POST',
  //   body: JSON.stringify(params),
  // });
};

// 获取员工权限API
export const getEmployeePermissionsApi = async (employeeId: string): Promise<ApiResponse<Permissions>> => {
  // 模拟API调用，实际项目中替换为真实API请求
  return new Promise((resolve) => {
    setTimeout(() => {
      // 根据员工ID返回不同的权限，这里简化处理
      resolve({
        success: true,
        data: {
          viewData: true,
          enterData: true,
          manageBatch: employeeId === 'emp001' || employeeId === 'emp004' || employeeId === 'emp003',
          manageEmployee: employeeId === 'emp001' || employeeId === 'emp004',
          exportData: employeeId === 'emp001' || employeeId === 'emp004' || employeeId === 'emp003',
        },
        message: '获取员工权限成功',
      });
    }, 500);
  });
  
  // 实际API请求示例
  // return request<Permissions>(`/employee/${employeeId}/permissions`, {
  //   method: 'GET',
  // });
};

// 更新员工权限API
export const updateEmployeePermissionsApi = async (employeeId: string, permissions: Permissions): Promise<ApiResponse<null>> => {
  // 模拟API调用，实际项目中替换为真实API请求
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        message: '员工权限更新成功',
      });
    }, 500);
  });
  
  // 实际API请求示例
  // return request<null>(`/employee/${employeeId}/permissions`, {
  //   method: 'PUT',
  //   body: JSON.stringify(permissions),
  // });
};

// 批次数据类型
export interface BatchData {
  id: string;
  name: string;
  species: string;
  initialQuantity: number;
  currentQuantity: number;
  daysOld: number;
  entryDate: string;
  status: 'active' | 'completed';
  icon: string;
}

// 获取批次列表API
export const getBatchListApi = async (): Promise<ApiResponse<BatchData[]>> => {
  // 模拟API调用，实际项目中替换为真实API请求
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        data: [
          {
            id: 'batch-001',
            name: '白羽肉鸡-20240101',
            species: '白羽肉鸡',
            initialQuantity: 1200,
            currentQuantity: 1185,
            daysOld: 15,
            entryDate: '2024-01-01',
            status: 'active',
            icon: 'drumstick-bite',
          },
          {
            id: 'batch-002',
            name: '蛋鸡-20240110',
            species: '海兰白蛋鸡',
            initialQuantity: 800,
            currentQuantity: 792,
            daysOld: 6,
            entryDate: '2024-01-10',
            status: 'active',
            icon: 'egg',
          },
          {
            id: 'batch-003',
            name: '黄羽肉鸡-20231225',
            species: '三黄鸡',
            initialQuantity: 1000,
            currentQuantity: 985,
            daysOld: 45,
            entryDate: '2024-01-10',
            status: 'completed',
            icon: 'drumstick-bite',
          },
          {
            id: 'batch-004',
            name: '北京鸭-20240105',
            species: '樱桃谷鸭',
            initialQuantity: 600,
            currentQuantity: 595,
            daysOld: 11,
            entryDate: '2024-01-05',
            status: 'active',
            icon: 'water',
          },
          {
            id: 'batch-005',
            name: '白羽肉鸡-20240112',
            species: '白羽肉鸡',
            initialQuantity: 1500,
            currentQuantity: 1498,
            daysOld: 3,
            entryDate: '2024-01-12',
            status: 'active',
            icon: 'drumstick-bite',
          },
        ],
        message: '获取批次列表成功',
      });
    }, 800);
  });
  
  // 实际API请求示例
  // return request<BatchData[]>('/batch/list', {
  //   method: 'GET',
  // });
};

// 创建批次API
export const createBatchApi = async (batchData: Omit<BatchData, 'id' | 'currentQuantity' | 'daysOld' | 'status'>): Promise<ApiResponse<BatchData>> => {
  // 模拟API调用，实际项目中替换为真实API请求
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        data: {
          id: `batch-${Date.now()}`,
          ...batchData,
          currentQuantity: batchData.initialQuantity,
          daysOld: 0,
          status: 'active',
        },
        message: '批次创建成功',
      });
    }, 500);
  });
  
  // 实际API请求示例
  // return request<BatchData>('/batch/create', {
  //   method: 'POST',
  //   body: JSON.stringify(batchData),
  // });
};

// 更新批次API
export const updateBatchApi = async (batchId: string, batchData: Partial<BatchData>): Promise<ApiResponse<BatchData>> => {
  // 模拟API调用，实际项目中替换为真实API请求
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        data: {
          id: batchId,
          name: batchData.name || '白羽肉鸡-20240101',
          species: batchData.species || '白羽肉鸡',
          initialQuantity: batchData.initialQuantity || 1200,
          currentQuantity: batchData.currentQuantity || 1185,
          daysOld: batchData.daysOld || 15,
          entryDate: batchData.entryDate || '2024-01-01',
          status: batchData.status || 'active',
          icon: batchData.icon || 'drumstick-bite',
        },
        message: '批次更新成功',
      });
    }, 500);
  });
  
  // 实际API请求示例
  // return request<BatchData>(`/batch/${batchId}`, {
  //   method: 'PUT',
  //   body: JSON.stringify(batchData),
  // });
};

// 删除批次API
export const deleteBatchApi = async (batchId: string): Promise<ApiResponse<null>> => {
  // 模拟API调用，实际项目中替换为真实API请求
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        message: '批次删除成功',
      });
    }, 500);
  });
  
  // 实际API请求示例
  // return request<null>(`/batch/${batchId}`, {
  //   method: 'DELETE',
  // });
};

// 批次信息类型
export interface BatchInfo {
  name: string;
  species: string;
  currentQuantity: number;
  entryDate: string;
}

// 记录数据类型
export interface RecordData {
  date: string;
  deathCount: number;
  feedConsumption: number;
  remark: string;
}

// 历史记录类型
export interface HistoryRecord {
  id: string;
  date: string;
  deathCount: number;
  feedConsumption: number;
  remark: string;
  status: string;
}

// 获取批次信息API
export const getBatchInfoApi = async (batchId: string): Promise<ApiResponse<BatchInfo>> => {
  // 模拟API调用，实际项目中替换为真实API请求
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        data: {
          name: '白羽肉鸡第3批',
          species: '白羽肉鸡',
          currentQuantity: 1250,
          entryDate: '2024-01-01',
        },
        message: '获取批次信息成功',
      });
    }, 500);
  });
  
  // 实际API请求示例
  // return request<BatchInfo>(`/batch/${batchId}/info`, {
  //   method: 'GET',
  // });
};

// 保存死淘/耗料记录API
export const saveDeathFeedRecordApi = async (batchId: string, recordData: RecordData): Promise<ApiResponse<null>> => {
  // 模拟API调用，实际项目中替换为真实API请求
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        message: '记录保存成功',
      });
    }, 500);
  });
  
  // 实际API请求示例
  // return request<null>(`/batch/${batchId}/record`, {
  //   method: 'POST',
  //   body: JSON.stringify(recordData),
  // });
};

// 获取历史记录API
export const getHistoryRecordsApi = async (batchId: string): Promise<ApiResponse<HistoryRecord[]>> => {
  // 模拟API调用，实际项目中替换为真实API请求
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        data: [
          {
            id: '1',
            date: '2024-01-15',
            deathCount: 5,
            feedConsumption: 250.5,
            remark: '正常损耗',
            status: '已记录',
          },
          {
            id: '2',
            date: '2024-01-14',
            deathCount: 3,
            feedConsumption: 245.8,
            remark: '无特殊情况',
            status: '已记录',
          },
          {
            id: '3',
            date: '2024-01-13',
            deathCount: 7,
            feedConsumption: 252.1,
            remark: '发现少量呼吸道症状，已隔离观察',
            status: '已记录',
          },
        ],
        message: '获取历史记录成功',
      });
    }, 500);
  });
  
  // 实际API请求示例
  // return request<HistoryRecord[]>(`/batch/${batchId}/records`, {
  //   method: 'GET',
  // });
};

// 导师关联请求参数
interface MentorAssociateParams {
  studentId: string;
  mentorCode: string;
}

// 导师信息类型
export interface MentorInfo {
  id: string;
  name: string;
  phone: string;
  school: string;
}

// 验证导师邀请码API
export const verifyMentorCodeApi = async (mentorCode: string): Promise<ApiResponse<MentorInfo>> => {
  // 模拟API调用，实际项目中替换为真实API请求
  return new Promise((resolve) => {
    setTimeout(() => {
      // 模拟邀请码验证，实际项目中需要调用真实API
      if (mentorCode === 'MENTOR123' || mentorCode === 'MENTOR456') {
        resolve({
          success: true,
          data: {
            id: mentorCode === 'MENTOR123' ? 'mentor-001' : 'mentor-002',
            name: mentorCode === 'MENTOR123' ? '张教授' : '李副教授',
            phone: mentorCode === 'MENTOR123' ? '13800138001' : '13800138002',
            school: '农业大学',
          },
          message: '邀请码验证成功',
        });
      } else {
        resolve({
          success: false,
          message: '无效的邀请码',
        });
      }
    }, 500);
  });
};

// 关联导师API
export const associateMentorApi = async (params: MentorAssociateParams): Promise<ApiResponse<null>> => {
  // 模拟API调用，实际项目中替换为真实API请求
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        message: '导师关联成功',
      });
    }, 500);
  });
};

// 清除用户信息
export const clearUserInfo = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem('userInfo');
    await AsyncStorage.removeItem('userToken');
  } catch (error) {
    console.error('清除用户信息失败:', error);
  }
};
