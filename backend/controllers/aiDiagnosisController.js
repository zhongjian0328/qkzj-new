const DiagnosisRecord = require('../models/DiagnosisRecord');
const aiService = require('../utils/aiService');

// 百度云图像识别API配置
const BAIDU_APP_ID = process.env.BAIDU_APP_ID || 'your-baidu-app-id';
const BAIDU_API_KEY = process.env.BAIDU_API_KEY || 'your-baidu-api-key';
const BAIDU_SECRET_KEY = process.env.BAIDU_SECRET_KEY || 'your-baidu-secret-key';

// DeepSeek API配置
const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY || 'your-deepseek-api-key';

// 模拟图像识别结果
const mockImageRecognition = (imageUrl) => {
  // 模拟识别出的病原信息
  return [
    { pathogenName: '禽流感病毒 (H9N2)', confidence: 0.95, coreEvidence: '呼吸道症状、肺部病变' },
    { pathogenName: '新城疫病毒', confidence: 0.78, coreEvidence: '神经症状、消化道病变' }
  ];
};

// 模拟DeepSeek分析结果
const mockDeepSeekAnalysis = (diagnosisData) => {
  // 模拟AI分析结果
  return {
    singleDiagnosis: [
      { pathogenName: '禽流感病毒 (H9N2)', confidence: 0.95, coreEvidence: '呼吸道症状、肺部病变' },
      { pathogenName: '新城疫病毒', confidence: 0.78, coreEvidence: '神经症状、消化道病变' }
    ],
    mixedInfectionRisk: {
      riskLevel: 'HIGH',
      infectionCombinations: [
        { pathogens: ['禽流感病毒 (H9N2)', '新城疫病毒'], probability: 0.82 }
      ]
    },
    coreThreat: '混合感染可能导致死亡率显著上升，建议立即采取应急防控措施',
    emergencyMeasures: {
      shortTerm: '立即隔离病禽，对健康禽群进行紧急疫苗接种，使用抗病毒药物和广谱抗生素控制继发感染',
      mediumTerm: '加强养殖场消毒，改善通风条件，提供营养支持',
      longTerm: '优化生物安全体系，定期进行疫苗免疫，建立疾病监测体系'
    },
    diagnosisPlan: {
      emergencyTests: ['实时荧光RT-PCR检测AIV和NDV', '病毒分离鉴定'],
      importantTests: ['血清学检测（HI试验）', '病理组织学检查'],
      inDepthTests: ['全基因组测序', '药敏试验']
    },
    finalDiagnosis: {
      conclusion: '确诊为禽流感病毒 (H9N2) 和新城疫病毒混合感染',
      recommendations: '按照应急防控方案进行处理，密切监测疫情发展'
    },
    emergencyPreventionPlan: {
      '0-24小时': ['隔离病禽', '紧急免疫', '消毒场地'],
      '1-7天': ['药物治疗', '监测疫情', '加强营养'],
      '7-14天': ['评估效果', '调整方案', '恢复生产']
    },
    biosecurityOptimizationPlan: {
      facilities: ['改善通风条件', '增加消毒通道'],
      management: ['建立严格的入场制度', '定期监测'],
      personnel: ['加强培训', '建立健康档案']
    }
  };
};

