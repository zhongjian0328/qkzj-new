/**
 * 防控预案模块集成测试
 * 覆盖：生成、列表、详情、更新、完成、归档、删除 + 数据隔离
 */

const request = require('supertest');
const mongoose = require('mongoose');
const { createTestApp } = require('../helpers/testApp');
const { setupTestDB, teardownTestDB, cleanCollections } = require('../helpers/setup');

let app;
let authToken;
let testPlanId;

const testUser = {
  phoneNumber: '13900139001',
  password: 'test123456',
  nickname: '预案测试用户',
  roleType: 'FARMER',
  subRole: 'SMALL'
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

describe('防控预案模块', () => {
  beforeEach(async () => {
    authToken = await getAuthToken(app, testUser);
  });

  describe('POST /api/control-plans/generate — AI生成预案', () => {
    it('应成功生成防控预案', async () => {
      const res = await request(app)
        .post('/api/control-plans/generate')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          diseaseName: '新城疫',
          severity: 'high',
          planType: 'emergency'
        })
        .expect(201);

      expect(res.body.data).toBeDefined();
      expect(res.body.data.diseaseName).toBe('新城疫');
      expect(res.body.data.planName).toContain('新城疫');
      expect(res.body.data.severity).toBe('high');
      expect(res.body.data.generatedBy).toBe('ai');
      expect(res.body.data.status).toBe('active');

      testPlanId = res.body.data._id;
    });

    it('应拒绝缺少疾病名称', async () => {
      const res = await request(app)
        .post('/api/control-plans/generate')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ severity: 'medium' })
        .expect(400);

      expect(res.body.message).toContain('疾病名称');
    });

    it('应拒绝未认证请求', async () => {
      await request(app)
        .post('/api/control-plans/generate')
        .send({ diseaseName: '新城疫' })
        .expect(401);
    });
  });

  describe('GET /api/control-plans — 预案列表', () => {
    beforeEach(async () => {
      await request(app)
        .post('/api/control-plans/generate')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ diseaseName: '新城疫', severity: 'high' });
      await request(app)
        .post('/api/control-plans/generate')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ diseaseName: '禽流感', severity: 'critical' });
    });

    it('应返回当前用户的预案列表', async () => {
      const res = await request(app)
        .get('/api/control-plans')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(res.body.data).toBeDefined();
      expect(res.body.data.length).toBe(2);
      expect(res.body.total).toBe(2);
    });

    it('应支持按状态筛选', async () => {
      const res = await request(app)
        .get('/api/control-plans?status=active')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(res.body.data.length).toBe(2);
    });

    it('应支持分页', async () => {
      const res = await request(app)
        .get('/api/control-plans?page=1&limit=1')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(res.body.data.length).toBe(1);
      expect(res.body.page).toBe(1);
      expect(res.body.limit).toBe(1);
    });
  });

  describe('GET /api/control-plans/:id — 预案详情', () => {
    beforeEach(async () => {
      const genRes = await request(app)
        .post('/api/control-plans/generate')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ diseaseName: '禽流感', severity: 'critical' });
      testPlanId = genRes.body.data._id;
    });

    it('应返回预案详情', async () => {
      const res = await request(app)
        .get(`/api/control-plans/${testPlanId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(res.body.data._id).toBe(testPlanId);
      expect(res.body.data.diseaseName).toBe('禽流感');
    });

    it('应返回 404 查询不存在的预案', async () => {
      const fakeId = new mongoose.Types.ObjectId();
      const res = await request(app)
        .get(`/api/control-plans/${fakeId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(404);

      expect(res.body.message).toContain('不存在');
    });
  });

  describe('PATCH /api/control-plans/:id — 更新预案', () => {
    beforeEach(async () => {
      const genRes = await request(app)
        .post('/api/control-plans/generate')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ diseaseName: '传支', severity: 'medium' });
      testPlanId = genRes.body.data._id;
    });

    it('应成功更新预案名称和备注', async () => {
      const res = await request(app)
        .patch(`/api/control-plans/${testPlanId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({ planName: '更新后的预案', completionNotes: '执行顺利' })
        .expect(200);

      expect(res.body.data.planName).toBe('更新后的预案');
      expect(res.body.data.completionNotes).toBe('执行顺利');
    });
  });

  describe('PATCH /api/control-plans/:id/complete — 完成预案', () => {
    beforeEach(async () => {
      const genRes = await request(app)
        .post('/api/control-plans/generate')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ diseaseName: '大肠杆菌', severity: 'low' });
      testPlanId = genRes.body.data._id;
    });

    it('应将预案状态设为已完成', async () => {
      const res = await request(app)
        .patch(`/api/control-plans/${testPlanId}/complete`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({ completionNotes: '已执行完毕' })
        .expect(200);

      expect(res.body.data.status).toBe('completed');
      expect(res.body.data.completedAt).toBeDefined();
    });
  });

  describe('PATCH /api/control-plans/:id/archive — 归档预案', () => {
    beforeEach(async () => {
      const genRes = await request(app)
        .post('/api/control-plans/generate')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ diseaseName: '沙门氏菌', severity: 'medium' });
      testPlanId = genRes.body.data._id;
    });

    it('应将预案状态设为已归档', async () => {
      const res = await request(app)
        .patch(`/api/control-plans/${testPlanId}/archive`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(res.body.data.status).toBe('archived');
    });
  });

  describe('DELETE /api/control-plans/:id — 删除预案', () => {
    beforeEach(async () => {
      const genRes = await request(app)
        .post('/api/control-plans/generate')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ diseaseName: '球虫病', severity: 'low' });
      testPlanId = genRes.body.data._id;
    });

    it('应成功删除预案', async () => {
      const res = await request(app)
        .delete(`/api/control-plans/${testPlanId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(res.body.message).toContain('已删除');

      await request(app)
        .get(`/api/control-plans/${testPlanId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(404);
    });

    it('应返回 404 删除不存在的预案', async () => {
      const fakeId = new mongoose.Types.ObjectId();
      const res = await request(app)
        .delete(`/api/control-plans/${fakeId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(404);

      expect(res.body.message).toContain('不存在');
    });
  });

  describe('数据隔离 — 用户只能访问自己的预案', () => {
    it('用户 B 不能看到用户 A 的预案', async () => {
      const genRes = await request(app)
        .post('/api/control-plans/generate')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ diseaseName: '新城疫', severity: 'high' });
      const planId = genRes.body.data._id;

      const tokenB = await getAuthToken(app, {
        phoneNumber: '13900139002',
        password: 'test456',
        nickname: '用户B',
        roleType: 'VETERINARIAN',
        subRole: 'GENERAL'
      });

      await request(app)
        .get(`/api/control-plans/${planId}`)
        .set('Authorization', `Bearer ${tokenB}`)
        .expect(404);

      const listRes = await request(app)
        .get('/api/control-plans')
        .set('Authorization', `Bearer ${tokenB}`)
        .expect(200);

      expect(listRes.body.total).toBe(0);
    });
  });
});
