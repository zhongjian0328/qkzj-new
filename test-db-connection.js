// 测试数据库连接脚本
const mongoose = require('mongoose');

// 加载环境变量
require('dotenv').config({ path: './backend/.env' });

// 连接参数
const MONGODB_URI = process.env.MONGODB_URI;

const mongooseOptions = {
  maxPoolSize: 50,
  minPoolSize: 5,
  maxIdleTimeMS: 30000,
  connectTimeoutMS: 10000,
  socketTimeoutMS: 45000,
  serverSelectionTimeoutMS: 5000,
  retryWrites: true,
  retryReads: true,
  readPreference: 'primary',
  writeConcern: {
    w: 'majority',
    wtimeout: 2000
  },
  serverSelectionTryOnce: false,
  heartbeatFrequencyMS: 10000,
  keepAlive: true,
  keepAliveInitialDelayMS: 300000
};

console.log('开始测试数据库连接...');
console.log('连接字符串:', MONGODB_URI);

// 测试连接
mongoose.connect(MONGODB_URI, mongooseOptions)
  .then(() => {
    console.log('✓ 数据库连接成功');
    // 测试数据库操作
    return mongoose.connection.db.admin().ping();
  })
  .then(() => {
    console.log('✓ 数据库操作成功');
    // 关闭连接
    return mongoose.connection.close();
  })
  .then(() => {
    console.log('✓ 数据库连接已关闭');
    console.log('测试完成，所有操作成功！');
  })
  .catch(error => {
    console.error('✗ 数据库连接失败:', error.message);
    console.error('错误类型:', error.name);
    if (error.code) {
      console.error('错误代码:', error.code);
    }
    if (error.reason) {
      console.error('错误原因:', error.reason);
    }
    if (error.stack) {
      console.error('错误堆栈:', error.stack);
    }
    process.exit(1);
  });
