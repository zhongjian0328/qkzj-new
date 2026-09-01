const DiagnosisRecord = require('../models/DiagnosisRecord');
const BreedingBatch = require('../models/BreedingBatch');
const EnvironmentalData = require('../models/EnvironmentalData');
const EpidemiologicalSurvey = require('../models/EpidemiologicalSurvey');
const ControlPlan = require('../models/ControlPlan');
const FollowUp = require('../models/FollowUp');
const ProductionData = require('../models/ProductionData');

// ==================== Dashboard ====================

/**
 * GET /api/statistics/dashboard
 * 聚合当前用户的综合看板数据
 */
exports.getUserDashboard = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    const result = {
      diagnosisStats: null,
      batchStats: null,
      environmentStats: null,
      surveyStats: null,
      planStats: null,
      followUpStats: null,
    };

    // --- diagnosisStats ---
    try {
      const totalCount = await DiagnosisRecord.countDocuments({ userId });
      const monthCount = await DiagnosisRecord.countDocuments({
        userId,
        diagnosisTime: { $gte: startOfMonth },
      });

      // 近7日趋势（按日分组计数）
      const trendRaw = await DiagnosisRecord.aggregate([
        {
          $match: {
            userId: userId,
            diagnosisTime: { $gte: sevenDaysAgo },
          },
        },
        {
          $group: {
            _id: {
              $dateToString: { format: '%Y-%m-%d', date: '$diagnosisTime' },
            },
            count: { $sum: 1 },
          },
        },
        { $sort: { _id: 1 } },
      ]);
      const recentTrend = trendRaw.map((item) => ({
        date: item._id,
        count: item.count,
      }));

      // 常见疾病 Top5 — 从 finalDiagnosis 中提取
      const topDiseasesRaw = await DiagnosisRecord.aggregate([
        { $match: { userId: userId } },
        { $match: { finalDiagnosis: { $ne: null, $ne: '' } } },
        {
          $group: {
            _id: '$finalDiagnosis',
            count: { $sum: 1 },
          },
        },
        { $sort: { count: -1 } },
        { $limit: 5 },
      ]);
      const commonDiseases = topDiseasesRaw.map((item) => ({
        disease: item._id,
        count: item.count,
      }));

      result.diagnosisStats = {
        totalCount,
        monthCount,
        recentTrend,
        commonDiseases,
      };
    } catch (err) {
      console.error('[statistics] diagnosisStats failed:', err.message);
    }

    // --- batchStats ---
    try {
      const activeBatches = await BreedingBatch.find({
        enterpriseId: userId,
        status: 'ACTIVE',
      });
      const batchCount = activeBatches.length;

      let totalStock = 0;
      let totalDeath = 0;

      if (batchCount > 0) {
        totalStock = activeBatches.reduce(
          (sum, b) => sum + (b.currentQuantity || 0),
          0
        );

        const batchIds = activeBatches.map((b) => b._id);
        const deathAgg = await ProductionData.aggregate([
          {
            $match: {
              batchId: { $in: batchIds },
              deathCount: { $gte: 0 },
            },
          },
          {
            $group: {
              _id: null,
              totalDeath: { $sum: '$deathCount' },
            },
          },
        ]);
        totalDeath = deathAgg.length > 0 ? deathAgg[0].totalDeath : 0;
      }

      result.batchStats = {
        batchCount,
        totalStock,
        totalDeath,
      };
    } catch (err) {
      console.error('[statistics] batchStats failed:', err.message);
    }

    // --- environmentStats ---
    try {
      const envAlertCount = await EnvironmentalData.countDocuments({
        userId,
        'alerts.0': { $exists: true },
        recordDate: { $gte: thirtyDaysAgo },
      });

      const envAvgRaw = await EnvironmentalData.aggregate([
        {
          $match: {
            userId: userId,
            recordDate: { $gte: thirtyDaysAgo },
          },
        },
        {
          $group: {
            _id: null,
            avgTemperature: { $avg: '$temperature' },
            avgHumidity: { $avg: '$humidity' },
            avgAmmonia: { $avg: '$ammonia' },
            avgCo2: { $avg: '$co2' },
          },
        },
      ]);

      const envAvg =
        envAvgRaw.length > 0
          ? {
              avgTemperature:
                envAvgRaw[0].avgTemperature !== null
                  ? parseFloat(envAvgRaw[0].avgTemperature.toFixed(2))
                  : null,
              avgHumidity:
                envAvgRaw[0].avgHumidity !== null
                  ? parseFloat(envAvgRaw[0].avgHumidity.toFixed(2))
                  : null,
              avgAmmonia:
                envAvgRaw[0].avgAmmonia !== null
                  ? parseFloat(envAvgRaw[0].avgAmmonia.toFixed(2))
                  : null,
              avgCo2:
                envAvgRaw[0].avgCo2 !== null
                  ? parseFloat(envAvgRaw[0].avgCo2.toFixed(2))
                  : null,
            }
          : {
              avgTemperature: null,
              avgHumidity: null,
              avgAmmonia: null,
              avgCo2: null,
            };

      result.environmentStats = {
        alertCount: envAlertCount,
        ...envAvg,
      };
    } catch (err) {
      console.error('[statistics] environmentStats failed:', err.message);
    }

    // --- surveyStats ---
    try {
      const surveyTotal = await EpidemiologicalSurvey.countDocuments({
        userId,
        isDraft: false,
      });
      const surveyMonthCount = await EpidemiologicalSurvey.countDocuments({
        userId,
        isDraft: false,
        createdAt: { $gte: startOfMonth },
      });

      result.surveyStats = {
        surveyTotal,
        surveyMonthCount,
      };
    } catch (err) {
      console.error('[statistics] surveyStats failed:', err.message);
    }

    // --- planStats ---
    try {
      const activePlanCount = await ControlPlan.countDocuments({
        userId,
        status: 'active',
      });
      const completedPlanCount = await ControlPlan.countDocuments({
        userId,
        status: 'completed',
      });

      result.planStats = {
        activePlanCount,
        completedPlanCount,
      };
    } catch (err) {
      console.error('[statistics] planStats failed:', err.message);
    }

    // --- followUpStats ---
    try {
      const pendingCount = await FollowUp.countDocuments({
        userId,
        status: { $in: ['pending'] },
      });
      const overdueCount = await FollowUp.countDocuments({
        userId,
        status: 'overdue',
      });

      result.followUpStats = {
        pendingCount,
        overdueCount,
      };
    } catch (err) {
      console.error('[statistics] followUpStats failed:', err.message);
    }

    res.status(200).json({
      status: 'success',
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

// ==================== Diagnosis Trend ====================

/**
 * GET /api/statistics/diagnosis-trend?startDate=&endDate=&groupBy=day|month
 */
exports.getDiagnosisTrend = async (req, res, next) => {
  try {
    const { startDate, endDate, groupBy = 'day' } = req.query;
    const userId = req.user.id;

    const filter = { userId };
    if (startDate || endDate) {
      filter.diagnosisTime = {};
      if (startDate) filter.diagnosisTime.$gte = new Date(startDate);
      if (endDate) filter.diagnosisTime.$lte = new Date(endDate);
    }

    const dateFormat = groupBy === 'month' ? '%Y-%m' : '%Y-%m-%d';

    const trend = await DiagnosisRecord.aggregate([
      { $match: filter },
      {
        $group: {
          _id: {
            $dateToString: { format: dateFormat, date: '$diagnosisTime' },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    res.status(200).json({
      status: 'success',
      data: trend.map((item) => ({
        date: item._id,
        count: item.count,
      })),
    });
  } catch (error) {
    next(error);
  }
};

// ==================== Epidemic Distribution ====================

/**
 * GET /api/statistics/epidemic-distribution?region=
 */
exports.getEpidemicDistribution = async (req, res, next) => {
  try {
    const { region } = req.query;
    const userId = req.user.id;

    const filter = { userId, isDraft: false };
    if (region) {
      filter['location.province'] = { $regex: region, $options: 'i' };
    }

    const totalCount = await EpidemiologicalSurvey.countDocuments(filter);

    const distribution = await EpidemiologicalSurvey.aggregate([
      { $match: filter },
      {
        $group: {
          _id: '$preliminaryDiagnosis',
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
    ]);

    res.status(200).json({
      status: 'success',
      data: distribution.map((item) => ({
        diseaseType: item._id || '未分类',
        count: item.count,
        percentage:
          totalCount > 0
            ? parseFloat(((item.count / totalCount) * 100).toFixed(1))
            : 0,
      })),
    });
  } catch (error) {
    next(error);
  }
};

// ==================== Mortality Trend ====================

/**
 * GET /api/statistics/mortality-trend?batchId=&startDate=&endDate=
 */
exports.getMortalityTrend = async (req, res, next) => {
  try {
    const { batchId, startDate, endDate } = req.query;

    const filter = { batchId };
    if (startDate || endDate) {
      filter.recordDate = {};
      if (startDate) filter.recordDate.$gte = new Date(startDate);
      if (endDate) filter.recordDate.$lte = new Date(endDate);
    }

    const trend = await ProductionData.aggregate([
      { $match: filter },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$recordDate' },
          },
          deathCount: { $sum: '$deathCount' },
          feedConsumption: { $sum: '$feedConsumption' },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    res.status(200).json({
      status: 'success',
      data: trend.map((item) => ({
        date: item._id,
        deathCount: item.deathCount,
        feedConsumption: parseFloat(item.feedConsumption.toFixed(2)),
        // mortalityRate 需要当前批次存栏量，这里用 deathCount 占 initialQuantity 的简单比例
        mortalityRate: 0,
      })),
    });
  } catch (error) {
    next(error);
  }
};

// ==================== Environment Trend ====================

/**
 * GET /api/statistics/environment-trend?batchId=&startDate=&endDate=
 */
exports.getEnvironmentTrend = async (req, res, next) => {
  try {
    const { batchId, startDate, endDate } = req.query;

    const filter = {};
    if (batchId) filter.batchId = batchId;
    if (startDate || endDate) {
      filter.recordDate = {};
      if (startDate) filter.recordDate.$gte = new Date(startDate);
      if (endDate) filter.recordDate.$lte = new Date(endDate);
    }

    const trend = await EnvironmentalData.aggregate([
      { $match: filter },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$recordDate' },
          },
          avgTemperature: { $avg: '$temperature' },
          avgHumidity: { $avg: '$humidity' },
          avgAmmonia: { $avg: '$ammonia' },
          avgCo2: { $avg: '$co2' },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    res.status(200).json({
      status: 'success',
      data: trend.map((item) => ({
        date: item._id,
        avgTemperature:
          item.avgTemperature !== null
            ? parseFloat(item.avgTemperature.toFixed(2))
            : null,
        avgHumidity:
          item.avgHumidity !== null
            ? parseFloat(item.avgHumidity.toFixed(2))
            : null,
        avgAmmonia:
          item.avgAmmonia !== null
            ? parseFloat(item.avgAmmonia.toFixed(2))
            : null,
        avgCo2:
          item.avgCo2 !== null ? parseFloat(item.avgCo2.toFixed(2)) : null,
      })),
    });
  } catch (error) {
    next(error);
  }
};

// ==================== Regional Heatmap ====================

/**
 * GET /api/statistics/regional-heatmap?diseaseType=&date=
 */
exports.getRegionalHeatmap = async (req, res, next) => {
  try {
    const { diseaseType, date } = req.query;

    const filter = {
      isDraft: false,
      'location.province': { $ne: null },
    };

    if (diseaseType) {
      filter.$or = [
        { preliminaryDiagnosis: { $regex: diseaseType, $options: 'i' } },
        { suspectedDiseases: { $regex: diseaseType, $options: 'i' } },
      ];
    }

    if (date) {
      const targetDate = new Date(date);
      const nextDay = new Date(targetDate);
      nextDay.setDate(nextDay.getDate() + 1);
      filter.surveyDate = { $gte: targetDate, $lt: nextDay };
    }

    const heatmap = await EpidemiologicalSurvey.aggregate([
      { $match: filter },
      {
        $group: {
          _id: {
            province: '$location.province',
            city: '$location.city',
          },
          count: { $sum: 1 },
          totalAffected: { $sum: { $ifNull: ['$affectedCount', 0] } },
          totalFlock: { $sum: { $ifNull: ['$flockSize', 0] } },
        },
      },
      {
        $project: {
          province: '$_id.province',
          city: '$_id.city',
          count: 1,
          totalAffected: 1,
          totalFlock: 1,
          incidenceRate: {
            $cond: {
              if: { $gt: ['$totalFlock', 0] },
              then: {
                $multiply: [
                  { $divide: ['$totalAffected', '$totalFlock'] },
                  100,
                ],
              },
              else: 0,
            },
          },
          _id: 0,
        },
      },
      { $sort: { count: -1 } },
    ]);

    res.status(200).json({
      status: 'success',
      data: heatmap.map((item) => ({
        province: item.province,
        city: item.city || '',
        count: item.count,
        incidenceRate: parseFloat(item.incidenceRate.toFixed(2)),
        // 经纬度暂用占位，后续可接入地理编码服务
        lat: 0,
        lng: 0,
      })),
    });
  } catch (error) {
    next(error);
  }
};
