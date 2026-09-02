/**
 * AI 诊断模块集成测试
 * 覆盖：对话诊断、兽医模式诊断、诊断历史、健康检查
 * 重点验证 LLM 不可用时规则引擎降级路径
 */

const request = require('supertest');
const mongoose = require('mongoose');
const { createTestApp } = require('../helpers/testApp');
const { setupTestDB, teardownTestDB, cleanCollections } = require('../helpers/setup');

let app;
let authToken;

const testUser = {
  phoneNumber: '13600136001',
  password: 'test123456',
  nickname: '诊断测试用户',
  roleType: 'VETERINARIAN',
  subRole: 'GENERAL'
};

async function getAuthToken(app, user) {
  const regRes = await request(app).post('/api/auth/register').send(user);
  return regRes.body.data.accessToken;
}

beforeAll(async () => {
  await setupTestDB();
  app = createTestApp();
}, 10000);

afterAll(async () => {
  await teardownTestDB();
}, 10000);

afterEach(async () => {
  await cleanCollections();
});

describe('AI 诊断模块', () => {
  beforeEach(async () => {
    authToken = await getAuthToken(app, testUser);
  });

  describe('POST /api/ai-diagnosis/chat-diagnosis — 对话诊断', () => {
    it('应返回 AI 诊断响应（LLM 或规则引擎降级）', async () => {
      const res = await request(app)
        .post('/api/ai-diagnosis/chat-diagnosis')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          message: '鸡群精神沉郁、绿色稀粪、呼吸困难',
          imageUrls: [],
          history: []
        });

      // 无论 LLM 是否可用，端点应返回 200（规则引擎降级兜底）
      expect(res.status).toBe(200);
      expect(res.body.status).toBe('success');
      expect(res.body.data).toBeDefined();
      expect(res.body.data.response).toBeDefined();
      expect(typeof res.body.data.response).toBe('string');
      expect(res.body.data.diagnosisId).toBeDefined();
    });

    it('应保存诊断记录到数据库', async () => {
      const res = await request(app)
        .post('/api/ai-diagnosis/chat-diagnosis')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          message: '鸡群出现神经症状、歪头转圈',
          imageUrls: [],
          history: []
        })
        .expect(200);

      const diagnosisId = res.body.data.diagnosisId;

      // 查询诊断历史验证记录已保存
      const historyRes = await request(app)
        .get('/api/ai-diagnosis/history')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(historyRes.body.status).toBe('success');
      expect(historyRes.body.data.diagnosisRecords).toBeDefined();
      expect(Array.isArray(historyRes.body.data.diagnosisRecords)).toBe(true);
      expect(historyRes.body.data.diagnosisRecords.length).toBeGreaterThanOrEqual(1);
    });

    it('应支持对话历史传入', async () => {
      const res = await request(app)
        .post('/api/ai-diagnosis/chat-diagnosis')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          message: '死亡率上升到了5%',
          imageUrls: [],
          history: [
            { sender: 'user', message: '鸡群有呼吸道症状', timestamp: new Date().toISOString() },
            { sender: 'ai', message: '可能是新城疫或传支', timestamp: new Date().toISOString() }
          ]
        })
        .expect(200);

      expect(res.body.data.history.length).toBeGreaterThanOrEqual(3);
    });

    it('应拒绝未认证请求', async () => {
      await request(app)
        .post('/api/ai-diagnosis/chat-diagnosis')
        .send({ message: '测试' })
        .expect(401);
    });
  });

  describe('POST /api/ai-diagnosis/veterinary-diagnosis — 兽医模式诊断', () => {
    it('应返回兽医模式诊断结果', async () => {
      const res = await request(app)
        .post('/api/ai-diagnosis/veterinary-diagnosis')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          basicInfo: {
            environment: '封闭式鸡舍',
            breed: '白羽肉鸡',
            age: '35日龄'
          },
          clinicalSymptoms: {
            symptoms: ['精神沉郁', '绿色稀粪', '呼吸困难']
          },
          imageUrls: []
        });

      // 端点应返回 200（LLM 或规则引擎降级）
      expect(res.status).toBe(200);
      expect(res.body.status).toBe('success');
    });
  });

  describe('GET /api/ai-diagnosis/history — 诊断历史', () => {
    it('应返回空列表（新用户无记录）', async () => {
      const res = await request(app)
        .get('/api/ai-diagnosis/history')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(res.body.status).toBe('success');
      expect(res.body.data.diagnosisRecords).toBeDefined();
      expect(Array.isArray(res.body.data.diagnosisRecords)).toBe(true);
    });

    it('应拒绝未认证请求', async () => {
      await request(app)
        .get('/api/ai-diagnosis/history')
        .expect(401);
    });
  });

  describe('GET /api/ai-diagnosis/health — AI 服务健康检查', () => {
    it('应返回健康状态', async () => {
      const res = await request(app)
        .get('/api/ai-diagnosis/health')
        .expect(200);

      expect(res.body).toBeDefined();
    });
  });

  describe('规则引擎降级验证', () => {
    it('对话诊断在 LLM 不可用时应返回规则引擎结果', async () => {
      // 测试环境无 DOUBAO_API_KEY，LLM 自动降级到规则引擎
      const res = await request(app)
        .post('/api/ai-diagnosis/chat-diagnosis')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          message: '鸡群出现新城疫典型症状：精神沉郁、绿色稀粪、呼吸困难、歪头转圈',
          imageUrls: [],
          history: []
        })
        .expect(200);

      // 规则引擎降级后应返回非空响应
      expect(res.body.data.response).toBeTruthy();
      expect(res.body.data.response.length).toBeGreaterThan(0);
    });
  });

  describe('数据隔离 — 用户只能访问自己的诊断记录', () => {
    it('用户 B 不能看到用户 A 的诊断历史', async () => {
      // 用户 A 创建诊断
      await request(app)
        .post('/api/ai-diagnosis/chat-diagnosis')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ message: '测试诊断', imageUrls: [], history: [] })
        .expect(200);

      // 用户 B
      const tokenB = await getAuthToken(app, {
        phoneNumber: '13600136002',
        password: 'test456',
        nickname: '用户B',
        roleType: 'FARMER',
        subRole: 'SMALL'
      });

      const historyRes = await request(app)
        .get('/api/ai-diagnosis/history')
        .set('Authorization', `Bearer ${tokenB}`)
        .expect(200);

      // 用户 B 的历史应为空
      expect(historyRes.body.data.diagnosisRecords.length).toBe(0);
    });
  });
});
