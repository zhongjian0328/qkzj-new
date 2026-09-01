const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/authMiddleware');
const controlPlanController = require('../controllers/controlPlanController');

router.use(authenticate);

router.post('/generate', controlPlanController.generatePlan);
router.get('/', controlPlanController.getPlans);
router.get('/:id', controlPlanController.getPlanById);
router.patch('/:id', controlPlanController.updatePlan);
router.patch('/:id/complete', controlPlanController.completePlan);
router.patch('/:id/archive', controlPlanController.archivePlan);
router.delete('/:id', controlPlanController.deletePlan);

module.exports = router;
