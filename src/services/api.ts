import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';

// 扩展 AxiosRequestConfig 以支持自定义标志
declare module 'axios' {
  interface InternalAxiosRequestConfig {
    _retryCount?: number;
    _retry?: boolean;
  }
}

// 创建axios实例
// apiUrl 回退链：环境变量 EXPO_PUBLIC_API_URL -> app.json/app.config.js 的 extra.apiUrl -> localhost 开发默认值
const apiUrl =
  process.env.EXPO_PUBLIC_API_URL ||
  (Constants.expoConfig && Constants.expoConfig.extra && Constants.expoConfig.extra.apiUrl) ||
  'http://localhost:3000/api';

const api = axios.create({
  baseURL: apiUrl,
  timeout: 65000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 网络状态检测函数
export const checkNetworkStatus = async () => {
  try {
    await api.get('/health');
    return true;
  } catch (error) {
    return false;
  }
};

// 网络错误检测函数
const isNetworkError = (error: any): boolean => {
  return !error.response || error.code === 'ECONNABORTED' || error.code === 'NETWORK_ERROR' || error.code === 'ERR_NETWORK';
};

// 判断是否应该重试：网络错误或 5xx 服务器错误
const shouldRetry = (error: any): boolean => {
  if (isNetworkError(error)) return true;
  const status = error.response?.status;
  return status >= 500 && status < 600;
};

// 请求重试机制
const retryInterceptor = (retryCount = 3) => {
  return async (error: any) => {
    const { config } = error;
    // 如果不需要重试（非网络错误且非 5xx），直接拒绝
    if (!config || !shouldRetry(error)) {
      return Promise.reject(error);
    }
    // 如果重试次数已用完，直接拒绝
    if (config._retryCount >= retryCount) {
      return Promise.reject(error);
    }

    // 增加重试计数
    config._retryCount = config._retryCount || 0;
    config._retryCount++;

    // 指数退避重试
    const delay = Math.pow(2, config._retryCount) * 1000;

    console.log(`请求失败，正在重试... (${config._retryCount}/${retryCount})`);
    await new Promise(resolve => setTimeout(resolve, delay));

    // 重新发送请求
    try {
      return await api(config);
    } catch (retryError) {
      // 如果重试后仍然失败，继续传播错误
      return Promise.reject(retryError);
    }
  };
};

// 事件发射器：用于在 token 过期时通知 UserContext
type EventCallback = () => void;
const eventListeners = new Map<string, Set<EventCallback>>();

export const on = (event: string, callback: EventCallback) => {
  if (!eventListeners.has(event)) {
    eventListeners.set(event, new Set());
  }
  eventListeners.get(event)!.add(callback);
};

export const off = (event: string, callback: EventCallback) => {
  eventListeners.get(event)?.delete(callback);
};

const emit = (event: string) => {
  eventListeners.get(event)?.forEach((cb) => cb());
};

// 用于绕过拦截器执行刷新请求的原始 axios 实例
const rawAxios = axios.create({
  baseURL: api.defaults.baseURL,
  timeout: api.defaults.timeout,
  headers: { 'Content-Type': 'application/json' },
});

// 请求拦截器
api.interceptors.request.use(
  async (config) => {
    // 从 AsyncStorage 获取 accessToken
    const token = await AsyncStorage.getItem('accessToken');
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
  async (error: any) => {
    // 应用重试机制
    const retryError: any = await retryInterceptor(3)(error);
    // 如果 retryInterceptor 返回了新响应（重试成功），直接返回
    // 如果返回了错误对象（重试耗尽或不需重试），进行处理
    if (retryError instanceof Error || retryError?.response || retryError?.code) {
      // 处理 401 未授权错误 — 尝试刷新 token
      if (retryError.response?.status === 401) {
        const originalRequest = retryError.config;
        // 如果已经重试过（防止无限循环），直接清除 token 并通知重新登录
        if (originalRequest?._retry) {
          try {
            await AsyncStorage.multiRemove(['accessToken', 'refreshToken']);
          } catch (e) {
            console.error('Failed to clear tokens:', e);
          }
          emit('TOKEN_EXPIRED');
          return Promise.reject(retryError);
        }

        originalRequest._retry = true;

        try {
          const refreshToken = await AsyncStorage.getItem('refreshToken');
          if (!refreshToken) {
            throw new Error('No refresh token available');
          }

          const refreshResponse = await rawAxios.post('/auth/refresh-token', {
            refreshToken,
          });

          const { accessToken, refreshToken: newRefreshToken } = refreshResponse.data?.data || {};
          if (!accessToken) {
            throw new Error('Refresh token returned invalid data');
          }

          await AsyncStorage.setItem('accessToken', accessToken);
          if (newRefreshToken) {
            await AsyncStorage.setItem('refreshToken', newRefreshToken);
          }

          // 用新 token 重试原请求
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          return api(originalRequest);
        } catch (refreshError) {
          // 刷新失败：清除所有 token，通知重新登录
          try {
            await AsyncStorage.multiRemove(['accessToken', 'refreshToken']);
          } catch (e) {
            console.error('Failed to clear tokens:', e);
          }
          emit('TOKEN_EXPIRED');
          return Promise.reject(refreshError);
        }
      } else if (retryError.code === 'ECONNABORTED') {
        // 处理请求超时错误
        console.error('请求超时，请检查网络连接或稍后重试');
      } else if (retryError.response?.status === 400) {
        // 处理客户端错误
        console.error('请求参数错误:', retryError.response.data?.message || '无效的请求参数');
      } else if (retryError.response?.status >= 500) {
        // 处理服务器错误
        console.error('服务器内部错误，请稍后重试');
      } else if (isNetworkError(retryError)) {
        // 处理网络连接错误
        console.error('网络连接失败，请检查您的网络设置');
      }
    }
    return Promise.reject(retryError);
  }
);

// 用户认证相关API
export const authApi = {
  // 登录
  login: (data: { phoneNumber: string; password: string }) =>
    api.post('/auth/login', data),

  // 验证码登录（已注册用户）
  loginWithCode: (data: { phoneNumber: string; code: string }) =>
    api.post('/auth/login-with-code', data),

  // 体验登录
  experienceLogin: (data: { roleType: string; subRole: string }) =>
    api.post('/auth/experience-login', data),
  
  // 注册
  register: (data: {
    phoneNumber: string;
    password: string;
    nickname: string;
    roleType: string;
    subRole: string;
  }) => api.post('/auth/register', data),
  
  // 获取验证码（type: register=注册, login=登录, forgot=找回密码）
  getVerificationCode: (phoneNumber: string, type: 'register' | 'login' | 'forgot' = 'register') =>
    api.post('/auth/get-verification-code', { phoneNumber, type }),
  
  // 验证验证码
  verifyCode: (data: { phoneNumber: string; code: string }) => 
    api.post('/auth/verify-code', data),
  
  // 刷新 access_token
  refreshToken: (data: { refreshToken: string }) =>
    api.post('/auth/refresh-token', data),

  // 获取当前用户信息
  getCurrentUser: () => api.get('/auth/current-user'),
  
  // 更新用户信息
  updateUser: (data: Partial<{
    nickname: string;
    avatar: string;
    organizationId: string;
    schoolId: string;
    studentId: string;
    mentorId: string;
  }>) => api.put('/auth/update', data),

  // 角色选择（首次选择身份，允许修改 roleType/subRole）
  selectRole: (data: { roleType: string; subRole: string }) =>
    api.post('/auth/select-role', data),
  
  // 忘记密码
  forgotPassword: (data: { phoneNumber: string; code: string; newPassword: string }) =>
    api.post('/auth/forgot-password', data),

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

  // 导出生产数据（CSV）
  exportProductionData: (params: {
    batchId: string;
    startDate?: string;
    endDate?: string;
  }) => api.get('/production/export', { params, responseType: 'blob' }),
};

// 环境数据相关API
export const environmentApi = {
  // 创建环境记录
  createRecord: (data: {
    farmName: string;
    temperature?: number;
    humidity?: number;
    ammonia?: number;
    co2?: number;
    pm25?: number;
    pm10?: number;
    batchId?: string;
    recordDate?: string;
    recorder?: string;
    notes?: string;
  }) => api.post('/environment/records', data),

  // 获取环境记录列表
  getRecords: (params?: {
    batchId?: string;
    startDate?: string;
    endDate?: string;
    farmName?: string;
    page?: number;
    limit?: number;
  }) => api.get('/environment/records', { params }),

  // 获取单条环境记录详情
  getRecordById: (id: string) => api.get(`/environment/records/${id}`),

  // 更新环境记录
  updateRecord: (id: string, data: any) => api.put(`/environment/records/${id}`, data),

  // 删除环境记录
  deleteRecord: (id: string) => api.delete(`/environment/records/${id}`),

  // 获取环境统计数据
  getStatistics: (params?: {
    startDate?: string;
    endDate?: string;
  }) => api.get('/environment/statistics', { params }),

  // 获取环境预警列表
  getAlerts: (params?: {
    alertType?: string;
    startDate?: string;
    endDate?: string;
  }) => api.get('/environment/alerts', { params }),
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

  // 科普文章
  getKnowledgeArticles: (params?: {
    page?: number;
    limit?: number;
    category?: string;
    tag?: string;
    searchTerm?: string;
    status?: string;
  }) => api.get('/knowledge/articles', { params }),

  getKnowledgeArticleById: (id: string) => api.get(`/knowledge/articles/${id}`),

  toggleKnowledgeLike: (id: string) => api.post(`/knowledge/articles/${id}/like`),

  toggleKnowledgeFavorite: (id: string) => api.post(`/knowledge/articles/${id}/favorite`),

  createKnowledgeArticle: (data: any) => api.post('/knowledge/articles', data),

  updateKnowledgeArticle: (id: string, data: any) => api.put(`/knowledge/articles/${id}`, data),

  deleteKnowledgeArticle: (id: string) => api.delete(`/knowledge/articles/${id}`),

  getMyKnowledgeFavorites: () => api.get('/knowledge/favorites'),
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

  // 取消订单
  cancelOrder: (orderId: string) => api.post(`/business/orders/${orderId}/cancel`),

  // 确认收货
  confirmOrder: (orderId: string) => api.post(`/business/orders/${orderId}/confirm`),
  
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

// 流行病学调查相关API
export const surveyApi = {
  createSurvey: (data: any) => api.post('/survey/surveys', data),
  saveDraft: (data: any) => api.post('/survey/drafts', data),
  getSurveys: (params?: any) => api.get('/survey/surveys', { params }),
  getSurveyById: (id: string) => api.get(`/survey/surveys/${id}`),
  updateSurvey: (id: string, data: any) => api.put(`/survey/surveys/${id}`, data),
  deleteSurvey: (id: string) => api.delete(`/survey/surveys/${id}`),
  getRegionalStats: (params?: any) => api.get('/survey/regional-stats', { params }),
};

// 防控预案相关API
export const controlPlanApi = {
  generatePlan: (data: {
    diseaseName: string;
    severity?: string;
    batchId?: string;
    triggerDiagnosisId?: string;
    planName?: string;
    planType?: string;
    affectedCount?: number;
    totalCount?: number;
    environment?: string;
    symptoms?: string;
  }) => api.post('/control-plans/generate', data),

  getPlans: (params?: {
    page?: number;
    limit?: number;
    status?: string;
    batchId?: string;
  }) => api.get('/control-plans', { params }),

  getPlanById: (id: string) => api.get(`/control-plans/${id}`),

  updatePlan: (id: string, data: Partial<{
    planName: string;
    planContent: any;
    completionNotes: string;
  }>) => api.patch(`/control-plans/${id}`, data),

  completePlan: (id: string, data: { completionNotes?: string }) =>
    api.patch(`/control-plans/${id}/complete`, data),

  archivePlan: (id: string) => api.patch(`/control-plans/${id}/archive`),

  deletePlan: (id: string) => api.delete(`/control-plans/${id}`),
};

// 回访管理相关API
export const followUpApi = {
  scheduleFollowUp: (data: {
    planId: string;
    followUpType: 'day3' | 'day7' | 'custom';
    scheduledDate?: string;
    batchId?: string;
    questions?: any;
  }) => api.post('/follow-ups/schedule', data),

  getFollowUps: (params?: {
    page?: number;
    limit?: number;
    status?: string;
    planId?: string;
  }) => api.get('/follow-ups', { params }),

  getFollowUpStats: () => api.get('/follow-ups/stats'),

  getFollowUpById: (id: string) => api.get(`/follow-ups/${id}`),

  completeFollowUp: (id: string, data: {
    questions: any;
    notes?: string;
    completedBy?: string;
  }) => api.post(`/follow-ups/${id}/complete`, data),

  updateFollowUp: (id: string, data: Partial<{
    notes: string;
    scheduledDate: string;
  }>) => api.patch(`/follow-ups/${id}`, data),

  cancelFollowUp: (id: string) => api.patch(`/follow-ups/${id}/cancel`),

  deleteFollowUp: (id: string) => api.delete(`/follow-ups/${id}`),
};

// 数据统计与看板相关API
export const statisticsApi = {
  getDashboard: () => api.get('/statistics/dashboard'),
  getDiagnosisTrend: (params?: { startDate?: string; endDate?: string; groupBy?: string }) =>
    api.get('/statistics/diagnosis-trend', { params }),
  getEpidemicDistribution: (params?: { region?: string }) =>
    api.get('/statistics/epidemic-distribution', { params }),
  getMortalityTrend: (params?: { batchId?: string; startDate?: string; endDate?: string }) =>
    api.get('/statistics/mortality-trend', { params }),
  getEnvironmentTrend: (params?: { batchId?: string; startDate?: string; endDate?: string }) =>
    api.get('/statistics/environment-trend', { params }),
  getRegionalHeatmap: (params?: { diseaseType?: string; date?: string }) =>
    api.get('/statistics/regional-heatmap', { params }),
};

// 服务工单相关API
export const serviceTicketApi = {
  createTicket: (data: {
    title: string;
    description: string;
    category: string;
    priority?: string;
    location?: string;
    scheduledDate?: string;
    relatedBatchId?: string;
    relatedDiagnosisId?: string;
    images?: string[];
  }) => api.post('/tickets', data),

  getMyTickets: (params?: { status?: string; page?: number; limit?: number }) =>
    api.get('/tickets/my', { params }),

  getAssignedTickets: (params?: { status?: string; page?: number; limit?: number }) =>
    api.get('/tickets/assigned', { params }),

  getTicketById: (id: string) => api.get(`/tickets/${id}`),

  acceptTicket: (id: string) => api.patch(`/tickets/${id}/accept`),

  updateTicket: (id: string, data: any) => api.put(`/tickets/${id}`, data),

  addMessage: (id: string, data: { content: string; imageUrls?: string[] }) =>
    api.post(`/tickets/${id}/messages`, data),

  completeTicket: (id: string) => api.patch(`/tickets/${id}/complete`),

  rateTicket: (id: string, data: { score: number; comment?: string }) =>
    api.post(`/tickets/${id}/rate`, data),

  cancelTicket: (id: string) => api.patch(`/tickets/${id}/cancel`),
};

// 通知管理相关API
export const notificationApi = {
  // 发送通知
  sendNotification: (data: {
    userId: string;
    title: string;
    message: string;
    type: 'warning' | 'followup' | 'system' | 'diagnosis' | 'ticket';
    relatedId?: string;
  }) => api.post('/notifications', data),

  // 获取用户通知列表
  getUserNotifications: (params?: {
    page?: number;
    limit?: number;
    type?: string;
    status?: 'read' | 'unread';
  }) => api.get('/notifications', { params }),

  // 标记单条通知为已读
  markAsRead: (id: string) => api.put(`/notifications/${id}/read`),

  // 全部标记为已读
  markAllAsRead: () => api.put('/notifications/read-all'),

  // 获取未读数量
  getUnreadCount: () => api.get('/notifications/unread-count'),

  // 删除通知
  deleteNotification: (id: string) => api.delete(`/notifications/${id}`),
};

// 教学案例相关API
export const teachingCaseApi = {
  createCase: (data: any) => api.post('/teaching-cases', data),
  getMyCases: (params?: { status?: string; page?: number; limit?: number }) =>
    api.get('/teaching-cases/my', { params }),
  getCaseById: (id: string) => api.get(`/teaching-cases/${id}`),
  getAllCases: (params?: { diseaseType?: string; tag?: string; page?: number; limit?: number }) =>
    api.get('/teaching-cases', { params }),
  updateCase: (id: string, data: any) => api.put(`/teaching-cases/${id}`, data),
  submitForReview: (id: string) => api.patch(`/teaching-cases/${id}/submit-review`),
  reviewCase: (id: string, data: { status: 'approved' | 'rejected'; comment?: string }) =>
    api.patch(`/teaching-cases/${id}/review`, data),
  deleteCase: (id: string) => api.delete(`/teaching-cases/${id}`),
};

export default api;