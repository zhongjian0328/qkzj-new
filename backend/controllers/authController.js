const User = require('../models/User');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

// JWT配置 — access / refresh 密钥分离
const JWT_SECRET = process.env.JWT_SECRET;
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || JWT_SECRET + '-refresh-fallback';
const ACCESS_TOKEN_EXPIRES_IN = process.env.ACCESS_TOKEN_EXPIRES_IN || '7d';
const REFRESH_TOKEN_EXPIRES_IN = process.env.REFRESH_TOKEN_EXPIRES_IN || '14d';

// 验证必要的环境变量
if (!JWT_SECRET) {
  throw new Error('JWT_SECRET environment variable is required');
}

// 生成访问令牌（access_token）— 使用 JWT_SECRET
const generateAccessToken = (user) => {
  return jwt.sign(
    { id: user._id, phoneNumber: user.phoneNumber, roleType: user.roleType },
    JWT_SECRET,
    { expiresIn: ACCESS_TOKEN_EXPIRES_IN }
  );
};

// 生成刷新令牌（refresh_token）— 使用独立密钥 JWT_REFRESH_SECRET
const generateRefreshToken = (userId) => {
  return jwt.sign(
    { id: userId },
    JWT_REFRESH_SECRET,
    { expiresIn: REFRESH_TOKEN_EXPIRES_IN }
  );
};

// ── Refresh Token MongoDB 存储（替代内存Map，支持多实例部署） ──
const RefreshTokenSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  token: { type: String, required: true },
  createdAt: { type: Date, default: Date.now, expires: 14 * 24 * 3600 } // TTL索引：14天后自动删除
});
const RefreshTokenModel = mongoose.models.RefreshToken || mongoose.model('RefreshToken', RefreshTokenSchema);

// 存储 refresh token（存入 MongoDB）
const storeRefreshToken = async (userId, token) => {
  await RefreshTokenModel.deleteMany({ userId }); // 单设备登录：清除旧 token
  await RefreshTokenModel.create({ userId, token });
};

// 验证并获取 refresh token
const findRefreshToken = async (userId, token) => {
  return RefreshTokenModel.findOne({ userId, token });
};

// 删除 refresh token
const deleteRefreshToken = async (userId) => {
  await RefreshTokenModel.deleteMany({ userId });
};

// 用户注册
exports.register = async (req, res, next) => {
  try {
    const { phoneNumber, password, nickname, roleType, subRole } = req.body;
    
    // 检查手机号是否已注册
    const existingUser = await User.findOne({ phoneNumber });
    if (existingUser) {
      return res.status(400).json({ status: 'error', message: '手机号已注册' });
    }
    
    // 创建新用户
    const user = await User.create({
      phoneNumber,
      password,
      nickname,
      roleType,
      subRole
    });
    
    // 生成令牌
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user._id);
    await storeRefreshToken(user._id.toString(), refreshToken);

    res.status(201).json({
      status: 'success',
      message: '注册成功',
      data: {
        user,
        accessToken,
        refreshToken
      }
    });
  } catch (error) {
    next(error);
  }
};

// 用户登录
exports.login = async (req, res, next) => {
  try {
    const { phoneNumber, password } = req.body;
    
    // 检查手机号和密码
    const user = await User.findOne({ phoneNumber });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ status: 'error', message: '手机号或密码错误' });
    }
    
    // 更新最后登录时间
    await user.updateLastLogin();
    
    // 生成令牌
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user._id);
    await storeRefreshToken(user._id.toString(), refreshToken);

    res.status(200).json({
      status: 'success',
      message: '登录成功',
      data: {
        user,
        accessToken,
        refreshToken
      }
    });
  } catch (error) {
    next(error);
  }
};

// ── 验证码 MongoDB 存储（替代内存Map，支持多实例部署） ──
const VERIFICATION_CODE_TTL_SECONDS = 5 * 60; // 验证码有效期5分钟
const VERIFICATION_CODE_MAX_ATTEMPTS = 5; // 最大错误尝试次数

