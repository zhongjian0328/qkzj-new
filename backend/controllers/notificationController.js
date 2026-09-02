const Notification = require('../models/Notification');
const { notifyUser } = require('../services/socketService');

/**
 * 发送通知 — 创建通知记录并通过 Socket.IO 实时推送
 * POST /api/notifications/send
 */
exports.sendNotification = async (req, res) => {
  try {
    const { userId, title, message, type, data } = req.body;

    if (!userId || !title || !message || !type) {
      return res.status(400).json({ message: '缺少必要参数' });
    }

    const notification = new Notification({ userId, title, message, type, data });
    await notification.save();

    // Socket.IO 实时推送
    notifyUser(userId, 'notification', {
      _id: notification._id,
      title,
      message,
      type,
      data,
      createdAt: notification.createdAt,
    });

    res.status(201).json({ data: notification });
  } catch (error) {
    console.error('发送通知失败:', error);
    res.status(500).json({ message: '发送通知失败', error: error.message });
  }
};

/**
 * 获取用户通知列表（分页）
 * GET /api/notifications?page=&limit=&isRead=
 */
exports.getUserNotifications = async (req, res) => {
  try {
    const { page = 1, limit = 20, isRead } = req.query;
    const query = { userId: req.user._id };
    if (isRead !== undefined) {
      query.isRead = isRead === 'true';
    }

    const notifications = await Notification.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .lean();

    const total = await Notification.countDocuments(query);

    res.json({
      data: notifications,
      total,
      page: Number(page),
      limit: Number(limit),
    });
  } catch (error) {
    res.status(500).json({ message: '获取通知列表失败', error: error.message });
  }
};

/**
 * 标记单条通知为已读
 * PATCH /api/notifications/:id/read
 */
exports.markAsRead = async (req, res) => {
  try {
    const notification = await Notification.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!notification) {
      return res.status(404).json({ message: '通知不存在' });
    }

    notification.isRead = true;
    notification.readAt = new Date();
    await notification.save();

    res.json({ data: notification });
  } catch (error) {
    res.status(500).json({ message: '标记已读失败', error: error.message });
  }
};

/**
 * 标记全部通知为已读
 * PATCH /api/notifications/read-all
 */
exports.markAllAsRead = async (req, res) => {
  try {
    const result = await Notification.updateMany(
      { userId: req.user._id, isRead: false },
      { isRead: true, readAt: new Date() }
    );

    res.json({ message: '全部标记为已读', updatedCount: result.modifiedCount });
  } catch (error) {
    res.status(500).json({ message: '全部标记已读失败', error: error.message });
  }
};

/**
 * 获取未读通知数量
 * GET /api/notifications/unread-count
 */
exports.getUnreadCount = async (req, res) => {
  try {
    const count = await Notification.countDocuments({
      userId: req.user._id,
      isRead: false,
    });

    res.json({ data: { unreadCount: count } });
  } catch (error) {
    res.status(500).json({ message: '获取未读数量失败', error: error.message });
  }
};

/**
 * 删除通知
 * DELETE /api/notifications/:id
 */
exports.deleteNotification = async (req, res) => {
  try {
    const result = await Notification.deleteOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: '通知不存在' });
    }

    res.json({ message: '通知已删除' });
  } catch (error) {
    res.status(500).json({ message: '删除通知失败', error: error.message });
  }
};
