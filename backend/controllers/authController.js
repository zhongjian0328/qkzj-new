const User = require('../models/User');
const jwt = require('jsonwebtoken');

// JWT配置
const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

// 验证必要的环境变量
if (!JWT_SECRET) {
  throw new Error('JWT_SECRET environment variable is required');
}

// 生成JWT令牌
const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, phoneNumber: user.phoneNumber, roleType: user.roleType },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );
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
    const token = generateToken(user);
    
    res.status(201).json({
      status: 'success',
      message: '注册成功',
      data: {
        user,
        token
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
    const token = generateToken(user);
    
    res.status(200).json({
      status: 'success',
      message: '登录成功',
      data: {
        user,
        token
      }
    });
  } catch (error) {
    next(error);
  }
};

// 验证码存储（模块级内存Map，key=手机号，value={code, expiresAt, attempts}）
// 单实例部署下可用；多实例部署时应迁移至Redis等共享存储
const verificationCodes = new Map();
const VERIFICATION_CODE_TTL_MS = 5 * 60 * 1000; // 验证码有效期5分钟
const VERIFICATION_CODE_MAX_ATTEMPTS = 5; // 最大错误尝试次数

// 生成6位数字验证码（加密安全随机数）
const generateVerificationCode = () => {
  return require('crypto').randomInt(100000, 1000000).toString();
};

// 获取验证码（模拟实现）
exports.getVerificationCode = async (req, res, next) => {
  try {
    const { phoneNumber } = req.body;

    // 检查手机号是否已注册
    const existingUser = await User.findOne({ phoneNumber });
    if (existingUser) {
      return res.status(400).json({ status: 'error', message: '手机号已注册' });
    }

    // 模拟发送验证码（实际项目中应调用短信服务API）
    const verificationCode = generateVerificationCode();

    // 存储验证码到内存Map，设置5分钟过期，错误次数清零
    verificationCodes.set(phoneNumber, {
      code: verificationCode,
      expiresAt: Date.now() + VERIFICATION_CODE_TTL_MS,
      attempts: 0
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
    const record = verificationCodes.get(phoneNumber);
    if (!record) {
      return res.status(400).json({ status: 'error', message: '验证码不存在或已失效，请重新获取' });
    }

    // 检查是否过期
    if (Date.now() > record.expiresAt) {
      verificationCodes.delete(phoneNumber);
      return res.status(400).json({ status: 'error', message: '验证码已过期，请重新获取' });
    }

    // 检查错误尝试次数（上限5次，超过作废需重发）
    if (record.attempts >= VERIFICATION_CODE_MAX_ATTEMPTS) {
      verificationCodes.delete(phoneNumber);
      return res.status(400).json({ status: 'error', message: '验证码错误次数过多，请重新获取' });
    }

    // 比对验证码
    if (record.code !== code) {
      record.attempts += 1;
      return res.status(400).json({ status: 'error', message: '验证码错误' });
    }

    // 验证通过即删除作废（一次性使用）
    verificationCodes.delete(phoneNumber);

    res.status(200).json({
      status: 'success',
      message: '验证码验证成功'
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