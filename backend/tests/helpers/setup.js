/**
 * 测试环境共享配置
 * - 连接本地 MongoDB（使用随机数据库名实现隔离）
 * - 设置必要环境变量
 * - 提供 afterEach 数据清理
 */

const mongoose = require('mongoose');
const { v4: uuidv4 } = require('crypto');

// 随机数据库名，避免测试间数据冲突
const TEST_DB_NAME = `qinkang_test_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
const MONGO_URI = `mongodb://127.0.0.1:27017/${TEST_DB_NAME}`;

// 必须在 require 任何业务模块之前设置
process.env.JWT_SECRET = 'test-jwt-secret-for-integration-tests';
process.env.NODE_ENV = 'test';

async function setupTestDB() {
  await mongoose.connect(MONGO_URI);
  console.log(`测试数据库连接: ${TEST_DB_NAME}`);
}

async function teardownTestDB() {
  // 删除测试数据库
  if (mongoose.connection.readyState === 1) {
    await mongoose.connection.db.dropDatabase();
    await mongoose.disconnect();
  }
}

async function cleanCollections() {
  // 清理所有已注册的 Model 对应的集合
  const modelNames = Object.keys(mongoose.models);
  for (const name of modelNames) {
    try {
      await mongoose.models[name].deleteMany({});
    } catch (_) {
      // 集合可能不存在，忽略
    }
  }
}

module.exports = { setupTestDB, teardownTestDB, cleanCollections, MONGO_URI };
