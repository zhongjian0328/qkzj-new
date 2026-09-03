const express = require('express');
const { authenticate } = require('../middleware/authMiddleware');
const { validateCreateBatch, validateUpdateBatch, validateCreateDeathFeedRecord, validateCreateEmployee } = require('../middleware/validationMiddleware');
const productionController = require('../controllers/productionController');

const router = express.Router();

// 批次管理
router.get('/batches', authenticate, productionController.getBatches);
router.post('/batches', authenticate, validateCreateBatch, productionController.createBatch);
router.get('/batches/:batchId', authenticate, productionController.getBatchById);
router.put('/batches/:batchId', authenticate, validateUpdateBatch, productionController.updateBatch);
router.delete('/batches/:batchId', authenticate, productionController.deleteBatch);

// 死淘/耗料记录
router.get('/death-feed-records', authenticate, productionController.getDeathFeedRecords);
router.post('/death-feed-records', authenticate, validateCreateDeathFeedRecord, productionController.createDeathFeedRecord);

// 生产数据导出（CSV）
router.get('/export', authenticate, productionController.exportProductionData);

// 员工权限管理
router.get('/employees', authenticate, productionController.getEmployees);
router.post('/employees', authenticate, validateCreateEmployee, productionController.createEmployee);
router.put('/employees/:employeeId/permission', authenticate, productionController.updateEmployeePermission);

module.exports = router;
