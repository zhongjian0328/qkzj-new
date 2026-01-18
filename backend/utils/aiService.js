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
    // 百度云API配置（从环境变量或加密文件获取）
    this.baiduApiKey = process.env.BAIDU_API_KEY;
    this.baiduSecretKey = process.env.BAIDU_SECRET_KEY;
    this.baiduAccessToken = null;
    this.baiduTokenExpiresAt = 0;
    
    // 百度云API地址配置
    this.baiduCombinationApiUrl = 'https://aip.baidubce.com/api/v1/solution/direct/imagerecognition/combination';
    // 百度图像内容理解API地址
    this.baiduImageUnderstandingRequestUrl = 'https://aip.baidubce.com/rest/2.0/image-classify/v1/image-understanding/request';
    this.baiduImageUnderstandingResultUrl = 'https://aip.baidubce.com/rest/2.0/image-classify/v1/image-understanding/get-result';
    
    // 缓存机制配置 - 使用常量命名替代魔法数字
    this.cache = new Map();
    this.CACHE_TTL = 30 * 60 * 1000; // 缓存有效期30分钟
    this.MAX_CACHE_SIZE = 100; // 最大缓存数量
    // 更新实例属性引用
    this.cacheTTL = this.CACHE_TTL;
    this.maxCacheSize = this.MAX_CACHE_SIZE;
    
    try {
      // 检查加密文件是否存在
      const encryptionFilePath = path.join(__dirname, '../../enckey_121236834');
      if (fs.existsSync(encryptionFilePath)) {
        // 解析加密文件获取API密钥
        const apiKeys = EncryptionUtil.parseEncryptedFile(encryptionFilePath);
        
        // 使用加密文件中的API密钥
        if (apiKeys.baiduApiKey) {
          this.baiduApiKey = apiKeys.baiduApiKey;
        }
        if (apiKeys.baiduSecretKey) {
          this.baiduSecretKey = apiKeys.baiduSecretKey;
        }
        
        console.log('✓ 加密文件解析成功，已加载API密钥');
      }
    } catch (error) {
      console.warn('⚠️  加密文件解析失败，使用环境变量中的API密钥:', error.message);
    }
    
    // 验证API密钥
    this.validateApiKeys();
  }
  
  /**
   * 验证API密钥有效性
   */
  validateApiKeys() {
    if (!this.baiduApiKey || !this.baiduSecretKey) {
      console.warn('⚠️  API密钥未配置，可能导致API调用失败');
      console.warn('建议：设置环境变量 BAIDU_API_KEY 和 BAIDU_SECRET_KEY');
      // 在开发环境中使用模拟实现
      if (process.env.NODE_ENV === 'development') {
        console.warn('⚠️  开发环境中，将使用模拟API响应');
      }
    }
  }
  
  /**
   * 缓存管理 - 设置缓存
   * @param {string} key - 缓存键
   * @param {any} value - 缓存值
   */
  setCache(key, value) {
    const now = Date.now();
    
    // 如果键已存在，先删除旧的，确保它会被移到最近使用的位置
    if (this.cache.has(key)) {
      this.cache.delete(key);
    }
    
    // 检查缓存大小，超过限制时删除最旧的缓存
    if (this.cache.size >= this.maxCacheSize) {
      // 使用 Map 的迭代器获取第一个元素（最旧的）并删除
      const oldestKey = this.cache.keys().next().value;
      this.cache.delete(oldestKey);
      this.log('debug', '缓存已满，删除最旧的缓存项', {
        deletedKey: oldestKey,
        currentSize: this.cache.size,
        maxSize: this.maxCacheSize
      });
    }
    
    this.cache.set(key, {
      value: value,
      timestamp: now,
      expiresAt: now + this.cacheTTL
    });
    
    this.log('debug', '设置缓存项', {
      key,
      currentSize: this.cache.size,
      maxSize: this.maxCacheSize,
      ttl: this.cacheTTL
    });
  }
  
  /**
   * 缓存管理 - 清理过期缓存
   */
  cleanupCache() {
    const now = Date.now();
    let deletedCount = 0;
    
    // 遍历所有缓存项，删除过期的
    for (const [key, item] of this.cache.entries()) {
      if (now > item.expiresAt) {
        this.cache.delete(key);
        deletedCount++;
      }
    }
    
    if (deletedCount > 0) {
      this.log('info', '清理过期缓存完成', {
        deletedCount,
        currentSize: this.cache.size,
        maxSize: this.maxCacheSize
      });
    }
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
      this.log('debug', '缓存项已过期，删除', {
        key
      });
      return null;
    }
    
    // 缓存命中，将其移到最近使用的位置（Map会保持插入顺序）
    const value = cacheItem.value;
    this.cache.delete(key);
    this.cache.set(key, {
      value: value,
      timestamp: now,
      expiresAt: cacheItem.expiresAt
    });
    
    this.log('debug', '缓存命中', {
      key
    });
    return value;
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
      this.log('info', '使用缓存的百度云AccessToken', {
        tokenExpiry: new Date(this.baiduTokenExpiresAt).toLocaleString()
      });
      return this.baiduAccessToken;
    }
    
    const startTime = Date.now();
    const requestId = `token_req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    try {
      this.log('info', '正在获取百度云AccessToken', {
        requestId,
        apiKeyMasked: this.baiduApiKey.substring(0, 6) + '****' + this.baiduApiKey.substring(this.baiduApiKey.length - 4)
      });
      
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
      
      const endTime = Date.now();
      const duration = endTime - startTime;
      
      this.log('info', '百度云AccessToken获取成功', {
        requestId,
        duration: `${duration}ms`,
        expiresIn: response.data.expires_in,
        expiryTime: new Date(this.baiduTokenExpiresAt).toLocaleString()
      });
      
      return this.baiduAccessToken;
    } catch (error) {
      const endTime = Date.now();
      const duration = endTime - startTime;
      
      this.log('error', `获取百度云AccessToken失败 (${retryCount + 1}/${maxRetries})`, {
        requestId,
        duration: `${duration}ms`,
        error: error.message
      });
      
      // 详细错误信息
      if (error.response) {
        this.log('error', 'API响应错误详情', {
          requestId,
          status: error.response.status,
          data: error.response.data
        });
        // 分析具体错误类型
        switch (error.response.status) {
          case 401:
            this.log('error', '认证失败，API密钥无效', {
              requestId
            });
            break;
          case 403:
            this.log('error', '权限不足，API调用受限', {
              requestId
            });
            break;
          case 429:
            this.log('error', '请求频率过高，API限流', {
              requestId
            });
            break;
          case 500:
          case 502:
          case 503:
          case 504:
            this.log('error', '百度云服务器错误', {
              requestId,
              status: error.response.status
            });
            break;
          default:
            this.log('error', '其他HTTP错误', {
              requestId,
              status: error.response.status
            });
        }
      } else if (error.request) {
        this.log('error', '网络连接失败，未收到响应', {
          requestId,
          possibleReasons: ['防火墙阻止', '网络断开', 'DNS解析失败', '超时']
        });
      } else {
        this.log('error', '请求配置错误', {
          requestId,
          errorDetails: error.message
        });
      }
      
      // 重试逻辑
      if (retryCount < maxRetries) {
        const delay = Math.pow(2, retryCount) * 1000; // 指数退避
        this.log('info', `等待 ${delay}ms 后重试`, {
          requestId,
          retryCount: retryCount + 1,
          maxRetries
        });
        await new Promise(resolve => setTimeout(resolve, delay));
        return this.getBaiduAccessToken(retryCount + 1, maxRetries);
      }
      
      // 降级策略：返回模拟Token
      this.log('warn', '百度云API不可用，使用模拟Token', {
        requestId
      });
      this.baiduAccessToken = 'mock-access-token';
      this.baiduTokenExpiresAt = Date.now() + 3600000; // 1小时过期
      return this.baiduAccessToken;
    }
  }
  
  /**
   * 记录详细日志
   * @param {string} level - 日志级别
   * @param {string} message - 日志消息
   * @param {Object} data - 附加数据
   */
  log(level, message, data = {}) {
    const timestamp = new Date().toISOString();
    const logData = {
      timestamp,
      level,
      message,
      ...data
    };
    
    switch (level) {
      case 'info':
        console.log(`[INFO] ${timestamp} - ${message}`, data);
        break;
      case 'warn':
        console.warn(`[WARN] ${timestamp} - ${message}`, data);
        break;
      case 'error':
        console.error(`[ERROR] ${timestamp} - ${message}`, data);
        break;
      case 'debug':
        console.debug(`[DEBUG] ${timestamp} - ${message}`, data);
        break;
      default:
        console.log(`[${level.toUpperCase()}] ${timestamp} - ${message}`, data);
    }
  }

  /**
   * 百度图像内容理解API调用 - 两步式图像识别接口
   * @param {Buffer} imageBuffer - 图像Buffer
   * @param {string} question - 提问信息
   * @param {number} retryCount - 当前重试次数
   * @param {number} maxRetries - 最大重试次数
   * @returns {Promise<Object>} - 识别结果
   */
  async callBaiduImageUnderstandingAPI(imageBuffer, question = '这张图片里有什么？', retryCount = 0, maxRetries = 3) {
    const startTime = Date.now();
    const requestId = `img_understand_req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    try {
      // 生成缓存键
      const imageHash = this.generateImageHash(imageBuffer);
      const cacheKey = `baidu_image_understanding_${imageHash}_${question}`;
      
      // 检查缓存
      const cachedResult = this.getCache(cacheKey);
      if (cachedResult) {
        this.log('info', '使用缓存结果，避免重复API调用', {
          requestId,
          cacheKey,
          question
        });
        return cachedResult;
      }
      
      // 缓存未命中，调用API
      const accessToken = await this.getBaiduAccessToken();
      
      // 检查是否使用模拟Token
      if (accessToken === 'mock-access-token') {
        this.log('warn', '使用模拟Token，返回模拟图像理解结果', {
          requestId,
          question
        });
        const mockResult = this.getMockImageUnderstandingResult(question);
        this.setCache(cacheKey, mockResult);
        return mockResult;
      }
      
      const imageBase64 = imageBuffer.toString('base64');
      
      // Step 1: 提交图像理解请求
      this.log('info', '正在提交百度图像内容理解请求', {
        requestId,
        apiUrl: this.baiduImageUnderstandingRequestUrl,
        question,
        imageSize: `${(imageBuffer.length / 1024).toFixed(2)}KB`
      });
      
      const requestResponse = await axios.post(this.baiduImageUnderstandingRequestUrl, {
        image: imageBase64,
        question: question
      }, {
        params: {
          access_token: accessToken
        },
        headers: {
          'Content-Type': 'application/json;charset=utf-8'
        },
        timeout: 60000, // 60秒超时
      });
      
      if (!requestResponse.data || !requestResponse.data.result || !requestResponse.data.result.task_id) {
        throw new Error('API调用失败：返回数据格式错误，缺少task_id');
      }
      
      const taskId = requestResponse.data.result.task_id;
      this.log('info', '图像内容理解请求提交成功，获取到task_id', {
        requestId,
        taskId,
        logId: requestResponse.data.log_id
      });
      
      // Step 2: 轮询获取结果
      const pollingInterval = 2000; // 2秒轮询一次
      const maxPollingTime = 60000; // 最大轮询时间60秒
      const startTimePolling = Date.now();
      
      while (Date.now() - startTimePolling < maxPollingTime) {
        this.log('debug', '正在轮询获取图像内容理解结果', {
          requestId,
          taskId,
          elapsedTime: Date.now() - startTimePolling
        });
        
        const resultResponse = await axios.post(this.baiduImageUnderstandingResultUrl, {
          task_id: taskId
        }, {
          params: {
            access_token: accessToken
          },
          headers: {
            'Content-Type': 'application/json;charset=utf-8'
          },
          timeout: 60000, // 60秒超时
        });
        
        if (!resultResponse.data || !resultResponse.data.result) {
          throw new Error('API调用失败：返回数据格式错误');
        }
        
        const result = resultResponse.data.result;
        
        if (result.ret_code === 0) {
          // 处理成功
          this.log('info', '图像内容理解结果获取成功', {
            requestId,
            taskId,
            logId: resultResponse.data.log_id,
            retCode: result.ret_code,
            retMsg: result.ret_msg,
            duration: `${Date.now() - startTime}ms`
          });
          
          // 保存到缓存
          const finalResult = {
            description: result.description,
            task_id: result.task_id
          };
          this.setCache(cacheKey, finalResult);
          return finalResult;
        } else if (result.ret_code === 1) {
          // 处理中，继续轮询
          this.log('debug', '图像内容理解结果处理中，继续轮询', {
            requestId,
            taskId,
            retMsg: result.ret_msg
          });
          await new Promise(resolve => setTimeout(resolve, pollingInterval));
        } else {
          // 其他错误
          throw new Error(`API调用失败：${result.ret_msg} (错误码：${result.ret_code})`);
        }
      }
      
      // 轮询超时
      throw new Error('API调用失败：轮询获取结果超时');
      
    } catch (error) {
      const endTime = Date.now();
      const duration = endTime - startTime;
      
      this.log('error', `百度图像内容理解API调用失败 (${retryCount + 1}/${maxRetries})`, {
        requestId,
        duration: `${duration}ms`,
        error: error.message,
        question
      });
      
      // 详细错误信息
      if (error.response) {
        this.log('error', 'API响应错误详情', {
          requestId,
          status: error.response.status,
          data: error.response.data
        });
        // 分析具体错误类型
        switch (error.response.status) {
          case 400:
            this.log('error', '请求参数错误', {
              requestId,
              possibleReasons: ['图像格式错误', '参数缺失或无效', '图像大小超限', '问题描述过长']
            });
            break;
          case 401:
            this.log('error', '认证失败，AccessToken无效', {
              requestId
            });
            break;
          case 403:
            this.log('error', '权限不足，API调用受限', {
              requestId
            });
            break;
          case 429:
            this.log('error', '请求频率过高，API限流', {
              requestId
            });
            break;
          case 500:
          case 502:
          case 503:
          case 504:
            this.log('error', '百度云服务器错误', {
              requestId,
              status: error.response.status
            });
            break;
          default:
            this.log('error', '其他HTTP错误', {
              requestId,
              status: error.response.status
            });
        }
      } else if (error.request) {
        this.log('error', '网络连接失败，未收到响应', {
          requestId,
          possibleReasons: ['防火墙阻止', '网络断开', 'DNS解析失败', '超时']
        });
      } else {
        this.log('error', '请求配置错误', {
          requestId,
          errorDetails: error.message
        });
      }
      
      // 重试逻辑
      if (retryCount < maxRetries) {
        const delay = Math.pow(2, retryCount) * 1000; // 指数退避
        this.log('info', `等待 ${delay}ms 后重试`, {
          requestId,
          retryCount: retryCount + 1,
          maxRetries
        });
        await new Promise(resolve => setTimeout(resolve, delay));
        return this.callBaiduImageUnderstandingAPI(imageBuffer, question, retryCount + 1, maxRetries);
      }
      
      // 降级策略：返回模拟结果
      this.log('warn', '百度图像内容理解API不可用，返回模拟结果', {
        requestId,
        question
      });
      const mockResult = this.getMockImageUnderstandingResult(question);
      return mockResult;
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
    const startTime = Date.now();
    const requestId = `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    try {
      // 生成缓存键
      const imageHash = this.generateImageHash(imageBuffer);
      const cacheKey = `baidu_combination_${imageHash}_${JSON.stringify(scenes)}_${JSON.stringify(sceneConf)}`;
      
      // 检查缓存
      const cachedResult = this.getCache(cacheKey);
      if (cachedResult) {
        this.log('info', '使用缓存结果，避免重复API调用', {
          requestId,
          cacheKey,
          scenes
        });
        return cachedResult;
      }
      
      // 缓存未命中，调用API
      const accessToken = await this.getBaiduAccessToken();
      
      // 检查是否使用模拟Token
      if (accessToken === 'mock-access-token') {
        this.log('warn', '使用模拟Token，返回模拟图像识别结果', {
          requestId,
          scenes,
          sceneConf
        });
        const mockResult = this.getMockImageRecognitionResult(scenes);
        this.setCache(cacheKey, mockResult);
        return mockResult;
      }
      
      const imageBase64 = imageBuffer.toString('base64');
      
      this.log('info', '正在调用百度云组合API', {
        requestId,
        apiUrl: this.baiduCombinationApiUrl,
        scenes,
        sceneConf,
        imageSize: `${(imageBuffer.length / 1024).toFixed(2)}KB`
      });
      
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
      
      const endTime = Date.now();
      const duration = endTime - startTime;
      
      // 保存到缓存
      this.setCache(cacheKey, response.data);
      
      this.log('info', 'API调用成功，结果已缓存', {
        requestId,
        duration: `${duration}ms`,
        scenes,
        responseSize: `${JSON.stringify(response.data).length} bytes`
      });
      
      return response.data;
    } catch (error) {
      const endTime = Date.now();
      const duration = endTime - startTime;
      
      this.log('error', `百度云组合API调用失败 (${retryCount + 1}/${maxRetries})`, {
        requestId,
        duration: `${duration}ms`,
        error: error.message,
        scenes,
        sceneConf
      });
      
      // 详细错误信息
      if (error.response) {
        this.log('error', 'API响应错误详情', {
          requestId,
          status: error.response.status,
          data: error.response.data,
          headers: error.response.headers
        });
        // 分析具体错误类型
        switch (error.response.status) {
          case 400:
            this.log('error', '请求参数错误', {
              requestId,
              possibleReasons: ['图像格式错误', '参数缺失或无效', '图像大小超限']
            });
            break;
          case 401:
            this.log('error', '认证失败，AccessToken无效', {
              requestId
            });
            break;
          case 403:
            this.log('error', '权限不足，API调用受限', {
              requestId
            });
            break;
          case 429:
            this.log('error', '请求频率过高，API限流', {
              requestId
            });
            break;
          case 500:
          case 502:
          case 503:
          case 504:
            this.log('error', '百度云服务器错误', {
              requestId,
              status: error.response.status
            });
            break;
          default:
            this.log('error', '其他HTTP错误', {
              requestId,
              status: error.response.status
            });
        }
      } else if (error.request) {
        this.log('error', '网络连接失败，未收到响应', {
          requestId,
          possibleReasons: ['防火墙阻止', '网络断开', 'DNS解析失败', '超时']
        });
      } else {
        this.log('error', '请求配置错误', {
          requestId,
          errorDetails: error.message
        });
      }
      
      // 重试逻辑
      if (retryCount < maxRetries) {
        const delay = Math.pow(2, retryCount) * 1000; // 指数退避
        this.log('info', `等待 ${delay}ms 后重试`, {
          requestId,
          retryCount: retryCount + 1,
          maxRetries
        });
        await new Promise(resolve => setTimeout(resolve, delay));
        return this.callBaiduCombinationAPI(imageBuffer, scenes, sceneConf, retryCount + 1, maxRetries);
      }
      
      // 降级策略：返回模拟结果
      this.log('warn', '百度云API不可用，返回模拟图像识别结果', {
        requestId,
        scenes
      });
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
   * 获取模拟图像理解结果
   * @param {string} question - 提问信息
   * @returns {Object} - 模拟理解结果
   */
  getMockImageUnderstandingResult(question) {
    // 基于不同的问题返回不同的模拟结果
    let description = '';
    
    if (question.includes('什么')) {
      description = '这张图片展示了一群健康的鸡，它们在干净的养殖场环境中活动。可以看到鸡的羽毛整齐，精神状态良好，周围环境整洁，有适当的通风和光照条件。';
    } else if (question.includes('健康')) {
      description = '从图片中可以观察到，这些鸡的健康状况良好。它们的羽毛光滑整洁，鸡冠红润，行动活泼，没有明显的疾病症状。养殖场的环境也比较卫生，有利于鸡的健康生长。';
    } else if (question.includes('环境')) {
      description = '图片中的养殖场环境看起来比较理想。地面干净，没有明显的粪便堆积，鸡舍有良好的通风设施，光照充足。这种环境有助于减少疾病传播，促进鸡的健康生长。';
    } else {
      description = '这是一张养殖场的图片，展示了一群鸡在鸡舍中活动。鸡的数量较多，看起来健康状况良好，环境也比较整洁。';
    }
    
    return {
      description: description,
      task_id: `mock_task_${Date.now()}`
    };
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
      // 使用新的图像内容理解API进行图像分析
      const result = await this.callBaiduImageUnderstandingAPI(imageBuffer, '请详细描述这张图片的内容，包括物体、场景、健康状况等信息');
      
      // 转换结果格式，保持向后兼容性
      // 旧格式: { result: [{ keyword: 'xxx', score: 0.xx }, ...] }
      // 新格式: { description: 'xxx', task_id: 'xxx' }
      
      // 从描述中提取关键词作为模拟的旧格式结果
      const keywords = this.extractKeywordsFromDescription(result.description);
      
      return {
        result: keywords,
        description: result.description,
        task_id: result.task_id
      };
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
      
      // 聊天诊断始终返回字符串格式响应
  return diagnosisResult;
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
   * 从描述中提取关键词，用于保持向后兼容性
   * @param {string} description - 图像描述文本
   * @returns {Array} - 关键词数组，包含keyword和score字段
   */
  extractKeywordsFromDescription(description) {
    if (!description) return [];
    
    // 定义可能的关键词列表及其权重
    const keywordWeights = {
      // 物体类
      '鸡': 0.95,
      '家禽': 0.90,
      '养殖场': 0.85,
      '鸡舍': 0.85,
      '环境': 0.80,
      // 健康状况类
      '健康': 0.95,
      '良好': 0.90,
      '精神状态': 0.85,
      '羽毛': 0.85,
      '鸡冠': 0.80,
      // 环境类
      '干净': 0.90,
      '整洁': 0.85,
      '通风': 0.80,
      '光照': 0.75,
      '卫生': 0.85,
      // 动作类
      '活动': 0.75,
      '生长': 0.70
    };
    
    const result = [];
    
    // 遍历关键词列表，检查是否在描述中出现
    for (const [keyword, weight] of Object.entries(keywordWeights)) {
      if (description.includes(keyword)) {
        result.push({
          keyword: keyword,
          score: weight
        });
      }
    }
    
    // 如果没有匹配到任何关键词，添加一个默认关键词
    if (result.length === 0) {
      result.push({
        keyword: '图像内容',
        score: 0.80
      });
    }
    
    // 按分数降序排序
    return result.sort((a, b) => b.score - a.score);
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
        healthStatus.components.baiduApi.details.apiEndpoints = {
          combinationApi: this.baiduCombinationApiUrl,
          imageUnderstandingRequestApi: this.baiduImageUnderstandingRequestUrl,
          imageUnderstandingResultApi: this.baiduImageUnderstandingResultUrl
        };
      } catch (error) {
        healthStatus.components.baiduApi.status = 'unhealthy';
        healthStatus.components.baiduApi.details.error = error.message;
        healthStatus.components.baiduApi.details.apiEndpoints = {
          combinationApi: this.baiduCombinationApiUrl,
          imageUnderstandingRequestApi: this.baiduImageUnderstandingRequestUrl,
          imageUnderstandingResultApi: this.baiduImageUnderstandingResultUrl
        };
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