const VerificationCodeSchema = new mongoose.Schema({
  phoneNumber: { type: String, required: true, index: true },
  code: { type: String, required: true },
  attempts: { type: Number, default: 0 },
  expiresAt: { type: Date, required: true, index: { expires: 0 } } // 过期自动删除
});
const VerificationCodeModel = mongoose.models.VerificationCode || mongoose.model('VerificationCode', VerificationCodeSchema);

// 生成6位数字验证码（加密安全随机数）
const generateVerificationCode = () => {
  return require('crypto').randomInt(100000, 1000000).toString();
};

// 获取验证码（模拟实现）
exports.getVerificationCode = async (req, res, next) => {
  try {
    const { phoneNumber, type = 'register' } = req.body;

    // 根据用途校验手机号注册状态
    const existingUser = await User.findOne({ phoneNumber });
    if (type === 'register' && existingUser) {
      return res.status(400).json({ status: 'error', message: '手机号已注册' });
    }
    if ((type === 'login' || type === 'forgot') && !existingUser) {
      return res.status(400).json({ status: 'error', message: '手机号未注册' });
    }

    // 模拟发送验证码（实际项目中应调用短信服务API）
    const verificationCode = generateVerificationCode();

    // 存储验证码到 MongoDB（先删除旧验证码）
    await VerificationCodeModel.deleteOne({ phoneNumber });
    await VerificationCodeModel.create({
      phoneNumber,
      code: verificationCode,
      attempts: 0,
      expiresAt: new Date(Date.now() + VERIFICATION_CODE_TTL_SECONDS * 1000)
    });

    // 开发环境打印到服务端日志便于联调
    if (process.env.NODE_ENV !== 'production') {
      console.log(`向手机号 ${phoneNumber} 发送验证码: ${verificationCode}`);
    }

    // 响应中不再返回验证码
    res.status(200).json({
      status: 'success',
      message: '验证码已发送'
    });
  } catch (error) {
    next(error);
  }
};

// 验证验证码（模拟实现）
exports.verifyCode = async (req, res, next) => {
  try {
    const { phoneNumber, code } = req.body;

    // 检查是否存在该手机号的验证码
    const record = await VerificationCodeModel.findOne({ phoneNumber });
    if (!record) {
      return res.status(400).json({ status: 'error', message: '验证码不存在或已失效，请重新获取' });
    }

    // 检查是否过期
    if (Date.now() > record.expiresAt.getTime()) {
      await VerificationCodeModel.deleteOne({ _id: record._id });
      return res.status(400).json({ status: 'error', message: '验证码已过期，请重新获取' });
    }

    // 检查错误尝试次数（上限5次，超过作废需重发）
    if (record.attempts >= VERIFICATION_CODE_MAX_ATTEMPTS) {
      await VerificationCodeModel.deleteOne({ _id: record._id });
      return res.status(400).json({ status: 'error', message: '验证码错误次数过多，请重新获取' });
    }

    // 比对验证码
    if (record.code !== code) {
      record.attempts += 1;
      await record.save();
      return res.status(400).json({ status: 'error', message: '验证码错误' });
    }

    // 验证通过即删除作废（一次性使用）
    await VerificationCodeModel.deleteOne({ _id: record._id });

    res.status(200).json({
      status: 'success',
      message: '验证码验证成功'
    });
  } catch (error) {
    next(error);
  }
};