// 对话问诊
exports.chatDiagnosis = async (req, res, next) => {
  try {
    // 从请求对象中获取用户ID（由authMiddleware设置）
    const userId = req.user.id;
    
    const { message, imageUrls = [], history = [] } = req.body;
    
    // 调用AI服务进行图像分析
    const imageRecognitionResults = [];
    if (imageUrls.length > 0) {
      try {
        // 假设imageUrls是Base64编码的图像数组
        const imageBuffer = Buffer.from(imageUrls[0], 'base64');
        const imageAnalysis = await aiService.analyzeImage(imageBuffer);
        // 转换图像分析结果为诊断记录所需格式
        if (imageAnalysis.result && imageAnalysis.result.length > 0) {
          imageAnalysis.result.forEach(item => {
            imageRecognitionResults.push({
              pathogenName: item.name,
              confidence: item.score,
              coreEvidence: item.baike_info?.description || '图像特征匹配'
            });
          });
        }
      } catch (imageError) {
        console.error('图像分析失败:', imageError.message);
        // 图像分析失败不影响聊天诊断，继续执行
      }
    }
    
    // 准备诊断数据（从对话中提取关键信息）
    const diagnosisData = {
      symptoms: message, // 实际项目中可使用NLP技术从对话中提取症状
      imageAnalysis: imageRecognitionResults,
      environment: '未提供', // 实际项目中可使用NLP技术从对话中提取环境信息
      breed: '未提供', // 实际项目中可使用NLP技术从对话中提取品种信息
      age: '未提供', // 实际项目中可使用NLP技术从对话中提取年龄信息
      previousDiagnosis: history.map(h => h.message).join('\n') // 作为既往诊断历史
    };
    
    // 调用AI服务获取聊天回复（使用结构化提示词）
    const aiResponse = await aiService.chatDiagnosis(diagnosisData);
    
    // 保存聊天记录
    const newChatMessage = { sender: 'user', message, timestamp: new Date() };
    const newAiMessage = { sender: 'ai', message: aiResponse, timestamp: new Date() };
    const updatedHistory = [...history, newChatMessage, newAiMessage];
    
    // 保存诊断记录
    const diagnosisRecord = await DiagnosisRecord.create({
      userId,
      diagnosisMode: 'CHAT',
      chatHistory: updatedHistory,
      imageUrls,
      basicInfo: {
        // 从对话中提取基本信息（实际项目中可使用NLP技术）
      },
      clinicalSymptoms: {
        symptoms: [message] // 从对话中提取症状（实际项目中可使用NLP技术）
      },
      singleDiagnosis: imageRecognitionResults
    });
    
    res.status(200).json({
      status: 'success',
      message: '对话问诊完成',
      data: {
        diagnosisId: diagnosisRecord._id,
        response: aiResponse,
        history: updatedHistory,
        singleDiagnosis: imageRecognitionResults
      }
    });
  } catch (error) {
    next(error);
  }
};

