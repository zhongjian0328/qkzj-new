const express = require('express');
const { authenticate } = require('../middleware/authMiddleware');

const router = express.Router();

/**
 * 实习管理相关路由
 * 路径对齐前端 internshipApi（/internship/logs, /internship/logs/:id/comment, /internship/students）
 */

// 获取实习日志列表
router.get('/logs', authenticate, (req, res) => {
  res.status(200).json({ status: 'success', message: '获取实习日志列表' });
});

// 创建实习日志
router.post('/logs', authenticate, (req, res) => {
  res.status(201).json({ status: 'success', message: '创建实习日志' });
});

// 获取实习日志详情
router.get('/logs/:logId', authenticate, (req, res) => {
  res.status(200).json({ status: 'success', message: '获取实习日志详情' });
});

// 导师批注实习日志
router.post('/logs/:logId/comment', authenticate, (req, res) => {
  res.status(201).json({ status: 'success', message: '导师批注实习日志' });
});

// 获取学生列表
router.get('/students', authenticate, (req, res) => {
  res.status(200).json({ status: 'success', message: '获取学生列表' });
});

module.exports = router;
