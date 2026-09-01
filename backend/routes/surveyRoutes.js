const express = require('express');
const { authenticate } = require('../middleware/authMiddleware');
const surveyController = require('../controllers/surveyController');

const router = express.Router();

/**
 * 流行病学调查路由
 */

// 创建流调记录（正式表）
router.post('/surveys', authenticate, surveyController.createSurvey);

// 保存流调草稿
router.post('/drafts', authenticate, surveyController.saveDraft);

// 查询流调记录列表
router.get('/surveys', authenticate, surveyController.getSurveys);

// 获取单条流调记录
router.get('/surveys/:id', authenticate, surveyController.getSurveyById);

// 更新流调记录
router.put('/surveys/:id', authenticate, surveyController.updateSurvey);

// 删除流调记录
router.delete('/surveys/:id', authenticate, surveyController.deleteSurvey);

// 区域流调统计
router.get('/regional-stats', authenticate, surveyController.getRegionalStats);

module.exports = router;
