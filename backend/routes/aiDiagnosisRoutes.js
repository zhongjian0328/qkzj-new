const express = require('express');
const { authenticate, authorize } = require('../middleware/authMiddleware');
const aiDiagnosisController = require('../controllers/aiDiagnosisController');

const router = express.Router();

/**
 * AI诊断相关路由
 */

// 聊天诊断（需要认证）
router.post('/chat-diagnosis', authenticate, aiDiagnosisController.chatDiagnosis);

// 兽医模式诊断（需要认证）
router.post('/veterinary-diagnosis', authenticate, aiDiagnosisController.vetDiagnosis);

// 获取初诊报告（需要认证）
router.get('/pre-report/:diagnosisId', authenticate, aiDiagnosisController.getPreDiagnosisReport);

// 获取确诊报告（需要认证）
router.get('/final-report/:diagnosisId', authenticate, aiDiagnosisController.getFinalDiagnosisReport);

// 获取诊断历史记录（需要认证）
router.get('/history', authenticate, aiDiagnosisController.getDiagnosisHistory);

// 获取诊断详情（需要认证）
router.get('/detail/:diagnosisId', authenticate, aiDiagnosisController.getDiagnosisDetail);

// 审核诊断报告（仅允许兽医和管理员）
router.post('/audit-report/:diagnosisId', authenticate, authorize(['VETERINARIAN', 'ADMIN']), aiDiagnosisController.auditReport);

// 保存诊断记录（需要认证）
router.post('/save/:diagnosisId', authenticate, aiDiagnosisController.saveDiagnosis);

// 混合感染风险评估（需要认证）
router.post('/risk-assessment', authenticate, aiDiagnosisController.mixedInfectionRiskAssessment);

// 紧急控制方案生成（需要认证）
router.post('/emergency-plan', authenticate, aiDiagnosisController.emergencyControlPlan);

// 治疗效果跟踪与调整建议（需要认证）
router.post('/treatment-adjustment', authenticate, aiDiagnosisController.treatmentAdjustment);

// 养殖建议生成（需要认证）
router.post('/farming-advice', authenticate, aiDiagnosisController.farmingAdvice);

// 疾病风险预警（需要认证）
router.post('/disease-warning', authenticate, aiDiagnosisController.diseaseWarning);

// AI服务健康检查（无需认证，用于监控）
router.get('/health', aiDiagnosisController.healthCheck);

// 重置AI服务（无需认证，用于管理）
router.post('/reset', aiDiagnosisController.resetService);

module.exports = router;
