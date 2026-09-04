const { Server } = require('socket.io');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const JWT_SECRET = process.env.JWT_SECRET;

let io = null;

/**
 * Socket.IO 连接认证中间件 — 验证 JWT 令牌
 */
function socketAuthMiddleware(socket, next) {
  try {
    // 开发环境允许 mock token
    const token = socket.handshake.auth?.token || socket.handshake.query.token;

    if (!token) {
      return next(new Error('未提供认证令牌'));
    }

    if (token === 'mock-jwt-token' && process.env.NODE_ENV === 'development') {
      const { ObjectId } = require('mongoose').Types;
      const mockUserId = new ObjectId();
      socket.userId = mockUserId.toString();
      socket.userRole = 'FARMER';
      return next();
    }

    // 验证 JWT
    const decoded = jwt.verify(token, JWT_SECRET);
    socket.userId = decoded.id.toString();
    socket.userRole = decoded.roleType;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return next(new Error('认证令牌已过期'));
    }
    next(new Error('无效的认证令牌'));
  }
}

/**
 * 初始化 Socket.IO 服务器
 * @param {import('http').Server} server - HTTP server 实例
 * @param {Object} corsOptions - CORS 配置
 * @returns {Server} Socket.IO 实例
 */
function initSocketIO(server, corsOptions = {}) {
  const allowedOrigins = process.env.CORS_ALLOWED_ORIGINS
    ? process.env.CORS_ALLOWED_ORIGINS.split(',')
    : ['http://localhost:8081', 'http://localhost:3000'];

  io = new Server(server, {
    cors: {
      origin: corsOptions.origin || allowedOrigins,
      methods: corsOptions.methods || ['GET', 'POST'],
      credentials: true,
    },
    transports: ['websocket', 'polling'],
    pingTimeout: 60000,
    pingInterval: 25000,
  });

  // 注册 JWT 认证中间件
  io.use(socketAuthMiddleware);

  io.on('connection', (socket) => {
    const userId = socket.userId;

    if (userId) {
      socket.join(userId);
      console.log(`[Socket.IO] 用户 ${userId} 已连接 (socketId: ${socket.id})`);
    }

    // 客户端主动加入房间（仅允许加入自己 userId 的房间，防止越权）
    socket.on('join', (room) => {
      if (room === userId || room === `role:${socket.userRole}`) {
        socket.join(room);
        console.log(`[Socket.IO] 用户 ${userId} 加入房间: ${room}`);
      }
    });

    socket.on('disconnect', (reason) => {
      console.log(`[Socket.IO] 用户 ${userId} 断开连接 (socketId: ${socket.id}, reason: ${reason})`);
    });

    socket.on('notification', (data) => {
      console.log(`[Socket.IO] 收到用户 ${userId} 的 notification 事件:`, data);
    });
  });

  console.log('[Socket.IO] 服务已启动（JWT 认证已启用）');
  return io;
}

/**
 * 获取 Socket.IO 实例
 * @returns {Server|null}
 */
function getIO() {
  if (!io) {
    throw new Error('Socket.IO 尚未初始化，请先调用 initSocketIO()');
  }
  return io;
}

/**
 * 向指定用户推送通知
 * @param {string} userId - 用户 ID
 * @param {string} event - 事件名称
 * @param {Object} data - 通知数据
 */
function notifyUser(userId, event, data) {
  if (!io) {
    console.warn('[Socket.IO] notifyUser 调用时 Socket.IO 尚未初始化');
    return;
  }
  io.to(userId).emit(event, data);
  console.log(`[Socket.IO] 已向用户 ${userId} 推送事件: ${event}`);
}

module.exports = { initSocketIO, getIO, notifyUser };