// 验证码登录（已注册用户通过验证码登录）
exports.loginWithCode = async (req, res, next) => {
  try {
    const { phoneNumber, code } = req.body;

    if (!phoneNumber || !code) {
      return res.status(400).json({ status: 'error', message: '缺少必要参数' });
    }

    // 验证码校验（MongoDB）
    const record = await VerificationCodeModel.findOne({ phoneNumber });
    if (!record) {
      return res.status(400).json({ status: 'error', message: '验证码不存在或已失效，请重新获取' });
    }
    if (Date.now() > record.expiresAt.getTime()) {
      await VerificationCodeModel.deleteOne({ _id: record._id });
      return res.status(400).json({ status: 'error', message: '验证码已过期，请重新获取' });
    }
    if (record.attempts >= VERIFICATION_CODE_MAX_ATTEMPTS) {
      await VerificationCodeModel.deleteOne({ _id: record._id });
      return res.status(400).json({ status: 'error', message: '验证码错误次数过多，请重新获取' });
    }
    if (record.code !== code) {
      record.attempts += 1;
      await record.save();
      return res.status(400).json({ status: 'error', message: '验证码错误' });
    }
    await VerificationCodeModel.deleteOne({ _id: record._id });

    // 查找用户
    const user = await User.findOne({ phoneNumber });
    if (!user) {
      return res.status(404).json({ status: 'error', message: '手机号未注册' });
    }

    await user.updateLastLogin();

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user._id);
    await storeRefreshToken(user._id.toString(), refreshToken);

    res.status(200).json({
      status: 'success',
      message: '登录成功',
      data: {
        user,
        accessToken,
        refreshToken
      }
    });
  } catch (error) {
    next(error);
  }
};

// 体验登录（自动创建/查找体验账号）
exports.experienceLogin = async (req, res, next) => {
  try {
    const { roleType, subRole } = req.body;

    if (!roleType || !subRole) {
      return res.status(400).json({ status: 'error', message: '缺少角色参数' });
    }

    // 使用固定手机号标识体验账号（符合手机号格式的保留号段）
    const experiencePhones = {
      'FARMER_SMALL': '19900000001',
      'FARMER_ENTERPRISE': '19900000002',
      'FARMER_COOPERATIVE': '19900000003',
      'INSTITUTION_CDC': '19900000004',
      'INSTITUTION_RESEARCH_INSTITUTE': '19900000005',
      'INSTITUTION_SERVICE_PROVIDER': '19900000006',
      'STUDENT_LEARNING_STUDENT': '19900000007',
      'STUDENT_COGNITIVE_INTERN': '19900000008',
      'STUDENT_ADVANCED_INTERN': '19900000009',
      'TEACHER_MENTOR': '19900000010',
      'TEACHER_CLINICAL_TEACHER': '19900000011',
      'TEACHER_RESEARCH_TEACHER': '19900000012',
    };
    const experienceKey = `${roleType}_${subRole}`;
    const experiencePhone = experiencePhones[experienceKey] || '19900000099';
    const nickname = roleType === 'FARMER' ? '体验养殖户'
      : roleType === 'INSTITUTION' ? '体验机构用户'
      : roleType === 'STUDENT' ? '体验学生'
      : roleType === 'TEACHER' ? '体验教师'
      : '体验用户';

    let user = await User.findOne({ phoneNumber: experiencePhone });
    if (!user) {
      user = await User.create({
        phoneNumber: experiencePhone,
        password: 'experience123',
        nickname,
        roleType,
        subRole,
        authStatus: 'VERIFIED'
      });
    }

    await user.updateLastLogin();

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user._id);
    await storeRefreshToken(user._id.toString(), refreshToken);

    res.status(200).json({
      status: 'success',
      message: '体验登录成功',
      data: {
        user,
        accessToken,
        refreshToken
      }
    });
  } catch (error) {
    next(error);
  }
};

// 获取当前用户信息
exports.getCurrentUser = async (req, res, next) => {
  try {
    // 从请求对象中获取用户ID（由authMiddleware设置）
    const userId = req.user.id;
    
    const user = await User.findById(userId).populate('organizationId mentorId', 'name');
    if (!user) {
      return res.status(404).json({ status: 'error', message: '用户不存在' });
    }
    
    res.status(200).json({
      status: 'success',
      data: {
        user
      }
    });
  } catch (error) {
    next(error);
  }
};

