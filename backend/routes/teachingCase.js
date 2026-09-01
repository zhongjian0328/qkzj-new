const express = require('express');
const { authenticate, authorize } = require('../middleware/authMiddleware');
const teachingCaseController = require('../controllers/teachingCaseController');

const router = express.Router();

// 公共案例列表（不鉴权）
router.get('/', teachingCaseController.getAllCases);

// 我的案例（需要认证）
router.get('/my', authenticate, teachingCaseController.getMyCases);

// 案例详情（不鉴权，+1 views）
router.get('/:id', teachingCaseController.getCaseById);

// 创建教学案例（需要认证）
router.post('/', authenticate, teachingCaseController.createCase);

// 更新教学案例（需要认证 + 作者本人）
router.put('/:id', authenticate, teachingCaseController.updateCase);

// 提交审核（需要认证 + 作者本人）
router.patch('/:id/submit-review', authenticate, teachingCaseController.submitForReview);

// 导师审核（需要认证 + TEACHER 角色）
router.patch('/:id/review', authenticate, authorize(['TEACHER']), teachingCaseController.reviewCase);

// 删除案例（需要认证 + 作者本人）
router.delete('/:id', authenticate, teachingCaseController.deleteCase);

module.exports = router;
