const express = require('express');
const { authenticate } = require('../middleware/authMiddleware');
const environmentController = require('../controllers/environmentController');

const router = express.Router();

/**
 * 环境数据录入与分析相关路由
 */

// 创建环境数据记录（需要认证）
router.post('/records', authenticate, environmentController.createRecord);

// 获取环境数据记录列表（需要认证）
router.get('/records', authenticate, environmentController.getRecords);

// 获取单条环境数据记录详情（需要认证）
router.get('/records/:id', authenticate, environmentController.getRecordById);

// 更新环境数据记录（需要认证）
router.put('/records/:id', authenticate, environmentController.updateRecord);

// 删除环境数据记录（需要认证）
router.delete('/records/:id', authenticate, environmentController.deleteRecord);

// 获取环境数据统计（需要认证）
router.get('/statistics', authenticate, environmentController.getStatistics);

// 获取预警记录列表（需要认证）
router.get('/alerts', authenticate, environmentController.getAlerts);

module.exports = router;
