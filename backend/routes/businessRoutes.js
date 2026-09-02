const express = require('express');
const { authenticate, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

/**
 * 商业服务相关路由
 * 路径对齐前端 businessApi（/business/products, /business/orders, /business/customers, /business/ads）
 */

// 获取兽药商城商品列表
router.get('/products', authenticate, (req, res) => {
  res.status(200).json({ status: 'success', message: '获取商品列表' });
});

// 获取商品详情
router.get('/products/:productId', authenticate, (req, res) => {
  res.status(200).json({ status: 'success', message: '获取商品详情' });
});

// 创建订单
router.post('/orders', authenticate, (req, res) => {
  res.status(201).json({ status: 'success', message: '创建订单' });
});

// 获取订单列表
router.get('/orders', authenticate, (req, res) => {
  res.status(200).json({ status: 'success', message: '获取订单列表' });
});

// 获取订单详情
router.get('/orders/:orderId', authenticate, (req, res) => {
  res.status(200).json({ status: 'success', message: '获取订单详情' });
});

// 取消订单
router.post('/orders/:orderId/cancel', authenticate, (req, res) => {
  res.status(200).json({ status: 'success', message: '取消订单' });
});

// 确认收货
router.post('/orders/:orderId/confirm', authenticate, (req, res) => {
  res.status(200).json({ status: 'success', message: '确认收货' });
});

// 获取客户列表
router.get('/customers', authenticate, (req, res) => {
  res.status(200).json({ status: 'success', message: '获取客户列表' });
});

// 创建广告（管理员/机构）
router.post('/ads', authenticate, authorize(['ADMIN', 'INSTITUTION']), (req, res) => {
  res.status(201).json({ status: 'success', message: '创建广告' });
});

// 获取广告列表
router.get('/ads', authenticate, (req, res) => {
  res.status(200).json({ status: 'success', message: '获取广告列表' });
});

module.exports = router;
