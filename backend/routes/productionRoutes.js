const express = require('express');
const { authenticate } = require('../middleware/authMiddleware');

const router = express.Router();

/**
 * 生产管理相关路由
 * 路径对齐前端 productionApi（/production/batches, /production/death-feed-records, /production/employees）
 */

// 获取批次列表
router.get('/batches', authenticate, (req, res) => {
  res.status(200).json({ status: 'success', message: '获取批次列表' });
});

// 创建批次
router.post('/batches', authenticate, (req, res) => {
  res.status(201).json({ status: 'success', message: '创建批次' });
});

// 获取批次详情
router.get('/batches/:batchId', authenticate, (req, res) => {
  res.status(200).json({ status: 'success', message: '获取批次详情' });
});

// 更新批次
router.put('/batches/:batchId', authenticate, (req, res) => {
  res.status(200).json({ status: 'success', message: '更新批次' });
});

// 删除批次
router.delete('/batches/:batchId', authenticate, (req, res) => {
  res.status(200).json({ status: 'success', message: '删除批次' });
});

// 获取死淘/耗料记录列表
router.get('/death-feed-records', authenticate, (req, res) => {
  res.status(200).json({ status: 'success', message: '获取死淘耗料记录列表' });
});

// 创建死淘/耗料记录
router.post('/death-feed-records', authenticate, (req, res) => {
  res.status(201).json({ status: 'success', message: '创建死淘耗料记录' });
});

// 获取员工列表
router.get('/employees', authenticate, (req, res) => {
  res.status(200).json({ status: 'success', message: '获取员工列表' });
});

// 创建员工
router.post('/employees', authenticate, (req, res) => {
  res.status(201).json({ status: 'success', message: '创建员工' });
});

// 更新员工权限
router.put('/employees/:employeeId/permission', authenticate, (req, res) => {
  res.status(200).json({ status: 'success', message: '更新员工权限' });
});

module.exports = router;
