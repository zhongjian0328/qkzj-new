/**
 * 认证模块集成测试
 * 覆盖：注册、登录、令牌刷新、获取当前用户、密码修改、验证码
 */

const request = require('supertest');
const mongoose = require('mongoose');
const { createTestApp } = require('../helpers/testApp');
const { setupTestDB, teardownTestDB, cleanCollections } = require('../helpers/setup');

let app;
let authToken;
let refreshToken;
let testUserId;

const testUser = {
  phoneNumber: '13800138001',
  password: 'test123456',
  nickname: '测试养殖户',
  roleType: 'FARMER',
  subRole: 'SMALL'
};

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

describe('认证模块', () => {
  describe('POST /api/auth/register — 用户注册', () => {
    it('应成功注册新用户并返回双令牌', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send(testUser)
        .expect(201);

      expect(res.body.status).toBe('success');
      expect(res.body.data.accessToken).toBeDefined();
      expect(res.body.data.refreshToken).toBeDefined();
      expect(res.body.data.user.phoneNumber).toBe(testUser.phoneNumber);
      expect(res.body.data.user.password).toBeUndefined();

      authToken = res.body.data.accessToken;
      refreshToken = res.body.data.refreshToken;
      testUserId = res.body.data.user._id;
    });

    it('应拒绝重复手机号注册', async () => {
      await request(app).post('/api/auth/register').send(testUser);

      const res = await request(app)
        .post('/api/auth/register')
        .send(testUser)
        .expect(400);

      expect(res.body.status).toBe('error');
      expect(res.body.message).toContain('已注册');
    });

    it('应拒绝缺少必填字段', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({ phoneNumber: '13800138003', password: '123456' })
        .expect(500);

      expect(res.body.status).toBe('error');
    });

    it('应拒绝无效的角色类型', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          ...testUser,
          phoneNumber: '13800138003',
          roleType: 'INVALID_ROLE'
        })
        .expect(500);

      expect(res.body.status).toBe('error');
    });
  });

  describe('POST /api/auth/login — 用户登录', () => {
    beforeEach(async () => {
      await request(app).post('/api/auth/register').send(testUser);
    });

    it('应成功登录并返回双令牌', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({ phoneNumber: testUser.phoneNumber, password: testUser.password })
        .expect(200);

      expect(res.body.status).toBe('success');
      expect(res.body.data.accessToken).toBeDefined();
      expect(res.body.data.refreshToken).toBeDefined();
      expect(res.body.data.user.phoneNumber).toBe(testUser.phoneNumber);

      authToken = res.body.data.accessToken;
      refreshToken = res.body.data.refreshToken;
    });

    it('应拒绝错误密码', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({ phoneNumber: testUser.phoneNumber, password: 'wrongpassword' })
        .expect(401);

      expect(res.body.status).toBe('error');
      expect(res.body.message).toContain('错误');
    });

    it('应拒绝未注册手机号', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({ phoneNumber: '19999999999', password: '123456' })
        .expect(401);

      expect(res.body.status).toBe('error');
    });
  });

  describe('POST /api/auth/refresh-token — 令牌刷新', () => {
    beforeEach(async () => {
      const regRes = await request(app).post('/api/auth/register').send(testUser);
      refreshToken = regRes.body.data.refreshToken;
    });

    it('应成功刷新令牌并返回新的双令牌', async () => {
      const res = await request(app)
        .post('/api/auth/refresh-token')
        .send({ refreshToken })
        .expect(200);

      expect(res.body.status).toBe('success');
      expect(res.body.data.accessToken).toBeDefined();
      expect(res.body.data.refreshToken).toBeDefined();
      expect(typeof res.body.data.accessToken).toBe('string');
      expect(typeof res.body.data.refreshToken).toBe('string');
    });

    it('应拒绝无效的刷新令牌', async () => {
      const res = await request(app)
        .post('/api/auth/refresh-token')
        .send({ refreshToken: 'invalid-token' })
        .expect(401);

      expect(res.body.status).toBe('error');
    });

    it('应拒绝缺少刷新令牌', async () => {
      const res = await request(app)
        .post('/api/auth/refresh-token')
        .send({})
        .expect(400);

      expect(res.body.status).toBe('error');
    });
  });

  describe('GET /api/auth/current-user — 获取当前用户', () => {
    beforeEach(async () => {
      const regRes = await request(app).post('/api/auth/register').send(testUser);
      authToken = regRes.body.data.accessToken;
    });

    it('应返回当前用户信息', async () => {
      const res = await request(app)
        .get('/api/auth/current-user')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(res.body.status).toBe('success');
      expect(res.body.data.user.phoneNumber).toBe(testUser.phoneNumber);
    });

    it('应拒绝无令牌请求', async () => {
      await request(app)
        .get('/api/auth/current-user')
        .expect(401);
    });

    it('应拒绝无效令牌', async () => {
      const res = await request(app)
        .get('/api/auth/current-user')
        .set('Authorization', 'Bearer invalid.jwt.token')
        .expect(401);

      expect(res.body.status).toBe('error');
    });
  });

  describe('POST /api/auth/change-password — 修改密码', () => {
    beforeEach(async () => {
      const regRes = await request(app).post('/api/auth/register').send(testUser);
      authToken = regRes.body.data.accessToken;
    });

    it('应成功修改密码后可用新密码登录', async () => {
      const newPassword = 'newpass789';
      await request(app)
        .post('/api/auth/change-password')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ currentPassword: testUser.password, newPassword })
        .expect(200);

      const loginRes = await request(app)
        .post('/api/auth/login')
        .send({ phoneNumber: testUser.phoneNumber, password: newPassword })
        .expect(200);

      expect(loginRes.body.status).toBe('success');
    });

    it('应拒绝错误的原密码', async () => {
      const res = await request(app)
        .post('/api/auth/change-password')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ currentPassword: 'wrongpassword', newPassword: 'newpass789' })
        .expect(400);

      expect(res.body.status).toBe('error');
      expect(res.body.message).toContain('当前密码错误');
    });
  });

  describe('POST /api/auth/get-verification-code — 获取验证码', () => {
    it('应对新手机号返回成功', async () => {
      const res = await request(app)
        .post('/api/auth/get-verification-code')
        .send({ phoneNumber: '13800138099' })
        .expect(200);

      expect(res.body.status).toBe('success');
    });

    it('应拒绝已注册手机号', async () => {
      await request(app).post('/api/auth/register').send(testUser);

      const res = await request(app)
        .post('/api/auth/get-verification-code')
        .send({ phoneNumber: testUser.phoneNumber })
        .expect(400);

      expect(res.body.status).toBe('error');
    });
  });
});
