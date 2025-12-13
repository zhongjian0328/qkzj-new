const express = require('express');
const { authenticate } = require('../middleware/authMiddleware');

const router = express.Router();

/**
 * 知识图谱相关路由
 */

// 获取知识图谱列表（需要认证）
router.get('/graph', authenticate, (req, res) => {
  res.status(200).json({ status: 'success', message: '获取知识图谱列表' });
});

// 获取知识图谱详情（需要认证）
router.get('/graph/:graphId', authenticate, (req, res) => {
  res.status(200).json({ status: 'success', message: '获取知识图谱详情' });
});

// 搜索知识点（需要认证）
router.get('/search', authenticate, (req, res) => {
  res.status(200).json({ status: 'success', message: '搜索知识点' });
});

// 获取题库列表（需要认证）
router.get('/question-bank', authenticate, (req, res) => {
  res.status(200).json({ status: 'success', message: '获取题库列表' });
});

// 获取题目详情（需要认证）
router.get('/question-bank/:questionId', authenticate, (req, res) => {
  res.status(200).json({ status: 'success', message: '获取题目详情' });
});

// 提交答题结果（需要认证）
router.post('/submit-answers', authenticate, (req, res) => {
  res.status(201).json({ status: 'success', message: '提交答题结果' });
});

module.exports = router;