// 更新用户信息
exports.updateUser = async (req, res, next) => {
  try {
    // 从请求对象中获取用户ID（由authMiddleware设置）
    const userId = req.user.id;

    // 显式字段白名单：仅允许普通资料字段
    // 以User模型实际字段为准，明确排除角色/权限/认证状态/密码等敏感字段
    const ALLOWED_UPDATE_FIELDS = ['nickname', 'avatar', 'schoolId', 'studentId'];
    const FORBIDDEN_UPDATE_FIELDS = ['password', 'phoneNumber', 'roleType', 'subRole', 'authStatus', 'permissions', 'isAdmin', 'role'];

    const requestBody = req.body || {};

    // 显式拒绝敏感字段
    const forbiddenFields = Object.keys(requestBody).filter(field => FORBIDDEN_UPDATE_FIELDS.includes(field));
    if (forbiddenFields.length > 0) {
      return res.status(400).json({ status: 'error', message: '不允许修改的字段: ' + forbiddenFields.join(', ') });
    }

    // 仅保留白名单字段
    const updateData = {};
    Object.keys(requestBody).forEach(field => {
      if (ALLOWED_UPDATE_FIELDS.includes(field)) {
        updateData[field] = requestBody[field];
      }
    });

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({ status: 'error', message: '没有可更新的字段' });
    }

    const updatedUser = await User.findByIdAndUpdate(userId, updateData, {
      new: true,
      runValidators: true
    });
    
    if (!updatedUser) {
      return res.status(404).json({ status: 'error', message: '用户不存在' });
    }
    
    res.status(200).json({
      status: 'success',
      message: '用户信息更新成功',
      data: {
        user: updatedUser
      }
    });
  } catch (error) {
    next(error);
  }
};

// 角色选择（用户首次选择身份，允许修改 roleType/subRole）
exports.selectRole = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { roleType, subRole } = req.body;

    const VALID_ROLE_TYPES = ['FARMER', 'INSTITUTION', 'STUDENT', 'TEACHER'];
    if (!VALID_ROLE_TYPES.includes(roleType)) {
      return res.status(400).json({ status: 'error', message: '无效的角色类型' });
    }
    if (!subRole) {
      return res.status(400).json({ status: 'error', message: '请选择具体身份' });
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { roleType, subRole },
      { new: true, runValidators: true }
    ).select('-password');

    if (!updatedUser) {
      return res.status(404).json({ status: 'error', message: '用户不存在' });
    }

    res.status(200).json({
      status: 'success',
      message: '角色选择成功',
      data: { user: updatedUser }
    });
  } catch (error) {
    next(error);
  }
};

// 用户认证
exports.certify = async (req, res, next) => {
  try {
    // 从请求对象中获取用户ID（由authMiddleware设置）
    const userId = req.user.id;

    const { certificationType, documents, additionalInfo } = req.body;

    // 显式字段白名单：仅允许资质认证需要的字段
    // 以User模型实际字段为准，明确排除角色/权限/认证状态等敏感字段
    const ALLOWED_CERTIFY_FIELDS = ['schoolId', 'studentId', 'organizationId'];
    const FORBIDDEN_CERTIFY_FIELDS = ['password', 'phoneNumber', 'roleType', 'subRole', 'authStatus', 'permissions', 'isAdmin', 'role'];

    const safeAdditionalInfo = additionalInfo || {};
    const forbiddenFields = Object.keys(safeAdditionalInfo).filter(field => FORBIDDEN_CERTIFY_FIELDS.includes(field));
    if (forbiddenFields.length > 0) {
      return res.status(400).json({ status: 'error', message: '不允许提交的字段: ' + forbiddenFields.join(', ') });
    }

    // 仅保留白名单字段
    const additionalUpdate = {};
    Object.keys(safeAdditionalInfo).forEach(field => {
      if (ALLOWED_CERTIFY_FIELDS.includes(field)) {
        additionalUpdate[field] = safeAdditionalInfo[field];
      }
    });

    // 更新用户认证状态为待审核（由代码显式赋值，不来自请求体）
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        authStatus: 'PENDING',
        // 这里应该将认证材料存储到对象存储服务中，并保存URL
        // 模拟存储认证材料（仅白名单字段）
        ...additionalUpdate
      },
      { new: true }
    );
    
    if (!updatedUser) {
      return res.status(404).json({ status: 'error', message: '用户不存在' });
    }
    
    res.status(200).json({
      status: 'success',
      message: '认证材料提交成功，等待审核',
      data: {
        user: updatedUser
      }
    });
  } catch (error) {
    next(error);
  }
};

