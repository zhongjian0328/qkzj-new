const express = require('express');
const router = express.Router();
const { authenticate, authorize } = require('../middleware/authMiddleware');
const notificationController = require('../controllers/notificationController');

// 发送通知 — 需要 ADMIN 权限
router.post('/send', authenticate, authorize(['ADMIN']), notificationController.sendNotification);

// 以下路由需要用户认证
router.use(authenticate);

// 获取通知列表（分页）
router.get('/', notificationController.getUserNotifications);

// 获取未读数量
router.get('/unread-count', notificationController.getUnreadCount);

// 标记单条已读
router.patch('/:id/read', notificationController.markAsRead);

// 标记全部已读
router.patch('/read-all', notificationController.markAllAsRead);

// 删除通知
router.delete('/:id', notificationController.deleteNotification);

module.exports = router;
