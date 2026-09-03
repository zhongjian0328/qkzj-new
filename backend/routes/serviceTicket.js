const express = require('express');
const { authenticate } = require('../middleware/authMiddleware');
const { validateCreateTicket, validateAddMessage, validateRateTicket } = require('../middleware/validationMiddleware');
const ticketController = require('../controllers/serviceTicketController');

const router = express.Router();

// 创建工单（需要认证）
router.post('/', authenticate, validateCreateTicket, ticketController.createTicket);

// 我的工单（作为发起方，需要认证）
router.get('/my', authenticate, ticketController.getMyTickets);

// 我承接的工单（作为承接方，需要认证）
router.get('/assigned', authenticate, ticketController.getAssignedTickets);

// 工单详情（需要认证 + 所有权校验）
router.get('/:id', authenticate, ticketController.getTicketById);

// 承接工单（需要认证）
router.patch('/:id/accept', authenticate, ticketController.acceptTicket);

// 更新工单（需要认证）
router.put('/:id', authenticate, ticketController.updateTicket);

// 添加沟通消息（需要认证）
router.post('/:id/messages', authenticate, validateAddMessage, ticketController.addMessage);

// 完成工单（需要认证）
router.patch('/:id/complete', authenticate, ticketController.completeTicket);

// 评价工单（需要认证 + 发起方）
router.post('/:id/rate', authenticate, validateRateTicket, ticketController.rateTicket);

// 取消工单（需要认证 + 发起方）
router.patch('/:id/cancel', authenticate, ticketController.cancelTicket);

module.exports = router;
