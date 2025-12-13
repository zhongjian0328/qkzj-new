const axios = require('axios');
const FormData = require('form-data');

/**
 * AI服务类，封装百度云图像识别API、DeepSeek API和阿里云NLP服务调用
 */
class AIService {
  constructor() {
    // 百度云API配置
    this.baiduApiKey = process.env.BAIDU_API_KEY || '';
    this.baiduSecretKey = process.env.BAIDU_SECRET_KEY || '';
    this.baiduAccessToken = null;
    this.baiduTokenExpiresAt = 0;
    
    // DeepSeek API配置
    this.deepSeekApiKey = process.env.DEEPSEEK_API_KEY || '';
    this.deepSeekApiUrl = 'https://api.deepseek.com/v1/chat/completions';
    
    // 阿里云NLP服务配置 - 智能诊断引擎
    this.aliyunNlpApiKey = process.env.ALIYUN_NLP_API_KEY || '';
    this.aliyunNlpSecret = process.env.ALIYUN_NLP_SECRET || '';
    this.aliyunNlpEndpoint = process.env.ALIYUN_NLP_ENDPOINT || 'https://nlp.cn-hangzhou.aliyuncs.com';
    this.aliyunNlpVersion = '2018-04-08';
  }
  
  /**
   * 获取百度云AccessToken
   */
  async getBaiduAccessToken() {
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
      console.error('获取百度云AccessToken失败:', error.message);
      throw new Error('获取百度云API授权失败');
    }
  }
  
  /**
   * 百度云图像识别 - 动物识别
   * @param {Buffer} imageBuffer - 图像Buffer
   * @returns {Promise<Object>} - 识别结果
   */
  async recognizeAnimal(imageBuffer) {
    try {
      const accessToken = await this.getBaiduAccessToken();
      const imageBase64 = imageBuffer.toString('base64');
      
      const response = await axios.post('https://aip.baidubce.com/rest/2.0/image-classify/v1/animal', {
        image: imageBase64,
        baike_num: 5
      }, {
        params: {
          access_token: accessToken
        },
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      });
      
      return response.data;
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
      const accessToken = await this.getBaiduAccessToken();
      const imageBase64 = imageBuffer.toString('base64');
      
      const response = await axios.post('https://aip.baidubce.com/rest/2.0/image-classify/v2/advanced_general', {
        image: imageBase64,
        baike_num: 5
      }, {
        params: {
          access_token: accessToken
        },
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      });
      
      return response.data;
    } catch (error) {
      console.error('百度云图像分析失败:', error.message);
      throw new Error('图像分析服务暂时不可用');
    }
  }
  
  /**
   * DeepSeek API - 聊天对话
   * @param {Array} messages - 对话历史消息
   * @returns {Promise<string>} - AI回复
   */
  async chat(messages) {
    try {
      const response = await axios.post(this.deepSeekApiUrl, {
        model: 'deepseek-chat',
        messages: messages,
        temperature: 0.7,
        max_tokens: 1000
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.deepSeekApiKey}`
        }
      });
      
      return response.data.choices[0].message.content;
    } catch (error) {
      console.error('DeepSeek API调用失败:', error.message);
      throw new Error('AI对话服务暂时不可用');
    }
  }
  
  /**
   * DeepSeek API - 聊天诊断功能（结构化提示词）
   * @param {Object} diagnosisData - 诊断数据
   * @returns {Promise<string>} - AI诊断结果
   */
  /**
   * 阿里云NLP服务 - 智能诊断引擎
   * @param {Object} diagnosisData - 诊断数据
   * @returns {Promise<Object>} - 智能诊断结果
   */
  async alibabaIntelligentDiagnosis(diagnosisData) {
    try {
      // 构建阿里云NLP请求参数
      const requestParams = {
        Action: 'IntelligentDiagnosis',
        Version: this.aliyunNlpVersion,
        Format: 'JSON',
        SignatureMethod: 'HMAC-SHA1',
        SignatureVersion: '1.0',
        Timestamp: new Date().toISOString().split('.')[0] + 'Z',
        SignatureNonce: Date.now().toString(),
        Text: JSON.stringify(diagnosisData)
      };
      
      // 计算签名（简化实现，实际需要根据阿里云规范计算）
      // 这里使用模拟数据，实际项目中需要实现完整的阿里云签名算法
      
      // 调用阿里云NLP API
      const response = await axios.post(this.aliyunNlpEndpoint, requestParams, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.aliyunNlpApiKey}`
        }
      });
      
      return response.data;
    } catch (error) {
      console.error('阿里云智能诊断失败:', error.message);
      // 如果阿里云NLP服务不可用，回退到DeepSeek API
      console.log('回退到DeepSeek API进行诊断');
      return this.chatDiagnosis(diagnosisData);
    }
  }

  async chatDiagnosis(diagnosisData) {
    try {
      // 优先使用阿里云NLP智能诊断引擎
      if (this.aliyunNlpApiKey && this.aliyunNlpSecret) {
        return await this.alibabaIntelligentDiagnosis(diagnosisData);
      }
      
      // 如果阿里云NLP服务未配置，使用DeepSeek API
      const { symptoms, imageAnalysis, environment, breed, age, previousDiagnosis } = diagnosisData;
      
      const messages = [
        {
          role: 'system',
          content: `你是一位专业的禽病兽医，擅长诊断各种禽类疾病。请严格按照以下格式要求输出诊断结果：
          【诊断结果】
          - 疾病名称：
          - 可信度：
          - 主要症状匹配：
          
          【治疗建议】
          - 药物治疗：
          - 剂量与用法：
          - 治疗周期：
          
          【预防措施】
          - 隔离措施：
          - 消毒方案：
          - 饲养管理调整：
          
          【注意事项】
          - 特别提醒：
          - 复诊建议：
          
          请确保回答专业、准确，避免模糊不清的表述。`
        },
        {
          role: 'user',
          content: `请帮我诊断禽类疾病，信息如下：
          - 症状：${symptoms}
          - 图像分析结果：${JSON.stringify(imageAnalysis)}
          - 养殖环境：${environment}
          - 禽类品种：${breed}
          - 禽类年龄：${age}
          - 既往诊断：${previousDiagnosis || '无'}
          
          请按照指定格式输出详细的诊断结果、治疗建议和预防措施。`
        }
      ];
      
      return await this.chat(messages);
    } catch (error) {
      console.error('聊天诊断失败:', error.message);
      throw new Error('AI诊断服务暂时不可用');
    }
  }
  
  /**
   * DeepSeek API - 混合感染风险评估功能
   * @param {Object} riskData - 风险评估数据
   * @returns {Promise<string>} - 风险评估结果
   */
  async mixedInfectionRiskAssessment(riskData) {
    try {
      const { symptoms, environment, breed, age, recentDiseases } = riskData;
      
      const messages = [
        {
          role: 'system',
          content: `你是一位专业的禽病兽医，擅长评估禽类混合感染风险。请严格按照以下格式输出风险评估结果：
          【混合感染风险评估】
          - 总体风险等级：
          - 主要风险病原体：
          - 风险因素分析：
          
          【风险防控建议】
          - 立即采取措施：
          - 短期防控策略：
          - 长期防控规划：
          
          【监测方案】
          - 监测频率：
          - 监测指标：
          - 异常情况处理：`
        },
        {
          role: 'user',
          content: `请帮我评估禽类混合感染风险，信息如下：
          - 症状表现：${symptoms}
          - 养殖环境：${environment}
          - 禽类品种：${breed}
          - 禽类年龄：${age}
          - 近期发病情况：${recentDiseases || '无'}
          
          请按照指定格式输出详细的风险评估结果和防控建议。`
        }
      ];
      
      return await this.chat(messages);
    } catch (error) {
      console.error('混合感染风险评估失败:', error.message);
      throw new Error('AI风险评估服务暂时不可用');
    }
  }
  
  /**
   * DeepSeek API - 紧急控制方案生成功能
   * @param {Object} emergencyData - 紧急情况数据
   * @returns {Promise<string>} - 紧急控制方案
   */
  async emergencyControlPlan(emergencyData) {
    try {
      const { disease, affectedCount, totalCount, environment, symptoms } = emergencyData;
      
      const messages = [
        {
          role: 'system',
          content: `你是一位专业的禽病兽医，擅长制定禽类疾病紧急控制方案。请严格按照以下格式输出紧急控制方案：
          【紧急控制方案】
          - 方案等级：
          - 实施时间：
          - 责任分工：
          
          【隔离措施】
          - 隔离区域设置：
          - 隔离操作流程：
          - 人员防护要求：
          
          【消毒方案】
          - 消毒范围：
          - 消毒药物选择：
          - 消毒频率：
          
          【治疗方案】
          - 药物选择：
          - 给药方式：
          - 治疗周期：
          
          【无害化处理】
          - 处理对象：
          - 处理方法：
          - 注意事项：
          
          【监控方案】
          - 监控指标：
          - 监控频率：
          - 异常情况上报流程：`
        },
        {
          role: 'user',
          content: `请帮我制定禽类疾病紧急控制方案，信息如下：
          - 确诊疾病：${disease}
          - 发病数量：${affectedCount}
          - 总存栏数量：${totalCount}
          - 养殖环境：${environment}
          - 主要症状：${symptoms}
          
          请按照指定格式输出详细的紧急控制方案。`
        }
      ];
      
      return await this.chat(messages);
    } catch (error) {
      console.error('紧急控制方案生成失败:', error.message);
      throw new Error('AI紧急方案服务暂时不可用');
    }
  }
  
  /**
   * DeepSeek API - 治疗效果跟踪与调整建议功能
   * @param {Object} treatmentData - 治疗数据
   * @returns {Promise<string>} - 调整建议
   */
  async treatmentAdjustment(treatmentData) {
    try {
      const { diagnosis, treatmentPlan, currentSymptoms, duration, improvement } = treatmentData;
      
      const messages = [
        {
          role: 'system',
          content: `你是一位专业的禽病兽医，擅长评估治疗效果并提供调整建议。请严格按照以下格式输出调整建议：
          【治疗效果评估】
          - 总体效果：
          - 症状改善情况：
          - 治疗方案合理性：
          
          【调整建议】
          - 药物调整：
          - 剂量调整：
          - 给药方式调整：
          - 治疗周期调整：
          
          【辅助治疗建议】
          - 营养调整：
          - 环境调整：
          - 护理措施：
          
          【后续监测建议】
          - 监测指标：
          - 监测频率：
          - 复诊时间：`
        },
        {
          role: 'user',
          content: `请帮我评估治疗效果并提供调整建议，信息如下：
          - 初始诊断：${diagnosis}
          - 当前治疗方案：${treatmentPlan}
          - 目前症状：${currentSymptoms}
          - 治疗持续时间：${duration}
          - 症状改善情况：${improvement}
          
          请按照指定格式输出详细的治疗效果评估和调整建议。`
        }
      ];
      
      return await this.chat(messages);
    } catch (error) {
      console.error('治疗效果跟踪失败:', error.message);
      throw new Error('AI治疗建议服务暂时不可用');
    }
  }
  
  /**
   * DeepSeek API - 养殖建议生成功能
   * @param {Object} farmData - 养殖数据
   * @returns {Promise<string>} - 养殖建议
   */
  async farmingAdvice(farmData) {
    try {
      const { breed, age, environment, feedingMethod, recentHealthStatus } = farmData;
      
      const messages = [
        {
          role: 'system',
          content: `你是一位专业的禽病兽医，擅长提供科学的养殖建议。请严格按照以下格式输出养殖建议：
          【养殖环境优化建议】
          - 温度控制：
          - 湿度控制：
          - 通风管理：
          - 卫生管理：
          
          【饲养管理建议】
          - 饲料配方：
          - 饲喂频率：
          - 饮水管理：
          
          【疾病预防建议】
          - 疫苗接种：
          - 定期消毒：
          - 监测方案：
          
          【应激管理建议】
          - 减少应激因素：
          - 应激应对措施：
          
          【生长性能优化建议】
          - 生长监测：
          - 性能提升措施：`
        },
        {
          role: 'user',
          content: `请帮我生成养殖建议，信息如下：
          - 禽类品种：${breed}
          - 禽类年龄：${age}
          - 养殖环境：${environment}
          - 饲喂方式：${feedingMethod}
          - 近期健康状况：${recentHealthStatus}
          
          请按照指定格式输出详细的养殖建议。`
        }
      ];
      
      return await this.chat(messages);
    } catch (error) {
      console.error('养殖建议生成失败:', error.message);
      throw new Error('AI养殖建议服务暂时不可用');
    }
  }
  
  /**
   * DeepSeek API - 疾病风险预警功能
   * @param {Object} warningData - 预警数据
   * @returns {Promise<string>} - 风险预警结果
   */
  async diseaseWarning(warningData) {
    try {
      const { environment, breed, age, recentWeather, neighboringFarmsStatus } = warningData;
      
      const messages = [
        {
          role: 'system',
          content: `你是一位专业的禽病兽医，擅长预测疾病风险。请严格按照以下格式输出风险预警结果：
          【疾病风险预警】
          - 总体风险等级：
          - 高风险疾病：
          - 风险因素分析：
          
          【预警依据】
          - 环境因素：
          - 气候因素：
          - 周边疫情：
          
          【预防建议】
          - 立即采取措施：
          - 短期预防策略：
          - 长期防控规划：
          
          【监测建议】
          - 监测指标：
          - 监测频率：
          - 异常情况处理：`
        },
        {
          role: 'user',
          content: `请帮我预测疾病风险，信息如下：
          - 养殖环境：${environment}
          - 禽类品种：${breed}
          - 禽类年龄：${age}
          - 近期天气情况：${recentWeather}
          - 周边养殖场情况：${neighboringFarmsStatus}
          
          请按照指定格式输出详细的疾病风险预警结果和预防建议。`
        }
      ];
      
      return await this.chat(messages);
    } catch (error) {
      console.error('疾病风险预警失败:', error.message);
      throw new Error('AI风险预警服务暂时不可用');
    }
  }
}

module.exports = new AIService();
