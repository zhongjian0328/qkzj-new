const express = require('express');
const { authenticate } = require('../middleware/authMiddleware');

const router = express.Router();

/**
 * 疫病防控相关路由
 */

// 获取疫病信息列表（需要认证）
router.get('/disease-info', authenticate, (req, res) => {
  res.status(200).json({ status: 'success', message: '获取疫病信息列表' });
});

// 获取疫病详情（需要认证）
router.get('/disease-info/:diseaseId', authenticate, (req, res) => {
  res.status(200).json({ status: 'success', message: '获取疫病详情' });
});

// 报告疫情（需要认证）
router.post('/report-epidemic', authenticate, (req, res) => {
  res.status(201).json({ status: 'success', message: '报告疫情' });
});

// 获取疫情风险评估（需要认证）
router.get('/risk-assessment', authenticate, (req, res) => {
  res.status(200).json({ status: 'success', message: '获取疫情风险评估' });
});

module.exports = router;
