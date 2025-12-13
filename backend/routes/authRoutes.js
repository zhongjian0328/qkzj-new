const express = require('express');
const { authenticate } = require('../middleware/authMiddleware');
const authController = require('../controllers/authController');

const router = express.Router();

/**
 * 认证相关路由
 */

// 获取验证码（模拟实现）
router.post('/get-verification-code', authController.getVerificationCode);

// 验证验证码（模拟实现）
router.post('/verify-code', authController.verifyCode);

// 用户注册
router.post('/register', authController.register);

// 用户登录
router.post('/login', authController.login);

// 获取当前用户信息（需要认证）
router.get('/current-user', authenticate, authController.getCurrentUser);

// 更新用户信息（需要认证）
router.put('/update', authenticate, authController.updateUser);

// 用户认证申请（需要认证）
router.post('/certify', authenticate, authController.certify);

// 修改密码（需要认证）
router.post('/change-password', authenticate, authController.changePassword);

module.exports = router;
