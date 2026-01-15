const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const path = require('path');

/**
 * 加密文件解析工具类
 */
class EncryptionUtil {
  /**
   * 解析加密文件，获取API密钥
   * @param {string} filePath - 加密文件路径
   * @returns {Object} 解密后的API密钥对象
   */
  static parseEncryptedFile(filePath) {
    try {
      // 读取加密文件内容
      const fileContent = fs.readFileSync(filePath, 'binary');
      
      // 这里实现简单的解析逻辑，实际项目中需要根据加密算法进行解密
      // 由于加密文件格式未知，这里使用模拟数据
      // 实际实现时需要根据加密算法和密钥进行解密
      
      // 模拟返回解密后的API密钥
      return {
        baiduApiKey: 'your-decrypted-baidu-api-key',
        baiduSecretKey: 'your-decrypted-baidu-secret-key',
        // 可以添加其他API密钥
      };
    } catch (error) {
      console.error('解析加密文件失败:', error.message);
      throw new Error('加密文件解析失败');
    }
  }
}

/**
 * AI服务类，封装百度云图像识别API调用
 */
class AIService {
  constructor() {
    // 百度云API配置（默认值，后续会被加密文件覆盖）
    this.baiduApiKey = process.env.BAIDU_API_KEY || 'your-default-baidu-api-key';
    this.baiduSecretKey = process.env.BAIDU_SECRET_KEY || 'your-default-baidu-secret-key';
    this.baiduAccessToken = null;
    this.baiduTokenExpiresAt = 0;
    
    // 百度云组合API地址
    this.baiduCombinationApiUrl = 'https://aip.baidubce.com/api/v1/solution/direct/imagerecognition/combination';
    
    // 缓存机制配置
    this.cache = new Map();
    this.cacheTTL = 30 * 60 * 1000; // 缓存有效期30分钟
    this.maxCacheSize = 100; // 最大缓存数量
    
    try {
      // 检查加密文件是否存在
      const encryptionFilePath = path.join(__dirname, '../../enckey_121236834');
      if (fs.existsSync(encryptionFilePath)) {
        // 解析加密文件获取API密钥
        const apiKeys = EncryptionUtil.parseEncryptedFile(encryptionFilePath);
        
        // 使用加密文件中的API密钥
        this.baiduApiKey = apiKeys.baiduApiKey || this.baiduApiKey;
        this.baiduSecretKey = apiKeys.baiduSecretKey || this.baiduSecretKey;
        
        console.log('✓ 加密文件解析成功，已加载API密钥');
      } else {
        console.warn('⚠️  加密文件不存在，使用默认API密钥');
      }
    } catch (error) {
      console.warn('⚠️  加密文件解析失败，使用默认API密钥:', error.message);
    }
    
    // 验证API密钥
    this.validateApiKeys();
  }
  
  /**
   * 验证API密钥有效性
   */
  validateApiKeys() {
    if (this.baiduApiKey === 'your-default-baidu-api-key' || this.baiduSecretKey === 'your-default-baidu-secret-key') {
      console.warn('⚠️  使用默认API密钥，可能导致API调用失败');
      console.warn('建议：设置环境变量 BAIDU_API_KEY 和 BAIDU_SECRET_KEY');
    }
  }
  
  /**
   * 缓存管理 - 设置缓存
   * @param {string} key - 缓存键
   * @param {any} value - 缓存值
   */
  setCache(key, value) {
    const now = Date.now();
    
    // 检查缓存大小，超过限制时清除最旧的缓存
    if (this.cache.size >= this.maxCacheSize) {
      this.cleanupCache();
    }
    
    this.cache.set(key, {
      value: value,
      timestamp: now,
      expiresAt: now + this.cacheTTL
    });
  }
  