// AI兽医模式诊断
exports.vetDiagnosis = async (req, res, next) => {
  try {
    // 从请求对象中获取用户ID（由authMiddleware设置）
    const userId = req.user.id;
    
    const { basicInfo, clinicalSymptoms, pathologicalChanges, rapidTestResults, samplingInfo, experimentalData, imageUrls, studentDiagnosisInput } = req.body;
    
    // 调用AI服务进行图像分析
    const imageRecognitionResults = [];
    if (imageUrls.length > 0) {
      try {
        // 假设imageUrls是Base64编码的图像数组
        const imageBuffer = Buffer.from(imageUrls[0], 'base64');
        const imageAnalysis = await aiService.analyzeImage(imageBuffer);
        // 转换图像分析结果为诊断记录所需格式
        if (imageAnalysis.result && imageAnalysis.result.length > 0) {
          imageAnalysis.result.forEach(item => {
            imageRecognitionResults.push({
              pathogenName: item.name,
              confidence: item.score,
              coreEvidence: item.baike_info?.description || '图像特征匹配'
            });
          });
        }
      } catch (imageError) {
        console.error('图像分析失败:', imageError.message);
        // 图像分析失败不影响兽医诊断，继续执行
      }
    }
    
    // 准备诊断数据
    const diagnosisData = {
      symptoms: clinicalSymptoms?.symptoms?.join(', ') || '无具体症状描述',
      imageAnalysis: imageRecognitionResults,
      environment: basicInfo?.environment || '未提供',
      breed: basicInfo?.breed || '未提供',
      age: basicInfo?.age || '未提供',
      previousDiagnosis: ''
    };
    
    // 调用AI服务获取诊断结果（使用结构化提示词）
    const aiDiagnosisResult = await aiService.chatDiagnosis(diagnosisData);
    
    // 解析AI诊断结果（支持阿里云NLP和DeepSeek API的不同响应格式）
    let aiDiagnosisText;
    let structuredResult = null;
    
    // 判断响应格式，处理不同AI服务的结果
    if (typeof aiDiagnosisResult === 'string') {
      // DeepSeek API返回字符串
      aiDiagnosisText = aiDiagnosisResult;
    } else {
      // 阿里云NLP或其他结构化API返回对象
      structuredResult = aiDiagnosisResult;
      aiDiagnosisText = structuredResult.conclusion || structuredResult.result || JSON.stringify(structuredResult);
    }
    
    // 解析AI诊断结果
    const aiAnalysisResults = {
      singleDiagnosis: structuredResult?.singleDiagnosis || imageRecognitionResults,
      mixedInfectionRisk: structuredResult?.mixedInfectionRisk || {
        riskLevel: 'MEDIUM',
        infectionCombinations: []
      },
      coreThreat: structuredResult?.coreThreat || aiDiagnosisText.substring(0, 100) + '...',
      emergencyMeasures: structuredResult?.emergencyMeasures || {
        shortTerm: '根据AI诊断结果采取相应措施',
        mediumTerm: '加强监测和管理',
        longTerm: '优化养殖环境'
      },
      diagnosisPlan: structuredResult?.diagnosisPlan || {
        emergencyTests: ['根据AI建议进行相关检测'],
        importantTests: ['血清学检测'],
        inDepthTests: ['病毒分离鉴定']
      },
      finalDiagnosis: {
        conclusion: aiDiagnosisText,
        recommendations: structuredResult?.recommendations || '遵循AI诊断建议进行治疗和预防'
      },
      emergencyPreventionPlan: structuredResult?.emergencyPreventionPlan || {
        '0-24小时': ['隔离病禽', '消毒场地'],
        '1-7天': ['药物治疗', '监测疫情'],
        '7-14天': ['评估效果', '调整方案']
      },
      biosecurityOptimizationPlan: structuredResult?.biosecurityOptimizationPlan || {
        facilities: ['改善通风', '增加消毒通道'],
        management: ['建立严格的入场制度', '定期监测'],
        personnel: ['加强培训', '建立健康档案']
      }
    };
    
    // 保存诊断记录
    const diagnosisRecord = await DiagnosisRecord.create({
      userId,
      diagnosisMode: 'VET',
      basicInfo,
      clinicalSymptoms,
      pathologicalChanges,
      rapidTestResults,
      samplingInfo,
      experimentalData,
      imageUrls,
      studentDiagnosisInput,
      ...aiAnalysisResults
    });
    
    res.status(200).json({
      status: 'success',
      message: 'AI兽医模式诊断完成',
      data: {
        diagnosisId: diagnosisRecord._id,
        ...aiAnalysisResults
      }
    });
  } catch (error) {
    next(error);
  }
};

// 混合感染风险评估
exports.mixedInfectionRiskAssessment = async (req, res, next) => {
  try {
    // 从请求对象中获取用户ID（由authMiddleware设置）
    const userId = req.user.id;
    
    const { symptoms, environment, breed, age, recentDiseases } = req.body;
    
    // 准备风险评估数据
    const riskData = {
      symptoms,
      environment,
      breed,
      age,
      recentDiseases
    };
    
    // 调用AI服务获取风险评估结果
    const riskAssessmentResult = await aiService.mixedInfectionRiskAssessment(riskData);
    
    res.status(200).json({
      status: 'success',
      message: '混合感染风险评估完成',
      data: {
        riskAssessment: riskAssessmentResult
      }
    });
  } catch (error) {
    next(error);
  }
};

// 紧急控制方案生成
exports.emergencyControlPlan = async (req, res, next) => {
  try {
    // 从请求对象中获取用户ID（由authMiddleware设置）
    const userId = req.user.id;
    
    const { disease, affectedCount, totalCount, environment, symptoms } = req.body;
    
    // 准备紧急情况数据
    const emergencyData = {
      disease,
      affectedCount,
      totalCount,
      environment,
      symptoms
    };
    
    // 调用AI服务获取紧急控制方案
    const emergencyPlan = await aiService.emergencyControlPlan(emergencyData);
    
    res.status(200).json({
      status: 'success',
      message: '紧急控制方案生成完成',
      data: {
        emergencyPlan
      }
    });
  } catch (error) {
    next(error);
  }
};

