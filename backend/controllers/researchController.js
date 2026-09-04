const DiagnosisRecord = require('../models/DiagnosisRecord');
const User = require('../models/User');

// 获取病例列表（复用诊断记录）
exports.getCases = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, diseaseType, isSpecialCase } = req.query;
    const filter = {};
    if (isSpecialCase === 'true') filter['mixedInfectionRisk.riskLevel'] = 'HIGH';

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const total = await DiagnosisRecord.countDocuments(filter);
    const cases = await DiagnosisRecord.find(filter)
      .select('basicInfo clinicalSymptoms singleDiagnosis mixedInfectionRisk createdAt')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .populate('userId', 'nickname');

    res.status(200).json({
      status: 'success',
      data: { cases, pagination: { total, page: parseInt(page), limit: parseInt(limit), totalPages: Math.ceil(total / parseInt(limit)) } }
    });
  } catch (error) { next(error); }
};

// 获取病例详情
exports.getCaseDetail = async (req, res, next) => {
  try {
    const case_ = await DiagnosisRecord.findById(req.params.caseId)
      .populate('userId', 'nickname');
    if (!case_) return res.status(404).json({ status: 'error', message: '病例不存在' });
    res.status(200).json({ status: 'success', data: { case: case_ } });
  } catch (error) { next(error); }
};

// 标注病例
exports.annotateCase = async (req, res, next) => {
  try {
    const { annotations, isSpecialCase, comments } = req.body;
    const case_ = await DiagnosisRecord.findById(req.params.caseId);
    if (!case_) return res.status(404).json({ status: 'error', message: '病例不存在' });

    // 将标注信息追加到诊断记录
    if (!case_.annotations) case_.annotations = [];
    case_.annotations.push({ userId: req.user.id, annotations, comments, createdAt: new Date() });
    if (isSpecialCase) case_.isSpecialCase = true;
    await case_.save();

    res.status(200).json({ status: 'success', data: { case: case_ } });
  } catch (error) { next(error); }
};

// 下载病例图片
exports.downloadCaseImage = async (req, res, next) => {
  try {
    const { url } = req.query;
    if (!url) return res.status(400).json({ status: 'error', message: '图片URL不能为空' });
    // 简化实现：返回 URL，前端直接访问
    res.status(200).json({ status: 'success', data: { downloadUrl: url } });
  } catch (error) { next(error); }
};

// 获取科研群组列表
exports.getResearchGroups = async (req, res, next) => {
  try {
    res.status(200).json({ status: 'success', data: { groups: [], total: 0 } });
  } catch (error) { next(error); }
};

// 创建科研群组
exports.createResearchGroup = async (req, res, next) => {
  try {
    res.status(201).json({ status: 'success', message: '科研群组创建（功能开发中）' });
  } catch (error) { next(error); }
};

// 获取科研群组详情
exports.getResearchGroupDetail = async (req, res, next) => {
  try {
    res.status(200).json({ status: 'success', message: '科研群组详情（功能开发中）' });
  } catch (error) { next(error); }
};

// 上传科研数据
exports.uploadResearchData = async (req, res, next) => {
  try {
    res.status(201).json({ status: 'success', message: '科研数据上传（功能开发中）' });
  } catch (error) { next(error); }
};