// 密码修改
exports.changePassword = async (req, res, next) => {
  try {
    // 从请求对象中获取用户ID（由authMiddleware设置）
    const userId = req.user.id;
    
    const { currentPassword, newPassword } = req.body;
    
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ status: 'error', message: '用户不存在' });
    }
    
    // 验证当前密码
    const isPasswordCorrect = await user.comparePassword(currentPassword);
    if (!isPasswordCorrect) {
      return res.status(400).json({ status: 'error', message: '当前密码错误' });
    }
    
    // 更新密码
    user.password = newPassword;
    await user.save();
    
    res.status(200).json({
      status: 'success',
      message: '密码修改成功'
    });
  } catch (error) {
    next(error);
  }
};

// 刷新令牌
exports.refreshToken = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({ status: 'error', message: '未提供刷新令牌' });
    }

    // 验证 refresh_token 格式和有效期（使用独立密钥）
    let decoded;
    try {
      decoded = jwt.verify(refreshToken, JWT_REFRESH_SECRET);
    } catch (err) {
      if (err.name === 'TokenExpiredError') {
        return res.status(401).json({ status: 'error', message: '刷新令牌已过期，请重新登录' });
      }
      return res.status(401).json({ status: 'error', message: '无效的刷新令牌' });
    }

    const userId = decoded.id.toString();

    // 查 MongoDB 是否匹配该 userId + token
    const storedRecord = await findRefreshToken(userId, refreshToken);
    if (!storedRecord) {
      return res.status(401).json({ status: 'error', message: '刷新令牌不匹配，请重新登录' });
    }

    // 旧 token 删除（轮换）
    await deleteRefreshToken(userId);

    // 查用户以获取完整信息
    const user = await User.findById(userId);
    if (!user) {
      return res.status(401).json({ status: 'error', message: '用户不存在' });
    }

    const newAccessToken = generateAccessToken(user);
    const newRefreshToken = generateRefreshToken(user._id);
    await storeRefreshToken(userId, newRefreshToken);

    res.status(200).json({
      status: 'success',
      message: '令牌刷新成功',
      data: {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken
      }
    });
  } catch (error) {
    next(error);
  }
};

// 密码找回
exports.forgotPassword = async (req, res, next) => {
  try {
    const { phoneNumber, code, newPassword } = req.body;

    // 参数校验
    if (!phoneNumber || !code || !newPassword) {
      return res.status(400).json({ status: 'error', message: '缺少必要参数' });
    }

    // 查用户
    const user = await User.findOne({ phoneNumber });
    if (!user) {
      return res.status(404).json({ status: 'error', message: '手机号未注册' });
    }

    // 验证码验证逻辑复用 verificationCodes Map
    const record = await VerificationCodeModel.findOne({ phoneNumber });
    if (!record) {
      return res.status(400).json({ status: 'error', message: '验证码不存在或已失效，请重新获取' });
    }

    if (Date.now() > record.expiresAt.getTime()) {
      await VerificationCodeModel.deleteOne({ _id: record._id });
      return res.status(400).json({ status: 'error', message: '验证码已过期，请重新获取' });
    }

    if (record.attempts >= VERIFICATION_CODE_MAX_ATTEMPTS) {
      await VerificationCodeModel.deleteOne({ _id: record._id });
      return res.status(400).json({ status: 'error', message: '验证码错误次数过多，请重新获取' });
    }

    if (record.code !== code) {
      record.attempts += 1;
      await record.save();
      return res.status(400).json({ status: 'error', message: '验证码错误' });
    }

    // 验证通过，删除验证码
    await VerificationCodeModel.deleteOne({ _id: record._id });

    // 更新密码
    user.password = newPassword;
    await user.save();

    // 强制重新登录：清除该用户的所有 refresh token
    await deleteRefreshToken(user._id.toString());

    res.status(200).json({
      status: 'success',
      message: '密码重置成功，请重新登录'
    });
  } catch (error) {
    next(error);
  }
};