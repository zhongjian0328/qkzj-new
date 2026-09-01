const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/authMiddleware');
const followUpController = require('../controllers/followUpController');

router.use(authenticate);

router.post('/schedule', followUpController.scheduleFollowUp);
router.get('/stats', followUpController.getFollowUpStats);
router.get('/', followUpController.getFollowUps);
router.get('/:id', followUpController.getFollowUpById);
router.post('/:id/complete', followUpController.completeFollowUp);
router.patch('/:id', followUpController.updateFollowUp);
router.patch('/:id/cancel', followUpController.cancelFollowUp);
router.delete('/:id', followUpController.deleteFollowUp);

module.exports = router;