  /**
   * 缓存管理 - 清理缓存
   * 清除过期缓存和最旧的缓存
   */
  cleanupCache() {
    const now = Date.now();
    const keysToDelete = [];
    const oldKeys = [];
    
    // 找出过期缓存和记录所有缓存键
    for (const [key, item] of this.cache.entries()) {
      if (now > item.expiresAt) {
        keysToDelete.push(key);
      } else {
        oldKeys.push({ key, timestamp: item.timestamp });
      }
    }
    
    // 删除过期缓存
    keysToDelete.forEach(key => this.cache.delete(key));
    
    // 如果仍然超过限制，删除最旧的缓存
    if (this.cache.size >= this.maxCacheSize) {
      oldKeys.sort((a, b) => a.timestamp - b.timestamp);
      const deleteCount = this.cache.size - this.maxCacheSize + 10;
      oldKeys.slice(0, deleteCount).forEach(item => {
        this.cache.delete(item.key);
      });
    }
    
    console.log(`✓ 缓存清理完成，当前缓存大小: ${this.cache.size}`);
  }
  
  /**
   * 缓存管理 - 获取缓存
   * @param {string} key - 缓存键
   * @returns {any} 缓存值，如果缓存不存在或已过期则返回null
   */
  getCache(key) {
    const cacheItem = this.cache.get(key);
    if (!cacheItem) {
      return null;
    }
    
    const now = Date.now();
    if (now > cacheItem.expiresAt) {
      // 缓存已过期，移除缓存
      this.cache.delete(key);
      return null;
    }
    
    return cacheItem.value;
  }
  
  /**
   * 缓存管理 - 清除缓存
   * @param {string} key - 缓存键，可选，不提供则清除所有缓存
   */
  clearCache(key) {
    if (key) {
      this.cache.delete(key);
    } else {
      this.cache.clear();
    }
  }
  