// 治疗效果跟踪与调整建议
exports.treatmentAdjustment = async (req, res, next) => {
  try {
    // 从请求对象中获取用户ID（由authMiddleware设置）
    const userId = req.user.id;
    
    const { diagnosis, treatmentPlan, currentSymptoms, duration, improvement } = req.body;
    
    // 准备治疗数据
    const treatmentData = {
      diagnosis,
      treatmentPlan,
      currentSymptoms,
      duration,
      improvement
    };
    
    // 调用AI服务获取调整建议
    const adjustmentSuggestions = await aiService.treatmentAdjustment(treatmentData);
    
    res.status(200).json({
      status: 'success',
      message: '治疗效果跟踪与调整建议生成完成',
      data: {
        adjustmentSuggestions
      }
    });
  } catch (error) {
    next(error);
  }
};

// 养殖建议生成
exports.farmingAdvice = async (req, res, next) => {
  try {
    // 从请求对象中获取用户ID（由authMiddleware设置）
    const userId = req.user.id;
    
    const { breed, age, environment, feedingMethod, recentHealthStatus } = req.body;
    
    // 准备养殖数据
    const farmData = {
      breed,
      age,
      environment,
      feedingMethod,
      recentHealthStatus
    };
    
    // 调用AI服务获取养殖建议
    const farmingAdvice = await aiService.farmingAdvice(farmData);
    
    res.status(200).json({
      status: 'success',
      message: '养殖建议生成完成',
      data: {
        farmingAdvice
      }
    });
  } catch (error) {
    next(error);
  }
};

// 疾病风险预警
exports.diseaseWarning = async (req, res, next) => {
  try {
    // 从请求对象中获取用户ID（由authMiddleware设置）
    const userId = req.user.id;
    
    const { environment, breed, age, recentWeather, neighboringFarmsStatus } = req.body;
    
    // 准备预警数据
    const warningData = {
      environment,
      breed,
      age,
      recentWeather,
      neighboringFarmsStatus
    };
    
    // 调用AI服务获取疾病风险预警
    const diseaseWarning = await aiService.diseaseWarning(warningData);
    
    res.status(200).json({
      status: 'success',
      message: '疾病风险预警生成完成',
      data: {
        diseaseWarning
      }
    });
  } catch (error) {
    next(error);
  }
};

// 获取初诊报告
exports.getPreDiagnosisReport = async (req, res, next) => {
  try {
    const { diagnosisId } = req.params;
    
    const diagnosisRecord = await DiagnosisRecord.findById(diagnosisId)
      .select('basicInfo clinicalSymptoms singleDiagnosis mixedInfectionRisk coreThreat emergencyMeasures diagnosisPlan createdAt');
    
    if (!diagnosisRecord) {
      return res.status(404).json({ status: 'error', message: '诊断记录不存在' });
    }
    
    res.status(200).json({
      status: 'success',
      data: {
        diagnosisRecord
      }
    });
  } catch (error) {
    next(error);
  }
};

// 获取确诊报告
exports.getFinalDiagnosisReport = async (req, res, next) => {
  try {
    const { diagnosisId } = req.params;
    
    const diagnosisRecord = await DiagnosisRecord.findById(diagnosisId)
      .select('basicInfo clinicalSymptoms pathologicalChanges rapidTestResults experimentalData finalDiagnosis emergencyPreventionPlan biosecurityOptimizationPlan createdAt');
    
    if (!diagnosisRecord) {
      return res.status(404).json({ status: 'error', message: '诊断记录不存在' });
    }
    
    res.status(200).json({
      status: 'success',
      data: {
        diagnosisRecord
      }
    });
  } catch (error) {
    next(error);
  }
};

