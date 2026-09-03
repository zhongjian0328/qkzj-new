const express = require('express');
const { authenticate, authorize } = require('../middleware/authMiddleware');
const { validateCreateOrder } = require('../middleware/validationMiddleware');
const businessController = require('../controllers/businessController');

const router = express.Router();

// 商品
router.get('/products', authenticate, businessController.getProducts);
router.get('/products/:productId', authenticate, businessController.getProductDetail);

// 订单（诊疗服务下单）
router.post('/orders', authenticate, validateCreateOrder, businessController.createOrder);
router.get('/orders', authenticate, businessController.getOrders);
router.get('/orders/:orderId', authenticate, businessController.getOrderDetail);
router.post('/orders/:orderId/cancel', authenticate, businessController.cancelOrder);
router.post('/orders/:orderId/confirm', authenticate, businessController.confirmOrder);

// 客户
router.get('/customers', authenticate, businessController.getCustomers);

// 广告
router.post('/ads', authenticate, authorize(['ADMIN', 'INSTITUTION']), businessController.createAd);
router.get('/ads', authenticate, businessController.getAds);

module.exports = router;
