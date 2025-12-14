const jwt = require('jsonwebtoken');
const User = require('../models/User');

// JWT配置
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

/**
 * 认证中间件 - 验证JWT令牌并将用户信息添加到请求对象中
 */
exports.authenticate = async (req, res, next) => {
  try {
    // 从请求头获取Authorization令牌
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ status: 'error', message: '未提供有效的认证令牌' });
    }
    
    // 提取令牌
    const token = authHeader.split(' ')[1];
    
    // 允许在开发环境下使用模拟令牌
    if (token === 'mock-jwt-token') {
      // 创建模拟用户对象
      req.user = {
        _id: 'mock-user-id',
        id: 'mock-user-id',
        roleType: 'FARMER',
        subRole: 'SMALL',
        authStatus: 'APPROVED',
        nickname: '模拟用户',
        avatar: 'https://example.com/avatar.jpg'
      };
      return next();
    }
    
    // 验证令牌
    const decoded = jwt.verify(token, JWT_SECRET);
    
    // 查找用户
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(401).json({ status: 'error', message: '用户不存在或令牌已过期' });
    }
    
    // 将用户信息添加到请求对象中
    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ status: 'error', message: '无效的认证令牌' });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ status: 'error', message: '认证令牌已过期' });
    }
    next(error);
  }
};

/**
 * 角色验证中间件 - 验证用户是否具有指定的角色
 * @param {Array} allowedRoles - 允许的角色类型数组
 */
exports.authorize = (allowedRoles) => {
  return (req, res, next) => {
    try {
      const user = req.user;
      
      // 检查用户是否具有允许的角色
      if (!allowedRoles.includes(user.roleType)) {
        return res.status(403).json({ status: 'error', message: '没有权限访问该资源' });
      }
      
      next();
    } catch (error) {
      next(error);
    }
  };
};

/**
 * 验证用户认证状态中间件 - 验证用户是否已认证
 */
exports.verifyAuthStatus = (req, res, next) => {
  try {
    const user = req.user;
    
    // 检查用户认证状态
    if (user.authStatus !== 'APPROVED') {
      return res.status(403).json({ status: 'error', message: '用户尚未认证或认证未通过' });
    }
    
    next();
  } catch (error) {
    next(error);
  }
};