// 审核诊断报告
exports.auditReport = async (req, res, next) => {
  try {
    // 从请求对象中获取用户ID（由authMiddleware设置）
    const auditorId = req.user.id;
    
    const { diagnosisId } = req.params;
    const { auditStatus, auditComments } = req.body;
    
    const diagnosisRecord = await DiagnosisRecord.findById(diagnosisId);
    if (!diagnosisRecord) {
      return res.status(404).json({ status: 'error', message: '诊断记录不存在' });
    }
    
    // 更新审核状态
    diagnosisRecord.auditStatus = auditStatus;
    diagnosisRecord.auditorId = auditorId;
    diagnosisRecord.auditComments = auditComments;
    await diagnosisRecord.save();
    
    res.status(200).json({
      status: 'success',
      message: '诊断报告审核完成',
      data: {
        diagnosisRecord
      }
    });
  } catch (error) {
    next(error);
  }
};

// 获取诊断历史
exports.getDiagnosisHistory = async (req, res, next) => {
  try {
    // 从请求对象中获取用户ID（由authMiddleware设置）
    const userId = req.user.id;
    
    const { page = 1, limit = 10, startDate, endDate } = req.query;
    
    // 构建查询条件
    const query = { userId };
    if (startDate && endDate) {
      query.diagnosisTime = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }
    
    // 查询诊断记录
    const diagnosisRecords = await DiagnosisRecord.find(query)
      .sort({ diagnosisTime: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .select('diagnosisTime diagnosisMode basicInfo.symptoms mixedInfectionRisk.riskLevel createdAt');
    
    // 获取总数
    const total = await DiagnosisRecord.countDocuments(query);
    
    res.status(200).json({
      status: 'success',
      data: {
        diagnosisRecords,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          totalPages: Math.ceil(total / limit)
        }
      }
    });
  } catch (error) {
    console.error('获取诊断历史失败:', error.message);
    res.status(500).json({
      status: 'error',
      message: '获取诊断历史失败',
      error: error.message
    });
  }
};

// AI服务健康检查
exports.healthCheck = async (req, res, next) => {
  try {
    const healthStatus = await aiService.healthCheck();
    
    res.status(200).json({
      status: healthStatus.status,
      data: healthStatus
    });
  } catch (error) {
    console.error('健康检查失败:', error.message);
    res.status(500).json({
      status: 'error',
      message: '健康检查失败',
      error: error.message
    });
  }
};

// 重置AI服务
exports.resetService = async (req, res, next) => {
  try {
    aiService.resetService();
    
    res.status(200).json({
      status: 'success',
      message: 'AI服务重置成功'
    });
  } catch (error) {
    console.error('重置服务失败:', error.message);
    res.status(500).json({
      status: 'error',
      message: '重置服务失败',
      error: error.message
    });
  }
};

// 获取诊断详情
exports.getDiagnosisDetail = async (req, res, next) => {
  try {
    const { diagnosisId } = req.params;
    
    const diagnosisRecord = await DiagnosisRecord.findById(diagnosisId)
      .populate('auditorId', 'nickname');
    
    if (!diagnosisRecord) {
      return res.status(404).json({ status: 'error', message: '诊断记录不存在' });
    }
    
    res.status(200).json({
      status: 'success',
      data: {
        diagnosisRecord
      }
    });
  } catch (error) {
    next(error);
  }
};

// 保存诊断记录
exports.saveDiagnosis = async (req, res, next) => {
  try {
    // 从请求对象中获取用户ID（由authMiddleware设置）
    const userId = req.user.id;
    
    const { diagnosisId } = req.params;
    
    const diagnosisRecord = await DiagnosisRecord.findById(diagnosisId);
    if (!diagnosisRecord) {
      return res.status(404).json({ status: 'error', message: '诊断记录不存在' });
    }
    
    // 检查是否是当前用户的诊断记录
    if (diagnosisRecord.userId.toString() !== userId) {
      return res.status(403).json({ status: 'error', message: '无权访问该诊断记录' });
    }
    
    // 标记为已保存（实际上诊断记录创建时就已经保存，这里可以添加额外的保存逻辑）
    diagnosisRecord.isSaved = true;
    await diagnosisRecord.save();
    
    res.status(200).json({
      status: 'success',
      message: '诊断记录保存成功',
      data: {
        diagnosisRecord
      }
    });
  } catch (error) {
    next(error);
  }
};