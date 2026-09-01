const EpidemiologicalSurvey = require('../models/EpidemiologicalSurvey');

/**
 * 自动计算发病率和死亡率
 * @param {Object} data - 流调数据对象（会原地修改）
 */
function calculateRates(data) {
  if (data.flockSize > 0) {
    if (data.affectedCount != null) {
      data.morbidityRate = parseFloat((data.affectedCount / data.flockSize * 100).toFixed(2));
    }
    if (data.deadCount != null) {
      data.mortalityRate = parseFloat((data.deadCount / data.flockSize * 100).toFixed(2));
    }
  }
  return data;
}

// 创建流调记录（正式表）
exports.createSurvey = async (req, res, next) => {
  try {
    const data = req.body || {};
    calculateRates(data);

    const survey = await EpidemiologicalSurvey.create({
      ...data,
      userId: req.user.id,
      isDraft: false
    });

    res.status(201).json({
      status: 'success',
      message: '流调记录创建成功',
      data: { survey }
    });
  } catch (error) {
    next(error);
  }
};

// 保存流调草稿
exports.saveDraft = async (req, res, next) => {
  try {
    const data = req.body || {};
    calculateRates(data);

    const survey = await EpidemiologicalSurvey.create({
      ...data,
      userId: req.user.id,
      isDraft: true,
      draftSavedAt: new Date()
    });

    res.status(201).json({
      status: 'success',
      message: '草稿保存成功',
      data: { survey }
    });
  } catch (error) {
    next(error);
  }
};

// 查询当前用户的流调记录（支持筛选和分页）
exports.getSurveys = async (req, res, next) => {
  try {
    const { isDraft, startDate, endDate, farmName, suspectedDisease, page = 1, limit = 20 } = req.query;

    const filter = { userId: req.user.id };

    if (isDraft !== undefined) {
      filter.isDraft = isDraft === 'true';
    }
    if (startDate || endDate) {
      filter.surveyDate = {};
      if (startDate) filter.surveyDate.$gte = new Date(startDate);
      if (endDate) filter.surveyDate.$lte = new Date(endDate);
    }
    if (farmName) {
      filter.farmName = { $regex: farmName, $options: 'i' };
    }
    if (suspectedDisease) {
      filter.suspectedDiseases = suspectedDisease;
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const total = await EpidemiologicalSurvey.countDocuments(filter);
    const surveys = await EpidemiologicalSurvey.find(filter)
      .sort({ surveyDate: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    res.status(200).json({
      status: 'success',
      data: {
        surveys,
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

// 获取单条流调记录
exports.getSurveyById = async (req, res, next) => {
  try {
    const survey = await EpidemiologicalSurvey.findById(req.params.id);

    if (!survey) {
      return res.status(404).json({ status: 'error', message: '流调记录不存在' });
    }

    if (survey.userId.toString() !== req.user.id.toString()) {
      return res.status(403).json({ status: 'error', message: '无权访问该记录' });
    }

    res.status(200).json({
      status: 'success',
      data: { survey }
    });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({ status: 'error', message: '无效的ID格式' });
    }
    next(error);
  }
};

// 更新流调记录
exports.updateSurvey = async (req, res, next) => {
  try {
    const survey = await EpidemiologicalSurvey.findById(req.params.id);

    if (!survey) {
      return res.status(404).json({ status: 'error', message: '流调记录不存在' });
    }

    if (survey.userId.toString() !== req.user.id.toString()) {
      return res.status(403).json({ status: 'error', message: '无权修改该记录' });
    }

    const data = req.body || {};
    calculateRates(data);

    // 如果提交正式表，设置 isDraft: false
    if (data.submitFinal !== undefined && data.submitFinal) {
      data.isDraft = false;
    }

    const updatedSurvey = await EpidemiologicalSurvey.findByIdAndUpdate(
      req.params.id,
      data,
      { new: true, runValidators: true }
    );

    res.status(200).json({
      status: 'success',
      message: '流调记录更新成功',
      data: { survey: updatedSurvey }
    });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({ status: 'error', message: '无效的ID格式' });
    }
    next(error);
  }
};

// 删除流调记录
exports.deleteSurvey = async (req, res, next) => {
  try {
    const survey = await EpidemiologicalSurvey.findById(req.params.id);

    if (!survey) {
      return res.status(404).json({ status: 'error', message: '流调记录不存在' });
    }

    if (survey.userId.toString() !== req.user.id.toString()) {
      return res.status(403).json({ status: 'error', message: '无权删除该记录' });
    }

    await EpidemiologicalSurvey.findByIdAndDelete(req.params.id);

    res.status(200).json({
      status: 'success',
      message: '流调记录删除成功'
    });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({ status: 'error', message: '无效的ID格式' });
    }
    next(error);
  }
};

// 区域流调统计
exports.getRegionalStats = async (req, res, next) => {
  try {
    const stats = await EpidemiologicalSurvey.aggregate([
      {
        $match: {
          isDraft: false,
          'location.province': { $exists: true, $ne: '' }
        }
      },
      {
        $group: {
          _id: {
            province: '$location.province',
            city: '$location.city'
          },
          surveyCount: { $sum: 1 },
          avgMorbidityRate: { $avg: '$morbidityRate' },
          avgMortalityRate: { $avg: '$mortalityRate' }
        }
      },
      {
        $project: {
          _id: 0,
          province: '$_id.province',
          city: '$_id.city',
          surveyCount: 1,
          avgMorbidityRate: { $ifNull: [{ $round: ['$avgMorbidityRate', 2] }, 0] },
          avgMortalityRate: { $ifNull: [{ $round: ['$avgMortalityRate', 2] }, 0] }
        }
      },
      { $sort: { surveyCount: -1 } }
    ]);

    res.status(200).json({
      status: 'success',
      data: { stats }
    });
  } catch (error) {
    next(error);
  }
};
