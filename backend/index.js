const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const dotenv = require('dotenv');
const mongoose = require('mongoose');

// 加载环境变量
dotenv.config();

// 创建Express应用
const app = express();

// 配置中间件
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

// 注册路由
app.use('/api/auth', authRoutes);
app.use('/api/ai-diagnosis', aiDiagnosisRoutes);
app.use('/api/production', productionRoutes);
app.use('/api/epidemic', epidemicRoutes);
app.use('/api/internship', internshipRoutes);
app.use('/api/knowledge', knowledgeRoutes);
app.use('/api/business', businessRoutes);
app.use('/api/research', researchRoutes);

// 健康检查路由
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: '禽康智检API服务运行正常' });
});

// 404错误处理
app.use('/', (req, res) => {
  res.status(404).json({ status: 'error', message: '请求的资源不存在' });
});

// 全局错误处理
app.use((err, req, res, next) => {
  console.error('全局错误:', err);
  const statusCode = err.statusCode || 500;
  const message = err.message || '服务器内部错误';
  res.status(statusCode).json({ status: 'error', message });
});

// 启动服务器
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`服务器运行在 http://localhost:${PORT}`);
});
