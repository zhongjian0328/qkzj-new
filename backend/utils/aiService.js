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
    
    try {
      // 解析加密文件获取API密钥
      const encryptionFilePath = path.join(__dirname, '../../enckey_121236834');
      const apiKeys = EncryptionUtil.parseEncryptedFile(encryptionFilePath);
      
      // 使用加密文件中的API密钥
      this.baiduApiKey = apiKeys.baiduApiKey || this.baiduApiKey;
      this.baiduSecretKey = apiKeys.baiduSecretKey || this.baiduSecretKey;
      
      console.log('✓ 加密文件解析成功，已加载API密钥');
    } catch (error) {
      console.warn('⚠️  加密文件解析失败，使用默认API密钥:', error.message);
    }
  }
  
  /**
   * 缓存管理 - 设置缓存
   * @param {string} key - 缓存键
   * @param {any} value - 缓存值
   */
  setCache(key, value) {
    const now = Date.now();
    this.cache.set(key, {
      value: value,
      timestamp: now,
      expiresAt: now + this.cacheTTL
    });
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
      const response = await axios.get('https://aip.baidubce.com/oauth/2.0/token', {
        params: {
          grant_type: 'client_credentials',
          client_id: this.baiduApiKey,
          client_secret: this.baiduSecretKey
        }
      });
      
      this.baiduAccessToken = response.data.access_token;
      // 设置过期时间，提前10分钟刷新
      this.baiduTokenExpiresAt = Date.now() + (response.data.expires_in - 600) * 1000;
      
      return this.baiduAccessToken;
    } catch (error) {
      console.error(`获取百度云AccessToken失败 (${retryCount + 1}/${maxRetries}):`, error.message);
      
      // 重试逻辑
      if (retryCount < maxRetries) {
        const delay = Math.pow(2, retryCount) * 1000; // 指数退避
        console.log(`等待 ${delay}ms 后重试...`);
        await new Promise(resolve => setTimeout(resolve, delay));
        return this.getBaiduAccessToken(retryCount + 1, maxRetries);
      }
      
      throw new Error('获取百度云API授权失败');
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
      const imageHash = imageBuffer.toString('base64').substring(0, 100); // 使用图像Base64的前100个字符作为哈希
      const cacheKey = `baidu_combination_${imageHash}_${JSON.stringify(scenes)}_${JSON.stringify(sceneConf)}`;
      
      // 检查缓存
      const cachedResult = this.getCache(cacheKey);
      if (cachedResult) {
        console.log('✓ 使用缓存结果，避免重复API调用');
        return cachedResult;
      }
      
      // 缓存未命中，调用API
      const accessToken = await this.getBaiduAccessToken();
      const imageBase64 = imageBuffer.toString('base64');
      
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
        }
      });
      
      // 保存到缓存
      this.setCache(cacheKey, response.data);
      console.log('✓ API调用成功，结果已缓存');
      
      return response.data;
    } catch (error) {
      console.error(`百度云组合API调用失败 (${retryCount + 1}/${maxRetries}):`, error.message);
      
      // 重试逻辑
      if (retryCount < maxRetries) {
        const delay = Math.pow(2, retryCount) * 1000; // 指数退避
        console.log(`等待 ${delay}ms 后重试...`);
        await new Promise(resolve => setTimeout(resolve, delay));
        return this.callBaiduCombinationAPI(imageBuffer, scenes, sceneConf, retryCount + 1, maxRetries);
      }
      
      throw new Error('图像识别服务暂时不可用');
    }
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
}

module.exports = new AIService();
