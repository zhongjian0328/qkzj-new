const DiagnosisRecord = require('../models/DiagnosisRecord');
const Notification = require('../models/Notification');
const User = require('../models/User');
const { notifyUser } = require('../services/socketService');

// 获取疫情热力图数据（基于诊断记录地理位置聚合）
exports.getHeatmap = async (req, res, next) => {
  try {
    const { date, region, diseaseType } = req.query;

    const filter = {};
    if (date) {
      const dayStart = new Date(date);
      const dayEnd = new Date(date);
      dayEnd.setDate(dayEnd.getDate() + 1);
      filter.diagnosisTime = { $gte: dayStart, $lt: dayEnd };
    }
    if (diseaseType) {
      filter['singleDiagnosis.pathogenName'] = { $regex: diseaseType, $options: 'i' };
    }

    // 聚合：按地理位置分组统计
    const heatmapData = await DiagnosisRecord.aggregate([
      { $match: filter },
      {
        $group: {
          _id: '$location.coordinates',
          count: { $sum: 1 },
          diseases: { $addToSet: '$singleDiagnosis.pathogenName' },
          highRiskCount: {
            $sum: { $cond: [{ $eq: ['$mixedInfectionRisk.riskLevel', 'HIGH'] }, 1, 0] }
          }
        }
      },
      { $limit: 500 }
    ]);

    res.status(200).json({
      status: 'success',
      data: { heatmap: heatmapData.map(h => ({
        coordinates: h._id,
        count: h.count,
        diseases: h.diseases.flat().filter(Boolean),
        highRiskCount: h.highRiskCount,
        riskLevel: h.highRiskCount > 5 ? 'HIGH' : h.highRiskCount > 0 ? 'MEDIUM' : 'LOW'
      })) }
    });
  } catch (error) { next(error); }
};

// 获取异常高发报警（高风险诊断记录）
exports.getAlerts = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, status } = req.query;
    const filter = {
      'mixedInfectionRisk.riskLevel': { $in: ['HIGH', 'EXTREME'] }
    };
    if (status) filter.auditStatus = status;

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const total = await DiagnosisRecord.countDocuments(filter);
    const alerts = await DiagnosisRecord.find(filter)
      .select('diagnosisTime basicInfo singleDiagnosis mixedInfectionRisk auditStatus userId')
      .populate('userId', 'nickname phoneNumber')
      .sort({ diagnosisTime: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    res.status(200).json({
      status: 'success',
      data: { alerts, pagination: { total, page: parseInt(page), limit: parseInt(limit), totalPages: Math.ceil(total / parseInt(limit)) } }
    });
  } catch (error) { next(error); }
};

// 发布政策通知（向目标用户群体推送）
exports.publishPolicy = async (req, res, next) => {
  try {
    const { title, content, targetRegions, targetRoles } = req.body;
    if (!title || !content) {
      return res.status(400).json({ status: 'error', message: '标题和内容不能为空' });
    }

    // 查找目标用户
    const userFilter = {};
    if (targetRoles && targetRoles.length > 0) {
      userFilter.roleType = { $in: targetRoles };
    }
    const targetUsers = await User.find(userFilter).select('_id');

    // 为每个目标用户创建通知
    const notifications = targetUsers.map(u => ({
      userId: u._id,
      title: `[政策通知] ${title}`,
      message: content,
      type: 'system',
      data: { policyTitle: title, targetRegions, targetRoles, publishedBy: req.user.id }
    }));

    await Notification.insertMany(notifications);

    // Socket.IO 实时推送
    targetUsers.forEach(u => {
      notifyUser(u._id.toString(), 'notification', { title: `[政策通知] ${title}`, message: content, type: 'system' });
    });

    res.status(201).json({
      status: 'success',
      message: '政策通知已发布',
      data: { recipientCount: targetUsers.length }
    });
  } catch (error) { next(error); }
};

// 获取政策通知列表（当前用户收到的）
exports.getPolicies = async (req, res, next) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const filter = {
      userId: req.user.id,
      type: 'system',
      'data.policyTitle': { $exists: true }
    };

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const total = await Notification.countDocuments(filter);
    const policies = await Notification.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    res.status(200).json({
      status: 'success',
      data: { policies, pagination: { total, page: parseInt(page), limit: parseInt(limit), totalPages: Math.ceil(total / parseInt(limit)) } }
    });
  } catch (error) { next(error); }
};
