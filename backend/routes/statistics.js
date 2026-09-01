const express = require('express');
const { authenticate } = require('../middleware/authMiddleware');
const statisticsController = require('../controllers/statisticsController');

const router = express.Router();

/**
 * 数据统计与看板相关路由
 */

// 综合看板数据（需要认证）
router.get('/dashboard', authenticate, statisticsController.getUserDashboard);

// 诊断趋势（需要认证）
router.get('/diagnosis-trend', authenticate, statisticsController.getDiagnosisTrend);

// 疾病分布统计（需要认证）
router.get('/epidemic-distribution', authenticate, statisticsController.getEpidemicDistribution);

// 死淘趋势（需要认证）
router.get('/mortality-trend', authenticate, statisticsController.getMortalityTrend);

// 环境指标趋势（需要认证）
router.get('/environment-trend', authenticate, statisticsController.getEnvironmentTrend);

// 区域热力图数据（需要认证）
router.get('/regional-heatmap', authenticate, statisticsController.getRegionalHeatmap);

module.exports = router;