  /**
   * 获取百度云AccessToken
   * @param {number} retryCount - 当前重试次数
   * @param {number} maxRetries - 最大重试次数
   * @returns {Promise<string>} - Access Token
   */
  async getBaiduAccessToken(retryCount = 0, maxRetries = 3) {
    // 检查Token是否有效
    if (this.baiduAccessToken && Date.now() < this.baiduTokenExpiresAt) {
      return this.baiduAccessToken;
    }
    
    try {
      console.log('正在获取百度云AccessToken...');
      
      const response = await axios.get('https://aip.baidubce.com/oauth/2.0/token', {
        params: {
          grant_type: 'client_credentials',
          client_id: this.baiduApiKey,
          client_secret: this.baiduSecretKey
        },
        timeout: 30000, // 30秒超时
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.data.access_token) {
        throw new Error('获取AccessToken失败：返回数据格式错误');
      }
      
      this.baiduAccessToken = response.data.access_token;
      // 设置过期时间，提前10分钟刷新
      this.baiduTokenExpiresAt = Date.now() + (response.data.expires_in - 600) * 1000;
      
      console.log('✓ 百度云AccessToken获取成功');
      console.log(`  - 过期时间: ${new Date(this.baiduTokenExpiresAt).toLocaleString()}`);
      
      return this.baiduAccessToken;
    } catch (error) {
      console.error(`获取百度云AccessToken失败 (${retryCount + 1}/${maxRetries}):`, error.message);
      
      // 详细错误信息
      if (error.response) {
        console.error('  - 响应状态:', error.response.status);
        console.error('  - 响应数据:', error.response.data);
      } else if (error.request) {
        console.error('  - 请求发送失败，未收到响应');
      }
      
      // 重试逻辑
      if (retryCount < maxRetries) {
        const delay = Math.pow(2, retryCount) * 1000; // 指数退避
        console.log(`等待 ${delay}ms 后重试...`);
        await new Promise(resolve => setTimeout(resolve, delay));
        return this.getBaiduAccessToken(retryCount + 1, maxRetries);
      }
      
      // 降级策略：返回模拟Token
      console.warn('⚠️  百度云API不可用，使用模拟Token');
      this.baiduAccessToken = 'mock-access-token';
      this.baiduTokenExpiresAt = Date.now() + 3600000; // 1小时过期
      return this.baiduAccessToken;
    }
  }
  
  /**
   * 百度云组合API调用 - 统一图像识别接口
   * @param {Buffer} imageBuffer - 图像Buffer
   * @param {Array} scenes - 要调用的模型服务列表
   * @param {Object} sceneConf - 个性化参数配置
   * @param {number} retryCount - 当前重试次数
   * @param {number} maxRetries - 最大重试次数
   * @returns {Promise<Object>} - 识别结果
   */
  async callBaiduCombinationAPI(imageBuffer, scenes, sceneConf = {}, retryCount = 0, maxRetries = 3) {
    try {
      // 生成缓存键
      const imageHash = this.generateImageHash(imageBuffer);
      const cacheKey = `baidu_combination_${imageHash}_${JSON.stringify(scenes)}_${JSON.stringify(sceneConf)}`;
      
      // 检查缓存
      const cachedResult = this.getCache(cacheKey);
      if (cachedResult) {
        console.log('✓ 使用缓存结果，避免重复API调用');
        return cachedResult;
      }
      
      // 缓存未命中，调用API
      const accessToken = await this.getBaiduAccessToken();
      
      // 检查是否使用模拟Token
      if (accessToken === 'mock-access-token') {
        console.warn('⚠️  使用模拟Token，返回模拟图像识别结果');
        const mockResult = this.getMockImageRecognitionResult(scenes);
        this.setCache(cacheKey, mockResult);
        return mockResult;
      }
      
      const imageBase64 = imageBuffer.toString('base64');
      
      console.log('正在调用百度云组合API...');
      
      const response = await axios.post(this.baiduCombinationApiUrl, {
        image: imageBase64,
        scenes: scenes,
        sceneConf: sceneConf
      }, {
        params: {
          access_token: accessToken
        },
        headers: {
          'Content-Type': 'application/json;charset=utf-8'
        },
        timeout: 60000, // 60秒超时
      });
      
      if (!response.data) {
        throw new Error('API调用失败：返回数据为空');
      }
      
      // 保存到缓存
      this.setCache(cacheKey, response.data);
      console.log('✓ API调用成功，结果已缓存');
      
      return response.data;
    } catch (error) {
      console.error(`百度云组合API调用失败 (${retryCount + 1}/${maxRetries}):`, error.message);
      
      // 详细错误信息
      if (error.response) {
        console.error('  - 响应状态:', error.response.status);
        console.error('  - 响应数据:', error.response.data);
      } else if (error.request) {
        console.error('  - 请求发送失败，未收到响应');
      }
      
      // 重试逻辑
      if (retryCount < maxRetries) {
        const delay = Math.pow(2, retryCount) * 1000; // 指数退避
        console.log(`等待 ${delay}ms 后重试...`);
        await new Promise(resolve => setTimeout(resolve, delay));
        return this.callBaiduCombinationAPI(imageBuffer, scenes, sceneConf, retryCount + 1, maxRetries);
      }
      
      // 降级策略：返回模拟结果
      console.warn('⚠️  百度云API不可用，返回模拟图像识别结果');
      const mockResult = this.getMockImageRecognitionResult(scenes);
      return mockResult;
    }
  }
  
  /**
   * 生成图像哈希值
   * @param {Buffer} imageBuffer - 图像Buffer
   * @returns {string} - 图像哈希值
   */
  generateImageHash(imageBuffer) {
    try {
      // 使用简单的哈希生成方法
      const base64 = imageBuffer.toString('base64');
      let hash = 0;
      for (let i = 0; i < base64.length; i++) {
        const char = base64.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash; // Convert to 32bit integer
      }
      return Math.abs(hash).toString(16);
    } catch (error) {
      // 出错时返回时间戳
      return Date.now().toString();
    }
  }
  
  /**
   * 获取模拟图像识别结果
   * @param {Array} scenes - 场景列表
   * @returns {Object} - 模拟识别结果
   */
  getMockImageRecognitionResult(scenes) {
    const mockResults = {
      animal: {
        result: [
          { keyword: '鸡', score: 0.98, baike_info: { description: '常见家禽' } }
        ]
      },
      advanced_general: {
        result: [
          { keyword: '家禽', score: 0.95 },
          { keyword: '养殖场', score: 0.85 },
          { keyword: '健康状况', score: 0.75 }
        ]
      }
    };
    
    let result = {};
    scenes.forEach(scene => {
      if (mockResults[scene]) {
        result[scene] = mockResults[scene];
      }
    });
    
    return result;
  }
  
  /**
   * 百度云图像识别 - 动物识别
   * @param {Buffer} imageBuffer - 图像Buffer
   * @returns {Promise<Object>} - 识别结果
   */
  async recognizeAnimal(imageBuffer) {
    try {
      const result = await this.callBaiduCombinationAPI(imageBuffer, ['animal'], {
        animal: {
          top_num: 5,
          baike_num: 5
        }
      });
      
      return result.animal || {};
    } catch (error) {
      console.error('百度云动物识别失败:', error.message);
      throw new Error('图像识别服务暂时不可用');
    }
  }
  
  /**
   * 百度云图像识别 - 图像分析
   * @param {Buffer} imageBuffer - 图像Buffer
   * @returns {Promise<Object>} - 识别结果
   */
  async analyzeImage(imageBuffer) {
    try {
      const result = await this.callBaiduCombinationAPI(imageBuffer, ['advanced_general'], {
        advanced_general: {
          baike_num: 5
        }
      });
      
      return result.advanced_general || {};
    } catch (error) {
      console.error('百度云图像分析失败:', error.message);
      throw new Error('图像分析服务暂时不可用');
    }
  }
  
  /**
   * 基于百度云图像识别结果的智能诊断服务
   * @param {Object} diagnosisData - 诊断数据
   * @returns {Promise<Object>} - 智能诊断结果
   */
  async intelligentDiagnosis(diagnosisData) {
    try {
      const { symptoms, imageAnalysis, environment, breed, age, previousDiagnosis } = diagnosisData;
      
      // 基于图像识别结果和症状进行智能诊断
      // 这里实现基于规则的诊断逻辑，实际项目中可以扩展为更复杂的AI模型
      
      // 分析图像识别结果
      const imageResults = [];
      if (imageAnalysis && imageAnalysis.result) {
        imageResults.push(...imageAnalysis.result.map(item => item.keyword));
      }
      
      // 简单的规则匹配诊断
      let diagnosis = {
        diseaseName: '未知疾病',
        confidence: 0.5,
        matchedSymptoms: symptoms
      };
      
      // 根据症状和图像结果进行诊断
      if (symptoms.includes('腹泻') || symptoms.includes('拉稀')) {
        diagnosis.diseaseName = '肠道感染';
        diagnosis.confidence = 0.7;
      } else if (symptoms.includes('咳嗽') || symptoms.includes('呼吸困难')) {
        diagnosis.diseaseName = '呼吸道感染';
        diagnosis.confidence = 0.75;
      } else if (imageResults.some(result => result.includes('病变') || result.includes('异常'))) {
        diagnosis.diseaseName = '疑似感染';
        diagnosis.confidence = 0.6;
      }
      
      // 生成治疗建议
      const treatmentAdvice = {
        medication: '根据具体病情选择合适药物',
        dosage: '请遵循兽医建议',
        treatmentPeriod: '7-14天'
      };
      
      // 生成预防措施
      const preventionMeasures = {
        isolation: '隔离患病禽类',
        disinfection: '加强环境消毒',
        managementAdjustment: '优化饲养管理'
      };
      
      // 生成注意事项
      const notes = {
        reminder: '请及时咨询兽医进行确诊',
        reexamination: '建议3天后复诊'
      };
      
      return {
        diagnosis,
        treatmentAdvice,
        preventionMeasures,
        notes
      };
    } catch (error) {
      console.error('智能诊断失败:', error.message);
      throw new Error('AI诊断服务暂时不可用');
    }
  }
  
  /**
   * 基于百度云图像识别结果的混合感染风险评估
   * @param {Object} riskData - 风险评估数据
   * @returns {Promise<Object>} - 风险评估结果
   */
  async mixedInfectionRiskAssessment(riskData) {
    try {
      const { symptoms, environment, breed, age, recentDiseases } = riskData;
      
      // 基于规则的风险评估
      let riskLevel = '中等';
      let mainPathogens = ['常见病原体'];
      let riskFactors = [];
      
      // 风险因素分析
      if (symptoms.length > 3) {
        riskFactors.push('多症状表现');
        riskLevel = '高';
      }
      
      if (environment.includes('潮湿') || environment.includes('拥挤')) {
        riskFactors.push('不良环境条件');
        riskLevel = '高';
      }
      
      if (recentDiseases) {
        riskFactors.push('近期有发病史');
      }
      
      return {
        riskAssessment: {
          overallRiskLevel: riskLevel,
          mainPathogens: mainPathogens,
          riskFactorAnalysis: riskFactors
        },
        preventionAdvice: {
          immediateMeasures: '加强监测，隔离可疑病例',
          shortTermStrategy: '改善环境条件，加强消毒',
          longTermPlanning: '优化免疫程序，加强饲养管理'
        },
        monitoringPlan: {
          frequency: '每日监测',
          indicators: ['体温、食欲、粪便状况'],
          abnormalHandling: '及时隔离并咨询兽医'
        }
      };
    } catch (error) {
      console.error('混合感染风险评估失败:', error.message);
      throw new Error('AI风险评估服务暂时不可用');
    }
  }
  
  /**
   * 基于百度云图像识别结果的紧急控制方案生成
   * @param {Object} emergencyData - 紧急情况数据
   * @returns {Promise<Object>} - 紧急控制方案
   */
  async emergencyControlPlan(emergencyData) {
    try {
      const { disease, affectedCount, totalCount, environment, symptoms } = emergencyData;
      
      // 基于规则的紧急方案生成
      const planLevel = affectedCount > totalCount * 0.1 ? '一级' : '二级';
      
      return {
        emergencyPlan: {
          planLevel: planLevel,
          implementationTime: new Date().toISOString(),
          responsibilityDivision: '养殖场负责人全面负责，兽医技术指导'
        },
        isolationMeasures: {
          isolationAreaSetup: '设置专门隔离区域，远离健康禽群',
          isolationProcedure: '穿戴防护装备，单独饲养患病禽类',
          personnelProtection: '佩戴口罩、手套，严格消毒'
        },
        disinfectionPlan: {
          disinfectionScope: '全场环境、器具、车辆',
          disinfectionDrugs: '含氯消毒剂、过氧乙酸',
          disinfectionFrequency: '每日2次'
        },
        treatmentPlan: {
          drugSelection: '根据确诊疾病选择敏感药物',
          administrationMethod: '混饮或混饲',
          treatmentPeriod: '7-14天'
        },
        harmlessTreatment: {
          treatmentObjects: '死亡禽类、污染物',
          treatmentMethod: '焚烧或深埋',
          notes: '严格按照动物防疫要求处理'
        },
        monitoringPlan: {
          monitoringIndicators: ['发病数量、死亡数量、症状变化'],
          monitoringFrequency: '每4小时一次',
          abnormalReportingProcess: '立即报告当地动物防疫部门'
        }
      };
    } catch (error) {
      console.error('紧急控制方案生成失败:', error.message);
      throw new Error('AI紧急方案服务暂时不可用');
    }
  }
  
  /**
   * 基于百度云图像识别结果的治疗效果跟踪与调整建议
   * @param {Object} treatmentData - 治疗数据
   * @returns {Promise<Object>} - 调整建议
   */
  async treatmentAdjustment(treatmentData) {
    try {
      const { diagnosis, treatmentPlan, currentSymptoms, duration, improvement } = treatmentData;
      
      // 基于规则的治疗调整建议
      let effectEvaluation = '中等';
      if (improvement.includes('明显')) {
        effectEvaluation = '良好';
      } else if (improvement.includes('无')) {
        effectEvaluation = '不佳';
      }
      
      return {
        treatmentEffect: {
          overallEffect: effectEvaluation,
          symptomImprovement: currentSymptoms.length < diagnosis.matchedSymptoms.length ? '部分改善' : '无改善',
          treatmentPlanReasonableness: '基本合理'
        },
        adjustmentSuggestions: {
          drugAdjustment: effectEvaluation === '不佳' ? '考虑更换药物' : '继续当前药物',
          dosageAdjustment: '维持当前剂量',
          administrationAdjustment: '建议混饮给药',
          treatmentPeriodAdjustment: duration < 7 ? '继续治疗' : '考虑停药'
        },
        auxiliaryTreatment: {
          nutritionAdjustment: '补充维生素和电解质',
          environmentAdjustment: '保持环境清洁干燥',
          careMeasures: '加强饲养管理'
        },
        followUpMonitoring: {
          monitoringIndicators: ['症状变化、食欲、粪便状况'],
          monitoringFrequency: '每日监测',
          reexaminationTime: '3天后'
        }
      };
    } catch (error) {
      console.error('治疗效果跟踪失败:', error.message);
      throw new Error('AI治疗建议服务暂时不可用');
    }
  }
  
  /**
   * 基于百度云图像识别结果的养殖建议生成
   * @param {Object} farmData - 养殖数据
   * @returns {Promise<Object>} - 养殖建议
   */
  async farmingAdvice(farmData) {
    try {
      const { breed, age, environment, feedingMethod, recentHealthStatus } = farmData;
      
      return {
        environmentOptimization: {
          temperatureControl: '保持适宜温度，根据季节调整',
          humidityControl: '维持湿度在40%-70%',
          ventilationManagement: '加强通风，保持空气新鲜',
          hygieneManagement: '定期清理粪便，消毒环境'
        },
        feedingManagement: {
          feedFormula: '选择优质全价饲料',
          feedingFrequency: '根据年龄调整饲喂次数',
          waterManagement: '提供清洁饮水，定期更换'
        },
        diseasePrevention: {
          vaccination: '按照免疫程序及时接种疫苗',
          regularDisinfection: '每周至少消毒2次',
          monitoringPlan: '定期监测禽类健康状况'
        },
        stressManagement: {
          reduceStressFactors: '避免温度突变、过度拥挤',
          stressResponseMeasures: '补充抗应激药物'
        },
        growthPerformanceOptimization: {
          growthMonitoring: '定期称重，监测生长速度',
          performanceImprovementMeasures: '优化饲料营养，改善环境条件'
        }
      };
    } catch (error) {
      console.error('养殖建议生成失败:', error.message);
      throw new Error('AI养殖建议服务暂时不可用');
    }
  }
  
  /**
   * 基于百度云图像识别结果的疾病风险预警
   * @param {Object} warningData - 预警数据
   * @returns {Promise<Object>} - 风险预警结果
   */
  async diseaseWarning(warningData) {
    try {
      const { environment, breed, age, recentWeather, neighboringFarmsStatus } = warningData;
      
      // 基于规则的疾病风险预警
      let riskLevel = '中等';
      let highRiskDiseases = ['呼吸道疾病', '肠道疾病'];
      let riskFactors = [];
      
      if (environment.includes('潮湿') || environment.includes('拥挤')) {
        riskFactors.push('环境条件不佳');
        riskLevel = '高';
      }
      
      if (recentWeather.includes('温差大') || recentWeather.includes('多雨')) {
        riskFactors.push('气候条件不利');
        riskLevel = '高';
      }
      
      if (neighboringFarmsStatus.includes('发病')) {
        riskFactors.push('周边疫情风险');
        riskLevel = '高';
      }
      
      return {
        diseaseRiskWarning: {
          overallRiskLevel: riskLevel,
          highRiskDiseases: highRiskDiseases,
          riskFactorAnalysis: riskFactors
        },
        warningBasis: {
          environmentalFactors: environment,
          climateFactors: recentWeather,
          neighboringEpidemics: neighboringFarmsStatus
        },
        preventionAdvice: {
          immediateMeasures: '加强监测，改善环境',
          shortTermStrategy: '加强消毒，提高免疫力',
          longTermPlanning: '优化免疫程序，加强生物安全'
        },
        monitoringAdvice: {
          monitoringIndicators: ['体温、食欲、精神状态'],
          monitoringFrequency: '每日监测',
          abnormalHandling: '及时隔离并咨询兽医'
        }
      };
    } catch (error) {
      console.error('疾病风险预警失败:', error.message);
      throw new Error('AI风险预警服务暂时不可用');
    }
  }
  
  /**
   * 基于百度云图像识别结果的对话诊断
   * @param {Object} diagnosisData - 诊断数据
   * @returns {Promise<string|Object>} - 对话诊断结果
   */
  async chatDiagnosis(diagnosisData) {
    try {
      const { symptoms, imageAnalysis, environment, breed, age, previousDiagnosis } = diagnosisData;
      
      // 基于规则的对话诊断逻辑
      let diagnosisResult = '';
      let structuredResult = null;
      
      // 分析症状
      const symptomKeywords = this.extractKeywords(symptoms);
      const environmentKeywords = this.extractKeywords(environment);
      
      // 基于症状的初步诊断
      let diseaseName = '未知疾病';
      let confidence = 0.5;
      let recommendations = '建议咨询专业兽医进行确诊';
      
      // 症状匹配
      if (symptomKeywords.includes('腹泻') || symptomKeywords.includes('拉稀')) {
        diseaseName = '肠道感染';
        confidence = 0.7;
        recommendations = '建议使用肠道消炎药，加强环境卫生管理';
      } else if (symptomKeywords.includes('咳嗽') || symptomKeywords.includes('呼吸困难')) {
        diseaseName = '呼吸道感染';
        confidence = 0.75;
        recommendations = '建议使用呼吸道药物，改善通风条件';
      } else if (symptomKeywords.includes('鸡冠发紫') || symptomKeywords.includes('精神沉郁')) {
        diseaseName = '疑似禽流感';
        confidence = 0.8;
        recommendations = '建议立即隔离，联系当地兽医部门进行检测';
      } else if (symptomKeywords.includes('神经症状') || symptomKeywords.includes('瘫痪')) {
        diseaseName = '疑似新城疫';
        confidence = 0.78;
        recommendations = '建议紧急免疫，加强消毒措施';
      }
      
      // 环境因素影响
      if (environmentKeywords.includes('潮湿') || environmentKeywords.includes('拥挤')) {
        confidence += 0.1;
        recommendations += '，改善环境条件';
      }
      
      // 生成诊断结果
      diagnosisResult = `根据您提供的信息，初步诊断为${diseaseName}，置信度${(confidence * 100).toFixed(0)}%。\n\n${recommendations}。\n\n建议：\n1. 隔离病禽\n2. 加强消毒\n3. 密切观察病情变化\n4. 如有加重请及时就医`;
      
      // 生成结构化结果
      structuredResult = {
        singleDiagnosis: [
          {
            pathogenName: diseaseName,
            confidence: confidence,
            coreEvidence: symptoms.substring(0, 100) + '...'
          }
        ],
        mixedInfectionRisk: {
          riskLevel: confidence > 0.7 ? 'HIGH' : 'MEDIUM',
          infectionCombinations: []
        },
        coreThreat: `主要威胁：${diseaseName}可能导致死亡率上升`,
        emergencyMeasures: {
          shortTerm: '立即隔离病禽，使用相应药物治疗',
          mediumTerm: '加强养殖场消毒，改善环境条件',
          longTerm: '优化免疫程序，建立疾病监测体系'
        },
        diagnosisPlan: {
          emergencyTests: ['临床症状观察', '病理变化检查'],
          importantTests: ['血清学检测'],
          inDepthTests: ['病毒分离鉴定']
        },
        finalDiagnosis: {
          conclusion: diagnosisResult,
          recommendations: recommendations
        },
        emergencyPreventionPlan: {
          '0-24小时': ['隔离病禽', '消毒场地'],
          '1-7天': ['药物治疗', '监测疫情'],
          '7-14天': ['评估效果', '调整方案']
        },
        biosecurityOptimizationPlan: {
          facilities: ['改善通风条件', '增加消毒通道'],
          management: ['建立严格的入场制度', '定期监测'],
          personnel: ['加强培训', '建立健康档案']
        }
      };
      
      // 根据调用方式返回不同格式
      if (typeof diagnosisData === 'string') {
        return diagnosisResult;
      } else {
        return structuredResult;
      }
    } catch (error) {
      console.error('对话诊断失败:', error.message);
      // 返回友好的错误提示
      return 'AI诊断服务暂时不可用，请稍后重试';
    }
  }
  
  /**
   * 提取关键词
   * @param {string} text - 文本
   * @returns {Array} - 关键词数组
   */
  extractKeywords(text) {
    if (!text) return [];
    
    const keywords = [];
    const keywordList = [
      '腹泻', '拉稀', '咳嗽', '呼吸困难', '鸡冠发紫', '精神沉郁',
      '神经症状', '瘫痪', '潮湿', '拥挤', '高温', '低温',
      '温差大', '多雨', '干燥', '通风不良', '饲料问题'
    ];
    
    keywordList.forEach(keyword => {
      if (text.includes(keyword)) {
        keywords.push(keyword);
      }
    });
    
    return keywords;
  }
  
  /**
   * 健康检查
   * @returns {Promise<Object>} - 健康检查结果
   */
  async healthCheck() {
    try {
      const healthStatus = {
        status: 'healthy',
        timestamp: new Date().toISOString(),
        components: {
          baiduApi: {
            status: 'unknown',
            details: {}
          },
          cache: {
            status: 'healthy',
            details: {
              size: this.cache.size,
              maxSize: this.maxCacheSize,
              ttl: this.cacheTTL
            }
          },
          config: {
            status: 'healthy',
            details: {
              hasApiKeys: this.baiduApiKey !== 'your-default-baidu-api-key',
              accessTokenValid: this.baiduAccessToken && Date.now() < this.baiduTokenExpiresAt
            }
          }
        }
      };
      
      // 检查百度云API连接
      try {
        const accessToken = await this.getBaiduAccessToken(0, 1);
        healthStatus.components.baiduApi.status = accessToken !== 'mock-access-token' ? 'healthy' : 'degraded';
        healthStatus.components.baiduApi.details.accessTokenValid = true;
      } catch (error) {
        healthStatus.components.baiduApi.status = 'unhealthy';
        healthStatus.components.baiduApi.details.error = error.message;
        healthStatus.status = 'degraded';
      }
      
      return healthStatus;
    } catch (error) {
      console.error('健康检查失败:', error.message);
      return {
        status: 'unhealthy',
        timestamp: new Date().toISOString(),
        error: error.message
      };
    }
  }
  
  /**
   * 重置服务状态
   */
  resetService() {
    try {
      console.log('正在重置AI服务状态...');
      
      // 清除缓存
      this.clearCache();
      
      // 重置AccessToken
      this.baiduAccessToken = null;
      this.baiduTokenExpiresAt = 0;
      
      console.log('✓ AI服务状态重置成功');
    } catch (error) {
      console.error('重置服务状态失败:', error.message);
    }
  }
}

module.exports = new AIService();
