const Product = require('../models/Product');
const Order = require('../models/Order');
const User = require('../models/User');

// 获取商品列表
exports.getProducts = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, category, searchTerm } = req.query;
    const filter = { status: 'active' };
    if (category) filter.category = category;
    if (searchTerm) filter.name = { $regex: searchTerm, $options: 'i' };

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const total = await Product.countDocuments(filter);
    const products = await Product.find(filter).sort({ createdAt: -1 }).skip(skip).limit(parseInt(limit));

    res.status(200).json({
      status: 'success',
      data: { products, pagination: { total, page: parseInt(page), limit: parseInt(limit), totalPages: Math.ceil(total / parseInt(limit)) } }
    });
  } catch (error) { next(error); }
};

// 获取商品详情
exports.getProductDetail = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.productId);
    if (!product) return res.status(404).json({ status: 'error', message: '商品不存在' });
    res.status(200).json({ status: 'success', data: { product } });
  } catch (error) { next(error); }
};

// 创建订单（诊疗服务下单）
exports.createOrder = async (req, res, next) => {
  try {
    const { productType, productId, serviceProviderId, quantity, diagnosisRecordId, serviceDescription } = req.body;
    if (!productType) return res.status(400).json({ status: 'error', message: '产品类型不能为空' });

    // 获取商品价格
    let totalPrice = 0;
    if (productId) {
      const product = await Product.findById(productId);
      if (product) totalPrice = product.price * (quantity || 1);
    }

    const order = await Order.create({
      userId: req.user.id,
      productType,
      productId,
      serviceProviderId,
      quantity: quantity || 1,
      totalPrice,
      diagnosisRecordId,
      serviceDescription,
      orderStatus: 'PENDING'
    });
    res.status(201).json({ status: 'success', data: { order } });
  } catch (error) { next(error); }
};

// 获取订单列表
exports.getOrders = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, status, orderType } = req.query;
    const filter = { userId: req.user.id };
    if (status) filter.orderStatus = status.toUpperCase();
    if (orderType) filter.productType = orderType;

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const total = await Order.countDocuments(filter);
    const orders = await Order.find(filter).sort({ orderDate: -1 }).skip(skip).limit(parseInt(limit));

    res.status(200).json({
      status: 'success',
      data: { orders, pagination: { total, page: parseInt(page), limit: parseInt(limit), totalPages: Math.ceil(total / parseInt(limit)) } }
    });
  } catch (error) { next(error); }
};

// 获取订单详情
exports.getOrderDetail = async (req, res, next) => {
  try {
    const order = await Order.findOne({ _id: req.params.orderId, userId: req.user.id });
    if (!order) return res.status(404).json({ status: 'error', message: '订单不存在' });
    res.status(200).json({ status: 'success', data: { order } });
  } catch (error) { next(error); }
};

// 取消订单
exports.cancelOrder = async (req, res, next) => {
  try {
    const order = await Order.findOne({ _id: req.params.orderId, userId: req.user.id });
    if (!order) return res.status(404).json({ status: 'error', message: '订单不存在' });
    if (order.orderStatus !== 'PENDING') return res.status(400).json({ status: 'error', message: '只能取消待处理订单' });

    order.orderStatus = 'CANCELLED';
    await order.save();
    res.status(200).json({ status: 'success', data: { order } });
  } catch (error) { next(error); }
};

// 确认收货
exports.confirmOrder = async (req, res, next) => {
  try {
    const order = await Order.findOne({ _id: req.params.orderId, userId: req.user.id });
    if (!order) return res.status(404).json({ status: 'error', message: '订单不存在' });
    if (order.orderStatus !== 'PROCESSING') return res.status(400).json({ status: 'error', message: '订单状态不允许确认收货' });

    order.orderStatus = 'COMPLETED';
    order.completionDate = new Date();
    await order.save();
    res.status(200).json({ status: 'success', data: { order } });
  } catch (error) { next(error); }
};

// 获取客户列表
exports.getCustomers = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, searchTerm } = req.query;
    // 查找向当前用户下过单的客户
    const orderFilter = { serviceProviderId: req.user.id };
    const orders = await Order.find(orderFilter).distinct('userId');

    const filter = { _id: { $in: orders } };
    if (searchTerm) filter.phoneNumber = { $regex: searchTerm, $options: 'i' };

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const total = await User.countDocuments(filter);
    const customers = await User.find(filter).select('-password').skip(skip).limit(parseInt(limit));

    res.status(200).json({
      status: 'success',
      data: { customers, pagination: { total, page: parseInt(page), limit: parseInt(limit), totalPages: Math.ceil(total / parseInt(limit)) } }
    });
  } catch (error) { next(error); }
};

// 创建广告
exports.createAd = async (req, res, next) => {
  try {
    res.status(201).json({ status: 'success', message: '创建广告（功能开发中）' });
  } catch (error) { next(error); }
};

// 获取广告列表
exports.getAds = async (req, res, next) => {
  try {
    res.status(200).json({ status: 'success', data: { ads: [] } });
  } catch (error) { next(error); }
};
