const express = require('express');
const { authenticate, authorize } = require('../middleware/authMiddleware');
const researchController = require('../controllers/researchController');

const router = express.Router();

// 病例
router.get('/cases', authenticate, researchController.getCases);
router.get('/cases/:caseId', authenticate, researchController.getCaseDetail);
router.post('/cases/:caseId/annotate', authenticate, researchController.annotateCase);

// 图片下载
router.get('/images/download', authenticate, researchController.downloadCaseImage);

// 科研群组
router.get('/groups', authenticate, researchController.getResearchGroups);
router.post('/groups', authenticate, authorize(['RESEARCHER', 'ADMIN', 'INSTITUTION']), researchController.createResearchGroup);
router.get('/groups/:groupId', authenticate, researchController.getResearchGroupDetail);

// 数据上传
router.post('/data/upload', authenticate, authorize(['RESEARCHER', 'ADMIN', 'INSTITUTION']), researchController.uploadResearchData);

module.exports = router;
