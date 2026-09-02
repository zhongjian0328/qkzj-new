const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

/**
 * 创建测试用 Express app（不启动服务器、不连接真实数据库、不限速）
 * 由 jest setup 在 beforeAll 中调用，返回 { app, mongoose }
 */
function createTestApp() {
  const app = express();

  // 基础中间件（与 index.js 保持一致，但跳过 helmet/rate-limit 以免干扰测试）
  app.use(cors({ origin: true, credentials: true }));
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));

  // 注册路由（与 index.js 一致）
  const authRoutes = require('../../routes/authRoutes');
  const aiDiagnosisRoutes = require('../../routes/aiDiagnosisRoutes');
  const controlPlanRoutes = require('../../routes/controlPlan');
  const followUpRoutes = require('../../routes/followUp');
  const environmentRoutes = require('../../routes/environmentRoutes');
  const surveyRoutes = require('../../routes/surveyRoutes');
  const knowledgeRoutes = require('../../routes/knowledgeRoutes');
  const statisticsRoutes = require('../../routes/statistics');
  const serviceTicketRoutes = require('../../routes/serviceTicket');
  const teachingCaseRoutes = require('../../routes/teachingCase');
  const notificationRoutes = require('../../routes/notification');
  const productionRoutes = require('../../routes/productionRoutes');
  const epidemicRoutes = require('../../routes/epidemicRoutes');
  const internshipRoutes = require('../../routes/internshipRoutes');
  const businessRoutes = require('../../routes/businessRoutes');
  const researchRoutes = require('../../routes/researchRoutes');

  app.use('/api/auth', authRoutes);
  app.use('/api/ai-diagnosis', aiDiagnosisRoutes);
  app.use('/api/control-plans', controlPlanRoutes);
  app.use('/api/follow-ups', followUpRoutes);
  app.use('/api/environment', environmentRoutes);
  app.use('/api/survey', surveyRoutes);
  app.use('/api/knowledge', knowledgeRoutes);
  app.use('/api/statistics', statisticsRoutes);
  app.use('/api/tickets', serviceTicketRoutes);
  app.use('/api/teaching-cases', teachingCaseRoutes);
  app.use('/api/notifications', notificationRoutes);
  app.use('/api/production', productionRoutes);
  app.use('/api/epidemic', epidemicRoutes);
  app.use('/api/internship', internshipRoutes);
  app.use('/api/business', businessRoutes);
  app.use('/api/research', researchRoutes);

  // 健康检查
  app.get('/api/health', (req, res) => {
    res.status(200).json({ status: 'ok' });
  });

  // 404 + 全局错误处理
  app.use('/', (req, res) => {
    res.status(404).json({ status: 'error', message: '请求的资源不存在' });
  });
  app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || '服务器内部错误';
    res.status(statusCode).json({ status: 'error', message });
  });

  return app;
}

module.exports = { createTestApp };
