const express = require('express');
const { authenticate } = require('../middleware/authMiddleware');
const internshipController = require('../controllers/internshipController');

const router = express.Router();

// 实习日志
router.get('/logs', authenticate, internshipController.getLogs);
router.post('/logs', authenticate, internshipController.createLog);
router.get('/logs/:logId', authenticate, internshipController.getLogById);
router.post('/logs/:logId/comment', authenticate, internshipController.commentLog);

// 学生列表
router.get('/students', authenticate, internshipController.getStudents);

module.exports = router;
