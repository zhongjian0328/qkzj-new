const express = require('express');
const { authenticate } = require('../middleware/authMiddleware');

const router = express.Router();

/**
 * 商业服务相关路由
 */

// 获取服务列表（需要认证）
router.get('/services', authenticate, (req, res) => {
  res.status(200).json({ status: 'success', message: '获取服务列表' });
});

// 下单（需要认证）
router.post('/order', authenticate, (req, res) => {
  res.status(201).json({ status: 'success', message: '下单成功' });
});

// 获取订单列表（需要认证）
router.get('/orders', authenticate, (req, res) => {
  res.status(200).json({ status: 'success', message: '获取订单列表' });
});

// 获取订单详情（需要认证）
router.get('/orders/:orderId', authenticate, (req, res) => {
  res.status(200).json({ status: 'success', message: '获取订单详情' });
});

// 取消订单（需要认证）
router.post('/orders/:orderId/cancel', authenticate, (req, res) => {
  res.status(200).json({ status: 'success', message: '取消订单' });
});

// 确认收货（需要认证）
router.post('/orders/:orderId/confirm', authenticate, (req, res) => {
  res.status(200).json({ status: 'success', message: '确认收货' });
});

module.exports = router;
