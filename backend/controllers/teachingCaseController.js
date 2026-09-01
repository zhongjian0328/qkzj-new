const TeachingCase = require('../models/TeachingCase');

// 创建教学案例
exports.createCase = async (req, res, next) => {
  try {
    const { title, description, diseaseType, caseImages, keyFindings, treatmentProcess, outcome, lessonsLearned, tags, ticketId, diagnosisId, mentorId } = req.body;

    if (!title || !description) {
      return res.status(400).json({ status: 'error', message: '标题和描述为必填项' });
    }

    const teachingCase = await TeachingCase.create({
      title,
      description,
      diseaseType,
      caseImages: caseImages || [],
      keyFindings,
      treatmentProcess,
      outcome,
      lessonsLearned,
      tags: tags || [],
      ticketId,
      diagnosisId,
      authorId: req.user.id,
      mentorId
    });

    res.status(201).json({
      status: 'success',
      message: '教学案例创建成功',
      data: { teachingCase }
    });
  } catch (error) {
    next(error);
  }
};

// 我的案例
exports.getMyCases = async (req, res, next) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;

    const filter = { authorId: req.user.id };
    if (status) filter.status = status;

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const total = await TeachingCase.countDocuments(filter);
    const cases = await TeachingCase.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .populate('mentorId', 'nickname');

    res.status(200).json({
      status: 'success',
      data: {
        cases,
        pagination: {
          total,
          page: parseInt(page),
          limit: parseInt(limit),
          totalPages: Math.ceil(total / parseInt(limit))
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

// 案例详情
exports.getCaseById = async (req, res, next) => {
  try {
    const teachingCase = await TeachingCase.findById(req.params.id)
      .populate('authorId', 'nickname avatar')
      .populate('mentorId', 'nickname')
      .populate('ticketId', 'ticketNo title')
      .populate('diagnosisId', 'title');

    if (!teachingCase) {
      return res.status(404).json({ status: 'error', message: '案例不存在' });
    }

    // +1 views
    teachingCase.views = (teachingCase.views || 0) + 1;
    await teachingCase.save();

    res.status(200).json({
      status: 'success',
      data: { teachingCase }
    });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({ status: 'error', message: '无效的案例ID' });
    }
    next(error);
  }
};

// 公共案例列表（不鉴权）
exports.getAllCases = async (req, res, next) => {
  try {
    const { diseaseType, tag, status, page = 1, limit = 20 } = req.query;

    const filter = {};
    if (diseaseType) filter.diseaseType = diseaseType;
    if (tag) filter.tags = tag;
    if (status) filter.status = status;

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const total = await TeachingCase.countDocuments(filter);
    const cases = await TeachingCase.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .populate('authorId', 'nickname avatar');

    res.status(200).json({
      status: 'success',
      data: {
        cases,
        pagination: {
          total,
          page: parseInt(page),
          limit: parseInt(limit),
          totalPages: Math.ceil(total / parseInt(limit))
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

// 更新案例
exports.updateCase = async (req, res, next) => {
  try {
    const teachingCase = await TeachingCase.findById(req.params.id);

    if (!teachingCase) {
      return res.status(404).json({ status: 'error', message: '案例不存在' });
    }

    if (teachingCase.authorId.toString() !== req.user.id) {
      return res.status(403).json({ status: 'error', message: '只有作者可以修改案例' });
    }

    const allowedFields = [
      'title', 'description', 'diseaseType', 'caseImages', 'keyFindings',
      'treatmentProcess', 'outcome', 'lessonsLearned', 'tags', 'mentorId'
    ];
    const updateData = {};

    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        updateData[field] = req.body[field];
      }
    }

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({ status: 'error', message: '没有可更新的字段' });
    }

    const updatedCase = await TeachingCase.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    res.status(200).json({
      status: 'success',
      message: '教学案例更新成功',
      data: { teachingCase: updatedCase }
    });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({ status: 'error', message: '无效的案例ID' });
    }
    next(error);
  }
};

// 提交审核
exports.submitForReview = async (req, res, next) => {
  try {
    const teachingCase = await TeachingCase.findById(req.params.id);

    if (!teachingCase) {
      return res.status(404).json({ status: 'error', message: '案例不存在' });
    }

    if (teachingCase.authorId.toString() !== req.user.id) {
      return res.status(403).json({ status: 'error', message: '只有作者可以提交审核' });
    }

    if (teachingCase.status === 'approved') {
      return res.status(400).json({ status: 'error', message: '案例已通过审核' });
    }

    teachingCase.status = 'pending_review';
    await teachingCase.save();

    res.status(200).json({
      status: 'success',
      message: '案例已提交审核',
      data: { teachingCase }
    });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({ status: 'error', message: '无效的案例ID' });
    }
    next(error);
  }
};

// 导师审核
exports.reviewCase = async (req, res, next) => {
  try {
    const { approved, mentorComment } = req.body;

    if (approved === undefined) {
      return res.status(400).json({ status: 'error', message: '必须提供审核结果（approved）' });
    }

    const teachingCase = await TeachingCase.findById(req.params.id);

    if (!teachingCase) {
      return res.status(404).json({ status: 'error', message: '案例不存在' });
    }

    if (teachingCase.status !== 'pending_review') {
      return res.status(400).json({ status: 'error', message: '案例未处于待审核状态' });
    }

    teachingCase.status = approved ? 'approved' : 'rejected';
    teachingCase.mentorComment = mentorComment || '';
    await teachingCase.save();

    res.status(200).json({
      status: 'success',
      message: approved ? '案例审核通过' : '案例已驳回',
      data: { teachingCase }
    });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({ status: 'error', message: '无效的案例ID' });
    }
    next(error);
  }
};

// 删除案例
exports.deleteCase = async (req, res, next) => {
  try {
    const teachingCase = await TeachingCase.findOneAndDelete({
      _id: req.params.id,
      authorId: req.user.id
    });

    if (!teachingCase) {
      return res.status(404).json({ status: 'error', message: '案例不存在或无权删除' });
    }

    res.status(200).json({
      status: 'success',
      message: '教学案例删除成功'
    });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({ status: 'error', message: '无效的案例ID' });
    }
    next(error);
  }
};
