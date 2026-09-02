const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const http = require('http');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

// 加载环境变量
dotenv.config();

// 创建Express应用
const app = express();

// 安全中间件：HTTP 安全响应头（生产环境关键防护）
app.use(helmet({
  contentSecurityPolicy: false, // API 服务无需 CSP
  crossOriginEmbedderPolicy: false,
}));

// 全局请求限速：每个 IP 每分钟最多 120 次请求
const globalLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 120,
  standardHeaders: true,
  legacyHeaders: false,
  message: { status: 'error', message: '请求过于频繁，请稍后再试' },
});
app.use('/api/', globalLimiter);

// 认证端点严格限速：防止暴力破解，每 IP 每分钟最多 10 次登录/注册
const authLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { status: 'error', message: '认证请求过于频繁，请稍后再试' },
});

// 配置中间件
// 生产环境信任代理（确保 rate-limit 使用真实客户端 IP）
if (process.env.NODE_ENV === 'production') {
  app.set('trust proxy', 1);
}

// CORS配置
const allowedOrigins = process.env.CORS_ALLOWED_ORIGINS 
  ? process.env.CORS_ALLOWED_ORIGINS.split(',') 
  : ['http://localhost:8081', 'http://localhost:3000'];

app.use(cors({
  origin: (origin, callback) => {
    // 允许开发环境下的任何源或指定的允许源
    if (!origin || process.env.NODE_ENV === 'development' || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('不允许的跨域请求'));
    }
  },
  credentials: true,
}));
app.use(morgan('dev'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// 数据库连接常量配置
const DB_CONFIG = {
  MAX_POOL_SIZE: 50,
  MIN_POOL_SIZE: 5,
  MAX_IDLE_TIME_MS: 30000,
  CONNECT_TIMEOUT_MS: 15000,
  SOCKET_TIMEOUT_MS: 45000,
  SERVER_SELECTION_TIMEOUT_MS: 10000,
  WRITE_CONCERN_WTIMEOUT: 5000,
  HEARTBEAT_FREQUENCY_MS: 10000,
  KEEP_ALIVE_INTERVAL_MS: 60000, // 每分钟检查一次连接
  RECONNECT_DELAY_MS: 5000 // 5秒后重试连接
};

// 连接MongoDB数据库
const connectDB = async () => {
  try {
    const mongooseOptions = {
      maxPoolSize: DB_CONFIG.MAX_POOL_SIZE,
      minPoolSize: DB_CONFIG.MIN_POOL_SIZE,
      maxIdleTimeMS: DB_CONFIG.MAX_IDLE_TIME_MS,
      connectTimeoutMS: DB_CONFIG.CONNECT_TIMEOUT_MS,
      socketTimeoutMS: DB_CONFIG.SOCKET_TIMEOUT_MS,
      serverSelectionTimeoutMS: DB_CONFIG.SERVER_SELECTION_TIMEOUT_MS,
      retryWrites: true,
      retryReads: true,
      readPreference: 'primary',
      writeConcern: {
        w: 'majority',
        wtimeout: DB_CONFIG.WRITE_CONCERN_WTIMEOUT
      },
      heartbeatFrequencyMS: DB_CONFIG.HEARTBEAT_FREQUENCY_MS
    }; // 开发环境不强制认证

    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/qinkangzhijian', mongooseOptions);
    console.log('MongoDB连接成功');
    
    // 定期ping数据库，验证连接
    setInterval(async () => {
      try {
        await mongoose.connection.db.admin().ping();
        console.log('MongoDB连接保持活跃');
      } catch (error) {
        console.error('MongoDB连接检查失败:', error.message);
        // 尝试重新连接
        await mongoose.connection.close();
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/qinkangzhijian', mongooseOptions);
        console.log('MongoDB重新连接成功');
      }
    }, DB_CONFIG.KEEP_ALIVE_INTERVAL_MS);
  } catch (error) {
    console.error('MongoDB连接失败:', error.message);
    // 非阻塞，继续运行服务
    console.log('服务将继续运行，但无法连接数据库');
    // 尝试重新连接
    setTimeout(connectDB, DB_CONFIG.RECONNECT_DELAY_MS);
  }
};

connectDB();

// 路由配置
const authRoutes = require('./routes/authRoutes');
const aiDiagnosisRoutes = require('./routes/aiDiagnosisRoutes');
const productionRoutes = require('./routes/productionRoutes');
const epidemicRoutes = require('./routes/epidemicRoutes');
const internshipRoutes = require('./routes/internshipRoutes');
const knowledgeRoutes = require('./routes/knowledgeRoutes');
const businessRoutes = require('./routes/businessRoutes');
const researchRoutes = require('./routes/researchRoutes');
const environmentRoutes = require('./routes/environmentRoutes');
const surveyRoutes = require('./routes/surveyRoutes');
const controlPlanRoutes = require('./routes/controlPlan');
const followUpRoutes = require('./routes/followUp');
const statisticsRoutes = require('./routes/statistics');
const serviceTicketRoutes = require('./routes/serviceTicket');
const teachingCaseRoutes = require('./routes/teachingCase');
const notificationRoutes = require('./routes/notification');

// 注册路由（认证端点使用严格限速）
app.use('/api/auth', authLimiter, authRoutes);
app.use('/api/ai-diagnosis', aiDiagnosisRoutes);
app.use('/api/production', productionRoutes);
app.use('/api/epidemic', epidemicRoutes);
app.use('/api/internship', internshipRoutes);
app.use('/api/knowledge', knowledgeRoutes);
app.use('/api/business', businessRoutes);
app.use('/api/research', researchRoutes);
app.use('/api/environment', environmentRoutes);
app.use('/api/survey', surveyRoutes);
app.use('/api/control-plans', controlPlanRoutes);
app.use('/api/follow-ups', followUpRoutes);
app.use('/api/statistics', statisticsRoutes);
app.use('/api/tickets', serviceTicketRoutes);
app.use('/api/teaching-cases', teachingCaseRoutes);
app.use('/api/notifications', notificationRoutes);

// 健康检查路由（含数据库连通性）
app.get('/api/health', async (req, res) => {
  const health = {
    status: 'ok',
    message: '禽康智检API服务运行正常',
    mongodb: 'disconnected',
    uptime: process.uptime()
  };
  try {
    if (mongoose.connection.readyState === 1) {
      await mongoose.connection.db.admin().ping();
      health.mongodb = 'connected';
    }
  } catch {
    health.status = 'degraded';
    health.mongodb = 'error';
  }
  const statusCode = health.status === 'ok' ? 200 : 503;
  res.status(statusCode).json(health);
});

// 404错误处理
app.use('/', (req, res) => {
  res.status(404).json({ status: 'error', message: '请求的资源不存在' });
});

// 全局错误处理
app.use((err, req, res, next) => {
  console.error('全局错误:', err);
  const statusCode = err.statusCode || 500;
  // 生产环境屏蔽详细错误信息，防止泄露内部实现
  const message = process.env.NODE_ENV === 'production'
    ? (statusCode < 500 ? err.message : '服务器内部错误')
    : (err.message || '服务器内部错误');
  res.status(statusCode).json({ status: 'error', message });
});

// 启动服务器（包装为 HTTP server 以支持 Socket.IO）
const PORT = process.env.PORT || 3000;
const server = http.createServer(app);

// 初始化 Socket.IO
const { initSocketIO } = require('./services/socketService');
initSocketIO(server);

server.listen(PORT, () => {
  console.log(`服务器运行在 http://localhost:${PORT}`);
});

// 优雅关闭：收到终止信号时停止接收新请求，关闭现有连接
const shutdown = (signal) => {
  console.log(`收到 ${signal} 信号，开始优雅关闭...`);
  server.close(() => {
    console.log('HTTP 服务器已关闭');
    mongoose.connection.close(false).then(() => {
      console.log('MongoDB 连接已关闭');
      process.exit(0);
    }).catch(() => {
      process.exit(1);
    });
  });
  // 10秒后强制退出
  setTimeout(() => process.exit(1), 10000);
};
process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));
