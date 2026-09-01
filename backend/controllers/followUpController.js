const mongoose = require('mongoose');
const FollowUp = require('../models/FollowUp');
const ControlPlan = require('../models/ControlPlan');
const aiService = require('../utils/aiService');

// POST /api/follow-ups/schedule - 调度回访任务
exports.scheduleFollowUp = async (req, res) => {
  try {
    const { planId, followUpType, scheduledDate, batchId, questions } = req.body;

    if (!planId || !followUpType) {
      return res.status(400).json({ message: '预案ID和回访类型不能为空' });
    }

    // 验证预案所有权
    const plan = await ControlPlan.findOne({ _id: planId, userId: req.user._id });
    if (!plan) {
      return res.status(404).json({ message: '预案不存在或无权访问' });
    }

    const followUp = new FollowUp({
      userId: req.user._id,
      planId,
      batchId,
      followUpType,
      scheduledDate: scheduledDate || new Date(),
      questions
    });

    await followUp.save();
    res.status(201).json({ data: followUp });
  } catch (error) {
    console.error('调度回访失败:', error);
    res.status(500).json({ message: '调度回访失败', error: error.message });
  }
};

// GET /api/follow-ups - 获取回访列表
exports.getFollowUps = async (req, res) => {
  try {
    const { page = 1, limit = 20, status, planId } = req.query;
    const query = { userId: req.user._id };
    if (status) query.status = status;
    if (planId) query.planId = planId;

    const followUps = await FollowUp.find(query)
      .sort({ scheduledDate: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .populate('planId', 'planName diseaseName severity status')
      .lean();

    const total = await FollowUp.countDocuments(query);
    res.json({ data: followUps, total, page: Number(page), limit: Number(limit) });
  } catch (error) {
    res.status(500).json({ message: '获取回访列表失败', error: error.message });
  }
};

// GET /api/follow-ups/stats - 获取回访统计
exports.getFollowUpStats = async (req, res) => {
  try {
    const userId = req.user._id;
    const [pending, completed, overdue, total] = await Promise.all([
      FollowUp.countDocuments({ userId, status: 'pending' }),
      FollowUp.countDocuments({ userId, status: 'completed' }),
      FollowUp.countDocuments({ userId, status: 'overdue' }),
      FollowUp.countDocuments({ userId })
    ]);

    res.json({
      data: { pending, completed, overdue, total }
    });
  } catch (error) {
    res.status(500).json({ message: '获取回访统计失败', error: error.message });
  }
};

// GET /api/follow-ups/:id - 获取回访详情
exports.getFollowUpById = async (req, res) => {
  try {
    const followUp = await FollowUp.findOne({ _id: req.params.id, userId: req.user._id })
      .populate('planId', 'planName diseaseName severity status planContent')
      .lean();
    if (!followUp) {
      return res.status(404).json({ message: '回访记录不存在' });
    }
    res.json({ data: followUp });
  } catch (error) {
    res.status(500).json({ message: '获取回访详情失败', error: error.message });
  }
};

// POST /api/follow-ups/:id/complete - 完成回访并提交AI评估
exports.completeFollowUp = async (req, res) => {
  try {
    const followUp = await FollowUp.findOne({ _id: req.params.id, userId: req.user._id });
    if (!followUp) {
      return res.status(404).json({ message: '回访记录不存在' });
    }

    const { questions, notes, completedBy } = req.body;
    if (!questions) {
      return res.status(400).json({ message: '回访问卷不能为空' });
    }

    // 更新回访数据
    followUp.questions = questions;
    followUp.notes = notes;
    followUp.completedBy = completedBy || 'user';
    followUp.completedDate = new Date();
    followUp.status = 'completed';

    // 调用AI评估回访效果
    const assessment = await aiService.treatmentAdjustment({
      diagnosis: followUp.planId ? '防控预案执行' : '治疗方案',
      treatmentPlan: '按防控预案执行',
      currentSymptoms: JSON.stringify(questions),
      duration: '回访评估',
      improvement: questions.overallAssessment || questions.symptomImprovement || ''
    });

    followUp.aiAssessment = {
      effectiveness: assessment?.treatmentEffect?.overallEffect || '待评估',
      recommendation: assessment?.adjustmentSuggestions?.drugAdjustment || '',
      needAdjustment: assessment?.treatmentEffect?.treatmentPlanReasonableness === '需要调整',
      nextFollowUpDate: assessment?.followUpMonitoring?.reexaminationTime ? new Date(assessment.followUpMonitoring.reexaminationTime) : undefined
    };

    // 如果需要调整，自动创建下次回访
    if (followUp.aiAssessment.needAdjustment) {
      const nextFollowUp = new FollowUp({
        userId: req.user._id,
        planId: followUp.planId,
        batchId: followUp.batchId,
        followUpType: 'custom',
        scheduledDate: followUp.aiAssessment.nextFollowUpDate || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        status: 'pending'
      });
      await nextFollowUp.save();
    }

    await followUp.save();
    res.json({ data: followUp });
  } catch (error) {
    console.error('完成回访失败:', error);
    res.status(500).json({ message: '完成回访失败', error: error.message });
  }
};

// PATCH /api/follow-ups/:id - 编辑回访
exports.updateFollowUp = async (req, res) => {
  try {
    const followUp = await FollowUp.findOne({ _id: req.params.id, userId: req.user._id });
    if (!followUp) {
      return res.status(404).json({ message: '回访记录不存在' });
    }

    const allowedFields = ['notes', 'scheduledDate'];
    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        followUp[field] = req.body[field];
      }
    }

    await followUp.save();
    res.json({ data: followUp });
  } catch (error) {
    res.status(500).json({ message: '更新回访失败', error: error.message });
  }
};

// PATCH /api/follow-ups/:id/cancel - 取消回访
exports.cancelFollowUp = async (req, res) => {
  try {
    const followUp = await FollowUp.findOne({ _id: req.params.id, userId: req.user._id });
    if (!followUp) {
      return res.status(404).json({ message: '回访记录不存在' });
    }

    followUp.status = 'cancelled';
    await followUp.save();
    res.json({ data: followUp });
  } catch (error) {
    res.status(500).json({ message: '取消回访失败', error: error.message });
  }
};

// DELETE /api/follow-ups/:id - 删除回访
exports.deleteFollowUp = async (req, res) => {
  try {
    const result = await FollowUp.deleteOne({ _id: req.params.id, userId: req.user._id });
    if (result.deletedCount === 0) {
      return res.status(404).json({ message: '回访记录不存在' });
    }
    res.json({ message: '回访记录已删除' });
  } catch (error) {
    res.status(500).json({ message: '删除回访失败', error: error.message });
  }
};
