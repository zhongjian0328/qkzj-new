/**
 * 回访管理模块集成测试
 * 覆盖：调度、列表、统计、详情、完成、编辑、取消、删除 + 数据隔离
 */

const request = require('supertest');
const mongoose = require('mongoose');
const { createTestApp } = require('../helpers/testApp');
const { setupTestDB, teardownTestDB, cleanCollections } = require('../helpers/setup');

let app;
let authToken;
let testPlanId;
let testFollowUpId;

const testUser = {
  phoneNumber: '13700137001',
  password: 'test123456',
  nickname: '回访测试用户',
  roleType: 'FARMER',
  subRole: 'SMALL'
};

async function getAuthToken(app, user) {
  const regRes = await request(app).post('/api/auth/register').send(user);
  return regRes.body.data.accessToken;
}

async function createPlan(app, token) {
  const res = await request(app)
    .post('/api/control-plans/generate')
    .set('Authorization', `Bearer ${token}`)
    .send({ diseaseName: '新城疫', severity: 'high' });
  return res.body.data._id;
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

describe('回访管理模块', () => {
  beforeEach(async () => {
    authToken = await getAuthToken(app, testUser);
    testPlanId = await createPlan(app, authToken);
  });

  describe('POST /api/follow-ups/schedule — 调度回访', () => {
    it('应成功创建回访任务', async () => {
      const res = await request(app)
        .post('/api/follow-ups/schedule')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          planId: testPlanId,
          followUpType: 'day3',
          scheduledDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString()
        })
        .expect(201);

      expect(res.body.data).toBeDefined();
      expect(res.body.data.planId).toBe(testPlanId);
      expect(res.body.data.followUpType).toBe('day3');
      expect(res.body.data.status).toBe('pending');

      testFollowUpId = res.body.data._id;
    });

    it('应拒绝缺少预案 ID', async () => {
      const res = await request(app)
        .post('/api/follow-ups/schedule')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ followUpType: 'day7' })
        .expect(400);

      expect(res.body.message).toContain('预案ID');
    });

    it('应拒绝不存在的预案 ID', async () => {
      const fakePlanId = new mongoose.Types.ObjectId();
      const res = await request(app)
        .post('/api/follow-ups/schedule')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ planId: fakePlanId, followUpType: 'day3' })
        .expect(404);

      expect(res.body.message).toContain('预案不存在');
    });
  });

  describe('GET /api/follow-ups — 回访列表', () => {
    beforeEach(async () => {
      await request(app)
        .post('/api/follow-ups/schedule')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ planId: testPlanId, followUpType: 'day3' });
      await request(app)
        .post('/api/follow-ups/schedule')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ planId: testPlanId, followUpType: 'day7' });
    });

    it('应返回回访列表', async () => {
      const res = await request(app)
        .get('/api/follow-ups')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(res.body.data.length).toBe(2);
      expect(res.body.total).toBe(2);
    });

    it('应支持按状态筛选', async () => {
      const res = await request(app)
        .get('/api/follow-ups?status=pending')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(res.body.data.length).toBe(2);
    });

    it('应支持按预案筛选', async () => {
      const res = await request(app)
        .get(`/api/follow-ups?planId=${testPlanId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(res.body.data.length).toBe(2);
    });
  });

  describe('GET /api/follow-ups/stats — 回访统计', () => {
    beforeEach(async () => {
      await request(app)
        .post('/api/follow-ups/schedule')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ planId: testPlanId, followUpType: 'day3' });
    });

    it('应返回正确的统计数据', async () => {
      const res = await request(app)
        .get('/api/follow-ups/stats')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(res.body.data).toBeDefined();
      expect(res.body.data.pending).toBe(1);
      expect(res.body.data.completed).toBe(0);
      expect(res.body.data.total).toBe(1);
    });
  });

  describe('GET /api/follow-ups/:id — 回访详情', () => {
    beforeEach(async () => {
      const scheduleRes = await request(app)
        .post('/api/follow-ups/schedule')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ planId: testPlanId, followUpType: 'day3' });
      testFollowUpId = scheduleRes.body.data._id;
    });

    it('应返回回访详情', async () => {
      const res = await request(app)
        .get(`/api/follow-ups/${testFollowUpId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(res.body.data._id).toBe(testFollowUpId);
      expect(res.body.data.followUpType).toBe('day3');
    });

    it('应返回 404 查询不存在的回访', async () => {
      const fakeId = new mongoose.Types.ObjectId();
      await request(app)
        .get(`/api/follow-ups/${fakeId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(404);
    });
  });

  describe('POST /api/follow-ups/:id/complete — 完成回访', () => {
    beforeEach(async () => {
      const scheduleRes = await request(app)
        .post('/api/follow-ups/schedule')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ planId: testPlanId, followUpType: 'day3' });
      testFollowUpId = scheduleRes.body.data._id;
    });

    it('应成功完成回访并返回 AI 评估', async () => {
      const res = await request(app)
        .post(`/api/follow-ups/${testFollowUpId}/complete`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          questions: {
            mortalityChange: '下降',
            symptomImprovement: '明显好转',
            medicationCompliance: '按时用药',
            sideEffects: '无',
            feedIntakeChange: '恢复正常',
            additionalSymptoms: '无',
            overallAssessment: '良好'
          },
          notes: '恢复情况良好'
        })
        .expect(200);

      expect(res.body.data.status).toBe('completed');
      expect(res.body.data.completedDate).toBeDefined();
      expect(res.body.data.questions.overallAssessment).toBe('良好');
      expect(res.body.data.aiAssessment).toBeDefined();
    });

    it('应拒绝缺少回访问卷', async () => {
      const res = await request(app)
        .post(`/api/follow-ups/${testFollowUpId}/complete`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({ notes: '测试' })
        .expect(400);

      expect(res.body.message).toContain('问卷');
    });
  });

  describe('PATCH /api/follow-ups/:id — 编辑回访', () => {
    beforeEach(async () => {
      const scheduleRes = await request(app)
        .post('/api/follow-ups/schedule')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ planId: testPlanId, followUpType: 'day3' });
      testFollowUpId = scheduleRes.body.data._id;
    });

    it('应成功更新备注和计划日期', async () => {
      const newDate = new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString();
      const res = await request(app)
        .patch(`/api/follow-ups/${testFollowUpId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({ notes: '推迟回访', scheduledDate: newDate })
        .expect(200);

      expect(res.body.data.notes).toBe('推迟回访');
    });
  });

  describe('PATCH /api/follow-ups/:id/cancel — 取消回访', () => {
    beforeEach(async () => {
      const scheduleRes = await request(app)
        .post('/api/follow-ups/schedule')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ planId: testPlanId, followUpType: 'day3' });
      testFollowUpId = scheduleRes.body.data._id;
    });

    it('应将回访状态设为已取消', async () => {
      const res = await request(app)
        .patch(`/api/follow-ups/${testFollowUpId}/cancel`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(res.body.data.status).toBe('cancelled');
    });
  });

  describe('DELETE /api/follow-ups/:id — 删除回访', () => {
    beforeEach(async () => {
      const scheduleRes = await request(app)
        .post('/api/follow-ups/schedule')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ planId: testPlanId, followUpType: 'day3' });
      testFollowUpId = scheduleRes.body.data._id;
    });

    it('应成功删除回访', async () => {
      const res = await request(app)
        .delete(`/api/follow-ups/${testFollowUpId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(res.body.message).toContain('已删除');

      await request(app)
        .get(`/api/follow-ups/${testFollowUpId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(404);
    });
  });

  describe('数据隔离 — 用户只能访问自己的回访', () => {
    it('用户 B 不能看到用户 A 的回访', async () => {
      const scheduleRes = await request(app)
        .post('/api/follow-ups/schedule')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ planId: testPlanId, followUpType: 'day3' });
      const followUpId = scheduleRes.body.data._id;

      const tokenB = await getAuthToken(app, {
        phoneNumber: '13700137002',
        password: 'test456',
        nickname: '用户B',
        roleType: 'VETERINARIAN',
        subRole: 'GENERAL'
      });

      await request(app)
        .get(`/api/follow-ups/${followUpId}`)
        .set('Authorization', `Bearer ${tokenB}`)
        .expect(404);
    });
  });
});
