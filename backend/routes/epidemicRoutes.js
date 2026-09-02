const express = require('express');
const { authenticate, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

/**
 * 疫情监测相关路由
 * 路径对齐前端 epidemicApi（/epidemic/heatmap, /epidemic/alerts, /epidemic/policies）
 */

// 获取疫病信息列表
router.get('/disease-info', authenticate, (req, res) => {
  res.status(200).json({ status: 'success', message: '获取疫病信息列表' });
});

// 获取疫病详情
router.get('/disease-info/:diseaseId', authenticate, (req, res) => {
  res.status(200).json({ status: 'success', message: '获取疫病详情' });
});

// 报告疫情
router.post('/report-epidemic', authenticate, (req, res) => {
  res.status(201).json({ status: 'success', message: '报告疫情' });
});

// 获取疫情风险评估
router.get('/risk-assessment', authenticate, (req, res) => {
  res.status(200).json({ status: 'success', message: '获取疫情风险评估' });
});

// 获取疫情热力图数据
router.get('/heatmap', authenticate, (req, res) => {
  res.status(200).json({ status: 'success', message: '获取疫情热力图数据' });
});

// 获取异常高发报警
router.get('/alerts', authenticate, (req, res) => {
  res.status(200).json({ status: 'success', message: '获取异常高发报警' });
});

// 发布政策通知（管理员/机构）
router.post('/policies', authenticate, authorize(['ADMIN', 'INSTITUTION']), (req, res) => {
  res.status(201).json({ status: 'success', message: '发布政策通知' });
});

// 获取政策通知列表
router.get('/policies', authenticate, (req, res) => {
  res.status(200).json({ status: 'success', message: '获取政策通知列表' });
});

module.exports = router;
