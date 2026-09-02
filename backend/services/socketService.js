const { Server } = require('socket.io');

let io = null;

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

  io.on('connection', (socket) => {
    const userId = socket.handshake.query.userId || socket.handshake.auth?.userId;

    if (userId) {
      socket.join(userId);
      console.log(`[Socket.IO] 用户 ${userId} 已连接 (socketId: ${socket.id})`);
    }

    // 客户端主动加入房间
    socket.on('join', (room) => {
      socket.join(room);
      console.log(`[Socket.IO] 用户 ${userId} 加入房间: ${room}`);
    });

    socket.on('disconnect', (reason) => {
      console.log(`[Socket.IO] 用户 ${userId} 断开连接 (socketId: ${socket.id}, reason: ${reason})`);
    });

    socket.on('notification', (data) => {
      console.log(`[Socket.IO] 收到用户 ${userId} 的 notification 事件:`, data);
    });
  });

  console.log('[Socket.IO] 服务已启动');
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
