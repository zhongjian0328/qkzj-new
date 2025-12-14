import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// 创建axios实例
const api = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000/api',
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 请求拦截器
api.interceptors.request.use(
  async (config) => {
    // 从AsyncStorage获取token
    const token = await AsyncStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 响应拦截器
api.interceptors.response.use(
  (response) => response.data,
  async (error) => {
    // 处理错误响应
    if (error.response?.status === 401) {
      // 处理未授权错误，例如跳转到登录页面
      try {
        await AsyncStorage.removeItem('token');
      } catch (storageError) {
        console.error('Failed to remove token from AsyncStorage:', storageError);
      }
      // 可以通过事件或状态管理通知应用处理登录过期
    }
    return Promise.reject(error);
  }
);

// 用户认证相关API
export const authApi = {
  // 登录
  login: (data: { phoneNumber: string; password: string }) => 
    api.post('/auth/login', data),
  
  // 注册
  register: (data: {
    phoneNumber: string;
    password: string;
    roleType: string;
    subRole: string;
  }) => api.post('/auth/register', data),
  
  // 获取验证码
  getVerificationCode: (phoneNumber: string) => 
    api.post('/auth/verification-code', { phoneNumber }),
  
  // 验证验证码
  verifyCode: (data: { phoneNumber: string; code: string }) => 
    api.post('/auth/verify-code', data),
  
  // 获取当前用户信息
  getCurrentUser: () => api.get('/auth/me'),
  
  // 更新用户信息
  updateUser: (data: Partial<{
    nickname: string;
    avatar: string;
    organizationId: string;
    schoolId: string;
    studentId: string;
    mentorId: string;
  }>) => api.put('/auth/me', data),
  
  // 用户认证
  certify: (data: {
    certificationType: string;
    documents: any[];
    additionalInfo?: any;
  }) => api.post('/auth/certify', data),
};

// AI诊断相关API
export const aiDiagnosisApi = {
  // 对话问诊
  chatDiagnosis: (data: {
    message: string;
    imageUrls?: string[];
    history?: any[];
  }) => api.post('/ai-diagnosis/chat-diagnosis', data),
  
  // AI兽医模式诊断
  vetDiagnosis: (data: {
    basicInfo: {
      farmLocation: string;
      chickenBreed: string;
      ageDays: number;
      stockQuantity: number;
      onsetTime: string;
    };
    clinicalSymptoms: {
      symptoms: string[];
      averageTemperature?: number;
      respiratoryRate?: number;
      mortalityRate?: number;
      feedDecrease?: number;
      eggDecrease?: number;
    };
    pathologicalChanges?: {
      lesions: string[];
      description?: string;
    };
    rapidTestResults?: {
      aivTest?: string;
      ndvTest?: string;
      ibvTest?: string;
      [key: string]: any;
    };
    samplingInfo?: {
      sampleCount?: number;
      preservationCondition?: string;
      samplingSites?: string[];
    };
    experimentalData?: {
      experiments: string[];
      bloodRoutine?: {
        wbcCount?: number;
        rbcCount?: number;
      };
      biochemical?: {
        altLevel?: number;
        astLevel?: number;
      };
      description?: string;
    };
    imageUrls: string[];
    studentDiagnosisInput?: string;
  }) => api.post('/ai-diagnosis/veterinary-diagnosis', data),
  
  // 获取初诊报告
  getPreDiagnosisReport: (diagnosisId: string) => 
    api.get(`/ai-diagnosis/pre-report/${diagnosisId}`),
  
  // 获取确诊报告
  getFinalDiagnosisReport: (diagnosisId: string) => 
    api.get(`/ai-diagnosis/final-report/${diagnosisId}`),
  
  // 审核诊断报告
  auditReport: (diagnosisId: string, data: {
    auditStatus: string;
    auditComments: string;
  }) => api.post(`/ai-diagnosis/audit-report/${diagnosisId}`, data),
  
  // 获取诊断历史
  getDiagnosisHistory: (params?: {
    page?: number;
    limit?: number;
    startDate?: string;
    endDate?: string;
  }) => api.get('/ai-diagnosis/history', { params }),
  
  // 获取诊断详情
  getDiagnosisDetail: (diagnosisId: string) => 
    api.get(`/ai-diagnosis/detail/${diagnosisId}`),
  
  // 保存诊断记录
  saveDiagnosis: (diagnosisId: string) => 
    api.post(`/ai-diagnosis/save/${diagnosisId}`),
  
  // 混合感染风险评估
  mixedInfectionRiskAssessment: (data: {
    symptoms: string;
    environment: string;
    breed: string;
    age: string;
    recentDiseases: string;
  }) => api.post('/ai-diagnosis/risk-assessment', data),
  
  // 紧急控制方案生成
  emergencyControlPlan: (data: {
    disease: string;
    affectedCount: number;
    totalCount: number;
    environment: string;
    symptoms: string;
  }) => api.post('/ai-diagnosis/emergency-plan', data),
  
  // 治疗效果跟踪与调整建议
  treatmentAdjustment: (data: {
    diagnosis: string;
    treatmentPlan: string;
    currentSymptoms: string;
    duration: string;
    improvement: string;
  }) => api.post('/ai-diagnosis/treatment-adjustment', data),
  
  // 养殖建议生成
  farmingAdvice: (data: {
    breed: string;
    age: string;
    environment: string;
    feedingMethod: string;
    recentHealthStatus: string;
  }) => api.post('/ai-diagnosis/farming-advice', data),
  
  // 疾病风险预警
  diseaseWarning: (data: {
    environment: string;
    breed: string;
    age: string;
    recentWeather: string;
    neighboringFarmsStatus: string;
  }) => api.post('/ai-diagnosis/disease-warning', data),
};

// 生产管理相关API
export const productionApi = {
  // 批次管理
  getBatches: (params?: {
    page?: number;
    limit?: number;
    status?: string;
  }) => api.get('/production/batches', { params }),
  
  createBatch: (data: {
    batchName: string;
    species: string;
    initialQuantity: number;
    entryDate: string;
  }) => api.post('/production/batches', data),
  
  updateBatch: (batchId: string, data: Partial<{
    batchName: string;
    species: string;
    currentQuantity: number;
    status: string;
  }>) => api.put(`/production/batches/${batchId}`, data),
  
  deleteBatch: (batchId: string) => api.delete(`/production/batches/${batchId}`),
  
  // 死淘/耗料记录
  getDeathFeedRecords: (params: {
    batchId: string;
    page?: number;
    limit?: number;
    startDate?: string;
    endDate?: string;
  }) => api.get('/production/death-feed-records', { params }),
  
  createDeathFeedRecord: (data: {
    batchId: string;
    recordDate: string;
    deathCount: number;
    feedConsumption: number;
  }) => api.post('/production/death-feed-records', data),
  
  // 员工权限管理
  getEmployees: (params?: {
    page?: number;
    limit?: number;
  }) => api.get('/production/employees', { params }),
  
  createEmployee: (data: {
    name: string;
    role: string;
    permissions: string[];
  }) => api.post('/production/employees', data),
  
  updateEmployeePermission: (employeeId: string, data: {
    role: string;
    permissions: string[];
  }) => api.put(`/production/employees/${employeeId}/permission`, data),
};

// 疫情监测相关API
export const epidemicApi = {
  // 获取疫情热力图数据
  getEpidemicHeatmap: (params?: {
    date?: string;
    region?: string;
    diseaseType?: string;
  }) => api.get('/epidemic/heatmap', { params }),
  
  // 获取异常高发报警
  getAbnormalAlerts: (params?: {
    page?: number;
    limit?: number;
    status?: string;
  }) => api.get('/epidemic/alerts', { params }),
  
  // 发布政策通知
  publishPolicy: (data: {
    title: string;
    content: string;
    targetRegions?: string[];
    targetRoles?: string[];
  }) => api.post('/epidemic/policies', data),
  
  // 获取政策通知列表
  getPolicies: (params?: {
    page?: number;
    limit?: number;
    region?: string;
    role?: string;
  }) => api.get('/epidemic/policies', { params }),
};

// 实习管理相关API
export const internshipApi = {
  // 获取实习日志列表
  getInternLogs: (params?: {
    page?: number;
    limit?: number;
    status?: string;
    mentorId?: string;
  }) => api.get('/internship/logs', { params }),
  
  // 创建实习日志
  createInternLog: (data: {
    logDate: string;
    content: string;
    caseImageUrls: string[];
    studentDiagnosis?: string;
    gpsLocation?: { latitude: number; longitude: number };
  }) => api.post('/internship/logs', data),
  
  // 获取实习日志详情
  getInternLogDetail: (logId: string) => api.get(`/internship/logs/${logId}`),
  
  // 导师批注实习日志
  mentorComment: (logId: string, data: {
    comment: string;
  }) => api.post(`/internship/logs/${logId}/comment`, data),
  
  // 获取学生列表
  getStudents: (params?: {
    page?: number;
    limit?: number;
    mentorId?: string;
    status?: string;
  }) => api.get('/internship/students', { params }),
};

// 知识学习相关API
export const knowledgeApi = {
  // 获取图谱百科列表
  getKnowledgeGraphs: (params?: {
    page?: number;
    limit?: number;
    searchTerm?: string;
    category?: string;
  }) => api.get('/knowledge/graphs', { params }),
  
  // 获取图谱百科详情
  getKnowledgeGraphDetail: (graphId: string) => api.get(`/knowledge/graphs/${graphId}`),
  
  // 获取题库列表
  getQuestionBank: (params?: {
    page?: number;
    limit?: number;
    knowledgePoint?: string;
    difficulty?: string;
  }) => api.get('/knowledge/questions', { params }),
  
  // 提交测验答案
  submitQuiz: (data: {
    questionIds: string[];
    answers: { [key: string]: string };
  }) => api.post('/knowledge/quiz/submit', data),
  
  // 获取测验结果
  getQuizResult: (quizId: string) => api.get(`/knowledge/quiz/result/${quizId}`),
};

// 商业服务相关API
export const businessApi = {
  // 获取兽药商城商品列表
  getProducts: (params?: {
    page?: number;
    limit?: number;
    category?: string;
    searchTerm?: string;
  }) => api.get('/business/products', { params }),
  
  // 获取商品详情
  getProductDetail: (productId: string) => api.get(`/business/products/${productId}`),
  
  // 创建订单
  createOrder: (data: {
    productType: string;
    productId?: string;
    serviceProviderId?: string;
    quantity?: number;
    diagnosisRecordId?: string;
    serviceDescription?: string;
  }) => api.post('/business/orders', data),
  
  // 获取订单列表
  getOrders: (params?: {
    page?: number;
    limit?: number;
    status?: string;
    orderType?: string;
  }) => api.get('/business/orders', { params }),
  
  // 获取客户列表
  getCustomers: (params?: {
    page?: number;
    limit?: number;
    searchTerm?: string;
  }) => api.get('/business/customers', { params }),
  
  // 创建广告
  createAd: (data: {
    title: string;
    content: string;
    targetAudience: {
      roles?: string[];
      regions?: string[];
      tags?: string[];
    };
    imageUrls: string[];
    startDate: string;
    endDate: string;
  }) => api.post('/business/ads', data),
  
  // 获取广告列表
  getAds: (params?: {
    page?: number;
    limit?: number;
    status?: string;
  }) => api.get('/business/ads', { params }),
};

// 数据标注与科研协作相关API
export const researchApi = {
  // 获取病例列表
  getCases: (params?: {
    page?: number;
    limit?: number;
    isSpecialCase?: boolean;
    diseaseType?: string;
  }) => api.get('/research/cases', { params }),
  
  // 获取病例详情
  getCaseDetail: (caseId: string) => api.get(`/research/cases/${caseId}`),
  
  // 标注病例
  annotateCase: (caseId: string, data: {
    annotations: any[];
    isSpecialCase?: boolean;
    comments?: string;
  }) => api.post(`/research/cases/${caseId}/annotate`, data),
  
  // 下载病例图片
  downloadCaseImage: (imageUrl: string) => api.get(`/research/images/download?url=${encodeURIComponent(imageUrl)}`, { responseType: 'blob' }),
  
  // 获取科研群组列表
  getResearchGroups: (params?: {
    page?: number;
    limit?: number;
  }) => api.get('/research/groups', { params }),
  
  // 创建科研群组
  createResearchGroup: (data: {
    name: string;
    description: string;
    members: string[];
  }) => api.post('/research/groups', data),
  
  // 获取科研群组详情
  getResearchGroupDetail: (groupId: string) => api.get(`/research/groups/${groupId}`),
  
  // 上传科研数据
  uploadResearchData: (data: FormData) => 
    api.post('/research/data/upload', data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }),
};

export default api;