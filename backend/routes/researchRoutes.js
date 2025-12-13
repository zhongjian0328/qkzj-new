const express = require('express');
const { authenticate, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

/**
 * 科研管理相关路由
 */

// 获取数据集列表（需要认证）
router.get('/datasets', authenticate, (req, res) => {
  res.status(200).json({ status: 'success', message: '获取数据集列表' });
});

// 创建数据集（仅允许科研人员和管理员）
router.post('/datasets', authenticate, authorize(['RESEARCHER', 'ADMIN']), (req, res) => {
  res.status(201).json({ status: 'success', message: '创建数据集' });
});

// 获取数据集详情（需要认证）
router.get('/datasets/:datasetId', authenticate, (req, res) => {
  res.status(200).json({ status: 'success', message: '获取数据集详情' });
});

// 更新数据集（仅允许科研人员和管理员）
router.put('/datasets/:datasetId', authenticate, authorize(['RESEARCHER', 'ADMIN']), (req, res) => {
  res.status(200).json({ status: 'success', message: '更新数据集' });
});

// 删除数据集（仅允许科研人员和管理员）
router.delete('/datasets/:datasetId', authenticate, authorize(['RESEARCHER', 'ADMIN']), (req, res) => {
  res.status(200).json({ status: 'success', message: '删除数据集' });
});

// 上传数据（仅允许科研人员和管理员）
router.post('/upload', authenticate, authorize(['RESEARCHER', 'ADMIN']), (req, res) => {
  res.status(201).json({ status: 'success', message: '上传数据' });
});

module.exports = router;
