const mongoose = require('mongoose');
const ControlPlan = require('../models/ControlPlan');
const aiService = require('../utils/aiService');

// POST /api/control-plans/generate - AI生成防控预案
exports.generatePlan = async (req, res) => {
  try {
    const { diseaseName, severity, batchId, triggerDiagnosisId, planName } = req.body;
    if (!diseaseName) {
      return res.status(400).json({ message: '疾病名称不能为空' });
    }

    // 调用AI生成预案
    const planContent = await aiService.emergencyControlPlan({
      disease: diseaseName,
      affectedCount: req.body.affectedCount || 0,
      totalCount: req.body.totalCount || 0,
      environment: req.body.environment || '',
      symptoms: req.body.symptoms || ''
    });

    const plan = new ControlPlan({
      userId: req.user._id,
      batchId,
      triggerDiagnosisId,
      planName: planName || `${diseaseName}防控预案`,
      planType: req.body.planType || 'emergency',
      diseaseName,
      severity: severity || 'medium',
      planContent,
      generatedBy: 'ai'
    });

    await plan.save();
    res.status(201).json({ data: plan });
  } catch (error) {
    console.error('生成防控预案失败:', error);
    res.status(500).json({ message: '生成防控预案失败', error: error.message });
  }
};

// GET /api/control-plans - 获取预案列表
exports.getPlans = async (req, res) => {
  try {
    const { page = 1, limit = 20, status, batchId } = req.query;
    const query = { userId: req.user._id };
    if (status) query.status = status;
    if (batchId) query.batchId = batchId;

    const plans = await ControlPlan.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .populate('batchId', 'batchName species')
      .lean();

    const total = await ControlPlan.countDocuments(query);
    res.json({ data: plans, total, page: Number(page), limit: Number(limit) });
  } catch (error) {
    res.status(500).json({ message: '获取预案列表失败', error: error.message });
  }
};

// GET /api/control-plans/:id - 获取预案详情
exports.getPlanById = async (req, res) => {
  try {
    const plan = await ControlPlan.findOne({ _id: req.params.id, userId: req.user._id })
      .populate('batchId', 'batchName species')
      .lean();
    if (!plan) {
      return res.status(404).json({ message: '预案不存在' });
    }
    res.json({ data: plan });
  } catch (error) {
    res.status(500).json({ message: '获取预案详情失败', error: error.message });
  }
};

// PATCH /api/control-plans/:id - 更新预案
exports.updatePlan = async (req, res) => {
  try {
    const plan = await ControlPlan.findOne({ _id: req.params.id, userId: req.user._id });
    if (!plan) {
      return res.status(404).json({ message: '预案不存在' });
    }

    const allowedFields = ['planName', 'planContent', 'completionNotes'];
    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        plan[field] = req.body[field];
      }
    }

    await plan.save();
    res.json({ data: plan });
  } catch (error) {
    res.status(500).json({ message: '更新预案失败', error: error.message });
  }
};

// PATCH /api/control-plans/:id/complete - 完成预案
exports.completePlan = async (req, res) => {
  try {
    const plan = await ControlPlan.findOne({ _id: req.params.id, userId: req.user._id });
    if (!plan) {
      return res.status(404).json({ message: '预案不存在' });
    }

    plan.status = 'completed';
    plan.completedAt = new Date();
    plan.completionNotes = req.body.completionNotes || plan.completionNotes;
    await plan.save();

    res.json({ data: plan });
  } catch (error) {
    res.status(500).json({ message: '完成预案失败', error: error.message });
  }
};

// PATCH /api/control-plans/:id/archive - 归档预案
exports.archivePlan = async (req, res) => {
  try {
    const plan = await ControlPlan.findOne({ _id: req.params.id, userId: req.user._id });
    if (!plan) {
      return res.status(404).json({ message: '预案不存在' });
    }

    plan.status = 'archived';
    await plan.save();
    res.json({ data: plan });
  } catch (error) {
    res.status(500).json({ message: '归档预案失败', error: error.message });
  }
};

// DELETE /api/control-plans/:id - 删除预案
exports.deletePlan = async (req, res) => {
  try {
    const result = await ControlPlan.deleteOne({ _id: req.params.id, userId: req.user._id });
    if (result.deletedCount === 0) {
      return res.status(404).json({ message: '预案不存在' });
    }
    res.json({ message: '预案已删除' });
  } catch (error) {
    res.status(500).json({ message: '删除预案失败', error: error.message });
  }
};
