const express = require('express');
const { authenticate, authorize } = require('../middleware/authMiddleware');
const epidemicController = require('../controllers/epidemicController');

const router = express.Router();

// 获取疫情热力图数据
router.get('/heatmap', authenticate, epidemicController.getHeatmap);

// 获取异常高发报警
router.get('/alerts', authenticate, epidemicController.getAlerts);

// 发布政策通知（管理员/机构）
router.post('/policies', authenticate, authorize(['ADMIN', 'INSTITUTION']), epidemicController.publishPolicy);

// 获取政策通知列表
router.get('/policies', authenticate, epidemicController.getPolicies);

module.exports = router;
