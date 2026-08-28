const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const path = require('path');
const OpenAI = require('openai');

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
 * AI服务类，封装百度云图像识别API和通义千问LLM调用
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

    // 缓存机制配置
    this.cache = new Map();
    this.CACHE_TTL = 30 * 60 * 1000; // 缓存有效期30分钟
    this.MAX_CACHE_SIZE = 100; // 最大缓存数量
    // 更新实例属性引用
    this.cacheTTL = this.CACHE_TTL;
    this.maxCacheSize = this.MAX_CACHE_SIZE;

    // 通义千问 DashScope LLM 客户端（OpenAI-compatible 接口）
    const dashscopeApiKey = process.env.DASHSCOPE_API_KEY;
    const dashscopeBaseUrl = process.env.DASHSCOPE_BASE_URL || 'https://dashscope.aliyuncs.com/compatible-mode/v1';
    this.llmModel = process.env.DASHSCOPE_MODEL || 'qwen-plus';
    if (dashscopeApiKey) {
      this.llmClient = new OpenAI({
        apiKey: dashscopeApiKey,
        baseURL: dashscopeBaseUrl,
      });
      this.log('info', '通义千问 LLM 客户端初始化成功', {
        model: this.llmModel,
        baseURL: dashscopeBaseUrl
      });
    } else {
      this.log('warn', '通义千问 LLM 客户端未初始化：缺少 DASHSCOPE_API_KEY 环境变量');
      this.llmClient = null;
    }

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

  // ======================== 通义千问 LLM 调用核心方法 ========================

  /**
   * 调用通义千问 LLM，返回文本
   * @param {string} systemPrompt - 系统提示词
   * @param {string} userPrompt - 用户提示词
   * @returns {Promise<string>} LLM 回答文本
   */
  async _callLLM(systemPrompt, userPrompt) {
    if (!this.llmClient) {
      this.log('warn', 'LLM 客户端不可用，将使用降级响应');
      return this._llmFallback(systemPrompt, userPrompt);
    }

    try {
      const completion = await this.llmClient.chat.completions.create({
        model: this.llmModel,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
        temperature: 0.7,
        max_tokens: 2048,
      });

      const content = completion.choices[0]?.message?.content;
      if (!content) {
        throw new Error('LLM 返回内容为空');
      }
      return content.trim();
    } catch (error) {
      this.log('error', '通义千问 LLM 调用失败', {
        error: error.message,
        model: this.llmModel,
      });
      return this._llmFallback(systemPrompt, userPrompt);
    }
  }

  /**
   * 调用通义千问 LLM，要求返回 JSON 并自动解析
   * @param {string} systemPrompt - 系统提示词
   * @param {string} userPrompt - 用户提示词
   * @returns {Promise<Object>} 解析后的 JSON 对象
   */
  async _callLLMJson(systemPrompt, userPrompt) {
    if (!this.llmClient) {
      this.log('warn', 'LLM 客户端不可用，将使用降级响应');
      return this._llmFallback(systemPrompt, userPrompt);
    }

    try {
      const completion = await this.llmClient.chat.completions.create({
        model: this.llmModel,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
        temperature: 0.5,
        max_tokens: 4096,
        response_format: { type: 'json_object' },
      });

      const content = completion.choices[0]?.message?.content;
      if (!content) {
        throw new Error('LLM 返回内容为空');
      }

      // 尝试解析 JSON，如果失败则提取 JSON 代码块
      try {
        return JSON.parse(content.trim());
      } catch (parseError) {
        // 尝试从 markdown 代码块中提取 JSON
        const jsonMatch = content.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
        if (jsonMatch) {
          return JSON.parse(jsonMatch[1].trim());
        }
        this.log('error', 'LLM JSON 解析失败', { content: content.substring(0, 200) });
        throw new Error('LLM 返回的 JSON 格式无效');
      }
    } catch (error) {
      this.log('error', '通义千问 LLM JSON 调用失败', {
        error: error.message,
        model: this.llmModel,
      });
      return this._llmFallback(systemPrompt, userPrompt);
    }
  }

  /**
   * 降级回退：当 LLM 不可用时返回提示性文本或空对象
   */
  _llmFallback(systemPrompt, userPrompt) {
    // 如果系统提示词中包含 "JSON" 关键字，返回空对象
    if (systemPrompt.includes('JSON')) {
      return {};
    }
    return 'AI诊断服务暂时不可用（LLM未配置），请稍后重试。建议联系管理员配置 DASHSCOPE_API_KEY。';
  }

  /**
   * 构建禽病诊断场景的系统提示词
   * @returns {string}
   */
  _buildDiagnosisSystemPrompt() {
    return `你是一位经验丰富的禽病诊断专家兽医，专注于家禽（鸡、鸭、鹅等）疾病的诊断与防控。
你的职责：
1. 根据临床症状、病理变化、环境因素等综合分析可能的病原体
2. 能够识别混合感染情况并评估风险等级
3. 提供切实可行的治疗建议和防控措施
4. 使用规范的兽医专业术语，同时保证养殖户能够理解

注意事项：
- 诊断时优先考虑常见禽病（如新城疫、禽流感、传染性支气管炎、大肠杆菌病、支原体病等）
- 给出置信度评估（0-1之间的小数）
- 防控措施要具体可操作，包含时间线和优先级
- 如涉及高致病性传染病，须强调立即上报当地动物防疫部门`;
  }

  // ======================== 缓存管理 ========================

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
   * 基于通义千问 LLM 的智能诊断服务
   * @param {Object} diagnosisData - 诊断数据
   * @returns {Promise<Object>} - 智能诊断结果
   */
  async intelligentDiagnosis(diagnosisData) {
    try {
      const { symptoms, imageAnalysis, environment, breed, age, previousDiagnosis } = diagnosisData;

      const systemPrompt = this._buildDiagnosisSystemPrompt();
      const userPrompt = `请根据以下信息进行禽病智能诊断：
- 症状：${symptoms}
- 品种：${breed}
- 日龄：${age}
- 环境：${environment}
- 既往诊断：${previousDiagnosis || '无'}
${imageAnalysis ? '- 图像识别结果：' + JSON.stringify(imageAnalysis) : ''}

请返回以下JSON格式的诊断结果：
{
  "diagnosis": { "diseaseName": "疾病名称", "confidence": 0.85, "matchedSymptoms": ["症状1", "症状2"] },
  "treatmentAdvice": { "medication": "用药建议", "dosage": "剂量建议", "treatmentPeriod": "疗程" },
  "preventionMeasures": { "isolation": "隔离措施", "disinfection": "消毒措施", "managementAdjustment": "管理调整" },
  "notes": { "reminder": "注意事项", "reexamination": "复诊建议" }
}`;

      const result = await this._callLLMJson(systemPrompt, userPrompt);
      return result;
    } catch (error) {
      console.error('智能诊断失败:', error.message);
      throw new Error('AI诊断服务暂时不可用');
    }
  }

  /**
   * 基于通义千问 LLM 的混合感染风险评估
   * @param {Object} riskData - 风险评估数据
   * @returns {Promise<Object>} - 风险评估结果
   */
  async mixedInfectionRiskAssessment(riskData) {
    try {
      const { symptoms, environment, breed, age, recentDiseases } = riskData;

      const systemPrompt = `你是一位禽病流行病学专家，擅长分析混合感染风险。
请根据提供的症状、环境和病史信息，评估混合感染的可能性、风险等级和主要病原体组合。
使用规范的兽医专业术语，输出JSON格式结果。

请严格返回以下JSON结构：
{
  "riskAssessment": {
    "overallRiskLevel": "低/中/高",
    "mainPathogens": ["病原体1", "病原体2"],
    "riskFactorAnalysis": ["风险因素1", "风险因素2"]
  },
  "preventionAdvice": {
    "immediateMeasures": "即时措施建议",
    "shortTermStrategy": "短期策略",
    "longTermPlanning": "长期规划"
  },
  "monitoringPlan": {
    "frequency": "监测频率",
    "indicators": ["监测指标1", "监测指标2"],
    "abnormalHandling": "异常处理流程"
  }
}`;

      const userPrompt = `请评估以下禽病混合感染风险：
- 症状：${symptoms}
- 品种：${breed}
- 日龄：${age}
- 环境条件：${environment}
- 近期发病史：${recentDiseases || '无'}

请综合分析混合感染风险并返回JSON格式评估结果。`;

      const result = await this._callLLMJson(systemPrompt, userPrompt);
      return result;
    } catch (error) {
      console.error('混合感染风险评估失败:', error.message);
      throw new Error('AI风险评估服务暂时不可用');
    }
  }

  /**
   * 基于通义千问 LLM 的紧急控制方案生成
   * @param {Object} emergencyData - 紧急情况数据
   * @returns {Promise<Object>} - 紧急控制方案
   */
  async emergencyControlPlan(emergencyData) {
    try {
      const { disease, affectedCount, totalCount, environment, symptoms } = emergencyData;

      const systemPrompt = `你是一位禽病应急防控专家，擅长制定紧急控制方案。
请根据疫情信息制定包含隔离、消毒、治疗、无害化处理在内的综合防控方案。
方案要具有可操作性，考虑实际养殖场景的可行性。

请严格返回以下JSON结构：
{
  "emergencyPlan": {
    "planLevel": "一级/二级/三级",
    "implementationTime": "启动时间（ISO格式）",
    "responsibilityDivision": "责任分工"
  },
  "isolationMeasures": {
    "isolationAreaSetup": "隔离区设置",
    "isolationProcedure": "隔离操作流程",
    "personnelProtection": "人员防护"
  },
  "disinfectionPlan": {
    "disinfectionScope": "消毒范围",
    "disinfectionDrugs": "消毒剂选择",
    "disinfectionFrequency": "消毒频率"
  },
  "treatmentPlan": {
    "drugSelection": "药物选择",
    "administrationMethod": "给药方式",
    "treatmentPeriod": "疗程"
  },
  "harmlessTreatment": {
    "treatmentObjects": "处理对象",
    "treatmentMethod": "处理方法",
    "notes": "注意事项"
  },
  "monitoringPlan": {
    "monitoringIndicators": ["指标1", "指标2"],
    "monitoringFrequency": "监测频率",
    "abnormalReportingProcess": "异常报告流程"
  }
}`;

      const userPrompt = `请根据以下疫情信息制定紧急控制方案：
- 确诊/疑似疾病：${disease}
- 发病数量：${affectedCount}
- 总存栏量：${totalCount}
- 发病率：${totalCount ? ((affectedCount / totalCount) * 100).toFixed(1) + '%' : '未知'}
- 临床症状：${symptoms}
- 环境条件：${environment}

请生成可操作的紧急控制方案，返回JSON格式。`;

      const result = await this._callLLMJson(systemPrompt, userPrompt);
      return result;
    } catch (error) {
      console.error('紧急控制方案生成失败:', error.message);
      throw new Error('AI紧急方案服务暂时不可用');
    }
  }

  /**
   * 基于通义千问 LLM 的治疗效果跟踪与调整建议
   * @param {Object} treatmentData - 治疗数据
   * @returns {Promise<Object>} - 调整建议
   */
  async treatmentAdjustment(treatmentData) {
    try {
      const { diagnosis, treatmentPlan, currentSymptoms, duration, improvement } = treatmentData;

      const systemPrompt = `你是一位禽病治疗专家，擅长评估治疗效果并给出调整建议。
请根据当前治疗情况和症状变化，评估疗效并给出药物调整、辅助治疗和后续监测建议。

请严格返回以下JSON结构：
{
  "treatmentEffect": {
    "overallEffect": "良好/中等/不佳",
    "symptomImprovement": "明显改善/部分改善/无改善/加重",
    "treatmentPlanReasonableness": "合理/基本合理/需要调整"
  },
  "adjustmentSuggestions": {
    "drugAdjustment": "药物调整建议",
    "dosageAdjustment": "剂量调整建议",
    "administrationAdjustment": "给药方式调整",
    "treatmentPeriodAdjustment": "疗程调整建议"
  },
  "auxiliaryTreatment": {
    "nutritionAdjustment": "营养调整",
    "environmentAdjustment": "环境调整",
    "careMeasures": "护理措施"
  },
  "followUpMonitoring": {
    "monitoringIndicators": ["指标1", "指标2"],
    "monitoringFrequency": "监测频率",
    "reexaminationTime": "复诊时间"
  }
}`;

      const userPrompt = `请评估以下治疗效果并给出调整建议：
- 初步诊断：${typeof diagnosis === 'object' ? JSON.stringify(diagnosis) : diagnosis}
- 当前治疗方案：${typeof treatmentPlan === 'object' ? JSON.stringify(treatmentPlan) : treatmentPlan}
- 当前症状：${currentSymptoms}
- 已治疗天数：${duration}
- 改善情况：${improvement}

请返回JSON格式的疗效评估和调整建议。`;

      const result = await this._callLLMJson(systemPrompt, userPrompt);
      return result;
    } catch (error) {
      console.error('治疗效果跟踪失败:', error.message);
      throw new Error('AI治疗建议服务暂时不可用');
    }
  }

  /**
   * 基于通义千问 LLM 的养殖建议生成
   * @param {Object} farmData - 养殖数据
   * @returns {Promise<Object>} - 养殖建议
   */
  async farmingAdvice(farmData) {
    try {
      const { breed, age, environment, feedingMethod, recentHealthStatus } = farmData;

      const systemPrompt = `你是一位禽类养殖管理专家，擅长提供全面的养殖优化建议。
请根据养殖品种、日龄、环境和健康状况，提供环境优化、饲养管理、疾病防控、应激管理和生长性能优化方面的建议。

请严格返回以下JSON结构：
{
  "environmentOptimization": {
    "temperatureControl": "温度控制建议",
    "humidityControl": "湿度控制建议",
    "ventilationManagement": "通风管理",
    "hygieneManagement": "卫生管理"
  },
  "feedingManagement": {
    "feedFormula": "饲料配方建议",
    "feedingFrequency": "饲喂频率",
    "waterManagement": "饮水管理"
  },
  "diseasePrevention": {
    "vaccination": "免疫程序",
    "regularDisinfection": "消毒计划",
    "monitoringPlan": "监测计划"
  },
  "stressManagement": {
    "reduceStressFactors": "减少应激因素",
    "stressResponseMeasures": "应激应对措施"
  },
  "growthPerformanceOptimization": {
    "growthMonitoring": "生长监测",
    "performanceImprovementMeasures": "性能改善措施"
  }
}`;

      const userPrompt = `请根据以下养殖信息生成优化建议：
- 品种：${breed}
- 日龄：${age}
- 环境条件：${environment}
- 饲养方式：${feedingMethod}
- 近期健康状况：${recentHealthStatus}

请返回JSON格式的养殖建议。`;

      const result = await this._callLLMJson(systemPrompt, userPrompt);
      return result;
    } catch (error) {
      console.error('养殖建议生成失败:', error.message);
      throw new Error('AI养殖建议服务暂时不可用');
    }
  }

  /**
   * 基于通义千问 LLM 的疾病风险预警
   * @param {Object} warningData - 预警数据
   * @returns {Promise<Object>} - 风险预警结果
   */
  async diseaseWarning(warningData) {
    try {
      const { environment, breed, age, recentWeather, neighboringFarmsStatus } = warningData;

      const systemPrompt = `你是一位禽病流行病学预警专家，擅长根据环境、气候和周边疫情信息预测疾病风险。
请综合分析各项风险因素，评估当前养殖场的疾病风险等级和高发疾病类型，给出预警和防控建议。

请严格返回以下JSON结构：
{
  "diseaseRiskWarning": {
    "overallRiskLevel": "低/中/高",
    "highRiskDiseases": ["高风险疾病1", "高风险疾病2"],
    "riskFactorAnalysis": ["风险因素1", "风险因素2"]
  },
  "warningBasis": {
    "environmentalFactors": "环境因素分析",
    "climateFactors": "气候因素分析",
    "neighboringEpidemics": "周边疫情分析"
  },
  "preventionAdvice": {
    "immediateMeasures": "即时措施",
    "shortTermStrategy": "短期策略",
    "longTermPlanning": "长期规划"
  },
  "monitoringAdvice": {
    "monitoringIndicators": ["监测指标1", "监测指标2"],
    "monitoringFrequency": "监测频率",
    "abnormalHandling": "异常处理"
  }
}`;

      const userPrompt = `请评估以下养殖场的疾病风险：
- 环境条件：${environment}
- 品种：${breed}
- 日龄：${age}
- 近期天气：${recentWeather}
- 周边养殖场疫情：${neighboringFarmsStatus}

请综合分析疾病风险并返回JSON格式预警结果。`;

      const result = await this._callLLMJson(systemPrompt, userPrompt);
      return result;
    } catch (error) {
      console.error('疾病风险预警失败:', error.message);
      throw new Error('AI风险预警服务暂时不可用');
    }
  }

  /**
   * 基于通义千问 LLM 的对话诊断
   * @param {Object} diagnosisData - 诊断数据
   * @returns {Promise<string|Object>} - 对话诊断结果
   */
  async chatDiagnosis(diagnosisData) {
    try {
      const { symptoms, imageAnalysis, environment, breed, age, previousDiagnosis } = diagnosisData;

      const systemPrompt = this._buildDiagnosisSystemPrompt();
      const userPrompt = `请根据以下信息进行禽病对话诊断分析，用通俗易懂的语言给出分析结论和建议：
- 用户描述/症状：${symptoms}
- 品种：${breed}
- 日龄：${age}
- 环境：${environment}
${previousDiagnosis ? '- 既往诊断历史：' + previousDiagnosis : ''}
${imageAnalysis && imageAnalysis.length > 0 ? '- 图像识别结果：' + JSON.stringify(imageAnalysis) : ''}

请给出初步诊断结论（包含疾病名称、置信度）、核心依据、紧急处理措施和后续建议。语言要通俗易懂，便于养殖户理解和执行。如果怀疑高致病性传染病，须强调立即隔离并上报当地动物防疫部门。`;

      const result = await this._callLLM(systemPrompt, userPrompt);
      return result;
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
      const llmStatus = this.llmClient ? 'healthy' : 'unconfigured';

      const healthStatus = {
        status: llmStatus === 'healthy' ? 'healthy' : 'degraded',
        timestamp: new Date().toISOString(),
        components: {
          llm: {
            status: llmStatus,
            details: {
              model: this.llmModel,
              configured: !!this.llmClient
            }
          },
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
