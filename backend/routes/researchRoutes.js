const express = require('express');
const { authenticate, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

/**
 * 数据标注与科研协作相关路由
 * 路径对齐前端 researchApi（/research/cases, /research/groups, /research/images, /research/data）
 */

// 获取病例列表
router.get('/cases', authenticate, (req, res) => {
  res.status(200).json({ status: 'success', message: '获取病例列表' });
});

// 获取病例详情
router.get('/cases/:caseId', authenticate, (req, res) => {
  res.status(200).json({ status: 'success', message: '获取病例详情' });
});

// 标注病例
router.post('/cases/:caseId/annotate', authenticate, (req, res) => {
  res.status(201).json({ status: 'success', message: '标注病例' });
});

// 下载病例图片
router.get('/images/download', authenticate, (req, res) => {
  res.status(200).json({ status: 'success', message: '下载病例图片' });
});

// 获取科研群组列表
router.get('/groups', authenticate, (req, res) => {
  res.status(200).json({ status: 'success', message: '获取科研群组列表' });
});

// 创建科研群组
router.post('/groups', authenticate, authorize(['RESEARCHER', 'ADMIN']), (req, res) => {
  res.status(201).json({ status: 'success', message: '创建科研群组' });
});

// 获取科研群组详情
router.get('/groups/:groupId', authenticate, (req, res) => {
  res.status(200).json({ status: 'success', message: '获取科研群组详情' });
});

// 上传科研数据
router.post('/data/upload', authenticate, authorize(['RESEARCHER', 'ADMIN']), (req, res) => {
  res.status(201).json({ status: 'success', message: '上传科研数据' });
});

module.exports = router;
